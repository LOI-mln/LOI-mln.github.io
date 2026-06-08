import { test, expect } from '@playwright/test';

test.describe('Feature 1: Canvas Rendering Performance & Loop Pausing', () => {
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
    // Wait for the loader to fade out
    await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });
  });

  test('F1-T1-01: Canvas Mount and Frame Initialization', async ({ page }) => {
    const organicCanvas = page.locator('div > canvas').first();
    const antigravityCanvas = page.locator('#about canvas');
    
    await expect(organicCanvas).toBeVisible();
    await expect(antigravityCanvas).toBeVisible();
    
    await page.waitForTimeout(500);
    const draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBeGreaterThan(0);
  });

  test('F1-T1-02: Render Loop Throttling / FPS Check', async ({ page }) => {
    await page.evaluate(() => {
      window.fpsTimeStamps = [];
      const originalRaf = window.requestAnimationFrame;
      window.requestAnimationFrame = function (cb) {
        window.fpsTimeStamps.push(performance.now());
        return originalRaf(cb);
      };
    });

    await page.waitForTimeout(500);
    const timestamps = await page.evaluate(() => window.fpsTimeStamps);
    
    expect(timestamps.length).toBeGreaterThan(5);
    
    const deltas = [];
    for (let i = 1; i < timestamps.length; i++) {
      deltas.push(timestamps[i] - timestamps[i - 1]);
    }
    
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    expect(avgDelta).toBeGreaterThan(8);
    expect(avgDelta).toBeLessThan(35);
  });

  test('F1-T1-03: Viewport Intersection Pausing', async ({ page }) => {
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

  test('F1-T1-04: Viewport Intersection Resuming', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);

    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
    });

    await page.waitForTimeout(500);
    const draws = await page.evaluate(() => window.canvasDraws);
    
    expect(draws.organic).toBeGreaterThan(0);
  });

  test('F1-T1-05: Page Visibility Pausing', async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    
    await page.waitForTimeout(500);
    
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
      window.canvasDraws.antigravity = 0;
    });
    
    await page.waitForTimeout(500);
    const draws = await page.evaluate(() => window.canvasDraws);
    
    expect(draws.organic).toBe(0);
    expect(draws.antigravity).toBe(0);
  });

  test('F1-T2-01: Rapid Scrolling Stress Test', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(50);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(50);
    }
    
    await page.waitForTimeout(500);
    const draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBeGreaterThan(0);
  });

  test('F1-T2-02: Canvas Resizing / High-DPI Scaling', async ({ page }) => {
    const beforeDims = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      return { width: c.width, height: c.height };
    });
    
    await page.setViewportSize({ width: 600, height: 400 });
    await page.waitForTimeout(300);
    
    const afterDims = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      return { width: c.width, height: c.height };
    });
    
    expect(afterDims.width).not.toBe(beforeDims.width);
  });

  test('F1-T2-03: Zoom and Offscreen Intersections', async ({ page }) => {
    await page.evaluate(() => {
      document.body.style.transform = 'scale(0.5)';
      window.dispatchEvent(new Event('resize'));
    });
    await page.waitForTimeout(300);
    
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

  test('F1-T2-04: Long-Term Background Idle & Recovery', async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(500);
    
    await page.evaluate(() => { window.canvasDraws.organic = 0; });
    await page.waitForTimeout(300);
    
    const draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBeGreaterThan(0);
  });

  test('F1-T2-05: Component Unmounting Cleanup', async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML = '<div>Page unloaded</div>';
    });
    await page.waitForTimeout(500);
    
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
