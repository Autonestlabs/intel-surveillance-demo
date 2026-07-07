/* ============================================================
   Intel Surveillance — Demo Data Layer
   All data is mock/demo data. State persists in localStorage
   so clock-ins and reports survive a page refresh.
   ============================================================ */

const IS_STORE_KEY = 'intel-surveillance-demo-v2';

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
      risk: { level: 'watch', reason: '3 late arrivals this week cost ~3.2 crew-hours inside a strict 8–4 site window. AI forecast: still on target if arrivals normalize.' },
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
      risk: { level: 'ok', reason: 'On schedule. Central-station cutover booked for Thursday.' },
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
      risk: { level: 'ok', reason: 'Materials staged. UL paperwork pre-filled by the system.' },
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
      risk: { level: 'ok', reason: 'Final walkthrough today at 1 PM — invoice will auto-generate on sign-off.' },
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
      risk: { level: 'risk', reason: 'AHJ fire inspection not yet scheduled and target is Jul 9. AI drafted the inspection request — needs office approval.' },
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
      risk: { level: 'watch', reason: 'Third call in 6 months for the same zone — AI flagged a probable water-intrusion pattern at the loading dock contact.' },
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
      risk: { level: 'ok', reason: 'Scheduled next week. NVR and cameras in stock.' },
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
      risk: { level: 'ok', reason: 'Friday afternoon slot confirmed with office manager.' },
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
      photos: 2,
      aiSummary: 'Crew completed termination and testing of access control doors 6–8 at Meridian Warehouse. One delay: door 7 frame drilling (+45 min), GC informed. Materials logged. On track for phase completion next week.',
    },
    {
      id: 'r2', techId: 't4', jobId: 'j4', date: 'Jul 3, 2026', submitted: '3:48 PM',
      hours: 7.5, completion: 'Keypads programmed, all 42 user fobs enrolled',
      materials: ['2× PROX fob packs (25)', '1× keypad'],
      issues: 'None.',
      photos: 3,
      aiSummary: 'Radford Bldg C: all keypads programmed and 42 user fobs enrolled ahead of schedule. No issues. Remaining: final walkthrough with property manager Monday.',
    },
    {
      id: 'r3', techId: 't8', jobId: 'j8', date: 'Jul 2, 2026', submitted: '2:20 PM',
      hours: 3.0, completion: 'Both keypads replaced and tested. Job closed.',
      materials: ['2× DSC HS2LCD keypads'],
      issues: 'None. Customer signed off on site.',
      photos: 1,
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
      text: 'Low stock: Honeywell VISTA-21iP panels (3 left, min 4) and Cat6 plenum spools (5 left, min 6). Draft PO ready for approval.' },
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

  // Week timeline (Mon–Fri) for the dispatch Gantt. day 0 = Monday Jul 6.
  weekPlan: [
    { jobId: 'j1', from: 0, to: 4, crew: 'Dana + 3' },
    { jobId: 'j2', from: 0, to: 3, crew: 'Marcus, Sam' },
    { jobId: 'j5', from: 0, to: 2, crew: 'Kevin' },
    { jobId: 'j6', from: 0, to: 0, crew: 'Angela' },
    { jobId: 'j4', from: 0, to: 0, crew: 'Chris' },
    { jobId: 'j3', from: 2, to: 3, crew: 'Chris' },
    { jobId: 'j10', from: 4, to: 4, crew: 'Luis' },
  ],

  // Business trends (5 weeks)
  trends: {
    weeks: ['Jun 8', 'Jun 15', 'Jun 22', 'Jun 29', 'Jul 6'],
    onTimePct: [78, 82, 74, 85, 91],
    hoursLost: [6.5, 4.0, 8.2, 3.0, 0.8],
    revenueK: [74, 91, 68, 102, 88],
  },

  // Sales pipeline — the automated nurture system
  pipeline: [
    { stage: 'New Leads', color: '#2563eb', leads: [
      { company: 'Chesapeake Storage Group', contact: 'R. Alvarez', value: '$12–18k', source: 'Website form · 2h ago',
        ai: 'AI intro email sent 12 min after inquiry. Site survey offered.' },
      { company: 'Dover Fresh Foods', contact: 'M. Okafor', value: '$8–10k', source: 'Google Ads · yesterday',
        ai: 'AI qualified: cold-storage burglar + temp monitoring. Call scheduled Wed 2 PM.' },
    ]},
    { stage: 'AI Nurturing', color: '#7c3aed', leads: [
      { company: 'Patapsco Brewing Co.', contact: 'J. Keller', value: '$9k est.', source: 'Referral · 6d ago',
        ai: 'Opened both follow-ups, clicked pricing link. AI recommends a human call today — high intent.' },
      { company: 'Liberty Row Apartments', contact: 'S. Grant', value: '$26k est.', source: 'Website · 12d ago',
        ai: 'Third touch scheduled Thursday. Interested in access control for 3 buildings.' },
    ]},
    { stage: 'Quote Sent', color: '#d97706', leads: [
      { company: 'Annandale Surgical Ctr', contact: 'Dr. Liu', value: '$31,200', source: 'Quote sent Jul 1',
        ai: 'Quote viewed 4× — AI sent a gentle nudge Jul 4. Decision expected this week.' },
    ]},
    { stage: 'Won This Month', color: '#059669', leads: [
      { company: 'First Harbor Bank — Br. 12', contact: 'K. Lawrence', value: '$14,200', source: 'Closed Jul 1',
        ai: 'Auto-converted to Job J2, crew scheduled, deposit invoice sent & paid.' },
      { company: 'Hartsdale Self Storage', contact: 'P. Demarco', value: '$13,900', source: 'Closed Jun 30',
        ai: 'Auto-converted to Job J7. Materials reserved from stock.' },
    ]},
  ],

  // Automation activity log
  automations: [
    { icon: '📨', title: '12-month check-in sent', detail: 'Ironbound Cold Storage — "How is the system running? Due for annual test." Reply received: booking requested.', time: 'Today 6:00 AM', tag: 'retention' },
    { icon: '⭐', title: 'Review request sent', detail: 'Calvert Auto Group — Google review link sent after sign-off. ★★★★★ received in 3 hours.', time: 'Jul 2', tag: 'reputation' },
    { icon: '🚨', title: 'Fault → service ticket', detail: 'Central station reported zone 14 supervisory fault at Pulaski Metals. Service job auto-created and offered to customer for this morning.', time: 'Yesterday 4:22 PM', tag: 'monitoring' },
    { icon: '🧾', title: 'Invoice auto-generated', detail: 'Calvert Auto Group — $390 service invoice created from the closed job and emailed. Paid online same day.', time: 'Jul 2', tag: 'billing' },
    { icon: '📦', title: 'Purchase order drafted', detail: 'VISTA-21iP panels below minimum (3 < 4). Draft PO for 6 units queued for your approval.', time: 'Today 8:15 AM', tag: 'inventory' },
    { icon: '📅', title: 'Follow-up scheduled', detail: 'Radford Properties — front-desk training session proposed for Thursday after final walkthrough.', time: 'Today 7:30 AM', tag: 'scheduling' },
  ],

  invoices: [
    { id: 'INV-2148', client: 'First Harbor Bank',    job: 'Branch 12 deposit',   amount: '$7,100',  status: 'paid',    date: 'Jul 2' },
    { id: 'INV-2147', client: 'Calvert Auto Group',   job: 'Keypad service',      amount: '$390',    status: 'paid',    date: 'Jul 2' },
    { id: 'INV-2146', client: 'Ironbound Foods',      job: 'Cold storage final',  amount: '$10,700', status: 'sent',    date: 'Jul 1' },
    { id: 'INV-2145', client: 'Meridian Logistics',   job: 'Warehouse — draw 3',  amount: '$37,280', status: 'sent',    date: 'Jun 30' },
    { id: 'INV-2141', client: 'Osprey Marine Supply', job: 'CCTV install final',  amount: '$6,240',  status: 'overdue', date: 'Jun 12' },
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

  // Simulated live-activity events (cycled on the dashboard)
  liveEvents: [
    { icon: '📦', text: 'Marcus Rivera scanned 2× HID Signo readers at First Harbor Bank' },
    { icon: '✅', text: 'Dana Whitfield completed "Terminate card readers, doors 9–11" at Meridian' },
    { icon: '📍', text: 'Angela Park arrived at Pulaski Metals — geofence confirmed' },
    { icon: '📝', text: 'Chris Boone added a note to Radford Bldg C: "walkthrough moved to 1:30"' },
    { icon: '📷', text: 'Luis Mendez attached 3 photos — dock bay camera mounts' },
    { icon: '🧾', text: 'Invoice INV-2149 drafted from Radford walkthrough sign-off' },
    { icon: '📨', text: 'AI follow-up sent to Patapsco Brewing — pricing questions answered' },
    { icon: '🔧', text: 'Kevin Drummond marked smoke detectors complete — suites 210–212' },
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
    photos: [],                 // {jobId, label, time}
    submittedReports: [],       // same shape as DemoData.reports
    chatLog: [],
    copilotLog: [],             // admin AI copilot transcript
    autoRules: { checkin12: true, reviews: true, faults: true, invoicing: true, po: false, nurture: true },
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

function riskBadge(job) {
  if (!job.risk) return '';
  const map = {
    ok:    ['green', 'On track'],
    watch: ['amber', 'Watch'],
    risk:  ['red',   'At risk'],
  };
  const [cls, label] = map[job.risk.level] || map.ok;
  return `<span class="badge ${cls}" title="${escapeHtml(job.risk.reason)}">✦ ${label}</span>`;
}
