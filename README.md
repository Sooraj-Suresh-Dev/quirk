# Quirk

Your LinkedIn, your quirk — AI-powered LinkedIn content generation.

![Build Status](https://github.com/Sooraj-Suresh-Dev/quirk/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

## What it does

- Scrapes trending tech topics from GitHub, Product Hunt, and Hacker News
- Generates personalized text posts, carousels, and image prompts
- Trains on your writing voice for authentic content
- Sends daily email digests ready to post (timezone-aware with browser auto-detection)
- Keeps backend warm on Render via GitHub Actions keep-alive

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript, MongoDB (Mongoose) |
| AI Providers | OpenRouter (default), OpenAI, Anthropic |
| Auth | JWT + magic links |
| Email | n8n webhooks (magic links + daily digests) |
| Scheduling | node-cron (timezone-aware), GitHub Actions keep-alive |
| Monorepo | pnpm workspaces, Turborepo |

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (`npm i -g pnpm`)
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### Install

```bash
git clone <repo-url>
cd quirk
pnpm install
```

### Configure

```bash
cp .env.example packages/server/.env
```

Fill in the required values in `packages/server/.env` — at minimum `MONGODB_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`.

### Run

```bash
pnpm dev            # both web + server
pnpm dev:web        # frontend only → localhost:5173
pnpm dev:server     # backend only → localhost:3001
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test           # run unit tests
pnpm test:e2e       # run E2E tests (requires Playwright)
```

## Project Structure

```
packages/
  web/        → React SPA (Vite)
  server/     → Express REST API
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/magic-link` | No | Send magic link email |
| POST | `/api/auth/set-password` | No | Set password via magic token |
| POST | `/api/auth/login` | No | Email + password login |
| GET | `/api/auth/session` | Yes | Get current session |
| GET | `/api/trends` | No | List trending topics |
| GET | `/api/trends/:id` | No | Get single trend |
| POST | `/api/posts/generate` | Yes | Generate LinkedIn post |
| GET | `/api/posts` | Yes | List user posts |
| GET | `/api/users/profile` | Yes | Get user profile + voice |
| POST | `/api/users/voice` | Yes | Save voice profile |
| PUT | `/api/users/preferences` | Yes | Update preferences (sources, digestTime, emailDigest, timezone, API keys) |

## Deployment

**Backend (Render):**

1. Connect your repo to [Render](https://render.com)
2. Set environment variables in the Render dashboard
3. Render auto-deploys from `main`

**Frontend (Vercel):**

1. Connect your repo to [Vercel](https://vercel.com)
2. Set `VITE_API_URL` to `https://<your-render-url>/api`
3. Vercel auto-deploys from `main`

**GitHub Actions Keep-Alive (for Render free tier):**

1. Go to repo Settings → Secrets and variables → Actions → New repository secret
2. Name: `RENDER_API_URL`
3. Value: Your Render backend URL (e.g., `https://quirk-api.onrender.com`)
4. The `.github/workflows/keep-alive.yml` workflow pings `/api/health` every 5 minutes

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret |
| `OPENROUTER_API_KEY` | No (Prod: Yes) | Default AI provider key (fallback for users without their own key) |
| `N8N_WEBHOOK_URL` | No (Prod: Yes) | n8n webhook URL for magic link emails |
| `N8N_DIGEST_WEBHOOK_URL` | No (Prod: Yes) | n8n webhook URL for daily digest emails |
| `N8N_WEBHOOK_SECRET` | No (Prod: Yes) | n8n webhook secret (32+ chars) |
| `PRODUCT_HUNT_API_TOKEN` | No | Product Hunt trend source |
| `CLIENT_URL` | No | Frontend origin for CORS (default: `http://localhost:5173`) |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/production/test, default: development) |
| `VITE_API_URL` | No | Backend API URL for frontend (default: `/api`) |
| `VITE_GA_MEASUREMENT_ID` | No | Google Analytics measurement ID |
| `VITE_API_BASE_URL` | No (Frontend) | Frontend API base path (default: `/api`) |
| `VITE_API_TARGET` | No (Frontend) | Backend target URL (default: `http://localhost:3001`) |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, PR process, and coding standards.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Report vulnerabilities via [SECURITY.md](SECURITY.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) or [GitHub Releases](https://github.com/Sooraj-Suresh-Dev/quirk/releases).

## Roadmap

- [ ] Vercel Cron + QStash for reliable digest delivery
- [ ] Multi-language post generation
- [ ] Post scheduling UI
- [ ] Analytics dashboard
- [ ] Team collaboration features

## License

[MIT](https://opensource.org/licenses/MIT)