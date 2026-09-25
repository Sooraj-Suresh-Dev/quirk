import cron from 'node-cron';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { generateDigest } from '../services/digestGenerator.js';
import { sendDigestEmail } from '../services/emailSender.js';
import { logError, logWarn } from '../config/logger.js';

export function startDailyDigestCron() {
  cron.schedule('* * * * *', async () => {
    if (config.NODE_ENV !== 'production') return;

    const now = new Date();

    try {
      const users = await User.find({ 'preferences.emailDigest': true });

      for (const user of users) {
        const userTz = user.preferences.timezone || 'UTC';
        const userLocalTime = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: userTz,
        });

        if (userLocalTime !== user.preferences.digestTime) continue;

        try {
          const digest = await generateDigest(user);
          if (!digest) {
            logWarn(`DIGEST skipped, no trends for ${user.email}`);
            continue;
          }
          const sent = await sendDigestEmail(user, digest);
          if (!sent) {
            logError(`DIGEST send failed for ${user.email}`);
          }
        } catch (err) {
          logError(`DIGEST failed for ${user.email}`, { err });
        }
      }
    } catch (err) {
      logError('DIGEST cron failed', { err });
    }
  });
}
