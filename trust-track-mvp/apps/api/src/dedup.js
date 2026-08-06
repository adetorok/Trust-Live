import { isAutoReply } from './is-auto-reply.js';

export const MATCH_STRATEGIES = [
  'gmail_thread',
  'external_ref',
  'pattern_window'
];

export function extractExternalRef(text, regexSource) {
  if (!regexSource || !text) return null;

  try {
    const match = new RegExp(regexSource, 'i').exec(text);
    return match?.[1]?.trim() ?? null;
  } catch {
    // A malformed admin-configured regex must not stop mailbox ingestion.
    return null;
  }
}

export function notificationType(subject = '', reminderRegex) {
  let normalized = subject;

  if (reminderRegex) {
    try {
      normalized = normalized.replace(new RegExp(reminderRegex, 'i'), '');
    } catch {
      // Continue with the original subject when configuration is invalid.
    }
  }

  return normalized
    .replace(/^\s*(re|fw|fwd)\s*:\s*/gi, '')
    .replace(/\b(reminder|urgent|action required|\d+(st|nd|rd|th) notice)\b/gi, '')
    .replace(/[A-Z0-9]{2,}-\d{2,}/gi, '')
    .replace(/\d+/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function isReminder(subject = '', reminderRegex) {
  if (!reminderRegex) return false;

  try {
    return new RegExp(reminderRegex, 'i').test(subject);
  } catch {
    return false;
  }
}

export function computeDedupKey({
  studyId,
  sourceSystemId,
  externalRef,
  notifType
}) {
  if (!studyId || !sourceSystemId) return null;
  if (externalRef) return `${studyId}:${sourceSystemId}:ref:${externalRef}`;
  if (notifType) return `${studyId}:${sourceSystemId}:type:${notifType}`;
  return null;
}

/**
 * Decide whether an incoming source event creates a durable task, updates one,
 * or is ignored. The database adapter supplies the actual lookups.
 */
export async function routeEvent(event, system, study, db) {
  if (
    event.gmailMessageId &&
    await db.sourceEventExists(event.gmailMessageId)
  ) {
    return { action: 'ignore', reason: 'already_processed' };
  }

  if (isAutoReply(event.headers ?? {}, event.subject ?? '')) {
    return { action: 'ignore', reason: 'auto_reply' };
  }

  if (system?.action_required === false) {
    return { action: 'ignore', reason: 'informational_only' };
  }

  const haystack = `${event.subject ?? ''}\n${event.body ?? ''}`;
  const externalRef = extractExternalRef(
    haystack,
    system?.external_ref_regex
  );
  const notifType = notificationType(
    event.subject,
    system?.reminder_regex
  );
  const reminder = isReminder(
    event.subject,
    system?.reminder_regex
  );

  if (event.gmailThreadId) {
    const byThread = await db.findOpenTaskByThread(event.gmailThreadId);
    if (byThread) {
      return {
        action: 'update',
        taskId: byThread.id,
        strategy: 'gmail_thread',
        reminder,
        externalRef
      };
    }
  }

  if (externalRef && study && system) {
    const byRef = await db.findOpenTaskByExternalRef(
      study.id,
      system.id,
      externalRef
    );

    if (byRef) {
      return {
        action: 'update',
        taskId: byRef.id,
        strategy: 'external_ref',
        reminder,
        externalRef
      };
    }
  }

  if (!externalRef && reminder && study && system) {
    const key = computeDedupKey({
      studyId: study.id,
      sourceSystemId: system.id,
      externalRef: null,
      notifType
    });

    const byPattern = key
      ? await db.findOpenTaskByDedupKey(
          key,
          system.dedup_window_hours,
          event.receivedAt
        )
      : null;

    if (byPattern) {
      return {
        action: 'update',
        taskId: byPattern.id,
        strategy: 'pattern_window',
        reminder,
        externalRef: null
      };
    }
  }

  const approvedRoute = Boolean(system && study);

  return {
    action: 'create',
    reminder: false,
    externalRef,
    notifType,
    dedupKey: computeDedupKey({
      studyId: study?.id,
      sourceSystemId: system?.id,
      externalRef,
      notifType
    }),
    category: approvedRoute ? system.category : 'general',
    ownerId: approvedRoute
      ? system.default_owner_id ?? study.default_owner_id ?? null
      : null,
    slaPolicyId: approvedRoute ? system.sla_policy_id ?? null : null,
    status: approvedRoute ? 'open' : 'triage'
  };
}

/**
 * Apply a reminder to an existing task. The organizational clock is deliberately
 * absent from the patch and therefore cannot be restarted by this operation.
 */
export function applyUpdate(task, { reminder }, system, now = new Date()) {
  const reminderCount = task.reminder_count + (reminder ? 1 : 0);
  const threshold = system?.escalate_after_reminders ?? null;

  return {
    reminder_count: reminderCount,
    last_reminder_at: reminder ? now : task.last_reminder_at,
    escalated_at:
      threshold && reminderCount >= threshold && !task.escalated_at
        ? now
        : task.escalated_at
  };
}
