import { Router, Router as ExpressRouter } from 'express';
import { Trend } from '../models/Trend.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router: ExpressRouter = Router();

// GET /api/trends — List cached trends (public)
router.get('/', async (_req, res) => {
  try {
    const trends = await Trend.find({ expiresAt: { $gt: new Date() } })
      .sort({ fetchedAt: -1 })
      .limit(50);

    res.json({ trends });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// POST /api/trends/refresh — Force-refresh trends (auth required)
router.post('/refresh', requireAuth, async (_req: AuthRequest, res) => {
  try {
    // Trigger trend refresh - will be implemented in trendFetcher
    res.json({ message: 'Trend refresh triggered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to refresh trends' });
  }
});

export default router;
