import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

// ✅ MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Resident submits feedback (must be tied to a valid user_id)
router.post("/submit", async (req, res) => {
  const { user_id, rating, message } = req.body;

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

// ✅ Admin fetches all feedback with user details
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

// ✅ Get feedback statistics (for dashboard charts)
router.get("/count", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) AS positive,
        SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END) AS negative
      FROM feedback
    `);

    const stats = rows[0] || { total: 0, positive: 0, negative: 0 };
    res.json(stats);
  } catch (err) {
    console.error("Feedback stats error:", err);
    res.status(500).json({ error: "Failed to fetch feedback stats" });
  }
});

// ✅ Admin deletes feedback
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM feedback WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted successfully!" });
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

export default router;
