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

// ✅ Get all announcements (with admin + user info)
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

// ✅ Get single announcement by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.content, a.date_posted,
              ad.position AS admin_position,
              u.first_name, u.last_name
       FROM announcements a
       LEFT JOIN admins ad ON a.admin_id = ad.admin_id
       LEFT JOIN users u ON ad.user_id = u.id
       WHERE a.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch single announcement error:", err);
    res.status(500).json({ error: "Failed to fetch announcement" });
  }
});

// ✅ Add new announcement
router.post("/add", async (req, res) => {
  const { title, content, admin_id } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    await pool.query(
      "INSERT INTO announcements (title, content, admin_id) VALUES (?, ?, ?)",
      [title, content, admin_id ?? null]
    );
    res.json({ message: "Announcement added successfully!" });
  } catch (err) {
    console.error("Add announcement error:", err);
    res.status(500).json({ error: "Failed to add announcement" });
  }
});

// ✅ Update announcement
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    const [result] = await pool.query(
      "UPDATE announcements SET title = ?, content = ? WHERE id = ?",
      [title, content, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.json({ message: "Announcement updated successfully!" });
  } catch (err) {
    console.error("Update announcement error:", err);
    res.status(500).json({ error: "Failed to update announcement" });
  }
});

// ✅ Delete announcement
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM announcements WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.json({ message: "Announcement deleted successfully!" });
  } catch (err) {
    console.error("Delete announcement error:", err);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

export default router;
