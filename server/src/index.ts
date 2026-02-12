import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import childrenRoutes from "./routes/children.js";
import groupRoutes from "./routes/groups.js";
import exerciseRoutes from "./routes/exercises.js";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/yasna";

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter((v): v is string => Boolean(v));

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/children", authMiddleware, childrenRoutes);
app.use("/api/groups", authMiddleware, groupRoutes);
app.use("/api/exercises", authMiddleware, exerciseRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
