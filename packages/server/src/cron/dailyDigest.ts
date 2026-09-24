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
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    try {
      const users = await User.find({
        'preferences.emailDigest': true,
        'preferences.digestTime': currentTime,
      });

      for (const user of users) {
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
