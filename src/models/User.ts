import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  photo: string;
  role: "supporter" | "creator" | "admin";
  password: string;
  credits: number;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String, default: "" },
  role: {
    type: String,
    enum: ["supporter", "creator", "admin"],
    default: "supporter",
  },
  password: { type: String, required: true },
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
