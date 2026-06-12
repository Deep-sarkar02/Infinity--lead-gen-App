# Infinity Runner

Mobile-first web app (PWA) for **Infinity Learn volunteers** to collect student leads at exam centers, track verified vs. unverified leads, and earn wallet rewards (e.g., Amazon coupons) at every **100 verified leads**.

## Documentation

| Document | Description |
|----------|-------------|
| [docs/PRD.md](./docs/PRD.md) | Product requirements, user stories, open questions |
| [docs/TECH_DOC.md](./docs/TECH_DOC.md) | Architecture, data model, APIs, security |
| [docs/DESIGN_DOC.md](./docs/DESIGN_DOC.md) | UX flows, screens, components, wireframes |
| [docs/brand-tokens.md](./docs/brand-tokens.md) | IL brand colors, typography, CSS variables (from Figma reference) |

## Status

**Draft** — auth confirmed; awaiting senior review on lead verification.

| Decided | Pending |
|---------|---------|
| Login via **Firebase Google Authentication only** | Who verifies leads and how |
| First Google sign-in = automatic registration | — |
| No volunteer phone — Google profile only | — |

## Quick start (React — recommended)

```bash
npm run install:all
# Start MongoDB locally, then seed once:
npm run db:seed --prefix server
npm run dev
```

- **React app:** [http://localhost:5173](http://localhost:5173)
- **API:** http://localhost:3001
- **Database:** MongoDB (`MONGODB_URI` in `server/.env`, default `mongodb://127.0.0.1:27017/infinity_runner`)

Click **Continue in Demo Mode** on login (no Firebase needed).

See [client/README.md](./client/README.md) for details.

## Deploy (free)

Host on **[Render](https://render.com)** — static frontend + Node API, connected to MongoDB Atlas.

Full guide: [docs/DEPLOY.md](./docs/DEPLOY.md)

## Quick summary

- **Auth:** Firebase Google sign-in (no password / OTP / other providers)
- **Users:** Infinity volunteers at exam centers
- **Capture:** Student name + phone only
- **Lead types:** Verified (counts toward rewards) · Unverified (pending)
- **Rewards:** Popup + wallet entry at each 100 verified leads milestone
