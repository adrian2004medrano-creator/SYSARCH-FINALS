import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";   // ✅ For password hashing
import jwt from "jsonwebtoken"; // ✅ For login token

const router = express.Router();

// ✅ MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Add User (supports superadmin, admin, resident)
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

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Gmail validation
  if (!email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({ error: "Email must be a Gmail address." });
  }

  try {
    // ✅ Check if email already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users 
        (first_name, last_name, email, password, role, address, gender, birthdate, civil_status, religion, age, phone, position) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
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

// ✅ Login route (returns role for redirect)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// ✅ Get logged-in user info
router.get("/me", async (req, res) => {
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
    const [rows] = await pool.query(
      "SELECT id, first_name, last_name, email, phone FROM users WHERE id = ?",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      contact: user.phone,
    });
  } catch (err) {
    console.error("Fetch user info error:", err);
    res.status(500).json({ error: "Failed to fetch user info" });
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
        SUM(CASE WHEN role = 'superadmin' THEN 1 ELSE 0 END) AS superadmins,
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

  if (!email || !email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({ error: "Email must be a Gmail address." });
  }

  try {
    const [result] = await pool.query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, email = ?, role = ?, address = ?, gender = ?, civil_status = ?, religion = ?, age = ?, phone = ?, position = ?
       WHERE id = ?`,
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

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

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
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
