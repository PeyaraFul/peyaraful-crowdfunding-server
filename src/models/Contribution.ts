import mongoose, { Schema, Document } from "mongoose";

export interface IContribution extends Document {
  campaign_id: string;
  campaign_title: string;
  amount: number;
  supporter_email: string;
  supporter_name: string;
  creator_name: string;
  creator_email: string;
  current_date: Date;
  status: "pending" | "approved" | "rejected";
}

const contributionSchema = new Schema<IContribution>({
  campaign_id: { type: String, required: true },
  campaign_title: { type: String, required: true },
  amount: { type: Number, required: true },
  supporter_email: { type: String, required: true },
  supporter_name: { type: String, required: true },
  creator_name: { type: String, required: true },
  creator_email: { type: String, required: true },
  current_date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.model<IContribution>("Contribution", contributionSchema);
