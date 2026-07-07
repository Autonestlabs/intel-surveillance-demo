# Intel Surveillance — Field Operations Platform (Demo)

Interactive demo built by **AutoNestLabs** for Intel Surveillance, a commercial alarm,
fire, and CCTV installation company operating across NY, NJ, PA, DE, MD, and VA.

**This is a prototype with demo data only** — no real customer information, no backend.
It exists to show the product direction; most workflows are simulated.

## What's in the demo

**Office Dashboard** (owner/admin view)
- Live crew board: GPS-verified clock-ins, late-arrival flags, current job per tech
- Alerts & exceptions (late arrivals, low stock, monitoring-station faults)
- Job & project tracking with phases, progress, dispatch schedule, and coverage map
- AI-summarized end-of-day field reports from every technician
- Payroll-ready timesheet preview
- Inventory with live barcode-scan feed from the field

**Technician App** (phone view)
- GPS-verified clock in / clock out with geofence badge
- Today's assignments with site-access windows and job notes
- Task checklists and barcode part scanning (auto-deducts inventory)
- 30-second end-of-day reports — tech types rough notes, AI writes the report
- AI assistant: schedule, job notes, parts stock, hours

Actions taken in the technician app (clock-ins, scans, submitted reports) appear
live on the office dashboard. State persists in `localStorage` — use the browser
console `localStorage.clear()` to reset the demo.

## Running it

It's a fully static site — no build step, no dependencies.

```bash
# any static server works, e.g.:
python -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` in a browser.

## Hosting

- **GitHub Pages**: enable Pages on this repo (Deploy from branch → main → root). Done.
- **Replit / bolt.new / Vercel / Netlify**: import the repo as a static site.

## Structure

```
index.html        entry point
css/styles.css    all styling
js/data.js        demo dataset + persisted state helpers
js/app.js         shell + routing (login / admin / tech)
js/admin.js       office dashboard
js/tech.js        technician phone app
```

## Roadmap (full build)

The production version replaces the demo layer with a real backend (auth, database,
GPS/geofencing service, push notifications), native iOS/Android apps for technicians,
monitoring-station API integrations, and QuickBooks/payroll export.
