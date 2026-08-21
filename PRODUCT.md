# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

MERN-stack: React 18 + TypeScript + Vite (frontend), Express.js + TypeScript (backend), MongoDB + Mongoose (database), Supabase (auth), OpenAI/Anthropic/Gemini (AI services)

## Users

- **Job hunters** building personal brand on LinkedIn
- **Recruiters** sharing industry insights consistently
- **B2B sales professionals** establishing thought leadership
- **Enterprise users** managing professional presence with consistent brand voice

## Product Purpose

Quirk is an AI-powered content generation platform that scrapes trending topics from GitHub Trending, Product Hunt, Hacker News, and TechCrunch, then generates personalized LinkedIn posts (text, carousel frameworks, image prompts). Users can train a personal brand voice by pasting sample posts, enabling consistent, on-brand content creation.

**Success metrics:**
- Signup conversion (landing → magic link sent) > 15%
- Post generation rate (users who generate 1+) > 60%
- Average posts generated per user/week > 10
- Daily digest open rate > 40%
- NPS score > 30

## Positioning

Quirk's differentiating mechanism is **voice-trained AI ghostwriting from trending topics**. While competitors offer AI writing or trend tracking separately, Quirk combines both with personal brand voice training — users paste 3-5 sample posts, the system extracts tone, sentence length, CTA style, and emoji frequency, then injects this into all subsequent generations. This ensures every generated post sounds like the user, not generic AI content.

## Operating Context

- Users discover trending tech topics across multiple sources (GitHub, Product Hunt, Hacker News, TechCrunch)
- Users select a trend and choose post type (text, carousel, image prompt)
- AI generates content in the user's trained voice
- Users copy generated content and post manually on LinkedIn
- Daily digest subscribers receive morning emails with ready-to-post content
- Voice training requires pasting 3-5 sample LinkedIn posts

## Capabilities and Constraints

**Core capabilities:**
- Trend scraping and caching (1-hour TTL) from 4 sources
- AI post generation (text, carousel, image prompt)
- Personal voice training from sample posts
- Daily email digest with generated content
- Post management (history, copy, regenerate, status tracking)

**Technical constraints:**
- Rate limiting: 20 post generations/hour per user
- Trend cache shared across users (reduce external API calls)
- Session persistence via Supabase
- Environment variables for all secrets

**Undecided (v1):**
- AI provider selection (OpenAI default, Anthropic premium toggle planned for v2)
- LinkedIn OAuth and auto-posting (Phase 2)

## Brand Commitments

- **Product name:** Quirk
- **Tagline:** "Your LinkedIn, your quirk"
- **Design direction:** Retro editorial + neo-brutalist + modern SaaS dashboard with soft brutalism
- **Visual personality:** Warm, creative, approachable — clear departure from LinkedIn's cold professionalism
- **Color palette:** Warm pastels (coral, mint, cream) with thick black borders
- **Typography:** Mono headings (Space Mono) + serif body (Playfair Display)
- **Layout:** Split view — left panel for trends, right panel for generation

## Evidence on Hand

- PRD.md with complete product requirements
- Two reference design images (ref1.jpg, ref2.jpg) showing UI patterns to adopt
- Confirmed design direction from user interview

## Product Principles

1. **Voice-first generation:** Every AI output reflects the user's personal brand voice, not generic AI content
2. **Trend-to-post pipeline:** Minimal friction from discovering trending topics to having ready-to-post content
3. **Personality over corporate:** Distinctive, warm design that stands out from typical B2B SaaS tools
4. **Manual posting by design:** Users copy and post manually on LinkedIn (v1), maintaining human control
5. **Progressive enhancement:** Start with core generation, add automation (LinkedIn OAuth) in future phases

## Accessibility & Inclusion

- Standard web accessibility practices (WCAG 2.1 AA target)
- Keyboard navigation support
- Screen reader compatible components
- Responsive design for mobile, tablet, and desktop
