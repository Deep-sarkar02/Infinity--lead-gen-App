import type { Request, Response, NextFunction } from "express";
import { connectDb } from "../config/database.js";

export async function ensureDatabase(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(503).json({ error: "Database unavailable" });
  }
}
