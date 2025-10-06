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
import adminRoutes from './routes/admin.routes.js';
import sponsorsRoutes from './routes/sponsors.routes.js';
import participantsRoutes from './routes/participants.routes.js';
import proposalsRoutes from './routes/proposals.routes.js';
import studiesRoutes from './routes/studies.routes.js';
import sitesRoutes from './routes/sites.routes.js';
import filesRoutes from './routes/files.routes.js';
import { User } from './models/User.js';

const app = express();

// Security & basics
app.use(helmet());
app.use(cors({ 
  origin: [
    'https://adetorok.github.io', // GitHub Pages
    'http://localhost:5173', // Local development
    'http://localhost:3000'  // Alternative local port
  ], 
  credentials: true 
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/studies', studiesRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/files', filesRoutes);

// Errors
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trust').then(async () => {
  await ensureDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`TRUST API running on http://localhost:${PORT}`);
  });
});

async function ensureDefaultAdmin() {
  try {
    const email = process.env.DEMO_ADMIN_EMAIL || 'admin@trust.com';
    const password = process.env.DEMO_ADMIN_PASSWORD || 'admin123';
    const existing = await User.findOne({ email });
    if (!existing) {
      const passwordHash = await User.hashPassword(password);
      await User.create({
        email,
        name: 'Admin User',
        passwordHash,
        role: 'admin',
        isActive: true
      });
      console.log(`Bootstrap admin created: ${email}`);
    } else {
      console.log(`Bootstrap admin exists: ${email}`);
    }
  } catch (err) {
    console.error('Bootstrap admin error:', err?.message || err);
  }
}


