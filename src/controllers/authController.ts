import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/verifyToken";

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
