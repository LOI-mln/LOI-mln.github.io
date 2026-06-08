const { test, expect } = require('@playwright/test');

test.describe('Adversarial Hardening - Challenger M4-1', () => {

  test('System theme preference updates should sync when localStorage is blocked', async ({ page }) => {
    // Mock localStorage to throw exceptions on any read/write attempt (simulating private/restricted mode)
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('localStorage access is denied in this sandbox environment');
        },
        configurable: true
      });
    });

    // Emulate initial system theme as dark
    await page.emulateMedia({ colorScheme: 'dark' });

    // Navigate to the app root
    await page.goto('/');

    // Check that the dark class is added initially based on system preference
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');

    // Emulate OS theme change to light
    await page.emulateMedia({ colorScheme: 'light' });

    // The document theme should react to the media query update
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('Canvas animation loops should pause when the mobile navigation menu is active', async ({ page }) => {
    await page.goto('/');

    // Set viewport size to mobile width to display mobile toggle button
    await page.setViewportSize({ width: 375, height: 667 });

    // Spy on window.requestAnimationFrame
    await page.addInitScript(() => {
      window.rafCalls = 0;
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = (callback) => {
        window.rafCalls++;
        return originalRAF(callback);
      };
    });

    // Let the animation loops run for a moment to verify they are active
    await page.waitForTimeout(500);
    const initialRAFCalls = await page.evaluate(() => window.rafCalls);
    expect(initialRAFCalls).toBeGreaterThan(0);

    // Open the mobile navigation menu
    const menuToggle = page.locator('button.mobile-toggle, button[aria-label="Menu de navigation"]');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();

    // Reset the frame counter
    await page.evaluate(() => {
      window.rafCalls = 0;
    });

    // Wait and check if the animation loops have paused
    await page.waitForTimeout(500);
    const activeRAFCalls = await page.evaluate(() => window.rafCalls);

    // If resource conservation is implemented correctly, no RAF calls should occur when menu is open.
    // In the current buggy baseline implementation, the loops continue running.
    expect(activeRAFCalls).toBe(0);
  });

  test('Custom cursor hover state should reset when the hovered element is dynamically unmounted', async ({ page }) => {
    await page.goto('/');

    // Check custom cursor visibility
    const cursorRing = page.locator('.custom-cursor-ring');
    await expect(cursorRing).toBeVisible();

    // Dynamically insert an interactive element
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.id = 'temp-btn-dynamic';
      btn.textContent = 'Dynamic Action';
      btn.style.position = 'fixed';
      btn.style.top = '150px';
      btn.style.left = '150px';
      btn.style.width = '100px';
      btn.style.height = '40px';
      btn.style.zIndex = '99999';
      document.body.appendChild(btn);
    });

    // Hover over the dynamic button
    await page.hover('#temp-btn-dynamic');

    // Confirm that the cursor ring transitions to the hovered state
    await expect(cursorRing).toHaveClass(/cursor-hovered/);

    // Dynamically remove the element under the cursor without trigger mouseleave naturally
    await page.evaluate(() => {
      const btn = document.getElementById('temp-btn-dynamic');
      if (btn) btn.remove();
    });

    // Move mouse slightly to trigger any potential mouse move checks
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    // If properly hardened, the hover state should clear. In the buggy implementation, it sticks.
    await expect(cursorRing).not.toHaveClass(/cursor-hovered/);
  });

  test('Custom cursor should hide or reset when mouse leaves the document window boundaries', async ({ page }) => {
    await page.goto('/');

    const cursorRing = page.locator('.custom-cursor-ring');

    // Verify custom cursor is active inside the page
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);

    // Move mouse outside the viewport boundaries (e.g. coordinates less than 0)
    await page.mouse.move(-10, -10);
    await page.waitForTimeout(300);

    // In a hardened implementation, custom cursor elements should hide or transition out of view (e.g. opacity 0 or transform off-screen).
    // In the baseline buggy implementation, the cursor elements remain visible at the boundary.
    const isRingVisible = await cursorRing.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
    });

    expect(isRingVisible).toBe(false);
  });
});
