import { Router } from "express";
import { purchaseCredits, getPaymentHistory, getAllPayments } from "../controllers/creditController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.post("/purchase", verifyToken, purchaseCredits);
router.get("/history", verifyToken, getPaymentHistory);
router.get("/all", verifyToken, requireRole("admin"), getAllPayments);

export default router;
