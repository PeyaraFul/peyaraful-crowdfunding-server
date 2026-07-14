import { Router } from "express";
import { register, login, getMe, googleLogin } from "../controllers/authController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", verifyToken, getMe);

export default router;
