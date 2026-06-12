import "dotenv/config";
import express from "express";
import cors from "cors";
import { resolveUser } from "./auth.js";
import { connectDb } from "./db.js";
import { DuplicatePhoneError } from "./errors.js";
import {
  generateDemoOtp,
  sendLeadDemoSms,
  sendLeadGreetingWhatsApp,
} from "./gupshup.js";
import {
  acknowledgeMilestone,
  backfillLeadVolunteerFields,
  backfillMilestones,
  createLead,
  getLeadSummary,
  getLeadsForUser,
  getPendingMilestone,
  getRunnerLeadStats,
  getWalletItems,
  upsertUser,
  verifyLead,
} from "./store.js";
import { normalizePhone, validateLeadInput } from "./validators.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.post("/api/v1/auth/sync", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.slice(7);
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    );
    const uid = payload.user_id ?? payload.sub;
    const email = payload.email;
    if (!uid || !email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await upsertUser({
      firebase_uid: uid,
      email,
      full_name: payload.name ?? email.split("@")[0],
      photo_url: payload.picture ?? null,
    });
    const summary = await getLeadSummary(user.id);
    return res.json({ user, summary });
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/api/v1/auth/me", async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const summary = await getLeadSummary(user.id);
  return res.json({ user, summary });
});

app.post("/api/v1/auth/demo", async (_req, res) => {
  const user = await upsertUser({
    firebase_uid: "demo-volunteer-001",
    email: "demo.runner@infinitylearn.com",
    full_name: "Demo Volunteer",
    photo_url: null,
  });
  const summary = await getLeadSummary(user.id);
  return res.json({ user, summary });
});

app.get("/api/v1/leads", async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const leads = await getLeadsForUser(user.id);
  return res.json({ leads });
});

app.post("/api/v1/leads", async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const error = validateLeadInput(
    req.body.student_name ?? "",
    req.body.student_phone ?? "",
  );
  if (error) return res.status(400).json({ error });

  try {
    const { lead, summary } = await createLead(
      user.id,
      req.body.student_name,
      normalizePhone(req.body.student_phone),
      user.full_name,
      user.email,
    );

    const otp = generateDemoOtp();
    const [sms, wa] = await Promise.all([
      sendLeadDemoSms({ phone: lead.student_phone, otp }),
      sendLeadGreetingWhatsApp({ phone: lead.student_phone }),
    ]);

    return res.json({
      id: lead.id,
      status: lead.status,
      created_at: lead.created_at,
      summary,
      message_sent: sms.ok || wa.ok,
      sms_sent: sms.ok,
      whatsapp_sent: wa.ok,
    });
  } catch (e) {
    if (e instanceof DuplicatePhoneError) {
      return res.status(409).json({ error: e.message });
    }
    throw e;
  }
});

app.get("/api/v1/wallet", async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const items = await getWalletItems(user.id);
  return res.json({ items });
});

app.get("/api/v1/milestones/pending", async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const milestone = await getPendingMilestone(user.id);
  return res.json({ has_pending: Boolean(milestone), milestone });
});

app.post("/api/v1/milestones/:id/acknowledge", async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  try {
    await acknowledgeMilestone(user.id, req.params.id);
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Milestone not found" });
  }
});

app.patch("/api/v1/admin/leads/:id/verify", async (req, res) => {
  try {
    const result = await verifyLead(req.params.id);
    return res.json(result);
  } catch (e) {
    return res.status(400).json({
      error: e instanceof Error ? e.message : "Failed",
    });
  }
});

app.get("/api/v1/admin/runners/stats", async (req, res) => {
  const min = Number(req.query.min ?? 100);
  const minLeads = Number.isFinite(min) && min > 0 ? min : 100;
  const runners = await getRunnerLeadStats(minLeads);
  return res.json({ min_leads: minLeads, runners });
});

connectDb()
  .then(async () => {
    await backfillLeadVolunteerFields();
    await backfillMilestones();
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
