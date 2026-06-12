# Deploy IL Scout (free hosting)

Recommended stack: **[Render](https://render.com)** (frontend + API) + **MongoDB Atlas** (already set up) + **Firebase** (auth).

| Service | Platform | Cost |
|---------|----------|------|
| React PWA | Render Static Site | Free |
| Express API | Render Web Service | Free |
| Database | MongoDB Atlas | Free tier |
| Auth | Firebase | Free tier |

## Why Render?

- Connects directly to your GitHub repo — auto-deploy on push
- Supports both Vite static sites and Node/Express in one project
- No code changes beyond env vars
- Free tier is enough for volunteer lead collection

**Trade-off:** The free API sleeps after ~15 minutes of inactivity. The first request after sleep may take 30–60 seconds (cold start). The app UI loads instantly; only API calls are slow on wake-up.

---

## Step 1 — Push latest code

Ensure deployment files are on GitHub:

```bash
git add .
git commit -m "Add Render deployment config"
git push
```

---

## Step 2 — MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → your cluster
2. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)  
   Required so Render’s servers can reach Atlas.
3. Copy your connection string (database: `infinity_runner`).

---

## Step 3 — Deploy on Render

1. Sign up at [render.com](https://render.com) (use **Sign in with GitHub**).
2. **New** → **Blueprint**.
3. Connect repo: `Deep-sarkar02/Infinity--lead-gen-App`.
4. Render reads `render.yaml` and creates two services:
   - `il-scout-api` — Node API
   - `il-scout-app` — static React app
5. When prompted, paste secrets:

   **API service (`il-scout-api`):**

   | Variable | Value |
   |----------|-------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `GUPSHUP_*` | From `server/.env` (optional for SMS/WhatsApp) |

   **Static site (`il-scout-app`):**

   | Variable | Value |
   |----------|-------|
   | `VITE_FIREBASE_API_KEY` | From `client/.env` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | From `client/.env` |
   | `VITE_FIREBASE_PROJECT_ID` | From `client/.env` |
   | `VITE_FIREBASE_APP_ID` | From `client/.env` |
   | `VITE_API_URL` | API URL from Render, e.g. `https://il-scout-api.onrender.com` |

6. Click **Apply**. Wait for both services to finish deploying.

> **Important:** Set `VITE_API_URL` to the **API** service URL (no trailing slash). If you deploy the API first, copy its URL, add it to the static site env vars, then **Manual Deploy → Clear build cache & deploy** on the frontend.

---

## Step 4 — Firebase authorized domains

1. [Firebase Console](https://console.firebase.google.com) → your project → **Authentication** → **Settings** → **Authorized domains**
2. Add your Render app URL, e.g. `il-scout-app.onrender.com`

Without this, Google sign-in fails on production.

---

## Step 5 — Verify

1. Open `https://il-scout-app.onrender.com` (your static site URL)
2. Sign in with Google (or Demo Mode)
3. Add a test lead — check it appears under View Leads
4. API health: `https://il-scout-api.onrender.com/health` → `{"ok":true}`

---

## Seed production database (once)

From your machine (with Atlas access):

```bash
cd server
npm run db:seed
```

Or use MongoDB Compass / Atlas UI to confirm collections exist.

---

## Custom domain (optional)

Render free tier supports custom domains on both services. Point DNS to Render and add the domain in each service’s settings.

---

## Alternatives

| Platform | Best for | Notes |
|----------|----------|-------|
| [Vercel](https://vercel.com) | Frontend only | Excellent CDN; pair with Render/Railway for API |
| [Netlify](https://netlify.com) | Frontend only | Same as Vercel |
| [Fly.io](https://fly.io) | Full-stack | More setup; small free allowance |
| [Railway](https://railway.app) | API | Limited free credits |

For the least friction with this repo, stick with **Render for both**.
