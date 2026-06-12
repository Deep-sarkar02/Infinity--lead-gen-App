# Product Requirements Document (PRD)
## Infinity Runner — Volunteer Lead Collection App

| Field | Value |
|-------|-------|
| **Product** | Infinity Runner |
| **Version** | 0.1 (Draft) |
| **Date** | June 11, 2026 |
| **Status** | Draft — auth confirmed (Firebase Google); verification flow pending |
| **Owner** | Infinity Learn Team |

---

## 1. Executive Summary

Infinity Runner is a mobile-first web application (with optional PWA support) for **Infinity Learn volunteers** who stand outside exam centers to promote the Infinity team and collect student leads. Volunteers capture minimal lead data (name, phone), track verified vs. unverified leads, and earn rewards (e.g., Amazon coupons) when they hit milestones of **100 verified leads**.

This document defines the product problem, goals, user needs, functional requirements, and open decisions.

---

## 2. Problem Statement

### Current situation
- Volunteers manually collect leads at exam centers using informal methods (paper, spreadsheets, or ad-hoc tools).
- There is no centralized system to:
  - Register and identify volunteers
  - Standardize lead capture (name + phone only)
  - Distinguish **verified** vs. **unverified** leads
  - Track progress toward reward milestones
  - Deliver and display earned prizes in a user wallet

### Pain points
| Pain point | Impact |
|------------|--------|
| Fragmented lead data | Hard to audit, duplicate entries, lost leads |
| No verification workflow | Rewards cannot be tied to quality leads |
| Manual reward tracking | Volunteers don't see progress; ops team overhead |
| No mobile-optimized tool | Slow data entry at busy exam centers |
| No volunteer identity | Cannot attribute leads or prevent abuse |

### Opportunity
A lightweight, offline-capable PWA lets volunteers add leads in seconds, see real-time progress, get milestone celebrations, and view earned coupons in a wallet — while ops gets structured data in one database.

---

## 3. Goals & Non-Goals

### Goals
1. Enable volunteer sign-in via Firebase Google Authentication and access to a dashboard (first sign-in registers the user automatically).
2. Allow fast lead entry (name + phone) from mobile devices at exam centers.
3. Support two lead types: **verified** and **unverified**.
4. Automatically track verified lead count per volunteer.
5. Trigger milestone UI (popup) at every **100 verified leads** and grant rewards.
6. Persist rewards in DB and display them in an in-app **Wallet**.
7. Be installable as a PWA for quick access without app store friction.

### Non-Goals (v1)
- Native iOS/Android apps
- Complex CRM features (email campaigns, pipelines, etc.)
- Collecting more than name + phone at point of capture
- Volunteer-to-volunteer messaging or social features
- Automated lead verification via OTP/SMS (unless decided later)
- Payment processing or cash redemption outside coupon display

---

## 4. User Personas

### Primary: Field Volunteer ("Runner")
- **Who:** Infinity Learn volunteer at exam centers
- **Context:** Standing outside venues, short interactions, possibly poor network
- **Needs:** Quick login, add lead in &lt;10 seconds, see count and rewards
- **Devices:** Mid-range Android phones primarily; occasional iOS

### Secondary: Ops / Admin (future phase)
- **Who:** Infinity Learn internal team
- **Needs:** View all leads, mark leads verified/unverified, manage rewards, export data
- *Note: Admin console not in v1 scope unless explicitly added.*

---

## 5. User Stories

| ID | As a… | I want to… | So that… | Priority |
|----|--------|------------|----------|----------|
| US-01 | Volunteer | Sign in with my Google account (first time creates my account) | I can be identified when adding leads | P0 |
| US-02 | Volunteer | Log in with Google on return visits | Only I can access my dashboard and leads | P0 |
| US-03 | Volunteer | Add a lead with name and phone | I capture interest quickly at the center | P0 |
| US-04 | Volunteer | See my total verified and unverified lead counts | I know my progress | P0 |
| US-05 | Volunteer | Get a popup when I reach 100 verified leads | I feel rewarded and know I earned a prize | P0 |
| US-06 | Volunteer | View earned coupons in my wallet | I can redeem or reference my rewards | P0 |
| US-07 | Volunteer | Install the app on my home screen (PWA) | I open it faster at exam centers | P1 |
| US-08 | Volunteer | Add leads when offline | I don't lose data with bad connectivity | P1 |
| US-09 | Ops (future) | Mark leads as verified/unverified | Rewards reflect real quality | P0* |

*US-09 is critical for the reward model but verification **actor** and **method** are TBD (see §10).*

---

## 6. Functional Requirements

### 6.1 Authentication (Firebase Google — sign-in & registration)

Login is **exclusively** via **Firebase Authentication with Google** as the only provider. There is no password, phone OTP, or alternate SSO.

| Req ID | Requirement | Acceptance criteria |
|--------|-------------|---------------------|
| FR-01 | User can sign in with Google | Firebase Auth completes; ID token issued |
| FR-02 | First-time Google sign-in creates volunteer account | User record upserted in DB (Firebase UID + Google profile) |
| FR-03 | Returning user signs in with same Google account | Existing user matched by `firebase_uid`; dashboard loads |
| FR-04 | Only Google provider enabled in Firebase | No email/password or other OAuth providers in console |
| FR-05 | Failed or cancelled sign-in handled gracefully | Clear error; user remains on login screen |
| FR-06 | Session persists on mobile via Firebase | User not forced to sign in on every lead entry |
| FR-07 | User can sign out | Firebase session cleared; redirected to login |

**Profile data sourced from Google (automatic):**
- Display name
- Email address
- Profile photo URL (optional, for avatar)

**Volunteer phone number is not collected.** Google profile (name, email, photo) is sufficient for volunteer identity.

### 6.2 Post-authentication routing
| Req ID | Requirement | Acceptance criteria |
|--------|-------------|---------------------|
| FR-08 | After successful Google sign-in, user lands directly on dashboard | No additional profile or phone step |
| FR-09 | Backend sync on sign-in | Firebase ID token verified; app user record created/updated |

### 6.3 Dashboard
| Req ID | Requirement | Acceptance criteria |
|--------|-------------|---------------------|
| FR-10 | Dashboard shows lead summary | Verified count, unverified count, total visible |
| FR-11 | Primary CTA: "Add Lead" | Navigates to lead form |
| FR-12 | Access to Wallet | Navigates to wallet view |
| FR-13 | User profile / logout | Google name/avatar shown; sign out available |

### 6.4 Lead Capture
| Req ID | Requirement | Acceptance criteria |
|--------|-------------|---------------------|
| FR-14 | Form accepts **name** and **phone** only | Both required; validated format |
| FR-15 | Lead saved with timestamp and volunteer ID | Attributed to logged-in user |
| FR-16 | Lead default status = **unverified** | Unless verification happens at capture (TBD) |
| FR-17 | Success feedback after save | Toast/confirmation; option to add another |
| FR-18 | Duplicate phone detection (optional v1) | Warn if same phone added recently by same user |

### 6.5 Lead Types: Verified vs. Unverified

| Type | Definition (proposed) | Counts toward 100 milestone? |
|------|---------------------|------------------------------|
| **Unverified** | Lead submitted by volunteer; not yet confirmed by ops/system | No |
| **Verified** | Lead confirmed valid (method TBD) | **Yes** |

**Verification options to decide with senior:**
1. **Backend/admin verification** — Ops marks leads verified in admin panel.
2. **Automatic verification** — e.g., duplicate check, format validation only (weak).
3. **OTP verification** — Student confirms phone via SMS (heavier, more accurate).

### 6.6 Milestone & Rewards (100 Verified Leads)
| Req ID | Requirement | Acceptance criteria |
|--------|-------------|---------------------|
| FR-19 | System tracks verified count per volunteer | Accurate, monotonic counter |
| FR-20 | At each multiple of 100 verified leads, trigger milestone event | e.g., 100, 200, 300… |
| FR-21 | Show celebratory popup/modal | Message: "You have successfully collected **X** verified leads!" |
| FR-22 | Popup shows prize earned | e.g., Amazon coupon details |
| FR-23 | Create wallet entry in DB | Coupon code, type, milestone, date, status |
| FR-24 | Popup dismissed only after user acknowledges | Single primary action (e.g., "View in Wallet") |
| FR-25 | No duplicate reward for same milestone | Idempotent reward grant |

**Reward example copy:**
> "Congratulations! You have collected **100 verified leads**. You've received an **Amazon coupon** — check your Wallet."

### 6.7 Wallet
| Req ID | Requirement | Acceptance criteria |
|--------|-------------|---------------------|
| FR-26 | List all earned rewards for user | Newest first |
| FR-27 | Show coupon type, code/value, earned date, milestone | Readable on mobile |
| FR-28 | Empty state when no rewards | Encouraging message + progress hint |
| FR-29 | Reward status | e.g., `active`, `redeemed`, `expired` (if applicable) |

### 6.8 PWA (Progressive Web App)
| Req ID | Requirement | Acceptance criteria |
|--------|-------------|---------------------|
| FR-30 | Web app manifest with name, icons, theme | Installable on supported browsers |
| FR-31 | Service worker for caching shell | Faster repeat loads |
| FR-32 | Works on mobile viewport | Responsive layout |

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Lead form submit &lt; 2s on 4G |
| **Availability** | 99.5% uptime target |
| **Security** | HTTPS, Firebase ID token verification on all API calls |
| **Privacy** | Phone numbers stored encrypted at rest (recommended) |
| **Scalability** | Support 1,000+ concurrent volunteers during exam season |
| **Accessibility** | Minimum WCAG 2.1 AA for forms and modals |
| **Localization** | English v1; Hindi optional later |

---

## 8. Success Metrics

| Metric | Target (90 days post-launch) |
|--------|------------------------------|
| Registered volunteers | Baseline TBD by ops |
| Leads per volunteer per day | Track median |
| Lead submission error rate | &lt; 2% |
| Time to add one lead | &lt; 15 seconds median |
| Verified lead ratio | Track; target set by ops |
| Milestone rewards issued | Audit 100% match verified counts |
| PWA install rate | &gt; 30% of active volunteers |

---

## 9. Release Phases

### Phase 1 — MVP
- Firebase Google sign-in (login + first-time registration)
- Dashboard with counts
- Add lead (name, phone)
- Lead stored as unverified by default
- Manual/backend verification path (minimal admin or script)
- Milestone popup at 100 verified leads
- Wallet with coupon display

### Phase 2
- PWA offline queue for leads
- Admin dashboard for verification at scale
- Duplicate detection and lead quality rules
- Push notifications for milestones

### Phase 3
- OTP-based lead verification
- Multiple reward tiers and types
- Analytics dashboard for ops
- Regional leaderboards (if desired)

---

## 10. Open Questions (For Senior Review)

| # | Question | Impact | Owner |
|---|----------|--------|-------|
| ~~OQ-1~~ | ~~**What is the login flow?**~~ | **Resolved:** Firebase Google Authentication only | — |
| OQ-2 | **Who verifies leads and how?** Admin panel, batch job, or student OTP? | Reward integrity | Senior / Ops |
| ~~OQ-3~~ | ~~**Post–Google-sign-in profile fields?**~~ | **Resolved:** No volunteer phone; Google name/email/photo only | — |
| OQ-4 | **How are Amazon coupons sourced?** Pre-generated pool, API, manual upload? | Wallet backend | Ops / Finance |
| OQ-5 | **One coupon per 100 leads or escalating rewards?** | Business rules | Product |
| OQ-6 | **Can one phone be a lead for multiple volunteers?** | Duplicate policy | Legal / Ops |
| OQ-7 | **Exam center / location tagging on leads?** | Reporting | Product |
| OQ-8 | **Admin roles in v1 or later?** | Scope | Senior |

---

## 11. Assumptions

1. Volunteers sign in with a Google account; first sign-in creates their app account automatically.
2. Volunteers are pre-approved or self-register with ops oversight.
3. Rewards are digital coupons, not cash.
4. Verified lead count is the **only** trigger for milestone rewards in v1.
5. Unverified leads are visible to the volunteer but do not unlock rewards.
6. English UI is sufficient for v1.
7. Volunteers must have a Google account to use the app.
8. Volunteer phone number is not stored; only **student** phone is captured per lead.

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Fake leads to farm coupons | Verification workflow + audit; rate limits |
| Poor network at centers | PWA offline queue (Phase 2); optimistic UI |
| Coupon inventory runs out | Inventory tracking + ops alerts before grant |
| Volunteers without Google accounts | Ops communication; no alternate login in v1 |
| Google sign-in blocked on device/browser | Document supported browsers; test PWA + Chrome Android |
| GDPR/privacy for student phone data | Consent at capture; retention policy; encryption |

---

## 13. Appendix — Glossary

| Term | Definition |
|------|------------|
| **Lead** | A prospective student record (name + phone) |
| **Verified lead** | Lead confirmed valid per business rules |
| **Unverified lead** | Submitted but not yet confirmed |
| **Milestone** | Every 100 verified leads for a volunteer |
| **Wallet** | In-app view of earned digital rewards |
| **Runner** | Volunteer using the app in the field |

---

*Next step: Review remaining §10 open questions (verification), then begin implementation with Firebase Google Auth.*
