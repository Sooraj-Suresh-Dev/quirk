# Quirk

Your LinkedIn, your quirk — AI-powered LinkedIn content generation.

## What it does

- Scrapes trending tech topics from GitHub, Product Hunt, and Hacker News
- Generates personalized text posts, carousels, and image prompts
- Trains on your writing voice for authentic content
- Sends daily email digests ready to post

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript, MongoDB (Mongoose) |
| AI Providers | OpenRouter (default), OpenAI, Anthropic |
| Auth | JWT + magic links |
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
| PUT | `/api/users/preferences` | Yes | Update preferences |

## Deployment

**Backend (Render):**

1. Connect your repo to [Render](https://render.com)
2. Set environment variables in the Render dashboard
3. Render auto-deploys from `main`

**Frontend (Vercel):**

1. Connect your repo to [Vercel](https://vercel.com)
2. Set `VITE_API_URL` to `https://<your-render-url>/api`
3. Vercel auto-deploys from `main`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret |
| `OPENROUTER_API_KEY` | Yes | Default AI provider key (fallback for users without their own key) |
| `CLIENT_URL` | No | Frontend origin for CORS (default: `http://localhost:5173`) |
| `RESEND_API_KEY` | No | Email delivery for magic links and daily digests |
| `EMAIL_FROM` | No | Sender address for emails |
| `PRODUCT_HUNT_API_TOKEN` | No | Product Hunt trend source |
| `VITE_API_URL` | No | Backend API URL for frontend (default: `/api`) |
| `VITE_GA_MEASUREMENT_ID` | No | Google Analytics measurement ID |

## License

[MIT](https://opensource.org/licenses/MIT)
