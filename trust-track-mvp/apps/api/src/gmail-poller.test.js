import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createGmailPoller } from './gmail-poller.js';

test('poller includes sent mail and advances checkpoint after full success', async () => {
  const calls = [];
  let savedCheckpoint = null;

  const poller = createGmailPoller({
    mailbox: 'research@example.org',
    gmail: {
      listMessages: async (input) => {
        calls.push(input);
        return [{ id: 'm2' }, { id: 'm1' }];
      },
      getMessage: async ({ messageId }) => ({
        gmailMessageId: messageId,
        receivedAt: messageId === 'm1'
          ? '2026-08-06T13:00:00.000Z'
          : '2026-08-06T14:00:00.000Z'
      })
    },
    checkpointStore: {
      get: async () => ({ lastSuccessfulPollAt: '2026-08-06T12:00:00.000Z' }),
      set: async (_mailbox, checkpoint) => {
        savedCheckpoint = checkpoint;
      }
    },
    ingestMessage: async (message) => message.gmailMessageId,
    now: () => new Date('2026-08-06T15:00:00.000Z'),
    logger: { error() {} }
  });

  const result = await poller.pollOnce();

  assert.equal(calls[0].includeSent, true);
  assert.equal(calls[0].after.toISOString(), '2026-08-06T11:55:00.000Z');
  assert.deepEqual(result.results, ['m1', 'm2']);
  assert.equal(savedCheckpoint.lastSuccessfulPollAt, '2026-08-06T15:00:00.000Z');
});

test('failed ingestion does not advance the checkpoint', async () => {
  let checkpointWrites = 0;

  const poller = createGmailPoller({
    mailbox: 'research@example.org',
    gmail: {
      listMessages: async () => [{ id: 'm1' }],
      getMessage: async () => ({
        gmailMessageId: 'm1',
        receivedAt: '2026-08-06T13:00:00.000Z'
      })
    },
    checkpointStore: {
      get: async () => null,
      set: async () => {
        checkpointWrites += 1;
      }
    },
    ingestMessage: async () => {
      throw new Error('database unavailable');
    },
    now: () => new Date('2026-08-06T15:00:00.000Z'),
    logger: { error() {} }
  });

  await assert.rejects(() => poller.pollOnce(), /database unavailable/);
  assert.equal(checkpointWrites, 0);
});

test('overlapping timer calls do not run concurrently', async () => {
  let release;
  const wait = new Promise((resolve) => {
    release = resolve;
  });

  const poller = createGmailPoller({
    mailbox: 'research@example.org',
    gmail: {
      listMessages: async () => {
        await wait;
        return [];
      },
      getMessage: async () => null
    },
    checkpointStore: {
      get: async () => null,
      set: async () => {}
    },
    ingestMessage: async () => null,
    logger: { error() {} }
  });

  const first = poller.pollOnce();
  const second = await poller.pollOnce();
  assert.deepEqual(second, { skipped: true, reason: 'poll_already_running' });
  release();
  await first;
});
