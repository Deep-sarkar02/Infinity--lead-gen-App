export class DuplicatePhoneError extends Error {
  constructor() {
    super("This phone number is already registered as a lead.");
    this.name = "DuplicatePhoneError";
  }
}

export class OtpResendCooldownError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super(`Please wait ${retryAfterSeconds} seconds before resending OTP.`);
    this.name = "OtpResendCooldownError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class InvalidOtpError extends Error {
  constructor() {
    super("Invalid OTP. Please check and try again.");
    this.name = "InvalidOtpError";
  }
}

export class OtpExpiredError extends Error {
  constructor() {
    super("OTP has expired. Please request a new one.");
    this.name = "OtpExpiredError";
  }
}

export class OtpSessionNotFoundError extends Error {
  constructor() {
    super("No OTP session found. Please send OTP again.");
    this.name = "OtpSessionNotFoundError";
  }
}
