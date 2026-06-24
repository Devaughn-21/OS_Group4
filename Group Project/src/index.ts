import express from "express";
import carRoutes from "./routes/cars";
import userRoutes from "./routes/users";
import paymentRoutes from "./routes/payments";

const app = express();

app.use(express.json());

app.use("/cars", carRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});