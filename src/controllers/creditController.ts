import { Response } from "express";
import Payment from "../models/Payment";
import User from "../models/User";
import { AuthRequest } from "../middleware/verifyToken";

const packages: { [key: number]: number } = {
  100: 10,
  300: 25,
  800: 60,
  1500: 110,
};

export const purchaseCredits = async (req: AuthRequest, res: Response) => {
  try {
    const { credits, amount, transactionId } = req.body;
    const email = req.user!.email;

    if (!credits || !amount || !transactionId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // validate package
    if (packages[credits] !== amount) {
      return res.status(400).json({ message: "Invalid credit package." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.credits += credits;
    await user.save();

    await Payment.create({
      email,
      amount,
      credits,
      transactionId,
      date: new Date(),
    });

    res.json({ message: "Credits added successfully.", credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await Payment.find({ email: req.user!.email }).sort({
      date: -1,
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
