import type { Request, Response } from "express";
import { getRunnerLeadStats, verifyLead } from "../services/lead.service.js";

export async function verifyLeadById(req: Request, res: Response) {
  try {
    const result = await verifyLead(String(req.params.id));
    return res.json(result);
  } catch (e) {
    return res.status(400).json({
      error: e instanceof Error ? e.message : "Failed",
    });
  }
}

export async function runnerStats(req: Request, res: Response) {
  const min = Number(req.query.min ?? 100);
  const minLeads = Number.isFinite(min) && min > 0 ? min : 100;
  const runners = await getRunnerLeadStats(minLeads);
  return res.json({ min_leads: minLeads, runners });
}
