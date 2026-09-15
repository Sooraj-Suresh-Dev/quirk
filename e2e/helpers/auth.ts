import type { Page } from '@playwright/test';

const TEST_EMAIL = 'e2e-test@quirk.dev';
const TEST_PASSWORD = 'TestPass123!';

export async function authenticate(page: Page) {
  const baseURL = process.env.E2E_API_URL || 'http://localhost:3001';

  // Navigate to app first so page.evaluate runs in the correct origin (for CORS)
  await page.goto('/');
  await page.waitForTimeout(1000);

  // Try login first (user may already exist from a previous test run)
  const loginRes = await page.evaluate(async ({ url, email, password }) => {
    const r = await fetch(`${url}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    return r.json();
  }, { url: baseURL, email: TEST_EMAIL, password: TEST_PASSWORD });

  if (loginRes.user) {
    return; // Login successful
  }

  // If login failed, try magic link + set password (works in dev mode)
  const magicRes = await page.evaluate(async (url) => {
    const r = await fetch(`${url}/api/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'e2e-test@quirk.dev' }),
      credentials: 'include',
    });
    return r.json();
  }, baseURL);

  // Extract token from magic link URL (dev mode only)
  const token = magicRes.magicLink?.split('token=')[1];
  if (!token) {
    // Production mode - magic link sent via email, can't get token
    // Try to create user via set-password with a dummy approach
    // This won't work in production - skip auth for protected routes
    console.warn('Cannot authenticate in production mode - magic link sent via email');
    return;
  }

  // Step 2: Set password (creates user + sets auth cookies)
  await page.evaluate(async ({ url, tok }) => {
    await fetch(`${url}/api/auth/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tok, password: 'TestPass123!' }),
      credentials: 'include',
    });
  }, { url: baseURL, tok: token });
}
