import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import inquiriesRoutes from './routes/inquiriesRoutes.js';
import { sql } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) 
  : '*';

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await sql`SELECT NOW() as server_time;`;
    res.status(200).json({
      status: 'online',
      message: 'Smart Civil Engineering Works Backend API is healthy',
      database: 'Neon PostgreSQL connected',
      db_time: result[0]?.server_time,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'degraded',
      message: 'Database connection failed',
      error: err.message
    });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/inquiries', inquiriesRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Civil Engineering Works Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      projects: '/api/projects',
      inquiries: '/api/inquiries'
    }
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Smart Civil Engineering Works - Backend API Server`);
  console.log(`Running on: http://localhost:${PORT}`);
  console.log(`Connected DB: Neon PostgreSQL`);
  console.log(`====================================================`);
});

export default app;
