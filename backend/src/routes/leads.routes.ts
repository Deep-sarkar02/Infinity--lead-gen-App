import { Router } from "express";
import * as LeadsController from "../controllers/leads.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, LeadsController.listLeads);
router.post("/otp/send", requireAuth, LeadsController.sendOtp);
router.post("/otp/resend", requireAuth, LeadsController.resendOtp);
router.post("/otp/verify", requireAuth, LeadsController.verifyOtp);
router.post("/pending", requireAuth, LeadsController.savePending);
router.post("/", LeadsController.createLeadDeprecated);

export default router;
