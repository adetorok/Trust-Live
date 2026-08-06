# Trust & Track MVP

Trust & Track is the accountability layer for clinical trial site operations. The pilot watches a clinical site's Google Workspace inbox, converts actionable study communications into owned work items, tracks response and resolution SLAs, preserves delegation history, and gives site leadership operational visibility.

## Month-one product boundary

The pilot supports one Google Workspace organization, one shared operational inbox, 2–4 coordinators, one director, and 3–5 active studies.

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

A PostgreSQL database is required before running migrations. The current API uses pilot sample records while the persistence layer is connected.

## Architecture

```text
Google Workspace Gmail
        ↓
Gmail watch + Cloud Pub/Sub
        ↓
Ingestion and sensitive-data screening
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

## Next engineering sequence

1. Connect Prisma/PostgreSQL persistence.
2. Add Google organization-restricted authentication.
3. Add Gmail watch, Pub/Sub webhook verification, and history retrieval.
4. Add message threading, auto-reply filtering, and deduplication.
5. Add configurable sender rules and SLA policies.
6. Add assignment, contribution, approval, and audit-event APIs.
7. Add sensitive-data screening before any optional AI classification.
8. Run a shadow pilot before operational reliance.
