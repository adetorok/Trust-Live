import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import { calculateSlaTargets } from './sla.js';
import {
  applyUpdate,
  routeEvent
} from './dedup.js';
import { isAutoReply } from './is-auto-reply.js';

const app = express();
const port = Number(process.env.PORT || 4100);
const webOrigin = process.env.WEB_ORIGIN || 'http://localhost:5174';

app.use(helmet());
app.use(cors({ origin: webOrigin }));
app.use(express.json({ limit: '1mb' }));

const sourceTypes = [
  'EXTERNAL_HUMAN',
  'AUTOMATED_SYSTEM',
  'INTERNAL',
  'MILESTONE',
  'MANUAL'
];

const operationalCategories = [
  'DATA_QUERY',
  'REGULATORY',
  'SUPPLY',
  'MONITORING',
  'SAFETY',
  'GENERAL'
];

const users = [
  { id: 'user-jane', name: 'Jane Smith', role: 'COORDINATOR' },
  { id: 'user-matt', name: 'Matt Jones', role: 'COORDINATOR' },
  { id: 'user-reg', name: 'Regulatory Coordinator', role: 'REGULATORY' },
  { id: 'user-pi', name: 'Dr. Lee', role: 'PRINCIPAL_INVESTIGATOR' },
  { id: 'user-director', name: 'Site Director', role: 'DIRECTOR' }
];

const studies = [
  {
    id: 'study-abc101',
    protocol: 'ABC-101',
    title: 'ABC-101 Phase 2 Study',
    default_owner_id: 'user-jane'
  },
  {
    id: 'study-nova22',
    protocol: 'NOVA-22',
    title: 'NOVA-22 Phase 3 Study',
    default_owner_id: 'user-matt'
  },
  {
    id: 'study-orbit7',
    protocol: 'ORBIT-7',
    title: 'ORBIT-7 Observational Study',
    default_owner_id: 'user-jane'
  }
];

const defaultReminderRegex =
  '^(?:\\[[^\\]]+\\]\\s*)?(?:re-?minder|reminder:|\\[reminder\\])';

const sourceSystems = [
  {
    id: 'sys-veeva',
    name: 'Veeva Vault',
    sender_pattern: 'notifications@veeva.com',
    category: 'regulatory',
    action_required: true,
    default_owner_id: 'user-reg',
    sla_policy_id: 'sla-regulatory',
    external_ref_regex: '\\b(DOC-\\d+)\\b',
    reminder_regex: defaultReminderRegex,
    dedup_window_hours: 168,
    escalate_after_reminders: 2
  },
  {
    id: 'sys-irt',
    name: 'IRT / IVRS',
    sender_pattern: 'alerts@iwrsvendor.com',
    category: 'supply',
    action_required: true,
    default_owner_id: null,
    sla_policy_id: 'sla-supply',
    external_ref_regex: null,
    reminder_regex: defaultReminderRegex,
    dedup_window_hours: 168,
    escalate_after_reminders: 2
  },
  {
    id: 'sys-irb',
    name: 'Central IRB',
    sender_pattern: 'notices@centralirb.org',
    category: 'regulatory',
    action_required: true,
    default_owner_id: 'user-reg',
    sla_policy_id: 'sla-regulatory',
    external_ref_regex: '\\b(IRB-\\d{4}-\\d+)\\b',
    reminder_regex: defaultReminderRegex,
    dedup_window_hours: 336,
    escalate_after_reminders: 2
  },
  {
    id: 'sys-edc',
    name: 'EDC',
    sender_pattern: 'query-alerts@edccloud.com',
    category: 'data_query',
    action_required: true,
    default_owner_id: null,
    sla_policy_id: 'sla-data-query',
    external_ref_regex: '\\b(QUERY-\\d+)\\b',
    reminder_regex: defaultReminderRegex,
    dedup_window_hours: 168,
    escalate_after_reminders: 2
  },
  {
    id: 'sys-lab',
    name: 'Central Laboratory',
    sender_pattern: 'studyservices@centrallab.com',
    category: 'supply',
    action_required: true,
    default_owner_id: null,
    sla_policy_id: 'sla-supply',
    external_ref_regex: '\\b(KIT-\\d+)\\b',
    reminder_regex: defaultReminderRegex,
    dedup_window_hours: 336,
    escalate_after_reminders: 2
  }
];

const slaPolicies = {
  'sla-data-query': {
    firstResponseMinutes: 480,
    resolutionMinutes: 2400
  },
  'sla-regulatory': {
    firstResponseMinutes: 480,
    resolutionMinutes: 1440
  },
  'sla-supply': {
    firstResponseMinutes: 240,
    resolutionMinutes: 480
  },
  'sla-monitoring': {
    firstResponseMinutes: 480,
    resolutionMinutes: 1440
  },
  'sla-safety': {
    firstResponseMinutes: 60,
    resolutionMinutes: 480
  },
  'sla-general': {
    firstResponseMinutes: 480,
    resolutionMinutes: 1440
  }
};

const demoMessages = [
  {
    id: 'veeva-rejection',
    label: 'Veeva document rejection',
    gmailMessageId: 'demo-veeva-1',
    gmailThreadId: 'thread-veeva-original',
    from: 'notifications@veeva.com',
    subject: '[ABC-101] Document DOC-8831 rejected',
    body: 'The investigator CV was rejected. Document ID: DOC-8831. Correct the expiration date and resubmit within three business days.'
  },
  {
    id: 'duplicate-reminder',
    label: 'Veeva reminder in a new thread',
    gmailMessageId: 'demo-veeva-2',
    gmailThreadId: 'thread-veeva-reminder',
    from: 'notifications@veeva.com',
    subject: '[ABC-101] Reminder: Document DOC-8831 rejected',
    body: 'Second reminder. Document ID: DOC-8831 is still awaiting correction and resubmission.'
  },
  {
    id: 'irt-supply',
    label: 'New IRT low-supply alert',
    gmailMessageId: 'demo-irt-1',
    gmailThreadId: 'thread-irt-1',
    from: 'alerts@iwrsvendor.com',
    subject: '[NOVA-22] Drug supply below threshold',
    body: 'Inventory has fallen below the minimum threshold. Confirm an emergency resupply request today.'
  },
  {
    id: 'irt-reminder',
    label: 'IRT reminder without reference number',
    gmailMessageId: 'demo-irt-2',
    gmailThreadId: 'thread-irt-2',
    from: 'alerts@iwrsvendor.com',
    subject: '[NOVA-22] Reminder: Drug supply below threshold',
    body: 'The low-inventory alert remains unresolved.'
  },
  {
    id: 'irb-reminder',
    label: 'IRB continuing-review notice',
    gmailMessageId: 'demo-irb-1',
    gmailThreadId: 'thread-irb-1',
    from: 'notices@centralirb.org',
    subject: '[ABC-101] Continuing review IRB-2026-91 due',
    body: 'Continuing review IRB-2026-91 remains incomplete and is due in five business days.'
  },
  {
    id: 'lab-kits',
    label: 'Central laboratory kit alert',
    gmailMessageId: 'demo-lab-1',
    gmailThreadId: 'thread-lab-1',
    from: 'studyservices@centrallab.com',
    subject: '[NOVA-22] Laboratory kits KIT-882 expire soon',
    body: 'The current laboratory collection kits expire this month. Please request replacement kits.'
  },
  {
    id: 'edc-query',
    label: 'EDC query assignment',
    gmailMessageId: 'demo-edc-1',
    gmailThreadId: 'thread-edc-1',
    from: 'query-alerts@edccloud.com',
    subject: '[ORBIT-7] New EDC query QUERY-447 assigned',
    body: 'A new data clarification query QUERY-447 has been assigned. Resolution is requested within five business days.'
  },
  {
    id: 'internal-review',
    label: 'Internal PI contributor request',
    gmailMessageId: 'demo-internal-1',
    gmailThreadId: 'thread-internal-1',
    from: 'jane@site-demo.org',
    subject: '[ABC-101] PI review needed for monitoring response',
    body: 'Please ask Dr. Lee to review the draft response before it is returned to the monitor tomorrow.'
  },
  {
    id: 'phi-example',
    label: 'Message containing prohibited subject data',
    gmailMessageId: 'demo-privacy-1',
    gmailThreadId: 'thread-privacy-1',
    from: 'monitor@examplecro.com',
    subject: '[NOVA-22] Follow-up required',
    body: 'Please review subject SUBJ-1042. MRN: 774401 and DOB: 04/12/1978 were included in the source note.'
  },
  {
    id: 'out-of-office',
    label: 'Out-of-office reply that must be ignored',
    gmailMessageId: 'demo-ooo-1',
    gmailThreadId: 'thread-ooo-1',
    from: 'monitor@examplecro.com',
    subject: 'Out of Office: ABC-101 follow-up',
    body: 'I am away from the office.',
    headers: { 'Auto-Submitted': 'auto-replied' }
  }
];

const messageSchema = z.object({
  gmailMessageId: z.string().min(1).optional(),
  gmailThreadId: z.string().min(1).optional(),
  rfcMessageId: z.string().optional(),
  from: z.string().email(),
  to: z.string().optional(),
  subject: z.string().default(''),
  body: z.string().default(''),
  headers: z.record(z.string(), z.string()).optional(),
  direction: z.enum(['INBOUND', 'OUTBOUND', 'INTERNAL']).default('INBOUND'),
  receivedAt: z.coerce.date().optional()
});

let sequence = 1040;
let eventSequence = 0;
let contributorSequence = 0;
let workItems = [];
let sourceEvents = [];
let auditEvents = [];

function userName(userId) {
  return users.find((user) => user.id === userId)?.name || 'Unassigned';
}

function domainFromAddress(address = '') {
  return address.toLowerCase().split('@')[1] || '';
}

function findStudy(message) {
  const text = `${message.subject ?? ''} ${message.body ?? ''}`.toUpperCase();
  return studies.find((study) => text.includes(study.protocol)) || null;
}

function findSourceSystem(message) {
  const from = message.from.toLowerCase();
  return sourceSystems.find((system) => {
    const pattern = system.sender_pattern.toLowerCase();
    return pattern.includes('@')
      ? from === pattern
      : domainFromAddress(from) === pattern;
  }) || null;
}

function sourceKindFor(message, system) {
  if (system) return 'AUTOMATED_SYSTEM';
  if (domainFromAddress(message.from) === 'site-demo.org') return 'INTERNAL';
  return 'EXTERNAL_HUMAN';
}

function scanAndRedact(text = '') {
  const patterns = [
    {
      type: 'SUBJECT_REFERENCE',
      regex: /\b(?:SUBJ(?:ECT)?)[\s:#-]*[A-Z0-9-]{3,}\b/gi
    },
    {
      type: 'MRN',
      regex: /\bMRN\s*[:#-]?\s*[A-Za-z0-9-]{4,}\b/gi
    },
    {
      type: 'DOB',
      regex: /\bDOB\s*[:#-]?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi
    },
    {
      type: 'SSN',
      regex: /\b\d{3}-\d{2}-\d{4}\b/g
    },
    {
      type: 'PHONE',
      regex: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g
    }
  ];

  const findings = [];
  let sanitizedBody = text;

  for (const pattern of patterns) {
    const matches = sanitizedBody.match(pattern.regex) || [];
    if (matches.length) {
      findings.push({ type: pattern.type, count: matches.length });
    }
    sanitizedBody = sanitizedBody.replace(
      pattern.regex,
      `[REDACTED ${pattern.type}]`
    );
  }

  return {
    sanitizedBody,
    findings,
    potentialSensitiveData: findings.length > 0
  };
}

function categoryToApi(category) {
  return String(category || 'general').toUpperCase();
}

function titleFor(category, sourceName) {
  const titles = {
    DATA_QUERY: 'Resolve assigned data query',
    REGULATORY: 'Complete regulatory follow-up',
    SUPPLY: 'Resolve study supply or laboratory alert',
    MONITORING: 'Complete monitoring follow-up',
    SAFETY: 'Escalate safety communication for human review',
    GENERAL: 'Review and respond to study communication'
  };
  return `${titles[category] || titles.GENERAL} · ${sourceName}`;
}

function policyFor(route, category) {
  if (route.slaPolicyId && slaPolicies[route.slaPolicyId]) {
    return slaPolicies[route.slaPolicyId];
  }
  return slaPolicies[`sla-${category.toLowerCase().replaceAll('_', '-')}`]
    || slaPolicies['sla-general'];
}

function isOpenTask(task) {
  return !['COMPLETED', 'CLOSED_NO_ACTION', 'CANCELLED'].includes(task.status);
}

function recordAudit(eventType, entityId, details = {}) {
  auditEvents.unshift({
    id: `AUD-${auditEvents.length + 1}`,
    eventType,
    entityId,
    details,
    occurredAt: new Date().toISOString()
  });
}

function appendSourceEvent({
  task,
  message,
  system,
  route,
  privacy,
  createdTask,
  direction = 'INBOUND'
}) {
  eventSequence += 1;
  const event = {
    id: `EVT-${eventSequence}`,
    taskId: task.id,
    sourceSystemId: system?.id || null,
    kind: sourceKindFor(message, system),
    direction,
    gmailMessageId: message.gmailMessageId || null,
    gmailThreadId: message.gmailThreadId || null,
    rfcMessageId: message.rfcMessageId || null,
    fromAddress: message.from,
    sanitizedSubject: message.subject,
    sanitizedBody: privacy.sanitizedBody,
    externalRef: route?.externalRef || null,
    notificationType: route?.notifType || null,
    isReminder: Boolean(route?.reminder),
    createdTask,
    privacyReviewRequired: privacy.potentialSensitiveData,
    privacyFlags: privacy.findings,
    receivedAt: message.receivedAt.toISOString()
  };
  sourceEvents.push(event);
  return event;
}

const memoryDb = {
  sourceEventExists: async (gmailMessageId) =>
    sourceEvents.some((event) => event.gmailMessageId === gmailMessageId),

  findOpenTaskByThread: async (gmailThreadId) => {
    const event = [...sourceEvents]
      .reverse()
      .find((item) => item.gmailThreadId === gmailThreadId);
    if (!event) return null;
    return workItems.find(
      (task) => task.id === event.taskId && isOpenTask(task)
    ) || null;
  },

  findOpenTaskByExternalRef: async (studyId, sourceSystemId, externalRef) =>
    workItems.find(
      (task) =>
        isOpenTask(task) &&
        task.studyId === studyId &&
        task.sourceSystemId === sourceSystemId &&
        task.externalReference === externalRef
    ) || null,

  findOpenTaskByDedupKey: async (dedupKey, windowHours, receivedAt) => {
    const cutoff = new Date(receivedAt).getTime() - windowHours * 60 * 60_000;
    return workItems.find((task) => {
      if (!isOpenTask(task) || task.dedupKey !== dedupKey) return false;
      const latest = sourceEvents
        .filter((event) => event.taskId === task.id)
        .reduce(
          (max, event) => Math.max(max, new Date(event.receivedAt).getTime()),
          0
        );
      return latest >= cutoff;
    }) || null;
  }
};

async function processOutboundMessage(message) {
  if (
    message.gmailMessageId &&
    await memoryDb.sourceEventExists(message.gmailMessageId)
  ) {
    return { outcome: 'IGNORED', reason: 'already_processed' };
  }

  if (isAutoReply(message.headers ?? {}, message.subject ?? '')) {
    return { outcome: 'IGNORED', reason: 'auto_reply' };
  }

  if (!message.gmailThreadId) {
    return { outcome: 'IGNORED', reason: 'outbound_message_not_linked_to_task' };
  }

  const task = await memoryDb.findOpenTaskByThread(message.gmailThreadId);
  if (!task) {
    return { outcome: 'IGNORED', reason: 'outbound_thread_not_tracked' };
  }

  const privacy = scanAndRedact(message.body);
  appendSourceEvent({
    task,
    message,
    system: null,
    route: null,
    privacy,
    createdTask: false,
    direction: 'OUTBOUND'
  });

  if (!task.firstReplyAt) {
    task.firstReplyAt = message.receivedAt.toISOString();
    recordAudit('FIRST_REPLY_RECORDED', task.id, {
      source: 'mailbox_poll',
      organizationalClockReset: false
    });
  }

  task.sourceEventCount += 1;
  task.lastMessageAt = message.receivedAt.toISOString();
  return { outcome: 'FIRST_REPLY_RECORDED', workItem: task };
}

async function processInboundMessage(input) {
  const message = {
    ...input,
    gmailMessageId: input.gmailMessageId || `demo-${Date.now()}-${eventSequence + 1}`,
    receivedAt: input.receivedAt || new Date()
  };

  if (message.direction === 'OUTBOUND') {
    return processOutboundMessage(message);
  }

  const study = findStudy(message);
  const system = findSourceSystem(message);
  const route = await routeEvent(message, system, study, memoryDb);

  if (route.action === 'ignore') {
    return { outcome: 'IGNORED', reason: route.reason };
  }

  const privacy = scanAndRedact(message.body);

  if (route.action === 'update') {
    const task = workItems.find((item) => item.id === route.taskId);
    if (!task) {
      throw new Error('Deduplication selected a missing task');
    }

    const patch = applyUpdate(
      {
        reminder_count: task.reminderCount,
        last_reminder_at: task.lastReminderAt,
        escalated_at: task.escalatedAt,
        clock_started_at: task.clockStartedAt
      },
      { reminder: route.reminder },
      system,
      message.receivedAt
    );

    task.reminderCount = patch.reminder_count;
    task.lastReminderAt = patch.last_reminder_at?.toISOString?.()
      || patch.last_reminder_at
      || null;
    task.escalatedAt = patch.escalated_at?.toISOString?.()
      || patch.escalated_at
      || null;
    task.lastMessageAt = message.receivedAt.toISOString();
    task.sourceEventCount += 1;
    task.latestSanitizedMessage = privacy.sanitizedBody;
    task.potentialSensitiveData ||= privacy.potentialSensitiveData;
    task.privacyFindings = [
      ...task.privacyFindings,
      ...privacy.findings
    ];

    appendSourceEvent({
      task,
      message,
      system,
      route,
      privacy,
      createdTask: false
    });

    recordAudit('SOURCE_EVENT_LINKED', task.id, {
      strategy: route.strategy,
      reminder: route.reminder,
      reminderCount: task.reminderCount,
      organizationalClockReset: false
    });

    if (task.escalatedAt) {
      recordAudit('TASK_ESCALATED', task.id, {
        reminderCount: task.reminderCount,
        escalatedTo: 'Site Director'
      });
    }

    return { outcome: 'UPDATED_EXISTING', workItem: task };
  }

  const category = categoryToApi(route.category);
  const policy = policyFor(route, category);
  const targets = calculateSlaTargets({
    receivedAt: message.receivedAt,
    firstResponseMinutes: policy.firstResponseMinutes,
    resolutionMinutes: policy.resolutionMinutes
  });

  sequence += 1;
  const ownerId = route.ownerId;
  const owner = userName(ownerId);
  const sourceName = system?.name || domainFromAddress(message.from) || 'Manual triage';
  const status = privacy.potentialSensitiveData
    ? 'PENDING_SENSITIVE_DATA_REVIEW'
    : route.status === 'triage'
      ? 'TRIAGE'
      : 'ASSIGNED';

  const task = {
    id: `TT-${sequence}`,
    study: study?.protocol || 'UNMATCHED',
    studyId: study?.id || null,
    sourceSystemId: system?.id || null,
    source: sourceName,
    sender: message.from,
    sourceType: sourceKindFor(message, system),
    category,
    title: titleFor(category, sourceName),
    sanitizedSubject: message.subject,
    sanitizedSummary: privacy.sanitizedBody.slice(0, 260),
    latestSanitizedMessage: privacy.sanitizedBody,
    restrictedReference: null,
    ownerId,
    owner,
    accountableOwner: owner,
    status,
    clockStartedAt: message.receivedAt.toISOString(),
    firstResponseDueAt: targets.firstResponseDueAt.toISOString(),
    resolutionDueAt: targets.resolutionDueAt.toISOString(),
    firstReplyAt: null,
    resolvedAt: null,
    pausedAt: null,
    totalPausedMinutes: 0,
    breachedAt: null,
    receivedAt: message.receivedAt.toISOString(),
    lastMessageAt: message.receivedAt.toISOString(),
    externalReference: route.externalRef,
    dedupKey: route.dedupKey,
    reminderCount: 0,
    lastReminderAt: null,
    escalatedAt: null,
    sourceEventCount: 1,
    potentialSensitiveData: privacy.potentialSensitiveData,
    privacyFindings: privacy.findings,
    assignmentHistory: [
      {
        from: null,
        to: owner,
        reason: status === 'TRIAGE'
          ? 'Unroutable communication sent to triage'
          : 'Deterministic system and study routing',
        occurredAt: new Date().toISOString()
      }
    ],
    contributorRequests: [],
    gmailThreadUrl: '#demo-message'
  };

  workItems.unshift(task);
  appendSourceEvent({
    task,
    message,
    system,
    route,
    privacy,
    createdTask: true
  });

  recordAudit('TASK_CREATED', task.id, {
    study: task.study,
    sourceSystem: sourceName,
    category,
    status,
    dedupKey: task.dedupKey,
    oneOrganizationalClock: true
  });

  return { outcome: 'CREATED', workItem: task };
}

async function seedDemo() {
  sequence = 1040;
  eventSequence = 0;
  contributorSequence = 0;
  workItems = [];
  sourceEvents = [];
  auditEvents = [];

  for (const sample of demoMessages.slice(4, 7)) {
    await processInboundMessage({
      ...sample,
      receivedAt: new Date(
        Date.now() - (workItems.length + 1) * 45 * 60_000
      ),
      direction: 'INBOUND'
    });
  }
}

await seedDemo();

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'trust-track-api',
    version: '0.3.0-architecture',
    mode: 'PROOF_WITHOUT_GOOGLE_ADMIN_ACCESS',
    gmailConnector: 'POLLING_60_SECONDS_PLANNED',
    rawEmailStorageEnabled: false,
    subjectRegistryEnabled: false,
    organizationalClocksPerTask: 1,
    categories: operationalCategories.length
  });
});

app.get('/api/config/taxonomy', (_request, response) => {
  response.json({
    sourceTypes,
    operationalCategories,
    studies,
    sourceSystems
  });
});

app.get('/api/demo/messages', (_request, response) => {
  response.json({ messages: demoMessages });
});

app.post('/api/demo/reset', async (_request, response) => {
  await seedDemo();
  response.json({ success: true, workItems });
});

app.post('/api/demo/ingest', async (request, response, next) => {
  try {
    const parsed = messageSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({
        error: 'INVALID_MESSAGE',
        details: parsed.error.flatten()
      });
    }

    const sample = demoMessages.find(
      (message) =>
        message.from === parsed.data.from &&
        message.subject === parsed.data.subject &&
        message.body === parsed.data.body
    );

    const result = await processInboundMessage({
      ...sample,
      ...parsed.data,
      receivedAt: parsed.data.receivedAt || new Date()
    });

    return response.status(result.outcome === 'CREATED' ? 201 : 200).json(result);
  } catch (error) {
    return next(error);
  }
});

app.get('/api/work-items', (_request, response) => {
  response.json({ workItems });
});

app.get('/api/source-events', (_request, response) => {
  response.json({ sourceEvents });
});

app.get('/api/audit-events', (_request, response) => {
  response.json({ auditEvents });
});

app.post('/api/work-items/:id/reassign', (request, response) => {
  const parsed = z.object({
    assignedTo: z.string().min(1).max(120),
    reason: z.string().min(1).max(500).default('Ownership transfer')
  }).safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      error: 'INVALID_REASSIGNMENT',
      details: parsed.error.flatten()
    });
  }

  const task = workItems.find((item) => item.id === request.params.id);
  if (!task) {
    return response.status(404).json({ error: 'WORK_ITEM_NOT_FOUND' });
  }

  const newOwner = users.find((user) => user.name === parsed.data.assignedTo);
  if (!newOwner) {
    return response.status(400).json({ error: 'UNKNOWN_OWNER' });
  }

  const previousOwner = task.owner;
  task.ownerId = newOwner.id;
  task.owner = newOwner.name;
  task.accountableOwner = newOwner.name;
  task.assignmentHistory.push({
    from: previousOwner,
    to: newOwner.name,
    reason: parsed.data.reason,
    occurredAt: new Date().toISOString()
  });

  recordAudit('TASK_DELEGATED', task.id, {
    from: previousOwner,
    to: newOwner.name,
    reason: parsed.data.reason,
    organizationalClockReset: false,
    clockStartedAt: task.clockStartedAt
  });

  return response.json({ workItem: task });
});

app.post('/api/work-items/:id/contributors', (request, response) => {
  const parsed = z.object({
    requestedOf: z.string().min(1).max(120),
    question: z.string().min(1).max(2000),
    neededBy: z.coerce.date().optional(),
    isApproval: z.boolean().default(false)
  }).safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      error: 'INVALID_CONTRIBUTOR_REQUEST',
      details: parsed.error.flatten()
    });
  }

  const task = workItems.find((item) => item.id === request.params.id);
  if (!task) {
    return response.status(404).json({ error: 'WORK_ITEM_NOT_FOUND' });
  }

  const contributor = users.find(
    (user) => user.name === parsed.data.requestedOf
  );
  if (!contributor) {
    return response.status(400).json({ error: 'UNKNOWN_CONTRIBUTOR' });
  }

  contributorSequence += 1;
  const contributorRequest = {
    id: `CON-${contributorSequence}`,
    requestedBy: task.owner,
    requestedOf: contributor.name,
    question: parsed.data.question,
    neededBy: parsed.data.neededBy?.toISOString() || null,
    respondedAt: null,
    responseNote: null,
    isApproval: parsed.data.isApproval,
    approved: null,
    createdAt: new Date().toISOString(),
    isSla: false
  };

  task.contributorRequests.push(contributorRequest);
  recordAudit('CONTRIBUTOR_REQUEST_CREATED', task.id, {
    contributor: contributor.name,
    isApproval: contributorRequest.isApproval,
    organizationalOwner: task.owner,
    organizationalClockReset: false
  });

  return response.status(201).json({ contributorRequest, workItem: task });
});

app.post('/api/work-items/:id/simulate-mailbox-reply', async (request, response, next) => {
  try {
    const task = workItems.find((item) => item.id === request.params.id);
    if (!task) {
      return response.status(404).json({ error: 'WORK_ITEM_NOT_FOUND' });
    }

    const firstEvent = sourceEvents.find((event) => event.taskId === task.id);
    const message = {
      gmailMessageId: `demo-outbound-${Date.now()}`,
      gmailThreadId: firstEvent?.gmailThreadId,
      from: 'coordinator@site-demo.org',
      subject: `Re: ${task.sanitizedSubject}`,
      body: 'A human coordinator reply was detected in the Sent mailbox.',
      headers: {},
      direction: 'OUTBOUND',
      receivedAt: new Date()
    };

    const result = await processOutboundMessage(message);
    return response.json(result);
  } catch (error) {
    return next(error);
  }
});

app.post('/api/work-items/:id/status', (request, response) => {
  const parsed = z.object({
    status: z.enum([
      'ASSIGNED',
      'IN_PROGRESS',
      'WAITING_EXTERNAL',
      'WAITING_INTERNAL',
      'PENDING_REVIEW',
      'PENDING_SENSITIVE_DATA_REVIEW',
      'COMPLETED',
      'CLOSED_NO_ACTION',
      'CANCELLED'
    ])
  }).safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      error: 'INVALID_STATUS',
      details: parsed.error.flatten()
    });
  }

  const task = workItems.find((item) => item.id === request.params.id);
  if (!task) {
    return response.status(404).json({ error: 'WORK_ITEM_NOT_FOUND' });
  }

  const now = new Date();
  const previousStatus = task.status;
  const leavingPause = task.pausedAt &&
    !['WAITING_EXTERNAL', 'WAITING_INTERNAL'].includes(parsed.data.status);

  if (leavingPause) {
    const pausedMinutes = Math.max(
      0,
      Math.round((now.getTime() - new Date(task.pausedAt).getTime()) / 60_000)
    );
    task.totalPausedMinutes += pausedMinutes;
    task.firstResponseDueAt = new Date(
      new Date(task.firstResponseDueAt).getTime() + pausedMinutes * 60_000
    ).toISOString();
    task.resolutionDueAt = new Date(
      new Date(task.resolutionDueAt).getTime() + pausedMinutes * 60_000
    ).toISOString();
    task.pausedAt = null;
  }

  if (
    ['WAITING_EXTERNAL', 'WAITING_INTERNAL'].includes(parsed.data.status) &&
    !task.pausedAt
  ) {
    task.pausedAt = now.toISOString();
  }

  task.status = parsed.data.status;
  if (['COMPLETED', 'CLOSED_NO_ACTION'].includes(parsed.data.status)) {
    task.resolvedAt = now.toISOString();
  }

  recordAudit('TASK_STATUS_CHANGED', task.id, {
    from: previousStatus,
    to: parsed.data.status,
    totalPausedMinutes: task.totalPausedMinutes,
    oneOrganizationalClock: true
  });

  return response.json({ workItem: task });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
});

app.listen(port, () => {
  console.log(`Trust & Track API listening on http://localhost:${port}`);
});
