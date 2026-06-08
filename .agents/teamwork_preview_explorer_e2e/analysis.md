# E2E Test Suite Infrastructure & Design Proposal

This document outlines the target components audit, test framework feasibility, and a complete tiered test case design for the portfolio's Canvas Rendering Performance & Loop Pausing (F1) and Theme Toggle Switch (F2) features.

---

## 1. Target Components Audit

A review of the target components reveals the following structural details, styling hooks, and feature gaps:

### A. `src/App.jsx` (Core Application Container)
- **Current Role**: Manages application mounting, a simulated custom loading screen (1.8s delay, lines 115-121), Lenis smooth scroll initialization (lines 66-101), and section structure.
- **Mouting Coordinates**:
  - `OrganicCanvas` is mounted globally as a background (line 174).
  - `Navbar` is mounted globally (line 183).
  - `AntigravityCanvas` is mounted in the `#about` section ("Au-delà du code", line 205) with static props: `mode="light"`, `colorScheme="amber"`, `density="low"`.
- **Gaps**: 
  - No global theme state (`theme` or `setTheme`) is currently present.
  - No theme propagation props are wired to `Navbar` or `AntigravityCanvas` dynamically.

### B. `src/components/Navbar.jsx` (Sticky Navigation Header)
- **Current Role**: Renders desktop links (lines 150-175), social icons (lines 189-226), a contacts button animating on scroll (lines 228-253), and a collapsible mobile dropdown menu (lines 278-377).
- **Gaps**:
  - **No theme toggle switch exists** anywhere in the navigation bar.
  - To support F2, a highly interactive sun/moon switch must be integrated (preferably as a button with `role="switch"` or an accessible custom button near the social links).

### C. `src/components/OrganicCanvas.jsx` (Background Wavy Grid)
- **Current Role**: Renders a dynamic mathematical grid using HTML5 Canvas 2D API inside a `requestAnimationFrame` loop (lines 51-160). It listens to global window resizing and mouse events, repelling grid intersection coordinates and adding glowing highlights near the cursor.
- **Gaps**:
  - **No rendering pause mechanism**: The `drawMesh` loop runs continuously in the background, consuming CPU/GPU cycles even when the user scrolls completely away from the top or minimizes the window.
  - **No theme adaptability**: It uses a hardcoded, static grey stroke style (`rgba(17, 24, 39, 0.035)`, line 117) and is unaware of theme changes.

### D. `src/components/AntigravityCanvas.jsx` (Stellar Constellation)
- **Current Role**: Simulates orbital floating particles in the `#about` section. Adjusts particle count based on density props (`high` = 80, `medium` = 50, `low` = 25, lines 42-45) and checks screen width to throttle counts on mobile devices. Adjusts particle size, opacity, and line colors based on the `mode` prop (lines 50-69, 104-106, 249-253).
- **Instrumentation**:
  - Prints debug logs on mount (line 15), size initialization (line 38), particle initialization (line 190), active rendering frames for the first 3 frames (line 220), resizing (line 79), and unmount (line 268).
- **Gaps**:
  - **No rendering pause mechanism**: The render loop runs continuously as long as the component is mounted, regardless of whether the `#about` section is visible on screen.

---

## 2. E2E Testing Feasibility & Infrastructure Analysis

Since the target environment is restricted to **CODE_ONLY network mode** and running commands requires explicit user approvals (which can time out), heavy testing frameworks requiring runtime installation/binary downloads are not feasible to execute *during* the isolated agent run. However, the target infrastructure must support two modes of testing to be fully viable for local and automated runs:

### Feasibility Comparison Matrix

| Runner Option | Setup & Run Feasibility in Isolated Agent Env | Feasibility on Developer Local Machine | Testing Capabilities (FPS, Intersection, Visibility) |
|---|---|---|---|
| **Playwright** | **Low** (Fails to download browsers via CLI due to network block) | **High** (Standard npm install & execution) | **Excellent** (Native visibility testing, browser logs, CDP performance APIs, tracing) |
| **Cypress** | **Low** (Fails to download binary due to network block) | **High** (Standard npm install & execution) | **Good** (Good DOM testing, but harder to capture low-level WebGL/Canvas FPS metrics) |
| **Vitest + JSDOM** | **Medium** (Runs fast but lacks real Canvas & browser APIs) | **High** (Standard npm install) | **Low** (No real rendering loop, no layout engine, mocks required for IntersectionObserver/Visibility) |
| **Custom Iframe HTML Runner** | **High** (Zero dependencies, runs instantly on static/served files) | **High** (Open HTML file or view dev route) | **Excellent** (Can spy on frame rates, manipulate scroll, and assert visibility inside true browser runtime) |

### Proposing a Dual-Layered E2E Testing Infrastructure

To resolve these constraints, we propose a **Dual-Layered E2E Testing Infrastructure**:

1. **Layer A: Playwright Test Suite (Local Developer/CI Engine)**:
   - Designed for standard execution.
   - Written in a `tests/e2e/` folder with a root `playwright.config.js`.
   - Leverages Chrome DevTools Protocol (CDP) to track FPS and CPU usage, and uses native viewport scrolling and visibility mocks to verify loop pausing.
2. **Layer B: Self-Contained Browser HTML Runner (`e2e-runner.html`)**:
   - A zero-dependency fallback that can run in any browser.
   - Mounts the portfolio app inside a sandboxed `<iframe>`.
   - Monkey-patches `iframe.contentWindow.requestAnimationFrame` and canvas context prototypes to capture frame loop activity.
   - Programmatically scrolls the iframe and dispatches visibility events to assert performance states.
   - Outputs a visual dashboard report directly in the browser.

---

## 3. Proposed Test Case Design (Tiers 1-4)

### Feature 1: Canvas Rendering Performance & Loop Pausing (F1)

#### Tier 1: Feature Coverage (Minimum: 5 cases)
- **F1-T1-01: Canvas Mount and Frame Initialization**
  - *Description*: Verify that `OrganicCanvas` and `AntigravityCanvas` successfully create `<canvas>` elements in the DOM and render their initial frames.
  - *Assertion*: Canvas elements are visible in DOM (`canvasRef` is not null); console logs containing `[AntigravityCanvas] MOUNTED` and `STARTING RENDER LOOP` are printed.
- **F1-T1-02: Render Loop Throttling / FPS Check**
  - *Description*: Verify that the canvas runs at standard browser refresh rates (approx. 60fps) under normal conditions.
  - *Assertion*: The average time delta between 3 consecutive `requestAnimationFrame` calls is between 15ms and 18.5ms (target: 16.6ms for 60Hz).
- **F1-T1-03: Viewport Intersection Pausing**
  - *Description*: Verify that when the canvas elements scroll out of the viewport, their animation loop is cancelled.
  - *Assertion*: Scroll past the `#about` section. Verify that `cancelAnimationFrame` is called and no new frames are requested (0 calls to `requestAnimationFrame` over a 500ms window).
- **F1-T1-04: Viewport Intersection Resuming**
  - *Description*: Verify that when an off-screen canvas scrolls back into the viewport, the animation frame loop restarts.
  - *Assertion*: Scroll back to the `#about` section. Verify that the loop starts requesting animation frames again (verify frame counts increase and delta times are stable).
- **F1-T1-05: Page Visibility Pausing**
  - *Description*: Verify that when the browser tab is hidden/minimized, loops pause.
  - *Assertion*: Dispatches `visibilitychange` with `document.visibilityState === 'hidden'`. Asserts that the rendering loop pauses (no new drawings to the canvas context).

#### Tier 2: Boundary & Corner Cases (Minimum: 5 cases)
- **F1-T2-01: Rapid Scrolling Stress Test**
  - *Description*: Scroll up and down rapidly (10 scrolls in 1 second) to test IntersectionObserver stability.
  - *Assertion*: Verify that no overlapping loops are created, `cancelAnimationFrame` matches the number of pauses, and the final rendering state matches the viewport position.
- **F1-T2-02: Canvas Resizing / High-DPI Scaling**
  - *Description*: Trigger window resize events to verify layout adaptation without frame drops.
  - *Assertion*: Resizes viewport. Verify console prints `[AntigravityCanvas] RESIZED` and canvas width/height match the container's layout boundary multiplied by `devicePixelRatio`.
- **F1-T2-03: Zoom and Offscreen Intersections**
  - *Description*: Simulate browser zoom levels (e.g. 50% and 200%) and scroll boundaries.
  - *Assertion*: Verify that intersection thresholds are calculated correctly based on bounding client rects and the canvases pause exactly when out of the visible screen.
- **F1-T2-04: Long-Term Background Idle & Recovery**
  - *Description*: Leave the tab backgrounded for an extended period, then return.
  - *Assertion*: Keep tab hidden for 5 seconds. Reactivate tab. Asserts that the loop resumes instantly and that the internal particles' delta-time step does not cause physics engine explosions (particles jumping instantly off-screen).
- **F1-T2-05: Component Unmounting Cleanup**
  - *Description*: Force unmount of the canvases to verify clean tear-down.
  - *Assertion*: Unmount component. Verify `cancelAnimationFrame` has been called, the `IntersectionObserver` is disconnected, and zero references to the drawing loop remain in memory.

---

### Feature 2: Theme Toggle Switch (F2)

#### Tier 1: Feature Coverage (Minimum: 5 cases)
- **F2-T1-01: Theme Toggle Presence & Accessibility**
  - *Description*: Verify a theme toggle is present in the Navbar and keyboard navigable.
  - *Assertion*: Toggle button exists with role `"switch"`, is focusable using Tab, and activates on Enter/Space keys.
- **F2-T1-02: DOM Class/Attribute Toggling**
  - *Description*: Click the toggle and verify attributes update on the root element.
  - *Assertion*: Toggling from light to dark adds the `.dark` class (or `data-theme="dark"` attribute) to the `<html>` or `<body>` element.
- **F2-T1-03: CSS Custom Variable Override**
  - *Description*: Verify that CSS variables update to match the active theme.
  - *Assertion*: Read computed styles of `body` (`--bg-primary` and `--text-primary`). Confirm light theme values invert to dark theme values (e.g. background changes from `#ffffff` to `#111827`).
- **F2-T1-04: AntigravityCanvas Theme Prop Propagation**
  - *Description*: Verify that parent theme changes update the canvas.
  - *Assertion*: Click toggle. Verify prop `mode` changes to `"dark"`. Inspect canvas drawing styles: verify line strokes transition from amber or grey transparent lines to white transparent lines (`rgba(255, 255, 255, ...)`).
- **F2-T1-05: Storage Persistence**
  - *Description*: Verify theme choice persists across page reloads.
  - *Assertion*: Click toggle to dark mode. Reload the page. Verify the page renders in dark mode immediately and `localStorage.getItem('theme') === 'dark'`.

#### Tier 2: Boundary & Corner Cases (Minimum: 5 cases)
- **F2-T2-01: Rapid Toggle Clicks (Stress Test)**
  - *Description*: Click the toggle button rapidly (10 times in 2 seconds) to stress-test React render cycles.
  - *Assertion*: Verify the interface does not lock up, CSS transition states remain clean, and the final theme corresponds correctly to the odd/even count of clicks.
- **F2-T2-02: Corrupted or Missing LocalStorage**
  - *Description*: Test app startup with missing or corrupt theme keys in database.
  - *Assertion*: Mock `localStorage.getItem('theme')` returning `"invalid-value"`. Start the app. Verify it defaults gracefully to system preferences (`prefers-color-scheme`) without crashing.
- **F2-T2-03: Cross-Tab Storage Sync**
  - *Description*: Toggle theme in one tab and verify updates in a second concurrent tab.
  - *Assertion*: Trigger a `storage` event in the window context (`key: "theme", newValue: "dark"`). Verify the current window updates its styles and class attributes to dark mode dynamically.
- **F2-T2-04: System Theme Preference Changes**
  - *Description*: Change OS theme setting and verify portfolio updates when no local override is set.
  - *Assertion*: Mock `matchMedia` for `(prefers-color-scheme: dark)` to return true. Verify document theme updates automatically to dark mode.
- **F2-T2-05: Extreme Screen Sizes and Responsiveness**
  - *Description*: Verify toggle accessibility on wide, narrow, and mobile sizes.
  - *Assertion*: Verify toggle button stays visible and clickable on viewports of 320px (inside mobile menu), 768px, 1200px, and 2560px.

---

### Tier 3: Cross-Feature Combinations (Minimum: 1 case per feature pair)

- **F3-01: Theme Toggle during Canvas Offscreen/Paused State**
  - *Description*: Scroll down past canvases so loops pause. Switch theme to dark mode. Verify states. Scroll back.
  - *Assertion*:
    1. Scroll page down (verify canvases pause, `cancelAnimationFrame` triggers).
    2. Click theme toggle button to switch to dark mode.
    3. Assert `html` element gets `.dark`, but canvases *do not restart* rendering while offscreen.
    4. Scroll back into viewport.
    5. Assert canvases resume rendering, and `AntigravityCanvas` instantly starts rendering using dark mode parameters (no light-theme color leaks or flash).
- **F3-02: Theme Toggle in Background Tab (Resource Conservation)**
  - *Description*: Minimize/hide tab, trigger theme change via cross-tab storage sync, and verify no frames are rendered.
  - *Assertion*:
    1. Set visibilityState to `'hidden'` (verify loops pause).
    2. Trigger theme change in storage.
    3. Verify props updated, but no `requestAnimationFrame` calls occur.
    4. Restore visibilityState to `'visible'`. Verify loops resume with new theme styles.

---

### Tier 4: Real-World Application Scenarios (Minimum: 5 scenarios)

- **F4-01: First-Time User Experience (FTUX) in Light Mode**
  - *Steps*:
    1. Clean storage. Set system preference to light.
    2. Load index page. Assert loading progress displays 0% -> 100% and blocks scrolling.
    3. Assert navbar and hero render in light theme.
    4. Scroll to bottom. Assert `OrganicCanvas` pauses when offscreen.
    5. Hover cursor over about card, verify magnetic repulsion on `AntigravityCanvas` (amber colors).
- **F4-02: Returning User with Dark Theme Preference**
  - *Steps*:
    1. Pre-populate `localStorage.setItem('theme', 'dark')`.
    2. Load index page.
    3. Assert loading screen has dark-themed grid elements, and the page mounts immediately with the `.dark` class.
    4. Scroll and confirm canvases pause/resume viewport-based transitions without flashing to light mode.
- **F4-03: System Preference Alignment on Load**
  - *Steps*:
    1. Clear storage. Set system preference to dark.
    2. Load index page. Verify the app detects the system setting and applies dark mode automatically.
    3. Click the toggle in the navbar. Verify theme overrides to light mode and saves `theme: "light"` in `localStorage`.
- **F4-04: Full Interactive Session (Scroll, Hover, Toggle, Return)**
  - *Steps*:
    1. Load page (light mode).
    2. Hover navbar to verify transitions.
    3. Scroll past Hero (Navbar collapses, contact button animates in, `OrganicCanvas` pauses).
    4. Enter about section (`AntigravityCanvas` triggers render, console prints mounts).
    5. Click theme toggle in sticky navbar to switch to dark. Verify canvas particle colors change.
    6. Scroll to timeline (canvases pause). Scroll back to top (canvases resume).
- **F4-05: Mobile Layout Resource Conservation**
  - *Steps*:
    1. Set viewport to 360x640 (simulating mobile).
    2. Load page. Assert particle counts are throttled: `AntigravityCanvas` target count is set to low/mobile density (12-25 particles instead of 50-80).
    3. Open mobile menu, tap theme toggle. Confirm theme changes.
    4. Close menu, scroll to content. Confirm canvas rendering loops pause when off-screen to preserve mobile battery.

---

## 4. Proposed E2E Implementation Drafts

### Code Draft 1: Playwright Configuration (`playwright.config.js`)
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Code Draft 2: Playwright Theme Spec (`tests/e2e/theme-toggle.spec.js`)
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature 2: Theme Toggle Switch E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    // bypass the loader overlay timer by overriding loading state if needed,
    // or wait for loader to disappear
    await page.goto('/');
    await page.waitForSelector('.loader-overlay', { state: 'detached', timeout: 5000 });
  });

  test('F2-T1-01 & 02: Toggle theme switch elements and DOM classes', async ({ page }) => {
    const toggle = page.locator('header button[role="switch"], header button.theme-toggle-btn');
    await expect(toggle).toBeVisible();

    // Verify default theme is light
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Toggle theme to dark
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Toggle back to light
    await toggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('F2-T1-03: Theme shifts CSS Custom Variables', async ({ page }) => {
    const toggle = page.locator('header button.theme-toggle-btn');
    
    // Light variables evaluation
    let bgValue = await page.evaluate(() => 
      getComputedStyle(document.body).getPropertyValue('--bg-primary').trim()
    );
    expect(bgValue.toLowerCase()).toBe('#ffffff');

    // Switch theme
    await toggle.click();

    // Dark variables evaluation
    bgValue = await page.evaluate(() => 
      getComputedStyle(document.body).getPropertyValue('--bg-primary').trim()
    );
    expect(bgValue.toLowerCase()).not.toBe('#ffffff'); // should match dark variable e.g. #111827
  });

  test('F2-T1-05: Storage persistence check', async ({ page }) => {
    const toggle = page.locator('header button.theme-toggle-btn');
    await toggle.click(); // switch to dark

    // Confirm localstorage setting
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('dark');

    // Reload page
    await page.reload();
    await page.waitForSelector('.loader-overlay', { state: 'detached' });

    // HTML should still contain dark class immediately on restoration
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
```

### Code Draft 3: Playwright Performance Spec (`tests/e2e/canvas-performance.spec.js`)
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature 1: Canvas Loop Pausing Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.loader-overlay', { state: 'detached' });
  });

  test('F1-T1-03 & 04: Verify loops pause and resume based on scrolling viewport', async ({ page }) => {
    // 1. Set up a listener for requestAnimationFrame loops inside the page context
    await page.evaluate(() => {
      window.rafCount = 0;
      const originalRaf = window.requestAnimationFrame;
      window.requestAnimationFrame = function (cb) {
        window.rafCount++;
        return originalRaf(cb);
      };
    });

    // Let the page render a few frames initially
    await page.waitForTimeout(300);
    const initialCount = await page.evaluate(() => window.rafCount);
    expect(initialCount).toBeGreaterThan(0);

    // 2. Scroll to the bottom of the page (making OrganicCanvas and AntigravityCanvas offscreen)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500); // let transition and IntersectionObserver trigger

    // Reset loop counter
    await page.evaluate(() => { window.rafCount = 0; });
    await page.waitForTimeout(500); // verify frames over a half-second window

    const offscreenCount = await page.evaluate(() => window.rafCount);
    // Intersection Observer should have paused both rendering loops, leading to 0 new RAF calls
    expect(offscreenCount).toBe(0);

    // 3. Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Reset loop counter
    await page.evaluate(() => { window.rafCount = 0; });
    await page.waitForTimeout(300);

    const onScreenCount = await page.evaluate(() => window.rafCount);
    // rendering loops should resume requesting frames on screen
    expect(onScreenCount).toBeGreaterThan(0);
  });

  test('F1-T1-05: Tab Visibility changes pause animation loops', async ({ page }) => {
    // Setup RAF spy
    await page.evaluate(() => {
      window.rafCount = 0;
      const originalRaf = window.requestAnimationFrame;
      window.requestAnimationFrame = function (cb) {
        window.rafCount++;
        return originalRaf(cb);
      };
    });

    // Minimize tab visibility programmatically
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    
    await page.waitForTimeout(500);
    await page.evaluate(() => { window.rafCount = 0; });
    await page.waitForTimeout(500);

    const pausedCount = await page.evaluate(() => window.rafCount);
    expect(pausedCount).toBe(0);
  });
});
```

### Code Draft 4: Lightweight Offline Custom Test Runner (`e2e-runner.html`)

This file is a standalone utility designed to run inside any web browser, loading the portfolio via iframe and running assertions with zero dependencies. It can be placed in `tests/e2e/e2e-runner.html` or in the root.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Portfolio E2E Test Suite Dashboard</title>
  <style>
    body {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #090a0f;
      color: #e2e8f0;
      margin: 0;
      padding: 24px;
      display: flex;
      height: 100vh;
      box-sizing: border-box;
      gap: 20px;
    }
    #sidebar {
      width: 400px;
      background: #11131e;
      border: 1px solid #1f2335;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
    }
    #preview-container {
      flex: 1;
      background: #0f111a;
      border: 1px solid #1f2335;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: white;
    }
    h1, h2 {
      margin: 0;
      color: #f8fafc;
    }
    h1 { font-size: 1.25rem; font-weight: 800; border-bottom: 1px solid #1f2335; padding-bottom: 12px; }
    h2 { font-size: 0.95rem; }
    .btn {
      background: #e35d3b;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
    }
    .btn:hover { background: #c54425; }
    .test-case {
      padding: 12px;
      background: #1a1d2e;
      border-radius: 8px;
      border-left: 4px solid #4b526d;
      font-size: 0.85rem;
    }
    .test-case.pending { border-left-color: #e3b341; }
    .test-case.pass { border-left-color: #10b981; background: #122223; }
    .test-case.fail { border-left-color: #f43f5e; background: #24141d; }
    .status-badge {
      float: right;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
    .status-badge.pass { color: #10b981; }
    .status-badge.fail { color: #f43f5e; }
    .status-badge.pending { color: #e3b341; }
    #stats {
      font-size: 0.8rem;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <div id="sidebar">
    <h1>E2E Test Runner</h1>
    <div id="stats">
      <span>Tests: <strong id="total-count">0</strong></span>
      <span>Passed: <strong id="pass-count" style="color: #10b981;">0</strong></span>
      <span>Failed: <strong id="fail-count" style="color: #f43f5e;">0</strong></span>
    </div>
    <button class="btn" id="run-btn">Run E2E Suite</button>
    <div id="test-list" style="display: flex; flex-direction: column; gap: 10px;">
      <!-- Dyn loaded -->
    </div>
  </div>

  <div id="preview-container">
    <div style="background: #11131e; padding: 10px 20px; font-size: 0.8rem; border-bottom: 1px solid #1f2335;">
      App Preview Frame: <span id="frame-url">idle</span>
    </div>
    <iframe id="app-frame" src="about:blank"></iframe>
  </div>

  <script>
    const tests = [
      { id: 'F1-T1-01', name: 'Canvas Mount & Render initialization', run: testCanvasMount },
      { id: 'F1-T1-03', name: 'Canvas Intersection loop pausing', run: testCanvasPausing },
      { id: 'F2-T1-01', name: 'Theme Toggle Presence & Layout', run: testTogglePresence },
      { id: 'F2-T1-02', name: 'HTML Class Toggling & Attribute checks', run: testClassToggling },
      { id: 'F2-T1-05', name: 'Theme storage state persistence', run: testStoragePersistence }
    ];

    const testList = document.getElementById('test-list');
    const totalCount = document.getElementById('total-count');
    const passCount = document.getElementById('pass-count');
    const failCount = document.getElementById('fail-count');
    const runBtn = document.getElementById('run-btn');
    const frame = document.getElementById('app-frame');

    totalCount.textContent = tests.length;

    // Build visual list
    tests.forEach(t => {
      const div = document.createElement('div');
      div.className = 'test-case pending';
      div.id = `tc-${t.id}`;
      div.innerHTML = `
        <span class="status-badge pending" id="badge-${t.id}">pending</span>
        <strong>${t.id}</strong>: ${t.name}
        <div class="test-error" id="err-${t.id}" style="color: #f43f5e; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
      `;
      testList.appendChild(div);
    });

    runBtn.addEventListener('click', runAllTests);

    async function runAllTests() {
      runBtn.disabled = true;
      runBtn.textContent = 'Running tests...';
      passCount.textContent = 0;
      failCount.textContent = 0;

      // Reset items
      tests.forEach(t => {
        const div = document.getElementById(`tc-${t.id}`);
        div.className = 'test-case pending';
        const badge = document.getElementById(`badge-${t.id}`);
        badge.className = 'status-badge pending';
        badge.textContent = 'pending';
        document.getElementById(`err-${t.id}`).style.display = 'none';
      });

      let passed = 0;
      let failed = 0;

      for (let t of tests) {
        const div = document.getElementById(`tc-${t.id}`);
        const badge = document.getElementById(`badge-${t.id}`);
        const errDiv = document.getElementById(`err-${t.id}`);
        
        try {
          // Reset frame for isolated run
          frame.src = 'index.html'; 
          await new Promise(r => frame.onload = r);
          // Wait for custom loader to fade out (approx 2s in portfolio)
          await new Promise(r => setTimeout(r, 2600));

          await t.run(frame.contentWindow, frame.contentDocument);
          
          div.className = 'test-case pass';
          badge.className = 'status-badge pass';
          badge.textContent = 'pass';
          passed++;
          passCount.textContent = passed;
        } catch (err) {
          div.className = 'test-case fail';
          badge.className = 'status-badge fail';
          badge.textContent = 'fail';
          errDiv.textContent = err.message;
          errDiv.style.display = 'block';
          failed++;
          failCount.textContent = failed;
        }
      }

      runBtn.disabled = false;
      runBtn.textContent = 'Run E2E Suite';
    }

    // --- Assertions ---
    function testCanvasMount(win, doc) {
      const canvases = doc.querySelectorAll('canvas');
      if (canvases.length < 2) {
        throw new Error(`Expected at least 2 canvases, found ${canvases.length}`);
      }
    }

    async function testCanvasPausing(win, doc) {
      let frameCount = 0;
      const originalRaf = win.requestAnimationFrame;
      win.requestAnimationFrame = function(cb) {
        frameCount++;
        return originalRaf(cb);
      };

      // Let animation loop run
      await new Promise(r => setTimeout(r, 200));
      if (frameCount === 0) {
        throw new Error('Animation loop not active on mount');
      }

      // Scroll to bottom (forces pause via IntersectionObserver)
      win.scrollTo(0, doc.body.scrollHeight);
      await new Promise(r => setTimeout(r, 600));

      frameCount = 0;
      await new Promise(r => setTimeout(r, 300));
      if (frameCount > 0) {
        throw new Error(`Expected rendering loop to pause off-screen, but captured ${frameCount} frame requests.`);
      }
    }

    function testTogglePresence(win, doc) {
      // Find theme toggle button
      const toggle = doc.querySelector('header button[role="switch"], header button.theme-toggle-btn') || 
                     Array.from(doc.querySelectorAll('header button')).find(b => b.textContent.toLowerCase().includes('theme') || b.querySelector('svg'));
      if (!toggle) {
        throw new Error('Theme toggle switch button not found in navigation bar header');
      }
    }

    async function testClassToggling(win, doc) {
      const toggle = doc.querySelector('header button[role="switch"], header button.theme-toggle-btn') || 
                     Array.from(doc.querySelectorAll('header button')).find(b => b.textContent.toLowerCase().includes('theme') || b.querySelector('svg'));
      if (!toggle) throw new Error('Theme toggle button not found');
      
      const html = doc.documentElement;
      const initialDark = html.classList.contains('dark') || html.getAttribute('data-theme') === 'dark';
      
      toggle.click();
      await new Promise(r => setTimeout(r, 100)); // wait for state trigger
      
      const finalDark = html.classList.contains('dark') || html.getAttribute('data-theme') === 'dark';
      if (initialDark === finalDark) {
        throw new Error('Root HTML element did not transition theme classes after click');
      }
    }

    async function testStoragePersistence(win, doc) {
      const toggle = doc.querySelector('header button.theme-toggle-btn') || 
                     Array.from(doc.querySelectorAll('header button')).find(b => b.textContent.toLowerCase().includes('theme') || b.querySelector('svg'));
      if (!toggle) throw new Error('Theme toggle button not found');
      
      toggle.click();
      await new Promise(r => setTimeout(r, 100));
      
      const theme = win.localStorage.getItem('theme');
      if (theme !== 'dark' && theme !== 'light') {
        throw new Error(`Theme state was not synchronized with LocalStorage (got: ${theme})`);
      }
    }
  </script>
</body>
</html>
```

---

## 5. Conclusion & Recommendations

1. **Address Feature Gap First**: The theme toggle switch is completely missing from `Navbar.jsx`, and `OrganicCanvas` contains no theme adaptation hooks. These must be implemented in the respective tracks before F2 can be tested.
2. **Implement Viewport Observers**: Viewport pausing using Intersection Observer must be implemented inside `OrganicCanvas.jsx` and `AntigravityCanvas.jsx`.
3. **Execute via Dual-Layer Testing**: Due to command approval timeout risks and sandbox network restrictions inside the agent runtime environment, automated E2E tests should be designed using the Playwright specs proposed above, but verified locally. The custom iframe-based runner (`e2e-runner.html`) provides a zero-dependency local browser backup to quickly verify rendering loops, scrolls, and toggle states without Node.js tooling issues.
