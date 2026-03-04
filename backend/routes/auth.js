import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// 🔑 Hardcoded admin secret key (only checked in backend)
const ADMIN_SECRET = "SuperSecureAdmin123";

// ---------------- REGISTER ----------------
router.post('/register', async (req, res) => {
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
    adminSecret // frontend sends this only if role === "admin"
  } = req.body;

  try {
    // ✅ If role is admin, require correct secret key
    if (role === "admin") {
      if (adminSecret !== ADMIN_SECRET) {
        return res.status(403).json({ error: "Invalid admin secret key" });
      }
    }

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
        position
      ]
    );

    res.json({ message: 'Registration successful!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Return full user object so frontend can store userId
    res.json({
      message: 'Login successful!',
      token,
      role: user.role,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ---------------- PROFILE ----------------
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, email, age, phone, position 
       FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    res.json({
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      phone: user.phone,
      position: user.position
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ---------------- SEND RESET CODE ----------------
router.post('/send-reset-code', async (req, res) => {
  const { email } = req.body;
  const resetCode = crypto.randomBytes(3).toString('hex'); // 6-char code

  try {
    await pool.query(
      `INSERT INTO password_resets (email, reset_code, created_at) VALUES (?, ?, NOW())`,
      [email, resetCode]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Barangay 633" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your reset code is: ${resetCode}`
    });

    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    console.error('Reset code error:', err);
    res.status(500).json({ error: "Error sending reset code" });
  }
});

// ---------------- VERIFY RESET CODE ----------------
router.post('/verify-reset-code', async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM password_resets WHERE email = ? AND reset_code = ? ORDER BY created_at DESC LIMIT 1`,
      [email, resetCode]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    res.json({ message: "Reset code verified" });
  } catch (err) {
    console.error("Verify code error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// ---------------- RESET PASSWORD ----------------
router.post('/reset-password', async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM password_resets WHERE email = ? AND reset_code = ? ORDER BY created_at DESC LIMIT 1`,
      [email, resetCode]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email]);

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Password reset failed" });
  }
});

export default router;