import { Response } from "express";
import Report from "../models/Report";
import Campaign from "../models/Campaign";
import { AuthRequest } from "../middleware/verifyToken";

// submit report (supporter)
export const submitReport = async (req: AuthRequest, res: Response) => {
  try {
    const { campaign_id, reason } = req.body;

    if (!campaign_id || !reason) {
      return res.status(400).json({ message: "Campaign ID and reason are required." });
    }

    const campaign = await Campaign.findById(campaign_id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    const report = await Report.create({
      reporter_name: req.user!.email,
      campaign_id,
      campaign_title: campaign.title,
      reason,
      date: new Date(),
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// get all reports (admin)
export const getAllReports = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await Report.find({}).sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
