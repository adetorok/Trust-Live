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
- Ten to fifteen known automated sender patterns

## Source coverage

### External people

Sponsors, CROs, monitors, central laboratories, pharmacies, imaging vendors, recruitment vendors, IRBs, and technology-support personnel.

### Automated systems

Veeva, EDC platforms, IRT/IVRS, IRB portals, central laboratory portals, ePRO/eCOA, imaging systems, training platforms, and safety systems.

### Internal users

Coordinators, regulatory staff, investigators, finance staff, pharmacy staff, and site leadership.

### Manually registered events

Monitoring visits, amendments, study-startup milestones, and other approved site events. Protocol-derived automation is manual in the MVP.

## Core processing rules

1. A communication is a source event; a work item is the accountable operational record.
2. Every actionable communication creates or updates work.
3. Repeated reminders should update an existing work item rather than create duplicates.
4. Deterministic matching runs before AI classification.
5. The organization-level SLA does not reset when work is reassigned.
6. The accountable owner remains responsible for final closure even when contributors are assigned.
7. First-response and resolution clocks are measured separately.
8. Approved waiting states may pause the applicable clock and must be auditable.
9. Auto-replies and out-of-office messages do not satisfy first response.
10. Raw email remains in Gmail; only sanitized operational content is stored by default.

## Week 1 — Site configuration and foundation

- Confirm Workspace domain and administrator
- Identify pilot shared inbox
- Review 50–100 de-identified operational emails
- Create study, sponsor, CRO, vendor, and automated-system sender map
- Configure business hours and holidays
- Approve initial request categories and SLA policies
- Set up PostgreSQL schema, organization authentication plan, and audit-event model

## Week 2 — Gmail ingestion and normalization

- Gmail watch subscription
- Cloud Pub/Sub delivery
- Daily watch-renewal job
- Gmail history retrieval
- Message-ID, References, In-Reply-To, and Gmail thread tracking
- Auto-reply and out-of-office filtering
- Sanitization and sensitive-data review routing
- Deterministic domain, sender, subject, protocol, and external-reference matching

## Week 3 — Work items, assignment, and SLA engine

- Create or update work item from message event
- Accountable owner and current assignee
- Contributor and approver subtasks
- Reassignment and delegation history
- Business-hours first-response clock
- Business-hours resolution clock
- Waiting-state pause intervals
- Escalation and overdue evaluation
- Coordinator work queue

## Week 4 — Director view and shadow pilot

- Director metrics and study drill-down
- Open, overdue, first-response, resolution, and breach views
- Workload and delegation indicators
- CSV export
- Optional Google Calendar deadline events
- Shadow comparison against actual mailbox activity
- Permission, duplicate, reply-detection, and sensitive-data test cases
- Controlled launch only after acceptance criteria pass

## Launch acceptance criteria

- Eligible messages are captured without silent loss
- A Gmail thread creates one work item unless a user intentionally separates it
- Automated reminders update the correct work item
- Replies sent from normal Gmail are detected
- Reassignment does not reset the organization SLA
- Waiting states record actor, reason, start, and end
- Auto-replies do not stop response clocks
- The director can identify every overdue item
- Raw PHI is not sent to an LLM
- Every material state change creates an audit event
- Coordinators report that the product removes work rather than adding another portal

## Deferred until pilot evidence exists

- AI SOP and protocol parsing
- Binding deadline generation from documents
- Direct vendor-system APIs
- Outlook and Teams
- Google Chat ingestion
- Multi-tenant external distribution
- Part 11 electronic signatures
- Patient or subject data management
- Predictive analytics
