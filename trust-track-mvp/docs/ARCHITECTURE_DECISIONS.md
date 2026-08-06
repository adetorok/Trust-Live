# Trust & Track — load-bearing architecture decisions

These decisions define the compliance posture and the one-month pilot boundary. Changing one requires an explicit architecture review.

## ADR-001 — Google deployment is internal-only for the pilot

The production pilot Google Cloud project must be owned by the clinical site's Google Workspace organization and configured with an **Internal** OAuth user type. Only users in that organization may authorize or sign in. The Workspace administrator must permit trusted internal applications.

This is a deployment prerequisite, not something the proof build can fake. The proof build runs without Google access. External distribution to unrelated sites is deliberately deferred.

## ADR-002 — No subject registry and no searchable subject data

There is no subject table. The product does not store names, dates of birth, medical-record numbers, addresses, or structured subject identifiers.

A task may contain an optional coordinator-entered `restricted_reference` when operationally unavoidable. That field is excluded from automated classification, LLM payloads, analytics text, exports by default, and search indexing. It is not a subject registry.

Raw email bodies are not retained by default. The source mailbox remains the system holding the original message. A BAA and appropriate safeguards are still required because unsolicited PHI may arrive in email.

## ADR-003 — One organizational clock per task

A task has one organizational clock beginning at inbound receipt. It never restarts when ownership changes.

`first_reply_at` and `resolved_at` are separate milestones on that same task. The SLA policy may define target times for both milestones, but there is no contributor clock and no internal sub-SLA.

Ownership transfers are recorded in an append-only delegation chain. Per-person handling time and hop count are derived from that chain.

## ADR-004 — Gmail polling every 60 seconds for v1

The first production connector polls the Gmail API every 60 seconds with an overlap window. It does not use Gmail Watch, Pub/Sub, or public webhooks.

Every Gmail message is idempotent through the unique `(tenant_id, gmail_message_id)` constraint. A poll checkpoint advances only after the full batch is processed successfully. Failed polls do not move the checkpoint.

Push delivery may replace polling after the pilot, but only after loss detection, watch renewal, replay, and gap recovery are proven.

## ADR-005 — Replies are detected from the actual mailbox

Users are never required to reply through Trust & Track. Outbound messages discovered by mailbox polling set `first_reply_at`. Replies from Gmail web, Gmail mobile, or another authorized client count equally.

A portal-only reply mechanism would make the director metrics incorrect and is prohibited.

## ADR-006 — First reply and resolution are reported separately

`first_reply_at` records the first outbound human reply. `resolved_at` records closure of the durable work item. An acknowledgment does not resolve a task.

Auto-replies, out-of-office notices, delivery notifications, read receipts, and similar machine-generated responses are filtered before they can set `first_reply_at` or create work.

## ADR-007 — Team-level metrics are the default

Director views default to study, team, category, and site metrics. Individual handling data exists for workload balancing and coaching but is not presented as a public speed leaderboard.

## ADR-008 — Audit log is append-only at the database layer

`audit_log` has no update timestamp and no application update/delete route. PostgreSQL triggers reject `UPDATE` and `DELETE` operations. This is enforced by the database, not developer convention.

## ADR-009 — A source event is not a task

Every inbound or outbound communication is a `source_event`. A durable `task` is the accountable work that one or many source events create or update.

This relationship supports reminders, follow-ups, responses, and escalations without producing duplicate tasks.

## ADR-010 — Deduplication is conservative

Match order:

1. Gmail thread
2. External query/document/ticket reference
3. Explicit reminder marker plus source system, study, and normalized notification type inside the configured window

No other match folds events together. A non-reminder supply alert creates a new task even when a similar open task exists. Visible duplicates are preferable to an invisible swallowed task.

## ADR-011 — Automated systems use deterministic parsing

Veeva, IRT/IVRS, EDC, IRB, and central-laboratory notifications use configured sender patterns and regular expressions. No LLM participates in automated-system routing or deduplication.

Human messages that cannot be routed deterministically enter triage. The system does not guess.

## ADR-012 — Accountable owner and contributors are different concepts

`tasks.owner_id` is responsible for final closure. Ownership transfer is a delegation and preserves the original clock.

A `contributor_request` asks another person for information or review while the owner remains accountable. `needed_by` is a nudge, not an SLA and is excluded from breach calculations.

Approval requests are contributor requests with `is_approval = true`. They are not electronic signatures and must never be described as 21 CFR Part 11 signatures.

## ADR-013 — Six operational categories

The MVP categories are:

- Data query
- Regulatory
- Supply
- Monitoring
- Safety
- General

A category is added only when actual pilot volume demonstrates a distinct owner or SLA. If General exceeds roughly 30% of incoming actionable volume, its contents are reviewed and split using observed data.
