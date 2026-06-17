import type { Request, Response, NextFunction } from "express";
import { getUserByFirebaseUid } from "../services/lead.service.js";
import type { UserRecord } from "../types/index.js";

export async function resolveUser(req: Request): Promise<UserRecord | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);

  if (token.startsWith("demo:")) {
    return getUserByFirebaseUid(token.slice(5));
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    );
    const uid = payload.user_id ?? payload.sub;
    if (uid) return getUserByFirebaseUid(uid);
  } catch {
    return null;
  }

  return null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = await resolveUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.locals.user = user;
  return next();
}
