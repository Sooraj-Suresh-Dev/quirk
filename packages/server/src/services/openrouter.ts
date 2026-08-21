import { config } from '../config/env.js';

export async function generateWithOpenRouter(prompt: string, systemPrompt?: string) {
  const apiKey = config.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('No OpenRouter API key available');
  }

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
      model: 'meta-llama/llama-3-8b-instruct',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content || '';
}
