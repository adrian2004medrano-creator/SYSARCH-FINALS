import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";

// Load .env FIRST before anything else
dotenv.config();

// Debug: confirm env values are loaded
console.log(
  "Loaded ENV:",
  process.env.DB_HOST,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME
);

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
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully");
    connection.release();
  }
});

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/announcements", announcementsRoutes);

// ✅ FAQ route (basic: question + answer)
app.get("/api/faqs", (req, res) => {
  db.query("SELECT id, question, answer FROM faqs", (err, results) => {
    if (err) {
      console.error("❌ Error fetching FAQs:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Chatbot entries route (departments + hotlines)
app.get("/api/chatbot", (req, res) => {
  db.query(
    "SELECT id, category, title, head, designation, contact FROM chatbot_entries",
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching chatbot entries:", err.message);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

// ✅ FAQs joined with hotline numbers
// This lets the frontend show only the FAQ question/answer (location),
// and when clicked, reply with the hotline number from chatbot_entries.
app.get("/api/faqs-with-hotlines", (req, res) => {
  const sql = `
    SELECT f.id, f.question, f.answer, c.contact
    FROM faqs f
    LEFT JOIN chatbot_entries c
    ON f.answer = c.title
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching FAQs with hotlines:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});