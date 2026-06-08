# E2E Test Suite Infrastructure & Philosophy

This document outlines the testing philosophy, feature coverage, test architecture, and validation scenarios for the Milan Loï Portfolio project.

---

## 1. Test Philosophy

The E2E test suite is designed around three core pillars:

1. **Opaque-Box Testing**: The application is tested as a fully deployed system from the outside. Rather than inspecting internal React component states directly, the tests interact with the DOM, simulate user inputs (scrolls, clicks, hovers, visibility state changes), and measure real-time performance metrics via browser API instrumentation.
2. **Requirement-Driven Verification**: Test cases are mapped directly to the two core optimized requirements:
   - **R1 (Canvas Performance Optimization)**: Pausing rendering loops when canvases are offscreen or when the page is inactive.
   - **R2 (Polished Theme Toggle Switch)**: Providing an accessible custom switch in the navbar that alters CSS variables, propagates state to canvases, and persists preferences.
3. **Zero-Dependency Hybrid Runner Design**:
   - **Automated CLI Runner (Playwright)**: Heavyweight headless/headed automation for CI pipelines and developer terminal checks.
   - **Visual Browser Iframe Runner (`tests/e2e/e2e-runner.html`)**: A lightweight, native HUD dashboard. By serving the portfolio inside an `iframe`, it injects non-intrusive runtime instrumentation spies (canvas draws, frame timestamps, stroke styles) and runs assertions dynamically in the user's browser without requiring Node.js, CLI dependencies, or local package installs.

---

## 2. Feature Inventory

### Feature 1: Canvas Rendering Performance & Visibility Loop Pausing (F1)
F1 verifies that canvas resources are aggressively conserved to save CPU, GPU, and battery.
- **Initialization**: Ensures both the top-level mesh canvas (`OrganicCanvas`) and the about-section particle canvas (`AntigravityCanvas`) mount and draw.
- **Loop Throttling**: Calculates render loop frame intervals to ensure they match target FPS limits (~60fps).
- **Intersection Pausing**: Uses the `IntersectionObserver` to halt canvas clear and draw calls completely when a canvas scroll-exits the viewport.
- **Visibility-Based Pausing**: Listens to the `visibilitychange` API and halts all render loops when the tab or browser window becomes hidden.
- **Teardown**: Verifies that unmounting the canvas components releases all active loops and handles resizes (including High-DPI scaling modifications).

### Feature 2: Theme Toggle Switch & Style Propagation (F2)
F2 verifies the design, interactivity, accessibility, and correctness of the theme toggle control.
- **Accessibility**: Verifies that the toggle has `role="switch"` and receives keyboard focus.
- **DOM State Inversion**: Confirms the root element (e.g., `<html>` or `<body>`) inverts classes (`.dark`) and custom variables.
- **Style Propagation**: Verifies that color variables change values and that `AntigravityCanvas` updates its drawing colors dynamically in response.
- **State Persistence**: Confirms that theme configurations persist in `localStorage` across page reloads and coordinate in real-time across tabs.
- **Edge Cases**: Validates fallback behaviors when `localStorage` is corrupted or missing, and ensures system theme preferences (media queries) align automatically.

---

## 3. Test Architecture

### Directory Layout
All test assets are colocated under `tests/e2e/` as per project layout constraints:
```
tests/e2e/
├── canvas-performance.spec.js     # F1 - Performance and pausing loops
├── theme-toggle.spec.js           # F2 - Theme switch interactivity and persistence
├── cross-feature.spec.js          # F3 - Multi-feature integration constraints
├── application-scenarios.spec.js  # F4 - End-to-end real-world user journeys
└── e2e-runner.html                # Zero-dependency visual HTML runner
```

### Test Case Format (Playwright Spec)
Tests are declared using Playwright's `test` and `expect` libraries.
- Spies are injected at initialization time using `page.addInitScript()` to override `CanvasRenderingContext2D.prototype.clearRect`, `CanvasRenderingContext2D.prototype.stroke`, and `window.requestAnimationFrame`.
- Global counters (e.g., `window.canvasDraws`, `window.fpsTimeStamps`) track frame counts and draw actions without modifying the underlying component code.
- Example pattern:
  ```javascript
  test('F1-T1-03: Viewport Intersection Pausing', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800); // Wait for IntersectionObserver delay
    
    await page.evaluate(() => {
      window.canvasDraws.organic = 0;
    });
    await page.waitForTimeout(500);
    const draws = await page.evaluate(() => window.canvasDraws);
    expect(draws.organic).toBe(0); // Rendering is paused offscreen
  });
  ```

---

## 4. Tier 4 Scenarios (Real-World E2E Scenarios)

The test suite evaluates real-world usage patterns through 5 designated Tier 4 test cases located in `tests/e2e/application-scenarios.spec.js`:

1. **F4-01: First-Time User Experience (FTUX) in Light Mode**
   - **Goal**: Verify a clean, first-time user sees the overlay loader percentage progress, lands on the default Light theme, and loops behave correctly.
   - **Sequence**:
     1. Clean `localStorage`.
     2. Load root path `/`.
     3. Assert loader overlay is visible and features percentage indicators.
     4. Wait for loader to fade out.
     5. Check that the document does *not* contain the `dark` class.
     6. Scroll to the bottom of the page and assert that rendering loops pause.

2. **F4-02: Returning User with Dark Theme Preference**
   - **Goal**: Verify that returning users with a saved preference load directly into Dark Mode with no layout thrashing.
   - **Sequence**:
     1. Inject `'theme': 'dark'` into `localStorage` before load.
     2. Navigate to `/`.
     3. Wait for the loader to detach.
     4. Assert that the `<html>` or `<body>` element resolves to dark immediately.

3. **F4-03: System Preference Alignment on Load**
   - **Goal**: Ensure that if a user has no prior saved theme, the application respects the system-level color preferences on initial paint.
   - **Sequence**:
     1. Emulate media query `colorScheme: 'dark'`.
     2. Clean `localStorage`.
     3. Load the page and verify dark theme is automatically applied.
     4. Click the theme toggle and verify it overrides to light, storing `'light'` in `localStorage`.

4. **F4-04: Full Interactive Session (Scroll, Hover, Toggle, Return)**
   - **Goal**: Simulate a complete multi-step navigation path through the portfolio.
   - **Sequence**:
     1. Load page and hover over header navigation links (testing hover micro-interactions).
     2. Scroll to the `#about` section and wait for `AntigravityCanvas` to start drawing.
     3. Click the theme toggle in the navbar to change theme values.
     4. Scroll to the very bottom of the document and assert that all rendering loops pause.
     5. Scroll back up to the top and verify `OrganicCanvas` resumes drawing.

5. **F4-05: Mobile Layout Resource Conservation**
   - **Goal**: Verify mobile layouts render the hamburger menu toggle, support theme switching, and aggressively pause animations to preserve mobile battery.
   - **Sequence**:
     1. Set the viewport size to `360x640` (Mobile).
     2. Load page and tap the mobile menu expand button.
     3. Locate and click the theme toggle.
     4. Scroll to the page bottom.
     5. Verify both canvases halt rendering to conserve GPU/CPU operations on a mobile client.

---

## 5. Coverage Thresholds & Metrics

The project enforces strict, tiered coverage thresholds ensuring no feature area goes untested:

### Threshold Summary Table
| Test Tier | Tier Scope | Min Required Cases | Actual Covered Cases | Status |
|---|---|---|---|---|
| **Tier 1** | Component isolation (F1 & F2) | 10 | 10 | ✅ Pass |
| **Tier 2** | Edge cases & boundary limits | 10 | 10 | ✅ Pass |
| **Tier 3** | Cross-feature interaction (F3) | 2 | 2 | ✅ Pass |
| **Tier 4** | Real-world application flows (F4) | 5 | 5 | ✅ Pass |
| **Total** | **All Tiers Combined** | **27** | **27** | ✅ Pass |

### Coverage Checklists
#### Feature 1 (Canvas Performance)
- [x] F1-T1-01: Canvas Mount and Frame Initialization
- [x] F1-T1-02: Render Loop Throttling / FPS Check
- [x] F1-T1-03: Viewport Intersection Pausing
- [x] F1-T1-04: Viewport Intersection Resuming
- [x] F1-T1-05: Page Visibility Pausing
- [x] F1-T2-01: Rapid Scrolling Stress Test
- [x] F1-T2-02: Canvas Resizing / High-DPI Scaling
- [x] F1-T2-03: Zoom and Offscreen Intersections
- [x] F1-T2-04: Long-Term Background Idle & Recovery
- [x] F1-T2-05: Component Unmounting Cleanup

#### Feature 2 (Theme Toggle Switch)
- [x] F2-T1-01: Theme Toggle Presence & Accessibility
- [x] F2-T1-02: DOM Class/Attribute Toggling
- [x] F2-T1-03: Theme shifts CSS Custom Variables
- [x] F2-T1-04: AntigravityCanvas Theme Prop Propagation
- [x] F2-T1-05: Storage Persistence
- [x] F2-T2-01: Rapid Toggle Clicks (Stress Test)
- [x] F2-T2-02: Corrupted or Missing LocalStorage
- [x] F2-T2-03: Cross-Tab Storage Sync
- [x] F2-T2-04: System Theme Preference Changes
- [x] F2-T2-05: Extreme Screen Sizes and Responsiveness

#### Cross-Feature & Scenario (Tiers 3 & 4)
- [x] F3-01: Theme Toggle during Canvas Offscreen/Paused State (Cross-Feature)
- [x] F3-02: Theme Toggle in Background Tab (Cross-Feature)
- [x] F4-01: First-Time User Experience (FTUX) in Light Mode (Scenario)
- [x] F4-02: Returning User with Dark Theme Preference (Scenario)
- [x] F4-03: System Preference Alignment on Load (Scenario)
- [x] F4-04: Full Interactive Session (Scroll, Hover, Toggle, Return) (Scenario)
- [x] F4-05: Mobile Layout Resource Conservation (Scenario)
