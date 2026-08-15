import React, { useEffect, useState } from 'react';
import {
  Activity, AlertCircle, Bell, CheckCircle2, ChevronRight, Clock3,
  FileText, LayoutDashboard, ListChecks, Search, Settings, ShieldCheck,
  Siren, Users, Wrench, ArrowLeft, Play, RefreshCw
} from 'lucide-react';

const services = [
  ['Payment Service', 'Healthy', 99.98],
  ['Identity Service', 'Healthy', 99.95],
  ['Customer DB', 'Degraded', 98.72],
  ['Notification Service', 'Healthy', 99.99],
];

function Stat({ icon: Icon, label, value, detail, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20}/></div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-detail">{detail}</div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('dashboard');
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const loadIncidents = () => {
    fetch('http://localhost:8000/incidents')
      .then(response => response.json())
      .then(data => setIncidents(data.incidents || []))
      .catch(error => console.error('Failed to load incidents:', error));
  };

  useEffect(() => { loadIncidents(); }, []);

  const nav = (target) => { setPage(target); setSelectedIncident(null); };
  const openIncident = (incident) => { setSelectedIncident(incident); setPage('incident-detail'); };

  const navItems = [
    ['dashboard', LayoutDashboard, 'Dashboard'],
    ['incidents', Siren, 'Incidents'],
    ['requests', ListChecks, 'Service Requests'],
    ['problems', FileText, 'Problems & Defects'],
    ['changes', Wrench, 'Changes'],
    ['services', Activity, 'Services'],
  ];
  const opsItems = [
    ['autofix', ShieldCheck, 'AutoFix'],
    ['sla', Clock3, 'SLA Management'],
    ['teams', Users, 'Teams & Assignment'],
  ];
  const placeholderTitles = {
    requests: ['Service Requests', 'Manage operational service requests and fulfilment.'],
    problems: ['Problems & Defects', 'Track recurring problems, defects and root-cause activities.'],
    changes: ['Change Management', 'Manage planned production changes and deployment windows.'],
    sla: ['SLA Management', 'Monitor response and resolution targets.'],
    teams: ['Teams & Assignment', 'View operational teams and ownership.'],
    settings: ['Settings', 'Manage portal preferences and operational configuration.'],
  };

  const renderDashboard = () => (
    <>
      <section className="stats-grid">
        <Stat icon={AlertCircle} label="Active Incidents" value={incidents.length} detail="From live API" tone="red"/>
        <Stat icon={Siren} label="Critical" value={incidents.filter(i => i.severity === 'Critical').length} detail="Current critical incidents" tone="orange"/>
        <Stat icon={CheckCircle2} label="AutoFixed Today" value="37" detail="94.8% success rate" tone="green"/>
        <Stat icon={Activity} label="Services" value="24" detail="23 healthy · 1 degraded" tone="purple"/>
      </section>

      <section className="content-grid">
        <div className="panel incidents-panel">
          <div className="panel-header">
            <div><h2>Active Incidents</h2><p>Latest production events requiring attention</p></div>
            <button className="text-button" onClick={() => nav('incidents')}>View all <ChevronRight size={15}/></button>
          </div>
          <div className="incident-list">
            {incidents.length === 0 && <div className="empty-inline">No incidents found.</div>}
            {incidents.map(i => (
              <div className="incident-row clickable" key={i.id} onClick={() => openIncident(i)}>
                <div className={`severity-dot ${String(i.severity).toLowerCase()}`}/>
                <div className="incident-main">
                  <div className="incident-title">{i.title}</div>
                  <div className="incident-meta">{i.incident_id} · {i.service} · Production</div>
                </div>
                <div className={`status ${String(i.status).toLowerCase().replaceAll(' ', '-')}`}>{i.status}</div>
                <ChevronRight className="row-chevron" size={17}/>
              </div>
            ))}
          </div>
        </div>

        <div className="panel health-panel">
          <div className="panel-header">
            <div><h2>Service Health</h2><p>Real-time availability</p></div>
            <Activity size={18} className="muted"/>
          </div>
          <div className="health-list">
            {services.map(([name, status, uptime]) => (
              <div className="health-row" key={name}>
                <div className={`health-indicator ${status.toLowerCase()}`}/>
                <div className="health-name">{name}</div>
                <div className="uptime">{uptime}%</div>
                <div className={`health-status ${status.toLowerCase()}`}>{status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel autofix-panel">
          <div className="autofix-glow"/>
          <div className="panel-header">
            <div><h2>AutoFix Activity</h2><p>Automated remediation in the last 24 hours</p></div>
            <div className="live-pill"><span/> LIVE</div>
          </div>
          <div className="fix-summary">
            <div><strong>37</strong><span>Remediations</span></div>
            <div><strong>35</strong><span>Successful</span></div>
            <div><strong>2</strong><span>Escalated</span></div>
            <div><strong>94.8%</strong><span>Success Rate</span></div>
          </div>
          <div className="progress"><div/></div>
        </div>
        <div className="panel sla-panel">
          <div className="panel-header">
            <div><h2>SLA Watch</h2><p>Incidents approaching breach</p></div>
            <Clock3 size={18} className="muted"/>
          </div>
          <div className="sla-item"><span className="sla-critical">Critical</span><strong>INC-10482</strong><span className="countdown">00:18:42</span></div>
          <div className="sla-item"><span className="sla-high">High</span><strong>INC-10481</strong><span className="countdown">00:42:15</span></div>
        </div>
      </section>
    </>
  );

  const renderIncidents = () => (
    <div className="panel page-panel">
      <div className="panel-header">
        <div><h2>Incident Management</h2><p>Incidents loaded from the FastAPI backend.</p></div>
        <button className="action-button" onClick={loadIncidents}><RefreshCw size={14}/> Refresh</button>
      </div>
      <div className="incident-table">
        <div className="table-head"><span>ID</span><span>Title</span><span>Service</span><span>Severity</span><span>Status</span></div>
        {incidents.map(i => (
          <div className="table-row clickable" key={i.id} onClick={() => openIncident(i)}>
            <strong>{i.incident_id}</strong><span>{i.title}</span><span>{i.service}</span>
            <span className={`severity-text ${String(i.severity).toLowerCase()}`}>{i.severity}</span><span>{i.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIncidentDetail = () => selectedIncident ? (
    <div className="panel page-panel">
      <div className="panel-header">
        <button className="back-button" onClick={() => nav('incidents')}><ArrowLeft size={15}/> Back to incidents</button>
        <span className={`status ${String(selectedIncident.status).toLowerCase().replaceAll(' ', '-')}`}>{selectedIncident.status}</span>
      </div>
      <div className="detail-body">
        <div className="detail-title-row">
          <div>
            <div className="eyebrow">INCIDENT</div>
            <h2>{selectedIncident.incident_id}</h2>
            <h3>{selectedIncident.title}</h3>
          </div>
          <button className="action-button" onClick={() => nav('autofix')}><Play size={14}/> AutoFix</button>
        </div>
        <div className="detail-grid">
          <div><span>Service</span><strong>{selectedIncident.service}</strong></div>
          <div><span>Severity</span><strong>{selectedIncident.severity}</strong></div>
          <div><span>Environment</span><strong>{selectedIncident.environment}</strong></div>
          <div><span>Assigned To</span><strong>{selectedIncident.assigned_to || 'Unassigned'}</strong></div>
        </div>
        <div className="detail-description"><span>Description</span><p>{selectedIncident.description}</p></div>
      </div>
    </div>
  ) : renderIncidents();

  const renderAutoFix = () => (
    <div className="panel page-panel">
      <div className="panel-header">
        <div><h2>AutoFix Remediation</h2><p>Controlled automated remediation workflow.</p></div>
        <div className="live-pill"><span/> READY</div>
      </div>
      <div className="empty-state">
        <div className="empty-icon"><ShieldCheck size={24}/></div>
        <h3>Remediation engine</h3>
        <p>Known incident patterns can trigger approved remediation actions, followed by a health check and escalation if remediation fails.</p>
        <button className="action-button"><Play size={14}/> Run test remediation</button>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="panel page-panel">
      <div className="panel-header"><div><h2>Service Health</h2><p>Operational health overview.</p></div></div>
      <div className="health-list service-page">
        {services.map(([name, status, uptime]) => (
          <div className="health-row" key={name}>
            <div className={`health-indicator ${status.toLowerCase()}`}/><div className="health-name">{name}</div>
            <div className="uptime">{uptime}%</div><div className={`health-status ${status.toLowerCase()}`}>{status}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlaceholder = (key) => {
    const [title, subtitle] = placeholderTitles[key] || ['Operations', 'Autofix operations workspace.'];
    return (
      <div className="panel page-panel">
        <div className="panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div></div>
        <div className="empty-state">
          <div className="empty-icon"><Activity size={24}/></div>
          <h3>Module ready</h3>
          <p>This module is intentionally lightweight. Our main focus is the Azure DevOps platform behind Autofix.</p>
        </div>
      </div>
    );
  };

  const content = page === 'dashboard' ? renderDashboard()
    : page === 'incidents' ? renderIncidents()
    : page === 'incident-detail' ? renderIncidentDetail()
    : page === 'autofix' ? renderAutoFix()
    : page === 'services' ? renderServices()
    : renderPlaceholder(page);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => nav('dashboard')}>
          <div className="brand-mark">A</div>
          <div><div className="brand-name">AUTOFIX</div><div className="brand-sub">Operations Platform</div></div>
        </div>
        <div className="nav-section">
          <div className="nav-title">WORKSPACE</div>
          {navItems.map(([key, Icon, label]) => (
            <div key={key} className={`nav-item ${page === key ? 'active' : ''}`} onClick={() => nav(key)}>
              <Icon size={18}/> {label}{key === 'incidents' && <span className="badge">{incidents.length}</span>}
            </div>
          ))}
        </div>
        <div className="nav-section">
          <div className="nav-title">OPERATIONS</div>
          {opsItems.map(([key, Icon, label]) => (
            <div key={key} className={`nav-item ${page === key ? 'active' : ''}`} onClick={() => nav(key)}><Icon size={18}/> {label}</div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className={`nav-item ${page === 'settings' ? 'active' : ''}`} onClick={() => nav('settings')}><Settings size={18}/> Settings</div>
          <div className="user-mini"><div className="avatar">LS</div><div><strong>Lokesh</strong><span>Operations Engineer</span></div></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">OPERATIONS CONTROL CENTER</div>
            <h1>{page === 'dashboard' ? 'Good evening, Lokesh' : page === 'incident-detail' ? 'Incident Details' : page === 'autofix' ? 'AutoFix' : page === 'services' ? 'Services' : placeholderTitles[page]?.[0] || 'Operations'}</h1>
            <p>{page === 'dashboard' ? "Here's the current operational health across your services." : 'Autofix operations workspace'}</p>
          </div>
          <div className="top-actions">
            <div className="search"><Search size={17}/><input placeholder="Search incidents, services..." /></div>
            <button className="icon-button"><Bell size={19}/><span className="notification-dot"/></button>
            <div className="profile">LS</div>
          </div>
        </header>
        {content}
      </main>
    </div>
  );
}

export default App;
