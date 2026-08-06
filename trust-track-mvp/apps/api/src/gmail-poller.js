export const DEFAULT_POLL_INTERVAL_MS = 60_000;
export const DEFAULT_OVERLAP_MS = 5 * 60_000;

function asDate(value, fallback) {
  const date = value ? new Date(value) : new Date(fallback);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid Gmail polling checkpoint');
  }
  return date;
}

/**
 * Poll Gmail instead of relying on expiring Watch subscriptions.
 *
 * The supplied Gmail adapter must implement:
 *   listMessages({ mailbox, after, includeSent }) -> [{ id }]
 *   getMessage({ mailbox, messageId }) -> normalized message
 *
 * The checkpoint store must implement:
 *   get(mailbox) -> { lastSuccessfulPollAt } | null
 *   set(mailbox, checkpoint)
 *
 * `ingestMessage` must be idempotent by Gmail message ID. The poller intentionally
 * overlaps time windows so late indexing and retries do not create data loss.
 */
export function createGmailPoller({
  gmail,
  mailbox,
  checkpointStore,
  ingestMessage,
  intervalMs = DEFAULT_POLL_INTERVAL_MS,
  overlapMs = DEFAULT_OVERLAP_MS,
  initialLookbackMs = 24 * 60 * 60_000,
  now = () => new Date(),
  logger = console
}) {
  if (!gmail || !mailbox || !checkpointStore || !ingestMessage) {
    throw new Error('Gmail poller requires gmail, mailbox, checkpointStore, and ingestMessage');
  }

  let timer = null;
  let running = false;

  async function pollOnce() {
    if (running) {
      return { skipped: true, reason: 'poll_already_running' };
    }

    running = true;
    const pollStartedAt = now();

    try {
      const checkpoint = await checkpointStore.get(mailbox);
      const fallbackStart = pollStartedAt.getTime() - initialLookbackMs;
      const lastSuccessful = asDate(
        checkpoint?.lastSuccessfulPollAt,
        fallbackStart
      );
      const after = new Date(lastSuccessful.getTime() - overlapMs);

      const listed = await gmail.listMessages({
        mailbox,
        after,
        includeSent: true
      });

      const normalized = [];
      for (const item of listed ?? []) {
        const message = await gmail.getMessage({
          mailbox,
          messageId: item.id
        });
        normalized.push(message);
      }

      normalized.sort(
        (a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
      );

      const results = [];
      for (const message of normalized) {
        results.push(await ingestMessage(message));
      }

      // Advance only after the complete batch succeeds. A failure leaves the old
      // checkpoint in place so the next overlapping poll replays safely.
      await checkpointStore.set(mailbox, {
        lastSuccessfulPollAt: pollStartedAt.toISOString(),
        processedCount: normalized.length
      });

      return {
        skipped: false,
        processedCount: normalized.length,
        results,
        after: after.toISOString(),
        checkpoint: pollStartedAt.toISOString()
      };
    } catch (error) {
      logger.error?.('Gmail poll failed', {
        mailbox,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    } finally {
      running = false;
    }
  }

  function start() {
    if (timer) return;
    timer = setInterval(() => {
      pollOnce().catch(() => {
        // Error was logged in pollOnce. Keep future polling alive.
      });
    }, intervalMs);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  return {
    pollOnce,
    start,
    stop,
    isRunning: () => running
  };
}
