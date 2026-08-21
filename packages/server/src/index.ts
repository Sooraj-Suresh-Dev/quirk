import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import trendRoutes from './routes/trends.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import { startTrendRefreshCron } from './cron/trendRefresh.js';
import { startDailyDigestCron } from './cron/dailyDigest.js';

const app = express();

app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();
  startTrendRefreshCron();
  startDailyDigestCron();

  app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
  });
}

start();
