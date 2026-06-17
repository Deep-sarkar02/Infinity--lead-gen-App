import { Router } from "express";
import * as WalletController from "../controllers/wallet.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, WalletController.listWallet);

export default router;
