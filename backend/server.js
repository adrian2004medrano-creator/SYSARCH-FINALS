import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load .env FIRST before anything else
dotenv.config();

// Debug: confirm env values are loaded
console.log("Loaded ENV:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

import authRoutes from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});