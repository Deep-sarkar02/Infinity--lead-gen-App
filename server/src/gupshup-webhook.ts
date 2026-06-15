import { randomUUID } from "crypto";
import { LeadModel, UserModel, WhatsAppInboundModel } from "./models.js";

export interface ParsedInboundMessage {
  messageId: string | null;
  fromPhone: string;
  toPhone: string | null;
  text: string;
  senderName: string | null;
  raw: unknown;
}

export interface WebhookProcessResult {
  saved: boolean;
  duplicate: boolean;
  inboundId?: string;
  matchedLeadId?: string;
  matchedVolunteerId?: string;
}

const SCOUT_REF_PATTERN = /Ref:\s*(SCOUT-[A-Za-z0-9-]+)/i;

export function parseGupshupWebhookBody(body: unknown): ParsedInboundMessage | null {
  if (!body || typeof body !== "object") return null;

  const record = body as Record<string, unknown>;

  // Gupshup sometimes wraps payload as a JSON string.
  let payload = record.payload;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload) as unknown;
    } catch {
      return null;
    }
  }

  const root = (payload && typeof payload === "object" ? payload : record) as Record<
    string,
    unknown
  >;

  const type = String(record.type ?? root.type ?? "").toLowerCase();
  if (type && type !== "message" && type !== "text") {
    return null;
  }

  const messagePayload =
    root.payload && typeof root.payload === "object"
      ? (root.payload as Record<string, unknown>)
      : root;

  const text =
    typeof messagePayload.text === "string"
      ? messagePayload.text
      : typeof root.text === "string"
        ? root.text
        : typeof record.text === "string"
          ? record.text
          : "";

  const senderObj =
    root.sender && typeof root.sender === "object"
      ? (root.sender as Record<string, unknown>)
      : null;

  const fromPhone = String(
    root.source ??
      senderObj?.phone ??
      messagePayload.from ??
      record.mobile ??
      "",
  ).replace(/\D/g, "");

  if (!fromPhone || !text.trim()) return null;

  const toPhone = String(root.destination ?? root.to ?? "")
    .replace(/\D/g, "") || null;

  return {
    messageId: String(root.id ?? record.id ?? "") || null,
    fromPhone,
    toPhone,
    text: text.trim(),
    senderName:
      typeof senderObj?.name === "string"
        ? senderObj.name
        : typeof root.name === "string"
          ? root.name
          : null,
    raw: body,
  };
}

function phoneTail(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function extractScoutRef(text: string): string | null {
  const match = text.match(SCOUT_REF_PATTERN);
  return match?.[1]?.toUpperCase() ?? null;
}

export async function processInboundWhatsApp(
  parsed: ParsedInboundMessage,
): Promise<WebhookProcessResult> {
  if (parsed.messageId) {
    const existing = await WhatsAppInboundModel.findOne({
      gupshup_message_id: parsed.messageId,
    }).lean();
    if (existing) {
      return { saved: false, duplicate: true, inboundId: existing.id };
    }
  }

  const scoutRef = extractScoutRef(parsed.text);
  let matchedVolunteerId: string | undefined;
  let matchedLeadId: string | undefined;

  if (scoutRef) {
    const volunteer = await UserModel.findOne({ scout_ref: scoutRef }).lean();
    if (volunteer) matchedVolunteerId = volunteer.id;
  }

  const tail = phoneTail(parsed.fromPhone);
  if (tail) {
    const lead = await LeadModel.findOne({
      student_phone: { $regex: `${tail}$` },
    })
      .sort({ created_at: -1 })
      .lean();
    if (lead) {
      matchedLeadId = lead.id;
      await LeadModel.updateOne(
        { id: lead.id },
        {
          $set: {
            whatsapp_replied_at: new Date(),
            whatsapp_reply_text: parsed.text,
          },
        },
      );
    }
  }

  const inbound = await WhatsAppInboundModel.create({
    id: randomUUID(),
    gupshup_message_id: parsed.messageId,
    from_phone: parsed.fromPhone,
    to_phone: parsed.toPhone,
    message_text: parsed.text,
    sender_name: parsed.senderName,
    scout_ref: scoutRef,
    lead_id: matchedLeadId ?? null,
    volunteer_id: matchedVolunteerId ?? null,
    raw_payload: parsed.raw,
    received_at: new Date(),
  });

  return {
    saved: true,
    duplicate: false,
    inboundId: inbound.id,
    matchedLeadId,
    matchedVolunteerId,
  };
}

export function verifyWebhookSecret(
  secret: string | undefined,
  querySecret: unknown,
  headerSecret: unknown,
): boolean {
  if (!secret) return true;
  return secret === String(querySecret ?? "") || secret === String(headerSecret ?? "");
}
