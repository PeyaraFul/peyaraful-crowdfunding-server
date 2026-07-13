import { Router, Response } from "express";
import { getStripe } from "../stripe";
import { verifyToken, AuthRequest } from "../middleware/verifyToken";

const router = Router();

router.post("/create-checkout-session", async (req: any, res: Response) => {
  try {
    const { credits, amount } = req.body;

    if (!credits || !amount || amount <= 0) {
      return res.status(400).json({ message: "Valid credits and amount are required." });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        message: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} Peyaraful Credits`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard/supporter-home/purchase/success?session_id={CHECKOUT_SESSION_ID}&credits=${credits}&amount=${amount}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard/supporter-home/purchase`,
      metadata: {
        credits: String(credits),
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to create checkout session." });
  }
});

export default router;
