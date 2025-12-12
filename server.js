import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// CORS (Development)
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

// Start DB + Server
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
