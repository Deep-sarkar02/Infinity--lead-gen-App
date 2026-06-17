# Production deployment

Deploy **ILBTL** on **Vercel** (recommended for now) or **Docker** (self-hosted). Both use MongoDB Atlas and Firebase.

---

## Option A — Vercel (whole app, recommended)

One Vercel project hosts **both** the React PWA and the Express API on the same domain.

| Part | How |
|------|-----|
| React PWA | Static files from `frontend/dist` |
| Express API | Serverless function at `/api/*` via `api/index.ts` |
| Database | MongoDB Atlas |
| Auth | Firebase |

**Pros:** Single URL, global CDN, auto-deploy from GitHub, no server to manage.  
**Trade-off:** API runs as serverless — first request after idle may take a few seconds (MongoDB connect).

### 1. MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → your cluster  
2. **Network Access** → **Allow Access from Anywhere** (`0.0.0.0/0`)  
3. Copy your connection string (database: `infinity_runner`)

### 2. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → **Sign in with GitHub**  
2. **Import** your repo  
3. **Important — do not use the “Services” preset.** Set:
   - **Root Directory:** `.` (repo root)
   - **Framework Preset:** **Other** (uses `vercel.json` — one Vite build + serverless API)
   - If Vercel already created a Services project, go to **Settings → General → Framework** and switch to **Other**, or delete the project and re-import.

### 3. Environment variables

In Vercel → Project → **Settings** → **Environment Variables**, add values from `.env.example`:

**Firebase (required for Google sign-in):**

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | Firebase web app |
| `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

**API / database (required):**

| Name | Value |
|------|-------|
| `MONGODB_URI` | Atlas connection string |
| `GUPSHUP_WEBHOOK_SECRET` | Strong random string for WhatsApp webhook |

**Gupshup (optional — SMS / WhatsApp on lead add):**

| Name | Value |
|------|-------|
| `GUPSHUP_API_KEY` | Gupshup API key |
| `GUPSHUP_SOURCE` | WhatsApp source number |
| `GUPSHUP_APP_NAME` | Gupshup app name |
| `GUPSHUP_TEMPLATE_ID` | Template ID |
| `GUPSHUP_OTP_*` | OTP channel vars (see `.env.example`) |
| `GUPSHUP_SMS_*` | SMS fallback vars (see `.env.example`) |

> **Do not set `VITE_API_URL`** on Vercel — the API is on the same domain at `/api/...`.

Apply to **Production**, **Preview**, and **Development**.

### 4. Deploy

Click **Deploy**. Wait for the build (~2–3 min).

Your app URL will look like: `https://your-project.vercel.app`

### 5. Firebase authorized domains

1. [Firebase Console](https://console.firebase.google.com) → **Authentication** → **Settings** → **Authorized domains**  
2. Add your Vercel domain, e.g. `your-project.vercel.app`

### 6. Verify

1. Open your Vercel URL  
2. **Continue in Demo Mode** or sign in with Google  
3. Add a test lead → check **View Leads**  
4. Health check: `https://YOUR-APP.vercel.app/health` → `{"ok":true,"db":"connected"}`

### 7. WhatsApp webhook (Vercel)

Set Gupshup callback URL to:

```
https://YOUR-APP.vercel.app/api/webhooks/gupshup/whatsapp?secret=YOUR_GUPSHUP_WEBHOOK_SECRET
```

See [WHATSAPP_WEBHOOK.md](./WHATSAPP_WEBHOOK.md).

### 8. Seed database (optional, once)

From your machine with `MONGODB_URI` in `.env`:

```bash
npm run db:seed --prefix backend
```

### Vercel architecture

```
Browser
   │
   ▼
┌─────────────────────────────────────┐
│  Vercel (same domain)               │
│  frontend/dist  +  api/index.ts     │
│  /              +  /api/*  /health  │
└──────────────────┬──────────────────┘
                   │
                   ▼
            MongoDB Atlas
```

---

## Option B — Docker (self-hosted)

Deploy as two containers on any Linux server (AWS EC2, Azure VM, DigitalOcean, on-prem).

| Container | Role | Public |
|-----------|------|--------|
| **frontend** | nginx + React PWA | Yes — port `80` (or `APP_PORT`) |
| **backend** | Express API | Internal only (`3001`) |

### 1. Prerequisites

- **Server:** Linux with Docker Engine + Docker Compose v2
- **MongoDB Atlas:** cluster with `infinity_runner` database
- **Firebase:** Google auth enabled, production domain in **Authorized domains**
- **Domain (recommended):** DNS A record → server IP
- **HTTPS:** terminate TLS at a reverse proxy (Caddy, nginx, ALB) in front of port `80`

### 2. Configure environment

On the server:

```bash
git clone <your-repo-url> infinity-runner
cd infinity-runner
cp .env.example .env
nano .env
```

### Required variables

| Variable | Notes |
|----------|--------|
| `MONGODB_URI` | Atlas connection string |
| `VITE_FIREBASE_API_KEY` | Firebase web app |
| `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `GUPSHUP_WEBHOOK_SECRET` | Strong random string for WhatsApp webhook |

### Production defaults (already in `.env.example`)

| Variable | Value |
|----------|--------|
| `NODE_ENV` | `production` |
| `TRUST_PROXY` | `true` |
| `APP_PORT` | `80` |
| `VITE_API_URL` | leave **empty** — nginx proxies `/api` |

> **Never commit `.env`** — it contains secrets.

### 3. Build and run

```bash
docker compose up --build -d
docker compose ps
curl http://localhost/health
# → {"ok":true,"db":"connected"}
```

### 4. HTTPS (recommended)

Docker serves **HTTP on port 80**. Put TLS in front (Caddy, ALB, Cloudflare), then add your domain to Firebase authorized domains and set the Gupshup webhook to `https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp?secret=...`.

### 5. Operations

```bash
docker compose logs -f
docker compose up -d --force-recreate backend   # after .env change
docker compose up --build -d                      # after code change
docker compose down
```

See [DOCKER.md](./DOCKER.md) for more.

### Docker architecture

```
Internet :443 (HTTPS)
    │
    ▼
┌──────────────┐
│ TLS proxy    │  Caddy / ALB / Cloudflare
└──────┬───────┘
       │ :80
       ▼
┌─────────────┐     /api/*  ┌──────────────┐
│  frontend   │ ──────────► │ backend:3001 │
│  (nginx)    │             │  Express     │
└─────────────┘             └──────┬───────┘
                                   │
                                   ▼
                            MongoDB Atlas
```

---

## Local development

```bash
npm run install:all
cp .env.example .env
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:3001  

For local Docker with a non-80 port, set `APP_PORT=8081` in `.env`.

---

## AWS Lambda webhook (optional)

For high-volume WhatsApp traffic, you can point Gupshup at a Lambda Function URL instead of `/api/webhooks/...` on Vercel or Docker. See [lambda/README.md](../lambda/README.md).

Use **one** callback URL — Vercel, Docker, or Lambda, not multiple.
