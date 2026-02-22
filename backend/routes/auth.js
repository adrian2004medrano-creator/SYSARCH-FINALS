import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// REGISTER route
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
    position
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users
    const [userResult] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, hashedPassword, role]
    );

    const userId = userResult.insertId;

    // Insert into residents or admins depending on role
    if (role === 'resident') {
      await pool.query(
        `INSERT INTO residents (user_id, address, gender, birthdate, civil_status, religion)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, address, gender, birthdate, civilStatus, religion]
      );
    } else if (role === 'admin') {
      await pool.query(
        `INSERT INTO admins (user_id, position)
         VALUES (?, ?)`,
        [userId, position]
      );
    }

    res.json({ message: 'Registration successful!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look up user by email
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = rows[0];

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT with role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Return role so frontend can redirect properly
    res.json({
      message: 'Login successful!',
      token,
      role: user.role
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;