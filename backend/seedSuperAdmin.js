// seedSuperAdmin.js
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "", // ✅ allow empty password
  database: process.env.DB_NAME,
});

async function seedSuperAdmin() {
  try {
    const email = "superadmin@barangay.com";
    const plainPassword = "SuperAdminPassword123!"; // ✅ choose a secure password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await pool.query(
      `INSERT INTO users 
       (first_name, last_name, email, password, role, position) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ["System", "Admin", email, hashedPassword, "superadmin", "System Super Admin"]
    );

    console.log("✅ Superadmin account seeded successfully!");
    console.log(`Login with email: ${email}`);
    console.log(`Password: ${plainPassword}`);
  } catch (err) {
    console.error("❌ Error seeding superadmin:", err.message);
  } finally {
    pool.end();
  }
}

seedSuperAdmin();