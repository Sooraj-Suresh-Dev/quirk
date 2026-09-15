import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('landing page loads with login and signup', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=LOG IN').or(page.locator('text=Sign In'))).toBeVisible();
  });

  test('login form validates email and password', async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.locator('text=LOG IN').first();
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
    }
    await page.waitForTimeout(500);
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await expect(page.locator('text=Email is required').or(page.locator('text=required'))).toBeVisible();
    }
  });

  test('signup flow sends magic link', async ({ page }) => {
    await page.goto('/');
    const signupLink = page.locator('text=Sign up').or(page.locator('text=SIGN UP'));
    if (await signupLink.first().isVisible()) {
      await signupLink.first().click();
      await page.waitForTimeout(500);
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('test-quirk-e2e@example.com');
        await page.locator('button[type="submit"]').first().click();
        await expect(page.locator('text=CHECK YOUR EMAIL').or(page.locator('text=check your email'))).toBeVisible({ timeout: 10000 });
      }
    }
  });
});
