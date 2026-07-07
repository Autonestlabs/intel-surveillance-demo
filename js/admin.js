/* ============================================================
   Admin (office) dashboard — what William & his partner see.
   Includes the Intel AI copilot, live activity simulation,
   charts, sales pipeline, and automation center.
   ============================================================ */

const AdminView = (() => {

  let section = 'dashboard';   // dashboard | team | jobs | reports | inventory | sales
  let jobFilter = 'all';
  let modalJobId = null;
  let briefOpen = false;
  let copilotOpen = false;
  let copilotThinking = false;
  let bellOpen = false;
  let tickerHandle = null;
  let feedEvents = [];         // live activity feed entries
  let eventIdx = 0;

  /* ============================================================
     Intel AI copilot — canned intelligence
     ============================================================ */

  const COPILOT_PROMPTS = [
    'Who\'s been late this week?',
    'Which jobs are at risk?',
    'How is the Meridian project tracking?',
    'Revenue and unpaid invoices?',
    'Draft a follow-up email to Radford',
    'Where is my crew right now?',
  ];

  const COPILOT_ANSWERS = [
    {
      match: /late|slack|on.?time|showed up/i,
      html: `
        <p>Three techs had late arrivals in the last 30 days. Here's the cost picture:</p>
        <table class="mini-table">
          <tr><th>Tech</th><th>Lates</th><th>Time lost</th><th>Payroll cost</th></tr>
          <tr><td>James O'Neal</td><td class="red-txt">4</td><td>2.6 hrs</td><td>$91</td></tr>
          <tr><td>Kevin Drummond</td><td>3</td><td>1.4 hrs</td><td>$46</td></tr>
          <tr><td>Luis Mendez</td><td>2</td><td>0.9 hrs</td><td>$29</td></tr>
        </table>
        <p><b>$166 in paid-but-not-worked time this month</b>, and 2.4 of those hours were inside the Meridian 8–4 site window — that's schedule risk, not just payroll.</p>
        <p class="ai-reco">✦ Recommendation: James's lates are all Mondays. A 15-min earlier dispatch text on Sunday nights (I can automate it) usually clears this pattern.</p>`,
    },
    {
      match: /risk|behind|trouble|worried/i,
      html: `
        <p>Scanning all 7 open jobs against schedules, crew activity, and inspections:</p>
        <div class="risk-line red"><b>Brandywine Medical (DE)</b> — AHJ fire inspection isn't scheduled and target is Jul 9. I've drafted the inspection request; it needs your approval.</div>
        <div class="risk-line amber"><b>Meridian Warehouse (MD)</b> — 3 late arrivals this week cost 3.2 crew-hours inside a strict site window. Still on target <i>if</i> arrivals normalize.</div>
        <div class="risk-line amber"><b>Pulaski Metals (NJ)</b> — 3rd zone-14 fault in 6 months. Pattern points to water intrusion at the dock contact. Consider quoting a proper fix instead of another patch.</div>
        <p class="ai-reco">✦ Everything else is on track. Want me to send the Brandywine inspection request?</p>`,
    },
    {
      match: /meridian|warehouse|project track/i,
      html: `
        <p><b>Meridian Distribution Warehouse — 62% complete</b>, invoiced $74,560 of $186,400 (draw 3 outstanding).</p>
        <table class="mini-table">
          <tr><th>Phase</th><th>Status</th></tr>
          <tr><td>Rough-in & cable pulls</td><td class="green-txt">Done</td></tr>
          <tr><td>Fire alarm panel & devices</td><td class="green-txt">Done</td></tr>
          <tr><td>Access control (14 doors)</td><td>70%</td></tr>
          <tr><td>CCTV (32 cameras)</td><td>45%</td></tr>
          <tr><td>Programming & inspection</td><td>0%</td></tr>
        </table>
        <p>Forecast completion: <b>Aug 11 — three days ahead of target</b>, based on current daily task velocity. The main drag is late arrivals: 3.2 crew-hours lost this week inside the 8–4 access window.</p>
        <p class="ai-reco">✦ The lift is reserved Tue/Wed for dock cameras. If Tuesday slips, the CCTV phase loses a full week — I'll alert you at 8:05 AM if that crew isn't on site.</p>`,
    },
    {
      match: /revenue|invoice|unpaid|money|cash|billing/i,
      html: `
        <p>Last 5 weeks of completed-work revenue (in $k):</p>
        <div class="spark-wrap">${sparkBars(DemoData.trends.revenueK, DemoData.trends.weeks)}</div>
        <p><b>Outstanding: $54,220</b> across 3 invoices — $37,280 of it is the Meridian draw 3 (sent Jun 30, terms net-30, nothing to worry about yet).</p>
        <p><b class="red-txt">Overdue: $6,240</b> — Osprey Marine Supply, 24 days past due.</p>
        <p class="ai-reco">✦ I can send Osprey a polite past-due reminder with a payment link right now — historically that recovers 80% of stale invoices within a week. Want it sent?</p>`,
    },
    {
      match: /draft|email|write|follow.?up to/i,
      html: `
        <p>Here's a draft for Radford Properties after today's walkthrough:</p>
        <div class="email-draft">
          <div class="ed-line"><b>To:</b> s.hendricks@radfordproperties.com</div>
          <div class="ed-line"><b>Subject:</b> Bldg C system live — training this Thursday?</div>
          <div class="ed-body">Hi Sarah,<br><br>Great walking the finished system with you today — all six doors are live and the 42 staff fobs are active. As discussed, we'd love to run a 30-minute training session for your front-desk team. Would Thursday at 10 AM work?<br><br>Your closeout packet (as-builts, user codes, warranty) is attached. Anything at all, call us direct.<br><br>— William Adams, Intel Surveillance</div>
        </div>
        <p class="ai-reco">✦ In the full build this sends from your email with the closeout PDF attached automatically. Edit anything and hit send.</p>`,
    },
    {
      match: /crew|where|right now|who.?s (on|at)/i,
      html: `
        <p>Live picture as of ${nowTimeString()}:</p>
        <table class="mini-table">
          <tr><th>Tech</th><th>Status</th><th>Location</th></tr>
          <tr><td>Dana, James, Luis, Jordan</td><td class="green-txt">On site</td><td>Meridian Warehouse, Baltimore</td></tr>
          <tr><td>Marcus, Sam</td><td class="green-txt">On site</td><td>First Harbor Bank, Baltimore</td></tr>
          <tr><td>Kevin</td><td class="green-txt">On site</td><td>Brandywine Medical, Wilmington</td></tr>
          <tr><td>Chris</td><td class="green-txt">On site</td><td>Radford Bldg C, Arlington</td></tr>
          <tr><td>Angela</td><td class="amber-txt">En route</td><td>ETA 9:40 — Pulaski Metals, Kearny</td></tr>
          <tr><td>Terrence</td><td>Off</td><td>—</td></tr>
        </table>
        <p class="ai-reco">✦ All on-site techs are GPS-verified inside their job geofences. James arrived 47 min late — already flagged on your dashboard.</p>`,
    },
    {
      match: /tomorrow|this week|schedule/i,
      html: `
        <p>The rest of this week at a glance:</p>
        <table class="mini-table">
          <tr><th>Day</th><th>Highlights</th></tr>
          <tr><td>Tue</td><td>Meridian (lift day — dock cameras), First Harbor cont., Brandywine</td></tr>
          <tr><td>Wed</td><td>Goldstein & Rowe jewelers 7 AM start (UL cert), Meridian</td></tr>
          <tr><td>Thu</td><td>First Harbor central-station cutover, Radford staff training (proposed)</td></tr>
          <tr><td>Fri</td><td>Susquehanna Dental 2 PM, weekly wrap — your Friday brief auto-generates at 4 PM</td></tr>
        </table>
        <p class="ai-reco">✦ One conflict watch: if Goldstein runs past 10 AM Wednesday, Chris can't make it back for the Meridian lift window. I'll re-route Luis if that happens.</p>`,
    },
  ];

  const COPILOT_FALLBACK = `
    <p>In the full build I'm connected to every part of your business — time clocks, GPS, job progress, inventory, invoices, your monitoring stations, and your sales pipeline.</p>
    <p>Try one of the suggestions below, or ask things like <i>"compare this month to last"</i>, <i>"who should I send to the jewelry store job?"</i>, or <i>"approve the panel purchase order."</i></p>`;

  function copilotAsk(q) {
    AppState.copilotLog.push({ role: 'user', html: escapeHtml(q) });
    saveState();
    copilotThinking = true;
    render();
    scrollCopilot();
    setTimeout(() => {
      const found = COPILOT_ANSWERS.find(a => a.match.test(q));
      AppState.copilotLog.push({ role: 'ai', html: (found ? found.html : COPILOT_FALLBACK) });
      copilotThinking = false;
      saveState();
      render();
      scrollCopilot();
    }, 900 + Math.random() * 600);
  }

  function copilotAskInput() {
    const el = document.getElementById('copilot-input');
    if (el && el.value.trim()) copilotAsk(el.value.trim());
  }

  function scrollCopilot() {
    requestAnimationFrame(() => {
      const log = document.getElementById('copilot-log');
      if (log) log.scrollTop = log.scrollHeight;
    });
  }

  function renderCopilot() {
    if (!copilotOpen) return `
      <button class="copilot-fab" onclick="AdminView.toggleCopilot()">✦ Ask Intel AI</button>`;
    return `
      <div class="copilot-drawer">
        <div class="cp-head">
          <div class="cp-title"><span class="cp-orb"></span><div><b>Intel AI</b><span>connected to jobs · time · GPS · billing · inventory</span></div></div>
          <button class="m-close" onclick="AdminView.toggleCopilot()">✕</button>
        </div>
        <div class="cp-log" id="copilot-log">
          ${AppState.copilotLog.length === 0 ? `
            <div class="cp-msg ai">
              <p>Morning, William. Quick read on today:</p>
              <p>• 9 techs clocked in — <b>1 late arrival flagged</b> (James, 47 min, Meridian)<br>
                 • Radford walkthrough at 1 PM → invoice auto-drafts on sign-off<br>
                 • 1 job needs attention: <b>Brandywine inspection isn't booked</b><br>
                 • Osprey Marine is 24 days overdue on $6,240</p>
              <p>Ask me anything about the business.</p>
            </div>` : ''}
          ${AppState.copilotLog.map(m => `<div class="cp-msg ${m.role}">${m.role === 'user' ? m.html : m.html}</div>`).join('')}
          ${copilotThinking ? '<div class="cp-msg ai thinking"><span class="tdot"></span><span class="tdot"></span><span class="tdot"></span></div>' : ''}
        </div>
        <div class="cp-suggest">
          ${COPILOT_PROMPTS.map(p => `<button onclick="AdminView.copilotAsk('${p.replace(/'/g, "\\'")}')">${p}</button>`).join('')}
        </div>
        <div class="cp-input-row">
          <input id="copilot-input" placeholder="Ask about jobs, crew, money…" onkeydown="if(event.key==='Enter')AdminView.copilotAskInput()" />
          <button class="btn primary" onclick="AdminView.copilotAskInput()">➤</button>
        </div>
      </div>`;
  }

  /* ============================================================
     Charts (hand-rolled SVG)
     ============================================================ */

  function sparkBars(values, labels, colorVar) {
    const max = Math.max(...values) * 1.15;
    const w = 260, h = 90, gap = 10;
    const bw = (w - gap * (values.length - 1)) / values.length;
    const bars = values.map((v, i) => {
      const bh = Math.max(4, (v / max) * (h - 24));
      const x = i * (bw + gap);
      const last = i === values.length - 1;
      return `
        <rect x="${x}" y="${h - 16 - bh}" width="${bw}" height="${bh}" rx="4"
          fill="${last ? 'var(--blue)' : 'var(--slate-200)'}"></rect>
        <text x="${x + bw / 2}" y="${h - 20 - bh}" text-anchor="middle" font-size="10" font-weight="700" fill="${last ? 'var(--blue)' : 'var(--slate-400)'}">${v}</text>
        <text x="${x + bw / 2}" y="${h - 3}" text-anchor="middle" font-size="8.5" fill="var(--slate-400)">${labels[i]}</text>`;
    }).join('');
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w + 40}px">${bars}</svg>`;
  }

  function trendLine(values, labels, good) {
    const max = Math.max(...values) * 1.1, min = Math.min(...values) * .85;
    const w = 260, h = 90;
    const pts = values.map((v, i) => {
      const x = 14 + i * ((w - 28) / (values.length - 1));
      const y = 12 + (1 - (v - min) / (max - min)) * (h - 40);
      return { x, y, v };
    });
    const path = pts.map((p, i) => (i ? 'L' : 'M') + p.x + ',' + p.y).join(' ');
    return `
      <svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:300px">
        <path d="${path}" fill="none" stroke="${good ? 'var(--green)' : 'var(--red)'}" stroke-width="2.5" stroke-linecap="round"/>
        ${pts.map((p, i) => `
          <circle cx="${p.x}" cy="${p.y}" r="${i === pts.length - 1 ? 4.5 : 3}" fill="${good ? 'var(--green)' : 'var(--red)'}"/>
          <text x="${p.x}" y="${p.y - 9}" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--slate-700)">${p.v}</text>
          <text x="${p.x}" y="${h - 3}" text-anchor="middle" font-size="8.5" fill="var(--slate-400)">${labels[i]}</text>`).join('')}
      </svg>`;
  }

  /* ============================================================
     Live activity ticker
     ============================================================ */

  function startTicker() {
    stopTicker();
    tickerHandle = setInterval(() => {
      if (section !== 'dashboard' || !document.getElementById('live-feed')) return;
      const ev = DemoData.liveEvents[eventIdx % DemoData.liveEvents.length];
      eventIdx++;
      feedEvents.unshift({ ...ev, time: nowTimeString() });
      feedEvents = feedEvents.slice(0, 7);
      const feed = document.getElementById('live-feed');
      if (feed) feed.innerHTML = feedHtml();
    }, 6000);
  }

  function stopTicker() { if (tickerHandle) { clearInterval(tickerHandle); tickerHandle = null; } }

  function feedHtml() {
    if (!feedEvents.length) return '<div class="empty-note">Listening for field activity…</div>';
    return feedEvents.map((e, i) => `
      <div class="feed-row ${i === 0 ? 'fresh' : ''}">
        <span class="f-ico">${e.icon}</span>
        <div>${escapeHtml(e.text)}<div class="a-time">${e.time}</div></div>
      </div>`).join('');
  }

  /* ============================================================
     Count-up animation
     ============================================================ */

  function animateCounts() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      const dur = 700; const t0 = performance.now();
      function step(t) {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ============================================================
     AI daily brief (typed)
     ============================================================ */

  const DAILY_BRIEF = 'Good morning, William. 9 of 10 techs are clocked in and GPS-verified. One exception: James O\'Neal arrived 47 minutes late at Meridian — that\'s his 4th this month, costing you about $91 in paid-but-not-worked time. Meridian is 62% done and forecast to finish 3 days early if arrivals hold. Radford\'s final walkthrough is at 1 PM; the invoice will draft itself on sign-off. One action needed: approve the Brandywine inspection request before Wednesday.';

  function typeBrief() {
    const el = document.getElementById('brief-text');
    if (!el || el.dataset.typed) return;
    el.dataset.typed = '1';
    const words = DAILY_BRIEF.split(' ');
    let i = 0;
    const h = setInterval(() => {
      if (!document.getElementById('brief-text')) { clearInterval(h); return; }
      i += 3;
      el.textContent = words.slice(0, i).join(' ');
      if (i >= words.length) { clearInterval(h); el.textContent = DAILY_BRIEF; }
    }, 55);
  }

  /* ============================================================
     Small pieces
     ============================================================ */

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
          <b>Hours:</b> ${r.hours.toFixed(1)} &nbsp;·&nbsp; <b>Materials:</b> ${r.materials.length ? r.materials.map(escapeHtml).join(', ') : 'none logged'} &nbsp;·&nbsp; <b>Photos:</b> ${r.photos || 0} &nbsp;·&nbsp; <b>Issues:</b> ${escapeHtml(r.issues)}
        </div>
      </div>`;
  }

  /* ============================================================
     Sections
     ============================================================ */

  function renderDashboard() {
    const techs = DemoData.technicians;
    const working = techs.filter(t => t.status !== 'off');
    const onSite = techs.filter(t => t.status === 'on-site').length;
    const late = techs.filter(t => t.status === 'late').length;
    const activeJobs = DemoData.jobs.filter(j => j.status === 'in-progress').length;
    const scheduled = DemoData.jobs.filter(j => j.status === 'scheduled').length;
    const reports = allReports();
    const big = jobById('j1');
    const tr = DemoData.trends;

    return `
      <div class="brief-card">
        <div class="brief-head">
          <span class="cp-orb"></span><b>AI Daily Brief</b>
          <span class="brief-date">${todayString()} · generated 8:05 AM</span>
          <button class="btn ghost" style="margin-left:auto" onclick="AdminView.openBrief()">✦ Weekly Owner Report</button>
        </div>
        <p id="brief-text" class="brief-text"></p>
      </div>

      <div class="stat-grid">
        <div class="card stat-card">
          <div class="s-label">Techs On Site</div>
          <div class="s-value"><span data-count="${onSite}">0</span><span style="font-size:1rem;color:var(--slate-400)">/${working.length}</span></div>
          <div class="s-note green">All GPS-verified at job sites</div>
        </div>
        <div class="card stat-card">
          <div class="s-label">Late Arrivals Today</div>
          <div class="s-value" style="color:${late ? 'var(--red)' : 'var(--green)'}"><span data-count="${late}">0</span></div>
          <div class="s-note ${late ? 'red' : 'green'}">${late ? 'J. O\'Neal — 47 min late at Meridian' : 'Everyone on time'}</div>
        </div>
        <div class="card stat-card">
          <div class="s-label">Hours Lost This Week</div>
          <div class="s-value" style="color:var(--amber)"><span data-count="0.8">0</span></div>
          <div class="s-note green">↓ from 8.2 three weeks ago</div>
        </div>
        <div class="card stat-card">
          <div class="s-label">Active / Scheduled Jobs</div>
          <div class="s-value"><span data-count="${activeJobs}">0</span><span style="font-size:1rem;color:var(--slate-400)"> / ${scheduled}</span></div>
          <div class="s-note">$280k in open contract value</div>
        </div>
      </div>

      <div class="chart-row">
        <div class="card chart-card">
          <h3>On-time arrivals %</h3>
          ${trendLine(tr.onTimePct, tr.weeks, true)}
          <div class="chart-note green">↑ 91% this week — up 13 pts since tracking started</div>
        </div>
        <div class="card chart-card">
          <h3>Payroll hours lost to lates</h3>
          ${trendLine(tr.hoursLost, tr.weeks, false)}
          <div class="chart-note green">0.8 hrs this week ≈ $28 — was costing ~$290/wk</div>
        </div>
        <div class="card chart-card">
          <h3>Weekly revenue ($k)</h3>
          ${sparkBars(tr.revenueK, tr.weeks)}
          <div class="chart-note">$88k this week · $54k invoiced & outstanding</div>
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
                <h4>${escapeHtml(big.name)} ${riskBadge(big)}</h4>
                <div class="ph-meta">${escapeHtml(big.system)} · ${escapeHtml(big.address)}</div>
                <div class="ph-meta" style="color:var(--amber);font-weight:600">⏰ ${escapeHtml(big.window)}</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.5rem;font-weight:800">${big.progress}%</div>
                <div style="font-size:.72rem;color:var(--slate-500);font-weight:600">AI forecast: Aug 11 · 3 days early</div>
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
            <h3><span class="live-dot-wrap"><span class="pulse"></span> Live Field Activity</span></h3>
            <div id="live-feed">${feedHtml()}</div>
          </div>
          <div class="card">
            <h3>Alerts & Exceptions</h3>
            ${DemoData.alerts.map(a => `
              <div class="alert-row ${a.level}">
                <span class="a-dot"></span>
                <div>${escapeHtml(a.text)}<div class="a-time">${a.time}</div></div>
              </div>`).join('')}
          </div>
          <div class="card">
            <h3>Latest Field Reports <button class="link-btn" onclick="AdminView.setSection('reports')">All →</button></h3>
            ${reports.slice(0, 1).map(reportCard).join('')}
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
        <div class="map-pin tech-dot" style="left:47%;top:57%"><span class="p-dot moving"></span><span class="p-label">A. Park — en route to Pulaski</span></div>
        <div class="map-legend">
          <span><i style="background:var(--green)"></i>In progress</span>
          <span><i style="background:var(--amber)"></i>Scheduled</span>
          <span><i style="background:var(--slate-400)"></i>Completed</span>
          <span><i style="background:var(--blue)"></i>Tech (live GPS)</span>
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
          <h3>Payroll Preview — Week of Jul 6 <span class="badge blue">exports to QuickBooks</span></h3>
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

  function renderGantt() {
    const days = ['Mon 6', 'Tue 7', 'Wed 8', 'Thu 9', 'Fri 10'];
    return `
      <div class="card" style="margin-top:16px">
        <h3>This Week — Crew Timeline</h3>
        <div class="gantt">
          <div class="g-row g-head">
            <div class="g-label"></div>
            ${days.map(d => `<div class="g-day">${d}</div>`).join('')}
          </div>
          ${DemoData.weekPlan.map(w => {
            const j = jobById(w.jobId);
            const colors = { 'in-progress': 'var(--green)', scheduled: 'var(--amber)', completed: 'var(--slate-400)' };
            return `
            <div class="g-row">
              <div class="g-label" title="${escapeHtml(j.name)}">${escapeHtml(j.name.length > 26 ? j.name.slice(0, 25) + '…' : j.name)}<span>${w.crew}</span></div>
              <div class="g-track">
                <div class="g-bar" style="left:${w.from * 20}%;width:${(w.to - w.from + 1) * 20}%;background:${colors[j.status] || 'var(--blue)'}"
                     onclick="AdminView.openJob('${j.id}')"></div>
              </div>
            </div>`;
          }).join('')}
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
          <thead><tr><th>Job</th><th>Type</th><th>Status</th><th>AI Risk</th><th>Progress</th><th>Crew</th><th>Value</th></tr></thead>
          <tbody>
            ${jobs.map(j => `
              <tr class="clickable" onclick="AdminView.openJob('${j.id}')">
                <td><b style="font-size:.85rem">${escapeHtml(j.name)}</b><div style="font-size:.72rem;color:var(--slate-500)">${escapeHtml(j.address)}</div></td>
                <td><span class="badge ${j.type === 'Project' ? 'blue' : j.type === 'Service' ? 'amber' : 'gray'}">${j.type}</span></td>
                <td>${App.statusBadge(j.status)}</td>
                <td>${riskBadge(j) || '<span style="color:var(--slate-300)">—</span>'}</td>
                <td style="min-width:100px">
                  <div class="progress-track"><div class="progress-fill ${j.progress === 100 ? 'green' : ''}" style="width:${j.progress}%"></div></div>
                  <div style="font-size:.7rem;color:var(--slate-500);margin-top:3px">${j.progress}%</div>
                </td>
                <td style="font-size:.78rem">${j.assigned.map(id => techById(id).name.split(' ')[0]).join(', ') || '—'}</td>
                <td class="mono" style="font-weight:600">${j.value}</td>
              </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
      ${renderGantt()}
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
            <div class="alert-row info"><span class="a-dot"></span><div>Every report auto-attaches verified hours, tasks completed, photos, and parts used — you know what happened on every job, every day.</div></div>
            <div class="alert-row info"><span class="a-dot"></span><div>Reports roll up per job — when the GC or the customer asks "where are we?", the answer is one click.</div></div>
          </div>
          <div class="card">
            <h3>Try it live</h3>
            <p style="font-size:.83rem;color:var(--slate-500);line-height:1.6;margin-bottom:14px">
              Open the technician app, dictate a voice note, and submit a report — it appears here instantly.
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
                  <td>${i.stock < i.min ? '<span class="badge red">low — PO drafted</span>' : '<span class="badge green">ok</span>'}</td>
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
            <h3>Draft Purchase Order <span class="badge amber">awaiting approval</span></h3>
            <div class="table-wrap"><table class="data">
              <tbody>
                <tr><td>6× Honeywell VISTA-21iP Panel</td><td class="mono">$1,008</td></tr>
                <tr><td>4× Cat6 Plenum 1000ft Spool</td><td class="mono">$840</td></tr>
                <tr><td style="font-weight:700">Total — ADI Baltimore branch</td><td class="mono" style="font-weight:700">$1,848</td></tr>
              </tbody>
            </table></div>
            <div style="height:10px"></div>
            <button class="btn green" onclick="App.toast('✅ PO-1077 approved and emailed to ADI — demo action')">Approve & Send PO</button>
            <button class="btn ghost" onclick="App.toast('PO snoozed — I\\'ll re-check stock Friday')">Snooze</button>
          </div>
        </div>
      </div>`;
  }

  function renderSales() {
    const rules = AppState.autoRules;
    const ruleDefs = [
      { key: 'nurture',   label: 'AI lead nurture', desc: 'Instant reply to new inquiries, smart follow-ups until they book or decline' },
      { key: 'checkin12', label: '12-month system check-ins', desc: 'Annual "how\'s the system?" email — books service & upsells' },
      { key: 'reviews',   label: 'Review requests', desc: 'Google review link after every signed-off job' },
      { key: 'faults',    label: 'Fault → service ticket', desc: 'Monitoring-station faults auto-create service calls' },
      { key: 'invoicing', label: 'Auto-invoicing', desc: 'Invoice drafts from completed jobs, sent after your approval' },
      { key: 'po',        label: 'Auto purchase orders', desc: 'Send POs without approval when stock dips below minimum' },
    ];
    return `
      <div class="kanban">
        ${DemoData.pipeline.map(col => `
          <div class="k-col">
            <div class="k-head" style="border-color:${col.color}"><b>${col.stage}</b><span>${col.leads.length}</span></div>
            ${col.leads.map(l => `
              <div class="k-card">
                <b>${escapeHtml(l.company)}</b>
                <div class="k-meta">${escapeHtml(l.contact)} · <b>${escapeHtml(l.value)}</b></div>
                <div class="k-src">${escapeHtml(l.source)}</div>
                <div class="k-ai">✦ ${escapeHtml(l.ai)}</div>
              </div>`).join('')}
          </div>`).join('')}
      </div>

      <div class="grid-2" style="margin-top:16px">
        <div class="card">
          <h3>Automation Activity</h3>
          ${DemoData.automations.map(a => `
            <div class="auto-row">
              <span class="auto-ico">${a.icon}</span>
              <div><b>${escapeHtml(a.title)}</b> <span class="badge gray">${a.tag}</span>
                <div class="auto-detail">${escapeHtml(a.detail)}</div>
                <div class="a-time">${a.time}</div>
              </div>
            </div>`).join('')}
        </div>
        <div class="stack">
          <div class="card">
            <h3>Automation Rules</h3>
            ${ruleDefs.map(r => `
              <div class="rule-row">
                <div><b>${r.label}</b><div class="auto-detail">${r.desc}</div></div>
                <button class="toggle ${rules[r.key] ? 'on' : ''}" onclick="AdminView.toggleRule('${r.key}')"><span></span></button>
              </div>`).join('')}
          </div>
          <div class="card">
            <h3>Invoices</h3>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                ${DemoData.invoices.map(iv => `
                  <tr>
                    <td class="mono" style="font-size:.76rem">${iv.id}<div style="color:var(--slate-400);font-size:.68rem">${iv.date}</div></td>
                    <td style="font-size:.8rem">${escapeHtml(iv.client)}<div style="font-size:.7rem;color:var(--slate-500)">${escapeHtml(iv.job)}</div></td>
                    <td class="mono" style="font-weight:700">${iv.amount}</td>
                    <td>${iv.status === 'paid' ? '<span class="badge green">paid</span>' : iv.status === 'sent' ? '<span class="badge blue">sent</span>' : '<span class="badge red">overdue 24d</span>'}</td>
                  </tr>`).join('')}
              </tbody>
            </table></div>
            <div style="height:8px"></div>
            <button class="btn ghost" onclick="App.toast('📨 Past-due reminder with payment link sent to Osprey Marine — demo action')">✦ Nudge Osprey (overdue)</button>
          </div>
        </div>
      </div>`;
  }

  /* ============================================================
     Weekly owner brief modal
     ============================================================ */

  function renderBriefModal() {
    if (!briefOpen) return '';
    return `
      <div class="modal-overlay" onclick="if(event.target===this)AdminView.closeBrief()">
        <div class="modal">
          <div class="m-head">
            <h2>✦ Weekly Owner Report — Week of Jun 29</h2>
            <button class="m-close" onclick="AdminView.closeBrief()">✕</button>
          </div>
          <div class="m-sub">Auto-generated every Friday 4 PM · emailed to you and your partner</div>

          <div class="m-section"><h4>The week in one paragraph</h4>
            <p style="font-size:.87rem;line-height:1.65">Strong week: <b>$102k billed</b>, the best in five weeks. On-time arrivals hit 85% (up from 74%), recovering roughly <b>$260/week in payroll leakage</b>. Meridian crossed 60% and remains ahead of schedule. Ironbound Cold Storage closed out clean and the final invoice is out. One watch item going into next week: Brandywine's fire inspection still isn't booked.</p>
          </div>

          <div class="m-section"><h4>Numbers</h4>
            <div class="kv-grid">
              <div class="kv"><b>Revenue billed</b><span>$102,400 (↑ 51% wk/wk)</span></div>
              <div class="kv"><b>Jobs completed</b><span>4 (3 install, 1 service)</span></div>
              <div class="kv"><b>Verified crew hours</b><span>312.5 · 97.2% utilization</span></div>
              <div class="kv"><b>Payroll flagged</b><span>3.0 hrs late-arrival loss ($105)</span></div>
              <div class="kv"><b>New leads</b><span>5 — AI responded to all within 15 min</span></div>
              <div class="kv"><b>Reviews collected</b><span>2 × ★★★★★ (Calvert, Ironbound)</span></div>
            </div>
          </div>

          <div class="m-section"><h4>AI recommendations</h4>
            <div class="alert-row warn"><span class="a-dot"></span><div>James O'Neal's late pattern is Mondays — enable the Sunday-night dispatch reminder automation.</div></div>
            <div class="alert-row warn"><span class="a-dot"></span><div>Pulaski Metals: quote a permanent dock-contact fix (~$1,400) instead of a third patch visit. Historic margin on repeat-fault fixes: 61%.</div></div>
            <div class="alert-row info"><span class="a-dot"></span><div>Annandale Surgical quote ($31,200) viewed 4× — decision window is now. A personal call from you beats another email.</div></div>
          </div>

          <div class="m-section" style="display:flex;gap:8px">
            <button class="btn primary" onclick="App.toast('📧 Report emailed to you and your partner — demo action')">Email me this every Friday</button>
            <button class="btn ghost" onclick="AdminView.closeBrief()">Close</button>
          </div>
        </div>
      </div>`;
  }

  /* ============================================================
     Job modal
     ============================================================ */

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
          ${App.statusBadge(j.status)} <span class="badge blue">${j.type}</span> <span class="badge gray">${j.state}</span> ${riskBadge(j)}
          ${j.risk && j.risk.level !== 'ok' ? `<div class="risk-callout ${j.risk.level}">✦ <b>AI:</b> ${escapeHtml(j.risk.reason)}</div>` : ''}
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

  /* ============================================================
     Shell
     ============================================================ */

  const NAV = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'team',      icon: '⏱️', label: 'Team & Time' },
    { id: 'jobs',      icon: '🗂️', label: 'Jobs & Schedule' },
    { id: 'reports',   icon: '📝', label: 'Field Reports' },
    { id: 'sales',     icon: '🤖', label: 'Sales & Automations' },
    { id: 'inventory', icon: '📦', label: 'Inventory' },
  ];

  const TITLES = {
    dashboard: ['Operations Dashboard', 'Live view of your crews, jobs, and exceptions'],
    team:      ['Team & Time Tracking', 'GPS-verified clock-ins, late-arrival flags, and payroll-ready hours'],
    jobs:      ['Jobs & Schedule', 'Every project and service call across NY · NJ · PA · DE · MD · VA'],
    reports:   ['Field Reports', 'AI-written end-of-day reports from every tech, every day'],
    sales:     ['Sales & Automations', 'AI works your leads, follow-ups, reviews, and invoices while your crews work the jobs'],
    inventory: ['Inventory', 'Barcode-scanned usage in the field, live stock at the warehouse'],
  };

  function renderBell() {
    return `
      <div class="bell-wrap">
        <button class="bell-btn" onclick="AdminView.toggleBell()">🔔<span class="bell-count">3</span></button>
        ${bellOpen ? `
        <div class="bell-drop">
          <div class="bell-item danger">⏰ James O'Neal — 47 min late at Meridian <span>8:47 AM</span></div>
          <div class="bell-item warn">📦 2 parts below minimum — PO drafted <span>8:15 AM</span></div>
          <div class="bell-item warn">🧾 Osprey Marine invoice 24 days overdue <span>Today</span></div>
        </div>` : ''}
      </div>`;
  }

  function render() {
    let body = '';
    if (section === 'dashboard') body = renderDashboard();
    else if (section === 'team') body = renderTeam();
    else if (section === 'jobs') body = renderJobs();
    else if (section === 'reports') body = renderReports();
    else if (section === 'sales') body = renderSales();
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
            <div style="display:flex;align-items:center;gap:10px">
              ${renderBell()}
              <div class="header-live"><span class="pulse"></span> Live — ${DemoData.technicians.filter(t => t.clockIn && t.status !== 'off').length} techs clocked in</div>
            </div>
          </div>
          ${body}
        </main>
      </div>
      ${renderCopilot()}
      ${renderModal()}
      ${renderBriefModal()}
      <div class="demo-banner">DEMO — Intel Surveillance Field Platform by AutoNestLabs</div>
    `;

    if (section === 'dashboard') {
      animateCounts();
      typeBrief();
      if (!tickerHandle) startTicker();
    }
  }

  return {
    render,
    setSection(id) { section = id; modalJobId = null; bellOpen = false; render(); window.scrollTo(0, 0); },
    setJobFilter(f) { jobFilter = f; render(); },
    openJob(id) { modalJobId = id; render(); },
    closeJob() { modalJobId = null; render(); },
    openBrief() { briefOpen = true; render(); },
    closeBrief() { briefOpen = false; render(); },
    toggleCopilot() { copilotOpen = !copilotOpen; render(); scrollCopilot(); },
    toggleBell() { bellOpen = !bellOpen; render(); },
    toggleRule(key) {
      AppState.autoRules[key] = !AppState.autoRules[key];
      saveState();
      App.toast(AppState.autoRules[key] ? '✅ Automation enabled' : 'Automation paused');
      render();
    },
    copilotAsk,
    copilotAskInput,
    stopTicker,
  };
})();
