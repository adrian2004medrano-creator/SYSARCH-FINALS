import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Get all announcements (with admin info)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.content, a.date_posted,
              ad.position AS admin_position,
              u.first_name, u.last_name
       FROM announcements a
       LEFT JOIN admins ad ON a.admin_id = ad.admin_id
       LEFT JOIN users u ON ad.user_id = u.id
       ORDER BY a.date_posted DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch announcements error:", err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// ✅ Add new announcement
router.post("/add", async (req, res) => {
  const { title, content, admin_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO announcements (title, content, admin_id) VALUES (?, ?, ?)",
      [title, content, admin_id ?? null] // ✅ ensures NULL if not provided
    );
    res.json({ message: "Announcement added successfully!" });
  } catch (err) {
    console.error("Add announcement error:", err);
    res.status(500).json({ error: "Failed to add announcement" });
  }
});

// ✅ Delete announcement
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM announcements WHERE id = ?", [id]);
    res.json({ message: "Announcement deleted successfully!" });
  } catch (err) {
    console.error("Delete announcement error:", err);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

export default router;