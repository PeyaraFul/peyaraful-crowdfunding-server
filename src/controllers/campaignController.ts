import { Response } from "express";
import Campaign from "../models/Campaign";
import { AuthRequest } from "../middleware/verifyToken";

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
      creator_name: req.body.creator_name,
      status: "pending",
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
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
    res.status(500).json({ message: "Server error.", error });
  }
};

export const getTopCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({ status: "approved" })
      .sort({ amount_raised: -1 })
      .limit(6);

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
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
    res.status(500).json({ message: "Server error.", error });
  }
};

export const getMyCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({
      creator_email: req.user!.email,
    }).sort({ deadline: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
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
    res.status(500).json({ message: "Server error.", error });
  }
};

export const deleteCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    if (campaign.creator_email !== req.user!.email) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this campaign." });
    }

    await Campaign.findByIdAndDelete(req.params.id);

    res.json({ message: "Campaign deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const getPendingCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
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

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const getAllCampaigns = async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};
