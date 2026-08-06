import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function formatDueDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}

function App() {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('coordinator');

  useEffect(() => {
    async function loadWorkItems() {
      try {
        const response = await fetch('/api/work-items');
        if (!response.ok) throw new Error('Unable to load work items');
        const payload = await response.json();
        setWorkItems(payload.workItems || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadWorkItems();
  }, []);

  const metrics = useMemo(() => {
    const now = Date.now();
    const overdue = workItems.filter(
      (item) => new Date(item.resolutionDueAt).getTime() < now && item.status !== 'COMPLETED'
    ).length;

    return {
      open: workItems.filter((item) => item.status !== 'COMPLETED').length,
      overdue,
      waiting: workItems.filter((item) => item.status.startsWith('WAITING')).length,
      studies: new Set(workItems.map((item) => item.study)).size
    };
  }, [workItems]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">T&amp;T</div>
        <div>
          <div className="brand-name">Trust &amp; Track</div>
          <div className="brand-subtitle">Clinical Site Operations</div>
        </div>
        <nav aria-label="Primary navigation">
          <button className="nav-item active">Work queue</button>
          <button className="nav-item">Studies</button>
          <button className="nav-item">Rules &amp; SLAs</button>
          <button className="nav-item">Audit history</button>
        </nav>
        <div className="pilot-badge">Google Workspace pilot</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Pilot workspace</p>
            <h1>{activeView === 'coordinator' ? 'My accountable work' : 'Site operations overview'}</h1>
          </div>
          <div className="view-switch" role="group" aria-label="Dashboard view">
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

        <section className="metric-grid" aria-label="Operational metrics">
          <article className="metric-card">
            <span>Open work</span>
            <strong>{metrics.open}</strong>
            <small>Across active studies</small>
          </article>
          <article className="metric-card critical">
            <span>Overdue</span>
            <strong>{metrics.overdue}</strong>
            <small>Needs review now</small>
          </article>
          <article className="metric-card">
            <span>Waiting on others</span>
            <strong>{metrics.waiting}</strong>
            <small>SLA pause must be justified</small>
          </article>
          <article className="metric-card">
            <span>Studies represented</span>
            <strong>{metrics.studies}</strong>
            <small>Current inbox workload</small>
          </article>
        </section>

        <section className="queue-panel">
          <div className="queue-heading">
            <div>
              <p className="eyebrow">Actionable communications</p>
              <h2>{activeView === 'coordinator' ? 'Due and assigned to you' : 'Oldest unresolved work'}</h2>
            </div>
            <button className="secondary-action">Review unassigned</button>
          </div>

          {loading && <p className="state-message">Loading work queue…</p>}
          {error && <p className="state-message error">{error}</p>}

          {!loading && !error && (
            <div className="work-table" role="table" aria-label="Work items">
              <div className="work-row table-header" role="row">
                <span>Work item</span>
                <span>Study / source</span>
                <span>Owner</span>
                <span>Response due</span>
                <span>Status</span>
              </div>
              {workItems.map((item) => (
                <article className="work-row" role="row" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.id} · {item.category.replaceAll('_', ' ')}</small>
                  </div>
                  <div>
                    <strong>{item.study}</strong>
                    <small>{item.source}</small>
                  </div>
                  <span>{item.owner}</span>
                  <time dateTime={item.firstResponseDueAt}>{formatDueDate(item.firstResponseDueAt)}</time>
                  <span className={`status status-${item.status.toLowerCase()}`}>
                    {item.status.replaceAll('_', ' ')}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="principle-banner">
          <strong>Core rule:</strong>
          <span>Every actionable communication becomes accountable work, but repeated reminders update the existing work item instead of creating duplicates.</span>
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
