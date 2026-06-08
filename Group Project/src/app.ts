import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import carRoutes from "./routes/cars";
import userRoutes from "./routes/users";
import rentalRoutes from "./routes/rentals";
import paymentRoutes from "./routes/payments";
import juiceReportRoutes from "./routes/juicereport";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Realest Rentals API is running!");
});

app.use("/cars", carRoutes);
app.use("/users", userRoutes);
app.use("/rentals", rentalRoutes);
app.use("/payments", paymentRoutes);
app.use("/juicereport", juiceReportRoutes);

export default app;
