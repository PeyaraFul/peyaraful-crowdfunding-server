import { Router } from "express";
import {
  createContribution,
  getMyContributions,
  getPendingContributions,
  approveContribution,
  rejectContribution,
} from "../controllers/contributionController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// Supporter
router.post("/", verifyToken, requireRole("supporter"), createContribution);
router.get("/mine", verifyToken, requireRole("supporter"), getMyContributions);

// Creator
router.get(
  "/pending",
  verifyToken,
  requireRole("creator"),
  getPendingContributions
);
router.put(
  "/:id/approve",
  verifyToken,
  requireRole("creator"),
  approveContribution
);
router.put(
  "/:id/reject",
  verifyToken,
  requireRole("creator"),
  rejectContribution
);

export default router;
