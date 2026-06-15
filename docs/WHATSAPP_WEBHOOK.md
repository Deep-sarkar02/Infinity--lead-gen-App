# WhatsApp webhook — local & Vercel testing

Gupshup sends inbound WhatsApp replies to your API. This guide covers **local** and **Vercel** setup.

## Webhook URL

| Environment | URL |
|-------------|-----|
| **Local** (via tunnel) | `https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp` |
| **Vercel** | `https://YOUR-APP.vercel.app/api/webhooks/gupshup/whatsapp` |

`GET` on that URL returns `{ ok: true }` — use it to verify the route is live.

---

## 1. Environment variables

Add to `server/.env` (local) and **Vercel → Settings → Environment Variables**:

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Yes | Save inbound messages |
| `GUPSHUP_WEBHOOK_SECRET` | Recommended | Protect webhook (`?secret=...` or header `x-webhook-secret`) |
| `WHATSAPP_QR_PHONE` | Optional | Business number in QR links (default `919100074637`) |

---

## 2. Local testing

### Step A — Start the app

```bash
npm run dev
```

API: `http://localhost:3001`  
App: `http://localhost:5173`

### Step B — Expose API to the internet (Gupshup needs HTTPS)

In a **second terminal**:

```bash
npm run tunnel:api
```

Copy the `https://....trycloudflare.com` URL.

Your webhook URL is:

```
https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp
```

If you set `GUPSHUP_WEBHOOK_SECRET=my-secret-123`, use:

```
https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp?secret=my-secret-123
```

> **Note:** `npm run tunnel` points at the React app (5173). For webhooks you need **`npm run tunnel:api`** (port **3001**).

### Step C — Configure Gupshup

1. [Gupshup Console](https://www.gupshup.io/developer/home) → your WhatsApp app  
2. **Webhook / Callback URL** → paste the tunnel URL (with `?secret=` if used)  
3. Enable **inbound message** events  

### Step D — Simulate a reply (no real WhatsApp needed)

```bash
npm run webhook:test --prefix server
```

Optional — test against tunnel or Vercel:

```bash
# PowerShell
$env:WEBHOOK_URL="https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp"
$env:GUPSHUP_WEBHOOK_SECRET="my-secret-123"
npm run webhook:test --prefix server
```

Expected response:

```json
{ "ok": true, "saved": true, "inboundId": "...", "matchedLeadId": "..." }
```

### Step E — Real WhatsApp test

1. Log in → generate your **WhatsApp QR** (includes `Ref: SCOUT-...`)  
2. From another phone, scan QR and send the message  
3. Check server logs for `[webhook] Inbound saved:`  
4. In MongoDB Atlas → `whatsappinbounds` collection for saved rows  

---

## 3. Vercel testing

### Step A — Deploy latest code

Push to GitHub; Vercel auto-deploys.

### Step B — Set env vars on Vercel

- `MONGODB_URI`
- `GUPSHUP_WEBHOOK_SECRET` (same value you use in Gupshup URL)

### Step C — Verify webhook is live

Open in browser:

```
https://YOUR-APP.vercel.app/api/webhooks/gupshup/whatsapp
```

Should return JSON: `Gupshup WhatsApp webhook is active...`

### Step D — Point Gupshup to Vercel

Webhook URL:

```
https://YOUR-APP.vercel.app/api/webhooks/gupshup/whatsapp?secret=YOUR_SECRET
```

### Step E — Test from your machine

```bash
$env:WEBHOOK_URL="https://YOUR-APP.vercel.app/api/webhooks/gupshup/whatsapp"
$env:GUPSHUP_WEBHOOK_SECRET="YOUR_SECRET"
npm run webhook:test --prefix server
```

### Step F — Real reply test

Send a WhatsApp message to your business number after using a volunteer QR link.

---

## 4. How matching works

| Source | Match logic |
|--------|-------------|
| **Volunteer QR** | `Ref: SCOUT-XXXXXXXX` in message → `users.scout_ref` |
| **Lead reply** | Sender phone (last 10 digits) → `leads.student_phone` |

When a lead reply matches, the lead gets:

- `whatsapp_replied_at`
- `whatsapp_reply_text`

All inbound messages are stored in **`whatsappinbounds`**.

---

## 5. Troubleshooting

| Problem | Fix |
|---------|-----|
| Gupshup can't reach URL | Use `tunnel:api` (3001), not `tunnel` (5173) |
| `401 Invalid webhook secret` | Match `GUPSHUP_WEBHOOK_SECRET` in `.env`, Vercel, and Gupshup URL |
| `ignored: true` | Payload wasn't an inbound text message — check Gupshup event type |
| Vercel 500 on webhook | Check Vercel **Functions** logs; confirm `MONGODB_URI` is set |
| No lead match | Phone in webhook must match lead's `student_phone` (10-digit Indian) |
| QR has no Ref | Regenerate QR after deploy (new QRs include scout ref) |

---

## 6. Quick reference

```bash
# Terminal 1
npm run dev

# Terminal 2 (local webhook URL for Gupshup)
npm run tunnel:api

# Terminal 3 (fake inbound message)
npm run webhook:test --prefix server
```
