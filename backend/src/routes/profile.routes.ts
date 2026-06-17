import { Router } from "express";
import * as ProfileController from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/whatsapp-qr", requireAuth, ProfileController.getWhatsAppQr);
router.post("/whatsapp-qr", requireAuth, ProfileController.generateWhatsAppQr);

export default router;
