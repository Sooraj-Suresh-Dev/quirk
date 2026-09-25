# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported |
|---------|-----------|
| `main` branch (latest) | ✅ |
| Previous minor versions | ❌ |

Always use the latest version from `main` for production deployments.

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do not** open a public GitHub issue for security vulnerabilities.

Instead, email us at: **security@quirk.example.com**

Include the following information:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information for follow-up

### What to Expect

1. **Acknowledgment**: We'll respond within 48 hours
2. **Assessment**: We'll evaluate the severity and impact
3. **Timeline**: We'll provide an estimated fix timeline
4. **Coordination**: We'll work with you on disclosure timing
5. **Resolution**: We'll release a fix and credit you (if desired)

## Security Best Practices for Users

### Environment Variables

- Never commit `.env` files to version control
- Use strong, unique secrets for `JWT_SECRET`, `JWT_REFRESH_SECRET`, `N8N_WEBHOOK_SECRET`
- Rotate secrets periodically
- Use different secrets for development/staging/production

### Deployment

- Enable HTTPS/TLS on all endpoints
- Restrict MongoDB network access (VPC, IP whitelist)
- Use Render/Vercel environment variables (not `.env` files)
- Enable CORS only for trusted origins (`CLIENT_URL`)

### Authentication

- Use magic links or strong passwords
- Enable 2FA on GitHub/Render/Vercel/n8n accounts
- Regularly audit API keys (`OPENROUTER_API_KEY`, `OPENAI_API_KEY`, etc.)

### Dependencies

- Run `pnpm audit` periodically
- Update dependencies with `pnpm update --latest`
- Review `package.json` for unused packages

## Known Security Considerations

| Area | Mitigation |
|------|------------|
| JWT tokens | Short expiry (15min access, 7d refresh), httpOnly cookies |
| Rate limiting | Auth endpoints rate-limited (see `authRateLimiter.ts`) |
| Input validation | Zod schemas on all API endpoints |
| CORS | Restricted to `CLIENT_URL` only |
| Email webhooks | n8n secret validation on inbound requests |
| MongoDB | Connection string with auth, network restrictions |

## Disclosure Policy

We follow coordinated disclosure:

1. Vulnerability reported privately
2. Fix developed and tested
3. Fix released to `main`
4. Public disclosure after reasonable time (typically 30-90 days)
5. Credit given to reporter (unless anonymity requested)

## Contact

Security team: **security@quirk.example.com**

For non-security issues, use [GitHub Issues](https://github.com/Sooraj-Suresh-Dev/quirk/issues).