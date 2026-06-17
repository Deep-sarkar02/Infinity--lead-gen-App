# Infinity Runner

Mobile-first web app (PWA) for **Infinity Learn volunteers** to collect student leads at exam centers, track verified vs. unverified leads, and earn wallet rewards (e.g., Amazon coupons) at every **100 verified leads**.

## Documentation

| Document | Description |
|----------|-------------|
| [backend/docs/PRD.md](./backend/docs/PRD.md) | Product requirements, user stories, open questions |
| [backend/docs/TECH_DOC.md](./backend/docs/TECH_DOC.md) | Architecture, data model, APIs, security |
| [backend/docs/DESIGN_DOC.md](./backend/docs/DESIGN_DOC.md) | UX flows, screens, components, wireframes |
| [backend/docs/brand-tokens.md](./backend/docs/brand-tokens.md) | IL brand colors, typography, CSS variables |
| [backend/docs/DEPLOY.md](./backend/docs/DEPLOY.md) | **Production deployment (Vercel + Docker)** |
| [backend/docs/DOCKER.md](./backend/docs/DOCKER.md) | Docker quick reference |

## Quick start (development)

```bash
npm run install:all
cp .env.example .env
npm run dev
```

- **App:** http://localhost:5173  
- **API:** http://localhost:3001  
- **Env:** single `.env` at project root  

Click **Continue in Demo Mode** on login (no Firebase required).

## Project structure

```
frontend/   # React PWA (Vite)
backend/    # Express API (MVC)
.env        # secrets (gitignored) — copy from .env.example
docker-compose.yml
```

## Production deploy

**Vercel (recommended for now):** import at [vercel.com/new](https://vercel.com/new) with **Root Directory `.`** and **Framework Preset: Other** (not Services). `vercel.json` builds the PWA and serverless API on one domain.

**Docker (self-hosted):**

```bash
cp .env.example .env
docker compose up --build -d
```

Full guide: **[backend/docs/DEPLOY.md](./backend/docs/DEPLOY.md)** — Vercel, Docker, MongoDB Atlas, Firebase, webhooks.

**WhatsApp webhook:** [backend/docs/WHATSAPP_WEBHOOK.md](./backend/docs/WHATSAPP_WEBHOOK.md) · **AWS Lambda (scale):** [backend/lambda/README.md](./backend/lambda/README.md)

## Summary

- **Auth:** Firebase Google sign-in
- **Hosting:** Vercel (PWA + serverless API) or Docker (`frontend` + `backend` containers)
- **Database:** MongoDB Atlas
- **Lead capture:** Student name + phone; verified / unverified status
- **Rewards:** Wallet entry at each 100 verified leads milestone
