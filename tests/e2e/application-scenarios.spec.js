import { test, expect } from '@playwright/test';

test.describe('Feature 4: Real-World Application Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Inject the canvas clearRect spy on init
    await page.addInitScript(() => {
      window.canvasDraws = {
        organic: 0,
        antigravity: 0
      };
      const originalClearRect = CanvasRenderingContext2D.prototype.clearRect;
      CanvasRenderingContext2D.prototype.clearRect = function (x, y, w, h) {
        const isAntigravity = this.canvas.closest('#about') !== null;
        if (isAntigravity) {
          window.canvasDraws.antigravity++;
        } else {
          window.canvasDraws.organic++;
        }
        return originalClearRect.call(this, x, y, w, h);
      };
    });
  });

  test('F4-01: First-Time User Experience (FTUX) in Light Mode', async ({ page }) => {
    await page.goto('/');
    
    const loader = page.locator('.loader-overlay');
    await expect(loader).toBeVisible();
    
    const progressText = await page.locator('.loader-percentage-giant').textContent();
    expect(progressText).toContain('%');
    
    await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });
    
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(false);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
      window.canvasDraws.antigravity = 0;
    });
    await page.waitForTimeout(500);
    const draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBe(0);
    expect(draws.antigravity).toBe(0);
  });

  test('F4-02: Returning User with Dark Theme Preference', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
    });
    
    await page.goto('/');
    
    await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });
    
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(true);
  });

  test('F4-03: System Preference Alignment on Load', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    
    await page.goto('/');
    await page.waitForSelector('.loader-overlay', { state: 'detached' });
    
    const html = page.locator('html');
    let isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(true);
    
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    await toggle.click();
    await page.waitForTimeout(200);
    
    isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(false);
    
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('light');
  });

  test('F4-04: Full Interactive Session (Scroll, Hover, Toggle, Return)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.loader-overlay', { state: 'detached' });
    
    const firstLink = page.locator('header nav a').first();
    await firstLink.hover();
    await page.waitForTimeout(100);
    
    await page.evaluate(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(800);
    
    await page.evaluate(() => { window.canvasDraws.antigravity = 0; });
    await page.waitForTimeout(300);
    let draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.antigravity).toBeGreaterThan(0);
    
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    await toggle.click();
    await page.waitForTimeout(200);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
      window.canvasDraws.antigravity = 0;
    });
    await page.waitForTimeout(500);
    draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBe(0);
    expect(draws.antigravity).toBe(0);
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    
    await page.evaluate(() => { window.canvasDraws.organic = 0; });
    await page.waitForTimeout(300);
    draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBeGreaterThan(0);
  });

  test('F4-05: Mobile Layout Resource Conservation', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    
    await page.goto('/');
    await page.waitForSelector('.loader-overlay', { state: 'detached' });
    
    const menuToggle = page.locator('header button.mobile-toggle');
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      await page.waitForTimeout(200);
    }
    
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn').first();
    await toggle.click();
    await page.waitForTimeout(200);
    
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(true);
    
    if (await menuToggle.isVisible()) {
      const isExpanded = await menuToggle.getAttribute('aria-expanded');
      if (isExpanded === 'true') {
        await menuToggle.click();
        await page.waitForTimeout(200);
      }
    }
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
      window.canvasDraws.antigravity = 0;
    });
    await page.waitForTimeout(500);
    const draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBe(0);
    expect(draws.antigravity).toBe(0);
  });
});
