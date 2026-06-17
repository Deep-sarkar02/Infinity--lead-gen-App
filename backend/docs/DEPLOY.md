# Production deployment (Docker)

Deploy **ILBTL** as two containers on any Linux server (AWS EC2, Azure VM, DigitalOcean, on-prem).

| Container | Role | Public |
|-----------|------|--------|
| **frontend** | nginx + React PWA | Yes — port `80` (or `APP_PORT`) |
| **backend** | Express API | Internal only (`3001`) |

MongoDB Atlas hosts the database. Firebase handles Google sign-in.

---

## 1. Prerequisites

- **Server:** Linux with Docker Engine + Docker Compose v2
- **MongoDB Atlas:** cluster with `infinity_runner` database
- **Firebase:** Google auth enabled, production domain in **Authorized domains**
- **Domain (recommended):** DNS A record → server IP
- **HTTPS:** terminate TLS at a reverse proxy (Caddy, nginx, ALB) in front of port `80`

---

## 2. Configure environment

On the server, clone the repo and create `.env` from the template:

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

---

## 3. Build and run

```bash
docker compose up --build -d
docker compose ps
```

Verify:

```bash
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

Caddy obtains and renews Let's Encrypt certificates automatically.

### Option B — Cloud load balancer

Point an AWS ALB / Azure App Gateway / Cloudflare proxy at the server’s port `80`.

After HTTPS is live:

1. Add `your-domain.com` to **Firebase → Authentication → Authorized domains**
2. Set Gupshup webhook URL to `https://your-domain.com/api/webhooks/gupshup/whatsapp?secret=...`

---

## 5. WhatsApp webhook

| Environment | Callback URL |
|-------------|--------------|
| **Production (Docker)** | `https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp?secret=YOUR_SECRET` |
| **AWS Lambda** (high volume) | See [lambda/README.md](../lambda/README.md) |

Full guide: [WHATSAPP_WEBHOOK.md](./WHATSAPP_WEBHOOK.md)

---

## 6. Operations

```bash
# Logs
docker compose logs -f

# Restart after .env change (backend)
docker compose up -d --force-recreate backend

# Rebuild after code change
docker compose up --build -d

# Stop
docker compose down
```

### Updates

```bash
git pull
docker compose up --build -d
```

Users may need a hard refresh once after frontend deploys (PWA cache).

### Health checks

- `GET /health` — returns `503` if MongoDB is disconnected
- Docker healthchecks restart unhealthy containers automatically

### MongoDB Atlas

- **Network Access:** allow your server’s public IP (or VPC peering for AWS)
- Rotate DB credentials via Atlas → update `.env` → recreate backend container

### Backups

Use MongoDB Atlas automated backups. No local `app.db` is used in production.

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

From your machine with `MONGODB_URI` in `.env`:

```bash
npm run db:seed --prefix backend
```

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
```
