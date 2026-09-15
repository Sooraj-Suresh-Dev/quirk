import { test, expect } from '@playwright/test';

test.describe('Library', () => {
  test('library page loads with title', async ({ page }) => {
    await page.goto('/library');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=LIBRARY')).toBeVisible();
  });

  test('search input is present', async ({ page }) => {
    await page.goto('/library');
    await expect(page.locator('input[placeholder*="Search"]').or(page.locator('input[placeholder*="search"]'))).toBeVisible();
  });

  test('refresh button is present', async ({ page }) => {
    await page.goto('/library');
    const refreshBtn = page.locator('text=REFRESH').or(page.locator('[aria-label="Refresh posts"]'));
    await expect(refreshBtn.first()).toBeVisible();
  });
});
