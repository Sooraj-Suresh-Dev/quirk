import { ITrend } from '../models/Trend.js';
import { IUser } from '../models/User.js';
import { Voice } from '../models/Voice.js';
import { generateWithOpenAI } from './openai.js';
import { generateWithAnthropic } from './anthropic.js';
import { generateWithOpenRouter } from './openrouter.js';
import { logError } from '../config/logger.js';

interface GenerateOptions {
  provider?: string;
  model?: string;
  temperature?: number;
}

interface ImagePromptContent {
  prompt: string;
  style: string;
  caption: string;
}

interface CarouselContent {
  caption: string;
  imagePrompts: string[];
}

interface GenerateResult {
  content: string | Record<string, unknown>[];
  fallback: boolean;
}

export async function generatePost(
  trend: ITrend,
  type: 'text' | 'carousel' | 'image-prompt',
  user: IUser,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const { provider = 'openrouter', model, temperature } = options;

  const voiceDoc = await Voice.findOne({ userId: user._id, isActive: true });
  const voice = voiceDoc?.profile;

  const systemPrompt = buildSystemPrompt(user, voice);
  const userPrompt = buildUserPrompt(trend, type);

  let result = '';
  let isFallback = false;

  // Try user's provider key first, then fall through
  const userKey = getUserKey(user, provider);

  try {
    if (userKey) {
      result = await generateWithProvider(provider, userPrompt, systemPrompt, model, temperature, userKey);
    }
  } catch {
    // Fall through
  }

  if (!result) {
    // Try with app key for selected provider
    try {
      result = await generateWithProvider(provider, userPrompt, systemPrompt, model, temperature);
    } catch (err) {
      // Provider has no API key — throw descriptive error instead of silent fallback
      if (provider !== 'openrouter') {
        const providerName = provider === 'openai' ? 'OpenAI' : 'Anthropic';
        throw new Error(`No API key available for ${providerName}. Add your key in Settings or switch to OpenRouter.`);
      }
      logError('OpenRouter failed, using fallback', { error: err });
      result = generateFallbackContent(trend, type) as string;
      isFallback = true;
    }
  }

  if (type === 'carousel') {
    let caption = '';
    let imagePrompts: string[] = [];

    // Step 1: Generate caption using text post prompt (high quality LinkedIn post)
    const captionPrompt = buildUserPrompt(trend, 'text');
    let captionResult = '';

    const captionUserKey = getUserKey(user, provider);
    try {
      if (captionUserKey) {
        captionResult = await generateWithProvider(provider, captionPrompt, buildSystemPrompt(user, voice), model, temperature, captionUserKey);
      }
    } catch {}

    if (!captionResult) {
      try {
        captionResult = await generateWithProvider(provider, captionPrompt, buildSystemPrompt(user, voice), model, temperature);
      } catch {}
    }

    if (captionResult) {
      caption = cleanCaption(captionResult);
    }

    // Step 2: Generate slides with image prompts (using original carousel prompt)
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const slides = JSON.parse(jsonMatch[0]) as Record<string, unknown>[];
        imagePrompts = slides.map((slide) => (slide.imagePrompt as string) || '').filter(Boolean);
      }
    } catch {}

    if (!caption) {
      caption = generateFallbackCarouselCaption();
    }

    const carouselContent: CarouselContent = { caption, imagePrompts };
    return { content: carouselContent as unknown as Record<string, unknown>[], fallback: isFallback };
  }

  if (type === 'image-prompt') {
    let promptText = result;
    let styleText = 'modern editorial';
    let captionText = '';

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        promptText = parsed.prompt || promptText;
        styleText = parsed.style || styleText;
        captionText = parsed.caption || captionText;
      }
    } catch {
      // Use raw result as prompt
    }

    const content: ImagePromptContent = {
      prompt: promptText,
      style: styleText,
      caption: captionText,
    };

    return { content: JSON.stringify(content) as unknown as string, fallback: isFallback };
  }

  // Text post: clean up any leading labels the model may have added
  let cleanResult = result;
  const labelPatterns = [
    /^Here is the post:\s*/i,
    /^Here's the post:\s*/i,
    /^Post:\s*/i,
    /^LinkedIn post:\s*/i,
    /^Text post:\s*/i,
    /^Here's the output for.*:\s*/i,
    /^Here's a.*post.*about.*trend:\s*/i,
    /^Here's a.*LinkedIn.*:\s*/i,
    /^Here's the.*:\s*/i,
    /^Here's a.*viral.*:\s*/i,
    /^Sure,.*:\s*/i,
    /^Below is.*:\s*/i,
    /^Attached is.*:\s*/i,
    /^Here's your.*:\s*/i,
    /^\*\*(.+?)\*\*/g,               // Remove **bold** markers
    /^#+\s*/gm,                       // Remove # heading markers
    /^[*-]\s+/gm,                     // Remove list markers
  ];
  for (const pattern of labelPatterns) {
    cleanResult = cleanResult.replace(pattern, '');
  }
  // Also clean up any remaining ** markers throughout the text
  cleanResult = cleanResult.replace(/\*\*/g, '');
  return { content: cleanResult.trim(), fallback: isFallback };
}

function cleanCaption(text: string): string {
  const patterns = [
    /^Here is the post:\s*/i,
    /^Here's the post:\s*/i,
    /^Post:\s*/i,
    /^LinkedIn post:\s*/i,
    /^Text post:\s*/i,
    /^Here's the output for.*:\s*/i,
    /^Here's a.*post.*about.*trend:\s*/i,
    /^Here's a.*LinkedIn.*:\s*/i,
    /^Here's the.*:\s*/i,
    /^Here's a.*viral.*:\s*/i,
    /^Sure,.*:\s*/i,
    /^Below is.*:\s*/i,
    /^Attached is.*:\s*/i,
    /^Here's your.*:\s*/i,
    /^\*\*(.+?)\*\*/g,               // Remove **bold** markers
    /^#+\s*/gm,                       // Remove # heading markers
    /^[*-]\s+/gm,                     // Remove list markers
  ];
  let cleaned = text;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  // Also clean up any remaining ** markers throughout the text
  cleaned = cleaned.replace(/\*\*/g, '');
  return cleaned.trim();
}

function getUserKey(user: IUser, provider: string): string | undefined {
  switch (provider) {
    case 'openai':
      return user.preferences?.openaiKey;
    case 'anthropic':
      return user.preferences?.anthropicKey;
    default:
      return undefined;
  }
}

async function generateWithProvider(
  provider: string,
  prompt: string,
  systemPrompt: string,
  model?: string,
  temperature?: number,
  userApiKey?: string
): Promise<string> {
  switch (provider) {
    case 'openai':
      return generateWithOpenAI(prompt, systemPrompt, model, temperature, userApiKey);
    case 'anthropic':
      return generateWithAnthropic(prompt, systemPrompt, model, temperature, userApiKey);
    case 'openrouter':
      return generateWithOpenRouter(prompt, systemPrompt, model, temperature);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function buildSystemPrompt(user: IUser, voice?: {
  tone: { primary: string; secondary: string[]; confidence: number };
  writingStyle: { description: string; avgSentenceLength: number; avgParagraphLength: number };
  personality: { traits: string[]; description: string };
  structure: { description: string; pattern: string[] };
  engagement: { cta: string; questions: string; emoji: string };
  signaturePatterns: string[];
  contentPatterns?: { topics: string[]; audienceType: string };
  generation?: {
    formality: string;
    energy: string;
    firstPersonUsage: string;
    sentenceComplexity: string;
    vocabulary: string;
    evidenceUsage: string;
    opinionStrength: string;
  };
  brandSummary: string;
}): string {

  let prompt = `You are a world-class LinkedIn content strategist and ghostwriter. Your posts sound like a sharp tech leader sharing genuine insight — never like AI-generated content.

OUTPUT RULES:
- Start directly with the hook (first line of the post)
- Output ONLY the post text — no labels, no "Here is the post:", no explanations
- End with 2-3 relevant hashtags (e.g. #AI #Productivity #Startups)

YOUR PROCESS (follow this order):
1. READ the trend data carefully — title, summary, tags, metrics
2. ANALYZE: Answer these silently before writing:
   - What is this? (1 sentence)
   - Why does it matter? (who benefits, what problem it solves)
   - What's unique? (what hasn't been said yet)
   - Who should care? (specific roles/industries)
3. WRITE the post using the STRUCTURE below
4. VERIFY: Does every sentence earn its place? Cut anything generic.

ABSOLUTE RULES:
- Write in first person, as if YOU are the thought leader
- NEVER include source metadata in the post text:
  * No "Posted by [author]" or "Posted by mandarinclips"
  * No "[N] points" or "[N] comments"
  * No "Show HN:" or "GitHub:" prefixes
  * These are for YOUR analysis only, not for the reader
- NEVER use these AI clichés:
  * "I'm excited to share"
  * "In today's fast-paced world"
  * "The best part?"
  * "Here's the thing"
  * "Let's dive in"
  * "Here's what you need to know"
  * "This is huge"
  * "Mind = blown"
  * "Here is the post:"
- Use SPECIFIC data from the trend — numbers, names, concrete details
- Short paragraphs (1-2 sentences). White space is your friend.
- The hook (first line) must stop the scroll — see hook formulas below
- 2-3 relevant hashtags at the end. No hashtag stuffing.
- 1-2 emojis max. No emoji spam.

HOOK FORMULAS (pick ONE that fits best):
- Bold claim: "[Thing] just became the [X] of [Y]."
- Data hook: "[Number] teams switched to [X] this week. Here's why."
- Story: "I tested [X] for 30 days. Here's what happened."
- Warning: "If you're still using [X], you're leaving money on the table."
- Question: "Why is nobody talking about [specific aspect]?"
- Pattern interrupt: A surprising fact or contrarian take

STRUCTURE:
1. Hook (1 sentence) — Pattern interrupt, bold claim, or curiosity gap
2. Context (2-3 sentences) — What this actually is, in plain language. Use the summary.
3. Analysis (3-4 sentences) — Why it matters. What's unique. Specific data points from the trend.
4. Take (1-2 sentences) — Your prediction or contrarian insight
5. CTA (1 sentence) — Specific question that invites real discussion
6. Hashtags (2-3 at the end)

CTA RULES:
- Ask something SPECIFIC to this trend
- Good: "What indexing bottleneck are you dealing with?"
- Good: "Would you switch from Elasticsearch for this?"
- Bad: "What do you think?" (too vague)
- Bad: "Is this overhyped?" (binary, low-effort)
- Bad: "Like if you agree!" (engagement bait)

LENGTH: 120-180 words. Tight and punchy.
- Under 120: Not enough depth
- Over 180: Too long — cut the fat

EXAMPLE OUTPUT (for a different topic):
"Rust just quietly became the language of infrastructure.

An open-source indexing engine hit GitHub trending this week. Built entirely in Rust. Here's why the timing matters.

Most teams doing search or full-text indexing are stuck between two bad options: slow PostgreSQL queries or expensive Elasticsearch clusters. Both have operational overhead that slows down small teams.

Rust changes the math. Memory-safe, no GC pauses, native parallelism. If this project delivers, it could be the SQLite of search — lightweight, embeddable, fast enough for production.

The shift from managed services to embeddable Rust components is real. Teams building data pipelines should be watching this space.

What's your current indexing setup, and what's the biggest pain point?

#Rust #OpenSource #Infrastructure"
`;

  if (voice) {
    prompt += `
VOICE PROFILE (follow these rules EXACTLY):

TONE: ${voice.tone.primary}
${voice.tone.secondary.length > 0 ? `Secondary tones: ${voice.tone.secondary.join(', ')}` : ''}

PERSONALITY: ${voice.personality.description}
${voice.personality.traits.length > 0 ? `Key traits: ${voice.personality.traits.join(', ')}` : ''}

WRITING STYLE:
- ${voice.writingStyle.description}
- Average sentence length: ${voice.writingStyle.avgSentenceLength} words
- Average paragraph length: ${voice.writingStyle.avgParagraphLength} words

STRUCTURE: ${voice.structure.description}
${voice.structure.pattern.length > 0 ? `Pattern: ${voice.structure.pattern.join(' → ')}` : ''}

ENGAGEMENT:
- CTA: ${voice.engagement.cta}
- Questions: ${voice.engagement.questions}
- Emoji: ${voice.engagement.emoji}

${voice.signaturePatterns.length > 0 ? `SIGNATURE PATTERNS:\n${voice.signaturePatterns.map((p: string) => `- ${p}`).join('\n')}` : ''}
`;

    if (voice.contentPatterns) {
      prompt += `
CONTENT FOCUS:
- Topics: ${voice.contentPatterns.topics.join(', ')}
- Audience: ${voice.contentPatterns.audienceType}
`;
    }

    if (voice.generation) {
      const g = voice.generation;
      prompt += `
GENERATION RULES:
- Formality: ${g.formality}${g.formality === 'Formal' ? ' — no contractions, structured, third-person' : g.formality === 'Casual' ? ' — conversational, first-person heavy, informal language' : ' — polished but approachable, contractions OK'}
- Energy: ${g.energy}${g.energy === 'High' ? ' — energetic, punchy, use exclamations' : g.energy === 'Low' ? ' — calm, measured, reflective' : ' — balanced, steady'}
- First-person usage: ${g.firstPersonUsage}${g.firstPersonUsage === 'Frequent' ? ' — write from "I" perspective throughout' : g.firstPersonUsage === 'Minimal' ? ' — avoid first-person, focus on insights' : ' — mix first-person with general observations'}
- Sentence complexity: ${g.sentenceComplexity}
- Vocabulary: ${g.vocabulary}
- Evidence/data usage: ${g.evidenceUsage}${g.evidenceUsage === 'High' ? ' — include specific numbers, data points, and sources' : g.evidenceUsage === 'None' ? ' — focus on opinion and observation, no data' : ''}
- Opinion strength: ${g.opinionStrength}${g.opinionStrength === 'Strong' ? ' — make definitive claims, take contrarian positions' : g.opinionStrength === 'Neutral' ? ' — present balanced perspectives' : ' — clear opinion with nuance'}
`;
    }

    prompt += `
MANDATORY RULES FOR VOICE MATCHING:
1. Use personal experience — write from "I" perspective, share real observations or lessons learned.
2. Show humility — avoid "revolutionizing", "game-changing", "disrupting". Let the insight speak for itself.
3. Include empathy — acknowledge the reader's challenges before offering your view.
4. Follow the structure pattern exactly as listed above.
5. CTA style is ${voice.engagement.cta} — if "None", do NOT include any call-to-action.
6. Question frequency is ${voice.engagement.questions} — if "None", do NOT include any questions.
7. Emoji usage is ${voice.engagement.emoji} — follow this level strictly.
`;
  }

  return prompt;
}

function buildUserPrompt(trend: ITrend, type: 'text' | 'carousel' | 'image-prompt'): string {
  const topic = trend.title;
  const summary = trend.summary;
  const tags = trend.tags?.length ? trend.tags.join(', ') : 'technology';
  const source = trend.source === 'github' ? 'GitHub trending' : 'Product Hunt top product';

  let metricsContext = '';
  if (trend.source === 'github') {
    metricsContext = `GitHub stats: ${trend.stars?.toLocaleString() || 'N/A'} stars, ${trend.forks?.toLocaleString() || 'N/A'} forks`;
  } else {
    metricsContext = `Product Hunt stats: ${trend.votes || 'N/A'} votes`;
  }

  switch (type) {
    case 'text':
      return `Write a viral LinkedIn text post about this trend.

TOPIC: "${topic}"
SUMMARY: ${summary}
TAGS: ${tags}
METRICS: ${metricsContext}

IMPORTANT: The data above is for YOUR analysis only. Do NOT include "Posted by", "points", "comments", or source prefixes in the post.

YOUR TASK — follow this process:
1. Read the summary and tags
2. Answer silently: "Why would a tech leader on LinkedIn care about this?"
3. Write the post using the STRUCTURE from your system instructions
4. Verify: Is every sentence specific to THIS trend? Cut anything generic.

STRUCTURE:
- Hook (1 sentence) — Bold claim or curiosity gap about THIS specific topic
- Context (2-3 sentences) — What this actually is, using the summary
- Analysis (3-4 sentences) — Why it matters, what's unique, specific data from the trend
- Take (1-2 sentences) — Your prediction or insight
- CTA (1 sentence) — Specific question about THIS trend's impact

FORMAT: Plain text with line breaks. No markdown. No bullet points.
LENGTH: 120-200 words. Every sentence must add value.`;

    case 'carousel':
      return `Create a viral LinkedIn carousel (5 slides) about this trending topic.

TOPIC: "${topic}"
SUMMARY: ${summary}
TAGS: ${tags}
METRICS: ${metricsContext}

IMPORTANT: The data above is for YOUR analysis only. Do NOT include source metadata in slide content.

CAROUSEL STRATEGY:
- Slide 1: Hook — bold claim or curiosity gap. Must stop the scroll.
- Slides 2-4: Each slide = ONE specific insight with data from the trend. No generic points.
- Slide 5: Summary + specific CTA question

Each slide teaches something concrete. No filler. No bullet point lists.

SLIDE RULES:
- Headings: max 8 words, punchy, scannable
- Body: 2-3 sentences with specific details from the trend data
- Image prompts: concrete visuals, not abstract concepts
- Each slide stands alone but flows as a story

Return as JSON array:
[
  { "heading": "Slide title", "body": "Specific insight with data", "imagePrompt": "Concrete visual description" }
]

Return ONLY the JSON array.`;

    case 'image-prompt':
      return `Create an AI image generation prompt for a LinkedIn post about this trending topic.

TOPIC: "${topic}"
SUMMARY: ${summary}
TAGS: ${tags}

The image must:
- Stop the scroll in a LinkedIn feed
- Visually represent the CORE IDEA of this specific trend
- Work as a standalone image that makes people want to read the post
- Be professional but distinctive (not generic stock photo style)

Be SPECIFIC about composition, colors, style, and mood. Reference the actual content of the trend.

Return as JSON:
{
  "prompt": "Very detailed DALL-E/Midjourney prompt with specific composition, lighting, colors, and style",
  "style": "One-line style descriptor",
  "caption": "Engaging LinkedIn caption for the image (specific to this trend)"
}

Return ONLY the JSON object.`;
  }
}

function generateFallbackContent(trend: ITrend, type: 'text' | 'carousel' | 'image-prompt'): string | Record<string, unknown>[] {
  const topic = trend.title;
  const summary = trend.summary;
  const tags = trend.tags?.length ? trend.tags.join(', ') : '';

  // Extract meaningful parts from the topic (remove prefixes like "Show HN:", repo paths, etc.)
  const cleanTopic = topic
    .replace(/^Show HN:\s*/i, '')
    .replace(/^Ask HN:\s*/i, '')
    .replace(/^Show .*? — /i, '')
    .replace(/^[^/]+\//, '') // Remove GitHub user prefix
    .trim();

  // Get first meaningful sentence from summary
  const summarySentences = summary.split(/\.\s+/).filter(s => s.length > 15);
  const firstSentence = summarySentences[0] || summary;
  const secondSentence = summarySentences[1] || '';

  if (type === 'text') {
    let post = `${cleanTopic} just caught my attention.\n\n`;
    post += `${firstSentence}${secondSentence ? '. ' + secondSentence : ''}.\n\n`;

    if (tags) {
      post += `This sits at the intersection of ${tags}. The timing matters — these kinds of projects gain momentum fast once the community catches on.\n\n`;
    } else {
      post += `The timing matters — these kinds of projects gain momentum fast once the community catches on.\n\n`;
    }

    post += `Worth keeping an eye on. The teams who explore this early usually end up ahead of the curve.\n\n`;
    post += `What's your current approach to this?`;

    return post;
  }

  if (type === 'carousel') {
    return [
      { heading: cleanTopic, body: firstSentence || 'Here\'s what you need to know about this trending topic.', imagePrompt: `Modern tech illustration representing ${cleanTopic}` },
      { heading: 'Why It Matters', body: secondSentence || 'This trend is shaping how the industry approaches this space.', imagePrompt: 'Impact visualization showing industry transformation' },
      { heading: 'Key Details', body: tags ? `This touches ${tags} — a space that\'s evolving fast.` : 'The technical details here are worth understanding.', imagePrompt: 'Close-up detail illustration with warm tones' },
      { heading: 'What Most Miss', body: 'The real value isn\'t in the tool itself — it\'s in how it changes your workflow.', imagePrompt: 'Before/after comparison or workflow diagram' },
      { heading: 'Stay Ahead', body: 'The teams exploring this now will have the advantage later. What\'s your take?', imagePrompt: 'Forward-looking scene with editorial lighting' },
    ];
  }

  return JSON.stringify({
    prompt: `Professional editorial illustration about ${cleanTopic}, showing the intersection of technology and innovation, warm color palette with coral and cream tones, modern minimalist style with bold geometric elements, clean composition suitable for LinkedIn feed`,
    style: 'warm editorial, modern minimalist',
    caption: `${cleanTopic} — worth watching closely`,
  });
}

function parseCarouselFallback(text: string): Record<string, unknown>[] {
  const slides = text.split(/slide\s*\d+/i).filter(s => s.trim().length > 0).slice(0, 5);

  return slides.map((slide, i) => ({
    heading: `Slide ${i + 1}`,
    body: slide.trim(),
    imagePrompt: 'Tech illustration with warm colors',
  }));
}

function generateCarouselCaption(slides: Record<string, unknown>[]): string {
  if (slides.length === 0) return '';

  const parts: string[] = [];

  for (const slide of slides) {
    const heading = slide.heading as string;
    const body = slide.body as string;
    if (heading) parts.push(heading);
    if (body) parts.push(body);
  }

  return parts.join('\n\n');
}

function generateFallbackCarouselCaption(): string {
  return 'Check out this carousel for more insights. Swipe through to see the full breakdown.';
}
