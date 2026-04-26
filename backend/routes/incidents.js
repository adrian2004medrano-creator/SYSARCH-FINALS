import express from "express";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Resident submits complaint
router.post("/report", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id;
    const { incidentType, location, details, risk, status } = req.body;

    if (!incidentType || !location || !details) {
      return res.status(400).json({ error: "incidentType, location, and details are required" });
    }

    await pool.query(
      `INSERT INTO incidents (user_id, type, location, details, risk, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, incidentType, location, details, risk || "Minor", status || "Open"]
    );

    res.json({ message: "Incident reported successfully!" });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Failed to submit incident report" });
  }
});

// ✅ FIXED: Role-based incident fetching
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id;
    const role = decoded.role;

    let query;
    let params;

    // ✅ RESIDENT: Only their own incidents
    if (role === "resident") {
      query = `
        SELECT 
          i.id,
          i.date_time,
          i.type,
          i.location,
          i.details,
          i.risk,
          i.status,
          CONCAT(u.first_name, ' ', u.last_name) AS complainant,
          u.email,
          u.phone AS contact
        FROM incidents i
        JOIN users u ON i.user_id = u.id
        WHERE i.user_id = ?
        ORDER BY i.date_time DESC
      `;
      params = [userId];
    } 
    // ✅ ADMIN/SUPERADMIN: All incidents
    else {
      query = `
        SELECT 
          i.id,
          i.date_time,
          i.type,
          i.location,
          i.details,
          i.risk,
          i.status,
          CONCAT(u.first_name, ' ', u.last_name) AS complainant,
          u.email,
          u.phone AS contact
        FROM incidents i
        JOIN users u ON i.user_id = u.id
        ORDER BY i.date_time DESC
      `;
      params = [];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// ✅ Get incident statistics (for dashboard charts) - Admin only
router.get("/count", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // ✅ Only admins/superadmins can see stats
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        DATE_FORMAT(date_time, '%b') AS month,
        COUNT(*) AS count
      FROM incidents
      GROUP BY MONTH(date_time)
      ORDER BY MONTH(date_time)
    `);

    const total = rows.reduce((sum, r) => sum + r.count, 0);

    res.json({
      total,
      monthly: rows.map((r) => ({
        month: r.month,
        count: r.count,
      })),
    });
  } catch (err) {
    console.error("Incident stats error:", err);
    res.status(500).json({ error: "Failed to fetch incident stats" });
  }
});

// ✅ Admin updates complaint status
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["Open", "In Progress", "Solved"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const [result] = await pool.query("UPDATE incidents SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }
    res.json({ message: "Incident status updated!" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update incident" });
  }
});

// ✅ Admin deletes complaint
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM incidents WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }
    res.json({ message: "Incident deleted successfully!" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete incident" });
  }
});

export default router;