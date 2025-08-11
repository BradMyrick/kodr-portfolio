import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title contains Kodr
    await expect(page).toHaveTitle(/Kodr/i);
    
    // Check if navigation is visible
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Check if hero section headline is visible
    const headline = page.locator('h1:has-text("Smart Contract-Powered")');
    await expect(headline).toBeVisible();
    
    // Check if CTA button is visible
    const ctaButton = page.locator('text=Start Building Now');
    await expect(ctaButton).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check for description meta tag
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
  });

  test('should navigate to registration', async ({ page }) => {
    await page.goto('/');
    
    // Click the "Start Building Now" button
    await page.click('text=Start Building Now');
    
    // Should navigate to registration page
    await expect(page).toHaveURL(/.*auth\/register/);
  });
});
