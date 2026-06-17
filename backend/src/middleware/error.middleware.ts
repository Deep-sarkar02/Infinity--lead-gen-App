import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("Unhandled API error:", err);
  if (!res.headersSent) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
}
