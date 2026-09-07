import { Router, Router as ExpressRouter } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { analyzeVoice, VoiceProfile } from '../services/voiceAnalyzer.js';
import { Voice } from '../models/Voice.js';
import { User } from '../models/User.js';
import { logError } from '../config/logger.js';

const router: ExpressRouter = Router();

const voiceSamplesSchema = z.object({
  samples: z.array(z.string().min(10)).min(3).max(5),
});

const saveVoiceSchema = z.object({
  samples: z.array(z.string().min(10)).min(3).max(5),
  profile: z.object({
    tone: z.object({
      primary: z.string(),
      secondary: z.array(z.string()),
      confidence: z.number(),
    }),
    writingStyle: z.object({
      description: z.string(),
      avgSentenceLength: z.number(),
      avgParagraphLength: z.number(),
    }),
    personality: z.object({
      traits: z.array(z.string()),
      description: z.string(),
    }),
    structure: z.object({
      description: z.string(),
      pattern: z.array(z.string()),
    }),
    engagement: z.object({
      cta: z.enum(['None', 'Soft', 'Direct']),
      questions: z.enum(['None', 'Rare', 'Occasional', 'Frequent']),
      emoji: z.enum(['None', 'Low', 'Medium', 'High']),
      emojiFrequency: z.number(),
    }),
    signaturePatterns: z.array(z.string()),
    brandSummary: z.string(),
    trainingQuality: z.object({
      score: z.number(),
      consistency: z.enum(['High', 'Medium', 'Low']),
      limitations: z.array(z.string()),
    }),
  }),
});

const preferencesSchema = z.object({
  sources: z.array(z.string()).optional(),
  digestTime: z.string().optional(),
  emailDigest: z.boolean().optional(),
  openaiKey: z.string().optional(),
  anthropicKey: z.string().optional(),
  preferredProvider: z.string().optional(),
  preferredModel: z.string().optional(),
  preferredTemperature: z.number().min(0.1).max(2.0).optional(),
});

// GET /api/users/voice — Get saved voice profile
router.get('/voice', requireAuth, async (req: AuthRequest, res) => {
  try {
    const voice = await Voice.findOne({ userId: req.userId });

    if (!voice) {
      res.json({ voice: null });
      return;
    }

    res.json({
      voice: {
        samples: voice.samples,
        profile: voice.profile,
        isActive: voice.isActive,
        createdAt: voice.createdAt,
        updatedAt: voice.updatedAt,
      },
    });
  } catch (err) {
    logError('GET voice failed', { err });
    res.status(500).json({ error: 'Failed to get voice profile' });
  }
});

// POST /api/users/voice/analyze — Analyze samples only (preview, NOT saved)
router.post('/voice/analyze', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { samples } = voiceSamplesSchema.parse(req.body);

    const truncatedSamples = samples.map(s =>
      s.length > 2000 ? s.slice(0, 2000) : s
    );

    const profile: VoiceProfile = await analyzeVoice(truncatedSamples);

    res.json({
      preview: {
        samples: truncatedSamples,
        profile,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const field = err.errors[0]?.path.join('.') || 'unknown';
      res.status(400).json({ error: `Invalid input in field: ${field}` });
      return;
    }
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    logError('Voice analyze failed', { error: errorMessage, stack: err });
    res.status(500).json({ error: `Failed to analyze voice: ${errorMessage}` });
  }
});

// POST /api/users/voice — Save analyzed voice profile
router.post('/voice', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { samples, profile } = saveVoiceSchema.parse(req.body);

    const truncatedSamples = samples.map(s =>
      s.length > 2000 ? s.slice(0, 2000) : s
    );

    const voice = await Voice.findOneAndUpdate(
      { userId: req.userId },
      {
        samples: truncatedSamples,
        profile,
        isActive: true,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      voice: {
        samples: voice.samples,
        profile: voice.profile,
        isActive: voice.isActive,
        createdAt: voice.createdAt,
        updatedAt: voice.updatedAt,
      },
      message: 'Voice profile saved',
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const field = err.errors[0]?.path.join('.') || 'unknown';
      res.status(400).json({ error: `Invalid input in field: ${field}` });
      return;
    }
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    logError('Voice save failed', { error: errorMessage, stack: err });
    res.status(500).json({ error: `Failed to save voice: ${errorMessage}` });
  }
});

// PATCH /api/users/voice/toggle — Toggle voice active/inactive
router.patch('/voice/toggle', requireAuth, async (req: AuthRequest, res) => {
  try {
    const voice = await Voice.findOne({ userId: req.userId });

    if (!voice) {
      res.status(404).json({ error: 'Voice profile not found' });
      return;
    }

    voice.isActive = !voice.isActive;
    voice.updatedAt = new Date();
    await voice.save();

    res.json({
      voice: {
        samples: voice.samples,
        profile: voice.profile,
        isActive: voice.isActive,
        createdAt: voice.createdAt,
        updatedAt: voice.updatedAt,
      },
      message: voice.isActive ? 'Voice activated' : 'Voice deactivated',
    });
  } catch (err) {
    logError('Voice toggle failed', { err });
    res.status(500).json({ error: 'Failed to toggle voice' });
  }
});

// DELETE /api/users/voice — Delete voice profile
router.delete('/voice', requireAuth, async (req: AuthRequest, res) => {
  try {
    await Voice.deleteOne({ userId: req.userId });

    res.json({ message: 'Voice profile deleted' });
  } catch (err) {
    logError('Voice delete failed', { err });
    res.status(500).json({ error: 'Failed to delete voice profile' });
  }
});

// GET /api/users/profile — Get user profile
router.get('/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const voice = await Voice.findOne({ userId: req.userId });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        preferences: user.preferences,
      },
      voice: voice ? {
        samples: voice.samples,
        profile: voice.profile,
        isActive: voice.isActive,
        createdAt: voice.createdAt,
        updatedAt: voice.updatedAt,
      } : null,
    });
  } catch (err) {
    logError('GET profile failed', { err });
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// PUT /api/users/preferences — Update preferences
router.put('/preferences', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updates = preferencesSchema.parse(req.body);

    const setFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        setFields[`preferences.${key}`] = value;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: setFields },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ preferences: user.preferences, message: 'Preferences updated' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    logError('PREFERENCES update failed', { err });
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

const verifyKeySchema = z.object({
  provider: z.enum(['openai', 'anthropic']),
  key: z.string().min(1),
});

// POST /api/users/verify-key — Verify an API key
router.post('/verify-key', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { provider, key } = verifyKeySchema.parse(req.body);

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey: key });
      await openai.models.list();
    } else {
      const anthropic = new Anthropic({ apiKey: key });
      await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      });
    }

    res.json({ valid: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ valid: false, error: 'Invalid request' });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    logError('Key verification failed', { error: message });
    res.json({ valid: false, error: 'Key is invalid or expired' });
  }
});

export default router;
