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

// Public
router.get("/approved", getApprovedCampaigns);
router.get("/top", getTopCampaigns);
router.get("/:id", getCampaignById);

// Creator
router.post("/", verifyToken, requireRole("creator"), createCampaign);
router.get("/mine", verifyToken, requireRole("creator"), getMyCampaigns);
router.put("/:id", verifyToken, requireRole("creator"), updateCampaign);
router.delete("/:id", verifyToken, requireRole("creator"), deleteCampaign);

// Admin
router.get("/pending", verifyToken, requireRole("admin"), getPendingCampaigns);
router.get("/all", verifyToken, requireRole("admin"), getAllCampaigns);
router.put(
  "/:id/status",
  verifyToken,
  requireRole("admin"),
  updateCampaignStatus
);

export default router;
