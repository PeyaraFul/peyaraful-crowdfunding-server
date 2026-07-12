import { Response } from "express";
import Notification from "../models/Notification";
import { AuthRequest } from "../middleware/verifyToken";

// get notifications by email
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const email = req.user!.email;

    const notifications = await Notification.find({ toEmail: email }).sort({
      time: -1,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// create notification
export const createNotification = async (
  message: string,
  toEmail: string,
  actionRoute: string
) => {
  try {
    await Notification.create({
      message,
      toEmail,
      actionRoute,
      time: new Date(),
    });
  } catch (error) {
    console.log("Notification error:", error);
  }
};
