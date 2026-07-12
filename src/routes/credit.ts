import { Router } from "express";
import { purchaseCredits, getPaymentHistory } from "../controllers/creditController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/purchase", verifyToken, purchaseCredits);
router.get("/history", verifyToken, getPaymentHistory);

export default router;
