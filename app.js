import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandling.js';

dotenv.config();

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Replace '*' with your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Parse JSON requests
app.use(express.json());

// API routes
app.use('/api/v1', routes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
