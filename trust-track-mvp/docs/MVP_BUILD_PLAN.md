# Trust & Track Four-Week MVP Build Plan

## Product promise

Trust & Track makes sure every actionable clinical-trial request, reminder, and system alert has an owner and is completed on time.

The MVP is an operational convenience and accountability layer. It is not the system of record for source data, essential documents, regulated signatures, or clinical decisions.

## Pilot users and scope

- One clinical research site
- One Google Workspace organization
- One shared operational Gmail inbox
- One site director
- Two to four coordinators
- Three to five active studies
- Ten to fifteen manually configured automated sender patterns

## Source coverage

### Automated systems — launch wedge

Veeva, EDC platforms, IRT/IVRS, IRB portals, and central-laboratory notifications. These are routed with sender and regular-expression configuration, never an LLM.

### External people

Sponsors, CROs, monitors, laboratories, pharmacies, vendors, and support contacts. Deterministically matched mail is routed; uncertain human mail enters triage rather than receiving an AI guess.

### Internal users

Coordinators, regulatory staff, investigators, finance staff, pharmacy staff, and site leadership.

### Manually registered events

Monitoring visits, amendments, study-startup milestones, and other approved events. Protocol-derived automation remains manual in the MVP.

## Core processing rules

1. A communication is a source event; a task is the durable accountable record.
2. Many source events may create or update one task.
3. Deduplication match order is Gmail thread, external reference, then explicit reminder pattern inside a configured window.
4. A non-reminder event is not folded merely because similar work is already open.
5. Gmail message ID is the idempotency boundary for overlapping polls, retries, and replays.
6. Automated senders use deterministic regex routing; uncertain mail goes to triage.
7. One organizational task clock starts at inbound receipt and never resets on delegation.
8. `first_reply_at` and `resolved_at` are separate milestones on that same task.
9. The accountable owner is responsible for closure. Contributors provide input without receiving an internal SLA.
10. Auto-replies, out-of-office messages, read receipts, and delivery notifications neither create work nor count as human replies.
11. Replies are discovered in the actual Sent mailbox; users are never required to reply through Trust & Track.
12. Raw email remains in Gmail; only sanitized operational content is stored by default.
13. There is no subject table or searchable subject data.
14. Director metrics default to team and study level.

## Week 1 — Proof foundation and deterministic rules

- Build proof-mode inbox simulator
- Configure six categories: Data Query, Regulatory, Supply, Monitoring, Safety, General
- Configure representative Veeva, IRT, IRB, EDC, and laboratory source systems
- Implement source-event versus task separation
- Implement strict deduplication and auto-reply filtering
- Implement one-clock task model and delegation chain
- Add contributor-request model
- Add append-only audit schema and database trigger SQL
- Add automated routing and polling tests

## Week 2 — Persistence and editable configuration

- Generate and apply the PostgreSQL base migration
- Apply architecture guard SQL for partial unique indexes and audit triggers
- Replace in-memory proof state with Prisma repositories
- Add editable studies and default owners
- Add source-system sender, subject, external-reference, protocol, and reminder regex settings
- Add category and SLA-policy administration
- Add business-hour and holiday configuration
- Add privacy-review queue

## Week 3 — Gmail polling and mailbox correctness

This phase begins only after the site approves access.

- Create the Cloud project inside the site's Workspace organization
- Configure the OAuth consent screen as Internal user type
- Confirm Workspace admin trust for the internal application
- Store OAuth material in an approved secret manager, not ordinary database columns
- Poll Inbox and Sent mail every 60 seconds
- Use a five-minute overlap window and Gmail-message idempotency
- Advance the checkpoint only after a complete successful batch
- Detect outbound human replies from any Gmail client
- Capture Gmail thread and RFC message identifiers
- Add poll health, last-success, error, and stale-mailbox monitoring
- Run shadow comparison against the actual mailbox

## Week 4 — Operational workflow and director proof

- Add ownership transfer with immutable delegation history
- Add contributor and approval requests without internal SLA clocks
- Add waiting-state pause/resume audit behavior
- Add overdue and escalation evaluation
- Finalize coordinator work queue
- Finalize director team/study dashboard
- Add source-event and audit drill-down
- Add CSV export with restricted fields excluded by default
- Run permission, duplicate, reply-detection, privacy, and recovery test cases
- Begin controlled pilot only after acceptance criteria pass

## Launch acceptance criteria

- Eligible automated notifications are captured without silent loss
- The same Gmail message cannot be processed twice
- A Gmail thread updates the associated open task
- Veeva reminders in new threads update by document/query reference
- Reminder-pattern folding requires an explicit reminder marker
- A genuinely new supply alert is never swallowed by similarity matching
- Replies sent from normal Gmail are detected from Sent mail
- Auto-replies do not create tasks or set first reply
- Delegation never changes `clock_started_at`
- Contributors do not create a second SLA clock
- First reply and resolution are reported separately
- The director can identify all overdue work at team and study level
- No subject table exists and prohibited subject data is redacted before persistence
- No raw PHI is sent to an LLM
- Every material state change creates an audit record
- PostgreSQL rejects audit-log update and delete operations
- Coordinators report that the product removes work rather than adding another portal

## Deferred until pilot evidence exists

- Gmail push delivery and Pub/Sub
- AI SOP and protocol parsing
- Binding deadline generation from documents
- Direct vendor-system APIs
- Outlook and Teams
- Google Chat ingestion
- Multi-tenant external distribution
- Part 11 electronic signatures
- Patient or subject data management
- Predictive analytics
