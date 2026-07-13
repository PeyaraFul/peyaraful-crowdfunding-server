import { Response } from "express";
import Payment from "../models/Payment";
import User from "../models/User";
import { AuthRequest } from "../middleware/verifyToken";
import { getStripe } from "../stripe";

const packages: { [key: number]: number } = {
  100: 10,
  300: 25,
  800: 60,
  1500: 110,
};

export const purchaseCredits = async (req: AuthRequest, res: Response) => {
  try {
    const { credits, amount, transactionId } = req.body;
    const email = req.user?.email || "test@test.com";

    if (!credits || !amount || !transactionId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (packages[credits] !== amount) {
      return res.status(400).json({ message: "Invalid credit package." });
    }

    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return res.status(400).json({ message: "Transaction already processed." });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ message: "Stripe is not configured." });
    }

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(transactionId);
    } catch {
      return res.status(400).json({ message: "Invalid session ID." });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment has not been completed." });
    }

    const sessionAmount = session.amount_total ? session.amount_total / 100 : 0;
    if (sessionAmount !== amount) {
      return res.status(400).json({ message: "Payment amount does not match." });
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
    const payments = await Payment.find({ email: req.user?.email || "test@test.com" }).sort({
      date: -1,
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
