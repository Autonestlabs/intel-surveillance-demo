/* ============================================================
   Technician (field) app — rendered inside a phone frame.
   Demo persona: Marcus Rivera (Senior Technician).
   ============================================================ */

const TechView = (() => {

  const TECH_ID = 't1'; // demo persona
  let tab = 'today';    // today | jobs | assistant | report
  let openJobId = null;

  /* ---------- AI assistant canned answers ---------- */
  const cannedAnswers = [
    {
      match: /next|appointment|where.*go|schedule/i,
      reply: 'Your next stop is <b>First Harbor Bank — Branch 12</b> at 2200 N Charles St, Baltimore. You\'re on it now with Sam Whitaker. After completion, nothing else is scheduled today. Tomorrow you\'re at First Harbor again, 8:00 AM.',
    },
    {
      match: /part|stock|inventory|reader|panel/i,
      reply: 'Warehouse stock right now: DSC PowerSeries Pro panels — <b>6 on hand</b>, HID Signo readers — <b>9 on hand</b>, hold-up buttons — <b>7 on hand</b>. If you need parts staged for tomorrow, I can notify the office.',
    },
    {
      match: /hour|time|week|clock/i,
      reply: 'You\'ve logged <b>32.5 hours</b> this week so far. Today you clocked in at ' + (AppState.techClockInTime || '7:52 AM') + ', verified on site. You\'re on pace for a full 40-hour week.',
    },
    {
      match: /bank|vault|harbor|job|note/i,
      reply: 'First Harbor Bank job notes: escort required for vault area (see branch manager Karen L.), old panel must be returned to the office for records, and central-station cutover needs a signal test before you leave. 2 of 4 tasks remain.',
    },
  ];
  const fallbackReply = 'In the full version I\'m connected to your schedule, job notes, inventory, and time records — so you can ask things like "where\'s my next appointment?", "do we have card readers in stock?", or "log that the customer asked for a quote on cameras."';

  /* ---------- Actions ---------- */

  function clockToggle() {
    if (AppState.techClockedIn) {
      AppState.techClockedIn = false;
      AppState.techClockOutTime = nowTimeString();
      App.toast('⏱️ Clocked out at ' + AppState.techClockOutTime + ' — 8.1 hrs logged today');
    } else {
      AppState.techClockedIn = true;
      AppState.techClockInTime = nowTimeString();
      App.toast('✅ Clocked in — GPS verified on site (within 150 ft)');
    }
    saveState();
    render();
  }

  function toggleTask(taskId) {
    AppState.completedTasks[taskId] = !AppState.completedTasks[taskId];
    saveState();
    render();
  }

  function scanPart() {
    const candidates = DemoData.inventory.filter(i => i.usedToday > 0 || i.stock > 10);
    const part = candidates[Math.floor(Math.random() * candidates.length)];
    AppState.scannedParts.unshift({
      sku: part.sku, name: part.name, jobId: openJobId || 'j2', time: nowTimeString(),
    });
    saveState();
    App.toast('📦 Scanned: ' + part.name + ' — logged to job & deducted from inventory');
    render();
  }

  function generateSummary() {
    const notes = document.getElementById('eod-notes');
    const raw = notes ? notes.value.trim() : '';
    const doneCount = Object.values(AppState.completedTasks).filter(Boolean).length;
    const scans = AppState.scannedParts.length;
    let summary = 'EOD Summary — ' + techById(TECH_ID).name + ', ' + todayString() + '. ';
    summary += 'On site at First Harbor Bank — Branch 12 (clocked in ' + (AppState.techClockInTime || '7:52 AM') + ', GPS verified). ';
    summary += doneCount > 0
      ? doneCount + ' task' + (doneCount > 1 ? 's' : '') + ' completed today; panel upgrade phase progressing on schedule. '
      : 'Panel upgrade phase progressing on schedule. ';
    if (scans > 0) summary += scans + ' part' + (scans > 1 ? 's' : '') + ' scanned to the job and auto-deducted from inventory. ';
    summary += raw
      ? 'Tech notes: ' + raw
      : 'No blocking issues reported. Central-station cutover and signal test planned for tomorrow morning.';
    AppState.draftSummary = summary;
    saveState();
    render();
  }

  function submitReport() {
    const summary = AppState.draftSummary;
    if (!summary) return;
    AppState.submittedReports.unshift({
      id: 'r-' + Date.now(),
      techId: TECH_ID, jobId: 'j2',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      submitted: nowTimeString(),
      hours: 8.0,
      completion: 'Daily report — First Harbor Bank Branch 12',
      materials: AppState.scannedParts.map(p => p.name),
      issues: 'See summary.',
      aiSummary: summary,
    });
    AppState.draftSummary = null;
    saveState();
    App.toast('📤 Report submitted — visible on the office dashboard now');
    tab = 'today';
    render();
  }

  function ask(question) {
    const found = cannedAnswers.find(c => c.match.test(question));
    AppState.chatLog.push({ role: 'user', text: question });
    AppState.chatLog.push({ role: 'ai', text: (found ? found.reply : fallbackReply) });
    saveState();
    render();
    const log = document.getElementById('chat-scroll');
    if (log) log.scrollTop = log.scrollHeight;
  }

  function askFromInput() {
    const input = document.getElementById('chat-input');
    if (input && input.value.trim()) { ask(input.value.trim()); }
  }

  /* ---------- Renderers ---------- */

  function renderClockCard() {
    const t = techById(TECH_ID);
    const clockedIn = AppState.techClockedIn;
    return `
      <div class="clock-card">
        <div class="c-status">
          <div>
            <div class="c-time">${clockedIn ? (AppState.techClockInTime || '7:52 AM') : '—'}</div>
            <div class="c-sub">${clockedIn ? 'Clocked in · First Harbor Bank — Branch 12' : 'Not clocked in'}</div>
          </div>
          <span class="badge ${clockedIn ? 'green' : 'gray'}"><span class="dot"></span>${clockedIn ? 'ON THE CLOCK' : 'OFF'}</span>
        </div>
        <div class="gps-line">${clockedIn
          ? '📍 GPS verified — within 150 ft of job site · geofence active'
          : '📍 GPS ready — location is captured at clock-in for verification'}</div>
        <button class="btn ${clockedIn ? 'red' : 'green'} block lg" onclick="TechView.clockToggle()">
          ${clockedIn ? 'Clock Out' : 'Clock In'}
        </button>
      </div>`;
  }

  function renderJobCard(j) {
    return `
      <div class="t-job-card" onclick="TechView.openJob('${j.id}')">
        <div class="tj-head">
          <b>${escapeHtml(j.name)}</b>
          ${App.statusBadge(j.status)}
        </div>
        <div class="tj-addr">📍 ${escapeHtml(j.address)}</div>
        <div class="progress-track" style="margin-bottom:8px"><div class="progress-fill ${j.progress === 100 ? 'green' : ''}" style="width:${j.progress}%"></div></div>
        <div class="tj-window">⏰ ${escapeHtml(j.window)}</div>
      </div>`;
  }

  function renderToday() {
    const myJobs = DemoData.jobs.filter(j => j.assigned.includes(TECH_ID) && j.status !== 'completed');
    return `
      ${renderClockCard()}
      <div class="t-section-title">Today's Assignments</div>
      ${myJobs.map(renderJobCard).join('')}
      <div class="t-section-title">Quick Actions</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button class="btn ghost" style="background:rgba(255,255,255,.07);color:#e2e8f0;justify-content:center" onclick="TechView.setTab('report')">📝 End-of-Day Report</button>
        <button class="btn ghost" style="background:rgba(255,255,255,.07);color:#e2e8f0;justify-content:center" onclick="TechView.scanPart()">📷 Scan a Part</button>
      </div>
      ${AppState.scannedParts.length ? `
        <div class="t-section-title">Parts Scanned Today (${AppState.scannedParts.length})</div>
        ${AppState.scannedParts.slice(0, 4).map(p => `
          <div class="scan-row scan-flash">
            <span class="s-ico">📦</span>
            <div><b>${escapeHtml(p.name)}</b><span>${p.sku} · ${p.time} · auto-deducted from inventory</span></div>
          </div>`).join('')}` : ''}
    `;
  }

  function renderJobDetail(j) {
    return `
      <div class="t-detail">
        <button class="t-back" onclick="TechView.closeJob()">‹ Back to jobs</button>
        <h2>${escapeHtml(j.name)}</h2>
        <div class="td-sub">${escapeHtml(j.system)}<br>📍 ${escapeHtml(j.address)}<br>⏰ ${escapeHtml(j.window)}</div>
        ${App.statusBadge(j.status)}

        <div class="t-section-title">Tasks</div>
        ${j.tasks.length ? j.tasks.map(t => {
          const done = t.done || AppState.completedTasks[t.id];
          return `
          <div class="t-task ${done ? 'done' : ''}" onclick="TechView.toggleTask('${t.id}')">
            <span class="cb">✓</span><span>${escapeHtml(t.label)}</span>
          </div>`;
        }).join('') : '<div class="empty-note">No task checklist for this job.</div>'}

        <div class="t-section-title">Materials</div>
        <button class="btn primary block" onclick="TechView.scanPart()">📷 Scan Part Barcode</button>
        ${AppState.scannedParts.filter(p => p.jobId === j.id).map(p => `
          <div class="scan-row" style="margin-top:7px">
            <span class="s-ico">📦</span>
            <div><b>${escapeHtml(p.name)}</b><span>${p.sku} · ${p.time}</span></div>
          </div>`).join('')}

        ${j.notes ? `
        <div class="t-section-title">Job Notes from Office</div>
        <div class="ai-panel" style="border-color:rgba(148,163,184,.25);background:rgba(255,255,255,.04)">
          <p>${escapeHtml(j.notes)}</p>
        </div>` : ''}
      </div>`;
  }

  function renderJobs() {
    if (openJobId) return renderJobDetail(jobById(openJobId));
    const myJobs = DemoData.jobs.filter(j => j.assigned.includes(TECH_ID));
    return `
      <div class="t-section-title" style="margin-top:4px">My Jobs</div>
      ${myJobs.map(renderJobCard).join('')}
    `;
  }

  function renderAssistant() {
    const suggestions = [
      'Where\'s my next appointment?',
      'Do we have card readers in stock?',
      'How many hours this week?',
      'Notes for the bank job?',
    ];
    return `
      <div class="t-section-title" style="margin-top:4px">AI Assistant</div>
      <div class="ai-panel" style="margin-bottom:14px">
        <div class="ai-tag">✦ Intel Assistant</div>
        <p>Ask me about your schedule, job notes, parts stock, or your hours. I can also log notes to a job for the office — hands-free.</p>
      </div>
      <div class="chat-log" id="chat-scroll" style="max-height:340px;overflow-y:auto">
        ${AppState.chatLog.map(m => `<div class="chat-msg ${m.role}">${m.role === 'ai' ? m.text : escapeHtml(m.text)}</div>`).join('')}
      </div>
      <div class="chat-suggest">
        ${suggestions.map(s => `<button onclick="TechView.ask('${s.replace(/'/g, "\\'")}')">${s}</button>`).join('')}
      </div>
      <div class="chat-input-row">
        <input class="t-input" id="chat-input" placeholder="Ask anything…" onkeydown="if(event.key==='Enter')TechView.askFromInput()" />
        <button class="btn primary" onclick="TechView.askFromInput()">➤</button>
      </div>`;
  }

  function renderReport() {
    const doneCount = Object.values(AppState.completedTasks).filter(Boolean).length;
    return `
      <div class="t-section-title" style="margin-top:4px">End-of-Day Report</div>
      <div class="td-sub" style="color:var(--slate-400);font-size:.78rem;line-height:1.6;margin-bottom:14px">
        Type (or dictate) rough notes — the AI turns them into a clean report for the office. Tasks completed and parts scanned today are attached automatically.
      </div>
      <div class="scan-row"><span class="s-ico">✅</span><div><b>${doneCount} tasks completed today</b><span>attached automatically</span></div></div>
      <div class="scan-row"><span class="s-ico">📦</span><div><b>${AppState.scannedParts.length} parts scanned</b><span>attached automatically</span></div></div>
      <div class="scan-row"><span class="s-ico">⏱️</span><div><b>Clock-in ${AppState.techClockInTime || '7:52 AM'} · GPS verified</b><span>attached automatically</span></div></div>

      <div class="t-section-title">Your Notes</div>
      <textarea class="t-input" id="eod-notes" rows="4" placeholder="e.g. finished teller line buttons, vault sensor needs the escort tomorrow morning, customer asked about adding cameras...">${AppState.eodDraftNotes ? escapeHtml(AppState.eodDraftNotes) : ''}</textarea>
      <div style="height:10px"></div>
      <button class="btn primary block" onclick="TechView.generateSummary()">✦ Generate AI Summary</button>

      ${AppState.draftSummary ? `
        <div class="ai-panel" style="margin-top:14px">
          <div class="ai-tag">✦ AI-Generated Report</div>
          <p>${escapeHtml(AppState.draftSummary)}</p>
        </div>
        <div style="height:10px"></div>
        <button class="btn green block lg" onclick="TechView.submitReport()">📤 Submit to Office</button>
      ` : ''}
    `;
  }

  function tabButton(id, icon, label) {
    return `<button class="${tab === id ? 'active' : ''}" onclick="TechView.setTab('${id}')">
      <span class="t-ico">${icon}</span>${label}</button>`;
  }

  function render() {
    const t = techById(TECH_ID);
    let body = '';
    if (tab === 'today') body = renderToday();
    else if (tab === 'jobs') body = renderJobs();
    else if (tab === 'assistant') body = renderAssistant();
    else if (tab === 'report') body = renderReport();

    document.getElementById('app').innerHTML = `
      <div class="tech-stage">
        <div class="stage-note">
          <span class="note-pill">TECHNICIAN VIEW</span>
          <h3>What your techs see</h3>
          <p>Each technician gets this app on a company phone. Clock-ins are GPS-verified against the job site, parts are scanned as they're used, and end-of-day reports take 30 seconds with AI doing the writing.</p>
          <p style="margin-top:10px">Everything they do here shows up live on your office dashboard.</p>
          <button class="btn ghost" onclick="App.go('admin')">→ See the Office Dashboard</button>
          <button class="btn ghost" style="margin-top:8px" onclick="App.go('login')">‹ Back to start</button>
        </div>
        <div class="phone">
          <div class="notch"><i></i></div>
          <div class="phone-body">
            <div class="tech-topbar">
              <div class="who">
                <span class="avatar" style="background:${t.avatarColor}">${initials(t.name)}</span>
                <div><b>${t.name}</b><span>${t.role} · Intel Surveillance</span></div>
              </div>
              <span class="badge ${AppState.techClockedIn ? 'green' : 'gray'}" style="font-size:.62rem">${AppState.techClockedIn ? '● ON CLOCK' : '○ OFF'}</span>
            </div>
            ${body}
          </div>
          <div class="tabbar">
            ${tabButton('today', '🏠', 'Today')}
            ${tabButton('jobs', '🗂️', 'Jobs')}
            ${tabButton('assistant', '✦', 'Assistant')}
            ${tabButton('report', '📝', 'Report')}
          </div>
        </div>
      </div>
      <div class="demo-banner">DEMO — Intel Surveillance Field Platform by AutoNestLabs</div>
    `;
  }

  /* ---------- public API ---------- */
  return {
    render,
    clockToggle,
    toggleTask,
    scanPart,
    generateSummary,
    submitReport,
    ask,
    askFromInput,
    setTab(id) { tab = id; if (id !== 'jobs') openJobId = null; render(); },
    openJob(id) { openJobId = id; tab = 'jobs'; render(); },
    closeJob() { openJobId = null; render(); },
  };
})();
