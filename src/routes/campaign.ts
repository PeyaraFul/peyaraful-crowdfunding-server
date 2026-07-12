import { Router } from "express";
import {
  createCampaign,
  getApprovedCampaigns,
  getTopCampaigns,
  getCampaignById,
  getMyCampaigns,
  updateCampaign,
  deleteCampaign,
  getPendingCampaigns,
  updateCampaignStatus,
  getAllCampaigns,
} from "../controllers/campaignController";
import { verifyToken } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// Named routes FIRST (before /:id)
router.get("/approved", getApprovedCampaigns);
router.get("/top", getTopCampaigns);
router.get("/mine", verifyToken, requireRole("creator"), getMyCampaigns);
router.get("/pending", verifyToken, requireRole("admin"), getPendingCampaigns);
router.get("/all", verifyToken, requireRole("admin"), getAllCampaigns);

// Creator
router.post("/", verifyToken, requireRole("creator"), createCampaign);
router.put("/:id", verifyToken, requireRole("creator"), updateCampaign);
router.delete("/:id", verifyToken, requireRole("creator"), deleteCampaign);

// Admin
router.put(
  "/:id/status",
  verifyToken,
  requireRole("admin"),
  updateCampaignStatus
);

// Dynamic route LAST
router.get("/:id", getCampaignById);

export default router;
