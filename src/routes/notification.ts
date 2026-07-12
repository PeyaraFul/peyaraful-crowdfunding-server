import { Router } from "express";
import { getNotifications } from "../controllers/notificationController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/:email", verifyToken, getNotifications);

export default router;
