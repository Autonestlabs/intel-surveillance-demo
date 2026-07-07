/* ============================================================
   Admin (office) dashboard — what William & his partner see.
   ============================================================ */

const AdminView = (() => {

  let section = 'dashboard';   // dashboard | team | jobs | reports | inventory
  let jobFilter = 'all';
  let modalJobId = null;

  /* ---------- small pieces ---------- */

  function statusOfTech(t) {
    switch (t.status) {
      case 'on-site':  return '<span class="badge green"><span class="dot"></span>On site</span>';
      case 'late':     return '<span class="badge red"><span class="dot"></span>Late arrival</span>';
      case 'en-route': return '<span class="badge amber"><span class="dot"></span>En route</span>';
      case 'off':      return '<span class="badge gray">Off today</span>';
      default:         return '';
    }
  }

  function techRow(t, compact) {
    const job = t.currentJobId ? jobById(t.currentJobId) : null;
    return `
      <tr>
        <td><div class="cell-person">
          <span class="avatar" style="background:${t.avatarColor}">${initials(t.name)}</span>
          <div><b>${t.name}</b><span>${t.role}</span></div>
        </div></td>
        <td>${statusOfTech(t)}</td>
        <td class="mono">${t.clockIn || '—'}</td>
        ${compact ? '' : `
        <td style="font-size:.78rem;color:${t.status === 'late' ? 'var(--red)' : 'var(--slate-500)'}">${t.geofence ? (t.geofence === 'verified' ? '📍 GPS verified on site' : '📍 ' + t.geofence) : '—'}</td>
        <td>${job ? escapeHtml(job.name) : '<span style="color:var(--slate-400)">—</span>'}</td>
        <td class="mono">${t.weekHours.toFixed(1)}</td>
        <td class="mono" style="color:${t.lateCount30d >= 3 ? 'var(--red)' : t.lateCount30d > 0 ? 'var(--amber)' : 'var(--green)'};font-weight:700">${t.lateCount30d}</td>`}
      </tr>`;
  }

  function reportCard(r) {
    const t = techById(r.techId);
    const j = jobById(r.jobId);
    return `
      <div class="report-card">
        <div class="r-head">
          <span class="avatar" style="background:${t.avatarColor};width:30px;height:30px;font-size:.66rem">${initials(t.name)}</span>
          <div><b>${t.name}</b><div class="r-job">${j ? escapeHtml(j.name) : ''}</div></div>
          <span class="r-time">${r.date} · ${r.submitted}</span>
        </div>
        <div class="r-ai"><span class="ai-tag">✦ AI Summary</span><br>${escapeHtml(r.aiSummary)}</div>
        <div class="r-details">
          <b>Hours:</b> ${r.hours.toFixed(1)} &nbsp;·&nbsp; <b>Materials:</b> ${r.materials.length ? r.materials.map(escapeHtml).join(', ') : 'none logged'} &nbsp;·&nbsp; <b>Issues:</b> ${escapeHtml(r.issues)}
        </div>
      </div>`;
  }

  /* ---------- sections ---------- */

  function renderDashboard() {
    const techs = DemoData.technicians;
    const working = techs.filter(t => t.status !== 'off');
    const onSite = techs.filter(t => t.status === 'on-site').length;
    const late = techs.filter(t => t.status === 'late').length;
    const activeJobs = DemoData.jobs.filter(j => j.status === 'in-progress').length;
    const scheduled = DemoData.jobs.filter(j => j.status === 'scheduled').length;
    const hoursToday = working.reduce((a, t) => a + (t.clockIn ? 6.5 : 0), 0).toFixed(1);
    const reports = allReports();
    const big = jobById('j1');

    return `
      <div class="stat-grid">
        <div class="card stat-card">
          <div class="s-label">Techs On Site</div>
          <div class="s-value">${onSite}<span style="font-size:1rem;color:var(--slate-400)">/${working.length}</span></div>
          <div class="s-note green">All GPS-verified at job sites</div>
        </div>
        <div class="card stat-card">
          <div class="s-label">Late Arrivals Today</div>
          <div class="s-value" style="color:${late ? 'var(--red)' : 'var(--green)'}">${late}</div>
          <div class="s-note ${late ? 'red' : 'green'}">${late ? 'J. O\'Neal — 47 min late at Meridian' : 'Everyone on time'}</div>
        </div>
        <div class="card stat-card">
          <div class="s-label">Active Jobs</div>
          <div class="s-value">${activeJobs}</div>
          <div class="s-note">${scheduled} more scheduled this week</div>
        </div>
        <div class="card stat-card">
          <div class="s-label">Hours Logged Today</div>
          <div class="s-value">${hoursToday}</div>
          <div class="s-note">across ${working.filter(t => t.clockIn).length} clocked-in techs</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="stack">
          <div class="card">
            <h3>Live Crew Board <button class="link-btn" onclick="AdminView.setSection('team')">Full team view →</button></h3>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>Technician</th><th>Status</th><th>Clock-in</th></tr></thead>
              <tbody>${techs.filter(t => t.status !== 'off').slice(0, 6).map(t => techRow(t, true)).join('')}</tbody>
            </table></div>
          </div>

          <div class="card project-hero">
            <div class="ph-top">
              <div>
                <h4>${escapeHtml(big.name)}</h4>
                <div class="ph-meta">${escapeHtml(big.system)} · ${escapeHtml(big.address)}</div>
                <div class="ph-meta" style="color:var(--amber);font-weight:600">⏰ ${escapeHtml(big.window)}</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.5rem;font-weight:800">${big.progress}%</div>
                <div style="font-size:.72rem;color:var(--slate-500);font-weight:600">target ${big.targetDate}</div>
              </div>
            </div>
            <div class="progress-track" style="margin-bottom:14px"><div class="progress-fill" style="width:${big.progress}%"></div></div>
            ${big.phases.map(p => `
              <div class="phase-row">
                <span class="${p.done ? 'check' : ''}" style="width:18px">${p.done ? '✓' : '·'}</span>
                <span class="p-name" style="${p.done ? 'color:var(--slate-400)' : ''}">${p.name}</span>
                <span class="p-pct">${p.done ? '100%' : (p.pct || 0) + '%'}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="stack">
          <div class="card">
            <h3>Alerts & Exceptions</h3>
            ${DemoData.alerts.map(a => `
              <div class="alert-row ${a.level}">
                <span class="a-dot"></span>
                <div>${escapeHtml(a.text)}<div class="a-time">${a.time}</div></div>
              </div>`).join('')}
          </div>
          <div class="card">
            <h3>Latest Field Reports <button class="link-btn" onclick="AdminView.setSection('reports')">All reports →</button></h3>
            ${reports.slice(0, 2).map(reportCard).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Coverage Map — Active & Scheduled Jobs</h3>
        ${renderMap()}
      </div>
    `;
  }

  function renderMap() {
    return `
      <div class="map-panel">
        <div class="map-states">NY · NJ · PA · DE · MD · VA</div>
        ${DemoData.mapPins.map(p => {
          const j = jobById(p.jobId);
          return `<div class="map-pin" style="left:${p.x}%;top:${p.y}%" onclick="AdminView.openJob('${j.id}')">
            <span class="p-dot ${j.status}"></span>
            <span class="p-label">${escapeHtml(j.name)} · ${p.state}</span>
          </div>`;
        }).join('')}
        <div class="map-legend">
          <span><i style="background:var(--green)"></i>In progress</span>
          <span><i style="background:var(--amber)"></i>Scheduled</span>
          <span><i style="background:var(--slate-400)"></i>Completed</span>
        </div>
      </div>`;
  }

  function renderTeam() {
    const techs = DemoData.technicians;
    return `
      <div class="card" style="margin-bottom:16px">
        <h3>Time & Location — Today</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr>
            <th>Technician</th><th>Status</th><th>Clock-in</th><th>GPS Verification</th><th>Current Job</th><th>Hrs (wk)</th><th>Lates (30d)</th>
          </tr></thead>
          <tbody>${techs.map(t => techRow(t, false)).join('')}</tbody>
        </table></div>
      </div>
      <div class="grid-2">
        <div class="card">
          <h3>How clock-in verification works</h3>
          <div class="alert-row info"><span class="a-dot"></span><div>Tech taps <b>Clock In</b> on the company phone. The app captures GPS and checks it against the assigned job-site geofence (150 ft radius).</div></div>
          <div class="alert-row info"><span class="a-dot"></span><div>If they're not at the site, the clock-in is recorded but flagged — you see exactly when they arrived at the geofence.</div></div>
          <div class="alert-row danger"><span class="a-dot"></span><div>Arrivals after the scheduled start automatically raise a <b>Late Arrival</b> alert like the one on today's dashboard — no more finding out at invoice time.</div></div>
          <div class="alert-row info"><span class="a-dot"></span><div>Timesheets build themselves from verified clock-ins — payroll-ready, no chasing texts.</div></div>
        </div>
        <div class="card">
          <h3>Payroll Preview — Week of Jul 6</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Technician</th><th>Verified Hrs</th><th>Flagged</th></tr></thead>
            <tbody>
              ${techs.map(t => `<tr>
                <td style="font-size:.82rem;font-weight:600">${t.name}</td>
                <td class="mono">${t.weekHours.toFixed(1)}</td>
                <td>${t.lateCount30d >= 3 ? '<span class="badge red">review</span>' : '<span class="badge green">clean</span>'}</td>
              </tr>`).join('')}
            </tbody>
          </table></div>
        </div>
      </div>`;
  }

  function renderJobs() {
    const filters = [
      { id: 'all', label: 'All' },
      { id: 'in-progress', label: 'In progress' },
      { id: 'scheduled', label: 'Scheduled' },
      { id: 'completed', label: 'Completed' },
    ];
    let jobs = DemoData.jobs;
    if (jobFilter !== 'all') jobs = jobs.filter(j => j.status === jobFilter);

    return `
      <div class="pill-row">
        ${filters.map(f => `<button class="pill ${jobFilter === f.id ? 'active' : ''}" onclick="AdminView.setJobFilter('${f.id}')">${f.label}</button>`).join('')}
      </div>
      <div class="card">
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Job</th><th>Type</th><th>Status</th><th>Progress</th><th>Crew</th><th>Value</th><th>Target</th></tr></thead>
          <tbody>
            ${jobs.map(j => `
              <tr class="clickable" onclick="AdminView.openJob('${j.id}')">
                <td><b style="font-size:.85rem">${escapeHtml(j.name)}</b><div style="font-size:.72rem;color:var(--slate-500)">${escapeHtml(j.address)}</div></td>
                <td><span class="badge ${j.type === 'Project' ? 'blue' : j.type === 'Service' ? 'amber' : 'gray'}">${j.type}</span></td>
                <td>${App.statusBadge(j.status)}</td>
                <td style="min-width:110px">
                  <div class="progress-track"><div class="progress-fill ${j.progress === 100 ? 'green' : ''}" style="width:${j.progress}%"></div></div>
                  <div style="font-size:.7rem;color:var(--slate-500);margin-top:3px">${j.progress}%</div>
                </td>
                <td style="font-size:.78rem">${j.assigned.map(id => techById(id).name.split(' ')[0]).join(', ') || '—'}</td>
                <td class="mono" style="font-weight:600">${j.value}</td>
                <td style="font-size:.78rem;color:var(--slate-500)">${j.targetDate}</td>
              </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Today's Dispatch Schedule</h3>
        ${DemoData.schedule.map(s => {
          const j = jobById(s.jobId);
          return `<div class="alert-row info" style="align-items:center">
            <span class="mono" style="font-weight:700;width:74px;flex-shrink:0">${s.time}</span>
            <div>${escapeHtml(s.label)}
              <div class="a-time">${s.techIds.map(id => techById(id).name).join(', ')}</div>
            </div>
            ${App.statusBadge(j.status)}
          </div>`;
        }).join('')}
      </div>`;
  }

  function renderReports() {
    const reports = allReports();
    return `
      <div class="grid-2">
        <div class="card">
          <h3>End-of-Day Field Reports</h3>
          ${reports.map(reportCard).join('')}
        </div>
        <div class="stack">
          <div class="card">
            <h3>Why this matters</h3>
            <div class="alert-row info"><span class="a-dot"></span><div>Techs dictate rough notes at the truck — <b>AI writes the report</b>. A 30-second habit replaces the end-of-day silence.</div></div>
            <div class="alert-row info"><span class="a-dot"></span><div>Every report auto-attaches verified hours, tasks completed, and parts used, so you know what actually happened on every job, every day.</div></div>
            <div class="alert-row info"><span class="a-dot"></span><div>Reports roll up per job — when the GC or the customer asks "where are we?", the answer is one click.</div></div>
          </div>
          <div class="card">
            <h3>Try it live</h3>
            <p style="font-size:.83rem;color:var(--slate-500);line-height:1.6;margin-bottom:14px">
              Open the technician app, submit an end-of-day report, and it appears here instantly.
            </p>
            <button class="btn primary" onclick="App.go('tech')">Open Technician App →</button>
          </div>
        </div>
      </div>`;
  }

  function renderInventory() {
    const scans = AppState.scannedParts;
    return `
      <div class="grid-2">
        <div class="card">
          <h3>Warehouse Stock</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Part</th><th>SKU</th><th>Stock</th><th>Used Today</th><th>Status</th></tr></thead>
            <tbody>
              ${DemoData.inventory.map(i => `
                <tr>
                  <td style="font-weight:600;font-size:.82rem">${escapeHtml(i.name)}</td>
                  <td class="mono" style="font-size:.74rem;color:var(--slate-500)">${i.sku}</td>
                  <td class="mono" style="font-weight:700">${i.stock}</td>
                  <td class="mono">${i.usedToday}</td>
                  <td>${i.stock < i.min ? '<span class="badge red">low — reorder</span>' : '<span class="badge green">ok</span>'}</td>
                </tr>`).join('')}
            </tbody>
          </table></div>
        </div>
        <div class="stack">
          <div class="card">
            <h3>Live Scan Feed</h3>
            <p style="font-size:.8rem;color:var(--slate-500);line-height:1.6;margin-bottom:10px">
              When a tech scans a part barcode in the field, it's logged to the job and deducted here — automatically. Scans from this demo session:
            </p>
            ${scans.length ? scans.map(p => `
              <div class="alert-row info"><span class="a-dot"></span>
                <div><b>${escapeHtml(p.name)}</b> → ${escapeHtml(jobById(p.jobId) ? jobById(p.jobId).name : 'job')}
                <div class="a-time">${p.sku} · ${p.time} · scanned by M. Rivera</div></div>
              </div>`).join('') : '<div class="empty-note">No scans yet this session — open the Technician app and tap "Scan a Part".</div>'}
          </div>
          <div class="card">
            <h3>Automation hooks (full version)</h3>
            <div class="alert-row info"><span class="a-dot"></span><div>Auto-generate purchase orders when stock crosses the minimum.</div></div>
            <div class="alert-row info"><span class="a-dot"></span><div>Per-job material cost rolls into invoicing automatically.</div></div>
            <div class="alert-row warn"><span class="a-dot"></span><div>Monitoring-station API: supervisory faults auto-create service calls (see Pulaski Metals on today's board).</div></div>
          </div>
        </div>
      </div>`;
  }

  /* ---------- job modal ---------- */

  function renderModal() {
    if (!modalJobId) return '';
    const j = jobById(modalJobId);
    const jobReports = allReports().filter(r => r.jobId === j.id);
    return `
      <div class="modal-overlay" onclick="if(event.target===this)AdminView.closeJob()">
        <div class="modal">
          <div class="m-head">
            <h2>${escapeHtml(j.name)}</h2>
            <button class="m-close" onclick="AdminView.closeJob()">✕</button>
          </div>
          <div class="m-sub">${escapeHtml(j.system)} — ${escapeHtml(j.client)}</div>
          ${App.statusBadge(j.status)} <span class="badge blue">${j.type}</span> <span class="badge gray">${j.state}</span>
          <div class="m-section kv-grid">
            <div class="kv"><b>Address</b><span>${escapeHtml(j.address)}</span></div>
            <div class="kv"><b>Site window</b><span>${escapeHtml(j.window)}</span></div>
            <div class="kv"><b>Start</b><span>${j.startDate}</span></div>
            <div class="kv"><b>Target</b><span>${j.targetDate}</span></div>
            <div class="kv"><b>Contract value</b><span>${j.value}</span></div>
            <div class="kv"><b>Crew</b><span>${j.assigned.map(id => techById(id).name).join(', ') || '—'}</span></div>
          </div>
          <div class="m-section">
            <h4>Progress — ${j.progress}%</h4>
            <div class="progress-track"><div class="progress-fill ${j.progress === 100 ? 'green' : ''}" style="width:${j.progress}%"></div></div>
          </div>
          ${j.tasks.length ? `
          <div class="m-section">
            <h4>Open Tasks</h4>
            ${j.tasks.map(t => {
              const done = t.done || AppState.completedTasks[t.id];
              return `<div class="task-line ${done ? 'done' : ''}">${done ? '✅' : '⬜'} ${escapeHtml(t.label)}</div>`;
            }).join('')}
          </div>` : ''}
          ${j.notes ? `<div class="m-section"><h4>Site Notes</h4><p style="font-size:.84rem;line-height:1.6;color:var(--slate-700)">${escapeHtml(j.notes)}</p></div>` : ''}
          ${jobReports.length ? `<div class="m-section"><h4>Field Reports (${jobReports.length})</h4>${jobReports.map(reportCard).join('')}</div>` : ''}
        </div>
      </div>`;
  }

  /* ---------- shell ---------- */

  const NAV = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'team',      icon: '⏱️', label: 'Team & Time' },
    { id: 'jobs',      icon: '🗂️', label: 'Jobs & Schedule' },
    { id: 'reports',   icon: '📝', label: 'Field Reports' },
    { id: 'inventory', icon: '📦', label: 'Inventory' },
  ];

  const TITLES = {
    dashboard: ['Operations Dashboard', 'Live view of your crews, jobs, and exceptions — ' + todayString()],
    team:      ['Team & Time Tracking', 'GPS-verified clock-ins, late-arrival flags, and payroll-ready hours'],
    jobs:      ['Jobs & Schedule', 'Every project and service call across NY · NJ · PA · DE · MD · VA'],
    reports:   ['Field Reports', 'AI-written end-of-day reports from every tech, every day'],
    inventory: ['Inventory', 'Barcode-scanned usage in the field, live stock at the warehouse'],
  };

  function render() {
    let body = '';
    if (section === 'dashboard') body = renderDashboard();
    else if (section === 'team') body = renderTeam();
    else if (section === 'jobs') body = renderJobs();
    else if (section === 'reports') body = renderReports();
    else if (section === 'inventory') body = renderInventory();

    document.getElementById('app').innerHTML = `
      <div class="admin-shell">
        <aside class="sidebar">
          <div class="brand">
            <span class="shield">🛡️</span>
            <div><b>Intel Surveillance</b><span>FIELD OPS PLATFORM</span></div>
          </div>
          ${NAV.map(n => `
            <button class="nav-item ${section === n.id ? 'active' : ''}" onclick="AdminView.setSection('${n.id}')">
              <span class="n-icon">${n.icon}</span>${n.label}
            </button>`).join('')}
          <div class="spacer"></div>
          <button class="nav-item" onclick="App.go('tech')"><span class="n-icon">📱</span>Technician App</button>
          <div class="user-chip">
            <span class="avatar" style="background:#334155">WA</span>
            <div><b>William Adams</b><span>Owner · Admin</span></div>
          </div>
          <button class="switch-role" onclick="App.go('login')">‹ Back to demo start</button>
        </aside>
        <main class="admin-main">
          <div class="admin-header">
            <div>
              <h1>${TITLES[section][0]}</h1>
              <div class="sub">${TITLES[section][1]}</div>
            </div>
            <div class="header-live"><span class="pulse"></span> Live — ${DemoData.technicians.filter(t => t.clockIn && t.status !== 'off').length} techs clocked in</div>
          </div>
          ${body}
        </main>
      </div>
      ${renderModal()}
      <div class="demo-banner">DEMO — Intel Surveillance Field Platform by AutoNestLabs</div>
    `;
  }

  return {
    render,
    setSection(id) { section = id; modalJobId = null; render(); window.scrollTo(0, 0); },
    setJobFilter(f) { jobFilter = f; render(); },
    openJob(id) { modalJobId = id; render(); },
    closeJob() { modalJobId = null; render(); },
  };
})();
