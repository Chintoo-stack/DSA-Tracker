# Ember — DSA Tracker

A Netlify site for tracking **consistency** and **progress** while practicing data structures and algorithms.

- **Consistency dashboard:** each day in the last 12 weeks shows 🔥 if you solved at least one problem that day, and 💤 if you did not.
- **Progress:** solved count out of the questions available on your plan.
- **Free:** core problem set.
- **Plus:** extra vault problems plus an AI assistant for when you get stuck.

## Local

```bash
npm install
npm run dev
npm test
```

Netlify Identity is not available in local dev. Use **Free demo** or **Plus demo** on the home page; progress is stored in the browser.

## Deploy on Netlify

Build command: `npm run build`  
Publish directory: `dist`

After the first production deploy:

1. Enable **Identity** under Project configuration → Identity (open registration).
2. Enable **AI** so Plus users can call the assistant through Netlify AI Gateway.
3. `@netlify/database` provisions Postgres; the migration in `netlify/database/migrations/` seeds the problem catalog.

Signed-in progress is stored in the database. The Plus upgrade control is a plan switch for evaluating the product — connect billing before a public launch.
