import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { logWarn } from '../config/logger.js';

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const AUTH_RATE_LIMIT = 5;
const AUTH_RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

export function authRateLimiter(req: Request, res: Response, next: NextFunction) {
  if (config.NODE_ENV === 'test' || process.env.CI) {
    next();
    return;
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + AUTH_RATE_WINDOW });
    next();
    return;
  }

  if (entry.count >= AUTH_RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    logWarn(`AUTH RATE LIMIT exceeded for IP ${ip} (${entry.count}/${AUTH_RATE_LIMIT})`);
    res.status(429).json({
      error: 'Too many attempts. Please try again later.',
      retryAfter,
    });
    return;
  }

  entry.count++;
  next();
}
