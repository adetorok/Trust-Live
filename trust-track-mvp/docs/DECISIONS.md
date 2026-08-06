# Initial Architecture Decisions

## ADR-001 — Build in an isolated workspace

The MVP is being developed under `trust-track-mvp/` on a dedicated branch. Existing TRUST CRO, recruitment, participant, and marketing functionality remains unchanged.

A separate private repository remains the intended product home after the foundation is reviewed and the repository can be created through the user's preferred GitHub workflow.

## ADR-002 — Google Workspace first

The pilot targets one Google Workspace organization and one shared operational Gmail inbox. Microsoft 365, Teams, and Google Chat are deferred.

## ADR-003 — Email notification as the universal integration layer

Veeva, IRT/IVRS, EDC, IRB, central laboratory, ePRO/eCOA, imaging, training, and safety-system emails are supported through configurable sender and subject rules. Direct vendor APIs are deferred until the pilot identifies where email is insufficient.

## ADR-004 — Work item, not email task

A communication is stored as a message event. Actionable message events create or update an operational work item. This supports reminders, status updates, deduplication, delegation, contributors, approvers, and organization-level SLA continuity.

## ADR-005 — Deterministic routing before AI

Routing priority is existing thread, external reference, exact sender, sender domain, protocol number, approved subject pattern, and then optional AI suggestion. AI does not establish new SLA policies or binding clinical deadlines.

## ADR-006 — Exclude subject data from the MVP

The MVP contains no subject or patient registry. Raw email content remains in Gmail by default. The operational store contains sanitized metadata, summaries, routing attributes, work-item state, SLA timestamps, and audit events.

## ADR-007 — Two SLA clocks

Every accountable work item may have separate first-response and resolution clocks. Reassignment does not reset the organization-level clocks. Contributor subtasks may have separate internal targets.

## ADR-008 — PostgreSQL operational store

PostgreSQL is selected for relational integrity, assignment history, self-referencing work items, SLA clocks, and analytics. Audit events are append-only at the application boundary; database-level protections and archival controls will be added before production reliance.
