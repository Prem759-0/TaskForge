import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import analyticsRoutes from './routes/analytics.js';
import categoryRoutes from './routes/categories.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let connectionPromise;

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'TaskForge' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/categories', categoryRoutes);

if (process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '../../dist/index.html')));
}

export async function connectDatabase() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  connectionPromise ||= mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  await connectionPromise;
  return mongoose.connection;
}

export default app;
