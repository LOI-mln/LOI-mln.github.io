import { test, expect } from '@playwright/test';

test.describe('Feature 3: Cross-Feature Interactions', () => {
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

    await page.goto('/');
    await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });
  });

  test('F3-01: Theme Toggle during Canvas Offscreen/Paused State', async ({ page }) => {
    // Scroll past canvases so they pause
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    
    // Verify loops are paused
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
      window.canvasDraws.antigravity = 0;
    });
    await page.waitForTimeout(500);
    let draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBe(0);
    expect(draws.antigravity).toBe(0);
    
    // Click theme toggle button to switch to dark mode
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    await toggle.click();
    await page.waitForTimeout(200);
    
    // Assert root gets dark class, but canvas loops do NOT restart rendering while offscreen
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(true);
    
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
      window.canvasDraws.antigravity = 0;
    });
    await page.waitForTimeout(500);
    draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBe(0);
    expect(draws.antigravity).toBe(0);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    
    // Verify OrganicCanvas resumes rendering in dark theme
    await page.evaluate(() => { window.canvasDraws.organic = 0; });
    await page.waitForTimeout(300);
    draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBeGreaterThan(0);
  });

  test('F3-02: Theme Toggle in Background Tab (Resource Conservation)', async ({ page }) => {
    // Minimize/hide tab (visibilityState hidden)
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(500);
    
    // Trigger theme change in storage (simulates sync)
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' }));
    });
    await page.waitForTimeout(200);
    
    // Verify no requestAnimationFrame calls occur while hidden
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
      window.canvasDraws.antigravity = 0;
    });
    await page.waitForTimeout(500);
    const draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBe(0);
    expect(draws.antigravity).toBe(0);
    
    // Restore visibilityState to 'visible'
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(500);
    
    // Verify loops resume with new theme styles
    await page.evaluate(() => { window.canvasDraws.organic = 0; });
    await page.waitForTimeout(300);
    const postDraws = await page.evaluate(() => window.canvasDraws);
    expect(postDraws.organic).toBeGreaterThan(0);
  });
});
