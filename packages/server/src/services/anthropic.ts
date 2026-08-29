import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';

export async function generateWithAnthropic(
  prompt: string,
  systemPrompt?: string,
  model?: string,
  temperature?: number,
  userApiKey?: string
) {
  const apiKey = userApiKey || config.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('No Anthropic API key available');
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: model || 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: temperature ?? 0.7,
    system: systemPrompt || 'You are an expert LinkedIn content writer.',
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.text || '';
}
