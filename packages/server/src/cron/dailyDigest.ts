import cron from 'node-cron';
import { User } from '../models/User.js';
import { generateDigest } from '../services/digestGenerator.js';
import { sendDigestEmail } from '../services/emailSender.js';

export function startDailyDigestCron() {
  // Check every minute for users whose digest time matches
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    try {
      const users = await User.find({
        'preferences.emailDigest': true,
        'preferences.digestTime': currentTime,
      });

      if (users.length === 0) return;

      console.log(`[CRON] Generating digest for ${users.length} users at ${currentTime}`);

      for (const user of users) {
        try {
          const digest = await generateDigest(user);
          await sendDigestEmail(user, digest);
        } catch (error) {
          console.error(`Failed to generate digest for ${user.email}:`, error);
        }
      }
    } catch (error) {
      console.error('[CRON] Digest check failed:', error);
    }
  });

  console.log('Daily digest cron scheduled (checks every minute)');
}
