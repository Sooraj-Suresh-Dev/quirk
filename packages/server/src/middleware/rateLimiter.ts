import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

const generationCounts = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

export function rateLimiter(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const now = Date.now();
  const entry = generationCounts.get(userId);

  if (!entry || now > entry.resetAt) {
    generationCounts.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    next();
    return;
  }

  if (entry.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter,
    });
    return;
  }

  entry.count++;
  next();
}
