/* ============================================================
   Intel Surveillance — Demo Data Layer
   All data is mock/demo data. State persists in localStorage
   so clock-ins and reports survive a page refresh.
   ============================================================ */

const IS_STORE_KEY = 'intel-surveillance-demo-v1';

const DemoData = {

  company: {
    name: 'Intel Surveillance',
    tagline: 'Commercial Alarm & Fire Systems',
    states: ['NY', 'NJ', 'PA', 'DE', 'MD', 'VA'],
  },

  technicians: [
    { id: 't1', name: 'Marcus Rivera',   role: 'Senior Technician', level: 'Skilled',  phone: '(410) 555-0141', avatarColor: '#2563eb',
      status: 'on-site', clockIn: '7:52 AM', geofence: 'verified', currentJobId: 'j2', weekHours: 32.5, lateCount30d: 0 },
    { id: 't2', name: 'Dana Whitfield',  role: 'Senior Technician', level: 'Skilled',  phone: '(443) 555-0178', avatarColor: '#7c3aed',
      status: 'on-site', clockIn: '7:58 AM', geofence: 'verified', currentJobId: 'j1', weekHours: 33.0, lateCount30d: 1 },
    { id: 't3', name: 'James O\'Neal',   role: 'Senior Technician', level: 'Skilled',  phone: '(301) 555-0126', avatarColor: '#dc2626',
      status: 'late',    clockIn: '8:47 AM', geofence: 'verified', currentJobId: 'j1', weekHours: 29.0, lateCount30d: 4 },
    { id: 't4', name: 'Chris Boone',     role: 'Senior Technician', level: 'Skilled',  phone: '(215) 555-0163', avatarColor: '#059669',
      status: 'on-site', clockIn: '7:45 AM', geofence: 'verified', currentJobId: 'j4', weekHours: 34.5, lateCount30d: 0 },
    { id: 't5', name: 'Angela Park',     role: 'Senior Technician', level: 'Skilled',  phone: '(703) 555-0192', avatarColor: '#d97706',
      status: 'en-route', clockIn: '8:02 AM', geofence: 'en route — ETA 9:40 AM', currentJobId: 'j6', weekHours: 31.0, lateCount30d: 1 },
    { id: 't6', name: 'Terrence Cole',   role: 'Senior Technician', level: 'Skilled',  phone: '(302) 555-0157', avatarColor: '#0891b2',
      status: 'off',     clockIn: null,      geofence: null, currentJobId: null, weekHours: 24.0, lateCount30d: 0 },
    { id: 't7', name: 'Luis Mendez',     role: 'Technician II',     level: 'Developing', phone: '(410) 555-0119', avatarColor: '#4f46e5',
      status: 'on-site', clockIn: '7:55 AM', geofence: 'verified', currentJobId: 'j1', weekHours: 32.0, lateCount30d: 2 },
    { id: 't8', name: 'Kevin Drummond',  role: 'Technician II',     level: 'Developing', phone: '(908) 555-0184', avatarColor: '#be185d',
      status: 'on-site', clockIn: '8:06 AM', geofence: 'verified', currentJobId: 'j5', weekHours: 30.5, lateCount30d: 3 },
    { id: 't9', name: 'Sam Whitaker',    role: 'Apprentice',        level: 'Training', phone: '(410) 555-0102', avatarColor: '#64748b',
      status: 'on-site', clockIn: '7:52 AM', geofence: 'verified', currentJobId: 'j2', weekHours: 32.5, lateCount30d: 0 },
    { id: 't10', name: 'Jordan Ellis',   role: 'Apprentice',        level: 'Training', phone: '(240) 555-0138', avatarColor: '#78716c',
      status: 'on-site', clockIn: '7:58 AM', geofence: 'verified', currentJobId: 'j1', weekHours: 31.5, lateCount30d: 1 },
  ],

  jobs: [
    { id: 'j1', type: 'Project', priority: 'high',
      name: 'Meridian Distribution Warehouse',
      client: 'Meridian Logistics Group',
      system: 'Fire Alarm + Access Control + CCTV',
      address: '4180 Hollins Ferry Rd, Baltimore, MD',
      state: 'MD',
      window: 'Site access 8:00 AM – 4:00 PM (strict)',
      status: 'in-progress', progress: 62,
      startDate: 'May 11, 2026', targetDate: 'Aug 14, 2026',
      assigned: ['t2', 't3', 't7', 't10'],
      value: '$186,400',
      phases: [
        { name: 'Rough-in & cable pulls', done: true },
        { name: 'Fire alarm panel & device install', done: true },
        { name: 'Access control — doors 1–14', done: false, pct: 70 },
        { name: 'CCTV — 32 cameras', done: false, pct: 45 },
        { name: 'Programming, test & inspection', done: false, pct: 0 },
      ],
      tasks: [
        { id: 'j1-1', label: 'Terminate card readers, doors 9–11', done: false },
        { id: 'j1-2', label: 'Mount cameras, dock bays 4–6', done: false },
        { id: 'j1-3', label: 'Pull Cat6 to guard shack', done: true },
        { id: 'j1-4', label: 'Label panel FA-2 circuits', done: false },
      ],
      notes: 'GC requires badge sign-in at trailer. Building closes 4:00 PM sharp — no exceptions. Lift reserved for dock bay cameras Tue/Wed only.',
    },
    { id: 'j2', type: 'Install', priority: 'high',
      name: 'First Harbor Bank — Branch 12',
      client: 'First Harbor Bank',
      system: 'Vault alarm + hold-up buttons + panel upgrade',
      address: '2200 N Charles St, Baltimore, MD',
      state: 'MD',
      window: 'After lobby hours 4:30 PM ok · escort required',
      status: 'in-progress', progress: 40,
      startDate: 'Jul 6, 2026', targetDate: 'Jul 10, 2026',
      assigned: ['t1', 't9'],
      value: '$14,200',
      tasks: [
        { id: 'j2-1', label: 'Replace control panel (DSC PowerSeries Pro)', done: true },
        { id: 'j2-2', label: 'Install 4 hold-up buttons at teller line', done: false },
        { id: 'j2-3', label: 'Vault vibration sensor + test', done: false },
        { id: 'j2-4', label: 'Central station cutover + signal test', done: false },
      ],
      notes: 'Branch manager: Karen L. — escort required for vault area. Old panel must be returned to office for records.',
    },
    { id: 'j3', type: 'Install', priority: 'normal',
      name: 'Goldstein & Rowe Jewelers',
      client: 'Goldstein & Rowe',
      system: 'UL-certificated burglar alarm + glassbreak + CCTV',
      address: '731 Sansom St, Philadelphia, PA',
      state: 'PA',
      window: 'Wed–Thu · before store opens (7:00–10:00 AM)',
      status: 'scheduled', progress: 0,
      startDate: 'Jul 8, 2026', targetDate: 'Jul 9, 2026',
      assigned: ['t4'],
      value: '$9,850',
      tasks: [
        { id: 'j3-1', label: 'Install safe/vault sensors', done: false },
        { id: 'j3-2', label: 'Glassbreak detectors — showroom', done: false },
        { id: 'j3-3', label: 'UL certificate paperwork', done: false },
      ],
      notes: 'UL certificated system required for insurance. Owner on site 7 AM.',
    },
    { id: 'j4', type: 'Install', priority: 'normal',
      name: 'Radford Office Park — Bldg C',
      client: 'Radford Properties',
      system: 'Burglar alarm + access control (6 doors)',
      address: '1550 Wilson Blvd, Arlington, VA',
      state: 'VA',
      window: 'Business hours ok',
      status: 'in-progress', progress: 78,
      startDate: 'Jul 1, 2026', targetDate: 'Jul 7, 2026',
      assigned: ['t4'],
      value: '$18,700',
      tasks: [
        { id: 'j4-1', label: 'Program keypads + fobs (42 users)', done: true },
        { id: 'j4-2', label: 'Door position switches — suite 300', done: true },
        { id: 'j4-3', label: 'Final walkthrough with property manager', done: false },
      ],
      notes: 'Property manager wants training session for front desk staff on completion.',
    },
    { id: 'j5', type: 'Install', priority: 'normal',
      name: 'Brandywine Medical Suites',
      client: 'Brandywine Health Partners',
      system: 'Fire alarm devices + panel tie-in',
      address: '104 W 9th St, Wilmington, DE',
      state: 'DE',
      window: '7:00 AM – 3:30 PM',
      status: 'in-progress', progress: 55,
      startDate: 'Jul 2, 2026', targetDate: 'Jul 9, 2026',
      assigned: ['t8'],
      value: '$11,300',
      tasks: [
        { id: 'j5-1', label: 'Install horn/strobes — 2nd floor', done: true },
        { id: 'j5-2', label: 'Smoke detectors — suites 210–216', done: false },
        { id: 'j5-3', label: 'AHJ inspection scheduling', done: false },
      ],
      notes: 'Coordinate with building engineer (Mike) before any panel work. AHJ inspection required before occupancy.',
    },
    { id: 'j6', type: 'Service', priority: 'high',
      name: 'Pulaski Metals — Zone Fault',
      client: 'Pulaski Metal Works',
      system: 'Service call — zone 14 supervisory fault',
      address: '88 Jacobus Ave, Kearny, NJ',
      state: 'NJ',
      window: 'ASAP — customer requested morning',
      status: 'scheduled', progress: 0,
      startDate: 'Jul 6, 2026', targetDate: 'Jul 6, 2026',
      assigned: ['t5'],
      value: '$425',
      tasks: [
        { id: 'j6-1', label: 'Diagnose zone 14 supervisory fault', done: false },
        { id: 'j6-2', label: 'Test all perimeter zones', done: false },
      ],
      notes: 'Recurring fault — third call in 6 months. Check for water intrusion at loading dock contact.',
    },
    { id: 'j7', type: 'Install', priority: 'normal',
      name: 'Hartsdale Self Storage',
      client: 'Hartsdale Storage LLC',
      system: 'CCTV — 16 cameras + NVR',
      address: '221 Saw Mill River Rd, Hartsdale, NY',
      state: 'NY',
      window: 'Any',
      status: 'scheduled', progress: 0,
      startDate: 'Jul 13, 2026', targetDate: 'Jul 15, 2026',
      assigned: ['t1'],
      value: '$13,900',
      tasks: [],
      notes: '',
    },
    { id: 'j8', type: 'Service', priority: 'normal',
      name: 'Calvert Auto Group — Keypad swap',
      client: 'Calvert Auto Group',
      system: 'Service — replace 2 keypads',
      address: '9010 Baltimore Ave, College Park, MD',
      state: 'MD',
      window: 'Business hours',
      status: 'completed', progress: 100,
      startDate: 'Jul 2, 2026', targetDate: 'Jul 2, 2026',
      assigned: ['t8'],
      value: '$390',
      tasks: [],
      notes: '',
    },
    { id: 'j9', type: 'Install', priority: 'normal',
      name: 'Ironbound Cold Storage',
      client: 'Ironbound Foods',
      system: 'Burglar + temperature monitoring',
      address: '400 Doremus Ave, Newark, NJ',
      state: 'NJ',
      window: '6:00 AM – 2:00 PM',
      status: 'completed', progress: 100,
      startDate: 'Jun 22, 2026', targetDate: 'Jun 30, 2026',
      assigned: ['t2', 't7'],
      value: '$21,400',
      tasks: [],
      notes: '',
    },
    { id: 'j10', type: 'Install', priority: 'normal',
      name: 'Susquehanna Dental Group',
      client: 'Susquehanna Dental',
      system: 'Burglar alarm + panic buttons',
      address: '3711 Market St, Philadelphia, PA',
      state: 'PA',
      window: 'Fri after 2 PM',
      status: 'scheduled', progress: 0,
      startDate: 'Jul 10, 2026', targetDate: 'Jul 10, 2026',
      assigned: ['t7'],
      value: '$4,600',
      tasks: [],
      notes: '',
    },
  ],

  // End-of-day reports already in the system (demo history)
  reports: [
    {
      id: 'r1', techId: 't2', jobId: 'j1', date: 'Jul 3, 2026', submitted: '4:12 PM',
      hours: 8.0, completion: 'Access control doors 6–8 terminated and tested',
      materials: ['3× HID Signo card readers', '2× door strikes', '450 ft Cat6'],
      issues: 'Door 7 frame required drilling — added 45 min. GC notified.',
      aiSummary: 'Crew completed termination and testing of access control doors 6–8 at Meridian Warehouse. One delay: door 7 frame drilling (+45 min), GC informed. Materials logged. On track for phase completion next week.',
    },
    {
      id: 'r2', techId: 't4', jobId: 'j4', date: 'Jul 3, 2026', submitted: '3:48 PM',
      hours: 7.5, completion: 'Keypads programmed, all 42 user fobs enrolled',
      materials: ['2× PROX fob packs (25)', '1× keypad'],
      issues: 'None.',
      aiSummary: 'Radford Bldg C: all keypads programmed and 42 user fobs enrolled ahead of schedule. No issues. Remaining: final walkthrough with property manager Monday.',
    },
    {
      id: 'r3', techId: 't8', jobId: 'j8', date: 'Jul 2, 2026', submitted: '2:20 PM',
      hours: 3.0, completion: 'Both keypads replaced and tested. Job closed.',
      materials: ['2× DSC HS2LCD keypads'],
      issues: 'None. Customer signed off on site.',
      aiSummary: 'Calvert Auto keypad swap complete — both units replaced, tested, customer signed off. Job closed and billable.',
    },
  ],

  inventory: [
    { sku: 'DSC-HS3128',  name: 'DSC PowerSeries Pro Panel HS3128', stock: 6,  min: 4,  usedToday: 1, unit: '$310' },
    { sku: 'HW-VISTA21',  name: 'Honeywell VISTA-21iP Panel',       stock: 3,  min: 4,  usedToday: 0, unit: '$168' },
    { sku: 'HID-SIGNO20', name: 'HID Signo 20 Card Reader',         stock: 9,  min: 8,  usedToday: 3, unit: '$142' },
    { sku: 'SD-2WTA-B',   name: 'System Sensor 2WTA-B Smoke Det.',  stock: 34, min: 20, usedToday: 6, unit: '$46'  },
    { sku: 'HS-P2RL',     name: 'System Sensor P2RL Horn/Strobe',   stock: 18, min: 12, usedToday: 4, unit: '$52'  },
    { sku: 'CAM-IPC-T5',  name: '5MP Turret IP Camera',             stock: 22, min: 16, usedToday: 2, unit: '$89'  },
    { sku: 'CBL-CAT6-1K', name: 'Cat6 Plenum 1000ft Spool',         stock: 5,  min: 6,  usedToday: 1, unit: '$210' },
    { sku: 'DC-1078',     name: 'Recessed Door Contact 1078',       stock: 61, min: 40, usedToday: 8, unit: '$4'   },
    { sku: 'GB-FG1625',   name: 'Glassbreak Detector FG-1625',      stock: 12, min: 8,  usedToday: 0, unit: '$38'  },
    { sku: 'HU-268',      name: 'Hold-up Button (latching)',        stock: 7,  min: 6,  usedToday: 0, unit: '$29'  },
  ],

  alerts: [
    { id: 'a1', level: 'danger', time: '8:47 AM',
      text: 'Late arrival: James O\'Neal clocked in 47 min after scheduled start at Meridian Warehouse (site window 8 AM – 4 PM).' },
    { id: 'a2', level: 'warn', time: '8:15 AM',
      text: 'Low stock: Honeywell VISTA-21iP panels (3 left, min 4) and Cat6 plenum spools (5 left, min 6).' },
    { id: 'a3', level: 'info', time: '7:58 AM',
      text: 'All Meridian crew except J. O\'Neal on site before 8:00 AM window opened.' },
    { id: 'a4', level: 'warn', time: 'Yesterday',
      text: 'Monitoring API: Pulaski Metals zone 14 supervisory fault reported by central station — service call auto-created (Job J6).' },
  ],

  schedule: [
    { time: '8:00 AM',  jobId: 'j1', techIds: ['t2', 't3', 't7', 't10'], label: 'Meridian Warehouse — access control + CCTV (full day)' },
    { time: '8:00 AM',  jobId: 'j2', techIds: ['t1', 't9'],  label: 'First Harbor Bank — hold-up buttons + vault sensor' },
    { time: '8:30 AM',  jobId: 'j5', techIds: ['t8'],        label: 'Brandywine Medical — smoke detectors, suites 210–216' },
    { time: '9:30 AM',  jobId: 'j6', techIds: ['t5'],        label: 'Pulaski Metals — zone 14 fault (service)' },
    { time: '1:00 PM',  jobId: 'j4', techIds: ['t4'],        label: 'Radford Bldg C — final walkthrough' },
  ],

  // Rough pin positions for the coverage map panel (percent of panel w/h)
  mapPins: [
    { jobId: 'j7', x: 78, y: 12, state: 'NY' },
    { jobId: 'j6', x: 72, y: 26, state: 'NJ' },
    { jobId: 'j9', x: 74, y: 33, state: 'NJ' },
    { jobId: 'j3', x: 58, y: 38, state: 'PA' },
    { jobId: 'j10', x: 55, y: 44, state: 'PA' },
    { jobId: 'j5', x: 60, y: 55, state: 'DE' },
    { jobId: 'j1', x: 42, y: 62, state: 'MD' },
    { jobId: 'j2', x: 44, y: 58, state: 'MD' },
    { jobId: 'j8', x: 38, y: 70, state: 'MD' },
    { jobId: 'j4', x: 30, y: 80, state: 'VA' },
  ],
};

/* ---------- Mutable app state (persisted) ---------- */

function loadState() {
  try {
    const raw = localStorage.getItem(IS_STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fall through to defaults */ }
  return {
    techClockedIn: true,        // demo tech (Marcus) starts clocked in
    techClockInTime: '7:52 AM',
    completedTasks: {},         // taskId -> true
    scannedParts: [],           // {sku, name, jobId, time}
    submittedReports: [],       // same shape as DemoData.reports
    chatLog: [],
  };
}

function saveState() {
  try { localStorage.setItem(IS_STORE_KEY, JSON.stringify(AppState)); } catch (e) {}
}

let AppState = loadState();

/* ---------- Helpers ---------- */

function techById(id) { return DemoData.technicians.find(t => t.id === id); }
function jobById(id)  { return DemoData.jobs.find(j => j.id === id); }

function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function nowTimeString() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function todayString() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function allReports() {
  return [...AppState.submittedReports, ...DemoData.reports];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
