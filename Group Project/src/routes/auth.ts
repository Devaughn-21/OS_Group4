import "dotenv/config";

import { Router, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import pool from "../db";

const router = Router();

// Define what a user returned from MySQL looks like
interface UserRow extends RowDataPacket {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string | null;
}

// Limit repeated login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: "Too many login attempts. Please try again later.",
  },
});

// POST /auth/login
router.post("/login", loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user by email
    const [rows] = await pool.execute<UserRow[]>(
      `
        SELECT user_id, first_name, last_name, email, password
        FROM users
        WHERE email = ?
        `,
      [email],
    );

    // Make sure the user exists
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Existing users may not have a password yet
    if (!user.password) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Compare entered password with stored bcrypt hash
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Get JWT secret from .env
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        error: "Server configuration error",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: "1h",
      },
    );

    // Send successful login response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
});

export default router;
