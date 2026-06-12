# Infinity Runner — React (Vite)

Pure **React + Vite + TypeScript** frontend with Infinity Learn branding.

## Run (with API)

From project root:

```bash
npm run install:all
npm run dev
```

- React app: http://localhost:5173
- API server: http://localhost:3001

Or run separately:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## Demo mode

Open http://localhost:5173 → **Continue in Demo Mode** (no Firebase required).

## Firebase

Copy `.env.example` → `.env` and add `VITE_FIREBASE_*` keys.
