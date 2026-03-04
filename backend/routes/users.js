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

// ✅ Add User
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
    age,
    phone,
    position,
  } = req.body;

  // Gmail validation
  if (!email || !email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({ error: "Email must be a Gmail address." });
  }

  try {
    await pool.query(
      `INSERT INTO users 
        (first_name, last_name, email, password, role, address, gender, birthdate, civil_status, religion, age, phone, position) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        password,   // ⚠️ plain text here — for production, hash with bcrypt
        role,
        address,
        gender,
        birthdate,
        civilStatus,
        religion,
        age,
        phone,
        position,
      ]
    );

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
      SELECT id, first_name, last_name, email, role, address, gender, birthdate, civil_status, religion, age, phone, position
      FROM users
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
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins,
        SUM(CASE WHEN role = 'resident' THEN 1 ELSE 0 END) AS residents,
        SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS male,
        SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS female
      FROM users
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("User count error:", err);
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

// ✅ Update user by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    role,
    address,
    gender,
    civilStatus,
    religion,
    age,
    phone,
    position,
  } = req.body;

  // Gmail validation
  if (!email || !email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({ error: "Email must be a Gmail address." });
  }

  try {
    await pool.query(
      `UPDATE users 
       SET first_name=?, last_name=?, email=?, role=?, address=?, gender=?, civil_status=?, religion=?, age=?, phone=?, position=? 
       WHERE id=?`,
      [
        firstName,
        lastName,
        email,
        role,
        address,
        gender,
        civilStatus,
        religion,
        age,
        phone,
        position,
        id,
      ]
    );

    res.json({ message: "User updated successfully!" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update user" });
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