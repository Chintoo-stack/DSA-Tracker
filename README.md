# Ember — DSA Tracker

A React site (Vite, deployed on Netlify) for tracking **consistency** and **progress** while practicing data structures and algorithms.

## What you can do

- **Dashboard:** last 12 weeks, one cell per day. 🔥 if you solved at least one question that day, 💤 if you did not.
- **Progress:** solved count out of the questions available on your current plan, plus a topic breakdown.
- **Free:** 8 core problems, dashboard, and progress.
- **Plus:** 6 extra vault problems and an in-problem AI assistant for when you get stuck.

## Assumptions used for this first version

These were not specified in the brief, so Ember ships with the following defaults:

- Self-reported solves (no online judge). Marking “I solved this” lights that day’s fire and increments progress.
- Progress total is plan-scoped: Free counts 8, Plus counts 14.
- Plus upgrade is a one-click plan switch so you can evaluate the product. Billing is not wired yet.
- Local/dev uses **Free demo** / **Plus demo** (browser storage) because Netlify Identity does not run in local Vite.
- After production deploy, Identity + Database persist accounts and solves.

## Local

```bash
npm install
npm run dev
npm test
```

Open the home page and start a Free or Plus demo. Solve a problem, then check the dashboard.

## Deploy on Netlify

Build command: `npm run build`  
Publish directory: `dist`

After the first production deploy:

1. Enable **Identity** under Project configuration → Identity (open registration).
2. Enable **AI** so Plus users can call the assistant through Netlify AI Gateway.
3. `@netlify/database` provisions Postgres; the migration in `netlify/database/migrations/` seeds the problem catalog.
