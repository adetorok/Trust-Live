# Trust & Track MVP

Trust & Track is the accountability layer for clinical trial site operations. It converts actionable study communications into owned work items, tracks response and resolution SLAs, preserves delegation history, and gives site leadership operational visibility.

## Proof mode first

The application can now be demonstrated without access to a clinical site's live Google Workspace environment.

Proof mode includes:

- A realistic inbox simulator for sponsor/CRO, Veeva, IRT/IVRS, IRB, EDC, central-laboratory, and internal-team communications
- Manual copy-and-paste communication ingestion
- Deterministic protocol/domain/category routing
- Business-hours first-response and resolution targets
- Reminder deduplication that updates an existing work item instead of creating another task
- Potential-sensitive-data detection and redaction before operational processing
- Accountable-owner versus current-assignee tracking
- Reassignment without resetting the organizational SLA
- Coordinator and director views
- Append-only audit-event demonstration

This mode is intended to prove the workflow with site leadership before requesting Google Workspace administrator access. Gmail Watch and Pub/Sub use the same ingestion boundary later; the proof-mode message source is simply replaced by the live Gmail adapter.

## Month-one product boundary

The eventual controlled pilot supports one Google Workspace organization, one shared operational inbox, 2–4 coordinators, one director, and 3–5 active studies.

Included:

- Sponsor, CRO, vendor, automated-system, IRB, Veeva, IRT/IVRS, laboratory, and internal-team communications
- Deterministic sender/domain/subject routing before AI suggestions
- Email thread to work-item creation and update
- Duplicate reminder handling through external references and thread identity
- Accountable owner, current assignee, contributor, and approver roles
- First-response and resolution clocks using business hours
- Coordinator work queue and director overview
- Sanitized message metadata with raw email retained in Gmail by default
- Append-only audit-event data model

Not included in the first pilot:

- Patient or subject registry
- EDC, CTMS, eSource, or eReg replacement
- Autonomous protocol/SOP interpretation
- AI-generated binding deadlines
- Electronic signatures
- Direct Veeva, IRT, IRB, EDC, or laboratory API integrations
- Microsoft 365, Teams, or Google Chat ingestion

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

A PostgreSQL database is required before running migrations. The current proof API keeps demo records in memory while the persistence layer is connected.

## Proof demonstration

1. Open **Inbox simulator**.
2. Process a Veeva document-rejection scenario.
3. Process the duplicate Veeva reminder and confirm that the same work item is updated.
4. Process the sensitive-data example and confirm that MRN/DOB values are redacted and routed to privacy review.
5. Reassign a work item and confirm the accountable owner and organizational SLA remain visible.
6. Complete a work item and confirm the resolution clock stops.
7. Open **Audit history** and verify the creation, reminder, reassignment, and status events.
8. Switch between Coordinator and Director views.

## Architecture

```text
Proof mode: simulator / pasted communication
Production pilot: Google Workspace Gmail watch + Cloud Pub/Sub
                         ↓
             Shared ingestion boundary
                         ↓
       Sensitive-data screening and redaction
                         ↓
  Threading + deterministic routing + deduplication
                         ↓
             Work-item and SLA engine
                         ↓
       PostgreSQL operational and audit records
                         ↓
        Coordinator and director dashboards
```

## Privacy boundary

The MVP intentionally excludes patient names, dates of birth, medical-record numbers, addresses, and clinical source data. Raw email content is not stored by default. The operational database stores sanitized subjects/summaries, Gmail identifiers, routing metadata, work-item state, SLA timestamps, and audit events.

The proof-mode scanner is a product demonstration, not a guarantee that all PHI will be detected. Production use requires tested detection controls, approved hosting and agreements, access controls, incident procedures, and site compliance review.

## Next engineering sequence

1. Run CI and resolve any dependency/schema/build failures.
2. Connect Prisma/PostgreSQL persistence.
3. Add configurable study, sender, category, and SLA administration screens.
4. Add organization-restricted authentication using a development Google tenant or temporary demo authentication.
5. Add `.eml` file import and forwarding-webhook adapter.
6. Add Gmail watch, Pub/Sub webhook verification, and history retrieval after site approval.
7. Add message threading, auto-reply filtering, and production-grade deduplication.
8. Add sensitive-data screening before any optional AI classification.
9. Run a shadow pilot before operational reliance.
