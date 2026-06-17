import type { Request, Response } from "express";
import {
  acknowledgeMilestone,
  getPendingMilestone,
} from "../services/lead.service.js";
import { milestonePendingPayload } from "../views/api.view.js";

export async function getPending(_req: Request, res: Response) {
  const user = res.locals.user;
  const milestone = await getPendingMilestone(user.id);
  return res.json(milestonePendingPayload(milestone));
}

export async function acknowledge(req: Request, res: Response) {
  const user = res.locals.user;
  try {
    await acknowledgeMilestone(user.id, String(req.params.id));
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Milestone not found" });
  }
}
