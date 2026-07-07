/* ============================================================
   Technician (field) app — rendered inside a phone frame.
   Demo persona: Marcus Rivera (Senior Technician).
   ============================================================ */

const TechView = (() => {

  const TECH_ID = 't1'; // demo persona
  let tab = 'today';    // today | jobs | assistant | report
  let openJobId = null;
  let recState = null;  // null | 'recording' | 'transcribing'

  const VOICE_TRANSCRIPT = 'Finished swapping the panel this morning, all zones tested good. Got two of the four hold-up buttons in at the teller line — the other two need the counter guy to drill the millwork, he\'s coming tomorrow at 8. Vault sensor is mounted but I need the escort to test it, Karen said 9 AM works. Also the branch manager asked about adding a camera over the night deposit box — somebody should quote that.';

  /* ---------- AI assistant canned answers ---------- */
  const cannedAnswers = [
    {
      match: /next|appointment|where.*go|schedule/i,
      reply: 'Your next stop is <b>First Harbor Bank — Branch 12</b> at 2200 N Charles St, Baltimore. You\'re on it now with Sam Whitaker. After completion, nothing else is scheduled today. Tomorrow you\'re at First Harbor again, 8:00 AM — the vault-sensor escort is booked for 9:00.',
    },
    {
      match: /part|stock|inventory|reader|panel|button/i,
      reply: 'Warehouse stock right now: DSC PowerSeries Pro panels — <b>6 on hand</b>, HID Signo readers — <b>9 on hand</b>, hold-up buttons — <b>7 on hand</b>. Need something staged for tomorrow? Say the word and I\'ll notify the office.',
    },
    {
      match: /hour|time|week|clock/i,
      reply: 'You\'ve logged <b>32.5 hours</b> this week so far. Today you clocked in at ' + (AppState.techClockInTime || '7:52 AM') + ', verified on site. You\'re on pace for a full 40-hour week.',
    },
    {
      match: /bank|vault|harbor|job|note/i,
      reply: 'First Harbor Bank job notes: escort required for vault area (branch manager Karen L. — she confirmed 9 AM tomorrow), old panel goes back to the office for records, and the central-station cutover needs a signal test before you leave Thursday. 2 of 4 tasks remain.',
    },
    {
      match: /code|nfpa|spacing|smoke|regulation|requirement/i,
      reply: 'Per <b>NFPA 72</b>, smooth-ceiling smoke detector spacing is <b>30 ft on center</b>, max 15 ft from any wall, and within 21 ft of any point on the ceiling. For the bank lobby\'s 12-ft drop ceiling, standard spacing applies — but keep detectors 3 ft from supply diffusers. Want the full code excerpt?',
    },
    {
      match: /log|tell the office|quote|camera/i,
      reply: 'Logged to the job and flagged for the office: <i>"Customer requested a quote — camera over the night deposit box."</i> Sales will see it in the pipeline as an upsell lead on this account.',
    },
  ];
  const fallbackReply = 'In the full version I\'m connected to your schedule, job notes, inventory, time records, and code references — ask things like "where\'s my next appointment?", "what\'s the NFPA spacing for smoke detectors?", or "log that the customer wants a camera quote."';

  /* ---------- Actions ---------- */

  function clockToggle() {
    if (AppState.techClockedIn) {
      AppState.techClockedIn = false;
      AppState.techClockOutTime = nowTimeString();
      App.toast('Clocked out at ' + AppState.techClockOutTime + ' — 8.1 hrs logged today');
    } else {
      AppState.techClockedIn = true;
      AppState.techClockInTime = nowTimeString();
      App.toast('Clocked in — GPS verified on site, within 150 ft');
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
    App.toast('Scanned: ' + part.name + ' — logged to job & deducted from inventory');
    render();
  }

  function addPhoto() {
    const labels = ['Panel wiring — after', 'Teller line button 2', 'Vault sensor mount', 'Cable run — ceiling', 'Old panel (for records)'];
    const label = labels[AppState.photos.length % labels.length];
    AppState.photos.unshift({ jobId: openJobId || 'j2', label, time: nowTimeString() });
    saveState();
    App.toast('Photo attached to job — synced to office');
    render();
  }

  /* ---------- Voice note flow ---------- */

  function startVoice() {
    recState = 'recording';
    render();
    setTimeout(() => {
      recState = 'transcribing';
      render();
      setTimeout(() => {
        recState = null;
        AppState.eodDraftNotes = VOICE_TRANSCRIPT;
        saveState();
        render();
        App.toast('Voice note transcribed — review and generate your report');
      }, 1600);
    }, 2600);
  }

  function generateSummary() {
    const notes = document.getElementById('eod-notes');
    const raw = notes ? notes.value.trim() : (AppState.eodDraftNotes || '');
    AppState.eodDraftNotes = raw;
    const doneCount = Object.values(AppState.completedTasks).filter(Boolean).length;
    const scans = AppState.scannedParts.length;
    const photos = AppState.photos.length;
    let summary;
    if (raw === VOICE_TRANSCRIPT) {
      summary = 'First Harbor Bank — Branch 12, ' + todayString() + ' (M. Rivera, on site ' + (AppState.techClockInTime || '7:52 AM') + ', GPS verified). Panel replacement complete — all zones tested good. Hold-up buttons: 2 of 4 installed; remaining 2 blocked on millwork drilling (carpenter on site tomorrow 8 AM). Vault sensor mounted; test scheduled with escort (Karen L.) 9:00 AM tomorrow. UPSELL FLAG → customer requested a quote: camera over the night deposit box (routed to sales pipeline).' + (scans ? ' Materials: ' + scans + ' part(s) scanned and deducted.' : '') + (photos ? ' ' + photos + ' photo(s) attached.' : '');
    } else {
      summary = 'EOD Summary — ' + techById(TECH_ID).name + ', ' + todayString() + '. On site at First Harbor Bank — Branch 12 (clocked in ' + (AppState.techClockInTime || '7:52 AM') + ', GPS verified). ';
      summary += doneCount > 0
        ? doneCount + ' task' + (doneCount > 1 ? 's' : '') + ' completed today; panel upgrade phase progressing on schedule. '
        : 'Panel upgrade phase progressing on schedule. ';
      if (scans > 0) summary += scans + ' part' + (scans > 1 ? 's' : '') + ' scanned to the job and auto-deducted from inventory. ';
      if (photos > 0) summary += photos + ' photo' + (photos > 1 ? 's' : '') + ' attached. ';
      summary += raw
        ? 'Tech notes: ' + raw
        : 'No blocking issues reported. Central-station cutover and signal test planned for Thursday.';
    }
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
      photos: AppState.photos.length,
      issues: 'See summary.',
      aiSummary: summary,
    });
    AppState.draftSummary = null;
    AppState.eodDraftNotes = '';
    saveState();
    App.toast('Report submitted — visible on the office dashboard now');
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
    const clockedIn = AppState.techClockedIn;
    return `
      <div class="clock-card">
        <div class="c-status">
          <div>
            <div class="c-time">${clockedIn ? (AppState.techClockInTime || '7:52 AM') : '—'}</div>
            <div class="c-sub">${clockedIn ? 'Clocked in · First Harbor Bank — Branch 12' : 'Not clocked in'}</div>
          </div>
          <span class="badge ${clockedIn ? 'green' : 'gray'}"><span class="dot"></span>${clockedIn ? 'On the clock' : 'Off'}</span>
        </div>
        <div class="gps-line">${icon('pin', 13)} ${clockedIn
          ? 'GPS verified — within 150 ft of job site · geofence active'
          : 'GPS ready — location is captured at clock-in for verification'}</div>
        <button class="btn ${clockedIn ? 'red' : 'green'} block lg" onclick="TechView.clockToggle()">
          ${clockedIn ? 'Clock out' : 'Clock in'}
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
        <div class="tj-addr">${icon('pin', 12)} ${escapeHtml(j.address)}</div>
        <div class="progress-track" style="margin-bottom:4px"><div class="progress-fill ${j.progress === 100 ? 'green' : ''}" style="width:${j.progress}%"></div></div>
        <div class="tj-window">${icon('clock', 12)} ${escapeHtml(j.window)}</div>
      </div>`;
  }

  function renderToday() {
    const myJobs = DemoData.jobs.filter(j => j.assigned.includes(TECH_ID) && j.status !== 'completed');
    return `
      ${renderClockCard()}
      <div class="t-section-title">Today's assignments</div>
      ${myJobs.map(renderJobCard).join('')}
      <div class="t-section-title">Quick actions</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button class="btn t-quick" onclick="TechView.setTab('report')">${icon('file', 14)} EOD report</button>
        <button class="btn t-quick" onclick="TechView.scanPart()">${icon('scan', 14)} Scan a part</button>
        <button class="btn t-quick" onclick="TechView.addPhoto()">${icon('camera', 14)} Add photo</button>
        <button class="btn t-quick" onclick="TechView.setTab('assistant')">${icon('spark', 14)} Ask AI</button>
      </div>
      ${AppState.scannedParts.length ? `
        <div class="t-section-title">Parts scanned today (${AppState.scannedParts.length})</div>
        ${AppState.scannedParts.slice(0, 4).map(p => `
          <div class="scan-row scan-flash">
            <span class="s-ico">${icon('box', 15)}</span>
            <div><b>${escapeHtml(p.name)}</b><span>${p.sku} · ${p.time} · auto-deducted from inventory</span></div>
          </div>`).join('')}` : ''}
      ${AppState.photos.length ? `
        <div class="t-section-title">Photos today (${AppState.photos.length})</div>
        <div class="photo-grid">
          ${AppState.photos.slice(0, 6).map(p => `
            <div class="photo-thumb">${icon('camera', 16)}<b>${escapeHtml(p.label)}</b></div>`).join('')}
        </div>` : ''}
    `;
  }

  function renderJobDetail(j) {
    const photos = AppState.photos.filter(p => p.jobId === j.id);
    return `
      <div class="t-detail">
        <button class="t-back" onclick="TechView.closeJob()">${icon('chevronLeft', 13)} Back to jobs</button>
        <h2>${escapeHtml(j.name)}</h2>
        <div class="td-sub">${escapeHtml(j.system)}<br>${escapeHtml(j.address)}<br>${escapeHtml(j.window)}</div>
        ${App.statusBadge(j.status)}

        <div class="t-section-title">Tasks</div>
        ${j.tasks.length ? j.tasks.map(t => {
          const done = t.done || AppState.completedTasks[t.id];
          return `
          <div class="t-task ${done ? 'done' : ''}" onclick="TechView.toggleTask('${t.id}')">
            <span class="cb">${icon('check', 11)}</span><span>${escapeHtml(t.label)}</span>
          </div>`;
        }).join('') : '<div class="empty-note">No task checklist for this job.</div>'}

        <div class="t-section-title">Materials & photos</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button class="btn primary" style="justify-content:center" onclick="TechView.scanPart()">${icon('scan', 14)} Scan part</button>
          <button class="btn t-quick" onclick="TechView.addPhoto()">${icon('camera', 14)} Add photo</button>
        </div>
        ${AppState.scannedParts.filter(p => p.jobId === j.id).map(p => `
          <div class="scan-row" style="margin-top:7px">
            <span class="s-ico">${icon('box', 15)}</span>
            <div><b>${escapeHtml(p.name)}</b><span>${p.sku} · ${p.time}</span></div>
          </div>`).join('')}
        ${photos.length ? `
        <div class="photo-grid" style="margin-top:8px">
          ${photos.map(p => `<div class="photo-thumb">${icon('camera', 16)}<b>${escapeHtml(p.label)}</b></div>`).join('')}
        </div>` : ''}

        ${j.notes ? `
        <div class="t-section-title">Job notes from office</div>
        <div class="ai-panel" style="border-left-color:#40506e">
          <p>${escapeHtml(j.notes)}</p>
        </div>` : ''}
      </div>`;
  }

  function renderJobs() {
    if (openJobId) return renderJobDetail(jobById(openJobId));
    const myJobs = DemoData.jobs.filter(j => j.assigned.includes(TECH_ID));
    return `
      <div class="t-section-title" style="margin-top:4px">My jobs</div>
      ${myJobs.map(renderJobCard).join('')}
    `;
  }

  function renderAssistant() {
    const suggestions = [
      'Where\'s my next appointment?',
      'NFPA smoke detector spacing?',
      'Do we have hold-up buttons in stock?',
      'Log: customer wants a camera quote',
    ];
    return `
      <div class="t-section-title" style="margin-top:4px">AI assistant</div>
      <div class="ai-panel" style="margin-bottom:14px">
        <div class="ai-tag">${icon('spark', 12)} Intel Assistant</div>
        <p>Ask about your schedule, job notes, parts stock, code requirements, or your hours. I can log notes to a job for the office — hands-free.</p>
      </div>
      <div class="chat-log" id="chat-scroll" style="max-height:340px;overflow-y:auto">
        ${AppState.chatLog.map(m => `<div class="chat-msg ${m.role}">${m.role === 'ai' ? m.text : escapeHtml(m.text)}</div>`).join('')}
      </div>
      <div class="chat-suggest">
        ${suggestions.map(s => `<button onclick="TechView.ask('${s.replace(/'/g, "\\'")}')">${s}</button>`).join('')}
      </div>
      <div class="chat-input-row">
        <input class="t-input" id="chat-input" placeholder="Ask anything…" onkeydown="if(event.key==='Enter')TechView.askFromInput()" />
        <button class="btn primary" onclick="TechView.askFromInput()">${icon('send', 14)}</button>
      </div>`;
  }

  function renderReport() {
    const doneCount = Object.values(AppState.completedTasks).filter(Boolean).length;

    let voiceBlock;
    if (recState === 'recording') {
      voiceBlock = `
        <div class="voice-card recording">
          <div class="rec-dot"></div>
          <div class="waveform">${Array.from({ length: 24 }, (_, i) => `<i style="animation-delay:${(i * 67) % 800}ms"></i>`).join('')}</div>
          <div class="voice-status">Listening… talk like you'd talk to a coworker</div>
        </div>`;
    } else if (recState === 'transcribing') {
      voiceBlock = `
        <div class="voice-card">
          <div class="voice-status"><span class="tdot"></span><span class="tdot"></span><span class="tdot"></span> &nbsp;Transcribing your voice note…</div>
        </div>`;
    } else {
      voiceBlock = `
        <button class="btn block voice-btn" onclick="TechView.startVoice()">${icon('mic', 15)} Dictate voice note</button>`;
    }

    return `
      <div class="t-section-title" style="margin-top:4px">End-of-day report</div>
      <div class="td-sub" style="color:#7d8590;font-size:.76rem;line-height:1.6;margin-bottom:14px">
        Talk or type rough notes — the AI turns them into a clean report for the office. Tasks, parts, photos, and verified hours attach automatically.
      </div>
      <div class="scan-row"><span class="s-ico">${icon('check', 14)}</span><div><b>${doneCount} tasks completed today</b><span>attached automatically</span></div></div>
      <div class="scan-row"><span class="s-ico">${icon('box', 14)}</span><div><b>${AppState.scannedParts.length} parts scanned</b><span>attached automatically</span></div></div>
      <div class="scan-row"><span class="s-ico">${icon('camera', 14)}</span><div><b>${AppState.photos.length} photos</b><span>attached automatically</span></div></div>
      <div class="scan-row"><span class="s-ico">${icon('clock', 14)}</span><div><b>Clock-in ${AppState.techClockInTime || '7:52 AM'} · GPS verified</b><span>attached automatically</span></div></div>

      <div class="t-section-title">Voice or text</div>
      ${voiceBlock}
      <div style="height:10px"></div>
      <textarea class="t-input" id="eod-notes" rows="5" placeholder="…or type rough notes here">${AppState.eodDraftNotes ? escapeHtml(AppState.eodDraftNotes) : ''}</textarea>
      <div style="height:10px"></div>
      <button class="btn primary block" onclick="TechView.generateSummary()">${icon('spark', 14)} Generate AI report</button>

      ${AppState.draftSummary ? `
        <div class="ai-panel" style="margin-top:14px">
          <div class="ai-tag">${icon('spark', 12)} AI-generated report</div>
          <p>${escapeHtml(AppState.draftSummary)}</p>
        </div>
        <div style="height:10px"></div>
        <button class="btn green block lg" onclick="TechView.submitReport()">${icon('send', 15)} Submit to office</button>
      ` : ''}
    `;
  }

  function tabButton(id, ico, label) {
    return `<button class="${tab === id ? 'active' : ''}" onclick="TechView.setTab('${id}')">
      ${icon(ico, 18)}${label}</button>`;
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
          <p>Each technician gets this app on a company phone. Clock-ins are GPS-verified against the job site, parts are scanned as they're used, and end-of-day reports take 30 seconds — they talk, AI writes.</p>
          <p style="margin-top:10px">Try it: dictate a voice note in <b>Report</b>, then check the office dashboard.</p>
          <button class="btn" onclick="App.go('admin')">Office dashboard ${icon('arrowRight', 13)}</button>
          <button class="btn" style="margin-top:8px" onclick="App.go('login')">${icon('chevronLeft', 13)} Back to start</button>
        </div>
        <div class="phone">
          <div class="notch"><i></i></div>
          <div class="phone-body">
            <div class="tech-topbar">
              <div class="who">
                <span class="avatar" style="background:${t.avatarColor}">${initials(t.name)}</span>
                <div><b>${t.name}</b><span>${t.role} · Intel Surveillance</span></div>
              </div>
              <span class="badge ${AppState.techClockedIn ? 'green' : 'gray'}" style="font-size:.6rem">${AppState.techClockedIn ? 'On clock' : 'Off'}</span>
            </div>
            ${body}
          </div>
          <div class="tabbar">
            ${tabButton('today', 'home', 'Today')}
            ${tabButton('jobs', 'briefcase', 'Jobs')}
            ${tabButton('assistant', 'spark', 'Assistant')}
            ${tabButton('report', 'file', 'Report')}
          </div>
        </div>
      </div>
      <div class="demo-banner">Demo · Intel Surveillance Field Platform by AutoNestLabs</div>
    `;
  }

  /* ---------- public API ---------- */
  return {
    render,
    clockToggle,
    toggleTask,
    scanPart,
    addPhoto,
    startVoice,
    generateSummary,
    submitReport,
    ask,
    askFromInput,
    setTab(id) { tab = id; if (id !== 'jobs') openJobId = null; render(); },
    openJob(id) { openJobId = id; tab = 'jobs'; render(); },
    closeJob() { openJobId = null; render(); },
  };
})();
