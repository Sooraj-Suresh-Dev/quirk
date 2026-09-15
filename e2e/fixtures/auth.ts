import type { Page } from '@playwright/test';

const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';

export async function createUserViaAPI(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/magic-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function setPasswordViaAPI(token: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/set-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  return res.json();
}

export async function loginViaMagicLink(page: Page, email: string) {
  const baseURL = process.env.E2E_API_URL || 'http://localhost:3001';
  const res = await fetch(`${baseURL}/api/auth/magic-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (data.magicLink) {
    const url = new URL(data.magicLink);
    await page.goto(url.pathname + url.search);
  }
}
