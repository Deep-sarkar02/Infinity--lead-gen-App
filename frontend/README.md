# ILBTL — React (Vite)

Pure **React + Vite + TypeScript** frontend with Infinity Learn branding.

## Run (with API)

From project root:

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

Or run separately:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

## Demo mode

Open http://localhost:5173 → **Continue in Demo Mode** (no Firebase required).

## Firebase

Copy the project root `.env.example` → `.env` and add `VITE_FIREBASE_*` keys.
