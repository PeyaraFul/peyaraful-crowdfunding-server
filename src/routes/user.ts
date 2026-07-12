import { Router } from "express";
import { getUserByEmail } from "../controllers/authController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/:email", verifyToken, getUserByEmail);

export default router;
