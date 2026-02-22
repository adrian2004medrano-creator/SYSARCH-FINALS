import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load .env FIRST before anything else
dotenv.config();

// Debug: confirm env values are loaded
console.log("Loaded ENV:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import incidentsRoutes from "./routes/incidents.js";
import feedbackRoutes from "./routes/feedback.js";
import announcementsRoutes from "./routes/announcements.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/announcements", announcementsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});