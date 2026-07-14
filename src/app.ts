import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import campaignRoutes from "./routes/campaign";
import contributionRoutes from "./routes/contribution";
import withdrawalRoutes from "./routes/withdrawal";
import creditRoutes from "./routes/credit";
import notificationRoutes from "./routes/notification";
import reportRoutes from "./routes/report";
import stripeRoutes from "./routes/stripe";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// routes
app.get("/", (_req, res) => {
  res.json({ message: "Peyaraful Crowdfunding API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/credits", creditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/stripe", stripeRoutes);

// connect to MongoDB
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log("Connected to MongoDB.");

    // seed admin once
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
        credits: 0,
        photo: "",
      });
      console.log("Admin user seeded.");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// middleware to ensure DB is connected before handling requests
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

export default app;
