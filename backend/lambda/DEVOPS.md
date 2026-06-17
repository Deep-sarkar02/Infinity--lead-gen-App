# DevOps runbook — Gupshup webhook Lambda

Deploy the **WhatsApp callback URL** separately from the Docker app. The volunteer PWA runs via `docker compose`; Gupshup inbound traffic should hit Lambda for auto-scaling.

## Prerequisites

- AWS CLI (`aws configure`) + AWS SAM CLI
- IAM: Lambda, IAM, S3, CloudFormation, CloudWatch
- Secrets (from app team, via vault): `MONGODB_URI`, `GUPSHUP_WEBHOOK_SECRET`
- MongoDB Atlas Network Access allows Lambda egress (`0.0.0.0/0` or VPC setup)

## First deploy

```bash
git clone <repo-url>
cd <repo>/backend/lambda
npm install
npm run deploy:guided
```

| Prompt | Value |
|--------|--------|
| Stack name | `ilbtl-gupshup-webhook` |
| Region | `ap-south-1` |
| MongoDbUri | production Atlas URI |
| WebhookSecret | `GUPSHUP_WEBHOOK_SECRET` |

**Output:** `WebhookFunctionUrl` — hand to app team for Gupshup console:

```
{WebhookFunctionUrl}?secret={GUPSHUP_WEBHOOK_SECRET}
```

## Subsequent deploys

```bash
git pull origin main
cd backend/lambda
npm run deploy -- \
  --parameter-overrides \
  MongoDbUri="mongodb+srv://..." \
  WebhookSecret="your-secret"
```

Or from repo root: `npm run lambda:deploy --prefix backend`

## Verify

```bash
WEBHOOK_URL="https://xxxx.lambda-url.ap-south-1.on.aws" npm run webhook:test --prefix backend
```

GET the Function URL in a browser → JSON with `"ok": true`.

**Logs:** CloudWatch → `/aws/lambda/ilbtl-gupshup-webhook`

## CI/CD (Bitbucket Pipelines example)

```yaml
pipelines:
  branches:
    main:
      - step:
          name: Deploy webhook Lambda
          script:
            - cd backend/lambda
            - npm ci
            - npm run deploy -- --no-confirm-changeset
              --parameter-overrides MongoDbUri=$MONGODB_URI WebhookSecret=$GUPSHUP_WEBHOOK_SECRET
```

Store `MONGODB_URI` and `GUPSHUP_WEBHOOK_SECRET` as secured repository variables.

## Remove stack

```bash
cd backend/lambda && npm run destroy
```

See also [README.md](./README.md).
