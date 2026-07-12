import { Router } from "express";
import {
  createWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  approveWithdrawal,
} from "../controllers/withdrawalController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// Creator
router.post("/", verifyToken, requireRole("creator"), createWithdrawal);
router.get("/history", verifyToken, requireRole("creator"), getMyWithdrawals);

// Admin
router.get("/pending", verifyToken, requireRole("admin"), getPendingWithdrawals);
router.put("/:id/approve", verifyToken, requireRole("admin"), approveWithdrawal);

export default router;
