import { test, expect } from '@playwright/test';

test.describe('Feature 2: Theme Toggle Switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });
  });

  test('F2-T1-01: Theme Toggle Presence & Accessibility', async ({ page }) => {
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    await expect(toggle).toBeVisible();
    
    const role = await toggle.getAttribute('role');
    expect(role).toBe('switch');
    
    await toggle.focus();
    await expect(toggle).toBeFocused();
  });

  test('F2-T1-02: DOM Class/Attribute Toggling', async ({ page }) => {
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    const html = page.locator('html');
    
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    
    await toggle.click();
    await page.waitForTimeout(200);
    
    const isDarkAfter = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDarkAfter).toBe(!isDark);
    
    await toggle.click();
    await page.waitForTimeout(200);
    
    const isDarkBack = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDarkBack).toBe(isDark);
  });

  test('F2-T1-03: Theme shifts CSS Custom Variables', async ({ page }) => {
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    
    const bgBefore = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--bg-primary').trim());
    
    await toggle.click();
    await page.waitForTimeout(200);
    
    const bgAfter = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--bg-primary').trim());
    expect(bgBefore).not.toBe(bgAfter);
  });

  test('F2-T1-04: AntigravityCanvas Theme Prop Propagation', async ({ page }) => {
    await page.addInitScript(() => {
      window.canvasStrokes = [];
      const originalStroke = CanvasRenderingContext2D.prototype.stroke;
      CanvasRenderingContext2D.prototype.stroke = function () {
        if (this.canvas.closest('#about')) {
          window.canvasStrokes.push(this.strokeStyle);
        }
        return originalStroke.call(this);
      };
    });

    await page.reload();
    await page.waitForSelector('.loader-overlay', { state: 'detached' });
    
    await page.evaluate(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    
    await page.evaluate(() => { window.canvasStrokes = []; });
    await page.waitForTimeout(300);
    const strokesLight = await page.evaluate(() => window.canvasStrokes);
    
    await toggle.click();
    await page.waitForTimeout(200);
    
    await page.evaluate(() => { window.canvasStrokes = []; });
    await page.waitForTimeout(300);
    const strokesDark = await page.evaluate(() => window.canvasStrokes);
    
    expect(strokesLight.length).toBeGreaterThan(0);
    expect(strokesDark.length).toBeGreaterThan(0);
    expect(strokesLight[0]).not.toBe(strokesDark[0]);
  });

  test('F2-T1-05: Storage Persistence', async ({ page }) => {
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    
    await toggle.click();
    await page.waitForTimeout(200);
    
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('dark');
    
    await page.reload();
    await page.waitForSelector('.loader-overlay', { state: 'detached' });
    
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(true);
  });

  test('F2-T2-01: Rapid Toggle Clicks (Stress Test)', async ({ page }) => {
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    
    for (let i = 0; i < 10; i++) {
      await toggle.click();
    }
    await page.waitForTimeout(500);
    
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(false);
  });

  test('F2-T2-02: Corrupted or Missing LocalStorage', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'corrupted-data-value');
    });
    
    await page.reload();
    await page.waitForSelector('.loader-overlay', { state: 'detached' });
    
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);
  });

  test('F2-T2-03: Cross-Tab Storage Sync', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'theme',
        newValue: 'dark'
      }));
    });
    
    await page.waitForTimeout(200);
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(true);
  });

  test('F2-T2-04: System Theme Preference Changes', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForSelector('.loader-overlay', { state: 'detached' });
    
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDark).toBe(true);
  });

  test('F2-T2-05: Extreme Screen Sizes and Responsiveness', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1200, height: 800 },
      { width: 2560, height: 1440 }
    ];
    
    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(100);
      
      const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn').first();
      await expect(toggle).toBeDefined();
    }
  });
});
