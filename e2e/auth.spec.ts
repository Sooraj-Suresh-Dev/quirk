import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('landing page loads with login button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'LOG IN' }).first()).toBeVisible();
  });

  test('GET STARTED button is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'GET STARTED' })).toBeVisible();
  });

  test('login modal opens and shows form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'LOG IN' }).first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  test('login form has email and password inputs', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'LOG IN' }).first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
    const emailInput = page.getByPlaceholder('Email');
    const passwordInput = page.getByPlaceholder('Password');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    // Verify inputs are empty initially
    await expect(emailInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });

  test('signup modal opens via GET STARTED', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'GET STARTED' }).click();
    await page.waitForTimeout(500);
    const hasDialog = await page.locator('[role="dialog"]').isVisible().catch(() => false);
    const hasEmail = await page.getByPlaceholder(/email/i).isVisible().catch(() => false);
    expect(hasDialog || hasEmail).toBeTruthy();
  });
});
