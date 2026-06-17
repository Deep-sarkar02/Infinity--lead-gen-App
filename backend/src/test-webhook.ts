import "./config/env.js";

const WEBHOOK_URL =
  process.env.WEBHOOK_URL ??
  "http://localhost:3001/api/webhooks/gupshup/whatsapp";

const secret = process.env.GUPSHUP_WEBHOOK_SECRET;
const query = secret ? `?secret=${encodeURIComponent(secret)}` : "";

const useJourneyFormat = process.env.WEBHOOK_FORMAT === "journey";
const useGupshupNative = process.env.WEBHOOK_FORMAT === "gupshup";

const samplePayload = useJourneyFormat
  ? {
      "user-name": "Test Student",
      user_number: "91961002444",
      user_input: "Interested to know more about the courses Demo Volunteer",
    }
  : useGupshupNative
    ? {
        app: process.env.GUPSHUP_APP_NAME ?? "InfinityLearnBTL",
        timestamp: Date.now(),
        version: 2,
        type: "message",
        payload: {
          id: `test-${Date.now()}`,
          source: "91961002444",
          destination: process.env.GUPSHUP_SOURCE ?? "919355586891",
          type: "text",
          payload: {
            text: "Interested to know more about the courses Demo Volunteer",
          },
          sender: { phone: "91961002444", name: "Test Student" },
        },
      }
    : {
      type: "message",
      payload: {
        id: `test-${Date.now()}`,
        source: "91961002444",
        destination: process.env.GUPSHUP_SOURCE ?? "919355586891",
        type: "text",
        payload: {
          text: "Interested to know more about the courses Demo Volunteer",
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
