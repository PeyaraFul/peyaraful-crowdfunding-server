import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  reporter_name: string;
  campaign_id: string;
  campaign_title: string;
  reason: string;
  date: Date;
}

const reportSchema = new Schema<IReport>({
  reporter_name: { type: String, required: true },
  campaign_id: { type: String, required: true },
  campaign_title: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IReport>("Report", reportSchema);
