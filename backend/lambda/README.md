# AWS Lambda — Gupshup webhook (auto-scaling)

Deploy the WhatsApp **callback URL** on **AWS Lambda** with a **Function URL**. Lambda scales automatically under load so the webhook stays available without running your own server.

## Architecture

```
Gupshup (HTTPS POST)
        │
        ▼
┌─────────────────────────┐
│  Lambda Function URL    │  ← auto-scales per request
│  ilbtl-gupshup-webhook  │
└───────────┬─────────────┘
            │
            ▼
     MongoDB Atlas
```

Same business logic as `POST /api/webhooks/gupshup/whatsapp` on the Express API — inbound messages are saved and leads can be verified.

## Prerequisites

1. **AWS account** with permissions for Lambda, IAM, S3 (SAM deploy bucket), CloudWatch
2. **[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)** configured (`aws configure`)
3. **[AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)**
4. **MongoDB Atlas** — Network Access must allow Lambda (use `0.0.0.0/0` or AWS IP ranges; Lambda has no fixed egress IP on the free tier)

## One-time setup

```bash
cd backend/lambda
npm install
```

Copy values from the project root `.env`:

- `MONGODB_URI`
- `GUPSHUP_WEBHOOK_SECRET` (recommended)

## Deploy

### First deploy (guided)

```bash
npm run deploy:guided
```

When prompted:

| Prompt | Suggested value |
|--------|-----------------|
| Stack name | `ilbtl-gupshup-webhook` |
| Region | `ap-south-1` (Mumbai — close to India) |
| Confirm changes | `y` |
| Allow SAM IAM role creation | `y` |
| Save arguments to `samconfig.toml` | `y` |
| **MongoDbUri** | your Atlas connection string |
| **WebhookSecret** | same as `GUPSHUP_WEBHOOK_SECRET` |

At the end, SAM prints **WebhookFunctionUrl** — copy it.

### Later deploys

```bash
npm run deploy -- \
  --parameter-overrides \
  MongoDbUri="mongodb+srv://USER:PASS@CLUSTER.mongodb.net/infinity_runner" \
  WebhookSecret="your-secret"
```

Or from repo root:

```bash
npm run lambda:deploy
```

## Gupshup configuration

1. [Gupshup Console](https://www.gupshup.io/developer/home) → your WhatsApp app  
2. **Webhook / Callback URL** → paste the **WebhookFunctionUrl** from deploy output  
3. If you set `WebhookSecret`, use:

   ```
   https://xxxxxxxx.lambda-url.ap-south-1.on.aws/?secret=your-secret
   ```

4. Enable **inbound message** events (and journey webhook node if using flows)

`GET` on that URL returns `{ "ok": true }` — use it to verify the route is live.

## Test

```bash
# Replace with your Function URL
WEBHOOK_URL="https://xxxx.lambda-url.ap-south-1.on.aws" npm run webhook:test --prefix backend
```

PowerShell:

```powershell
$env:WEBHOOK_URL="https://xxxx.lambda-url.ap-south-1.on.aws"
npm run webhook:test --prefix backend
```

## Logs & monitoring

- **CloudWatch** → Log groups → `/aws/lambda/ilbtl-gupshup-webhook`
- **Lambda** → Monitor → Invocations, Errors, Duration
- **X-Ray** tracing is enabled in the SAM template

## Cost

Lambda free tier includes 1M requests/month. Typical webhook volume stays within free tier. You pay only for MongoDB Atlas and negligible Lambda compute.

## Remove stack

```bash
npm run destroy
```

## Local vs Docker vs Lambda

| Environment | Webhook URL |
|-------------|-------------|
| Local tunnel | `https://TUNNEL.trycloudflare.com/api/webhooks/gupshup/whatsapp` |
| **Docker production** | `https://YOUR-DOMAIN/api/webhooks/gupshup/whatsapp` |
| **AWS Lambda** | `https://xxxx.lambda-url.REGION.on.aws/` |

Use **Lambda** for production Gupshup callbacks when DevOps has deployed it. Until then, use the Docker URL. Use **one** callback only.
