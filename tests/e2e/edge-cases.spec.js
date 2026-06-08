import { test, expect } from '@playwright/test';

test.describe('Edge Cases & Integration Hardening', () => {
  
  test.describe('1. localStorage Corruption & Inaccessibility', () => {
    test('Should fall back to system preference and load page without crashing when localStorage throws SecurityError', async ({ page }) => {
      // Mock localStorage to throw SecurityError when accessed (simulating disabled cookies/storage)
      await page.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
          get: () => {
            return {
              getItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
              setItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
              removeItem: () => { throw new Error('SecurityError: The operation is insecure.'); },
              clear: () => { throw new Error('SecurityError: The operation is insecure.'); },
              key: () => { throw new Error('SecurityError: The operation is insecure.'); },
              length: 0
            };
          },
          configurable: true
        });
      });

      // Emulate system dark preference
      await page.emulateMedia({ colorScheme: 'dark' });

      // Navigate to site
      await page.goto('/');
      
      // Page should load and loader-overlay should eventually detach
      await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });

      // Verify the page fell back to the system media query (dark mode)
      const html = page.locator('html');
      const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
      expect(isDark).toBe(true);
    });
  });

  test.describe('2. Cross-tab storage updates', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });
    });

    test('Should sync theme state instantly on storage change', async ({ page }) => {
      const html = page.locator('html');
      
      // Initially, determine current theme
      const initialIsDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
      const nextTheme = initialIsDark ? 'light' : 'dark';

      // Simulate a storage event from another tab
      await page.evaluate((targetTheme) => {
        localStorage.setItem('theme', targetTheme);
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'theme',
          newValue: targetTheme
        }));
      }, nextTheme);

      // Verify page theme synchronized instantly
      await page.waitForTimeout(200);
      const isDarkAfter = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
      expect(isDarkAfter).toBe(nextTheme === 'dark');
    });
  });

  test.describe('3. Dynamic Media Query Preference Updates', () => {
    test('Should sync theme dynamically matching prefers-color-scheme when no explicit user preference is set', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });

      const html = page.locator('html');
      
      // Clear any existing localStorage theme preference
      await page.evaluate(() => localStorage.removeItem('theme'));

      // Switch to dark preference
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForTimeout(300);
      let isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
      expect(isDark).toBe(true);

      // Switch to light preference
      await page.emulateMedia({ colorScheme: 'light' });
      await page.waitForTimeout(300);
      isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
      expect(isDark).toBe(false);
    });

    test('Should NOT sync theme dynamically matching prefers-color-scheme once user set an explicit preference', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });

      // Click the theme toggle to set explicit user preference
      const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
      await toggle.click();
      await page.waitForTimeout(200);

      const html = page.locator('html');
      const userThemeIsDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');

      // Now emulate changing system preference to the opposite
      const oppositeScheme = userThemeIsDark ? 'light' : 'dark';
      await page.emulateMedia({ colorScheme: oppositeScheme });
      await page.waitForTimeout(300);

      // Page theme should remain unchanged (preserving the user's manual choice)
      const currentIsDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
      expect(currentIsDark).toBe(userThemeIsDark);
    });
  });

  test.describe('4. Mobile Menu Usage Conservation', () => {
    test('Should pause canvas rendering loop when mobile overlay menu is active', async ({ page }) => {
      // Setup spies to count canvas clearRect operations (indicating active loop draws)
      await page.addInitScript(() => {
        window.canvasDraws = { organic: 0, antigravity: 0 };
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

      // Emulate a mobile device layout size
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');
      await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });

      // Confirm organic canvas is animating initially
      await page.evaluate(() => { window.canvasDraws.organic = 0; });
      await page.waitForTimeout(400);
      const initialDraws = await page.evaluate(() => window.canvasDraws.organic);
      expect(initialDraws).toBeGreaterThan(0);

      // Open the mobile menu overlay
      const menuButton = page.locator('header button.mobile-toggle');
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      // Check if mobile menu is open
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();

      // Reset draw counters and wait to see if animation loop paused
      await page.evaluate(() => { window.canvasDraws.organic = 0; });
      await page.waitForTimeout(400);
      
      const pausedDraws = await page.evaluate(() => window.canvasDraws.organic);
      
      // EXPECTED BEHAVIOR: Draws should be 0 because mobile menu overlay is active
      // CURRENT CODE: Will fail because there is no link between mobile menu open state and canvas rendering.
      expect(pausedDraws).toBe(0);
    });
  });
});
