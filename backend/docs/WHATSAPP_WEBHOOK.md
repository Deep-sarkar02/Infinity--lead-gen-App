# WhatsApp webhook — local, Docker & AWS Lambda

Gupshup sends inbound WhatsApp replies to your API. This guide covers **local**, **Docker production**, and **AWS Lambda** (optional — auto-scales under high load).

## Webhook URL

| Environment | URL |
|-------------|-----|
| **AWS Lambda** (recommended) | `https://xxxx.lambda-url.REGION.on.aws/` — see [lambda/README.md](../lambda/README.md) |
| **Docker production** | `https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp` |
| **Local** (via tunnel) | `https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp` |

`GET` on that URL returns `{ ok: true }` — use it to verify the route is live.

### Deploy Lambda (one command after setup)

```bash
cd backend/lambda && npm install
npm run lambda:deploy:guided
```

Paste the **WebhookFunctionUrl** from the deploy output into Gupshup. Full guide: [backend/lambda/README.md](../lambda/README.md).

---

## 1. Environment variables

Add to `.env` on the server (and locally):

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Yes | Save inbound messages |
| `GUPSHUP_WEBHOOK_SECRET` | Recommended | Protect webhook (`?secret=...` or header `x-webhook-secret`) |
| `WHATSAPP_QR_PHONE` | N/A | QR links use hardcoded `919100074637` in code |

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

**Custom journey body** (optional — Gupshup bot / flow webhook):

```json
{
  "user-name": "{{var_global.user_name}}",
  "user_number": "{{var_system.user_channel_id}}",
  "user_input": "{{var_system.user_input}}"
}
```

The API maps these to:

| Gupshup field | Stored as |
|---------------|-----------|
| `user-name` | `sender_name` |
| `user_number` | `from_phone` |
| `user_input` | `message_text`, `user_input` |

When the message matches the QR pre-fill (`Interested to know more about the courses {volunteer name}`), the backend stores **scout** details from your users table:

| Field | Source |
|-------|--------|
| `scout_ref` | Volunteer matched by name (stored internally on user) |
| `volunteer_id` | Scout user id |
| `volunteer_name` | Scout full name |
| `volunteer_email` | Scout email |

Test the journey format locally:

**Git Bash / Linux / macOS:**

```bash
WEBHOOK_FORMAT=journey WEBHOOK_URL="https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp" npm run webhook:test --prefix backend
```

**PowerShell:**

```powershell
$env:WEBHOOK_FORMAT="journey"
$env:WEBHOOK_URL="https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp"
npm run webhook:test --prefix backend
```

### Step D — Simulate a reply (no real WhatsApp needed)

```bash
npm run webhook:test --prefix backend
```

Optional — test against tunnel or production URL:

**Git Bash / Linux / macOS:**

```bash
WEBHOOK_URL="https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp" \
GUPSHUP_WEBHOOK_SECRET="my-secret-123" \
npm run webhook:test --prefix backend
```

**PowerShell:**

```powershell
$env:WEBHOOK_URL="https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp"
$env:GUPSHUP_WEBHOOK_SECRET="my-secret-123"
npm run webhook:test --prefix backend
```

Expected response:

```json
{ "ok": true, "saved": true, "inboundId": "...", "matchedLeadId": "..." }
```

### Step E — Real WhatsApp test

1. Log in → generate your **WhatsApp QR** (pre-filled with your name)  
2. From another phone, scan QR and send the message  
3. Check server logs for `[webhook] Inbound saved:`  
4. In MongoDB Atlas → `whatsappinbounds` collection for saved rows  

---

## 3. Docker production

### Step A — Deploy

On your server:

```bash
docker compose up --build -d
```

See [DEPLOY.md](./DEPLOY.md) for HTTPS and Firebase setup.

### Step B — Verify webhook is live

```
https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp
```

Should return JSON confirming the webhook is active.

### Step C — Point Gupshup to production

```
https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp?secret=YOUR_SECRET
```

### Step D — Test from your machine

**Git Bash:**

```bash
WEBHOOK_URL="https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp" \
GUPSHUP_WEBHOOK_SECRET="YOUR_SECRET" \
npm run webhook:test --prefix backend
```

**PowerShell:**

```powershell
$env:WEBHOOK_URL="https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp"
$env:GUPSHUP_WEBHOOK_SECRET="YOUR_SECRET"
npm run webhook:test --prefix backend
```

### Step E — Real reply test

Send a WhatsApp message to your business number after using a volunteer QR link.

---

## 4. How matching works

When the message matches the QR pre-fill text, the backend **creates or verifies a lead**:

- New phone + volunteer name in message → creates a **verified** lead under that volunteer
- Existing unverified lead → marks **verified**
- Already verified → only updates reply text (no duplicate count)

| Source | Match logic |
|--------|-------------|
| **Volunteer QR** | Message text `Interested to know more about the courses {name}` → `users.full_name` |
| **Legacy QR** | `Ref: SCOUT-XXXXXXXX` in message still works if present |
| **Lead phone** | Sender phone → `leads.student_phone` |

When a lead reply matches, the lead gets:

- `whatsapp_replied_at`
- `whatsapp_reply_text`

All inbound messages are stored in **`whatsappinbounds`** with:

- WhatsApp user: `sender_name`, `from_phone`, `user_input`
- Scout: `scout_ref`, `volunteer_id`, `volunteer_name`, `volunteer_email`
- Lead link: `lead_id` (when matched or auto-verified)

---

## 5. Troubleshooting

| Problem | Fix |
|---------|-----|
| Gupshup can't reach URL | Use `tunnel:api` (3001), not `tunnel` (5173) |
| `401 Invalid webhook secret` | Match `GUPSHUP_WEBHOOK_SECRET` in `.env` and Gupshup URL |
| `ignored: true` | Payload wasn't an inbound text message — check Gupshup event type |
| **No webhook in server logs at all** | Gupshup callback URL wrong or tunnel dead — see checklist below |
| **Test works, real WhatsApp doesn't** | Gupshup callback URL wrong, or Journey webhook not pointing at your tunnel |
| `volunteer_id` is null | Scout never generated QR while logged in — click **Generate QR** in app |
| Webhook 500 | Check `docker compose logs backend`; confirm `MONGODB_URI` is set |
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
npm run webhook:test --prefix backend
```

---

## 7. "Thanks" / "Welcome" in WhatsApp but nothing in Atlas or bash?

**This is the most common issue.** The auto-reply ("Thanks", "Welcome") is sent **inside Gupshup Journey**. It does **not** mean IL Scout received anything.

| What you see | What it means |
|--------------|----------------|
| "Thanks" in WhatsApp | Gupshup bot replied — **Journey ran** |
| No `[webhook] POST received` in bash | Gupshup **never called your API** |
| No new row in Atlas `whatsappinbounds` | Webhook did not reach your server |

### Fix — add the API call in Gupshup Journey

In Gupshup Journey builder, you need an **API / Webhook** node **before** the "Thanks" message:

1. **URL:**
   ```
   https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp
   ```
   (Copy from `npm run tunnel:api` output — changes every restart)

2. **Method:** POST

3. **Body (JSON):**
   ```json
   {
     "user-name": "{{var_global.user_name}}",
     "user_number": "{{var_system.user_channel_id}}",
     "user_input": "{{var_system.user_input}}"
   }
   ```

4. **Flow order:** User message → **API node (your URL)** → Send "Thanks"

Also set **App callback URL** in Gupshup Console → your WhatsApp app → Webhook (inbound messages enabled) — same URL as above.

### How to confirm it works

After sending WhatsApp, **bash must show** within 1–2 seconds:

```
[webhook] POST received { contentType: '...', bodyKeys: [...] }
[webhook] Inbound saved: { saved: true, ... }
```

If bash stays silent → Gupshup URL is wrong, tunnel is off, or Journey has no API node.

### Quick self-test (proves Atlas + code work)

**Git Bash:**
```bash
WEBHOOK_FORMAT=journey WEBHOOK_URL="https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp" npm run webhook:test --prefix backend
```

If this saves to Atlas but real WhatsApp does not → **100% a Gupshup URL / Journey config issue**, not your code.

---

## 8. Real WhatsApp not arriving? (checklist)

If the test script saves a doc but a real WhatsApp message does **nothing**:

1. **Watch server logs** — when you send WhatsApp, look for `[webhook] POST received` in `npm run dev`.
   - **No log** → Gupshup is not reaching your URL (fix callback URL or tunnel).
   - **`ignored: true`** → payload format issue; copy the log and share with dev.
   - **`Inbound saved`** → webhook works; check MongoDB `whatsappinbounds`.

2. **Gupshup callback URL** = current tunnel URL:
   ```
   https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp
   ```
   Enable **inbound messages**. If using a Journey with custom JSON, put the **same URL** on the Journey webhook/API node.

3. **Gupshup callback URL** + tunnel running — QR uses `919100074637`; inbound webhook is separate (Gupshup Journey → your API URL).

4. **Both running** — `npm run dev` + `npm run tunnel:api`.

5. **Simulate real Gupshup format:**
   ```bash
   WEBHOOK_FORMAT=gupshup WEBHOOK_URL="https://YOUR-TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp" npm run webhook:test --prefix backend
   ```
