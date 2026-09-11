import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { logInfo } from './config/logger.js';
import authRoutes from './routes/auth.js';
import trendRoutes from './routes/trends.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import { startTrendRefreshCron } from './cron/trendRefresh.js';
import { startDailyDigestCron } from './cron/dailyDigest.js';
import { fetchAllTrends } from './services/trendFetcher.js';

const app = express();

const allowedOrigins = config.CLIENT_URL.split(',').map(url => url.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

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
  await fetchAllTrends();
  app.listen(config.PORT, () => {
    logInfo(`Server running on http://localhost:${config.PORT}`);
  });
}

start();
