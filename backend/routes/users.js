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

// ✅ Add User (Admin only)
router.post("/add", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    address,
    gender,
    birthdate,
    civilStatus,
    religion,
    position,
  } = req.body;

  try {
    // Insert into users table
    const [userResult] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, password, role]
    );

    const userId = userResult.insertId;

    if (role === "resident") {
      await pool.query(
        `INSERT INTO residents (user_id, address, gender, birthdate, civil_status, religion) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, address, gender, birthdate, civilStatus, religion]
      );
    } else if (role === "admin") {
      await pool.query(
        `INSERT INTO admins (user_id, position) VALUES (?, ?)`,
        [userId, position]
      );
    }

    res.json({ message: "User added successfully!" });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.role,
             r.address, r.gender, r.birthdate, r.civil_status, r.religion,
             a.position
      FROM users u
      LEFT JOIN residents r ON u.id = r.user_id
      LEFT JOIN admins a ON u.id = a.user_id
    `);

    res.json(rows);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Get total users count (with breakdown by role and gender)
router.get("/count", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN u.role = 'admin' THEN 1 ELSE 0 END) AS admins,
        SUM(CASE WHEN u.role = 'resident' THEN 1 ELSE 0 END) AS residents,
        SUM(CASE WHEN r.gender = 'Male' THEN 1 ELSE 0 END) AS male,
        SUM(CASE WHEN r.gender = 'Female' THEN 1 ELSE 0 END) AS female
      FROM users u
      LEFT JOIN residents r ON u.id = r.user_id
    `);

    res.json(rows[0]); 
    // Example response: { total: 11, admins: 2, residents: 9, male: 5, female: 4 }
  } catch (err) {
    console.error("User count error:", err);
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

// ✅ Delete user by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;