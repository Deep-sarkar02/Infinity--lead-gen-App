import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/sync", AuthController.syncAuth);
router.get("/me", requireAuth, AuthController.getMe);
router.post("/demo", AuthController.demoLogin);

export default router;
