import sgMail from '@sendgrid/mail';
import { config } from '../config/env.js';
import { IUser } from '../models/User.js';
import { DigestContent } from './digestGenerator.js';
import { logError } from '../config/logger.js';

sgMail.setApiKey(config.SENDGRID_API_KEY);

export async function sendMagicLinkEmail(email: string, magicLink: string): Promise<boolean> {
  const html = renderMagicLinkHtml(magicLink);
  const text = renderMagicLinkText(magicLink);

  try {
    await sgMail.send({
      to: email,
      from: config.EMAIL_FROM,
      subject: 'Welcome to Quirk — Create your account',
      text,
      html,
    });
    return true;
  } catch (error) {
    logError(`MAGIC LINK email failed for ${email}`, { err: error as Error });
    return false;
  }
}

function renderMagicLinkHtml(magicLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FDFBF7;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:40px 48px;">
              <h1 style="font-family:'Courier New',monospace;font-size:20px;text-transform:uppercase;letter-spacing:2px;margin:0 0 24px;color:#1A1A1A;">QUIRK</h1>
              <p style="font-size:16px;line-height:1.6;margin:0 0 16px;color:#2D2D2D;">Hi there,</p>
              <p style="font-size:16px;line-height:1.6;margin:0 0 24px;color:#2D2D2D;">Your Quirk account is ready.</p>
              <p style="font-size:16px;line-height:1.6;margin:0 0 24px;color:#2D2D2D;">Click the button below to set your password and get started.</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background-color:#E8725C;border-radius:6px;">
                    <a href="${magicLink}" style="display:inline-block;padding:14px 32px;font-family:'Courier New',monospace;font-size:14px;font-weight:bold;text-transform:uppercase;text-decoration:none;color:#FDFBF7;letter-spacing:1px;">Create my account</a>
                  </td>
                </tr>
              </table>
              <p style="font-size:13px;line-height:1.6;margin:0 0 8px;color:#6B6B6B;">This link will expire in 30 minutes.</p>
              <p style="font-size:13px;line-height:1.6;margin:0 0 32px;color:#6B6B6B;">If you didn't request this account, you can safely ignore this email.</p>
              <p style="font-size:14px;line-height:1.6;margin:0;color:#2D2D2D;">— The Quirk Team</p>
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

— The Quirk Team`;
}

export async function sendDigestEmail(user: IUser, digest: DigestContent): Promise<boolean> {
  const html = renderDigestHtml(user, digest);

  try {
    await sgMail.send({
      to: user.email,
      from: config.EMAIL_FROM,
      subject: 'Your Daily LinkedIn Content is Ready',
      text: `Your daily LinkedIn content is ready. Log in to view it.`,
      html,
    });
    return true;
  } catch (error) {
    logError(`EMAIL digest send failed for ${user.email}`, { err: error as Error });
    return false;
  }
}

function renderDigestHtml(user: IUser, digest: DigestContent): string {
  const name = user.email.split('@')[0];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #F5F0E8; color: #2D2D2D; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #FDFBF7; border: 3px solid #1A1A1A; border-radius: 12px; padding: 32px; }
    h1 { font-family: 'Courier New', monospace; text-transform: uppercase; font-size: 24px; margin-bottom: 8px; }
    h2 { font-family: 'Courier New', monospace; text-transform: uppercase; font-size: 16px; color: #E8725C; margin-top: 24px; }
    .post { background: #F5F0E8; border-radius: 8px; padding: 16px; margin: 12px 0; font-size: 14px; line-height: 1.6; }
    .cta { display: inline-block; background: #E8725C; color: #FDFBF7; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-family: monospace; font-weight: bold; text-transform: uppercase; border: 2px solid #1A1A1A; }
    .footer { margin-top: 32px; font-size: 12px; color: #6B6B6B; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>QUIRK</h1>
    <p>Your daily LinkedIn content, ${name}.</p>

    <h2>Text Posts</h2>
    ${digest.textPosts.map((post: string) => `<div class="post">${post.replace(/\n/g, '<br>')}</div>`).join('')}

    <h2>Carousel</h2>
    <div class="post">
      ${Array.isArray(digest.carousel)
        ? digest.carousel.map((slide: Record<string, unknown>, i: number) => `<strong>${(slide.heading as string) || `Slide ${i+1}`}</strong><br>${(slide.body as string) || ''}`).join('<br><br>')
        : 'Carousel content'}
    </div>

    <h2>Image Prompt</h2>
    <div class="post">${digest.imagePrompt}</div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${config.CLIENT_URL}/dashboard" class="cta">VIEW IN DASHBOARD</a>
    </div>

    <div class="footer">
      Generated by Quirk
    </div>
  </div>
</body>
</html>`;
}
