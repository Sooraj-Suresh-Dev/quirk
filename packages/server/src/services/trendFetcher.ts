import { Trend } from '../models/Trend.js';
import { fetchGitHubTrends } from './scrapers/github.js';
import { fetchProductHuntTrends } from './scrapers/producthunt.js';
import { logError } from '../config/logger.js';

export async function fetchAllTrends(): Promise<void> {
  try {
    const [githubTrends, phTrends] = await Promise.all([
      fetchGitHubTrends(),
      fetchProductHuntTrends(),
    ]);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    for (const trend of githubTrends) {
      await Trend.findOneAndUpdate(
        { source: 'github', url: trend.url },
        { ...trend, source: 'github', fetchedAt: new Date(), expiresAt },
        { upsert: true }
      );
    }

    for (const trend of phTrends) {
      await Trend.findOneAndUpdate(
        { source: 'producthunt', url: trend.url },
        { ...trend, source: 'producthunt', fetchedAt: new Date(), expiresAt },
        { upsert: true }
      );
    }
  } catch (error) {
    logError('TREND FETCH failed', { err: error as Error });
  }
}
