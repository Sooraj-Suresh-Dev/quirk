import { fetchOgImage } from './ogImage.js';

function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

interface HNTrending {
  title: string;
  url: string;
  summary: string;
  tags: string[];
  thumbnailUrl?: string;
  points?: number;
  comments?: number;
  author?: string;
  createdAt?: string;
}

export async function fetchHackerNewsTrends(): Promise<HNTrending[]> {
  try {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');

    if (!response.ok) {
      console.warn('HN API error:', response.status);
      return [];
    }

    const storyIds: number[] = await response.json();
    const topIds = storyIds.slice(0, 15);

    const stories = await Promise.all(
      topIds.map(async (id) => {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return res.json();
      })
    );

    const results = stories
      .filter((story: any) => story && story.title)
      .map((story: any) => ({
        title: story.title,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        summary: story.text ? cleanHtml(story.text) : `Posted by ${story.by} • ${story.score} points • ${story.descendants || 0} comments`,
        tags: ['hackernews'],
        points: story.score,
        comments: story.descendants,
        author: story.by,
        createdAt: story.time ? new Date(story.time * 1000).toISOString() : undefined,
      }));

    const withThumbnails = await Promise.all(
      results.map(async (trend) => ({
        ...trend,
        thumbnailUrl: await fetchOgImage(trend.url),
      }))
    );

    return withThumbnails;
  } catch (error) {
    console.error('Failed to fetch Hacker News trends:', error);
    return [];
  }
}
