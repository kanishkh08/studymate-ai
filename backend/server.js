import "dotenv/config"; // loads variables from backend/.env into process.env
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import AppError from "./utils/AppError.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Needed when deployed behind a proxy (Render, Railway...) so rate limiting sees real IPs.
app.set("trust proxy", 1);

// --- CORS: only your frontend may call this API from a browser -------------
// CLIENT_URL can hold several origins separated by commas.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No origin = tools like Thunder Client / curl, which we allow.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new AppError(403, "This origin is not allowed by CORS."));
    },
  })
);

// --- Body parsing with a size limit (basic protection against huge requests) ---
app.use(express.json({ limit: "200kb" }));

// --- Rate limit the AI routes: they cost money/quota ------------------------
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: Number(process.env.AI_RATE_LIMIT) || 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many AI requests. Please wait a few minutes and try again." },
});

// --- Routes ------------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/notes", notesRoutes);

// Creating a plan calls Gemini, so only POST /api/plans is rate limited.
app.post("/api/plans", aiLimiter);
app.use("/api/plans", plannerRoutes);

// --- 404 + error handling (must come after the routes) ----------------------
app.use(notFound);
app.use(errorHandler);

// --- Start -------------------------------------------------------------------
async function start() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("[ai] GEMINI_API_KEY is not set. Summaries and quizzes will fail until you add it.");
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`[server] StudyMate API running on http://localhost:${PORT}`);
  });
}

start();
