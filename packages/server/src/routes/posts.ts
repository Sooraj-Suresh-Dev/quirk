import { Router, Router as ExpressRouter } from 'express';
import { z } from 'zod';
import { Post } from '../models/Post.js';
import { Trend } from '../models/Trend.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { generatePost } from '../services/postGenerator.js';
import { PROVIDERS, DEFAULT_PROVIDER, DEFAULT_MODEL, DEFAULT_TEMPERATURE, getProvider } from '../config/models.js';
import { config } from '../config/env.js';
import { logError } from '../config/logger.js';

const router: ExpressRouter = Router();

const generateSchema = z.object({
  trendId: z.string(),
  type: z.enum(['text', 'carousel', 'image-prompt']),
  provider: z.string().optional(),
  model: z.string().optional(),
  temperature: z.number().min(0.1).max(2.0).optional(),
});

// GET /api/posts/models — List available providers and models
router.get('/models', requireAuth, (req: AuthRequest, res) => {
  const user = req.user;

  const providers = PROVIDERS.map(p => ({
    id: p.id,
    name: p.name,
    hasApiKey: hasApiKeyForProvider(p.id, user),
    models: p.models.map(m => ({
      id: m.id,
      name: m.name,
      defaultTemperature: m.defaultTemperature,
    })),
  }));

  res.json({
    providers,
    defaults: {
      provider: DEFAULT_PROVIDER,
      model: DEFAULT_MODEL,
      temperature: DEFAULT_TEMPERATURE,
    },
  });
});

function hasApiKeyForProvider(providerId: string, user?: any): boolean {
  switch (providerId) {
    case 'openai':
      return !!(config.OPENAI_API_KEY || user?.preferences?.openaiKey);
    case 'anthropic':
      return !!(config.ANTHROPIC_API_KEY || user?.preferences?.anthropicKey);
    case 'openrouter':
      return !!config.OPENROUTER_API_KEY;
    default:
      return false;
  }
}

// GET /api/posts — List user's posts
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    const [posts, total, thisWeek] = await Promise.all([
      Post.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(20),
      Post.countDocuments({ userId: req.userId }),
      Post.countDocuments({ userId: req.userId, createdAt: { $gte: startOfWeek } }),
    ]);

    res.json({ posts, total, thisWeek });
  } catch (err) {
    logError('POSTS list failed', { err });
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/posts/generate — Generate new post
router.post('/generate', requireAuth, rateLimiter, async (req: AuthRequest, res) => {
  try {
    const { trendId, type, provider, model, temperature } = generateSchema.parse(req.body);

    const trend = await Trend.findById(trendId);
    if (!trend) {
      res.status(404).json({ error: 'Trend not found' });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const selectedProvider = provider || user.preferences?.preferredProvider || DEFAULT_PROVIDER;
    const providerInfo = getProvider(selectedProvider);
    const selectedModel = model || providerInfo?.models[0]?.id;
    const selectedTemperature = temperature ?? user.preferences?.preferredTemperature ?? DEFAULT_TEMPERATURE;

    const { content, fallback } = await generatePost(trend, type, user, {
      provider: selectedProvider,
      model: selectedModel,
      temperature: selectedTemperature,
    });

    const post = await Post.create({
      userId: req.userId,
      trendId,
      content,
      type,
      status: 'generated',
    });

    res.json({ post, fallback });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    const message = err instanceof Error ? err.message : 'Failed to generate post';
    logError('POST generate failed', { err });
    res.status(500).json({ error: message });
  }
});

// PATCH /api/posts/:id — Update post status
router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    if (!['generated', 'copied', 'posted'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status },
      { new: true }
    );

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json({ post });
  } catch (err) {
    logError('POST update failed', { err });
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id — Delete post
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted' });
  } catch (err) {
    logError('POST delete failed', { err });
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
