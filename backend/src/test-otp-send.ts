import "./config/env.js";
import { sendLeadOtpWhatsApp } from "./services/gupshup.service.js";

async function main() {
  console.log(
    "GUPSHUP_OTP_API_KEY:",
    process.env.GUPSHUP_OTP_API_KEY ? "SET" : "MISSING",
  );
  const result = await sendLeadOtpWhatsApp({
    phone: process.argv[2] ?? "9999999548",
    otp: "123456",
  });
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
