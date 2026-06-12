# Technical Design Document
## Infinity Runner — Volunteer Lead Collection App

| Field | Value |
|-------|-------|
| **Version** | 0.1 (Draft) |
| **Date** | June 11, 2026 |
| **Status** | Draft — Firebase Google auth confirmed; verification flow pending |
| **Related** | [PRD.md](./PRD.md), [DESIGN_DOC.md](./DESIGN_DOC.md) |

---

## 1. Overview

Infinity Runner is a **mobile-first web application** with **PWA** capabilities. Volunteers authenticate, submit leads (name + phone), and accumulate **verified** leads toward **100-lead milestones** that unlock wallet rewards (e.g., Amazon coupons).

This document covers system architecture, data model, APIs, core business logic, security, and deployment considerations.

---

## 2. System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                        Exam Center (Field)                       │
│  ┌──────────────┐    HTTPS      ┌─────────────────────────────┐ │
│  │  Volunteer   │ ────────────► │  Infinity Runner (PWA)      │ │
│  │  Mobile Web  │ ◄──────────── │  React / Next.js Frontend   │ │
│  └──────────────┘               └──────────────┬──────────────┘ │
└────────────────────────────────────────────────┼────────────────┘
                                                 │ REST / GraphQL
                                                 ▼
                        ┌────────────────────────────────────────┐
                        │           API Layer (Backend)           │
                        │  Auth · Leads · Milestones · Wallet    │
                        └──────────────┬─────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                        ▼
     ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
     │   PostgreSQL    │    │  Redis (cache)  │    │  Object Store   │
     │   Primary DB    │    │  sessions/rate  │    │  (optional)     │
     └─────────────────┘    └─────────────────┘    └─────────────────┘

     ┌─────────────────────────────────────────────────────────────┐
     │  Admin / Verification Service (Phase 1: minimal or script)   │
     └─────────────────────────────────────────────────────────────┘
```

---

## 3. Recommended Technology Stack

| Layer | Recommendation | Rationale |
|-------|----------------|-----------|
| **Frontend** | Next.js 14+ (App Router) + TypeScript | SSR/SSG, API routes option, strong PWA support |
| **UI** | Tailwind CSS + shadcn/ui | Fast mobile UI, accessible components |
| **PWA** | `next-pwa` or Workbox | Manifest, service worker, install prompt |
| **Backend** | Next.js API routes **or** separate Node (NestJS/Fastify) | Start monolith; split if scale demands |
| **Database** | PostgreSQL (e.g., Supabase, RDS, Neon) | Relational integrity for leads, rewards, audit |
| **ORM** | Prisma or Drizzle | Type-safe schema, migrations |
| **Auth** | Firebase Authentication (Google provider only) | Client SDK + Admin SDK for token verify |
| **Hosting** | Vercel (frontend) + managed Postgres **or** AWS (see below) | Fast MVP; AWS for enterprise compliance |
| **Secrets** | Environment variables + AWS Secrets Manager / Vercel env | Coupon pools, DB credentials |

### AWS deployment option (when ready)
- **Frontend:** S3 + CloudFront or Amplify Hosting
- **API:** Lambda + API Gateway or ECS Fargate
- **DB:** RDS PostgreSQL
- **Auth:** Firebase Auth (Google) — same as primary stack

---

## 4. Data Model

### 4.1 Entity Relationship (logical)

```
users ──────────────< leads
  │                      │
  │                      └── status: unverified | verified
  │
  ├──────────────< milestone_events
  │
  └──────────────< wallet_items
```

### 4.2 Table Definitions

#### `users`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | Internal app ID |
| `firebase_uid` | VARCHAR(128) UNIQUE | Firebase Auth UID — primary auth key |
| `email` | VARCHAR(255) UNIQUE | From Google profile |
| `full_name` | VARCHAR(255) | From Google `displayName` |
| `photo_url` | VARCHAR(512) NULL | From Google profile picture |
| `verified_lead_count` | INT DEFAULT 0 | Denormalized for fast reads; synced via trigger/job |
| `created_at` | TIMESTAMPTZ | Set on first Google sign-in |
| `updated_at` | TIMESTAMPTZ | |
| `is_active` | BOOLEAN DEFAULT true | |

#### `leads`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `volunteer_id` | UUID FK → users | Who captured the lead |
| `student_name` | VARCHAR(255) | |
| `student_phone` | VARCHAR(20) | Normalize E.164 where possible |
| `status` | ENUM | `unverified`, `verified`, `rejected` |
| `verified_at` | TIMESTAMPTZ NULL | |
| `verified_by` | UUID NULL | Admin user if applicable |
| `exam_center` | VARCHAR(255) NULL | Optional location tag |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Indexes:** `(volunteer_id, created_at)`, `(student_phone)`, `(status)`

#### `milestone_events`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID FK → users | |
| `milestone_number` | INT | 1 = 100 leads, 2 = 200, etc. |
| `verified_count_at_trigger` | INT | e.g., 100, 200 |
| `reward_granted` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

**Unique constraint:** `(user_id, milestone_number)` — prevents duplicate rewards

#### `wallet_items`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID FK → users | |
| `milestone_event_id` | UUID FK → milestone_events | |
| `reward_type` | VARCHAR(50) | e.g., `amazon_coupon` |
| `coupon_code` | VARCHAR(255) | Encrypted at rest recommended |
| `coupon_value` | VARCHAR(50) NULL | e.g., "₹500" |
| `status` | ENUM | `active`, `redeemed`, `expired` |
| `earned_at` | TIMESTAMPTZ | |
| `expires_at` | TIMESTAMPTZ NULL | |

#### `coupon_inventory` (ops-managed pool)
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `reward_type` | VARCHAR(50) | |
| `coupon_code` | VARCHAR(255) UNIQUE | |
| `coupon_value` | VARCHAR(50) | |
| `assigned_to` | UUID NULL FK → users | |
| `assigned_at` | TIMESTAMPTZ NULL | |
| `created_at` | TIMESTAMPTZ | |

#### Auth storage
No custom session table required. Firebase manages auth sessions client-side. Backend verifies **Firebase ID tokens** on each API request via `firebase-admin`.

---

## 5. Core Business Logic

### 5.1 Lead submission flow

```
1. Volunteer submits { student_name, student_phone }
2. Validate phone format (India: +91, 10 digits)
3. INSERT lead with status = 'unverified'
4. Return success + updated unverified count
```

### 5.2 Lead verification flow (pluggable)

**Option A — Admin verifies (recommended v1):**
```
1. Admin sets lead.status = 'verified', verified_at = now()
2. Trigger milestone check for volunteer_id
3. Increment users.verified_lead_count
```

**Option B — Auto-verify (not recommended for rewards):**
Only format validation; counts as verified immediately — high fraud risk.

**Option C — OTP verify (future):**
Student receives SMS; upon confirm, lead → verified.

### 5.3 Milestone & reward algorithm

```typescript
async function onLeadVerified(lead: Lead): Promise<MilestoneResult | null> {
  const volunteer = await incrementVerifiedCount(lead.volunteer_id);
  const count = volunteer.verified_lead_count;
  
  if (count % 100 !== 0) return null;

  const milestoneNumber = count / 100;

  // Idempotency: skip if milestone_events already has this number
  const existing = await findMilestone(lead.volunteer_id, milestoneNumber);
  if (existing) return null;

  const coupon = await assignCouponFromInventory('amazon_coupon', lead.volunteer_id);
  if (!coupon) throw new InsufficientInventoryError();

  const event = await createMilestoneEvent({
    userId: lead.volunteer_id,
    milestoneNumber,
    verifiedCountAtTrigger: count,
  });

  await createWalletItem({
    userId: lead.volunteer_id,
    milestoneEventId: event.id,
    rewardType: 'amazon_coupon',
    couponCode: coupon.code,
    couponValue: coupon.value,
    status: 'active',
  });

  return { milestoneNumber, count, coupon };
}
```

**Frontend:** API response or WebSocket/polling signals client to show milestone modal.

### 5.4 Wallet read model

Aggregate `wallet_items` for `user_id`, decrypt coupon for display, never log full codes.

---

## 6. Authentication Architecture — Firebase Google Only

### 6.1 Decision (locked)

| Setting | Value |
|---------|-------|
| Provider | **Google only** via Firebase Authentication |
| Disabled | Email/password, phone auth, Apple, Facebook, anonymous |
| Registration | Automatic on first successful Google sign-in |
| Login | Same flow — `signInWithPopup` (desktop) or `signInWithRedirect` (mobile/PWA) |

### 6.2 Firebase project setup

1. Create Firebase project in [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication → Sign-in method → Google** (only provider enabled).
3. Register web app; add authorized domains (localhost, production domain).
4. Download service account JSON for backend (`firebase-admin`).
5. Configure OAuth consent screen in Google Cloud Console (app name, support email).

### 6.3 Sign-in flow

```
┌──────────┐    Google OAuth     ┌─────────────┐    ID token    ┌─────────────┐
│  Client  │ ──────────────────► │ Firebase Auth│ ─────────────► │   Backend   │
│ (Next.js)│ ◄────────────────── │              │                │ verify token│
└──────────┘    user + token      └─────────────┘                └──────┬──────┘
                                                                        │
                                                                        ▼
                                                               UPSERT users by
                                                               firebase_uid
```

**Client (Firebase JS SDK v10+ modular):**
```typescript
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// Desktop: signInWithPopup(auth, provider)
// Mobile:  signInWithRedirect(auth, provider) — better UX in PWA
```

**After sign-in:**
```typescript
const idToken = await auth.currentUser.getIdToken();
await fetch('/api/v1/auth/sync', {
  method: 'POST',
  headers: { Authorization: `Bearer ${idToken}` },
});
```

### 6.4 Backend token verification

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

async function verifyRequest(req: Request): Promise<DecodedUser> {
  const header = req.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) throw new UnauthorizedError();

  const idToken = header.slice(7);
  const decoded = await getAuth().verifyIdToken(idToken);

  return upsertUser({
    firebase_uid: decoded.uid,
    email: decoded.email!,
    full_name: decoded.name ?? decoded.email!.split('@')[0],
    photo_url: decoded.picture ?? null,
  });
}
```

### 6.5 User upsert (first sign-in = registration)

```typescript
async function upsertUser(profile: GoogleProfile): Promise<User> {
  return db.users.upsert({
    where: { firebase_uid: profile.firebase_uid },
    create: { ...profile },
    update: { email: profile.email, full_name: profile.full_name, photo_url: profile.photo_url },
  });
}
```

### 6.6 Session persistence

- Firebase Auth persists session in `indexedDB` / `localStorage` (configurable).
- Client refreshes ID token automatically (`onIdTokenChanged`).
- API middleware re-verifies token per request (or caches short TTL).
- Sign out: `signOut(auth)` on client; no server-side session to revoke.

### 6.7 Route protection (Next.js)

```typescript
// middleware or layout guard
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!user) router.replace('/login');
});
```

Protected API routes: reject requests without valid `Authorization: Bearer <firebase_id_token>`.

---

## 7. API Specification (REST)

Base path: `/api/v1`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/sync` | Verify Firebase ID token; upsert user (first sign-in = register) |
| GET | `/auth/me` | Current user profile + lead counts (requires Bearer token) |

> Sign-in and sign-out happen **client-side** via Firebase SDK. No `/auth/login` or `/auth/logout` API endpoints.

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/leads` | Create lead (name, phone) |
| GET | `/leads` | List own leads (paginated) |
| GET | `/leads/summary` | `{ verified, unverified, total }` |

### Wallet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet` | List rewards |
| GET | `/wallet/:id` | Single reward detail |

### Milestones
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/milestones/pending` | Unacknowledged milestone for popup |
| POST | `/milestones/:id/acknowledge` | Mark popup seen |

### Admin (Phase 1 minimal)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/admin/leads/:id/verify` | Set lead verified |
| PATCH | `/admin/leads/:id/reject` | Reject invalid lead |
| POST | `/admin/coupons/import` | Bulk upload coupon codes |

### Example: Create lead

**Request**
```json
POST /api/v1/leads
Authorization: Bearer <firebase_id_token>

{
  "student_name": "Rahul Sharma",
  "student_phone": "9876543210"
}
```

**Response**
```json
{
  "id": "uuid",
  "status": "unverified",
  "created_at": "2026-06-11T10:00:00Z",
  "summary": {
    "verified": 87,
    "unverified": 23,
    "total": 110
  }
}
```

### Example: Milestone pending

**Response**
```json
{
  "has_pending": true,
  "milestone": {
    "id": "uuid",
    "verified_count": 100,
    "milestone_number": 1,
    "reward": {
      "type": "amazon_coupon",
      "value": "₹500",
      "preview": "****-XXXX"
    }
  }
}
```

---

## 8. Frontend Architecture

### 8.1 Route structure

```
/                     → redirect (login or dashboard)
/login                → Google sign-in (login + first-time registration)
/dashboard            → Summary + navigation
/leads/new            → Add lead form
/leads                → Lead list (optional v1)
/wallet               → Rewards list
```

### 8.2 State management
- **Server state:** TanStack Query (React Query) for API data
- **Client state:** Firebase `onAuthStateChanged` + React Context; Zustand for milestone modal queue
- **Forms:** React Hook Form + Zod validation

### 8.3 PWA configuration

**`manifest.json` (key fields):**
```json
{
  "name": "Infinity Runner",
  "short_name": "Runner",
  "display": "standalone",
  "start_url": "/dashboard",
  "theme_color": "#1a56db",
  "background_color": "#ffffff",
  "icons": [/* 192, 512 */]
}
```

**Service worker:**
- Cache app shell (HTML, JS, CSS)
- Network-first for API calls
- Phase 2: Background sync for offline lead queue

### 8.4 Milestone popup trigger

```
On dashboard mount AND after lead verify webhook/poll:
  GET /milestones/pending
  if has_pending → show Modal
  on dismiss → POST /milestones/:id/acknowledge
```

---

## 9. Security

| Area | Measure |
|------|---------|
| Transport | TLS 1.2+ everywhere |
| PII | Encrypt `student_phone`, `coupon_code` at rest (AES-256 or DB-level) |
| API | Rate limit lead creation (e.g., 30/min per user) |
| Auth | Verify Firebase ID tokens server-side; reject expired/tampered tokens |
| Firebase | Restrict authorized domains; disable unused sign-in providers |
| Authorization | Volunteers only access own leads/wallet |
| Admin | Separate role; IP allowlist optional |
| Audit | Log verification actions and reward grants |

---

## 10. Observability

| Tool | Purpose |
|------|---------|
| Structured logging (JSON) | Request IDs, user actions |
| Error tracking (Sentry) | Frontend + API errors |
| Metrics | Leads/day, verification latency, milestone grants |
| Alerts | Coupon inventory low, API error rate spike |

---

## 11. Environment Variables

```bash
DATABASE_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_JSON=   # or path to service account file
ENCRYPTION_KEY=                  # for PII/coupons
COUPON_LOW_STOCK_THRESHOLD=10
NEXT_PUBLIC_APP_URL=
```

---

## 12. Testing Strategy

| Layer | Approach |
|-------|----------|
| Unit | Milestone math, phone validation, idempotency |
| Integration | Lead create → verify → wallet item created |
| E2E | Playwright: Google sign-in (mocked) → add lead → (mock verify) → see wallet |
| Load | k6 on `/leads` POST during peak simulation |

**Critical test cases:**
1. 99 → 100 verified leads grants exactly one coupon
2. Duplicate milestone does not double-grant
3. Unverified leads never trigger milestone
4. Empty coupon inventory fails gracefully with ops alert

---

## 13. Deployment & CI/CD

```
Git push → GitHub Actions
  ├── lint + typecheck
  ├── unit tests
  ├── build
  └── deploy (Vercel preview / prod OR AWS pipeline)
```

**Database migrations:** Prisma migrate in CI before deploy.

---

## 14. Open Technical Decisions

| ID | Decision | Blocker for |
|----|----------|-------------|
| ~~TD-1~~ | ~~Auth provider & login flow~~ | **Resolved:** Firebase Google only |
| TD-2 | Verification actor (admin vs automated) | Milestone integrity |
| TD-3 | Monolith vs split API | Team size / scale |
| TD-4 | Coupon encryption key management | Security review |
| TD-5 | Offline sync strategy | PWA Phase 2 |

---

## 15. Suggested Folder Structure

```
infinity-runner/
├── client/                     # React (Vite) PWA frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── lib/
│   └── public/
│       └── manifest.json
├── server/                     # Express API
│   ├── src/
│   └── data/db.json
├── docs/
│   ├── PRD.md
│   ├── TECH_DOC.md
│   └── DESIGN_DOC.md
└── docker-compose.yml          # Local Postgres (future)
```

---

*Auth (TD-1) is locked. Proceed with Firebase Google implementation; confirm TD-2 (verification) in parallel.*
