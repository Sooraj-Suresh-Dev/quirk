import { triggerMagicLinkEmail, triggerDigestEmail } from './n8nEmailClient.js';
import { config } from '../config/env.js';
import { IUser } from '../models/User.js';
import { DigestContent, DigestTrend } from './digestGenerator.js';
import { timeAgo } from '../utils/timeAgo.js';

export async function sendMagicLinkEmail(email: string, magicLink: string): Promise<boolean> {
  const html = renderMagicLinkHtml(magicLink);
  const text = renderMagicLinkText(magicLink);
  return triggerMagicLinkEmail({
    email,
    magicLink,
    subject: 'Welcome to Quirk — Create your account',
    html,
    text,
  });
}

function renderMagicLinkHtml(magicLink: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Quirk</title>
  <style>
    @media (max-width: 700px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .content { padding: 24px !important; }
      .footer { padding: 16px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:Georgia,serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your Quirk account is ready — set your password within 30 minutes.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" class="container" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:680px;background-color:#FDFBF7;border-radius:8px;overflow:hidden;">
          <tr>
            <td class="content" style="padding:40px 28px;">
              <h1 style="font-family:'Courier New',monospace;font-size:20px;text-transform:uppercase;letter-spacing:2px;margin:0 0 24px;color:#1A1A1A;">QUIRK</h1>
              <p style="font-size:16px;line-height:1.6;margin:0 0 16px;color:#2D2D2D;">Hi there,</p>
              <p style="font-size:16px;line-height:1.6;margin:0 0 24px;color:#2D2D2D;">Your Quirk account is ready.</p>
              <p style="font-size:16px;line-height:1.6;margin:0 0 24px;color:#2D2D2D;">Click the button below to set your password and get started.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background-color:#E8725C;border-radius:6px;">
                    <a href="${magicLink}" style="display:inline-block;padding:14px 32px;font-family:'Courier New',monospace;font-size:14px;font-weight:bold;text-transform:uppercase;text-decoration:none;color:#FDFBF7;letter-spacing:1px;">Create my account</a>
                  </td>
                </tr>
              </table>
              <p style="font-size:13px;line-height:1.6;margin:0 0 8px;color:#6B6B6B;">This link will expire in 30 minutes.</p>
              <p style="font-size:13px;line-height:1.6;margin:0 0 0;color:#6B6B6B;">If you didn't request this account, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td class="footer" style="padding:20px 28px;border-top:1px solid #E5DFD4;font-size:12px;line-height:1.6;color:#6B6B6B;">
              You're receiving this because an account was created for this email.<br>
              &copy; The Quirk Team
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderMagicLinkText(magicLink: string): string {
  return `Welcome to Quirk

Hi there,

Your Quirk account is ready.

Click the link below to set your password and get started.

${magicLink}

This link will expire in 30 minutes.

If you didn't request this account, you can safely ignore this email.

You're receiving this because an account was created for this email.
— The Quirk Team`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    github: 'GitHub',
    producthunt: 'Product Hunt',
    hackernews: 'Hacker News',
  };
  return labels[source] || source;
}

function sourceBadge(source: string): string {
  const colors: Record<string, string> = {
    github: '#E8725C',
    producthunt: '#8FB8A8',
    hackernews: '#F5A623',
  };
  const bg = colors[source] || '#6B6B6B';
  return `<span style="display:inline-block;padding:3px 8px;font-family:'Courier New',monospace;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;background-color:${bg};color:#FDFBF7;border-radius:4px;">${escapeHtml(sourceLabel(source))}</span>`;
}

function compactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function sourceMetrics(trend: DigestTrend): string[] {
  const parts: string[] = [];
  if (trend.source === 'github') {
    if (typeof trend.stars === 'number') parts.push(`★ ${compactNumber(trend.stars)}`);
    if (typeof trend.forks === 'number') parts.push(`⑂ ${compactNumber(trend.forks)}`);
  } else if (trend.source === 'producthunt') {
    if (typeof trend.votes === 'number') parts.push(`♥ ${compactNumber(trend.votes)}`);
  } else if (trend.source === 'hackernews') {
    if (typeof trend.points === 'number') parts.push(`↑ ${compactNumber(trend.points)}`);
    if (typeof trend.comments === 'number') parts.push(`💬 ${trend.comments}`);
  }
  return parts;
}

function metaParts(trend: DigestTrend): string[] {
  const parts: string[] = [];
  parts.push(...sourceMetrics(trend));
  const who = trend.author || (trend.makers && trend.makers.length > 0 ? trend.makers.join(', ') : '');
  if (who) parts.push(`by ${who}`);
  if (trend.createdAt) {
    const ago = timeAgo(trend.createdAt);
    if (ago) parts.push(ago);
  }
  return parts;
}

function formatMeta(trend: DigestTrend): string {
  return metaParts(trend).join('  ·  ');
}

function truncateSummary(summary: string, max = 160): string {
  if (summary.length <= max) return summary;
  return `${summary.slice(0, max - 1).trimEnd()}…`;
}

function sourceFallback(source: string): string {
  const labels: Record<string, string> = {
    github: 'GH',
    producthunt: 'PH',
    hackernews: 'HN',
  };
  return labels[source] || '•';
}

function trendThumbnail(trend: DigestTrend): string {
  if (trend.thumbnailUrl) {
    return `<img src="${escapeHtml(trend.thumbnailUrl)}" width="128" height="96" alt="${escapeHtml(trend.title)}" style="display:block;width:128px;height:96px;object-fit:cover;border-radius:8px;border:2px solid #1A1A1A;" />`;
  }
  return `<table role="presentation" width="128" height="96" cellpadding="0" cellspacing="0" style="width:128px;height:96px;background-color:#F5F0E8;border:2px solid #1A1A1A;border-radius:8px;">
    <tr>
      <td align="center" valign="middle" style="font-family:'Courier New',monospace;font-size:16px;font-weight:bold;color:#6B6B6B;">${escapeHtml(sourceFallback(trend.source))}</td>
    </tr>
  </table>`;
}

function trendCard(trend: DigestTrend): string {
  const meta = formatMeta(trend);
  const metaHtml = meta
    ? `<p style="font-family:'Courier New',monospace;font-size:11px;color:#6B6B6B;margin:8px 0 10px;">${escapeHtml(meta)}</p>`
    : '<div style="height:8px;"></div>';

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border:1px solid #E5DFD4;border-radius:8px;padding:0;margin:0 0 16px;">
    <tr>
      <td style="padding:16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td width="128" valign="top" style="width:128px;padding:0 16px 0 0;">${trendThumbnail(trend)}</td>
            <td valign="top" style="min-width:0;">
              <div>${sourceBadge(trend.source)}</div>
              <h3 style="font-family:'Courier New',monospace;font-size:15px;line-height:1.4;font-weight:bold;margin:10px 0 0;color:#1A1A1A;">${escapeHtml(trend.title)}</h3>
              <p style="font-size:14px;line-height:1.55;margin:6px 0 0;color:#6B6B6B;">${escapeHtml(truncateSummary(trend.summary))}</p>
              ${metaHtml}
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 0;">
                <tr>
                  <td style="background-color:#E8725C;border-radius:6px;">
                    <a href="${trend.generateUrl}" style="display:inline-block;padding:12px 22px;font-family:'Courier New',monospace;font-size:12px;font-weight:bold;text-transform:uppercase;text-decoration:none;color:#FDFBF7;letter-spacing:1px;">Generate post</a>
                  </td>
                  <td style="padding-left:16px;">
                    <a href="${escapeHtml(trend.url)}" style="font-family:'Courier New',monospace;font-size:12px;color:#6B6B6B;text-decoration:underline;">View original →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export async function sendDigestEmail(user: IUser, digest: DigestContent): Promise<boolean> {
  const html = renderDigestHtml(digest);
  const text = renderDigestText(digest);
  return triggerDigestEmail({
    email: user.email,
    subject: "Today's trends for you",
    html,
    text,
  });
}

export function renderDigestHtmlForTest(digest: DigestContent): string {
  return renderDigestHtml(digest);
}

function renderDigestHtml(digest: DigestContent): string {
  const cardsHtml = digest.trends.map(trendCard).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Today's trends for you</title>
  <style>
    @media (max-width: 700px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .content { padding: 24px !important; }
      .footer { padding: 16px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:Georgia,serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Fresh trends picked for you — generate a post in one click.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" class="container" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:680px;background-color:#FDFBF7;border-radius:8px;overflow:hidden;">
          <tr>
            <td class="content" style="padding:40px 28px;">
              <h1 style="font-family:'Courier New',monospace;font-size:20px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;color:#1A1A1A;">QUIRK</h1>
              <p style="font-size:16px;line-height:1.6;margin:0 0 8px;color:#2D2D2D;">Hi there,</p>
              <p style="font-size:14px;line-height:1.6;margin:0 0 24px;color:#6B6B6B;">Here are today's trends. Generate a post when you're ready.</p>

              <h2 style="font-family:'Courier New',monospace;font-size:16px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;color:#E8725C;">Today's Trends</h2>
              ${cardsHtml}

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 0;">
                <tr>
                  <td style="background-color:#1A1A1A;border-radius:6px;">
                    <a href="${config.CLIENT_URL}/dashboard" style="display:inline-block;padding:14px 32px;font-family:'Courier New',monospace;font-size:14px;font-weight:bold;text-transform:uppercase;text-decoration:none;color:#FDFBF7;letter-spacing:1px;">Open dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="footer" style="padding:20px 28px;border-top:1px solid #E5DFD4;font-size:12px;line-height:1.6;color:#6B6B6B;">
              You're receiving this because you enabled daily digests in Quirk Settings.<br>
              <a href="${config.CLIENT_URL}/settings" style="color:#6B6B6B;">Manage digest preferences</a><br>
              &copy; The Quirk Team
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderDigestText(digest: DigestContent): string {
  const trends = digest.trends
    .map((trend, i) => {
      const meta = formatMeta(trend);
      const metaLine = meta ? `\n${meta}` : '';
      return `${i + 1}. ${trend.title} (${sourceLabel(trend.source)})${metaLine}\n${truncateSummary(trend.summary)}\nGenerate: ${trend.generateUrl}\nOriginal: ${trend.url}`;
    })
    .join('\n\n');

  return `Today's trends for you

Hi there,

Here are today's trends. Generate a post when you're ready.

${trends}

Open dashboard: ${config.CLIENT_URL}/dashboard

You're receiving this because you enabled daily digests in Quirk Settings.
Manage digest preferences: ${config.CLIENT_URL}/settings
— The Quirk Team`;
}
