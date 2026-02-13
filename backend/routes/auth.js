import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const router = express.Router();

// MySQL connection pool using env variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// REGISTER route
router.post('/register', async (req, res) => {
  const {
    firstName, middleName, lastName, address,
    gender, birthdate, civilStatus, religion,
    username, password
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO residents 
       (first_name, middle_name, last_name, address, gender, birthdate, civil_status, religion, username, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, middleName, lastName, address, gender, birthdate, civilStatus, religion, username, hashedPassword]
    );

    res.json({ message: 'Registration successful!' });
  } catch (err) {
    console.error("Registration error:", err); // ✅ shows actual MySQL error
    res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(`SELECT * FROM residents WHERE username = ?`, [username]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful!', user });
  } catch (err) {
    console.error("Login error:", err); // ✅ shows actual MySQL error
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;