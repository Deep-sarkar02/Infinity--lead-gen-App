import { normalizePhone } from "../utils/validators.js";

const GUPSHUP_WA_TEMPLATE_URL =
  "https://api.gupshup.io/wa/api/v1/template/msg";

const GUPSHUP_SMS_GATEWAY_URL =
  "https://enterprise.smsgupshup.com/GatewayAPI/rest";

const DEFAULT_SOURCE = "919355586891";
const DEFAULT_APP_NAME = "PuMkzIVgOU868jw9it7u3ovd";
const DEFAULT_TEMPLATE_ID = "53e0fc5d-4c4a-4096-bb4d-83dc8a03201d";

/** Lead mobile → Gupshup send_to (e.g. 9689687036 → 919689687036). */
export function formatIndianMsisdn(phone: string): string {
  return `91${normalizePhone(phone)}`;
}

const DEFAULT_OTP_SOURCE = "919100074637";
const DEFAULT_OTP_APP_NAME = "Ir3XLFWEurt0MjswxkLsDWM5";
const DEFAULT_OTP_TEMPLATE_ID = "51109c78-288e-45ac-a4bb-b1b5e62eadc3";

export function generateLeadOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function isLeadOtpWhatsAppConfigured(): boolean {
  return Boolean(process.env.GUPSHUP_OTP_API_KEY?.trim());
}

/** @deprecated Use generateLeadOtp */
export const generateDemoOtp = generateLeadOtp;

export interface SendMessageResult {
  ok: boolean;
  response?: string;
  error?: string;
  skipped?: boolean;
}

function buildOtpSmsMessage(otp: string): string {
  return `Infinity Learn: Your OTP for demo booking verification is ${otp}. Please share it with our counsellor to confirm your demo. Valid for 10 minutes.`;
}

/**
 * POST WhatsApp OTP template — params are [otp, otp] per Gupshup template.
 */
export async function sendLeadOtpWhatsApp(input: {
  phone: string;
  otp: string;
}): Promise<SendMessageResult> {
  const apikey = process.env.GUPSHUP_OTP_API_KEY;
  const source = process.env.GUPSHUP_OTP_SOURCE ?? DEFAULT_OTP_SOURCE;
  const appName = process.env.GUPSHUP_OTP_APP_NAME ?? DEFAULT_OTP_APP_NAME;
  const templateId =
    process.env.GUPSHUP_OTP_TEMPLATE_ID ?? DEFAULT_OTP_TEMPLATE_ID;

  if (!apikey) {
    console.warn("[gupshup-otp] GUPSHUP_OTP_API_KEY not set — OTP WhatsApp skipped");
    return {
      ok: false,
      skipped: true,
      error: "WhatsApp OTP not configured (set GUPSHUP_OTP_API_KEY)",
    };
  }

  const destination = formatIndianMsisdn(input.phone);
  const template = {
    id: templateId,
    params: [input.otp, input.otp],
  };

  const body = new URLSearchParams({
    channel: "whatsapp",
    source,
    destination,
    "src.name": appName,
    template: JSON.stringify(template),
  });

  try {
    const response = await fetch(GUPSHUP_WA_TEMPLATE_URL, {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        apikey,
        "cache-control": "no-cache",
      },
      body: body.toString(),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("[gupshup-otp] HTTP error:", response.status, text);
      return { ok: false, error: text || `HTTP ${response.status}` };
    }

    console.log(`[gupshup-otp] OTP template sent to ${destination}:`, text);
    return { ok: true, response: text };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[gupshup-otp] Request failed:", message);
    return { ok: false, error: message };
  }
}

/**
 * POST https://api.gupshup.io/wa/api/v1/template/msg
 * Matches Gupshup template curl — static template, empty params.
 */
export async function sendLeadGreetingWhatsApp(input: {
  phone: string;
}): Promise<SendMessageResult> {
  const apikey = process.env.GUPSHUP_API_KEY;
  const source = process.env.GUPSHUP_SOURCE ?? DEFAULT_SOURCE;
  const appName = process.env.GUPSHUP_APP_NAME ?? DEFAULT_APP_NAME;
  const templateId = process.env.GUPSHUP_TEMPLATE_ID ?? DEFAULT_TEMPLATE_ID;

  if (!apikey) {
    console.warn("[gupshup] GUPSHUP_API_KEY not set — WhatsApp skipped");
    return { ok: false, skipped: true, error: "WhatsApp not configured" };
  }

  const destination = formatIndianMsisdn(input.phone);
  const template = {
    id: templateId,
    params: [] as string[],
  };

  const body = new URLSearchParams({
    channel: "whatsapp",
    source,
    destination,
    "src.name": appName,
    template: JSON.stringify(template),
  });

  try {
    const response = await fetch(GUPSHUP_WA_TEMPLATE_URL, {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        apikey,
      },
      body: body.toString(),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("[gupshup] HTTP error:", response.status, text);
      return { ok: false, error: text || `HTTP ${response.status}` };
    }

    console.log(`[gupshup] Template sent to ${destination}:`, text);
    return { ok: true, response: text };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[gupshup] Request failed:", message);
    return { ok: false, error: message };
  }
}

/**
 * GET https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage
 * OTP SMS to the lead's mobile.
 */
export async function sendLeadDemoSms(input: {
  phone: string;
  otp: string;
}): Promise<SendMessageResult> {
  const userid = process.env.GUPSHUP_SMS_USERID;
  const password = process.env.GUPSHUP_SMS_PASSWORD;

  if (!userid || !password) {
    console.warn("[gupshup-sms] GUPSHUP_SMS_USERID/PASSWORD not set — SMS skipped");
    return { ok: false, skipped: true, error: "SMS not configured" };
  }

  const sendTo = formatIndianMsisdn(input.phone);
  const msg = buildOtpSmsMessage(input.otp);
  const baseUrl = process.env.GUPSHUP_SMS_URL ?? GUPSHUP_SMS_GATEWAY_URL;
  const params = new URLSearchParams({
    method: "SendMessage",
    send_to: sendTo,
    msg,
    msg_type: "TEXT",
    userid,
    auth_scheme: "plain",
    password,
    v: "1.1",
    format: "text",
  });

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      method: "GET",
    });
    const text = await response.text();

    if (!response.ok) {
      console.error("[gupshup-sms] HTTP error:", response.status, text);
      return { ok: false, error: text || `HTTP ${response.status}` };
    }

    console.log(`[gupshup-sms] SMS sent to ${sendTo}:`, text);
    return { ok: true, response: text };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[gupshup-sms] Request failed:", message);
    return { ok: false, error: message };
  }
}
