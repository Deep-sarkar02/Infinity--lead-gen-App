import { Router } from "express";
import * as WebhookController from "../controllers/webhook.controller.js";

const router = Router();

router.get("/whatsapp", WebhookController.webhookHealth);
router.post("/whatsapp", WebhookController.webhookInbound);

export default router;
