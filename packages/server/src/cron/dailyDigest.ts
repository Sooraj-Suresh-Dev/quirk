import cron from 'node-cron';
import { User } from '../models/User.js';
import { generateDigest } from '../services/digestGenerator.js';
import { sendDigestEmail } from '../services/emailSender.js';
import { logError } from '../config/logger.js';

export function startDailyDigestCron() {
  cron.schedule('* * * * *', async () => {
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
          await sendDigestEmail(user, digest);
        } catch (err) {
          logError(`DIGEST failed for ${user.email}`, { err });
        }
      }
    } catch (err) {
      logError('DIGEST cron failed', { err });
    }
  });
}
