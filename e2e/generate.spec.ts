import { test, expect } from '@playwright/test';

test.describe('Generate', () => {
  test('generate page without trendId shows fallback', async ({ page }) => {
    await page.goto('/generate');
    await page.waitForTimeout(1000);
    const backBtn = page.locator('text=BACK TO TRENDS').or(page.locator('text=Trend not found'));
    await expect(backBtn.first()).toBeVisible();
  });

  test('generate page with invalid trendId shows not found', async ({ page }) => {
    await page.goto('/generate/invalid-trend-id-123');
    await page.waitForTimeout(2000);
    const notFound = page.locator('text=Trend not found').or(page.locator('text=BACK TO TRENDS'));
    await expect(notFound.first()).toBeVisible();
  });
});
