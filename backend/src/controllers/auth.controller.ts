import type { Request, Response } from "express";
import { getLeadSummary, upsertUser } from "../services/lead.service.js";
import { authPayload } from "../views/api.view.js";

export async function syncAuth(req: Request, res: Response) {
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
    return res.json(authPayload(user, summary));
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export async function getMe(_req: Request, res: Response) {
  const user = res.locals.user;
  const summary = await getLeadSummary(user.id);
  return res.json(authPayload(user, summary));
}

export async function demoLogin(_req: Request, res: Response) {
  const user = await upsertUser({
    firebase_uid: "demo-volunteer-001",
    email: "demo.runner@infinitylearn.com",
    full_name: "Demo Volunteer",
    photo_url: null,
  });
  const summary = await getLeadSummary(user.id);
  return res.json(authPayload(user, summary));
}
