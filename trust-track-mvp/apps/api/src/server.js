import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import { calculateSlaTargets } from './sla.js';

const app = express();
const port = Number(process.env.PORT || 4100);
const webOrigin = process.env.WEB_ORIGIN || 'http://localhost:5174';

app.use(helmet());
app.use(cors({ origin: webOrigin }));
app.use(express.json({ limit: '1mb' }));

const sourceTypes = [
  'EXTERNAL_PERSON',
  'AUTOMATED_SYSTEM',
  'INTERNAL_PERSON',
  'MILESTONE',
  'MANUAL'
];

const operationalCategories = [
  'DATA_MANAGEMENT',
  'REGULATORY_IRB',
  'IRT_DRUG_SUPPLY',
  'CENTRAL_LAB',
  'SAFETY',
  'MONITORING',
  'STUDY_STARTUP',
  'TRAINING',
  'PROTOCOL_AMENDMENT',
  'RECRUITMENT',
  'PARTICIPANT_VISIT_OPERATIONS',
  'VENDOR_SUPPORT',
  'FINANCE',
  'DOCUMENT_REQUEST',
  'GENERAL_STUDY_COMMUNICATION'
];

const studies = [
  {
    id: 'study-abc-101',
    protocol: 'ABC-101',
    title: 'ABC-101 Phase 2 Study',
    domains: ['acmetherapeutics.com', 'veeva.com', 'centralirb.org'],
    defaultOwner: 'Jane Smith'
  },
  {
    id: 'study-nova-22',
    protocol: 'NOVA-22',
    title: 'NOVA-22 Phase 3 Study',
    domains: ['examplecro.com', 'iwrsvendor.com', 'centrallab.com'],
    defaultOwner: 'Matt Jones'
  },
  {
    id: 'study-orbit-7',
    protocol: 'ORBIT-7',
    title: 'ORBIT-7 Observational Study',
    domains: ['sponsoroperations.com', 'edccloud.com'],
    defaultOwner: 'Jane Smith'
  }
];

const demoMessages = [
  {
    id: 'veeva-rejection',
    label: 'Veeva document rejection',
    from: 'notifications@veeva.com',
    subject: '[ABC-101] Document DOC-8831 rejected',
    body: 'The investigator CV document DOC-8831 was rejected. Please correct the expiration date and resubmit within three business days.'
  },
  {
    id: 'irt-supply',
    label: 'IRT low drug-supply alert',
    from: 'alerts@iwrsvendor.com',
    subject: '[NOVA-22] Low study drug inventory - Shipment IRT-552',
    body: 'Inventory has fallen below the minimum threshold. Confirm an emergency resupply request today.'
  },
  {
    id: 'irb-reminder',
    label: 'IRB continuing-review reminder',
    from: 'notices@centralirb.org',
    subject: '[ABC-101] Reminder: Continuing review IRB-2026-91 due',
    body: 'Continuing review IRB-2026-91 remains incomplete and is due in five business days.'
  },
  {
    id: 'lab-kits',
    label: 'Central laboratory kit alert',
    from: 'studyservices@centrallab.com',
    subject: '[NOVA-22] Laboratory kits KIT-882 expire soon',
    body: 'The current laboratory collection kits expire this month. Please request replacement kits.'
  },
  {
    id: 'edc-query',
    label: 'EDC query assignment',
    from: 'query-alerts@edccloud.com',
    subject: '[ORBIT-7] New EDC query QUERY-447 assigned',
    body: 'A new data clarification query QUERY-447 has been assigned to the site. Resolution is requested within five business days.'
  },
  {
    id: 'internal-review',
    label: 'Internal PI review request',
    from: 'jane@site-demo.org',
    subject: '[ABC-101] PI review needed for monitoring response',
    body: 'Please ask Dr. Lee to review the draft response before it is returned to the monitor tomorrow.'
  },
  {
    id: 'phi-example',
    label: 'Message with potential sensitive data',
    from: 'monitor@examplecro.com',
    subject: '[NOVA-22] Follow-up required',
    body: 'Please review subject SUBJ-1042. MRN: 774401 and DOB: 04/12/1978 were included in the source note.'
  },
  {
    id: 'duplicate-reminder',
    label: 'Duplicate Veeva reminder',
    from: 'notifications@veeva.com',
    subject: '[ABC-101] Reminder: Document DOC-8831 rejected',
    body: 'Second reminder: document DOC-8831 is still awaiting correction and resubmission.'
  }
];

const messageSchema = z.object({
  from: z.string().email(),
  to: z.string().optional(),
  subject: z.string().min(1).max(500),
  body: z.string().min(1).max(20000),
  receivedAt: z.coerce.date().optional()
});

const previewSchema = z.object({
  studyId: z.string().min(1),
  sourceType: z.enum(sourceTypes),
  category: z.enum(operationalCategories),
  sanitizedTitle: z.string().min(1).max(240),
  sanitizedSummary: z.string().max(2000).optional(),
  assignedUserId: z.string().min(1),
  receivedAt: z.coerce.date(),
  firstResponseMinutes: z.number().int().positive().default(480),
  resolutionMinutes: z.number().int().positive().default(1440),
  gmailMessageId: z.string().optional(),
  gmailThreadId: z.string().optional(),
  potentialSensitiveData: z.boolean().default(false)
});

let sequence = 1040;
let workItems = [];
let auditEvents = [];

function domainFromAddress(address) {
  return address.toLowerCase().split('@')[1] || '';
}

function findStudy(message) {
  const text = `${message.subject} ${message.body}`.toUpperCase();
  const protocolMatch = studies.find((study) => text.includes(study.protocol));
  if (protocolMatch) return protocolMatch;

  const senderDomain = domainFromAddress(message.from);
  return studies.find((study) => study.domains.includes(senderDomain)) || null;
}

function classifySource(message) {
  const domain = domainFromAddress(message.from);
  if (domain === 'site-demo.org') return 'INTERNAL_PERSON';

  const automatedSignals = ['notifications@', 'alerts@', 'notices@', 'query-alerts@'];
  if (automatedSignals.some((signal) => message.from.toLowerCase().startsWith(signal))) {
    return 'AUTOMATED_SYSTEM';
  }

  return 'EXTERNAL_PERSON';
}

function classifyCategory(message) {
  const text = `${message.subject} ${message.body}`.toLowerCase();
  if (/safety|sae|serious adverse/.test(text)) return 'SAFETY';
  if (/irt|iwrs|randomization|drug inventory|resupply/.test(text)) return 'IRT_DRUG_SUPPLY';
  if (/irb|continuing review|regulatory|document rejected|cv document/.test(text)) return 'REGULATORY_IRB';
  if (/edc|query|data clarification|crf/.test(text)) return 'DATA_MANAGEMENT';
  if (/laboratory|lab kit|sample|specimen/.test(text)) return 'CENTRAL_LAB';
  if (/monitor|monitoring|cra/.test(text)) return 'MONITORING';
  if (/training|certificate/.test(text)) return 'TRAINING';
  if (/invoice|payment|budget/.test(text)) return 'FINANCE';
  if (/amendment/.test(text)) return 'PROTOCOL_AMENDMENT';
  if (/document|upload|resubmit/.test(text)) return 'DOCUMENT_REQUEST';
  return 'GENERAL_STUDY_COMMUNICATION';
}

function detectSystem(message) {
  const domain = domainFromAddress(message.from);
  const text = `${message.from} ${message.subject}`.toLowerCase();
  if (text.includes('veeva')) return 'Veeva';
  if (text.includes('iwrs') || text.includes('irt')) return 'IRT / IVRS';
  if (text.includes('irb')) return 'IRB system';
  if (text.includes('edc')) return 'EDC system';
  if (text.includes('lab')) return 'Central laboratory';
  if (domain === 'site-demo.org') return 'Internal team';
  return domain || 'External sender';
}

function extractExternalReference(message) {
  const text = `${message.subject} ${message.body}`;
  const match = text.match(/\b(?:DOC|IRT|IRB|KIT|QUERY|TICKET|CASE|REQ)-\d+\b/i);
  return match?.[0]?.toUpperCase() || null;
}

function scanAndRedact(body) {
  const patterns = [
    { type: 'MRN', regex: /\bMRN\s*[:#-]?\s*[A-Za-z0-9-]{4,}\b/gi },
    { type: 'DOB', regex: /\bDOB\s*[:#-]?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi },
    { type: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
    { type: 'PHONE', regex: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g }
  ];

  const findings = [];
  let sanitizedBody = body;

  for (const pattern of patterns) {
    const matches = sanitizedBody.match(pattern.regex) || [];
    if (matches.length) findings.push({ type: pattern.type, count: matches.length });
    sanitizedBody = sanitizedBody.replace(pattern.regex, `[REDACTED ${pattern.type}]`);
  }

  return { sanitizedBody, findings, potentialSensitiveData: findings.length > 0 };
}

function normalizedSubject(subject) {
  return subject
    .toLowerCase()
    .replace(/\b(reminder|second notice|urgent|overdue)\s*:?\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isIgnoredMessage(message) {
  const text = `${message.subject} ${message.body}`.toLowerCase();
  return /out of office|automatic reply|delivery status notification|newsletter|no action required/.test(text);
}

function titleFor(category, message, sourceSystem) {
  const titles = {
    REGULATORY_IRB: 'Complete regulatory or IRB follow-up',
    IRT_DRUG_SUPPLY: 'Resolve IRT or study-drug supply alert',
    DATA_MANAGEMENT: 'Resolve assigned data query',
    CENTRAL_LAB: 'Resolve central laboratory request',
    MONITORING: 'Complete monitoring follow-up',
    SAFETY: 'Escalate safety communication for human review',
    TRAINING: 'Complete required training action',
    FINANCE: 'Complete study finance follow-up',
    PROTOCOL_AMENDMENT: 'Complete protocol amendment action',
    DOCUMENT_REQUEST: 'Complete requested document action',
    GENERAL_STUDY_COMMUNICATION: 'Review and respond to study communication'
  };

  const baseTitle = titles[category] || message.subject;
  return `${baseTitle} · ${sourceSystem}`;
}

function slaForCategory(category) {
  if (category === 'SAFETY') return { firstResponseMinutes: 60, resolutionMinutes: 480 };
  if (category === 'IRT_DRUG_SUPPLY') return { firstResponseMinutes: 240, resolutionMinutes: 480 };
  if (category === 'DATA_MANAGEMENT') return { firstResponseMinutes: 480, resolutionMinutes: 2400 };
  return { firstResponseMinutes: 480, resolutionMinutes: 1440 };
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

function processMessage(input) {
  const message = { ...input, receivedAt: input.receivedAt || new Date() };

  if (isIgnoredMessage(message)) {
    return { outcome: 'IGNORED', reason: 'Non-actionable automated or informational message' };
  }

  const study = findStudy(message);
  const sourceType = classifySource(message);
  const category = classifyCategory(message);
  const sourceSystem = detectSystem(message);
  const externalReference = extractExternalReference(message);
  const privacy = scanAndRedact(message.body);
  const senderDomain = domainFromAddress(message.from);
  const dedupeKey = externalReference
    ? `${sourceSystem}:${study?.protocol || 'UNMATCHED'}:${externalReference}`
    : `${senderDomain}:${study?.protocol || 'UNMATCHED'}:${normalizedSubject(message.subject)}`;

  const existing = workItems.find((item) => item.dedupeKey === dedupeKey && item.status !== 'COMPLETED');

  if (existing) {
    existing.reminderCount += 1;
    existing.lastMessageAt = message.receivedAt.toISOString();
    existing.sourceEventCount += 1;
    existing.latestSanitizedMessage = privacy.sanitizedBody;
    existing.potentialSensitiveData ||= privacy.potentialSensitiveData;
    existing.privacyFindings = [...existing.privacyFindings, ...privacy.findings];
    recordAudit('SOURCE_EVENT_LINKED', existing.id, {
      sourceSystem,
      externalReference,
      reminderCount: existing.reminderCount
    });
    return { outcome: 'UPDATED_EXISTING', workItem: existing };
  }

  const sla = slaForCategory(category);
  const targets = calculateSlaTargets({
    receivedAt: message.receivedAt,
    firstResponseMinutes: sla.firstResponseMinutes,
    resolutionMinutes: sla.resolutionMinutes
  });

  sequence += 1;
  const workItem = {
    id: `TT-${sequence}`,
    study: study?.protocol || 'UNMATCHED',
    studyId: study?.id || null,
    source: sourceSystem,
    sender: message.from,
    sourceType,
    category,
    title: titleFor(category, message, sourceSystem),
    sanitizedSubject: message.subject,
    sanitizedSummary: privacy.sanitizedBody.slice(0, 260),
    latestSanitizedMessage: privacy.sanitizedBody,
    owner: study?.defaultOwner || 'Unassigned',
    accountableOwner: study?.defaultOwner || 'Unassigned',
    status: privacy.potentialSensitiveData ? 'PENDING_SENSITIVE_DATA_REVIEW' : 'ASSIGNED',
    firstResponseDueAt: targets.firstResponseDueAt.toISOString(),
    resolutionDueAt: targets.resolutionDueAt.toISOString(),
    receivedAt: message.receivedAt.toISOString(),
    lastMessageAt: message.receivedAt.toISOString(),
    externalReference,
    dedupeKey,
    reminderCount: 0,
    sourceEventCount: 1,
    potentialSensitiveData: privacy.potentialSensitiveData,
    privacyFindings: privacy.findings,
    assignmentHistory: [
      {
        from: null,
        to: study?.defaultOwner || 'Unassigned',
        reason: 'Default study routing',
        occurredAt: new Date().toISOString()
      }
    ],
    gmailThreadUrl: '#demo-message'
  };

  workItems.unshift(workItem);
  recordAudit('WORK_ITEM_CREATED', workItem.id, {
    study: workItem.study,
    category,
    sourceType,
    sourceSystem,
    potentialSensitiveData: privacy.potentialSensitiveData
  });

  return { outcome: 'CREATED', workItem };
}

function seedDemo() {
  sequence = 1040;
  workItems = [];
  auditEvents = [];
  for (const sample of demoMessages.slice(0, 5)) {
    processMessage({
      from: sample.from,
      subject: sample.subject,
      body: sample.body,
      receivedAt: new Date(Date.now() - (workItems.length + 1) * 45 * 60000)
    });
  }
}

seedDemo();

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'trust-track-api',
    version: '0.2.0-demo',
    mode: 'DEMO_WITHOUT_GOOGLE_ADMIN_ACCESS',
    rawEmailStorageEnabled: false
  });
});

app.get('/api/config/taxonomy', (_request, response) => {
  response.json({ sourceTypes, operationalCategories, studies });
});

app.get('/api/demo/messages', (_request, response) => {
  response.json({ messages: demoMessages });
});

app.post('/api/demo/reset', (_request, response) => {
  seedDemo();
  response.json({ success: true, workItems });
});

app.post('/api/demo/ingest', (request, response) => {
  const parsed = messageSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      error: 'INVALID_MESSAGE',
      details: parsed.error.flatten()
    });
  }

  const result = processMessage(parsed.data);
  return response.status(result.outcome === 'CREATED' ? 201 : 200).json(result);
});

app.get('/api/work-items', (_request, response) => {
  response.json({ workItems });
});

app.get('/api/audit-events', (_request, response) => {
  response.json({ auditEvents });
});

app.post('/api/work-items/:id/reassign', (request, response) => {
  const parsed = z.object({
    assignedTo: z.string().min(1).max(120),
    reason: z.string().min(1).max(500).default('Internal delegation')
  }).safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ error: 'INVALID_REASSIGNMENT', details: parsed.error.flatten() });
  }

  const workItem = workItems.find((item) => item.id === request.params.id);
  if (!workItem) return response.status(404).json({ error: 'WORK_ITEM_NOT_FOUND' });

  const previousOwner = workItem.owner;
  workItem.owner = parsed.data.assignedTo;
  workItem.assignmentHistory.push({
    from: previousOwner,
    to: parsed.data.assignedTo,
    reason: parsed.data.reason,
    occurredAt: new Date().toISOString()
  });
  recordAudit('WORK_ITEM_REASSIGNED', workItem.id, {
    from: previousOwner,
    to: parsed.data.assignedTo,
    organizationalSlaReset: false
  });

  return response.json({ workItem });
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
      'CANCELLED'
    ])
  }).safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ error: 'INVALID_STATUS', details: parsed.error.flatten() });
  }

  const workItem = workItems.find((item) => item.id === request.params.id);
  if (!workItem) return response.status(404).json({ error: 'WORK_ITEM_NOT_FOUND' });

  const previousStatus = workItem.status;
  workItem.status = parsed.data.status;
  if (parsed.data.status === 'COMPLETED') workItem.resolvedAt = new Date().toISOString();
  recordAudit('WORK_ITEM_STATUS_CHANGED', workItem.id, {
    from: previousStatus,
    to: parsed.data.status
  });

  return response.json({ workItem });
});

app.post('/api/work-items/preview', (request, response) => {
  const parsed = previewSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      error: 'INVALID_WORK_ITEM',
      details: parsed.error.flatten()
    });
  }

  const input = parsed.data;
  const targets = calculateSlaTargets({
    receivedAt: input.receivedAt,
    firstResponseMinutes: input.firstResponseMinutes,
    resolutionMinutes: input.resolutionMinutes
  });

  return response.status(201).json({
    workItem: {
      id: `PREVIEW-${Date.now()}`,
      ...input,
      firstResponseDueAt: targets.firstResponseDueAt.toISOString(),
      resolutionDueAt: targets.resolutionDueAt.toISOString(),
      status: input.potentialSensitiveData ? 'PENDING_SENSITIVE_DATA_REVIEW' : 'NEW',
      rawEmailContentStored: false
    }
  });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
});

app.listen(port, () => {
  console.log(`Trust & Track API listening on http://localhost:${port}`);
});
