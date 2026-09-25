# Contributing to Quirk

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Fork and clone** the repository
2. **Install dependencies**: `pnpm install`
3. **Configure environment**: Copy `.env.example` to `packages/server/.env` and fill in values
4. **Start development**: `pnpm dev`

## Project Structure

```
packages/
  web/        # React frontend (Vite + TypeScript + Tailwind)
  server/     # Express backend (TypeScript + MongoDB)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both frontend and backend |
| `pnpm dev:web` | Frontend only (port 5173) |
| `pnpm dev:server` | Backend only (port 3001) |
| `pnpm build` | Production build |
| `pnpm test` | Run unit tests (vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm lint` | Run ESLint |

## Pull Request Process

1. **Create a branch** from `main`: `git checkout -b feat/your-feature`
2. **Make changes** with clear, focused commits
3. **Run checks**: `pnpm lint && pnpm test && pnpm build`
4. **Write tests** for new functionality
5. **Update documentation** if needed (README, API docs)
6. **Open PR** against `main` with:
   - Clear title (conventional commits: `feat:`, `fix:`, `chore:`)
   - Description of changes and motivation
   - Screenshots for UI changes
   - Linked issues (if applicable)

## Coding Standards

- **TypeScript**: Strict mode enabled, no `any` without justification
- **ESLint**: Follow configured rules (Airbnb + Prettier)
- **Commits**: Conventional commits format
- **Tests**: Unit tests for utils/services, E2E for critical flows
- **Git**: Rebase onto `main` before PR, squash if needed

## Branch Naming

| Type | Prefix | Example |
|------|--------|---------|
| Feature | `feat/` | `feat/digest-timezone` |
| Bug fix | `fix/` | `fix/cron-timezone-bug` |
| Refactor | `refactor/` | `refactor/email-service` |
| Docs | `docs/` | `docs/readme-update` |
| Chore | `chore/` | `chore/update-deps` |

## Testing Guidelines

- **Unit tests**: `packages/server/src/**/*.test.ts`, `packages/web/src/**/*.test.tsx`
- **E2E tests**: `packages/web/e2e/**/*.spec.ts`
- **Coverage**: Aim for >80% on new code
- **Run locally**: `pnpm test` before pushing

## Code Review Checklist

- [ ] Code follows project conventions
- [ ] Tests pass and cover new logic
- [ ] No console.log/debugger in production code
- [ ] Types are explicit (no implicit any)
- [ ] UI changes tested in multiple viewports
- [ ] Environment variables documented if added
- [ ] Breaking changes noted in PR description

## Questions?

Open a [GitHub Discussion](https://github.com/Sooraj-Suresh-Dev/quirk/discussions) or check existing issues.