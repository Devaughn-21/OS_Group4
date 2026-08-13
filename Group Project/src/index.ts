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

app.set("trust proxy", 1);

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
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

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
