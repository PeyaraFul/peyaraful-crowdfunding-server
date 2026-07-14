import { Response } from "express";
import Campaign from "../models/Campaign";
import Contribution from "../models/Contribution";
import User from "../models/User";
import { AuthRequest } from "../middleware/verifyToken";
import { createNotification } from "./notificationController";

export const createCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      story,
      category,
      funding_goal,
      minimum_contribution,
      deadline,
      reward_info,
      image_url,
    } = req.body;

    const user = await User.findOne({ email: req.user!.email });

    const campaign = await Campaign.create({
      title,
      story,
      category,
      funding_goal,
      minimum_contribution,
      deadline,
      reward_info,
      image_url: image_url || "",
      creator_email: req.user!.email,
      creator_name: user?.name || "",
      status: "pending",
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getApprovedCampaigns = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const campaigns = await Campaign.find({
      status: "approved",
      deadline: { $gt: new Date() },
    }).sort({ deadline: 1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getTopCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({ status: "approved" })
      .sort({ amount_raised: -1 })
      .limit(6);

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getCampaignById = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getMyCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({
      creator_email: req.user!.email,
    }).sort({ deadline: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const updateCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    if (campaign.creator_email !== req.user!.email) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this campaign." });
    }

    const { title, story, reward_info } = req.body;

    if (title) campaign.title = title;
    if (story) campaign.story = story;
    if (reward_info) campaign.reward_info = reward_info;

    await campaign.save();

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    // allow creator (owner) or admin
    const isOwner = campaign.creator_email === req.user!.email;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this campaign." });
    }

    const approvedContributions = await Contribution.find({
      campaign_id: req.params.id,
      status: "approved",
    });

    for (const contrib of approvedContributions) {
      const supporter = await User.findOne({ email: contrib.supporter_email });
      if (supporter) {
        supporter.credits += contrib.amount;
        await supporter.save();
      }
    }

    // also refund pending contributions
    const pendingContributions = await Contribution.find({
      campaign_id: req.params.id,
      status: "pending",
    });

    for (const contrib of pendingContributions) {
      const supporter = await User.findOne({ email: contrib.supporter_email });
      if (supporter) {
        supporter.credits += contrib.amount;
        await supporter.save();
      }
    }

    await Campaign.findByIdAndDelete(req.params.id);

    // delete all contributions for this campaign
    await Contribution.deleteMany({ campaign_id: req.params.id });

    res.json({ message: "Campaign deleted and credits refunded." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getPendingCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const updateCampaignStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    // send notification to creator
    await createNotification(
      "Your campaign \"" + campaign.title + "\" has been " + status + " by admin.",
      campaign.creator_email,
      "/dashboard/creator-home"
    );

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getAllCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
