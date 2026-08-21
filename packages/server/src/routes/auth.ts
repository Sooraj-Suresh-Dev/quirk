import { Router, Router as ExpressRouter } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '../services/supabase.js';
import { User } from '../models/User.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router: ExpressRouter = Router();

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

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // Create user if not exists
    await User.findOneAndUpdate(
      { email },
      { email },
      { upsert: true, new: true }
    );

    res.json({ message: 'Magic link sent' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to send magic link' });
  }
});

// POST /api/auth/set-password — Set password after magic link verification
router.post('/set-password', async (req, res) => {
  try {
    const { token, password } = setPasswordSchema.parse(req.body);

    // Verify magic link token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(400).json({ error: 'Invalid or expired magic link' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update or create user with password
    const dbUser = await User.findOneAndUpdate(
      { email: user.email },
      {
        supabaseId: user.id,
        passwordHash,
      },
      { new: true }
    );

    if (!dbUser) {
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    // Create a session token
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (sessionError) {
      res.status(500).json({ error: 'Failed to create session' });
      return;
    }

    res.json({
      user: {
        id: dbUser._id,
        email: dbUser.email,
        preferences: dbUser.preferences,
        voiceProfile: dbUser.voiceProfile,
      },
      token: sessionData.session.access_token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to set password' });
  }
});

// POST /api/auth/login — Email + password login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const dbUser = await User.findOne({ email });
    if (!dbUser || !dbUser.passwordHash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, dbUser.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Sign in with Supabase to get session
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If Supabase auth fails, create a new session
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        res.status(500).json({ error: 'Failed to create session' });
        return;
      }

      res.json({
        user: {
          id: dbUser._id,
          email: dbUser.email,
          preferences: dbUser.preferences,
          voiceProfile: dbUser.voiceProfile,
        },
        token: signUpData.session?.access_token,
      });
      return;
    }

    res.json({
      user: {
        id: dbUser._id,
        email: dbUser.email,
        preferences: dbUser.preferences,
        voiceProfile: dbUser.voiceProfile,
      },
      token: data.session.access_token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/session — Get current session
router.get('/session', requireAuth, (req: AuthRequest, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  res.json({
    user: {
      id: user._id,
      email: user.email,
      preferences: user.preferences,
      voiceProfile: user.voiceProfile,
    },
  });
});

// POST /api/auth/logout — Sign out
router.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    await supabase.auth.admin.signOut(token);
  }
  res.json({ message: 'Logged out' });
});

export default router;
