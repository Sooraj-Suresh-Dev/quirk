import { IUser } from '../models/User.js';
import { Trend } from '../models/Trend.js';
import { generatePost } from './postGenerator.js';

export interface DigestContent {
  textPosts: string[];
  carousel: Record<string, unknown>[];
  imagePrompt: string;
}

export async function generateDigest(user: IUser): Promise<DigestContent> {
  const trends = await Trend.find({
    source: { $in: user.preferences?.sources || ['github', 'hackernews'] },
    expiresAt: { $gt: new Date() },
  })
    .sort({ fetchedAt: -1 })
    .limit(5);

  if (trends.length < 3) {
    return {
      textPosts: ['No trends available for digest generation today.'],
      carousel: [{ heading: 'Check back later', body: 'More trends coming soon!', imagePrompt: 'Empty state illustration' }],
      imagePrompt: 'Stay tuned for more content!',
    };
  }

  // Generate 3 text posts
  const textPostsRaw = await Promise.all(
    trends.slice(0, 3).map(trend => generatePost(trend, 'text', user))
  );
  const textPosts = textPostsRaw.map(p => typeof p === 'string' ? p : JSON.stringify(p));

  // Generate 1 carousel
  const carouselResult = await generatePost(trends[3] || trends[0], 'carousel', user);
  const carousel = Array.isArray(carouselResult) ? carouselResult as Record<string, unknown>[] : [];

  // Generate 1 image prompt
  const imagePromptResult = await generatePost(trends[4] || trends[1], 'image-prompt', user);
  const imagePrompt = typeof imagePromptResult === 'string'
    ? imagePromptResult
    : JSON.stringify(imagePromptResult);

  return {
    textPosts,
    carousel,
    imagePrompt,
  };
}
