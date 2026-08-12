import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get Authorization header
  const authHeader = req.headers.authorization;

  // Expected format: Bearer TOKEN
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Access denied. Authentication token required.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access denied. Authentication token required.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is missing");

    return res.status(500).json({
      error: "Server configuration error",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Save decoded user information for later use if needed
    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({
      error: "Invalid or expired token.",
    });
  }
};
