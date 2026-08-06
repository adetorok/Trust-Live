import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function formatDueDate(value) {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}

function label(value) {
  return value?.replaceAll('_', ' ') || '';
}

async function api(path, options) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

const initialForm = {
  from: 'monitor@examplecro.com',
  subject: '[NOVA-22] Monitoring follow-up CASE-204',
  body: 'Please provide the completed monitoring follow-up response within three business days.'
};

const closedStatuses = new Set([
  'COMPLETED',
  'CLOSED_NO_ACTION',
  'CANCELLED'
]);

function App() {
  const [workItems, setWorkItems] = useState([]);
  const [demoMessages, setDemoMessages] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [activeView, setActiveView] = useState('coordinator');
  const [activePage, setActivePage] = useState('queue');
  const [form, setForm] = useState(initialForm);

  async function refresh() {
    const [workPayload, demoPayload, auditPayload] = await Promise.all([
      api('/api/work-items'),
      api('/api/demo/messages'),
      api('/api/audit-events')
    ]);
    setWorkItems(workPayload.workItems || []);
    setDemoMessages(demoPayload.messages || []);
    setAuditEvents(auditPayload.auditEvents || []);
  }

  useEffect(() => {
    refresh()
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    const now = Date.now();
    const openItems = workItems.filter(
      (item) => !closedStatuses.has(item.status)
    );

    return {
      open: openItems.length,
      overdue: openItems.filter(
        (item) => new Date(item.resolutionDueAt).getTime() < now
      ).length,
      replied: openItems.filter((item) => item.firstReplyAt).length,
      sensitive: openItems.filter(
        (item) => item.potentialSensitiveData
      ).length,
      reminders: workItems.reduce(
        (sum, item) => sum + item.reminderCount,
        0
      )
    };
  }, [workItems]);

  async function ingestMessage(message) {
    setBusy(true);
    setError('');
    try {
      const result = await api('/api/demo/ingest', {
        method: 'POST',
        body: JSON.stringify({
          from: message.from,
          subject: message.subject,
          body: message.body,
          receivedAt: new Date().toISOString()
        })
      });
      setNotice(result);
      await refresh();
      setActivePage('queue');
    } catch (ingestError) {
      setError(ingestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function resetDemo() {
    setBusy(true);
    try {
      await api('/api/demo/reset', { method: 'POST' });
      setNotice({
        outcome: 'RESET',
        reason: 'Demo data restored to its starting state.'
      });
      await refresh();
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setBusy(false);
    }
  }

  async function reassign(item) {
    const assignedTo = item.owner === 'Jane Smith'
      ? 'Matt Jones'
      : 'Jane Smith';
    setBusy(true);
    try {
      await api(`/api/work-items/${item.id}/reassign`, {
        method: 'POST',
        body: JSON.stringify({
          assignedTo,
          reason: 'Demo ownership transfer — one organizational clock remains active'
        })
      });
      setNotice({
        outcome: 'REASSIGNED',
        reason: `${item.id} moved from ${item.owner} to ${assignedTo}; the original clock did not reset.`
      });
      await refresh();
    } catch (reassignError) {
      setError(reassignError.message);
    } finally {
      setBusy(false);
    }
  }

  async function detectMailboxReply(item) {
    setBusy(true);
    try {
      const result = await api(
        `/api/work-items/${item.id}/simulate-mailbox-reply`,
        { method: 'POST' }
      );
      setNotice({
        outcome: result.outcome,
        reason: `${item.id}: an outbound human reply was found in the Sent mailbox. Resolution remains open.`
      });
      await refresh();
    } catch (replyError) {
      setError(replyError.message);
    } finally {
      setBusy(false);
    }
  }

  async function complete(item) {
    setBusy(true);
    try {
      await api(`/api/work-items/${item.id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      setNotice({
        outcome: 'COMPLETED',
        reason: `${item.id} was completed and its resolution milestone was recorded.`
      });
      await refresh();
    } catch (completeError) {
      setError(completeError.message);
    } finally {
      setBusy(false);
    }
  }

  function renderQueue() {
    return (
      <>
        <section className="metric-grid" aria-label="Operational metrics">
          <article className="metric-card">
            <span>Open work</span>
            <strong>{metrics.open}</strong>
            <small>Team-level, across studies</small>
          </article>
          <article className="metric-card critical">
            <span>Overdue</span>
            <strong>{metrics.overdue}</strong>
            <small>Organizational resolution target</small>
          </article>
          <article className="metric-card">
            <span>First replies detected</span>
            <strong>{metrics.replied}</strong>
            <small>Read from the actual mailbox</small>
          </article>
          <article className="metric-card warning">
            <span>Privacy review</span>
            <strong>{metrics.sensitive}</strong>
            <small>Prohibited subject data detected</small>
          </article>
        </section>

        <section className="queue-panel">
          <div className="queue-heading">
            <div>
              <p className="eyebrow">Actionable communications</p>
              <h2>
                {activeView === 'coordinator'
                  ? 'Due and accountable work'
                  : 'Site-wide operational risk'}
              </h2>
            </div>
            <div className="heading-actions">
              <button
                className="secondary-action"
                onClick={() => setActivePage('simulator')}
              >
                Add test communication
              </button>
              <button
                className="secondary-action"
                onClick={resetDemo}
                disabled={busy}
              >
                Reset demo
              </button>
            </div>
          </div>

          {loading && (
            <p className="state-message">Loading work queue…</p>
          )}
          {error && (
            <p className="state-message error">{error}</p>
          )}

          {!loading && !error && (
            <div className="work-table" role="table" aria-label="Work items">
              <div className="work-row table-header" role="row">
                <span>Work item</span>
                <span>Study / source</span>
                <span>Owner</span>
                <span>First reply</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {workItems.map((item) => (
                <article
                  className={`work-row ${item.potentialSensitiveData ? 'privacy-row' : ''}`}
                  role="row"
                  key={item.id}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {item.id} · {label(item.category)}
                      {item.externalReference
                        ? ` · ${item.externalReference}`
                        : ''}
                    </small>
                    {item.reminderCount > 0 && (
                      <em>
                        {item.reminderCount} reminder linked; no duplicate task
                      </em>
                    )}
                    <small>{item.sourceEventCount} source event(s)</small>
                  </div>
                  <div>
                    <strong>{item.study}</strong>
                    <small>{item.source}</small>
                  </div>
                  <div>
                    <span>{item.owner}</span>
                    <small>Accountable owner</small>
                  </div>
                  <div>
                    <strong>
                      {item.firstReplyAt
                        ? 'Detected'
                        : formatDueDate(item.firstResponseDueAt)}
                    </strong>
                    <small>
                      {item.firstReplyAt
                        ? formatDueDate(item.firstReplyAt)
                        : 'Reply due'}
                    </small>
                  </div>
                  <span className={`status status-${item.status.toLowerCase()}`}>
                    {label(item.status)}
                  </span>
                  <div className="row-actions">
                    {!closedStatuses.has(item.status) && (
                      <>
                        <button
                          onClick={() => reassign(item)}
                          disabled={busy}
                        >
                          Transfer owner
                        </button>
                        {!item.firstReplyAt && (
                          <button
                            onClick={() => detectMailboxReply(item)}
                            disabled={busy}
                          >
                            Detect Gmail reply
                          </button>
                        )}
                        <button
                          onClick={() => complete(item)}
                          disabled={busy}
                        >
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </>
    );
  }

  function renderSimulator() {
    return (
      <section className="simulator-layout">
        <div className="scenario-panel">
          <p className="eyebrow">No Google access required</p>
          <h2>Inbox simulator</h2>
          <p className="section-copy">
            Run realistic clinical-trial communications through deterministic
            routing, privacy screening, strict deduplication, ownership, and the
            single organizational clock that the Gmail poller will use later.
          </p>
          <div className="scenario-grid">
            {demoMessages.map((message) => (
              <button
                className="scenario-card"
                key={message.id}
                onClick={() => ingestMessage(message)}
                disabled={busy}
              >
                <strong>{message.label}</strong>
                <span>{message.from}</span>
                <small>{message.subject}</small>
              </button>
            ))}
          </div>
        </div>

        <form
          className="manual-form"
          onSubmit={(event) => {
            event.preventDefault();
            ingestMessage(form);
          }}
        >
          <p className="eyebrow">Manual test</p>
          <h2>Paste a communication</h2>
          <label>
            From
            <input
              type="email"
              value={form.from}
              onChange={(event) => setForm({
                ...form,
                from: event.target.value
              })}
              required
            />
          </label>
          <label>
            Subject
            <input
              value={form.subject}
              onChange={(event) => setForm({
                ...form,
                subject: event.target.value
              })}
              required
            />
          </label>
          <label>
            Message body
            <textarea
              rows="8"
              value={form.body}
              onChange={(event) => setForm({
                ...form,
                body: event.target.value
              })}
              required
            />
          </label>
          <button
            className="primary-action"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Processing…' : 'Process source event'}
          </button>
          <small className="form-note">
            The proof build stores only redacted text. It has no subject registry.
          </small>
        </form>
      </section>
    );
  }

  function renderAudit() {
    return (
      <section className="queue-panel audit-panel">
        <div className="queue-heading">
          <div>
            <p className="eyebrow">Append-only operational history</p>
            <h2>Recent audit events</h2>
          </div>
        </div>
        <div className="audit-list">
          {auditEvents.map((event) => (
            <article key={event.id}>
              <div>
                <strong>{label(event.eventType)}</strong>
                <small>{event.entityId}</small>
              </div>
              <code>{JSON.stringify(event.details)}</code>
              <time>{formatDueDate(event.occurredAt)}</time>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">T&amp;T</div>
        <div>
          <div className="brand-name">Trust &amp; Track</div>
          <div className="brand-subtitle">Clinical Site Operations</div>
        </div>
        <nav aria-label="Primary navigation">
          <button
            className={`nav-item ${activePage === 'queue' ? 'active' : ''}`}
            onClick={() => setActivePage('queue')}
          >
            Work queue
          </button>
          <button
            className={`nav-item ${activePage === 'simulator' ? 'active' : ''}`}
            onClick={() => setActivePage('simulator')}
          >
            Inbox simulator
          </button>
          <button
            className={`nav-item ${activePage === 'audit' ? 'active' : ''}`}
            onClick={() => setActivePage('audit')}
          >
            Audit history
          </button>
          <button className="nav-item" disabled>Studies</button>
          <button className="nav-item" disabled>Rules &amp; SLAs</button>
        </nav>
        <div className="pilot-badge">
          <strong>Proof mode</strong>
          <span>Polling connector deferred until site approval</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Clinical trial site accountability</p>
            <h1>
              {activePage === 'queue' && (
                activeView === 'coordinator'
                  ? 'My accountable work'
                  : 'Site operations overview'
              )}
              {activePage === 'simulator' && (
                'Prove the workflow before connecting Gmail'
              )}
              {activePage === 'audit' && (
                'Trace every operational action'
              )}
            </h1>
          </div>
          <div
            className="view-switch"
            role="group"
            aria-label="Dashboard view"
          >
            <button
              className={activeView === 'coordinator' ? 'selected' : ''}
              onClick={() => setActiveView('coordinator')}
            >
              Coordinator
            </button>
            <button
              className={activeView === 'director' ? 'selected' : ''}
              onClick={() => setActiveView('director')}
            >
              Director
            </button>
          </div>
        </header>

        {notice && (
          <section className={`notice notice-${notice.outcome.toLowerCase()}`}>
            <strong>{label(notice.outcome)}</strong>
            <span>{notice.reason || notice.workItem?.title}</span>
            {notice.workItem?.reminderCount > 0 && (
              <small>Reminder count: {notice.workItem.reminderCount}</small>
            )}
            <button onClick={() => setNotice(null)} aria-label="Dismiss">
              ×
            </button>
          </section>
        )}

        {activePage === 'queue' && renderQueue()}
        {activePage === 'simulator' && renderSimulator()}
        {activePage === 'audit' && renderAudit()}

        <section className="principle-banner">
          <strong>Core rule:</strong>
          <span>
            Communications are source events. They create or update one durable
            task with one organizational clock, preserved ownership history, and
            separate first-reply and resolution milestones.
          </span>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
