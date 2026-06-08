import { test, expect } from '@playwright/test';

test.describe('E2E Stress Integration Checks', () => {
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

  test('Stress 1: Rapid Theme Toggle Clicks (No Page Crash / No Visual Desync)', async ({ page }) => {
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    await expect(toggle).toBeVisible();

    console.log('Starting rapid theme toggling (100 clicks)...');
    
    // Measure time taken for rapid toggles
    const startTime = Date.now();
    for (let i = 0; i < 100; i++) {
      await toggle.click();
      // Introduce an ultra-short delay to stress event loop
      if (i % 10 === 0) {
        await page.waitForTimeout(5);
      }
    }
    const duration = Date.now() - startTime;
    console.log(`Rapid theme toggling completed in ${duration}ms.`);

    // Verify page has not crashed by querying DOM elements and verifying they respond
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    console.log(`Final theme state is dark: ${isDark}`);

    // Click it one more time to ensure it still functions
    await toggle.click();
    await page.waitForTimeout(200);
    const isDarkAfter = await html.evaluate(el => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark');
    expect(isDarkAfter).toBe(!isDark);

    // Verify canvas still renders after stress toggling
    await page.evaluate(() => { window.canvasDraws.organic = 0; });
    await page.waitForTimeout(300);
    const draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBeGreaterThan(0);
    console.log(`Organic canvas continues to draw: ${draws.organic} frames in 300ms.`);
  });

  test('Stress 2: Rapid Viewport Resize & Zoom (Intersection Observer and Canvas Boundaries)', async ({ page }) => {
    // Scroll down to the about section so that both canvases are in play/sentinels are observed
    await page.evaluate(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const sizes = [
      { width: 1440, height: 900 },
      { width: 375, height: 667 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 },
      { width: 320, height: 480 },
      { width: 2560, height: 1600 }
    ];

    console.log('Performing rapid viewport resize stress test...');
    for (let i = 0; i < sizes.length; i++) {
      await page.setViewportSize(sizes[i]);
      // Verify canvas style and width attributes are updated properly
      const canvasInfo = await page.evaluate(() => {
        const c = document.querySelector('canvas');
        return {
          width: c.width,
          height: c.height,
          styleWidth: c.style.width,
          styleHeight: c.style.height
        };
      });
      expect(canvasInfo.styleWidth).toBe(`${sizes[i].width}px`);
      expect(canvasInfo.styleHeight).toBe(`${sizes[i].height}px`);
      // Short delay to allow canvas redraw and layout stabilization
      await page.waitForTimeout(50);
    }

    console.log('Performing zoom and offscreen scale checks...');
    // Apply extreme scale zooming and trigger resize events
    await page.evaluate(() => {
      document.body.style.transform = 'scale(0.1)';
      document.body.style.transformOrigin = 'top left';
      window.dispatchEvent(new Event('resize'));
    });
    await page.waitForTimeout(300);

    // Scroll to the bottom of the page (everything is scaled down to 10% so the sentinel is definitely offscreen/onscreen check)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);

    // Check if canvases pause rendering offscreen under extreme zoom
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
      window.canvasDraws.antigravity = 0;
    });
    await page.waitForTimeout(500);
    let draws = await page.evaluate(() => window.canvasDraws);
    
    console.log(`Draws at page bottom under zoom scale(0.1): organic=${draws.organic}, antigravity=${draws.antigravity}`);
    
    // Reset transform
    await page.evaluate(() => {
      document.body.style.transform = 'none';
      window.dispatchEvent(new Event('resize'));
    });
    await page.waitForTimeout(300);
  });

  test('Stress 3: Rapid Page Scrolling & Visibility Changes (Loop Pauses and Resumes cleanly)', async ({ page }) => {
    // Record raf calls
    await page.evaluate(() => {
      window.rafTimeStamps = [];
      const originalRaf = window.requestAnimationFrame;
      window.requestAnimationFrame = function (cb) {
        window.rafTimeStamps.push({
          time: performance.now(),
          visibility: document.visibilityState
        });
        return originalRaf(cb);
      };
    });

    console.log('Simulating rapid page scrolling...');
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(30);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(30);
    }

    console.log('Simulating rapid visibility tab switching...');
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(20);
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(20);
    }

    await page.waitForTimeout(500);

    // Analyze RAF timestamps
    const rafData = await page.evaluate(() => window.rafTimeStamps);
    expect(rafData.length).toBeGreaterThan(0);

    // Ensure requestAnimationFrame was not invoked while visibilityState was hidden
    const invokesWhileHidden = rafData.filter(d => d.visibility === 'hidden');
    console.log(`requestAnimationFrame calls captured while page was hidden: ${invokesWhileHidden.length}`);
    expect(invokesWhileHidden.length).toBe(0);

    // Verify framerate stability - checking frame intervals (deltas) of visible frames
    const visibleTimes = rafData.filter(d => d.visibility === 'visible').map(d => d.time);
    const deltas = [];
    for (let i = 1; i < visibleTimes.length; i++) {
      const delta = visibleTimes[i] - visibleTimes[i - 1];
      // Skip large deltas due to visibility tab reactivation transitions
      if (delta < 150) {
        deltas.push(delta);
      }
    }

    if (deltas.length > 0) {
      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      console.log(`Average active visible frame delta: ${avgDelta.toFixed(2)}ms (~${(1000/avgDelta).toFixed(1)} FPS)`);
      // Active loop should be throttled to roughly 60FPS (~16.6ms), checking if within safe bounds (8ms - 35ms)
      expect(avgDelta).toBeGreaterThan(8);
      expect(avgDelta).toBeLessThan(35);
    }
  });
});
