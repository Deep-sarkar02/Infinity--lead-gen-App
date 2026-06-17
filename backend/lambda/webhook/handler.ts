import {
  parseGupshupWebhookBody,
  processInboundWhatsApp,
  verifyWebhookSecret,
} from "../../src/services/gupshup-webhook.service.js";
import { ensureDbConnected } from "./connect.js";
import {
  getHttpMethod,
  getQueryParam,
  getWebhookSecretHeader,
  parseRequestBody,
  type LambdaHttpEvent,
} from "./parse-event.js";

interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

function jsonResponse(statusCode: number, body: unknown): LambdaResponse {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  };
}

function healthResponse(): LambdaResponse {
  return jsonResponse(200, {
    ok: true,
    message: "Gupshup WhatsApp webhook is active on AWS Lambda. Use POST for inbound events.",
    hint:
      "If WhatsApp shows Thanks/Welcome but nothing saves here, add an API/Webhook node in Gupshup Journey pointing to this URL (POST).",
  });
}

export async function handler(event: LambdaHttpEvent): Promise<LambdaResponse> {
  const method = getHttpMethod(event);

  if (method === "GET" || method === "HEAD") {
    return healthResponse();
  }

  if (method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const secret = process.env.GUPSHUP_WEBHOOK_SECRET;
  if (
    !verifyWebhookSecret(
      secret,
      getQueryParam(event, "secret"),
      getWebhookSecretHeader(event),
    )
  ) {
    console.warn("[webhook-lambda] Rejected: invalid secret");
    return jsonResponse(401, { error: "Invalid webhook secret" });
  }

  const body = parseRequestBody(event);
  console.log("[webhook-lambda] POST received", {
    path: event.rawPath ?? event.requestContext?.http?.path,
    bodyKeys:
      body && typeof body === "object" ? Object.keys(body as object) : typeof body,
  });

  try {
    await ensureDbConnected();

    const parsed = parseGupshupWebhookBody(body);
    if (!parsed) {
      console.log("[webhook-lambda] Ignored non-message event");
      return jsonResponse(200, { ok: true, ignored: true });
    }

    const result = await processInboundWhatsApp(parsed);
    console.log("[webhook-lambda] Inbound saved:", result);
    return jsonResponse(200, { ok: true, ...result });
  } catch (err) {
    console.error("[webhook-lambda] Failed:", err);
    return jsonResponse(500, { error: "Webhook processing failed" });
  }
}
