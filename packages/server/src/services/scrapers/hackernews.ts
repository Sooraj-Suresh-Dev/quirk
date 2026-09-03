import { fetchOgImage } from './ogImage.js';

interface HackerNewsTrending {
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

async function fetchOgDescription(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; QuirkBot/1.0)' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)
      || html.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i)
      || html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i)
      || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:description"/i);
    const desc = match?.[1]?.slice(0, 500);
    if (desc && desc.length > 10) return desc;
    return undefined;
  } catch {
    return undefined;
  }
}

export async function fetchHackerNewsTrends(): Promise<HackerNewsTrending[]> {
  try {
    const topRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      signal: AbortSignal.timeout(5000),
    });
    if (!topRes.ok) {
      console.warn('Hacker News API error:', topRes.status);
      return [];
    }
    const topIds: number[] = await topRes.json();
    const ids = topIds.slice(0, 15);

    const stories = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
            signal: AbortSignal.timeout(3000),
          });
          if (!res.ok) return null;
          return res.json();
        } catch {
          return null;
        }
      })
    );

    const validStories = stories.filter((s): s is any => s != null && s.title && s.url);

    const enriched = await Promise.all(
      validStories.map(async (s) => {
        let summary: string;
        if (s.text) {
          summary = s.text.replace(/<[^>]*>/g, '').slice(0, 300);
        } else {
          summary = (await fetchOgDescription(s.url)) || `${s.score} points by ${s.by}`;
        }
        const thumbnailUrl = await fetchOgImage(s.url);
        return {
          title: s.title,
          url: s.url,
          summary,
          tags: ['hackernews'],
          thumbnailUrl,
          points: s.score,
          comments: s.descendants,
          author: s.by,
          createdAt: new Date(s.time * 1000).toISOString(),
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error('Failed to fetch Hacker News trends:', error);
    return [];
  }
}
