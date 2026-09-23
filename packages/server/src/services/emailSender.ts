import { triggerMagicLinkEmail } from './n8nEmailClient.js';
import { IUser } from '../models/User.js';
import { DigestContent } from './digestGenerator.js';
import { logWarn } from '../config/logger.js';

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
    @media (max-width: 620px) {
      .container { width: 100% !important; }
      .content { padding: 24px !important; }
      .footer { padding: 16px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:Georgia,serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your Quirk account is ready — set your password within 30 minutes.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:600px;background-color:#FDFBF7;border-radius:8px;overflow:hidden;">
          <tr>
            <td class="content" style="padding:40px 48px;">
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
            <td class="footer" style="padding:20px 48px;border-top:1px solid #E5DFD4;font-size:12px;line-height:1.6;color:#6B6B6B;">
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

export async function sendDigestEmail(user: IUser, digest: DigestContent): Promise<boolean> {
  logWarn(`Digest email not yet migrated to n8n, skipping for ${user.email}`, {
    textPosts: digest.textPosts?.length,
  });
  return false;
}
