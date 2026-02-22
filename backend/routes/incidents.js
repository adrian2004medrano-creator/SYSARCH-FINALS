import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Resident submits complaint
router.post("/report", async (req, res) => {
  const { firstName, lastName, email, contact, incidentDate, incidentType, location, details } = req.body;

  try {
    await pool.query(
      `INSERT INTO incidents (first_name, last_name, email, contact, date_time, type, location, details, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, contact, incidentDate, incidentType, location, details, "Open"]
    );

    res.json({ message: "Incident reported successfully!" });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Failed to submit incident report" });
  }
});

// ✅ Admin fetches all complaints (include details + complainant name)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        date_time,
        type,
        location,
        CONCAT(first_name, ' ', last_name) AS complainant,
        details,
        status
      FROM incidents
      ORDER BY date_time DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// ✅ Admin updates complaint status
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE incidents SET status = ? WHERE id = ?", [status, id]);
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
    await pool.query("DELETE FROM incidents WHERE id = ?", [id]);
    res.json({ message: "Incident deleted successfully!" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete incident" });
  }
});

export default router;