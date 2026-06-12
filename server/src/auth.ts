import type { Request } from "express";
import { getUserByFirebaseUid } from "./store.js";
import type { UserRecord } from "./types.js";

export async function resolveUser(
  req: Request,
): Promise<UserRecord | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);

  if (token.startsWith("demo:")) {
    return getUserByFirebaseUid(token.slice(5));
  }

  // Firebase token verification — add firebase-admin in production
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
