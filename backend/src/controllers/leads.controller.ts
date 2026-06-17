import type { Request, Response } from "express";
import {
  DuplicatePhoneError,
  InvalidOtpError,
  OtpExpiredError,
  OtpResendCooldownError,
  OtpSessionNotFoundError,
} from "../utils/errors.js";
import { generateLeadOtp, sendLeadOtpWhatsApp } from "../services/gupshup.service.js";
import {
  resendLeadOtpSession,
  savePendingLeadFromSession,
  startLeadOtpSession,
  verifyLeadOtpAndCreate,
} from "../services/lead-otp.service.js";
import { getLeadsForUser } from "../services/lead.service.js";
import {
  isValidIndianMobile,
  normalizePhone,
  validateLeadInput,
} from "../utils/validators.js";
import {
  leadCreatedPayload,
  leadOtpResendPayload,
  leadOtpSendPayload,
} from "../views/api.view.js";

export async function listLeads(_req: Request, res: Response) {
  const user = res.locals.user;
  const leads = await getLeadsForUser(user.id);
  return res.json({ leads });
}

export async function sendOtp(req: Request, res: Response) {
  const user = res.locals.user;
  const error = validateLeadInput(
    req.body.student_name ?? "",
    req.body.student_phone ?? "",
  );
  if (error) return res.status(400).json({ error });

  try {
    const otp = generateLeadOtp();
    const session = await startLeadOtpSession({
      volunteerId: user.id,
      studentName: req.body.student_name,
      studentPhone: req.body.student_phone,
      otp,
    });

    const wa = await sendLeadOtpWhatsApp({
      phone: normalizePhone(req.body.student_phone),
      otp,
    });

    if (!wa.ok) {
      return res.status(wa.skipped ? 503 : 502).json({
        error:
          wa.error ??
          (wa.skipped
            ? "WhatsApp OTP is not configured (set GUPSHUP_OTP_API_KEY)"
            : "Failed to send OTP on WhatsApp"),
      });
    }

    return res.json(
      leadOtpSendPayload({
        expiresInSeconds: session.expiresInSeconds,
        resendAvailableInSeconds: session.resendAvailableInSeconds,
        maskedPhone: `******${normalizePhone(req.body.student_phone).slice(-4)}`,
      }),
    );
  } catch (e) {
    if (e instanceof DuplicatePhoneError) {
      return res.status(409).json({ error: e.message });
    }
    throw e;
  }
}

export async function resendOtp(req: Request, res: Response) {
  const user = res.locals.user;
  const phone = normalizePhone(String(req.body.student_phone ?? ""));
  if (!isValidIndianMobile(phone)) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  }

  try {
    const otp = generateLeadOtp();
    const session = await resendLeadOtpSession({
      volunteerId: user.id,
      studentPhone: phone,
      otp,
    });

    const wa = await sendLeadOtpWhatsApp({ phone, otp });

    if (!wa.ok) {
      return res.status(wa.skipped ? 503 : 502).json({
        error:
          wa.error ??
          (wa.skipped
            ? "WhatsApp OTP is not configured (set GUPSHUP_OTP_API_KEY)"
            : "Failed to resend OTP on WhatsApp"),
      });
    }

    return res.json(
      leadOtpResendPayload({
        expiresInSeconds: session.expiresInSeconds,
        resendAvailableInSeconds: session.resendAvailableInSeconds,
      }),
    );
  } catch (e) {
    if (e instanceof OtpResendCooldownError) {
      return res.status(429).json({
        error: e.message,
        retry_after_seconds: e.retryAfterSeconds,
      });
    }
    if (e instanceof OtpSessionNotFoundError) {
      return res.status(404).json({ error: e.message });
    }
    if (e instanceof DuplicatePhoneError) {
      return res.status(409).json({ error: e.message });
    }
    throw e;
  }
}

export async function verifyOtp(req: Request, res: Response) {
  const user = res.locals.user;
  const phone = normalizePhone(String(req.body.student_phone ?? ""));
  const otp = String(req.body.otp ?? "").trim();

  if (!isValidIndianMobile(phone)) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: "Enter the 6-digit OTP." });
  }

  try {
    const { lead, summary } = await verifyLeadOtpAndCreate({
      volunteerId: user.id,
      studentPhone: phone,
      otp,
      volunteerName: user.full_name,
      volunteerEmail: user.email,
    });

    return res.json(leadCreatedPayload(lead, summary, true));
  } catch (e) {
    if (e instanceof InvalidOtpError || e instanceof OtpExpiredError) {
      return res.status(400).json({ error: e.message });
    }
    if (e instanceof OtpSessionNotFoundError) {
      return res.status(404).json({ error: e.message });
    }
    if (e instanceof DuplicatePhoneError) {
      return res.status(409).json({ error: e.message });
    }
    throw e;
  }
}

export async function savePending(req: Request, res: Response) {
  const user = res.locals.user;
  const phone = normalizePhone(String(req.body.student_phone ?? ""));
  if (!isValidIndianMobile(phone)) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  }

  try {
    const { lead, summary } = await savePendingLeadFromSession({
      volunteerId: user.id,
      studentPhone: phone,
      volunteerName: user.full_name,
      volunteerEmail: user.email,
    });

    return res.json(leadCreatedPayload(lead, summary, false));
  } catch (e) {
    if (e instanceof OtpSessionNotFoundError) {
      return res.status(404).json({ error: e.message });
    }
    if (e instanceof DuplicatePhoneError) {
      return res.status(409).json({ error: e.message });
    }
    throw e;
  }
}

export function createLeadDeprecated(_req: Request, res: Response) {
  return res.status(410).json({
    error: "Use POST /api/v1/leads/otp/send then /api/v1/leads/otp/verify",
  });
}
