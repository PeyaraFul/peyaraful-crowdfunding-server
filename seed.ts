import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User";
import Campaign from "./src/models/Campaign";
import Contribution from "./src/models/Contribution";
import Payment from "./src/models/Payment";
import Withdrawal from "./src/models/Withdrawal";
import Notification from "./src/models/Notification";
import Report from "./src/models/Report";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB.");

    await User.deleteMany({});
    await Campaign.deleteMany({});
    await Contribution.deleteMany({});
    await Payment.deleteMany({});
    await Withdrawal.deleteMany({});
    await Notification.deleteMany({});
    await Report.deleteMany({});
    console.log("Cleared old data.");

    const password = await bcrypt.hash("password123", 10);
    const adminPassword = await bcrypt.hash("admin123", 10);

    const users = await User.insertMany([
      { name: "Admin User", email: "admin@peyaraful.com", photo: "", role: "admin", password: adminPassword, credits: 0 },
      { name: "Sarah Johnson", email: "sarah@example.com", photo: "", role: "supporter", password, credits: 250 },
      { name: "Mike Chen", email: "mike@example.com", photo: "", role: "supporter", password, credits: 120 },
      { name: "Emily Davis", email: "emily@example.com", photo: "", role: "supporter", password, credits: 500 },
      { name: "James Wilson", email: "james@example.com", photo: "", role: "supporter", password, credits: 75 },
      { name: "Lisa Anderson", email: "lisa@example.com", photo: "", role: "supporter", password, credits: 320 },
      { name: "Alex Rivera", email: "alex@example.com", photo: "", role: "creator", password, credits: 540 },
      { name: "Priya Patel", email: "priya@example.com", photo: "", role: "creator", password, credits: 180 },
      { name: "David Kim", email: "david@example.com", photo: "", role: "creator", password, credits: 900 },
      { name: "Rachel Green", email: "rachel@example.com", photo: "", role: "creator", password, credits: 60 },
      { name: "Tom Baker", email: "tom@example.com", photo: "", role: "creator", password, credits: 450 },
    ]);
    console.log(`Seeded ${users.length} users.`);

    const creators = users.filter((u) => u.role === "creator");
    const supporters = users.filter((u) => u.role === "supporter");

    const now = new Date();
    const campaigns = await Campaign.insertMany([
      {
        title: "Community Garden Project",
        story: "We want to build a community garden in the heart of downtown to provide fresh produce for local families.",
        category: "community",
        funding_goal: 5000,
        minimum_contribution: 10,
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        reward_info: "Every contributor gets a free plot in the garden",
        image_url: "",
        creator_email: creators[0].email,
        creator_name: creators[0].name,
        amount_raised: 2300,
        status: "approved",
      },
      {
        title: "Indie Film Production",
        story: "Support our short film about immigration and identity in modern America.",
        category: "film",
        funding_goal: 15000,
        minimum_contribution: 25,
        deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        reward_info: "Credits in the film and private screening invite",
        image_url: "",
        creator_email: creators[1].email,
        creator_name: creators[1].name,
        amount_raised: 8750,
        status: "approved",
      },
      {
        title: "Kids Coding Bootcamp",
        story: "Teaching underprivileged kids ages 10-16 how to code with free laptops provided.",
        category: "education",
        funding_goal: 8000,
        minimum_contribution: 15,
        deadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        reward_info: "Thank you card from a student + progress updates",
        image_url: "",
        creator_email: creators[2].email,
        creator_name: creators[2].name,
        amount_raised: 6200,
        status: "approved",
      },
      {
        title: "Mobile Health Clinic",
        story: "A mobile health unit to serve rural communities with basic checkups and vaccinations.",
        category: "health",
        funding_goal: 25000,
        minimum_contribution: 50,
        deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        reward_info: "Named on the clinic wall + annual impact report",
        image_url: "",
        creator_email: creators[3].email,
        creator_name: creators[3].name,
        amount_raised: 12000,
        status: "approved",
      },
      {
        title: "Eco-Friendly Water Bottles",
        story: "Launching a line of biodegradable water bottles to reduce plastic waste.",
        category: "environment",
        funding_goal: 3000,
        minimum_contribution: 10,
        deadline: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        reward_info: "Free bottle for every $10 contributed",
        image_url: "",
        creator_email: creators[4].email,
        creator_name: creators[4].name,
        amount_raised: 1800,
        status: "approved",
      },
      {
        title: "Senior Tech Literacy Program",
        story: "Workshops to teach seniors how to use smartphones and the internet safely.",
        category: "education",
        funding_goal: 4000,
        minimum_contribution: 10,
        deadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        reward_info: "Free workshop seat for a senior of your choice",
        image_url: "",
        creator_email: creators[0].email,
        creator_name: creators[0].name,
        amount_raised: 900,
        status: "approved",
      },
      {
        title: "Street Art Mural Festival",
        story: "Transforming empty walls across the city with murals by local artists.",
        category: "art",
        funding_goal: 7000,
        minimum_contribution: 20,
        deadline: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        reward_info: "Limited edition print of any mural you choose",
        image_url: "",
        creator_email: creators[1].email,
        creator_name: creators[1].name,
        amount_raised: 4500,
        status: "approved",
      },
      {
        title: "Dog Shelter Renovation",
        story: "Our local shelter needs new kennels, heating, and a bigger play area for rescue dogs.",
        category: "animals",
        funding_goal: 6000,
        minimum_contribution: 10,
        deadline: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
        reward_info: "Free dog training session + shelter tour",
        image_url: "",
        creator_email: creators[2].email,
        creator_name: creators[2].name,
        amount_raised: 3100,
        status: "approved",
      },
      {
        title: "Youth Music Program",
        story: "Providing free instruments and music lessons to kids in low-income neighborhoods.",
        category: "music",
        funding_goal: 10000,
        minimum_contribution: 20,
        deadline: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
        reward_info: "VIP seat at the end-of-year student concert",
        image_url: "",
        creator_email: creators[3].email,
        creator_name: creators[3].name,
        amount_raised: 0,
        status: "pending",
      },
      {
        title: "Urban Farming Initiative",
        story: "Converting vacant lots into productive farms to feed local communities.",
        category: "environment",
        funding_goal: 12000,
        minimum_contribution: 25,
        deadline: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
        reward_info: "Weekly fresh produce box for 3 months",
        image_url: "",
        creator_email: creators[4].email,
        creator_name: creators[4].name,
        amount_raised: 0,
        status: "pending",
      },
      {
        title: "Clean Water for Villages",
        story: "Installing water purification systems in 5 remote villages without clean water access.",
        category: "humanitarian",
        funding_goal: 20000,
        minimum_contribution: 30,
        deadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        reward_info: "Photo and story from the village you helped",
        image_url: "",
        creator_email: creators[0].email,
        creator_name: creators[0].name,
        amount_raised: 18500,
        status: "approved",
      },
      {
        title: "Podcast Studio Build",
        story: "Building a professional podcast studio to create free educational content.",
        category: "media",
        funding_goal: 5000,
        minimum_contribution: 15,
        deadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        reward_info: "Guest appearance on the podcast",
        image_url: "",
        creator_email: creators[1].email,
        creator_name: creators[1].name,
        amount_raised: 2200,
        status: "rejected",
      },
    ]);
    console.log(`Seeded ${campaigns.length} campaigns.`);

    const approvedCampaigns = campaigns.filter((c) => c.status === "approved");
    const pendingCampaigns = campaigns.filter((c) => c.status === "pending");

    const contributions = await Contribution.insertMany([
      { campaign_id: approvedCampaigns[0]._id.toString(), campaign_title: approvedCampaigns[0].title, amount: 100, supporter_email: supporters[0].email, supporter_name: supporters[0].name, creator_name: creators[0].name, creator_email: creators[0].email, current_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), status: "approved" },
      { campaign_id: approvedCampaigns[0]._id.toString(), campaign_title: approvedCampaigns[0].title, amount: 50, supporter_email: supporters[1].email, supporter_name: supporters[1].name, creator_name: creators[0].name, creator_email: creators[0].email, current_date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), status: "approved" },
      { campaign_id: approvedCampaigns[1]._id.toString(), campaign_title: approvedCampaigns[1].title, amount: 200, supporter_email: supporters[2].email, supporter_name: supporters[2].name, creator_name: creators[1].name, creator_email: creators[1].email, current_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), status: "approved" },
      { campaign_id: approvedCampaigns[2]._id.toString(), campaign_title: approvedCampaigns[2].title, amount: 75, supporter_email: supporters[3].email, supporter_name: supporters[3].name, creator_name: creators[2].name, creator_email: creators[2].email, current_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), status: "approved" },
      { campaign_id: approvedCampaigns[3]._id.toString(), campaign_title: approvedCampaigns[3].title, amount: 150, supporter_email: supporters[4].email, supporter_name: supporters[4].name, creator_name: creators[3].name, creator_email: creators[3].email, current_date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), status: "approved" },
      { campaign_id: approvedCampaigns[0]._id.toString(), campaign_title: approvedCampaigns[0].title, amount: 30, supporter_email: supporters[0].email, supporter_name: supporters[0].name, creator_name: creators[0].name, creator_email: creators[0].email, current_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), status: "pending" },
      { campaign_id: approvedCampaigns[4]._id.toString(), campaign_title: approvedCampaigns[4].title, amount: 25, supporter_email: supporters[1].email, supporter_name: supporters[1].name, creator_name: creators[4].name, creator_email: creators[4].email, current_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), status: "pending" },
      { campaign_id: approvedCampaigns[5]._id.toString(), campaign_title: approvedCampaigns[5].title, amount: 40, supporter_email: supporters[2].email, supporter_name: supporters[2].name, creator_name: creators[0].name, creator_email: creators[0].email, current_date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), status: "rejected" },
      { campaign_id: approvedCampaigns[6]._id.toString(), campaign_title: approvedCampaigns[6].title, amount: 120, supporter_email: supporters[3].email, supporter_name: supporters[3].name, creator_name: creators[1].name, creator_email: creators[1].email, current_date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), status: "approved" },
      { campaign_id: approvedCampaigns[7]._id.toString(), campaign_title: approvedCampaigns[7].title, amount: 60, supporter_email: supporters[4].email, supporter_name: supporters[4].name, creator_name: creators[2].name, creator_email: creators[2].email, current_date: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000), status: "approved" },
      { campaign_id: approvedCampaigns[1]._id.toString(), campaign_title: approvedCampaigns[1].title, amount: 80, supporter_email: supporters[0].email, supporter_name: supporters[0].name, creator_name: creators[1].name, creator_email: creators[1].email, current_date: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000), status: "pending" },
    ]);
    console.log(`Seeded ${contributions.length} contributions.`);

    const payments = await Payment.insertMany([
      { email: supporters[0].email, amount: 10, credits: 100, date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), transactionId: "txn_1001" },
      { email: supporters[0].email, amount: 25, credits: 300, date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), transactionId: "txn_1002" },
      { email: supporters[1].email, amount: 10, credits: 100, date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), transactionId: "txn_1003" },
      { email: supporters[2].email, amount: 60, credits: 800, date: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000), transactionId: "txn_1004" },
      { email: supporters[2].email, amount: 10, credits: 100, date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), transactionId: "txn_1005" },
      { email: supporters[3].email, amount: 25, credits: 300, date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), transactionId: "txn_1006" },
      { email: supporters[4].email, amount: 110, credits: 1500, date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), transactionId: "txn_1007" },
      { email: supporters[4].email, amount: 10, credits: 100, date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), transactionId: "txn_1008" },
      { email: supporters[1].email, amount: 25, credits: 300, date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), transactionId: "txn_1009" },
      { email: supporters[3].email, amount: 60, credits: 800, date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), transactionId: "txn_1010" },
      { email: supporters[0].email, amount: 110, credits: 1500, date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), transactionId: "txn_1011" },
    ]);
    console.log(`Seeded ${payments.length} payments.`);

    const withdrawals = await Withdrawal.insertMany([
      { creator_email: creators[0].email, creator_name: creators[0].name, withdrawal_credit: 200, withdrawal_amount: 10, payment_system: "paypal", account_number: "paypal_alex_001", withdraw_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), status: "approved" },
      { creator_email: creators[0].email, creator_name: creators[0].name, withdrawal_credit: 400, withdrawal_amount: 20, payment_system: "bank", account_number: "BANK_XXXX1234", withdraw_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), status: "pending" },
      { creator_email: creators[1].email, creator_name: creators[1].name, withdrawal_credit: 300, withdrawal_amount: 15, payment_system: "paypal", account_number: "paypal_priya_001", withdraw_date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), status: "approved" },
      { creator_email: creators[1].email, creator_name: creators[1].name, withdrawal_credit: 200, withdrawal_amount: 10, payment_system: "stripe", account_number: "stripe_david_001", withdraw_date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), status: "pending" },
      { creator_email: creators[2].email, creator_name: creators[2].name, withdrawal_credit: 500, withdrawal_amount: 25, payment_system: "bank", account_number: "BANK_XXXX5678", withdraw_date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), status: "approved" },
      { creator_email: creators[2].email, creator_name: creators[2].name, withdrawal_credit: 200, withdrawal_amount: 10, payment_system: "paypal", account_number: "paypal_rachel_001", withdraw_date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), status: "pending" },
      { creator_email: creators[3].email, creator_name: creators[3].name, withdrawal_credit: 300, withdrawal_amount: 15, payment_system: "stripe", account_number: "stripe_tom_001", withdraw_date: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000), status: "approved" },
      { creator_email: creators[4].email, creator_name: creators[4].name, withdrawal_credit: 200, withdrawal_amount: 10, payment_system: "bank", account_number: "BANK_XXXX9012", withdraw_date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), status: "pending" },
      { creator_email: creators[0].email, creator_name: creators[0].name, withdrawal_credit: 200, withdrawal_amount: 10, payment_system: "paypal", account_number: "paypal_alex_001", withdraw_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), status: "approved" },
      { creator_email: creators[1].email, creator_name: creators[1].name, withdrawal_credit: 200, withdrawal_amount: 10, payment_system: "bank", account_number: "BANK_XXXX3456", withdraw_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), status: "pending" },
      { creator_email: creators[2].email, creator_name: creators[2].name, withdrawal_credit: 200, withdrawal_amount: 10, payment_system: "stripe", account_number: "stripe_david_001", withdraw_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), status: "approved" },
    ]);
    console.log(`Seeded ${withdrawals.length} withdrawals.`);

    const notifications = await Notification.insertMany([
      { message: "Your campaign \"Community Garden Project\" has been approved by admin.", toEmail: creators[0].email, actionRoute: "/dashboard/creator-home", time: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000) },
      { message: "You have a new contribution of 100 credits from Sarah Johnson.", toEmail: creators[0].email, actionRoute: "/dashboard/creator-home", time: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) },
      { message: "Your withdrawal request of 200 credits has been approved.", toEmail: creators[0].email, actionRoute: "/dashboard/creator-home/withdrawals", time: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000) },
      { message: "Your campaign \"Indie Film Production\" has been approved by admin.", toEmail: creators[1].email, actionRoute: "/dashboard/creator-home", time: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000) },
      { message: "You have a new contribution of 200 credits from Emily Davis.", toEmail: creators[1].email, actionRoute: "/dashboard/creator-home", time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      { message: "Your contribution of 75 credits to \"Kids Coding Bootcamp\" was approved.", toEmail: supporters[3].email, actionRoute: "/dashboard/supporter-home/contributions", time: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
      { message: "Your contribution of 40 credits to \"Senior Tech Literacy\" was rejected. Credits refunded.", toEmail: supporters[2].email, actionRoute: "/dashboard/supporter-home/contributions", time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
      { message: "Your campaign \"Youth Music Program\" is pending admin review.", toEmail: creators[3].email, actionRoute: "/dashboard/creator-home", time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
      { message: "You purchased 300 credits successfully.", toEmail: supporters[0].email, actionRoute: "/dashboard/supporter-home/purchase", time: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000) },
      { message: "You purchased 800 credits successfully.", toEmail: supporters[2].email, actionRoute: "/dashboard/supporter-home/purchase", time: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000) },
      { message: "A new report has been filed against one of your campaigns.", toEmail: creators[1].email, actionRoute: "/dashboard/creator-home", time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
      { message: "Your campaign \"Podcast Studio Build\" has been rejected by admin.", toEmail: creators[1].email, actionRoute: "/dashboard/creator-home", time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
    ]);
    console.log(`Seeded ${notifications.length} notifications.`);

    const reports = await Report.insertMany([
      { reporter_name: supporters[0].name, campaign_id: approvedCampaigns[1]._id.toString(), campaign_title: approvedCampaigns[1].title, reason: "The funding goal seems unrealistic for a short film.", date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[1].name, campaign_id: approvedCampaigns[4]._id.toString(), campaign_title: approvedCampaigns[4].title, reason: "No proof of eco-friendly materials being used.", date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[2].name, campaign_id: campaigns[11]._id.toString(), campaign_title: campaigns[11].title, reason: "Creator has a history of incomplete projects.", date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[3].name, campaign_id: approvedCampaigns[6]._id.toString(), campaign_title: approvedCampaigns[6].title, reason: "Suspicious activity on the creator account.", date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[4].name, campaign_id: approvedCampaigns[0]._id.toString(), campaign_title: approvedCampaigns[0].title, reason: "Duplicate campaign posted from another account.", date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[0].name, campaign_id: approvedCampaigns[3]._id.toString(), campaign_title: approvedCampaigns[3].title, reason: "Medical claims in the story are not verified.", date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[1].name, campaign_id: approvedCampaigns[7]._id.toString(), campaign_title: approvedCampaigns[7].title, reason: "Shelter location details are inaccurate.", date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[2].name, campaign_id: pendingCampaigns[0]._id.toString(), campaign_title: pendingCampaigns[0].title, reason: "Creator name does not match any known music organization.", date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[3].name, campaign_id: approvedCampaigns[2]._id.toString(), campaign_title: approvedCampaigns[2].title, reason: "Requested full budget breakdown but got no response.", date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[4].name, campaign_id: approvedCampaigns[5]._id.toString(), campaign_title: approvedCampaigns[5].title, reason: "Similar campaign exists on another platform.", date: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[0].name, campaign_id: approvedCampaigns[8]._id.toString(), campaign_title: approvedCampaigns[8].title, reason: "Campaign images appear to be stock photos.", date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) },
      { reporter_name: supporters[1].name, campaign_id: pendingCampaigns[1]._id.toString(), campaign_title: pendingCampaigns[1].title, reason: "Funding goal raised without explanation.", date: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000) },
    ]);
    console.log(`Seeded ${reports.length} reports.`);

    console.log("\nSeed complete!");
    console.log("Login credentials:");
    console.log("  Admin:    admin@peyaraful.com / admin123");
    console.log("  Supporter: sarah@example.com / password123");
    console.log("  Creator:  alex@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
