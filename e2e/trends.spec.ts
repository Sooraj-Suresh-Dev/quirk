import { test, expect } from '@playwright/test';

test.describe('Trends', () => {
  test('trends page loads with title', async ({ page }) => {
    await page.goto('/trends');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=TRENDS')).toBeVisible();
  });

  test('search input is present', async ({ page }) => {
    await page.goto('/trends');
    await expect(page.locator('input[placeholder*="Search"]').or(page.locator('input[placeholder*="search"]'))).toBeVisible();
  });

  test('trend cards or empty state load', async ({ page }) => {
    await page.goto('/trends');
    await page.waitForTimeout(3000);
    const trendCards = page.locator('[data-testid="trend-card"]');
    const emptyState = page.locator('text=No trends');
    const hasCards = await trendCards.count().then(c => c > 0).catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    expect(hasCards || hasEmpty).toBeTruthy();
  });
});
