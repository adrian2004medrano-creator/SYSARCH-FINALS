import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Resident submits feedback (must be tied to a valid user_id)
router.post("/submit", async (req, res) => {
  const { user_id, rating, message } = req.body;

  // Validate required fields
  if (!user_id || !rating || !message) {
    return res.status(400).json({ error: "user_id, rating, and message are required." });
  }

  try {
    await pool.query(
      `INSERT INTO feedback (user_id, rating, message) VALUES (?, ?, ?)`,
      [user_id, rating, message]
    );
    res.json({ message: "Feedback submitted successfully!" });
  } catch (err) {
    console.error("Feedback submission error:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// ✅ Admin fetches all feedback with user details (always from users table)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        f.id, 
        f.user_id, 
        CONCAT(u.first_name, ' ', u.last_name) AS name, 
        u.email, 
        f.rating, 
        f.message, 
        f.date_submitted
      FROM feedback f
      INNER JOIN users u ON f.user_id = u.id
      ORDER BY f.date_submitted DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Fetch feedback error:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// ✅ Admin deletes feedback
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM feedback WHERE id = ?", [id]);
    res.json({ message: "Feedback deleted successfully!" });
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

export default router;