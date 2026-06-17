# Production deployment (Docker)

Deploy **ILBTL** as two Docker containers on a Linux server. MongoDB Atlas hosts the database. Firebase handles Google sign-in.

| Container | Role | Public |
|-----------|------|--------|
| **frontend** | nginx + React PWA | Yes — port `80` (or `APP_PORT`) |
| **backend** | Express API | Internal only (`3001`) |

**WhatsApp webhook (Gupshup callback):** use **AWS Lambda** when DevOps has deployed it ([lambda/README.md](../lambda/README.md)), or temporarily the Docker URL below. Use **one** callback URL only.

---

## 1. Prerequisites

- **Server:** Linux with Docker Engine + Docker Compose v2 (AWS EC2, Azure VM, DigitalOcean, on-prem)
- **MongoDB Atlas:** cluster with `infinity_runner` database
- **Firebase:** Google auth enabled, production domain in **Authorized domains**
- **Domain (recommended):** DNS A record → server IP
- **HTTPS:** TLS at a reverse proxy (Caddy, nginx, ALB, Cloudflare) in front of port `80`

---

## 2. Configure environment

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
| `VITE_FIREBASE_API_KEY` | Firebase web app (baked into frontend image at build) |
| `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `GUPSHUP_WEBHOOK_SECRET` | Strong random string for WhatsApp webhook |
| `GUPSHUP_OTP_API_KEY` | Required for Add Lead → WhatsApp OTP |
| `GUPSHUP_OTP_SOURCE` | OTP WhatsApp source number |
| `GUPSHUP_OTP_APP_NAME` | Gupshup app name |
| `GUPSHUP_OTP_TEMPLATE_ID` | OTP template ID |

### Production defaults (`.env.example`)

| Variable | Value |
|----------|--------|
| `NODE_ENV` | `production` |
| `TRUST_PROXY` | `true` |
| `APP_PORT` | `80` |
| `VITE_API_URL` | leave **empty** — nginx proxies `/api` |

> **Never commit `.env`** — it contains secrets.

---

## 3. Build and run

```bash
docker compose up --build -d
docker compose ps
curl http://localhost/health
# → {"ok":true,"db":"connected"}
```

Open the app in a browser. Sign in with Google or use Demo Mode.

---

## 4. HTTPS (recommended)

Docker serves **HTTP on port 80** inside the host. Put TLS in front:

### Option A — Caddy on the host (simplest)

```caddy
your-domain.com {
  reverse_proxy localhost:80
}
```

### Option B — Cloud load balancer

Point AWS ALB / Azure App Gateway / Cloudflare proxy at the server’s port `80`.

After HTTPS is live:

1. Add `your-domain.com` to **Firebase → Authentication → Authorized domains**
2. Set Gupshup webhook (see [WHATSAPP_WEBHOOK.md](./WHATSAPP_WEBHOOK.md))

---

## 5. WhatsApp webhook

| Setup | Gupshup callback URL |
|-------|----------------------|
| **AWS Lambda** (recommended for scale) | `https://xxxx.lambda-url.REGION.on.aws/?secret=YOUR_SECRET` — [lambda/README.md](../lambda/README.md) |
| **Docker** (until Lambda is live) | `https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp?secret=YOUR_SECRET` |

Full guide: [WHATSAPP_WEBHOOK.md](./WHATSAPP_WEBHOOK.md)

---

## 6. Operations

```bash
docker compose logs -f
docker compose up -d --force-recreate backend   # after .env change (backend only)
docker compose up --build -d                    # after code change (rebuilds frontend + backend)
docker compose down
```

### Updates (CI/CD or manual)

```bash
git pull
docker compose up --build -d
```

Users may need a hard refresh once after frontend deploys (PWA cache).

### Health checks

- `GET /health` — returns `503` if MongoDB is disconnected
- Docker healthchecks restart unhealthy containers automatically

### MongoDB Atlas

- **Network Access:** allow your server’s public IP (or `0.0.0.0/0` for dev)
- Rotate DB credentials via Atlas → update `.env` → recreate backend container

---

## 7. Local development

```bash
npm run install:all
cp .env.example .env
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:3001  

For local Docker with a non-80 port, set `APP_PORT=8081` in `.env`.

See also [DOCKER.md](./DOCKER.md).

---

## 8. Seed database (optional, once)

```bash
npm run db:seed --prefix backend
```

(requires `MONGODB_URI` in `.env`)

---

## Architecture

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

Gupshup webhook (optional separate path):
  Gupshup → AWS Lambda Function URL → MongoDB Atlas
```

---

## DevOps handoff

- **App deploy:** `docker compose up --build -d` on the server with root `.env`
- **Lambda webhook:** [lambda/DEVOPS.md](../lambda/DEVOPS.md)
- **Secrets:** never in Git — use vault / CI secured variables
