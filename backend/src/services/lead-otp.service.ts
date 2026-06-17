import { randomUUID } from "crypto";
import {
  DuplicatePhoneError,
  InvalidOtpError,
  OtpExpiredError,
  OtpResendCooldownError,
  OtpSessionNotFoundError,
} from "../utils/errors.js";
import { LeadModel, LeadOtpSessionModel, UserModel } from "../models/index.js";
import type { Lead, LeadSummary } from "../types/index.js";
import { isValidIndianMobile, normalizePhone } from "../utils/validators.js";
import { getLeadSummary, grantMilestoneIfEligible, toLead } from "./lead.service.js";

export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  );
}

function assertValidPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (!isValidIndianMobile(normalized)) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }
  return normalized;
}

async function assertPhoneAvailable(student_phone: string): Promise<void> {
  const existing = await LeadModel.findOne({ student_phone }).lean();
  if (existing) throw new DuplicatePhoneError();
}

function secondsUntilResendAllowed(lastSentAt: Date): number {
  const elapsed = Date.now() - lastSentAt.getTime();
  const remaining = Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000);
  return Math.max(0, remaining);
}

async function upsertOtpSession(input: {
  volunteerId: string;
  studentName: string;
  studentPhone: string;
  otp: string;
}): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  const existing = await LeadOtpSessionModel.findOne({
    volunteer_id: input.volunteerId,
    student_phone: input.studentPhone,
  });

  if (existing) {
    existing.student_name = input.studentName.trim();
    existing.otp = input.otp;
    existing.expires_at = expiresAt;
    existing.last_sent_at = now;
    await existing.save();
    return;
  }

  try {
    await LeadOtpSessionModel.create({
      id: randomUUID(),
      volunteer_id: input.volunteerId,
      student_name: input.studentName.trim(),
      student_phone: input.studentPhone,
      otp: input.otp,
      expires_at: expiresAt,
      last_sent_at: now,
      created_at: now,
    });
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
    await LeadOtpSessionModel.updateOne(
      { volunteer_id: input.volunteerId, student_phone: input.studentPhone },
      {
        $set: {
          student_name: input.studentName.trim(),
          otp: input.otp,
          expires_at: expiresAt,
          last_sent_at: now,
        },
      },
    );
  }
}

export async function startLeadOtpSession(input: {
  volunteerId: string;
  studentName: string;
  studentPhone: string;
  otp: string;
}): Promise<{ expiresInSeconds: number; resendAvailableInSeconds: number }> {
  const student_phone = assertValidPhone(input.studentPhone);
  await assertPhoneAvailable(student_phone);

  await upsertOtpSession({
    volunteerId: input.volunteerId,
    studentName: input.studentName,
    studentPhone: student_phone,
    otp: input.otp,
  });

  return {
    expiresInSeconds: OTP_TTL_MS / 1000,
    resendAvailableInSeconds: OTP_RESEND_COOLDOWN_MS / 1000,
  };
}

export async function resendLeadOtpSession(input: {
  volunteerId: string;
  studentPhone: string;
  otp: string;
}): Promise<{ expiresInSeconds: number; resendAvailableInSeconds: number }> {
  const student_phone = assertValidPhone(input.studentPhone);
  await assertPhoneAvailable(student_phone);

  const session = await LeadOtpSessionModel.findOne({
    volunteer_id: input.volunteerId,
    student_phone,
  });

  if (!session) throw new OtpSessionNotFoundError();

  const waitSeconds = secondsUntilResendAllowed(session.last_sent_at);
  if (waitSeconds > 0) {
    throw new OtpResendCooldownError(waitSeconds);
  }

  const now = new Date();
  session.otp = input.otp;
  session.expires_at = new Date(now.getTime() + OTP_TTL_MS);
  session.last_sent_at = now;
  await session.save();

  return {
    expiresInSeconds: OTP_TTL_MS / 1000,
    resendAvailableInSeconds: OTP_RESEND_COOLDOWN_MS / 1000,
  };
}

export async function verifyLeadOtpAndCreate(input: {
  volunteerId: string;
  studentPhone: string;
  otp: string;
  volunteerName: string;
  volunteerEmail: string;
}): Promise<{ lead: Lead; summary: LeadSummary }> {
  const student_phone = assertValidPhone(input.studentPhone);
  const otp = input.otp.trim();

  if (!/^\d{6}$/.test(otp)) throw new InvalidOtpError();

  const session = await LeadOtpSessionModel.findOne({
    volunteer_id: input.volunteerId,
    student_phone,
  });

  if (!session) throw new OtpSessionNotFoundError();

  if (session.expires_at.getTime() < Date.now()) {
    await LeadOtpSessionModel.deleteOne({ id: session.id });
    throw new OtpExpiredError();
  }

  if (session.otp !== otp) throw new InvalidOtpError();

  await assertPhoneAvailable(student_phone);

  const volunteer = await UserModel.findOne({ id: input.volunteerId });
  if (!volunteer) throw new Error("Volunteer not found");

  const now = new Date();

  try {
    const lead = await LeadModel.create({
      id: randomUUID(),
      volunteer_id: input.volunteerId,
      volunteer_name: input.volunteerName.trim(),
      volunteer_email: input.volunteerEmail.trim().toLowerCase(),
      student_name: session.student_name,
      student_phone,
      status: "verified",
      verified_at: now,
      created_at: now,
    });

    volunteer.verified_lead_count += 1;
    volunteer.updated_at = now;
    await volunteer.save();

    await grantMilestoneIfEligible(volunteer.id, volunteer.verified_lead_count);
    await LeadOtpSessionModel.deleteOne({ id: session.id });

    const summary = await getLeadSummary(input.volunteerId);
    return { lead: toLead(lead), summary };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicatePhoneError();
    }
    throw error;
  }
}

export async function savePendingLeadFromSession(input: {
  volunteerId: string;
  studentPhone: string;
  volunteerName: string;
  volunteerEmail: string;
}): Promise<{ lead: Lead; summary: LeadSummary }> {
  const student_phone = assertValidPhone(input.studentPhone);

  const session = await LeadOtpSessionModel.findOne({
    volunteer_id: input.volunteerId,
    student_phone,
  });

  if (!session) throw new OtpSessionNotFoundError();

  await assertPhoneAvailable(student_phone);

  const now = new Date();

  try {
    const lead = await LeadModel.create({
      id: randomUUID(),
      volunteer_id: input.volunteerId,
      volunteer_name: input.volunteerName.trim(),
      volunteer_email: input.volunteerEmail.trim().toLowerCase(),
      student_name: session.student_name,
      student_phone,
      status: "unverified",
      verified_at: null,
      created_at: now,
    });

    await LeadOtpSessionModel.deleteOne({ id: session.id });

    const summary = await getLeadSummary(input.volunteerId);
    return { lead: toLead(lead), summary };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicatePhoneError();
    }
    throw error;
  }
}
