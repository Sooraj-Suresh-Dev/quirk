import { Router, Router as ExpressRouter, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { MagicLink } from '../models/MagicLink.js';
import { Voice } from '../models/Voice.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { logError, logWarn } from '../config/logger.js';
import { sendMagicLinkEmail } from '../services/emailSender.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/token.js';

const router: ExpressRouter = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: (config.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
};

function setAuthCookies(res: Response, userId: string, email: string) {
  const accessToken = signAccessToken({ userId, email });
  const refreshToken = signRefreshToken({ userId, email });

  res.cookie('token', accessToken, COOKIE_OPTIONS);
  res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, path: '/api/auth/refresh' });
}

const magicLinkSchema = z.object({
  email: z.string().email(),
});

const setPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/magic-link — Send magic link email
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = magicLinkSchema.parse(req.body);

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await MagicLink.create({ token, email, expiresAt });

    const magicLink = `${config.CLIENT_URL}/set-password?token=${token}`;

    if (config.NODE_ENV === 'development') {
      console.log('');
      console.log('\x1b[36m🔗 MAGIC LINK (dev mode):\x1b[0m');
      console.log(`\x1b[1m${magicLink}\x1b[0m`);
      console.log('');
      res.json({ message: 'Magic link generated', magicLink });
    } else {
      const sent = await sendMagicLinkEmail(email, magicLink);
      if (!sent) {
        res.status(500).json({ error: 'Failed to send magic link email' });
        return;
      }
      res.json({ message: 'Magic link sent' });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    logError('MAGIC LINK failed', { err });
    res.status(500).json({ error: 'Failed to send magic link' });
  }
});

// POST /api/auth/set-password — Set password after magic link verification
router.post('/set-password', async (req, res) => {
  try {
    const { token, password } = setPasswordSchema.parse(req.body);

    const magicLink = await MagicLink.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!magicLink) {
      res.status(400).json({ error: 'Invalid or expired magic link' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const dbUser = await User.findOneAndUpdate(
      { email: magicLink.email },
      { passwordHash },
      { new: true, upsert: true }
    );

    if (!dbUser) {
      logError(`SET PASSWORD: DB write failed for ${magicLink.email}`);
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    magicLink.used = true;
    await magicLink.save();

    setAuthCookies(res, dbUser._id.toString(), dbUser.email);

    const voice = await Voice.findOne({ userId: dbUser._id });

    res.json({
      user: { id: dbUser._id, email: dbUser.email, preferences: dbUser.preferences },
      voice: voice ? { samples: voice.samples, profile: voice.profile, isActive: voice.isActive, createdAt: voice.createdAt, updatedAt: voice.updatedAt } : null,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    logError('SET PASSWORD failed', { err });
    res.status(500).json({ error: 'Failed to set password' });
  }
});

// POST /api/auth/login — Email + password login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const dbUser = await User.findOne({ email });
    if (!dbUser || !dbUser.passwordHash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = await bcrypt.compare(password, dbUser.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    setAuthCookies(res, dbUser._id.toString(), dbUser.email);

    const voice = await Voice.findOne({ userId: dbUser._id });

    res.json({
      user: { id: dbUser._id, email: dbUser.email, preferences: dbUser.preferences },
      voice: voice ? { samples: voice.samples, profile: voice.profile, isActive: voice.isActive, createdAt: voice.createdAt, updatedAt: voice.updatedAt } : null,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    logError('LOGIN failed', { err });
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/session — Get current session
router.get('/session', requireAuth, async (req: AuthRequest, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const voice = await Voice.findOne({ userId: user._id });

  res.json({
    user: { id: user._id, email: user.email, preferences: user.preferences },
    voice: voice ? { samples: voice.samples, profile: voice.profile, isActive: voice.isActive, createdAt: voice.createdAt, updatedAt: voice.updatedAt } : null,
  });
});

// POST /api/auth/refresh — Refresh access token
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: 'No refresh token' });
    return;
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    res.status(401).json({ error: 'Invalid refresh token' });
    return;
  }

  const dbUser = await User.findById(payload.userId);
  if (!dbUser) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  setAuthCookies(res, dbUser._id.toString(), dbUser.email);

  res.json({ message: 'Token refreshed' });
});

// POST /api/auth/logout — Sign out
router.post('/logout', (_req, res) => {
  const clearOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: (config.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  };
  res.clearCookie('token', { ...clearOptions, path: '/' });
  res.clearCookie('refreshToken', { ...clearOptions, path: '/api/auth/refresh' });
  res.json({ message: 'Logged out' });
});

export default router;
