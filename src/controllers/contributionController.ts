import { Response } from "express";
import Contribution from "../models/Contribution";
import Campaign from "../models/Campaign";
import User from "../models/User";
import { AuthRequest } from "../middleware/verifyToken";
import { createNotification } from "./notificationController";

export const createContribution = async (req: AuthRequest, res: Response) => {
  try {
    const { campaign_id, amount } = req.body;

    if (!campaign_id || !amount) {
      return res
        .status(400)
        .json({ message: "Campaign ID and amount are required." });
    }

    const campaign = await Campaign.findById(campaign_id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    if (campaign.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Can only contribute to approved campaigns." });
    }

    if (campaign.deadline < new Date()) {
      return res
        .status(400)
        .json({ message: "Campaign deadline has passed." });
    }

    if (amount < campaign.minimum_contribution) {
      return res.status(400).json({
        message: `Minimum contribution is ${campaign.minimum_contribution} credits.`,
      });
    }

    const supporter = await User.findOne({ email: req.user!.email });
    if (!supporter) {
      return res.status(404).json({ message: "Supporter not found." });
    }

    if (supporter.credits < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient credits." });
    }

    supporter.credits -= amount;
    await supporter.save();

    const contribution = await Contribution.create({
      campaign_id,
      campaign_title: campaign.title,
      amount,
      supporter_email: req.user!.email,
      supporter_name: supporter.name,
      creator_name: campaign.creator_name,
      creator_email: campaign.creator_email,
      current_date: new Date(),
      status: "pending",
    });

    // notify creator about new contribution
    await createNotification(
      supporter.name + " contributed " + amount + " credits to your campaign \"" + campaign.title + "\".",
      campaign.creator_email,
      "/dashboard/creator-home/contributions"
    );

    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getMyContributions = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Contribution.countDocuments({
      supporter_email: req.user!.email,
    });

    const contributions = await Contribution.find({
      supporter_email: req.user!.email,
    })
      .sort({ current_date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: contributions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getPendingContributions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const contributions = await Contribution.find({
      creator_email: req.user!.email,
      status: "pending",
    }).sort({ current_date: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const approveContribution = async (req: AuthRequest, res: Response) => {
  try {
    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found." });
    }

    if (contribution.creator_email !== req.user!.email) {
      return res
        .status(403)
        .json({ message: "Not authorized to approve this contribution." });
    }

    if (contribution.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Contribution is not pending." });
    }

    const campaign = await Campaign.findById(contribution.campaign_id);
    if (campaign) {
      campaign.amount_raised += contribution.amount;
      await campaign.save();
    }

    contribution.status = "approved";
    await contribution.save();

    // send notification to supporter
    await createNotification(
      "Your contribution of " + contribution.amount + " credits to " + contribution.campaign_title + " was approved by " + contribution.creator_name,
      contribution.supporter_email,
      "/dashboard/supporter-home"
    );

    res.json(contribution);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const rejectContribution = async (req: AuthRequest, res: Response) => {
  try {
    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found." });
    }

    if (contribution.creator_email !== req.user!.email) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this contribution." });
    }

    if (contribution.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Contribution is not pending." });
    }

    const supporter = await User.findOne({
      email: contribution.supporter_email,
    });
    if (supporter) {
      supporter.credits += contribution.amount;
      await supporter.save();
    }

    contribution.status = "rejected";
    await contribution.save();

    // send notification to supporter
    await createNotification(
      "Your contribution of " + contribution.amount + " credits to " + contribution.campaign_title + " was rejected by " + contribution.creator_name,
      contribution.supporter_email,
      "/dashboard/supporter-home"
    );

    res.json(contribution);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
