import { config } from '../config/env.js';
import { DEFAULT_MODEL } from '../config/models.js';
import { logError } from '../config/logger.js';

export async function generateWithOpenRouter(
  prompt: string,
  systemPrompt?: string,
  model?: string,
  temperature?: number
) {
  const apiKey = config.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('No OpenRouter API key available');
  }

  const selectedModel = model || DEFAULT_MODEL;

  const messages: { role: string; content: string }[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: selectedModel,
      messages,
      temperature: temperature ?? 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Could not read error body');
    logError('OpenRouter API error', {
      status: response.status,
      statusText: response.statusText,
      model: selectedModel,
      body: errorBody,
    });
    throw new Error(`OpenRouter API error ${response.status}: ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    logError('OpenRouter empty response', { data });
    throw new Error('OpenRouter returned empty response');
  }

  return data.choices[0].message.content || '';
}
