import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", productRoutes);
app.use("/api", userRoutes);

// Serve React Build
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "geteasytech-frontend/build")));

// SPA fallback — FIXES "NOT FOUND" ON REFRESH
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "geteasytech-frontend/build/index.html"));
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
