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
            <span class="mark">${icon('shield', 22)}</span>
            <div>
              <h1>Intel Surveillance</h1>
              <div class="lg-sub">Field Operations Platform &nbsp;·&nbsp; NY / NJ / PA / DE / MD / VA</div>
            </div>
          </div>

          <div class="login-head">One system for your crews, your jobs, and your money.</div>
          <div class="login-sub">
            Interactive demo prepared by AutoNestLabs. Two sides of the same platform —
            actions taken in the technician app appear live on the office dashboard.
          </div>

          <div class="role-grid">
            <button class="role-card admin" onclick="App.go('admin')">
              <div class="rc-top">
                <div class="icon">${icon('monitor', 20)}</div>
                <span class="rc-arrow">${icon('arrowRight', 18)}</span>
              </div>
              <h2>Office Dashboard</h2>
              <p>GPS-verified crew board with late-arrival costs, job risk scoring, AI-written field reports, sales pipeline on autopilot — and an AI analyst you can ask anything.</p>
              <span class="cta">Enter as William · Owner</span>
            </button>
            <button class="role-card tech" onclick="App.go('tech')">
              <div class="rc-top">
                <div class="icon">${icon('phone', 20)}</div>
                <span class="rc-arrow">${icon('arrowRight', 18)}</span>
              </div>
              <h2>Technician App</h2>
              <p>GPS clock-in, today's route, barcode part scanning, job photos — and end-of-day reports where the tech talks and AI writes. Assistant included.</p>
              <span class="cta">Enter as Marcus · Senior Technician</span>
            </button>
          </div>

          <div class="login-foot">
            Demo environment with sample data only — no real customer information.
            Everything you edit (inventory, jobs, leads, reports) is saved in this browser.
            <button class="link-btn" style="color:#7d9bea" onclick="resetDemoData()">Reset demo data</button>
          </div>
        </div>
      </div>
      <div class="demo-banner">Demo · Intel Surveillance Field Platform by AutoNestLabs</div>`;
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
