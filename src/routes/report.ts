import { Router } from "express";
import { submitReport, getAllReports } from "../controllers/reportController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// supporter submit report
router.post("/", verifyToken, requireRole("supporter"), submitReport);

// admin get all reports
router.get("/", verifyToken, requireRole("admin"), getAllReports);

export default router;
