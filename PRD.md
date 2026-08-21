# Quirk — Product Requirements Document (PRD)

**Tagline:** Your LinkedIn, your quirk

---

## 1. Product Overview

**Product Name:** Quirk
**Type:** MERN-stack SaaS Web Application
**Tagline:** Your LinkedIn, your quirk

**Core Functionality:** An AI-powered content generation platform that scrapes trending topics from GitHub Trending, Product Hunt, Hacker News, and TechCrunch — then generates personalized LinkedIn posts (text, carousel frameworks, image prompts) using AI. Users can train a personal brand voice by pasting sample posts.

**Target Users:**
- Job hunters building personal brand
- Recruiters sharing industry insights
- B2B sales professionals establishing thought leadership
- Enterprise users managing professional presence

**Launch Phase:** v1 (MVP) — Local development + Vercel deployment (Phase 2)

---

## 2. Value Proposition

| For | Problem | Solution |
|---|---|---|
| Job hunters | Spend hours staring at blank post composer | One-click post from trending topics |
| Recruiters | Hard to consistently share industry knowledge | Daily digest with ready-to-post content |
| B2B sales | No time to research trends + write posts | Automated trend detection + AI ghostwriting |
| Enterprise | Inconsistent brand voice across employees | Voice training ensures on-brand content |

---

## 3. User Journey

### Anonymous User (Pre-signup)
1. Lands on homepage → reads hero + feature overview
2. Browses app freely (sees sample trend cards, example generated posts)
3. Clicks "Get Started" → enters email → receives magic link
4. Clicks magic link → redirected to Dashboard (account auto-created)

### Authenticated User (Post-signup)
1. First login → prompted to train voice (or skip)
2. Dashboard shows:
   - Today's trending topics (from preferred sources)
   - Quick Generate panel
   - Recent generated posts
3. User selects trend → chooses post type → clicks Generate
4. AI returns post → user copies → posts manually on LinkedIn

### Voice-Trained User
1. Same as above, but AI writes in their personal brand voice
2. Voice profile shown on profile/settings page

### Daily Digest Subscriber
1. Receives email each morning at configured time
2. Email contains 3 generated text posts + carousel + image prompt
3. Clicks "View Dashboard" → reviews/edits → posts

---

## 4. Feature Requirements

### 4.1 Authentication
- Magic link email (no passwords)
- Anonymous browsing until post creation triggers account creation
- Session persistence via Supabase
- Sign out functionality

### 4.2 Trend Discovery
- **Sources:**
  - GitHub Trending (tech repos)
  - Product Hunt (product launches)
  - Hacker News (top stories)
  - TechCrunch (tech news)
- Cache trends in MongoDB (1-hour TTL)
- Deduplicate by title similarity
- Filter by source
- Display: title, source badge, summary snippet, link

### 4.3 Post Generation
- **Types:**
  - Text post (hook + body + CTA)
  - Carousel (5-slide structure: title, point 1-3, conclusion)
  - Image prompt (Gemini-ready prompt + caption)
- **AI Providers:**
  - OpenAI GPT-4o mini (default)
  - Anthropic Claude (premium toggle in v2)
- **Voice:**
  - User pastes 3–5 sample LinkedIn posts
  - System extracts: tone, sentence length, CTA style, emoji frequency
  - Injects into AI system prompt

### 4.4 Personal Voice Training
- Input: 5 textareas for pasting sample posts
- Analysis output: Voice profile summary displayed to user
- Stored in User model, used in all subsequent generations

### 4.5 Daily Digest
- Configurable delivery time (default: 9:00 AM)
- In-app notification badge on dashboard
- Email digest (HTML template) via Resend API
- Contents: 3 text posts + 1 carousel + 1 image prompt

### 4.6 Post Management
- View history of generated posts
- Copy to clipboard (one-click)
- Regenerate (new AI generation)
- Mark as "Posted" (status tracking)
- Delete post

### 4.7 User Preferences
- Preferred trend sources (checkboxes)
- Digest delivery time
- AI provider selection (v2)
- Email notification toggle

---

## 5. Technical Architecture

### 5.1 Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Google Fonts (Space Mono, Playfair Display) |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Express.js + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | Supabase (email magic link) |
| AI Text | OpenAI GPT-4o mini, Anthropic Claude, Opensource LLM |
| AI Image | Google Gemini 1.5 Flash |
| Cron Jobs | node-cron |
| Email | Supabase Edge Functions + Resend |
| Hosting | Vercel (Phase 2) |

### 5.2 Data Models

```
User {
  email: string (unique)
  supabaseId: string
  voiceSamples: string[]
  voiceProfile: {
    tone: string
    avgSentenceLength: number
    ctaStyle: string
    emojiFrequency: number
  }
  preferences: {
    sources: string[]        // ['github', 'producthunt', 'hackernews', 'techcrunch']
    digestTime: string       // "09:00"
    emailDigest: boolean
  }
  createdAt: Date
}

Trend {
  source: enum
  title: string
  url: string
  summary: string
  tags: string[]
  fetchedAt: Date
  expiresAt: Date            // TTL index
}

Post {
  userId: ObjectId
  trendId: ObjectId
  content: string | CarouselSlide[] | ImagePrompt
  type: 'text' | 'carousel' | 'image-prompt'
  status: 'generated' | 'copied' | 'posted'
  createdAt: Date
}

CarouselSlide {
  heading: string
  body: string
  imagePrompt: string
}

ImagePrompt {
  prompt: string
  style: string
  caption: string
}
```

### 5.3 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/magic-link` | Public | Send magic link email |
| GET | `/api/auth/session` | Required | Get current session |
| POST | `/api/auth/logout` | Required | Sign out |
| GET | `/api/trends` | Public | List cached trends |
| POST | `/api/trends/refresh` | Required | Force-refresh trends |
| GET | `/api/posts` | Required | List user's generated posts |
| POST | `/api/posts/generate` | Required | Generate new post |
| PATCH | `/api/posts/:id` | Required | Update post status |
| DELETE | `/api/posts/:id` | Required | Delete post |
| GET | `/api/users/profile` | Required | Get user profile + voice |
| PUT | `/api/users/voice` | Required | Save voice samples |
| PUT | `/api/users/preferences` | Required | Update preferences |

### 5.4 External APIs

| Service | Purpose | Limits |
|---|---|---|
| GitHub API | Trending repos | 60 req/hr (unauthenticated) |
| Product Hunt API | Product launches | Requires API key |
| Hacker News Firebase | Top stories | Rate-limited |
| TechCrunch RSS | News feed | None |
| OpenAI API | Text generation | $0.075/1M tokens (4o-mini) |
| Anthropic API | Text generation (v2) | $3/1M tokens (Haiku) |
| Gemini API | Image prompts | Free tier available |
| Supabase Auth | Magic link + session | Free tier |
| Resend | Email delivery | 100 emails/day (free) |

---

## 6. UI/UX Requirements

### 6.1 Pages

| Page | Access | Description |
|---|---|---|
| `/` (Landing) | Public | Hero, features, CTA |
| `/dashboard` | Auth required | Trends + generation + history |
| `/trends` | Auth required | Full trend feed with filters |
| `/voice` | Auth required | Voice training interface |
| `/settings` | Auth required | Preferences |

### 6.2 Design System

**Design Direction:** Retro editorial + neo-brutalist + modern SaaS dashboard with soft brutalism

**Color Palette:**
- **Primary:** Warm Coral (#E8725C) — CTAs, active states, primary actions
- **Secondary:** Sage Mint (#8FB8A8) — Secondary actions, success states
- **Background:** Warm Cream (#F5F0E8) — Main background
- **Surface:** Soft White (#FDFBF7) — Cards, panels
- **Accent:** Dusty Rose (#D4A5A5) — Highlights, badges
- **Text Primary:** Charcoal (#2D2D2D) — Headings, body text
- **Text Secondary:** Warm Gray (#6B6B6B) — Labels, metadata
- **Border:** Deep Black (#1A1A1A) — Neo-brutalist borders

**Typography:**
- **Headings:** Space Mono (monospace) — Bold, uppercase for H1-H3
- **Body:** Playfair Display (serif) — Regular for content
- **UI Elements:** Space Mono — Buttons, labels, captions

**Neo-Brutalist Elements:**
- **Borders:** 3px solid #1A1A1A on primary cards, 2px on buttons/inputs
- **Shadows:** Offset shadows (4px 4px 0px #1A1A1A) with hover expansion
- **Border Radius:** 12px (cards), 8px (buttons/inputs), 20px (pills)
- **Style:** Soft brutalism — rounded corners with thick black borders

### 6.2.1 Design Principles

1. **Personality Over Corporate:** Distinctive, warm, and approachable — a clear departure from LinkedIn's cold professionalism
2. **Soft Brutalism:** Thick black borders and offset shadows create structure without harshness
3. **Editorial Typography:** Monospace headings for retro-tech feel, serif body for readability
4. **Warm Palette:** Pastel colors create inviting, creative atmosphere
5. **Split View Layout:** Left panel for trends, right panel for generation — optimized for the core workflow

### 6.3 Component Inventory

| Component | States |
|---|---|
| Button | default, hover, active, disabled, loading |
| Input | default, focus, error, disabled |
| Card | default, hover (trend cards) |
| Badge | source badges (GitHub=#E8725C coral, PH=#8FB8A8 mint, HN=#F5A623 warm yellow, TC=#D4A5A5 dusty rose) |
| Modal | open, closed |
| Toast | success, error, info |
| Skeleton | loading state for trends/posts |
| Avatar | initials fallback |

### 6.4 Responsive Breakpoints

- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1280px

---

## 7. Non-Functional Requirements

### 7.1 Performance
- First Contentful Paint < 1.5s
- Trend API response < 2s (from cache)
- Post generation < 5s (AI latency)

### 7.2 Security
- All API routes require valid session (except auth + trends browse)
- Rate limiting: 20 post generations/hour per user
- Input sanitization on all user inputs
- Environment variables for all secrets

### 7.3 Scalability
- Trend cache shared across users (reduce external API calls)
- Connection pooling for MongoDB
- Stateless Express handlers

---

## 8. Out of Scope (v1)

- LinkedIn OAuth login
- Auto-post to LinkedIn via API
- Twitter/Reddit trend sources
- AI-generated images (only prompts provided)
- AI-generated carousel slides with images
- Payment / premium subscription
- Analytics dashboard (views, engagement)
- Mobile native apps
- Browser extension

---

## 9. Success Metrics (v1)

| Metric | Target |
|---|---|
| Signup conversion (landing → magic link sent) | > 15% |
| Post generation rate (users who generate 1+) | > 60% |
| Average posts generated per user/week | > 10 |
| Daily digest open rate | > 40% |
| NPS score | > 30 |

---

## 10. Future Roadmap

### Phase 2
- LinkedIn OAuth + auto-post
- Twitter trend integration
- AI image generation (user uploads, not AI-created)
- Advanced analytics

### Phase 3
- Premium tier ($9.99/mo)
- Team/enterprise accounts
- Custom brand voice (upload documents)
- Multi-language support
