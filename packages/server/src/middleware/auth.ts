import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/token.js';
import { User, IUser } from '../models/User.js';
import { logWarn } from '../config/logger.js';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  const dbUser = await User.findById(payload.userId);
  if (!dbUser) {
    logWarn(`AUTH: user not found in DB at ${req.path}`);
    res.status(401).json({ error: 'User not found' });
    return;
  }

  req.user = dbUser;
  req.userId = dbUser._id.toString();
  next();
}
