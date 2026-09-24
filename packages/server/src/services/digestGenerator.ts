import { config } from '../config/env.js';
import { IUser } from '../models/User.js';
import { Trend } from '../models/Trend.js';

export interface DigestTrend {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  tags: string[];
  stars?: number;
  forks?: number;
  votes?: number;
  points?: number;
  comments?: number;
  author?: string;
  makers?: string[];
  createdAt?: string;
  thumbnailUrl?: string;
  generateUrl: string;
}

export interface DigestContent {
  trends: DigestTrend[];
}

export async function generateDigest(user: IUser): Promise<DigestContent | null> {
  const trends = await Trend.find({
    source: { $in: user.preferences?.sources || ['github', 'producthunt'] },
    expiresAt: { $gt: new Date() },
  })
    .sort({ fetchedAt: -1 })
    .limit(3);

  if (trends.length < 3) {
    return null;
  }

  return {
    trends: trends.map(t => ({
      id: String(t._id),
      title: t.title,
      summary: t.summary,
      source: t.source,
      url: t.url,
      tags: t.tags,
      stars: t.stars,
      forks: t.forks,
      votes: t.votes,
      points: t.points,
      comments: t.comments,
      author: t.author,
      makers: t.makers,
      createdAt: t.createdAt,
      thumbnailUrl: t.thumbnailUrl,
      generateUrl: `${config.CLIENT_URL}/generate/${t._id}`,
    })),
  };
}
