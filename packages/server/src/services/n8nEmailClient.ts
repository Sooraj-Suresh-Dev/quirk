import { config } from '../config/env.js';
import { logError } from '../config/logger.js';

function requireEnv(name: 'N8N_WEBHOOK_URL' | 'N8N_DIGEST_WEBHOOK_URL' | 'N8N_WEBHOOK_SECRET'): string {
  const value = config[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function postWebhook(url: string, secret: string, data: unknown): Promise<void> {
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
    await postWebhook(url, secret, data);
    return true;
  } catch (err) {
    logError('N8N magic link email failed', { err: err as Error, email: data.email });
    return false;
  }
}

export async function triggerDigestEmail(data: {
  email: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  try {
    const url = requireEnv('N8N_DIGEST_WEBHOOK_URL');
    const secret = requireEnv('N8N_WEBHOOK_SECRET');
    await postWebhook(url, secret, data);
    return true;
  } catch (err) {
    logError('N8N digest email failed', { err: err as Error, email: data.email });
    return false;
  }
}
