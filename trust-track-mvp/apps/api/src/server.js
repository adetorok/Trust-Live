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

const sampleWorkItems = [
  {
    id: 'TT-1042',
    study: 'ABC-101',
    source: 'Veeva notification',
    sourceType: 'AUTOMATED_SYSTEM',
    category: 'REGULATORY_IRB',
    title: 'Correct rejected regulatory document',
    owner: 'Jane Smith',
    status: 'IN_PROGRESS',
    firstResponseDueAt: '2026-08-06T16:00:00.000Z',
    resolutionDueAt: '2026-08-10T21:00:00.000Z',
    gmailThreadUrl: '#'
  },
  {
    id: 'TT-1043',
    study: 'NOVA-22',
    source: 'Central laboratory',
    sourceType: 'EXTERNAL_PERSON',
    category: 'CENTRAL_LAB',
    title: 'Replace expiring laboratory kits',
    owner: 'Matt Jones',
    status: 'ASSIGNED',
    firstResponseDueAt: '2026-08-06T18:00:00.000Z',
    resolutionDueAt: '2026-08-11T18:00:00.000Z',
    gmailThreadUrl: '#'
  }
];

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

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'trust-track-api',
    version: '0.1.0',
    rawEmailStorageEnabled: process.env.STORE_RAW_EMAIL_CONTENT === 'true'
  });
});

app.get('/api/config/taxonomy', (_request, response) => {
  response.json({ sourceTypes, operationalCategories });
});

app.get('/api/work-items', (_request, response) => {
  response.json({ workItems: sampleWorkItems });
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
