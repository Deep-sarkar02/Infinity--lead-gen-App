/** Infinity Learn WhatsApp number shown in volunteer QR links */
const WHATSAPP_QR_PHONE = "919100074637";

export const WHATSAPP_QR_MESSAGE_PREFIX =
  "Interested to know more about the courses ";

export function buildScoutRef(userId: string): string {
  return `SCOUT-${userId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function buildWhatsAppQrMessage(fullName: string): string {
  return `${WHATSAPP_QR_MESSAGE_PREFIX}${fullName.trim()}`;
}

export function buildWhatsAppQrUrl(fullName: string): string {
  const text = buildWhatsAppQrMessage(fullName);
  const params = new URLSearchParams({
    phone: WHATSAPP_QR_PHONE,
    text,
    app_absent: "0",
  });
  return `https://api.whatsapp.com/send/?${params.toString()}`;
}
