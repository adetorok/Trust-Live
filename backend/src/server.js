import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Security & basics
app.use(helmet());
app.use(cors({ origin: process.env.BASE_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Health
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/api/auth', authRoutes);

// Errors
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trust').then(() => {
  app.listen(PORT, () => {
    console.log(`TRUST API running on http://localhost:${PORT}`);
  });
});


