import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import carRoutes from "./routes/cars";
import userRoutes from "./routes/users";
import paymentRoutes from "./routes/payments";
import rentalRoutes from "./routes/rentals";
import authRoutes from "./routes/auth";

import { authenticateToken } from "./middleware/authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("DriveEasy API is running");
});

// Authentication route
app.use("/auth", authRoutes);

// Cars remain public so customers can browse vehicles
app.use("/cars", carRoutes);

// Protected routes
app.use("/users", authenticateToken, userRoutes);
app.use("/payments", authenticateToken, paymentRoutes);
app.use("/rentals", authenticateToken, rentalRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
