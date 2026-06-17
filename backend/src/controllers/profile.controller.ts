import type { Request, Response } from "express";
import {
  generateWhatsAppQrForUser,
  getWhatsAppQrForUser,
} from "../services/lead.service.js";

export async function getWhatsAppQr(_req: Request, res: Response) {
  const user = res.locals.user;
  const qr = await getWhatsAppQrForUser(user.id);
  if (!qr) return res.status(404).json({ error: "User not found" });
  return res.json(qr);
}

export async function generateWhatsAppQr(_req: Request, res: Response) {
  const user = res.locals.user;
  const qr = await generateWhatsAppQrForUser(user.id);
  if (!qr) return res.status(404).json({ error: "User not found" });
  return res.json(qr);
}
