# Deploy IL Scout (free hosting)

## Option A — Vercel (whole app, recommended)

One Vercel project hosts **both** the React PWA and the Express API on the same domain.

| Part | How |
|------|-----|
| React PWA | Static files from `client/dist` |
| Express API | Serverless function at `/api/*` |
| Database | MongoDB Atlas |
| Auth | Firebase |

**Pros:** Single URL, fast global CDN, auto-deploy from GitHub, no separate API host.  
**Trade-off:** API runs as serverless — first request after idle may take a few seconds (MongoDB connect).

---

### 1. MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → your cluster  
2. **Network Access** → **Allow Access from Anywhere** (`0.0.0.0/0`)  
3. Copy your connection string (database: `infinity_runner`)

---

### 2. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → **Sign in with GitHub**  
2. **Import** `Deep-sarkar02/Infinity--lead-gen-App`  
3. Leave settings as detected from `vercel.json`:
   - **Root Directory:** `.` (repo root)
   - **Build Command:** `npm run build --prefix client`
   - **Output Directory:** `client/dist`
   - **Install Command:** `npm install && npm run install:all`

---

### 3. Environment variables

In Vercel → Project → **Settings** → **Environment Variables**, add:

**Firebase (required for Google sign-in):**

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | from `client/.env` |
| `VITE_FIREBASE_AUTH_DOMAIN` | from `client/.env` |
| `VITE_FIREBASE_PROJECT_ID` | from `client/.env` |
| `VITE_FIREBASE_APP_ID` | from `client/.env` |

**API / database (required):**

| Name | Value |
|------|-------|
| `MONGODB_URI` | Atlas connection string |

**Gupshup (optional — SMS / WhatsApp on lead add):**

| Name | Value |
|------|-------|
| `GUPSHUP_API_KEY` | from `server/.env` |
| `GUPSHUP_SOURCE` | from `server/.env` |
| `GUPSHUP_APP_NAME` | from `server/.env` |
| `GUPSHUP_TEMPLATE_ID` | from `server/.env` |
| `GUPSHUP_SMS_USERID` | from `server/.env` |
| `GUPSHUP_SMS_PASSWORD` | from `server/.env` |

> **Do not set `VITE_API_URL`** on Vercel — the API is on the same domain at `/api/...`.

Apply to **Production**, **Preview**, and **Development**.

---

### 4. Deploy

Click **Deploy**. Wait for the build to finish (~2–3 min).

Your app URL will look like: `https://infinity-lead-gen-app.vercel.app`

---

### 5. Firebase authorized domains

1. [Firebase Console](https://console.firebase.google.com) → **Authentication** → **Settings** → **Authorized domains**  
2. Add your Vercel domain, e.g. `infinity-lead-gen-app.vercel.app`

---

### 6. Verify

1. Open your Vercel URL  
2. **Continue in Demo Mode** or sign in with Google  
3. Add a test lead → check **View Leads**  
4. Health check: `https://YOUR-APP.vercel.app/health` → `{"ok":true}`

---

### 7. Seed database (once, from your machine)

```bash
cd server
npm run db:seed
```

---

## Option B — Render (frontend + API split)

See `render.yaml` in the repo root. Full steps:

1. [render.com](https://render.com) → **New** → **Blueprint** → connect GitHub repo  
2. Set env vars for both services (frontend needs `VITE_API_URL` pointing to the Render API URL)  
3. Add Render domain to Firebase authorized domains  

Details unchanged from the Render blueprint — API sleeps on free tier after 15 min idle.

---

## Custom domain (optional)

Both Vercel and Render support custom domains on free tiers. Add the domain in the platform dashboard and update Firebase authorized domains.
