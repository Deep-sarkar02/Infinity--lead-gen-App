const INDIAN_MOBILE = /^[6-9]\d{9}$/;

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
}

export function isValidIndianMobile(phone: string): boolean {
  return INDIAN_MOBILE.test(normalizePhone(phone));
}

export function validateLeadInput(name: string, phone: string): string | null {
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return "Enter a valid student name (2–100 characters).";
  }
  if (!isValidIndianMobile(phone)) {
    return "Enter a valid 10-digit mobile number.";
  }
  return null;
}
