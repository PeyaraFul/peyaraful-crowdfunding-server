import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
