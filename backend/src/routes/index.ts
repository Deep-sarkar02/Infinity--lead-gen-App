import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import leadsRoutes from "./leads.routes.js";
import milestoneRoutes from "./milestone.routes.js";
import profileRoutes from "./profile.routes.js";
import walletRoutes from "./wallet.routes.js";
import webhookRoutes from "./webhook.routes.js";

const router = Router();

router.use("/webhooks/gupshup", webhookRoutes);
router.use("/v1/auth", authRoutes);
router.use("/v1/leads", leadsRoutes);
router.use("/v1/wallet", walletRoutes);
router.use("/v1/profile", profileRoutes);
router.use("/v1/milestones", milestoneRoutes);
router.use("/v1/admin", adminRoutes);

export default router;
