import { Router } from "express";
import * as AdminController from "../controllers/admin.controller.js";

const router = Router();

router.patch("/leads/:id/verify", AdminController.verifyLeadById);
router.get("/runners/stats", AdminController.runnerStats);

export default router;
