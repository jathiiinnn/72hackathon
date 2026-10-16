# Gather — Render72 starter

A responsive events discovery site built for the Render72 brief. It includes a landing page and browsable events page with search, category filters, loading, empty, timeout, API error, and fallback states.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

Set `VITE_EVENTS_API_URL` to the Events API `getAllEvents` endpoint from the Render72 portal. The adapter accepts either a top-level array or common `{ events: [] }` / `{ data: [] }` response shapes and normalizes event fields in `src/api/events.js`.

## Build

```bash
npm run build
```
