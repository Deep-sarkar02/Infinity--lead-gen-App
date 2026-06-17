import { Router } from "express";
import * as MilestoneController from "../controllers/milestone.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/pending", requireAuth, MilestoneController.getPending);
router.post("/:id/acknowledge", requireAuth, MilestoneController.acknowledge);

export default router;
