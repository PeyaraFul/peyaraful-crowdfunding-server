import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  toEmail: { type: String, required: true, index: true },
  actionRoute: { type: String, default: "" },
  time: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
