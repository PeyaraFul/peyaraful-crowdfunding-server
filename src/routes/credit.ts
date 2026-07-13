import { Router } from "express";
import { purchaseCredits, getPaymentHistory } from "../controllers/creditController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/purchase", purchaseCredits);
router.get("/history", getPaymentHistory);

export default router;
