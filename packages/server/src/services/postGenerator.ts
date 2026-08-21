import { ITrend } from '../models/Trend.js';
import { IUser } from '../models/User.js';
import { generateWithOpenAI } from './openai.js';
import { generateWithOpenRouter } from './openrouter.js';

export async function generatePost(
  trend: ITrend,
  type: 'text' | 'carousel' | 'image-prompt',
  user: IUser
): Promise<string | Record<string, unknown>[]> {
  const systemPrompt = buildSystemPrompt(user);
  const userPrompt = buildUserPrompt(trend, type);

  let result = '';

  // Try user's API key first
  const userKey = user.preferences?.openaiKey || user.preferences?.anthropicKey;

  try {
    if (userKey) {
      result = await generateWithOpenAI(userPrompt, systemPrompt, userKey);
    }
  } catch {
    // Fall through to app key or OpenRouter
  }

  if (!result) {
    try {
      result = await generateWithOpenAI(userPrompt, systemPrompt);
    } catch {
      try {
        result = await generateWithOpenRouter(userPrompt, systemPrompt);
      } catch {
        return generateFallbackContent(trend, type);
      }
    }
  }

  if (type === 'carousel') {
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as Record<string, unknown>[];
      }
    } catch {
      // Fall through
    }
    return parseCarouselFallback(result);
  }

  return result;
}

function buildSystemPrompt(user: IUser): string {
  const voice = user.voiceProfile;

  let prompt = `You are an expert LinkedIn content writer. Write engaging, authentic content that sounds like a real person, not AI.

RULES:
- Write in first person
- Be specific and actionable
- Avoid generic corporate language
- Use short paragraphs (1-3 sentences)
- End with a clear CTA or thought-provoking question
`;

  if (voice) {
    prompt += `
VOICE PROFILE:
- Tone: ${voice.tone}
- Average sentence length: ${voice.avgSentenceLength} words
- CTA style: ${voice.ctaStyle}
- Emoji frequency: ${voice.emojiFrequency > 0.5 ? 'heavy' : voice.emojiFrequency > 0.2 ? 'moderate' : 'minimal'}
`;
  }

  return prompt;
}

function buildUserPrompt(trend: ITrend, type: 'text' | 'carousel' | 'image-prompt'): string {
  const topic = trend.title;
  const summary = trend.summary;

  switch (type) {
    case 'text':
      return `Write a LinkedIn text post about: "${topic}"
Context: ${summary}

Requirements:
- Hook (attention-grabbing first line)
- Body (2-3 paragraphs with value)
- CTA (call to action or question)

Format as plain text with line breaks.`;

    case 'carousel':
      return `Create a LinkedIn carousel (5 slides) about: "${topic}"
Context: ${summary}

Return as JSON array with this structure:
[
  { "heading": "Slide 1 title", "body": "Content for slide 1", "imagePrompt": "Description of image for this slide" },
  ...
]

Slide structure:
1. Title slide (catchy headline)
2. Point 1 (with supporting detail)
3. Point 2 (with supporting detail)
4. Point 3 (with supporting detail)
5. Conclusion (summary + CTA)

Return ONLY the JSON array.`;

    case 'image-prompt':
      return `Create an AI image generation prompt for a LinkedIn post about: "${topic}"
Context: ${summary}

Return as JSON:
{
  "prompt": "Detailed image prompt for AI generation (DALL-E/Midjourney style)",
  "style": "Visual style (e.g., 'modern minimalist', 'warm editorial', 'tech illustration')",
  "caption": "Suggested LinkedIn caption for the image"
}

Return ONLY the JSON object.`;
  }
}

function generateFallbackContent(trend: ITrend, type: 'text' | 'carousel' | 'image-prompt'): string | Record<string, unknown>[] {
  const topic = trend.title;

  if (type === 'text') {
    return `🔥 ${topic}

This is trending right now, and here's why it matters:

The tech landscape is evolving fast. Staying ahead means understanding these shifts early.

What's your take on this? Drop your thoughts below 👇

#TechTrends #Innovation #LinkedIn`;
  }

  if (type === 'carousel') {
    return [
      { heading: topic, body: 'A deep dive into what\'s trending', imagePrompt: 'Modern tech illustration' },
      { heading: 'Why It Matters', body: 'This trend is shaping the industry', imagePrompt: 'Abstract impact visualization' },
      { heading: 'Key Insight #1', body: 'Early adoption gives competitive advantage', imagePrompt: 'Growth chart illustration' },
      { heading: 'Key Insight #2', body: 'Community reception has been overwhelmingly positive', imagePrompt: 'Community illustration' },
      { heading: 'What Do You Think?', body: 'Share your perspective in the comments', imagePrompt: 'Question mark illustration' },
    ];
  }

  return JSON.stringify({
    prompt: `Professional tech illustration about ${topic}, modern minimalist style, warm colors, clean design`,
    style: 'modern minimalist',
    caption: `Exploring what's trending in tech: ${topic} 🚀`,
  });
}

function parseCarouselFallback(text: string): Record<string, unknown>[] {
  const slides = text.split(/slide\s*\d+/i).filter(s => s.trim().length > 0).slice(0, 5);

  return slides.map((slide, i) => ({
    heading: `Slide ${i + 1}`,
    body: slide.trim(),
    imagePrompt: 'Tech illustration',
  }));
}
