import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  email: string;
  amount: number;
  credits: number;
  date: Date;
  transactionId: string;
}

const paymentSchema = new Schema<IPayment>({
  email: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  credits: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  transactionId: { type: String, required: true },
});

export default mongoose.model<IPayment>("Payment", paymentSchema);
