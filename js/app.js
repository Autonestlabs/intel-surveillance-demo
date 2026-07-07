/* ============================================================
   App shell — routing between login / admin / technician views.
   ============================================================ */

const App = (() => {

  function statusBadge(status) {
    switch (status) {
      case 'in-progress': return '<span class="badge green"><span class="dot"></span>In progress</span>';
      case 'scheduled':   return '<span class="badge amber"><span class="dot"></span>Scheduled</span>';
      case 'completed':   return '<span class="badge gray">Completed</span>';
      default:            return '';
    }
  }

  function toast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function renderLogin() {
    document.getElementById('app').innerHTML = `
      <div class="login-screen">
        <div class="login-card">
          <div class="login-logo">
            <span class="shield">🛡️</span>
            <h1>Intel Surveillance</h1>
          </div>
          <div class="login-sub">Field Operations Platform — commercial alarm, fire & CCTV across NY · NJ · PA · DE · MD · VA</div>
          <div style="height:14px"></div>
          <span class="login-demo-note">INTERACTIVE DEMO · PREPARED BY AUTONESTLABS</span>

          <div class="role-grid">
            <button class="role-card admin" onclick="App.go('admin')">
              <div class="icon">🖥️</div>
              <h2>Office Dashboard</h2>
              <p>Live GPS-verified crew board, late-arrival alerts with payroll cost, AI daily brief, job risk scoring, sales pipeline on autopilot — plus <b>Intel AI</b>: ask your business anything.</p>
              <span class="cta">Enter as William (Owner) →</span>
            </button>
            <button class="role-card tech" onclick="App.go('tech')">
              <div class="icon">📱</div>
              <h2>Technician App</h2>
              <p>GPS clock-in, today's jobs, barcode part scanning, photos — and end-of-day reports where the tech <b>talks and AI writes</b>. Plus an assistant that knows the schedule, stock, and fire code.</p>
              <span class="cta">Enter as Marcus (Senior Tech) →</span>
            </button>
          </div>

          <div class="login-foot">
            Demo data only — no real customer information. Clock-ins, scans, and reports you make in the tech app
            appear live on the office dashboard.
          </div>
        </div>
      </div>`;
  }

  function go(view) {
    location.hash = view === 'login' ? '/' : '/' + view;
  }

  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    if (h !== 'admin' && typeof AdminView !== 'undefined') AdminView.stopTicker();
    if (h === 'admin') AdminView.render();
    else if (h === 'tech') TechView.render();
    else renderLogin();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);

  return { go, toast, statusBadge };
})();
