import cron from 'node-cron';
import { fetchAllTrends } from '../services/trendFetcher.js';
import { logError } from '../config/logger.js';

export function startTrendRefreshCron() {
  cron.schedule('0 * * * *', async () => {
    try {
      await fetchAllTrends();
    } catch (err) {
      logError('CRON trend refresh failed', { err });
    }
  });
}
