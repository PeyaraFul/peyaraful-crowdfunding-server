import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import { AuthRequest } from "../middleware/verifyToken";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (email: string, role: string): string => {
  return jwt.sign({ email, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, photo, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // only allow supporter and creator roles
    const allowedRoles = ["supporter", "creator"];
    const userRole = allowedRoles.includes(role) ? role : "supporter";

    const defaultCredits = userRole === "creator" ? 20 : 50;

    const user = await User.create({
      name,
      email,
      photo: photo || "",
      role: userRole,
      password,
      credits: defaultCredits,
    });

    const token = generateToken(user.email, user.role);

    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user.email, user.role);

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ email: req.user?.email }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("name email photo role");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { role } = req.body;

    if (!["supporter", "creator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token." });
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // create new user — default to supporter, random password
      const randomPassword = Math.random().toString(36).slice(-12);
      const userRole = ["supporter", "creator"].includes(role) ? role : "supporter";
      const defaultCredits = userRole === "creator" ? 20 : 50;

      user = await User.create({
        name: name || "Google User",
        email,
        photo: picture || "",
        role: userRole,
        password: randomPassword,
        credits: defaultCredits,
      });
    }

    const token = generateToken(user.email, user.role);

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed." });
  }
};
