import { Router, Router as ExpressRouter } from 'express';
import { Trend } from '../models/Trend.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { fetchAllTrends } from '../services/trendFetcher.js';

const router: ExpressRouter = Router();

// GET /api/trends — List cached trends (public, paginated)
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = parseInt(req.query.offset as string) || 0;
    const source = req.query.source as string | undefined;
    const search = req.query.search as string | undefined;

    const query: Record<string, unknown> = { expiresAt: { $gt: new Date() } };
    const validSources = ['github', 'producthunt', 'hackernews'];
    if (source) {
      const sources = source.split(',').filter((s: string) => validSources.includes(s));
      if (sources.length === 1) {
        query.source = sources[0];
      } else if (sources.length > 1) {
        query.source = { $in: sources };
      }
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const [trends, total] = await Promise.all([
      Trend.find(query)
        .sort({ fetchedAt: -1 })
        .skip(offset)
        .limit(limit),
      Trend.countDocuments(query),
    ]);

    res.json({ trends, total, hasMore: offset + limit < total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// GET /api/trends/:id — Get single trend by ID
router.get('/:id', async (req, res) => {
  try {
    const trend = await Trend.findById(req.params.id);
    if (!trend) {
      res.status(404).json({ error: 'Trend not found' });
      return;
    }
    res.json({ trend });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trend' });
  }
});

// POST /api/trends/refresh — Force-refresh trends (auth required)
router.post('/refresh', requireAuth, async (_req: AuthRequest, res) => {
  try {
    await fetchAllTrends();
    res.json({ message: 'Trend refresh triggered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to refresh trends' });
  }
});

export default router;
