import { Response } from "express";
import Withdrawal from "../models/Withdrawal";
import User from "../models/User";
import Campaign from "../models/Campaign";
import { AuthRequest } from "../middleware/verifyToken";
import { createNotification } from "./notificationController";

export const createWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const { withdrawal_credit, payment_system, account_number } = req.body;

    if (!withdrawal_credit || !payment_system || !account_number) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (withdrawal_credit < 200) {
      return res
        .status(400)
        .json({ message: "Minimum withdrawal is 200 credits ($10)." });
    }

    const campaigns = await Campaign.find({
      creator_email: req.user!.email,
      status: "approved",
    });

    const totalRaised = campaigns.reduce(
      (sum, c) => sum + c.amount_raised,
      0
    );

    // subtract pending withdrawals
    const pendingWithdrawals = await Withdrawal.find({
      creator_email: req.user!.email,
      status: "pending",
    });
    const pendingTotal = pendingWithdrawals.reduce(
      (sum, w) => sum + w.withdrawal_credit,
      0
    );

    const available = totalRaised - pendingTotal;

    if (withdrawal_credit > available) {
      return res
        .status(400)
        .json({ message: "Insufficient raised credits." });
    }

    const user = await User.findOne({ email: req.user!.email });

    const withdrawal = await Withdrawal.create({
      creator_email: req.user!.email,
      creator_name: user?.name || "",
      withdrawal_credit,
      withdrawal_amount: withdrawal_credit / 20,
      payment_system,
      account_number,
      withdraw_date: new Date(),
      status: "pending",
    });

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getMyWithdrawals = async (req: AuthRequest, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find({
      creator_email: req.user!.email,
    }).sort({ withdraw_date: -1 });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getPendingWithdrawals = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const withdrawals = await Withdrawal.find({ status: "pending" }).sort({
      withdraw_date: -1,
    });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const approveWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found." });
    }

    if (withdrawal.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Withdrawal is not pending." });
    }

    const campaigns = await Campaign.find({
      creator_email: withdrawal.creator_email,
      status: "approved",
    });

    // first check total available before deducting
    const totalAvailable = campaigns.reduce(
      (sum, c) => sum + c.amount_raised,
      0
    );

    if (withdrawal.withdrawal_credit > totalAvailable) {
      return res.status(400).json({ message: "Insufficient credits available." });
    }

    // now safe to deduct
    let remaining = withdrawal.withdrawal_credit;

    for (const campaign of campaigns) {
      if (remaining <= 0) break;

      if (campaign.amount_raised > 0) {
        const deduct = Math.min(campaign.amount_raised, remaining);
        campaign.amount_raised -= deduct;
        remaining -= deduct;
        await campaign.save();
      }
    }

    withdrawal.status = "approved";
    await withdrawal.save();

    // send notification to creator
    await createNotification(
      "Your withdrawal of " + withdrawal.withdrawal_credit + " credits ($" + withdrawal.withdrawal_amount + ") has been approved.",
      withdrawal.creator_email,
      "/dashboard/creator-home"
    );

    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
