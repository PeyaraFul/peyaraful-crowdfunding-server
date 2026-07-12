import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import campaignRoutes from "./routes/campaign";
import contributionRoutes from "./routes/contribution";
import withdrawalRoutes from "./routes/withdrawal";
import creditRoutes from "./routes/credit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      credits: 0,
      photo: "",
    });
    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.json({ message: "Peyaraful Crowdfunding API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/credits", creditRoutes);

startServer();
