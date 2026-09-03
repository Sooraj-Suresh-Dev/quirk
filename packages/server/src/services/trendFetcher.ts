import { Trend } from '../models/Trend.js';
import { fetchGitHubTrends } from './scrapers/github.js';
import { fetchProductHuntTrends } from './scrapers/producthunt.js';
import { fetchHackerNewsTrends } from './scrapers/hackernews.js';
import { filterTrends } from './qualityFilter.js';
import { logError, logInfo } from '../config/logger.js';

export async function fetchAllTrends(): Promise<void> {
  try {
    const [githubTrends, phTrends, hnTrends] = await Promise.all([
      fetchGitHubTrends(),
      fetchProductHuntTrends(),
      fetchHackerNewsTrends(),
    ]);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const sources = [
      { trends: githubTrends, source: 'github' as const },
      { trends: phTrends, source: 'producthunt' as const },
      { trends: hnTrends, source: 'hackernews' as const },
    ];

    let totalSaved = 0;

    for (const { trends, source } of sources) {
      const qualityTrends = filterTrends(
        trends.map(t => ({ ...t, source }))
      );

      for (const trend of qualityTrends) {
        await Trend.findOneAndUpdate(
          { source, url: trend.url },
          { ...trend, source, fetchedAt: new Date(), expiresAt },
          { upsert: true }
        );
      }
      totalSaved += qualityTrends.length;
    }

    logInfo(`Trends fetched: github=${githubTrends.length} producthunt=${phTrends.length} hackernews=${hnTrends.length} saved=${totalSaved}`);
  } catch (error) {
    logError('TREND FETCH failed', { err: error as Error });
  }
}
