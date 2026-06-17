import type { Request, Response } from "express";
import {
  parseGupshupWebhookBody,
  processInboundWhatsApp,
  verifyWebhookSecret,
} from "../services/gupshup-webhook.service.js";

export function webhookHealth(_req: Request, res: Response) {
  res.json({
    ok: true,
    message: "Gupshup WhatsApp webhook is active. Use POST for inbound events.",
    hint:
      "If WhatsApp shows Thanks/Welcome but nothing saves here, add an API/Webhook node in Gupshup Journey pointing to this URL (POST).",
  });
}

export async function webhookInbound(req: Request, res: Response) {
  const contentType = String(req.headers["content-type"] ?? "");
  console.log("[webhook] POST received", {
    contentType,
    query: req.query,
    bodyKeys:
      req.body && typeof req.body === "object"
        ? Object.keys(req.body as object)
        : typeof req.body,
  });

  const secret = process.env.GUPSHUP_WEBHOOK_SECRET;
  if (
    !verifyWebhookSecret(
      secret,
      req.query.secret,
      req.headers["x-webhook-secret"],
    )
  ) {
    console.warn("[webhook] Rejected: invalid secret");
    return res.status(401).json({ error: "Invalid webhook secret" });
  }

  try {
    const parsed = parseGupshupWebhookBody(req.body);
    if (!parsed) {
      console.log("[webhook] Ignored non-message event:", req.body);
      return res.json({ ok: true, ignored: true });
    }

    const result = await processInboundWhatsApp(parsed);
    console.log("[webhook] Inbound saved:", result);
    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error("[webhook] Failed:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
