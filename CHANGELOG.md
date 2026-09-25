# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- User timezone support for daily digests (auto-detected from browser)
- GitHub Actions keep-alive workflow for Render free tier
- n8n webhook integration for email delivery (magic links + daily digests)
- Timezone selector in Settings with IANA timezone list
- Conventional commits enforcement
- ESLint flat config with TypeScript support

### Changed
- Daily digest cron now converts UTC to user's local time
- Environment variables: N8N webhooks replace Resend
- CI pipeline: lint, build, unit tests, E2E tests
- README updated with badges, contributing, security, roadmap

### Fixed
- CI test failures due to missing JWT secrets in vitest forks
- Digest delivery time mismatch (was using server UTC, now user local time)

## [0.1.0] - 2024-01-XX

### Added
- Initial project structure (monorepo with pnpm + Turborepo)
- React frontend with Vite, TypeScript, Tailwind CSS
- Express backend with TypeScript, MongoDB (Mongoose)
- JWT authentication with magic links
- Trend scraping from GitHub, Product Hunt, Hacker News
- AI-powered LinkedIn post generation (text, carousel, image prompts)
- Voice training from writing samples
- Daily email digest with trend cards
- User preferences (sources, digest time, API keys)
- n8n webhook email delivery
- CI/CD with GitHub Actions (lint, test, build, E2E)

### Infrastructure
- Render backend deployment
- Vercel frontend deployment
- MongoDB Atlas database
- GitHub Actions workflows

## Versioning

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking API changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Release Process

1. Update version in `package.json` files
2. Update `CHANGELOG.md` with release notes
3. Create Git tag: `git tag vX.Y.Z`
4. Push tag: `git push origin vX.Y.Z`
5. GitHub Actions builds and deploys
6. Create GitHub Release from tag

## Links

- [GitHub Releases](https://github.com/Sooraj-Suresh-Dev/quirk/releases)
- [Commits](https://github.com/Sooraj-Suresh-Dev/quirk/commits/main)