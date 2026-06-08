const { test, expect } = require('@playwright/test');

test.describe('Adversarial Hardening - Challenger M4-2', () => {

  test('System theme preference updates should sync when localStorage is disabled/inaccessible', async ({ page }) => {
    // 1. Mock localStorage to throw errors (simulating private browsing mode / disabled cookies)
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('localStorage is blocked/disabled');
        },
        configurable: true
      });
    });

    // Emulate system theme as 'dark'
    await page.emulateMedia({ colorScheme: 'dark' });

    // Load the page
    await page.goto('/');

    // Check that the page correctly resolved to 'dark' initially via prefers-color-scheme
    const htmlClassList = await page.evaluate(() => Array.from(document.documentElement.classList));
    expect(htmlClassList).toContain('dark');

    // Emulate changing system theme to 'light'
    await page.emulateMedia({ colorScheme: 'light' });

    // In a correct implementation, the page theme should sync to 'light'.
    // In the buggy implementation, handleMediaQueryChange fails to set the theme when localStorage is blocked,
    // so the page remains 'dark'.
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('Canvas animation loops should pause when the mobile menu is open', async ({ page }) => {
    await page.goto('/');

    // Emulate mobile viewport to show mobile menu button
    await page.setViewportSize({ width: 375, height: 667 });

    // Spy on requestAnimationFrame to check if frames are being requested
    await page.addInitScript(() => {
      window.rafCalls = 0;
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = (callback) => {
        window.rafCalls++;
        return originalRAF(callback);
      };
    });

    // Wait to ensure canvas is intersecting and running
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000); // Wait for animation loop to start

    // Open mobile menu
    const menuBtn = page.locator('.mobile-menu-btn, button[aria-label="Menu"]');
    await menuBtn.click();

    // Reset loop counter
    await page.evaluate(() => {
      window.rafCalls = 0;
    });

    // Wait and check if the loops are still running
    await page.waitForTimeout(500);

    const activeRAFCalls = await page.evaluate(() => window.rafCalls);

    // In a resource-conserving implementation, the canvases should pause when the menu is open,
    // so activeRAFCalls should be 0.
    // In the buggy implementation, loops keep running, making activeRAFCalls > 0.
    expect(activeRAFCalls).toBe(0);
  });

  test('Cursor hover state should reset if the hovered element is removed from the DOM', async ({ page }) => {
    await page.goto('/');

    // Ensure custom cursor is loaded and active
    const cursorRing = page.locator('.custom-cursor-ring');
    await expect(cursorRing).toBeVisible();

    // Create a temporary button on the page
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.id = 'temp-test-button';
      btn.textContent = 'Hover Me';
      btn.style.position = 'fixed';
      btn.style.top = '100px';
      btn.style.left = '100px';
      btn.style.width = '100px';
      btn.style.height = '50px';
      btn.style.zIndex = '9999';
      document.body.appendChild(btn);
    });

    // Hover over the button
    await page.hover('#temp-test-button');
    
    // Check that the cursor ring is in the hovered state (has class cursor-hovered)
    await expect(cursorRing).toHaveClass(/cursor-hovered/);

    // Remove the button from the DOM while it is hovered
    await page.evaluate(() => {
      const btn = document.getElementById('temp-test-button');
      if (btn) btn.remove();
    });

    // Move the mouse to a blank area
    await page.mouse.move(0, 0);

    // Wait for the cursor animation to transition
    await page.waitForTimeout(500);

    // In a correct implementation, the cursor ring should lose the hovered class.
    // In the buggy implementation, because mouseleave never fired, it remains stuck.
    await expect(cursorRing).not.toHaveClass(/cursor-hovered/);
  });
});
