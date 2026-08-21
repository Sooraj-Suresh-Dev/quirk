import { Router, Router as ExpressRouter } from 'express';
import { z } from 'zod';
import { Post } from '../models/Post.js';
import { Trend } from '../models/Trend.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { generatePost } from '../services/postGenerator.js';

const router: ExpressRouter = Router();

const generateSchema = z.object({
  trendId: z.string(),
  type: z.enum(['text', 'carousel', 'image-prompt']),
});

// GET /api/posts — List user's posts
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const posts = await Post.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/posts/generate — Generate new post
router.post('/generate', requireAuth, rateLimiter, async (req: AuthRequest, res) => {
  try {
    const { trendId, type } = generateSchema.parse(req.body);

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

    const content = await generatePost(trend, type, user);

    const post = await Post.create({
      userId: req.userId,
      trendId,
      content,
      type,
      status: 'generated',
    });

    res.json({ post });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to generate post' });
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
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id — Delete post
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
