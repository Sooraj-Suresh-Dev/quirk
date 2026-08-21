import { generateWithOpenAI } from './openai.js';
import { generateWithOpenRouter } from './openrouter.js';
import { config } from '../config/env.js';

interface VoiceProfile {
  tone: string;
  avgSentenceLength: number;
  ctaStyle: string;
  emojiFrequency: number;
}

export async function analyzeVoice(samples: string[]): Promise<VoiceProfile> {
  const systemPrompt = `You are an expert at analyzing writing style. Analyze the provided LinkedIn posts and extract the author's voice profile. Return ONLY a valid JSON object with these fields:
- tone: string (e.g., "professional", "casual", "humorous", "inspirational", "educational")
- avgSentenceLength: number (average words per sentence)
- ctaStyle: string (e.g., "question", "direct", "soft", "urgency", "none")
- emojiFrequency: number (0.0 to 1.0, where 0 = no emojis, 1 = every sentence has emojis)`;

  const prompt = `Analyze these LinkedIn posts and extract the writing voice:

${samples.map((s, i) => `--- POST ${i + 1} ---\n${s}`).join('\n\n')}

Return ONLY the JSON object, no other text.`;

  let result = '';

  // Try user's OpenAI key first, then app key, then OpenRouter
  try {
    if (config.OPENAI_API_KEY) {
      result = await generateWithOpenAI(prompt, systemPrompt);
    }
  } catch {
    // Fall through to OpenRouter
  }

  if (!result) {
    try {
      result = await generateWithOpenRouter(prompt, systemPrompt);
    } catch {
      // Fall through to default
    }
  }

  if (!result) {
    // Return a basic analysis based on heuristics
    return heuristicAnalysis(samples);
  }

  try {
    // Extract JSON from the response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return heuristicAnalysis(samples);
    }
    const profile = JSON.parse(jsonMatch[0]);
    return {
      tone: profile.tone || 'professional',
      avgSentenceLength: profile.avgSentenceLength || 15,
      ctaStyle: profile.ctaStyle || 'direct',
      emojiFrequency: Math.min(1, Math.max(0, profile.emojiFrequency || 0)),
    };
  } catch {
    return heuristicAnalysis(samples);
  }
}

function heuristicAnalysis(samples: string[]): VoiceProfile {
  const allText = samples.join(' ');
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = allText.split(/\s+/).filter(w => w.length > 0);
  const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 15;

  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/gu;
  const emojis = allText.match(emojiRegex) || [];
  const emojiFrequency = sentences.length > 0 ? Math.min(1, emojis.length / sentences.length) : 0;

  const hasQuestion = allText.includes('?');
  const ctaStyle = hasQuestion ? 'question' : 'direct';

  const exclamationCount = (allText.match(/!/g) || []).length;
  const tone = exclamationCount > 3 ? 'enthusiastic' : 'professional';

  return {
    tone,
    avgSentenceLength,
    ctaStyle,
    emojiFrequency,
  };
}
