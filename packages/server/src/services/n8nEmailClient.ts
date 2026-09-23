import { config } from '../config/env.js';
import { logError } from '../config/logger.js';

function requireEnv(name: 'N8N_WEBHOOK_URL' | 'N8N_WEBHOOK_SECRET'): string {
  const value = config[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export async function triggerMagicLinkEmail(data: {
  email: string;
  magicLink: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  try {
    const url = requireEnv('N8N_WEBHOOK_URL');
    const secret = requireEnv('N8N_WEBHOOK_SECRET');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-Secret': secret,
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`n8n responded ${res.status}: ${body}`);
    }
    return true;
  } catch (err) {
    logError('N8N magic link email failed', { err: err as Error, email: data.email });
    return false;
  }
}
