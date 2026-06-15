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
  createLead,
  generateWhatsAppQrForUser,
  getLeadSummary,
  getLeadsForUser,
  getPendingMilestone,
  getRunnerLeadStats,
  getWalletItems,
  getWhatsAppQrForUser,
  upsertUser,
  verifyLead,
} from "./store.js";
import {
  parseGupshupWebhookBody,
  processInboundWhatsApp,
  verifyWebhookSecret,
} from "./gupshup-webhook.js";
import { normalizePhone, validateLeadInput } from "./validators.js";

export function buildApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.use(async (_req, res, next) => {
    try {
      await connectDb();
      next();
    } catch (err) {
      console.error("Database connection failed:", err);
      res.status(503).json({ error: "Database unavailable" });
    }
  });

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/webhooks/gupshup/whatsapp", (_req, res) => {
    res.json({
      ok: true,
      message: "Gupshup WhatsApp webhook is active. Use POST for inbound events.",
    });
  });

  app.post("/api/webhooks/gupshup/whatsapp", async (req, res) => {
    const secret = process.env.GUPSHUP_WEBHOOK_SECRET;
    if (
      !verifyWebhookSecret(
        secret,
        req.query.secret,
        req.headers["x-webhook-secret"],
      )
    ) {
      return res.status(401).json({ error: "Invalid webhook secret" });
    }

    try {
      const parsed = parseGupshupWebhookBody(req.body);
      if (!parsed) {
        console.log("[webhook] Ignored non-message event:", req.body);
        return res.json({ ok: true, ignored: true });
      }

      const result = await processInboundWhatsApp(parsed);
      console.log("[webhook] Inbound saved:", result);
      return res.json({ ok: true, ...result });
    } catch (err) {
      console.error("[webhook] Failed:", err);
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  });

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

  app.get("/api/v1/profile/whatsapp-qr", async (req, res) => {
    const user = await resolveUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const qr = await getWhatsAppQrForUser(user.id);
    if (!qr) return res.status(404).json({ error: "User not found" });
    return res.json(qr);
  });

  app.post("/api/v1/profile/whatsapp-qr", async (req, res) => {
    const user = await resolveUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const qr = await generateWhatsAppQrForUser(user.id);
    if (!qr) return res.status(404).json({ error: "User not found" });
    return res.json(qr);
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

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error("Unhandled API error:", err);
      if (!res.headersSent) {
        res.status(500).json({
          error: err instanceof Error ? err.message : "Internal server error",
        });
      }
    },
  );

  return app;
}
