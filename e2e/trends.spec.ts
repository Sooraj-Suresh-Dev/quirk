import { test, expect } from '@playwright/test';
import { authenticate } from './helpers/auth';

test.describe('Discover (Trends)', () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test('discover page loads with title', async ({ page }) => {
    await page.goto('/discover');
    await page.waitForTimeout(1000);
    await expect(page.getByText('TRENDS')).toBeVisible();
  });

  test('search input is present', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('trend cards or empty state load', async ({ page }) => {
    await page.goto('/discover');
    await page.waitForTimeout(3000);
    const hasCards = await page.locator('button').filter({ hasText: /github|hackernews|producthunt/i }).count().then(c => c > 0).catch(() => false);
    const hasEmpty = await page.getByText(/no trends/i).isVisible().catch(() => false);
    expect(hasCards || hasEmpty).toBeTruthy();
  });
});
