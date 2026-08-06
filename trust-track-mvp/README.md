# Trust & Track MVP

Trust & Track is an accountability layer for clinical trial site operations. It converts study-related communications into durable owned tasks, preserves delegation history, measures first reply and resolution, and gives site leadership team-level operational visibility.

## Proof mode first

The application can be demonstrated without access to a clinical site's Google Workspace environment.

Proof mode includes:

- Realistic Veeva, IRT/IVRS, IRB, EDC, central-laboratory, external-human, and internal-team scenarios
- Manual copy-and-paste ingestion
- A `source_event` → `task` model: many communications may update one durable task
- Strict deduplication by Gmail thread, external reference, or explicit reminder pattern inside a configured window
- Gmail message idempotency
- Deterministic regex parsing for automated source systems; no LLM routing
- Six categories: Data Query, Regulatory, Supply, Monitoring, Safety, and General
- One organizational task clock with separate `first_reply_at` and `resolved_at` milestones
- Ownership transfer without clock reset
- Contributor and approval-request architecture without internal SLA clocks
- Prohibited subject-data redaction and privacy review
- Coordinator and director views with team-level metrics
- Append-only audit-history demonstration

The proof build intentionally has no live Gmail credentials. After site approval, a Gmail polling adapter replaces the simulator while using the same ingestion and deduplication boundary.

## Load-bearing decisions

See [`docs/ARCHITECTURE_DECISIONS.md`](docs/ARCHITECTURE_DECISIONS.md).

The most important boundaries are:

- The eventual Google app is Internal user type inside the site's Workspace organization.
- There is no subject table or subject registry.
- One organizational clock exists per task.
- Gmail is polled every 60 seconds with an overlap window.
- Sent-mail polling detects replies from any Gmail client; replies are never required through Trust & Track.
- Automated notifications use regex configuration, never an LLM.
- Audit records are protected from update/delete by PostgreSQL triggers.

## Month-one pilot boundary

The controlled pilot is limited to:

- One Google Workspace organization
- One shared operational mailbox
- Two to four coordinators
- One director
- Three to five active studies
- Ten to fifteen manually configured automated source systems

Not included:

- Patient or subject registry
- CTMS, EDC, eSource, or eReg replacement
- Autonomous SOP/protocol interpretation
- AI-generated binding deadlines
- Electronic signatures
- Direct Veeva, IRT, IRB, EDC, or laboratory APIs
- Microsoft 365, Teams, or Google Chat ingestion
- Public multi-tenant Google distribution

## Local development

```bash
cd trust-track-mvp
cp .env.example .env
npm install
npm run db:generate
npm run dev
```

- Web dashboard: `http://localhost:5174`
- API: `http://localhost:4100`
- Health check: `http://localhost:4100/api/health`

Run architecture tests:

```bash
npm run test --workspace @trust-track/api
```

A PostgreSQL database is required before migrations and persistence are enabled. The current proof API keeps demo state in memory.

## Demonstration sequence

1. Reset the demo.
2. Process the Veeva document rejection.
3. Process the Veeva reminder in a new Gmail thread. It must update the same task by `DOC-8831`.
4. Process the new IRT low-supply alert.
5. Process the IRT reminder without an external reference. It may fold only because it has an explicit reminder marker and is inside the configured window.
6. Process the same non-reminder IRT alert again. It must create a new task rather than risk swallowing a genuine new shortage.
7. Process the sensitive-data scenario and verify subject reference, MRN, and DOB are redacted.
8. Transfer task ownership and verify the original clock start is unchanged.
9. Select **Detect Gmail reply** and verify `first_reply_at` is recorded while the task remains open.
10. Complete the task and verify `resolved_at` is recorded separately.
11. Open Audit History and review task creation, source-event linking, delegation, first reply, escalation, and completion.

## Architecture

```text
Proof: simulator or pasted communication
Production: Gmail API polling every 60 seconds, including Sent mail
                              ↓
                 Shared ingestion boundary
                              ↓
             Auto-reply filtering and redaction
                              ↓
        Source-system regex routing and study matching
                              ↓
 Strict dedup: thread → external ref → explicit reminder window
                              ↓
            Source events create or update one task
                              ↓
        One organizational clock + reply/resolution milestones
                              ↓
       PostgreSQL tasks, events, delegations, contributors, audit
                              ↓
               Coordinator and director dashboards
```

## Database notes

The Prisma schema is aligned to the architecture above. After generating the base Prisma migration, apply:

```text
packages/database/sql/002_architecture_guards.sql
```

That SQL adds:

- A partial unique index for open-task deduplication
- A partial unique Gmail-message idempotency index
- Contributor approval consistency
- Database triggers that reject `UPDATE` and `DELETE` on `audit_log`

## Validation status

The deterministic deduplication and Gmail polling modules have automated tests covering:

- External-reference extraction
- Broken regex safety
- Reminder normalization
- Gmail-thread matching
- Cross-thread Veeva reminder matching
- IRT explicit-reminder window matching
- Protection against swallowing new supply alerts
- Gmail message replay idempotency
- Auto-reply filtering
- Human triage for unroutable mail
- Reminder escalation without clock restart
- Poll overlap, Sent-mail inclusion, checkpoint safety, and non-overlapping workers

Production use still requires Google Workspace approval, BAA and hosting decisions, tested privacy controls, access-control testing, incident procedures, and a shadow pilot.
