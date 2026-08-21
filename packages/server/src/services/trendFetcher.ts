import { Trend } from '../models/Trend.js';
import { fetchGitHubTrends } from './scrapers/github.js';
import { fetchHackerNewsTrends } from './scrapers/hackernews.js';
import { logError } from '../config/logger.js';

export async function fetchAllTrends(): Promise<void> {
  try {
    const [githubTrends, hnTrends] = await Promise.all([
      fetchGitHubTrends(),
      fetchHackerNewsTrends(),
    ]);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    for (const trend of githubTrends) {
      await Trend.findOneAndUpdate(
        { source: 'github', url: trend.url },
        { ...trend, source: 'github', fetchedAt: new Date(), expiresAt },
        { upsert: true }
      );
    }

    for (const trend of hnTrends) {
      await Trend.findOneAndUpdate(
        { source: 'hackernews', url: trend.url },
        { ...trend, source: 'hackernews', fetchedAt: new Date(), expiresAt },
        { upsert: true }
      );
    }
  } catch (error) {
    logError('TREND FETCH failed', { err: error as Error });
  }
}
