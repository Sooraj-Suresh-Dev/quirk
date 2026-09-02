import { generateWithOpenAI } from './openai.js';
import { generateWithOpenRouter } from './openrouter.js';
import { config } from '../config/env.js';
import { logError } from '../config/logger.js';

export interface VoiceProfile {
  tone: {
    primary: string;
    secondary: string[];
    confidence: number;
  };
  writingStyle: {
    description: string;
    avgSentenceLength: number;
    avgParagraphLength: number;
  };
  personality: {
    traits: string[];
    description: string;
  };
  structure: {
    description: string;
    pattern: string[];
  };
  engagement: {
    cta: 'None' | 'Soft' | 'Direct';
    questions: 'None' | 'Rare' | 'Occasional' | 'Frequent';
    emoji: 'None' | 'Low' | 'Medium' | 'High';
    emojiFrequency: number;
  };
  signaturePatterns: string[];
  brandSummary: string;
  trainingQuality: {
    score: number;
    consistency: string;
    limitations: string[];
  };
}

const TONE_OPTIONS = [
  'Thoughtful', 'Reflective', 'Confident', 'Bold', 'Inspirational',
  'Analytical', 'Practical', 'Empathetic', 'Curious', 'Persuasive',
  'Humorous', 'Calm', 'Professional'
];

const QUESTIONS_OPTIONS = ['None', 'Rare', 'Occasional', 'Frequent'] as const;
const EMOJI_OPTIONS = ['None', 'Low', 'Medium', 'High'] as const;
const CTA_OPTIONS = ['None', 'Soft', 'Direct'] as const;
const CONSISTENCY_OPTIONS = ['High', 'Medium', 'Low'];

function validateString(value: any, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  return value.trim();
}

function validateEnum(value: any, fallback: string, validOptions: readonly string[]): string {
  if (typeof value !== 'string') return fallback;
  if (!validOptions.includes(value)) return fallback;
  return value;
}

function validateNumber(value: any, fallback: number, min: number, max: number): number {
  const num = Number(value);
  if (isNaN(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function validateArray(value: any, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.slice(0, 10).map(String).filter(Boolean);
}

export async function analyzeVoice(samples: string[]): Promise<VoiceProfile> {
  const systemPrompt = `You are an expert at analyzing LinkedIn writing style and voice.

TONE represents the personality/emotional character projected by the writing. Examples: Thoughtful, Reflective, Confident, Bold, Inspirational, Analytical, Practical, Empathetic, Curious, Persuasive, Humorous, Calm, Professional.

WRITING STYLE represents HOW the author writes: sentence length and rhythm, directness, vocabulary complexity, paragraph length, line breaks/whitespace, first-person usage, rhetorical questions, standalone sentences, use of examples/stories, level of formality.

PERSONALITY traits inferred from writing: Thoughtful, Curious, Practical, Humble, Observant, Confident, Empathetic, Analytical. Only include traits consistently projected through the writing.

STRUCTURE describes how ideas are organized and the recurring patterns in post organization.

CTA (Call-to-Action) exists ONLY when the author explicitly encourages the reader to take an action, respond, comment, try something, visit something, sign up, share an opinion, etc. A strong conclusion, advice, rhetorical question, or direct writing style is NOT automatically a CTA.

Return ONLY valid JSON matching this exact structure:

\`\`\`json
{
  "tone": {
    "primary": "string (ONE primary tone - the strongest recurring characteristic)",
    "secondary": ["string (up to 2 secondary tones if strongly evidenced, otherwise empty array)"],
    "confidence": "number 0-1 (how reliably you can reproduce this voice)"
  },
  "writingStyle": {
    "description": "string (1-2 sentences describing how they write)",
    "avgSentenceLength": "number (average words per sentence)",
    "avgParagraphLength": "number (average words per paragraph)"
  },
  "personality": {
    "traits": ["string (2-4 traits consistently projected)"],
    "description": "string (1 sentence on how personality shows in writing)"
  },
  "structure": {
    "description": "string (1-2 sentences on how they organize ideas)",
    "pattern": ["string (recurring structural patterns, e.g., 'Opens with personal story', 'Ends with takeaway')"]
  },
  "engagement": {
    "cta": "None | Soft | Direct (only when explicitly encouraging action)",
    "questions": "None | Rare | Occasional | Frequent",
    "emoji": "None | Low | Medium | High",
    "emojiFrequency": "number (percentage of posts with emoji)"
  },
  "signaturePatterns": ["string (2-4 recurring writing patterns that define their style)"],
  "brandSummary": "string (2-3 sentences combining tone, personality, and communication approach - be specific and natural)",
  "trainingQuality": {
    "score": "number 0-1 (confidence in analysis based on sample quality and consistency)",
    "consistency": "High | Medium | Low",
    "limitations": ["string (1-3 limitations in the analysis)"]
  }
}
\`\`\`

Return ONLY the JSON, no explanation or markdown formatting.`;

  const prompt = `Analyze these LinkedIn posts and extract the author's unique writing voice.

IMPORTANT: Focus on recurring patterns across multiple posts. Only classify characteristics that appear repeatedly or are strongly supported.

${samples.map((s, i) => `--- POST ${i + 1} ---\n${s}`).join('\n\n')}

Return ONLY the JSON object, no other text.`;

  let result = '';

  try {
    if (config.OPENAI_API_KEY) {
      result = await generateWithOpenAI(prompt, systemPrompt);
    }
  } catch (err) {
    logError('Voice analysis OpenAI failed, trying OpenRouter', { error: String(err) });
  }

  if (!result) {
    try {
      result = await generateWithOpenRouter(prompt, systemPrompt);
    } catch (err) {
      logError('Voice analysis OpenRouter failed, using heuristic', { error: String(err) });
    }
  }

  if (!result) {
    return heuristicAnalysis(samples);
  }

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logError('Voice analysis no JSON match, using heuristic', { result: result.slice(0, 200) });
      return heuristicAnalysis(samples);
    }

    const profile = JSON.parse(jsonMatch[0]);

    const tonePrimary = validateEnum(profile.tone?.primary, 'Professional', TONE_OPTIONS);
    const toneSecondary = validateArray(profile.tone?.secondary, []).filter(t => t !== tonePrimary).slice(0, 2);
    const toneConfidence = validateNumber(profile.tone?.confidence, 0.7, 0, 1);

    const writingStyleDesc = validateString(profile.writingStyle?.description, 'Clear and direct writing style.');
    const avgSentenceLength = validateNumber(profile.writingStyle?.avgSentenceLength, 15, 5, 50);
    const avgParagraphLength = validateNumber(profile.writingStyle?.avgParagraphLength, 50, 10, 300);

    const personalityTraits = validateArray(profile.personality?.traits, []);
    const personalityDesc = validateString(profile.personality?.description, 'Writing reflects a consistent personal voice.');

    const structureDesc = validateString(profile.structure?.description, 'Ideas are organized in a clear pattern.');
    const structurePattern = validateArray(profile.structure?.pattern, []);

    const cta = validateEnum(profile.engagement?.cta, 'None', CTA_OPTIONS);
    const questions = validateEnum(profile.engagement?.questions, 'Rare', QUESTIONS_OPTIONS);
    const emoji = validateEnum(profile.engagement?.emoji, 'Low', EMOJI_OPTIONS);
    const emojiFrequency = validateNumber(profile.engagement?.emojiFrequency, 0, 0, 1);

    const signaturePatterns = validateArray(profile.signaturePatterns, []);

    const brandSummary = validateString(profile.brandSummary, 'A professional voice with a clear, direct style.');

    const qualityScore = validateNumber(profile.trainingQuality?.score, 0.7, 0, 1);
    const consistency = validateEnum(profile.trainingQuality?.consistency, 'Medium', CONSISTENCY_OPTIONS);
    const limitations = validateArray(profile.trainingQuality?.limitations, []);

    return {
      tone: {
        primary: tonePrimary,
        secondary: toneSecondary,
        confidence: toneConfidence,
      },
      writingStyle: {
        description: writingStyleDesc,
        avgSentenceLength,
        avgParagraphLength,
      },
      personality: {
        traits: personalityTraits,
        description: personalityDesc,
      },
      structure: {
        description: structureDesc,
        pattern: structurePattern,
      },
      engagement: {
        cta: cta as 'None' | 'Soft' | 'Direct',
        questions: questions as 'None' | 'Rare' | 'Occasional' | 'Frequent',
        emoji: emoji as 'None' | 'Low' | 'Medium' | 'High',
        emojiFrequency,
      },
      signaturePatterns,
      brandSummary,
      trainingQuality: {
        score: qualityScore,
        consistency,
        limitations,
      },
    };
  } catch (err) {
    logError('Voice analysis JSON parse failed, using heuristic', { error: String(err), result: result.slice(0, 200) });
    return heuristicAnalysis(samples);
  }
}

function heuristicAnalysis(samples: string[]): VoiceProfile {
  const allText = samples.join(' ');
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = allText.split(/\s+/).filter(w => w.length > 0);
  const paragraphs = allText.split(/\n\n+/).filter(p => p.trim().length > 0);

  const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 15;
  const avgParagraphLength = paragraphs.length > 0 ? Math.round(words.length / paragraphs.length) : 50;

  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojis = allText.match(emojiRegex) || [];
  const emojiCount = emojis.length;
  const emojiFrequency = samples.length > 0 ? emojiCount / samples.length : 0;

  const questionCount = (allText.match(/\?/g) || []).length;
  const questionsPerSample = samples.length > 0 ? questionCount / samples.length : 0;

  const exclamationCount = (allText.match(/!/g) || []).length;
  const firstPersonCount = (allText.match(/\b(I|my|me|we|our|team)\b/gi) || []).length;

  const ctaPatterns = /\b(try|check out|share|comment|let me know|follow|subscribe|visit|sign up|tell me|what do you|would you)/gi;
  const ctaMatches = allText.match(ctaPatterns) || [];
  const hasExplicitCTA = ctaMatches.length > 0;

  const hasPersonalStories = firstPersonCount > sentences.length * 0.2;
  const hasIndustryJargon = /(?:leverage|utilize|optimize|scalable|robust|synergy|deliverable)/i.test(allText);

  let tone = 'Professional';
  if (hasPersonalStories && questionCount > 2) tone = 'Thoughtful';
  else if (exclamationCount > 4) tone = 'Confident';
  else if (hasIndustryJargon) tone = 'Professional';

  let cta: 'None' | 'Soft' | 'Direct' = 'None';
  if (hasExplicitCTA) {
    cta = questionCount > sentences.length * 0.2 ? 'Soft' : 'Direct';
  }

  let questions: 'None' | 'Rare' | 'Occasional' | 'Frequent' = 'Rare';
  if (questionsPerSample > 1) questions = 'Frequent';
  else if (questionsPerSample > 0.3) questions = 'Occasional';

  let emoji: 'None' | 'Low' | 'Medium' | 'High' = 'Low';
  if (emojiCount === 0) emoji = 'None';
  else if (emojiFrequency > 0.5) emoji = 'High';
  else if (emojiFrequency > 0.2) emoji = 'Medium';

  const writingStyleDesc = avgSentenceLength < 12
    ? `Concise and direct style with short sentences.`
    : avgSentenceLength > 20
    ? `Detailed explanations with longer, more complex sentences.`
    : `Balanced sentence length with clear, direct communication.`;

  const signaturePatterns: string[] = [];
  if (hasPersonalStories) signaturePatterns.push('Uses personal experiences to connect');
  if (questionCount > 1) signaturePatterns.push('Engages readers with questions');
  if (exclamationCount > 2) signaturePatterns.push('Uses exclamation for emphasis');
  if (signaturePatterns.length === 0) signaturePatterns.push('Clear, professional tone');

  const brandSummary = `A ${tone.toLowerCase()} voice that communicates with ${avgSentenceLength < 12 ? 'brevity and directness' : 'clear, well-structured explanations'}. The writing ${hasPersonalStories ? 'draws on personal experience to build connection' : 'maintains a professional distance while remaining approachable'}.`;

  const limitations: string[] = [];
  if (samples.length < 4) limitations.push('Limited sample size');
  if (emojiCount === 0) limitations.push('No emoji usage detected');
  if (!hasExplicitCTA) limitations.push('No explicit calls-to-action');

  const consistency: 'High' | 'Medium' | 'Low' = samples.length >= 4 ? 'Medium' : 'Low';

  return {
    tone: {
      primary: tone,
      secondary: [],
      confidence: 0.6,
    },
    writingStyle: {
      description: writingStyleDesc,
      avgSentenceLength,
      avgParagraphLength,
    },
    personality: {
      traits: [tone],
      description: `Writing maintains a ${tone.toLowerCase()} approach throughout.`,
    },
    structure: {
      description: 'Posts typically open with context and end with a key takeaway or insight.',
      pattern: ['Opens with context or question', 'Develops idea with evidence or story', 'Ends with takeaway'],
    },
    engagement: {
      cta,
      questions,
      emoji,
      emojiFrequency,
    },
    signaturePatterns,
    brandSummary,
    trainingQuality: {
      score: samples.length >= 4 ? 0.6 : 0.45,
      consistency,
      limitations,
    },
  };
}
