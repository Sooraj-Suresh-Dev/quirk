import { Trend } from '../models/Trend.js';
import { fetchGitHubTrends } from './scrapers/github.js';
import { fetchHackerNewsTrends } from './scrapers/hackernews.js';

export async function fetchAllTrends(): Promise<void> {
  console.log('Refreshing trends...');

  try {
    const [githubTrends, hnTrends] = await Promise.all([
      fetchGitHubTrends(),
      fetchHackerNewsTrends(),
    ]);

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Upsert GitHub trends
    for (const trend of githubTrends) {
      await Trend.findOneAndUpdate(
        { source: 'github', url: trend.url },
        {
          source: 'github',
          title: trend.title,
          url: trend.url,
          summary: trend.summary,
          tags: trend.tags,
          fetchedAt: new Date(),
          expiresAt,
        },
        { upsert: true }
      );
    }

    // Upsert HN trends
    for (const trend of hnTrends) {
      await Trend.findOneAndUpdate(
        { source: 'hackernews', url: trend.url },
        {
          source: 'hackernews',
          title: trend.title,
          url: trend.url,
          summary: trend.summary,
          tags: trend.tags,
          fetchedAt: new Date(),
          expiresAt,
        },
        { upsert: true }
      );
    }

    console.log(`Trends refreshed: ${githubTrends.length} GitHub, ${hnTrends.length} HN`);
  } catch (error) {
    console.error('Failed to refresh trends:', error);
  }
}
