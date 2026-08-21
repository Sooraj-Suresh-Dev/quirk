import cron from 'node-cron';
import { fetchAllTrends } from '../services/trendFetcher.js';

export function startTrendRefreshCron() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Running trend refresh...');
    await fetchAllTrends();
  });

  console.log('Trend refresh cron scheduled (every hour)');
}
