import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

import User from "./src/models/User";
import Campaign from "./src/models/Campaign";
import Contribution from "./src/models/Contribution";
import Payment from "./src/models/Payment";
import Withdrawal from "./src/models/Withdrawal";
import Notification from "./src/models/Notification";
import Report from "./src/models/Report";

const categories = [
  "technology", "art", "music", "film", "games", "education",
  "community", "environment", "health", "food", "sports", "fashion",
];

const paymentSystems = ["PayPal", "Stripe", "Bank Transfer", "bKash", "Nagad", "Rocket"];

const firstNames = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah",
  "Ivan", "Julia", "Kevin", "Laura", "Mike", "Nancy", "Oscar", "Patricia",
  "Quinn", "Rachel", "Steve", "Tina", "Uma", "Victor", "Wendy", "Xavier",
  "Yara", "Zane", "Aria", "Brandon", "Clara", "Derek", "Elena", "Frank",
  "Grace", "Henry", "Iris", "Jake", "Kira", "Leo", "Mia", "Noah",
  "Olivia", "Paul", "Ruby", "Sam", "Tara", "Umar", "Vera", "Will",
  "Xena", "Yusuf", "Zara", "Amir", "Bella", "Cody", "Dina", "Evan",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas",
  "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen",
  "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall",
  "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez",
  "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards",
];

const storyTemplates = [
  "We are building an innovative platform that will transform how people interact with technology in their daily lives.",
  "Our team has developed a revolutionary approach to sustainable living that could change communities forever.",
  "This project aims to bring world-class education resources to underserved areas around the globe.",
  "We are creating a documentary that highlights the untold stories of everyday heroes in our community.",
  "Our mission is to build a space where artists can collaborate, share, and monetize their creative work.",
  "We want to launch a mobile app that connects volunteers with local charities in need of help.",
  "This initiative will provide clean drinking water to remote villages through innovative filtration systems.",
  "We are developing an AI-powered tool that helps small businesses automate their accounting processes.",
  "Our goal is to produce an indie album that blends traditional instruments with modern electronic sounds.",
  "We are creating an online marketplace specifically designed for handmade and artisanal products.",
  "This project will build a community center offering free coding workshops for teenagers.",
  "We are designing a wearable health monitor that tracks vital signs and alerts users in emergencies.",
  "Our startup is building a peer-to-peer lending platform for small entrepreneurs in developing countries.",
  "We want to produce a short film exploring themes of identity and belonging in the digital age.",
  "We are launching a urban farming initiative to provide fresh produce in food deserts.",
  "This project will create an accessible gaming platform for people with disabilities.",
  "We are building a wildlife conservation app that uses citizen science to track endangered species.",
  "Our team is developing a solar-powered charging station for public parks and beaches.",
  "We want to create a podcast network focused on storytelling from diverse perspectives.",
  "We are building a language learning platform that uses immersive VR experiences.",
  "This initiative will establish a network of free libraries in public spaces across the city.",
  "We are creating a mental health support platform with AI-guided therapy sessions.",
  "Our project will build a vertical garden system for apartment dwellers to grow their own food.",
  "We are launching a travel blog platform that focuses on sustainable and responsible tourism.",
  "We want to develop a board game that teaches financial literacy to young adults.",
];

const rewardTemplates = [
  "Free product sample for every $10 contributed",
  "Exclusive behind-the-scenes access for backers at $25+",
  "Limited edition merchandise for contributions of $50 or more",
  "Personal thank you video from the team at $15+",
  "Name listed on our website contributors wall for $20+",
  "Early access to the platform for $30+ contributors",
  "Free workshop session for every $25 contributed",
  "Signed poster for backers at $40+",
  "VIP launch event invitation for $100+ contributors",
  "Custom artwork print for $75+ backers",
  "Annual subscription free for $60+ contributors",
  "Free consultation session for $35+ backers",
  "Exclusive merch bundle for $80+ contributors",
  "Private screening invite for $50+ backers",
  "Free membership for one year at $100+",
  "Personalized coaching session at $45+",
  "Limited run vinyl record for $55+ backers",
  "Digital download pack for $15+ contributors",
  "Handwritten letter for $20+ backers",
  "Feature in our documentary for $200+ contributors",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomEmail(first: string, last: string): string {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com"];
  return `${first.toLowerCase()}.${last.toLowerCase()}@${pick(domains)}`;
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected.\n");

  // Clear all collections
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Campaign.deleteMany({}),
    Contribution.deleteMany({}),
    Payment.deleteMany({}),
    Withdrawal.deleteMany({}),
    Notification.deleteMany({}),
    Report.deleteMany({}),
  ]);
  console.log("Cleared.\n");

  // 1. USERS (55 total: 1 admin, 7 creators, 47 supporters)
  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users: any[] = [];

  // admin
  users.push({
    name: "Admin User",
    email: "admin@peyaraful.com",
    photo: "https://i.pravatar.cc/150?img=1",
    role: "admin",
    password: await bcrypt.hash("admin123", 10),
    credits: 0,
  });

  // creators
  const creatorUsers: any[] = [];
  for (let i = 0; i < 7; i++) {
    const first = firstNames[i];
    const last = lastNames[i];
    const u = {
      name: `${first} ${last}`,
      email: randomEmail(first, last),
      photo: `https://i.pravatar.cc/150?img=${i + 2}`,
      role: "creator" as const,
      password: hashedPassword,
      credits: randomInt(50, 500),
    };
    creatorUsers.push(u);
    users.push(u);
  }

  // supporters
  const supporterUsers: any[] = [];
  for (let i = 0; i < 47; i++) {
    const first = firstNames[i + 7];
    const last = lastNames[i + 7];
    const u = {
      name: `${first} ${last}`,
      email: randomEmail(first, last),
      photo: `https://i.pravatar.cc/150?img=${(i % 50) + 2}`,
      role: "supporter" as const,
      password: hashedPassword,
      credits: randomInt(20, 300),
    };
    supporterUsers.push(u);
    users.push(u);
  }

  const createdUsers = await User.insertMany(users);
  console.log(`  Inserted ${createdUsers.length} users.`);

  const admins = createdUsers.filter((u) => u.role === "admin");
  const creators = createdUsers.filter((u) => u.role === "creator");
  const supporters = createdUsers.filter((u) => u.role === "supporter");

  // 2. CAMPAIGNS (55: 35 approved, 10 pending, 10 rejected)
  console.log("Seeding campaigns...");
  const campaigns: any[] = [];
  const now = new Date();

  for (let i = 0; i < 55; i++) {
    const creator = creators[i % creators.length];
    const cat = categories[i % categories.length];
    let status: "approved" | "pending" | "rejected" = "approved";
    if (i >= 35 && i < 45) status = "pending";
    if (i >= 45) status = "rejected";

    campaigns.push({
      title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Project ${i + 1}`,
      story: storyTemplates[i % storyTemplates.length],
      category: cat,
      funding_goal: randomInt(1000, 50000),
      minimum_contribution: randomInt(5, 50),
      deadline: randomDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)),
      reward_info: rewardTemplates[i % rewardTemplates.length],
      image_url: `https://picsum.photos/seed/campaign${i}/800/400`,
      creator_email: creator.email,
      creator_name: creator.name,
      amount_raised: status === "approved" ? randomInt(0, 20000) : 0,
      status,
    });
  }

  const createdCampaigns = await Campaign.insertMany(campaigns);
  console.log(`  Inserted ${createdCampaigns.length} campaigns.`);

  const approvedCampaigns = createdCampaigns.filter((c) => c.status === "approved");

  // 3. CONTRIBUTIONS (55: mix of pending, approved, rejected)
  console.log("Seeding contributions...");
  const contributions: any[] = [];

  for (let i = 0; i < 55; i++) {
    const campaign = approvedCampaigns[i % approvedCampaigns.length];
    const supporter = supporters[i % supporters.length];
    let status: "approved" | "pending" | "rejected" = "approved";
    if (i >= 30 && i < 42) status = "pending";
    if (i >= 42) status = "rejected";

    contributions.push({
      campaign_id: campaign._id.toString(),
      campaign_title: campaign.title,
      amount: randomInt(10, 200),
      supporter_email: supporter.email,
      supporter_name: supporter.name,
      creator_name: campaign.creator_name,
      creator_email: campaign.creator_email,
      current_date: randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now),
      status,
    });
  }

  const createdContributions = await Contribution.insertMany(contributions);
  console.log(`  Inserted ${createdContributions.length} contributions.`);

  // 4. PAYMENTS (55)
  console.log("Seeding payments...");
  const payments: any[] = [];
  const creditPackages = [
    { credits: 100, amount: 10 },
    { credits: 300, amount: 25 },
    { credits: 800, amount: 60 },
    { credits: 1500, amount: 110 },
  ];

  for (let i = 0; i < 55; i++) {
    const supporter = supporters[i % supporters.length];
    const pkg = pick(creditPackages);

    payments.push({
      email: supporter.email,
      amount: pkg.amount,
      credits: pkg.credits,
      date: randomDate(new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), now),
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}${i}`,
    });
  }

  const createdPayments = await Payment.insertMany(payments);
  console.log(`  Inserted ${createdPayments.length} payments.`);

  // 5. WITHDRAWALS (55: 30 pending, 25 approved)
  console.log("Seeding withdrawals...");
  const withdrawals: any[] = [];

  for (let i = 0; i < 55; i++) {
    const creator = creators[i % creators.length];
    const credit = randomInt(200, 2000);
    const status: "pending" | "approved" = i < 25 ? "approved" : "pending";

    withdrawals.push({
      creator_email: creator.email,
      creator_name: creator.name,
      withdrawal_credit: credit,
      withdrawal_amount: credit / 20,
      payment_system: pick(paymentSystems),
      account_number: `${randomInt(1000000000, 9999999999)}`,
      withdraw_date: randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now),
      status,
    });
  }

  const createdWithdrawals = await Withdrawal.insertMany(withdrawals);
  console.log(`  Inserted ${createdWithdrawals.length} withdrawals.`);

  // 6. NOTIFICATIONS (60)
  console.log("Seeding notifications...");
  const notifications: any[] = [];
  const notifMessages = [
    "Your campaign has been approved!",
    "A new contribution was made to your campaign.",
    "Your withdrawal request is being processed.",
    "Someone reported your campaign.",
    "Your contribution has been approved.",
    "Your contribution was rejected. Credits refunded.",
    "Welcome to Peyaraful Crowdfunding!",
    "Your campaign is now under review.",
    "Your withdrawal request has been approved.",
    "A new campaign matching your interests was added.",
    "Your account credits have been updated.",
    "Campaign deadline approaching soon.",
    "Your campaign was rejected. Please review feedback.",
    "New supporter joined your campaign.",
    "Monthly summary: 12 new contributions this month.",
    "Your payment was processed successfully.",
    "System maintenance scheduled for this weekend.",
    "New feature: Explore campaigns by category.",
    "Your campaign has received 10 contributions!",
    "Reminder: Complete your campaign story.",
  ];

  const allUsers = [...creators, ...supporters];
  for (let i = 0; i < 60; i++) {
    const user = allUsers[i % allUsers.length];
    const campaign = createdCampaigns[i % createdCampaigns.length];

    notifications.push({
      message: notifMessages[i % notifMessages.length],
      toEmail: user.email,
      actionRoute: `/dashboard/creator-home/my-campaigns`,
      time: randomDate(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), now),
    });
  }

  const createdNotifications = await Notification.insertMany(notifications);
  console.log(`  Inserted ${createdNotifications.length} notifications.`);

  // 7. REPORTS (55)
  console.log("Seeding reports...");
  const reports: any[] = [];
  const reportReasons = [
    "This campaign contains misleading information about the product.",
    "The funding goal seems unreasonably high for the described project.",
    "No evidence provided that the creator has the skills to deliver.",
    "Campaign appears to be a duplicate of another existing campaign.",
    "Reward descriptions are vague and unrealistic.",
    "The campaign images appear to be stolen from another source.",
    "Suspicious activity detected on this campaign page.",
    "The story contains plagiarized content from another website.",
    "Campaign does not comply with platform guidelines.",
    "The creator has a history of not delivering rewards.",
    "This appears to be a scam or fraudulent campaign.",
    "Campaign is promoting illegal products or services.",
    "The funding timeline is unrealistic for the project scope.",
    "No clear plan for how funds will be used.",
    "Campaign contains offensive or inappropriate content.",
  ];

  for (let i = 0; i < 55; i++) {
    const campaign = createdCampaigns[i % createdCampaigns.length];
    const reporter = supporters[i % supporters.length];

    reports.push({
      reporter_name: reporter.name,
      campaign_id: campaign._id.toString(),
      campaign_title: campaign.title,
      reason: reportReasons[i % reportReasons.length],
      date: randomDate(new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), now),
    });
  }

  const createdReports = await Report.insertMany(reports);
  console.log(`  Inserted ${createdReports.length} reports.`);

  console.log("\n--- Seed Summary ---");
  console.log(`Users:         ${createdUsers.length}`);
  console.log(`Campaigns:     ${createdCampaigns.length}`);
  console.log(`Contributions: ${createdContributions.length}`);
  console.log(`Payments:      ${createdPayments.length}`);
  console.log(`Withdrawals:   ${createdWithdrawals.length}`);
  console.log(`Notifications: ${createdNotifications.length}`);
  console.log(`Reports:       ${createdReports.length}`);
  console.log(`Total:         ${createdUsers.length + createdCampaigns.length + createdContributions.length + createdPayments.length + createdWithdrawals.length + createdNotifications.length + createdReports.length}`);

  console.log("\nAdmin login: admin@peyaraful.com / admin123");
  console.log("Other users login with password: password123\n");

  await mongoose.disconnect();
  console.log("Done. Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
