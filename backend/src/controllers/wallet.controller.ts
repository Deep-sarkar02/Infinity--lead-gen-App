import type { Request, Response } from "express";
import { getWalletItems } from "../services/lead.service.js";

export async function listWallet(_req: Request, res: Response) {
  const user = res.locals.user;
  const items = await getWalletItems(user.id);
  return res.json({ items });
}
