import { Router, Router as ExpressRouter } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase, supabaseAdmin } from '../services/supabase.js';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { logError, logWarn } from '../config/logger.js';
import { sendMagicLinkEmail } from '../services/emailSender.js';

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

    // Create user in Supabase (bypasses email provider restrictions)
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if (createError && createError.message !== 'User already exists') {
      logWarn(`MAGIC LINK create user failed: ${createError.message}`);
      res.status(400).json({ error: createError.message });
      return;
    }

    // Generate magic link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${config.CLIENT_URL}/set-password`,
      },
    });

    if (error) {
      logWarn(`MAGIC LINK generate failed: ${error.message}`);
      res.status(400).json({ error: error.message });
      return;
    }

    const magicLink = data.properties.action_link;

    // Save to MongoDB
    await User.findOneAndUpdate({ email }, { email }, { upsert: true, new: true });

    if (config.NODE_ENV === 'development') {
      // Dev: log to console
      console.log('');
      console.log('\x1b[36m🔗 MAGIC LINK (dev mode):\x1b[0m');
      console.log(`\x1b[1m${magicLink}\x1b[0m`);
      console.log('');
      res.json({ message: 'Magic link generated', magicLink });
    } else {
      // Prod: send via email
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

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(400).json({ error: 'Invalid or expired magic link' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const dbUser = await User.findOneAndUpdate(
      { email: user.email },
      { supabaseId: user.id, passwordHash },
      { new: true }
    );

    if (!dbUser) {
      logError(`SET PASSWORD: DB write failed for ${user.email}`);
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    // Set password on Supabase user (user was created without password)
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
    });

    if (updateError) {
      logError(`SET PASSWORD: Supabase update failed for ${user.email}`);
      res.status(500).json({ error: 'Failed to set password' });
      return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (sessionError) {
      logError(`SET PASSWORD: session creation failed for ${user.email}`);
      res.status(500).json({ error: 'Failed to create session' });
      return;
    }

    res.json({
      user: { id: dbUser._id, email: dbUser.email, preferences: dbUser.preferences, voiceProfile: dbUser.voiceProfile },
      token: sessionData.session.access_token,
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

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        logError(`LOGIN: Supabase signUp failed for ${email}`);
        res.status(500).json({ error: 'Failed to create session' });
        return;
      }
      res.json({
        user: { id: dbUser._id, email: dbUser.email, preferences: dbUser.preferences, voiceProfile: dbUser.voiceProfile },
        token: signUpData.session?.access_token,
      });
      return;
    }

    res.json({
      user: { id: dbUser._id, email: dbUser.email, preferences: dbUser.preferences, voiceProfile: dbUser.voiceProfile },
      token: data.session.access_token,
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
router.get('/session', requireAuth, (req: AuthRequest, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({
    user: { id: user._id, email: user.email, preferences: user.preferences, voiceProfile: user.voiceProfile },
  });
});

// POST /api/auth/logout — Sign out
router.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    await supabaseAdmin.auth.admin.signOut(token);
  }
  res.json({ message: 'Logged out' });
});

export default router;
