import "dotenv/config";

const WEBHOOK_URL =
  process.env.WEBHOOK_URL ??
  "http://localhost:3001/api/webhooks/gupshup/whatsapp";

const secret = process.env.GUPSHUP_WEBHOOK_SECRET;
const query = secret ? `?secret=${encodeURIComponent(secret)}` : "";

const samplePayload = {
  type: "message",
  payload: {
    id: `test-${Date.now()}`,
    source: "91961002444",
    destination: process.env.WHATSAPP_QR_PHONE ?? "919100074637",
    type: "text",
    payload: {
      text: "Interested to know more about the courses Demo Volunteer (Ref: SCOUT-0BE200D2)",
    },
    sender: { phone: "91961002444", name: "Test Student" },
  },
};

async function main() {
  console.log(`POST ${WEBHOOK_URL}${query}`);

  const response = await fetch(`${WEBHOOK_URL}${query}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(samplePayload),
  });

  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Body:", text);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
