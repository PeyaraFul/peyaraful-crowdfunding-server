import { Router } from "express";
import {
  getUserByEmail,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/authController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// named routes BEFORE /:email
router.get("/", verifyToken, requireRole("admin"), getAllUsers);
router.put("/:email", verifyToken, requireRole("admin"), updateUserRole);
router.delete("/:email", verifyToken, requireRole("admin"), deleteUser);
router.get("/:email", verifyToken, getUserByEmail);

export default router;
