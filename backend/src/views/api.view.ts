import type { Lead, LeadSummary, UserRecord } from "../types/index.js";

export function authPayload(user: UserRecord, summary: LeadSummary) {
  return { user, summary };
}

export function leadOtpSendPayload(input: {
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
  maskedPhone: string;
}) {
  return {
    ok: true,
    otp_sent: true,
    expires_in_seconds: input.expiresInSeconds,
    resend_available_in_seconds: input.resendAvailableInSeconds,
    masked_phone: input.maskedPhone,
  };
}

export function leadOtpResendPayload(input: {
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
}) {
  return {
    ok: true,
    otp_sent: true,
    expires_in_seconds: input.expiresInSeconds,
    resend_available_in_seconds: input.resendAvailableInSeconds,
  };
}

export function leadCreatedPayload(
  lead: Lead,
  summary: LeadSummary,
  verified: boolean,
) {
  return {
    id: lead.id,
    status: lead.status,
    created_at: lead.created_at,
    summary,
    verified,
  };
}

export function milestonePendingPayload(
  milestone: import("../types/index.js").PendingMilestone | null,
) {
  return { has_pending: Boolean(milestone), milestone };
}
