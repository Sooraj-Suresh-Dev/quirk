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
  contentPatterns: {
    topics: string[];
    audienceType: string;
  };
  generation: {
    formality: 'Formal' | 'Professional' | 'Casual';
    energy: 'Low' | 'Medium' | 'High';
    firstPersonUsage: 'Minimal' | 'Moderate' | 'Frequent';
    sentenceComplexity: 'Simple' | 'Medium' | 'Complex';
    vocabulary: 'Simple' | 'Simple-Technical Mix' | 'Technical' | 'Advanced';
    evidenceUsage: 'None' | 'Low' | 'Medium' | 'High';
    opinionStrength: 'Neutral' | 'Moderate' | 'Strong';
  };
  brandSummary: string;
  trainingQuality: {
    score: number;
    consistency: string;
    limitations: string[];
  };
}

const TONE_OPTIONS = [
  'Confident', 'Analytical', 'Practical', 'Conversational',
  'Thoughtful', 'Bold', 'Professional', 'Empathetic', 'Persuasive',
];

const QUESTIONS_OPTIONS = ['None', 'Rare', 'Occasional', 'Frequent'] as const;
const EMOJI_OPTIONS = ['None', 'Low', 'Medium', 'High'] as const;
const CTA_OPTIONS = ['None', 'Soft', 'Direct'] as const;
const CONSISTENCY_OPTIONS = ['High', 'Medium', 'Low'];
const FORMALITY_OPTIONS = ['Formal', 'Professional', 'Casual'] as const;
const ENERGY_OPTIONS = ['Low', 'Medium', 'High'] as const;
const FIRST_PERSON_OPTIONS = ['Minimal', 'Moderate', 'Frequent'] as const;
const SENTENCE_COMPLEXITY_OPTIONS = ['Simple', 'Medium', 'Complex'] as const;
const VOCABULARY_OPTIONS = ['Simple', 'Simple-Technical Mix', 'Technical', 'Advanced'] as const;
const EVIDENCE_OPTIONS = ['None', 'Low', 'Medium', 'High'] as const;
const OPINION_STRENGTH_OPTIONS = ['Neutral', 'Moderate', 'Strong'] as const;

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
  const systemPrompt = `You are an expert at analyzing LinkedIn writing style. You separate HOW someone writes (voice) from WHAT they write about (content patterns).

VOICE ANALYSIS — How the author writes:

TONE: The personality projected through writing style. Options: Confident, Analytical, Practical, Conversational, Thoughtful, Bold, Professional, Empathetic, Persuasive. Only classify traits that appear in 2+ posts. Do NOT infer "humorous" unless humor is clearly and consistently present.

WRITING STYLE: Sentence rhythm, directness, paragraph structure, whitespace usage, first-person frequency, level of formality.

PERSONALITY: Traits consistently projected through writing. Only include traits that are well-supported by multiple posts.

STRUCTURE: How ideas are organized — opening patterns, body flow, closing patterns.

CTA (Call-to-Action): Exists ONLY when the author explicitly encourages the reader to take an action. A strong conclusion or direct style is NOT a CTA.

RHETORICAL QUESTIONS: Count as a minor writing tendency, NOT a defining trait. Only classify as "Occasional" or "Frequent" if questions appear in most posts.

CONTENT PATTERNS — What the author writes about:

TOPICS: The recurring subject areas (e.g., startup insights, GTM strategy, product launches, customer stories, engineering culture). Identify 2-4 topics.
AUDIENCE TYPE: Who they write for (Founders, PMs, Engineers, Marketers, General Tech, etc.).

GENERATION CONTROLS — Direct instructions for post generation:

FORMALITY: "Formal" = structured, no contractions, third-person | "Professional" = polished but approachable, contractions OK | "Casual" = conversational, first-person heavy, informal language.

ENERGY: "Low" = calm, measured, reflective | "Medium" = balanced, steady | "High" = energetic, punchy, exclamation-heavy.

FIRST-PERSON USAGE: "Minimal" = rarely uses first-person | "Moderate" = occasional | "Frequent" = writes from personal perspective regularly.

SENTENCE COMPLEXITY: "Simple" = short, punchy, often fragments | "Medium" = varied length, clear structure | "Complex" = longer, multi-clause sentences.

VOCABULARY: "Simple" = everyday language, no jargon | "Simple-Technical Mix" = plain language with occasional domain terms | "Technical" = frequent industry/technical vocabulary | "Advanced" = sophisticated vocabulary.

EVIDENCE/DATA USAGE: "None" = pure opinion | "Low" = occasional reference | "Medium" = regular data points | "High" = data-driven, specific numbers and sources.

OPINION STRENGTH: "Neutral" = balanced, presents multiple sides | "Moderate" = clear opinion with nuance | "Strong" = definitive claims, contrarian takes.

Return ONLY valid JSON matching this exact structure:

\`\`\`json
{
  "tone": {
    "primary": "string (ONE primary tone from the options)",
    "secondary": ["string (up to 2 secondary tones if strongly evidenced, otherwise empty array)"],
    "confidence": "number 0-1"
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
    "pattern": ["string (recurring structural patterns)"]
  },
  "engagement": {
    "cta": "None | Soft | Direct",
    "questions": "None | Rare | Occasional | Frequent",
    "emoji": "None | Low | Medium | High",
    "emojiFrequency": "number (percentage of posts with emoji)"
  },
  "signaturePatterns": ["string (2-4 recurring writing patterns)"],
  "contentPatterns": {
    "topics": ["string (2-4 recurring subject areas)"],
    "audienceType": "string (who they write for)"
  },
  "generation": {
    "formality": "Formal | Professional | Casual",
    "energy": "Low | Medium | High",
    "firstPersonUsage": "Minimal | Moderate | Frequent",
    "sentenceComplexity": "Simple | Medium | Complex",
    "vocabulary": "Simple | Simple-Technical Mix | Technical | Advanced",
    "evidenceUsage": "None | Low | Medium | High",
    "opinionStrength": "Neutral | Moderate | Strong"
  },
  "brandSummary": "string (2-3 sentences combining tone, personality, and communication approach)",
  "trainingQuality": {
    "score": "number 0-1",
    "consistency": "High | Medium | Low",
    "limitations": ["string (1-3 limitations)"]
  }
}
\`\`\`

CRITICAL RULES:
- Do NOT infer traits from a single occurrence. If humor appears once, do NOT mark tone as "Humorous".
- If rhetorical questions appear but are not dominant, mark questions as "Rare" or "Occasional" — not "Frequent".
- Content patterns describe TOPICS, not voice. "Startup insights" is a content pattern, not a tone.
- Be conservative with "High" energy and "Strong" opinion — most professional writers are "Medium" energy and "Moderate" opinion.

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

    const contentPatterns = {
      topics: validateArray(profile.contentPatterns?.topics, []),
      audienceType: validateString(profile.contentPatterns?.audienceType, 'General Tech'),
    };

    const gen = profile.generation || {};
    const generation = {
      formality: validateEnum(gen.formality, 'Professional', FORMALITY_OPTIONS) as 'Formal' | 'Professional' | 'Casual',
      energy: validateEnum(gen.energy, 'Medium', ENERGY_OPTIONS) as 'Low' | 'Medium' | 'High',
      firstPersonUsage: validateEnum(gen.firstPersonUsage, 'Moderate', FIRST_PERSON_OPTIONS) as 'Minimal' | 'Moderate' | 'Frequent',
      sentenceComplexity: validateEnum(gen.sentenceComplexity, 'Medium', SENTENCE_COMPLEXITY_OPTIONS) as 'Simple' | 'Medium' | 'Complex',
      vocabulary: validateEnum(gen.vocabulary, 'Simple-Technical Mix', VOCABULARY_OPTIONS) as 'Simple' | 'Simple-Technical Mix' | 'Technical' | 'Advanced',
      evidenceUsage: validateEnum(gen.evidenceUsage, 'Medium', EVIDENCE_OPTIONS) as 'None' | 'Low' | 'Medium' | 'High',
      opinionStrength: validateEnum(gen.opinionStrength, 'Moderate', OPINION_STRENGTH_OPTIONS) as 'Neutral' | 'Moderate' | 'Strong',
    };

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
      contentPatterns,
      generation,
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

  // --- Voice: tone ---
  let tone = 'Professional';
  if (hasPersonalStories && questionCount > 2) tone = 'Thoughtful';
  else if (exclamationCount > 4) tone = 'Confident';
  else if (hasIndustryJargon) tone = 'Analytical';

  // --- Voice: formality ---
  const hasContractions = /(?:don't|won't|can't|isn't|it's|I'm|we're|they're|you're)/i.test(allText);
  const hasThirdPerson = /\b(he|she|they|one|the company|the team)\b/i.test(allText) && firstPersonCount < 3;
  let formality: 'Formal' | 'Professional' | 'Casual' = 'Professional';
  if (!hasContractions && hasThirdPerson) formality = 'Formal';
  else if (hasContractions && firstPersonCount > 5) formality = 'Casual';

  // --- Voice: energy ---
  let energy: 'Low' | 'Medium' | 'High' = 'Medium';
  if (exclamationCount > 4) energy = 'High';
  else if (exclamationCount <= 1 && sentences.length > 5) energy = 'Low';

  // --- Voice: first-person usage ---
  const firstPersonRate = firstPersonCount / Math.max(sentences.length, 1);
  let firstPersonUsage: 'Minimal' | 'Moderate' | 'Frequent' = 'Moderate';
  if (firstPersonRate > 0.5) firstPersonUsage = 'Frequent';
  else if (firstPersonRate < 0.1) firstPersonUsage = 'Minimal';

  // --- Voice: sentence complexity ---
  let sentenceComplexity: 'Simple' | 'Medium' | 'Complex' = 'Medium';
  if (avgSentenceLength < 10) sentenceComplexity = 'Simple';
  else if (avgSentenceLength > 20) sentenceComplexity = 'Complex';

  // --- Voice: vocabulary ---
  let vocabulary: 'Simple' | 'Simple-Technical Mix' | 'Technical' | 'Advanced' = 'Simple-Technical Mix';
  if (!hasIndustryJargon && avgSentenceLength < 12) vocabulary = 'Simple';
  else if (hasIndustryJargon && words.length > 200) vocabulary = 'Technical';

  // --- Voice: evidence/data usage ---
  const dataPatterns = /\b(\d+%|\d+x|\$\d+|\d+ (?:users|customers|companies|teams|projects|developers))\b/gi;
  const dataMatches = allText.match(dataPatterns) || [];
  let evidenceUsage: 'None' | 'Low' | 'Medium' | 'High' = 'Low';
  if (dataMatches.length > 4) evidenceUsage = 'High';
  else if (dataMatches.length > 1) evidenceUsage = 'Medium';
  else if (dataMatches.length === 0) evidenceUsage = 'None';

  // --- Voice: opinion strength ---
  const opinionPatterns = /\b(must|should|never|always|best|worst|only way|game changer|overrated|underrated)\b/gi;
  const opinionMatches = allText.match(opinionPatterns) || [];
  let opinionStrength: 'Neutral' | 'Moderate' | 'Strong' = 'Moderate';
  if (opinionMatches.length > 4) opinionStrength = 'Strong';
  else if (opinionMatches.length <= 1) opinionStrength = 'Neutral';

  // --- Engagement ---
  let cta: 'None' | 'Soft' | 'Direct' = 'None';
  if (hasExplicitCTA) {
    cta = questionCount > sentences.length * 0.2 ? 'Soft' : 'Direct';
  }

  // Rhetorical questions: minor tendency, not defining trait
  let questions: 'None' | 'Rare' | 'Occasional' | 'Frequent' = 'Rare';
  if (questionsPerSample > 1.5) questions = 'Frequent';
  else if (questionsPerSample > 0.5) questions = 'Occasional';

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

  // --- Content patterns (heuristic: basic topic detection) ---
  const topics: string[] = [];
  if (/startup|founder|fundrais|seed|series [a-z]/i.test(allText)) topics.push('startup insights');
  if (/product|feature|launch|ship|roadmap/i.test(allText)) topics.push('product development');
  if (/growth|gtm|go.to.market|acquisition|pipeline|revenue/i.test(allText)) topics.push('GTM strategy');
  if (/customer|client|success stor|testimonial/i.test(allText)) topics.push('customer stories');
  if (/engineer|code|infra|deploy|technical|api/i.test(allText)) topics.push('engineering');
  if (topics.length === 0) topics.push('tech industry');

  let audienceType = 'General Tech';
  if (/founder|ceo|startup|funding/i.test(allText)) audienceType = 'Founders';
  else if (/pm|product manage|roadmap|feature priorit/i.test(allText)) audienceType = 'Product Managers';
  else if (/engineer|developer|code|deploy/i.test(allText)) audienceType = 'Engineers';
  else if (/market|growth|pipeline|content|brand/i.test(allText)) audienceType = 'Marketers';

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
    contentPatterns: {
      topics,
      audienceType,
    },
    generation: {
      formality,
      energy,
      firstPersonUsage,
      sentenceComplexity,
      vocabulary,
      evidenceUsage,
      opinionStrength,
    },
    brandSummary,
    trainingQuality: {
      score: samples.length >= 4 ? 0.6 : 0.45,
      consistency,
      limitations,
    },
  };
}
