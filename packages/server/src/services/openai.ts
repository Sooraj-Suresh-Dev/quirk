import OpenAI from 'openai';
import { config } from '../config/env.js';

export async function generateWithOpenAI(
  prompt: string,
  systemPrompt?: string,
  model?: string,
  temperature?: number,
  userApiKey?: string
) {
  const apiKey = userApiKey || config.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('No OpenAI API key available');
  }

  const openai = new OpenAI({ apiKey });

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await openai.chat.completions.create({
    model: model || 'gpt-4o-mini',
    messages,
    temperature: temperature ?? 0.7,
    max_tokens: 2000,
  });

  return response.choices[0].message.content || '';
}
