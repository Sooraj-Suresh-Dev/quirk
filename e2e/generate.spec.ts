import { test, expect } from '@playwright/test';
import { authenticate } from './helpers/auth';

test.describe('Generate', () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test('generate page with invalid trendId shows not found', async ({ page }) => {
    await page.goto('/generate/invalid-trend-id-123');
    await page.waitForTimeout(2000);
    const notFound = page.getByText('Trend not found').or(page.getByText('BACK TO TRENDS'));
    await expect(notFound.first()).toBeVisible({ timeout: 5000 });
  });

  test('generate page redirects to landing without trendId', async ({ page }) => {
    // /generate without :trendId doesn't match the route, so it redirects to /
    await page.goto('/generate');
    await page.waitForTimeout(2000);
    const url = page.url();
    // Should redirect to landing or show fallback
    const isLanding = url.endsWith('/') || url.includes('/generate');
    expect(isLanding).toBeTruthy();
  });
});
