import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise"; // ✅ use promise-based consistently
import helmet from "helmet";

dotenv.config();

// Debug: confirm env values (only in dev)
if (process.env.NODE_ENV !== "production") {
  console.log("Loaded ENV:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });
}

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import incidentsRoutes from "./routes/incidents.js";
import feedbackRoutes from "./routes/feedback.js";
import announcementsRoutes from "./routes/announcements.js";

// ✅ Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Database connected successfully");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

const app = express();
app.use(cors({ origin: "*" })); // 🔒 optionally restrict to frontend domain
app.use(express.json());
app.use(helmet());

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/announcements", announcementsRoutes);

// ✅ FAQ route
app.get("/api/faqs", async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, question, answer FROM faqs");
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching FAQs:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Chatbot entries route
app.get("/api/chatbot", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, category, title, head, designation, contact FROM chatbot_entries"
    );
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching chatbot entries:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ FAQs joined with hotline numbers
app.get("/api/faqs-with-hotlines", async (req, res) => {
  try {
    const sql = `
      SELECT f.id, f.question, f.answer, c.contact
      FROM faqs f
      LEFT JOIN chatbot_entries c
      ON f.answer = c.title
    `;
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching FAQs with hotlines:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unexpected error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
