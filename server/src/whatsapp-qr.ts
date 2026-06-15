const WHATSAPP_PHONE = process.env.WHATSAPP_QR_PHONE ?? "919100074637";

export function buildScoutRef(userId: string): string {
  return `SCOUT-${userId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function buildWhatsAppQrUrl(fullName: string, scoutRef: string): string {
  const text = `Interested to know more about the courses ${fullName.trim()} (Ref: ${scoutRef})`;
  const params = new URLSearchParams({
    phone: WHATSAPP_PHONE,
    text,
    app_absent: "0",
  });
  return `https://api.whatsapp.com/send/?${params.toString()}`;
}
