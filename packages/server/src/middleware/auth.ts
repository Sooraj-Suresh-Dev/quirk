import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.js';
import { User, IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const dbUser = await User.findOne({ supabaseId: user.id });
    if (!dbUser) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = dbUser;
    req.userId = dbUser._id.toString();
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
