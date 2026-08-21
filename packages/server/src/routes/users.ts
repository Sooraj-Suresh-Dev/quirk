import { Router, Router as ExpressRouter } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { analyzeVoice } from '../services/voiceAnalyzer.js';

const router: ExpressRouter = Router();

const voiceSchema = z.object({
  samples: z.array(z.string().min(10)).min(3).max(5),
});

const preferencesSchema = z.object({
  sources: z.array(z.string()).optional(),
  digestTime: z.string().optional(),
  emailDigest: z.boolean().optional(),
  openaiKey: z.string().optional(),
  anthropicKey: z.string().optional(),
});

// GET /api/users/profile — Get user profile + voice
router.get('/profile', requireAuth, (req: AuthRequest, res) => {
  const user = req.user;
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    user: {
      id: user._id,
      email: user.email,
      voiceProfile: user.voiceProfile,
      voiceSamples: user.voiceSamples,
      preferences: user.preferences,
    },
  });
});

// PUT /api/users/voice — Save voice samples and analyze
router.put('/voice', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { samples } = voiceSchema.parse(req.body);

    const voiceProfile = await analyzeVoice(samples);

    const user = await import('../models/User.js').then(m =>
      m.User.findByIdAndUpdate(
        req.userId,
        { voiceSamples: samples, voiceProfile },
        { new: true }
      )
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      voiceProfile: user.voiceProfile,
      message: 'Voice profile updated',
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to analyze voice' });
  }
});

// PUT /api/users/preferences — Update preferences
router.put('/preferences', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updates = preferencesSchema.parse(req.body);

    const user = await import('../models/User.js').then(m =>
      m.User.findByIdAndUpdate(
        req.userId,
        { $set: { preferences: updates } },
        { new: true }
      )
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      preferences: user.preferences,
      message: 'Preferences updated',
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;
