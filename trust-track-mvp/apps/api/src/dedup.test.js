import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  extractExternalRef,
  notificationType,
  isReminder,
  computeDedupKey,
  routeEvent,
  applyUpdate
} from './dedup.js';

const VEEVA = {
  id: 'sys-veeva',
  name: 'Veeva Vault',
  sender_pattern: 'notifications@veeva.com',
  category: 'regulatory',
  action_required: true,
  external_ref_regex: 'Document ID:\\s*([A-Z0-9-]+)',
  reminder_regex: '^\\s*(re-?minder|reminder:|\\[reminder\\])',
  dedup_window_hours: 168,
  escalate_after_reminders: 2,
  default_owner_id: 'user-reg'
};

const IRT = {
  ...VEEVA,
  id: 'sys-irt',
  name: 'IRT',
  category: 'supply',
  external_ref_regex: null
};

const STUDY = {
  id: 'study-abc101',
  default_owner_id: 'user-jane'
};

function makeDb(tasks = [], seenMessageIds = []) {
  return {
    sourceEventExists: async (id) => seenMessageIds.includes(id),
    findOpenTaskByThread: async (threadId) =>
      tasks.find((task) => task.gmail_thread_id === threadId) ?? null,
    findOpenTaskByExternalRef: async (studyId, systemId, ref) =>
      tasks.find(
        (task) =>
          task.study_id === studyId &&
          task.source_system_id === systemId &&
          task.external_ref === ref
      ) ?? null,
    findOpenTaskByDedupKey: async (key) =>
      tasks.find((task) => task.dedup_key === key) ?? null
  };
}

test('pulls the document ID out of a Veeva body', () => {
  const body = 'Your submission was rejected.\nDocument ID: DOC-99812\nPlease correct.';
  assert.equal(
    extractExternalRef(body, VEEVA.external_ref_regex),
    'DOC-99812'
  );
});

test('a broken regex in config does not crash ingestion', () => {
  assert.equal(extractExternalRef('anything', '([unclosed'), null);
});

test('reminder and original collapse to the same notification type', () => {
  const original = notificationType(
    'Document Rejected - ABC-101',
    VEEVA.reminder_regex
  );
  const reminder = notificationType(
    'Reminder: Document Rejected - ABC-101',
    VEEVA.reminder_regex
  );
  assert.equal(original, reminder);
});

test('detects the reminder marker', () => {
  assert.ok(
    isReminder(
      'Reminder: Drug supply below threshold',
      IRT.reminder_regex
    )
  );
  assert.ok(
    !isReminder(
      'Drug supply below threshold',
      IRT.reminder_regex
    )
  );
});

test('a first Veeva rejection creates a task', async () => {
  const result = await routeEvent(
    {
      gmailMessageId: 'm1',
      gmailThreadId: 't1',
      subject: 'Document Rejected - ABC-101',
      body: 'Document ID: DOC-99812'
    },
    VEEVA,
    STUDY,
    makeDb()
  );

  assert.equal(result.action, 'create');
  assert.equal(result.externalRef, 'DOC-99812');
  assert.equal(result.category, 'regulatory');
  assert.equal(result.ownerId, 'user-reg');
  assert.equal(result.status, 'open');
});

test('a Veeva reminder in a new thread folds by document ID', async () => {
  const existing = [
    {
      id: 'task-1',
      gmail_thread_id: 't1',
      study_id: STUDY.id,
      source_system_id: VEEVA.id,
      external_ref: 'DOC-99812'
    }
  ];

  const result = await routeEvent(
    {
      gmailMessageId: 'm2',
      gmailThreadId: 't-different',
      subject: 'Reminder: Document Rejected - ABC-101',
      body: 'Document ID: DOC-99812'
    },
    VEEVA,
    STUDY,
    makeDb(existing)
  );

  assert.equal(result.action, 'update');
  assert.equal(result.strategy, 'external_ref');
  assert.equal(result.reminder, true);
});

test('Monday IRT alert and Wednesday reminder remain one task', async () => {
  const key = computeDedupKey({
    studyId: STUDY.id,
    sourceSystemId: IRT.id,
    externalRef: null,
    notifType: notificationType(
      'Drug supply below threshold - ABC-101',
      IRT.reminder_regex
    )
  });

  const existing = [
    {
      id: 'task-supply',
      gmail_thread_id: 't9',
      dedup_key: key
    }
  ];

  const result = await routeEvent(
    {
      gmailMessageId: 'm3',
      gmailThreadId: 't-other',
      subject: 'Reminder: Drug supply below threshold - ABC-101',
      body: ''
    },
    IRT,
    STUDY,
    makeDb(existing)
  );

  assert.equal(result.action, 'update');
  assert.equal(result.strategy, 'pattern_window');
});

test('a new supply alert without a reminder marker is never swallowed', async () => {
  const key = computeDedupKey({
    studyId: STUDY.id,
    sourceSystemId: IRT.id,
    externalRef: null,
    notifType: notificationType(
      'Drug supply below threshold - ABC-101',
      IRT.reminder_regex
    )
  });

  const existing = [
    {
      id: 'task-supply',
      gmail_thread_id: 't9',
      dedup_key: key
    }
  ];

  const result = await routeEvent(
    {
      gmailMessageId: 'm4',
      gmailThreadId: 't-new',
      subject: 'Drug supply below threshold - ABC-101',
      body: ''
    },
    IRT,
    STUDY,
    makeDb(existing)
  );

  assert.equal(result.action, 'create');
});

test('replaying the same Gmail message is a no-op', async () => {
  const result = await routeEvent(
    {
      gmailMessageId: 'm1',
      gmailThreadId: 't1',
      subject: 'Document Rejected'
    },
    VEEVA,
    STUDY,
    makeDb([], ['m1'])
  );

  assert.equal(result.action, 'ignore');
  assert.equal(result.reason, 'already_processed');
});

test('out-of-office never creates a task', async () => {
  const result = await routeEvent(
    {
      gmailMessageId: 'm5',
      subject: 'Out of Office: re your query',
      headers: { 'Auto-Submitted': 'auto-replied' }
    },
    null,
    STUDY,
    makeDb()
  );

  assert.equal(result.action, 'ignore');
  assert.equal(result.reason, 'auto_reply');
});

test('unroutable mail with no study goes to triage instead of a guess', async () => {
  const result = await routeEvent(
    {
      gmailMessageId: 'm6',
      gmailThreadId: 't7',
      subject: 'Question about the protocol'
    },
    null,
    null,
    makeDb()
  );

  assert.equal(result.action, 'create');
  assert.equal(result.status, 'triage');
  assert.equal(result.ownerId, null);
  assert.equal(result.dedupKey, null);
});

test('a protocol number alone does not auto-route human mail', async () => {
  const result = await routeEvent(
    {
      gmailMessageId: 'm7',
      gmailThreadId: 't8',
      subject: 'Question about ABC-101'
    },
    null,
    STUDY,
    makeDb()
  );

  assert.equal(result.action, 'create');
  assert.equal(result.status, 'triage');
  assert.equal(result.category, 'general');
  assert.equal(result.ownerId, null);
});

test('a reminder escalates but never restarts the clock', () => {
  const task = {
    reminder_count: 1,
    last_reminder_at: null,
    escalated_at: null,
    clock_started_at: '2026-08-03T13:00:00Z'
  };

  const patch = applyUpdate(
    task,
    { reminder: true },
    VEEVA,
    new Date('2026-08-05T13:00:00Z')
  );

  assert.equal(patch.reminder_count, 2);
  assert.ok(patch.escalated_at);
  assert.ok(!('clock_started_at' in patch));
});
