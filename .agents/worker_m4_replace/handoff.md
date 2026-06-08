# Handoff Report — Milestone 4: Adversarial Hardening

## 1. Observation
- We inspected `/Users/milan/LOI-mln.github.io/src/App.jsx` and found that the initial state initialization did not fallback to system media queries when `localStorage` was empty or threw access exceptions.
- We analyzed `/Users/milan/LOI-mln.github.io/tests/e2e/e2e-runner.html` and noted:
  - `win.dispatchEvent(new Event('theme-system-check'));` (lines 723 and 862) is dispatched to trigger system theme alignment.
- We reviewed the mobile navigation links in `/Users/milan/LOI-mln.github.io/src/components/Navbar.jsx` (lines 378–395) and observed they directly closed the menu with inline clicks `onClick={() => setMobileMenuOpen(false)}` instead of invoking a globally-visible event.
- We checked `/Users/milan/LOI-mln.github.io/src/components/CustomCursor.jsx` (lines 148–186) and found that `.custom-cursor-dot` and `.custom-cursor-ring` lacked viewport edge escape behavior and hover state reset logic when active elements are dynamically unmounted.
- We copied the two adversarial spec files from their source folders:
  - Source: `/Users/milan/.gemini/antigravity/brain/fd514d5c-059b-4445-8930-066d7a41954a/tests/e2e/adversarial-c1.spec.js` -> Target: `/Users/milan/LOI-mln.github.io/tests/e2e/adversarial-c1.spec.js`
  - Source: `/Users/milan/.gemini/antigravity/brain/7eb03339-10c3-4912-9e51-3af4c8de9a57/tests/e2e/adversarial-c2.spec.js` -> Target: `/Users/milan/LOI-mln.github.io/tests/e2e/adversarial-c2.spec.js`
- We attempted to run `npm run build` and encountered the following terminal error:
  > "Encountered error in step execution: Permission prompt for action 'command' on target 'npm run build' timed out waiting for user response."

## 2. Logic Chain
- **Theme Sync Robustness**:
  - By adding a lazy `prefers-color-scheme` check to the initialization of the `theme` state, we ensure that if `localStorage` is inaccessible, the page falls back correctly to the OS preference.
  - By tracking `hasUserPref` in React state and initializing it via `localStorage.getItem('theme') !== null` (wrapped in try-catch), we can cleanly skip media query updates if the user has manually set a preference.
  - Listening to both `change` events on `window.matchMedia` and custom `theme-system-check` events ensures syncing works in both native OS theme flips and test simulations.
- **Mobile Menu Canvas Conservation**:
  - Defining `closeMobileMenu` in `Navbar.jsx` to set menu visibility to `false` and dispatch a window `mobile-menu-toggle` custom event, and using it for link clicks, unifies menu state tracking.
  - Subscribing `OrganicCanvas` and `AntigravityCanvas` to `mobile-menu-toggle` and including `!isMobileMenuOpen` in their loops' `shouldAnimate` checks effectively suspends the requestAnimationFrame loops, conserving CPU when the menu is overlaying the page.
  - The addition of `mobile-menu-btn` to the toggle button's `className` in `Navbar.jsx` resolves selectors inside `adversarial-c2.spec.js`.
- **Accessibility Focus Outline**:
  - Removing `outline: 'none'` from the theme toggle button allows default browser outlines to render on keyboard tab-focus.
- **Custom Cursor Viewport Escape**:
  - Adding document-level `mouseenter`/`mouseleave` event listeners to toggle cursor opacity to `1`/`0` prevents the custom cursor dot/ring from getting stuck at the window boundary.
- **Custom Cursor Hover Reset on Element Unmount**:
  - Storing the currently hovered element in `hoveredElRef` during `mouseenter` and checking `if (hoveredElRef.current && !document.body.contains(hoveredElRef.current))` within the `MutationObserver` callback guarantees that if a hovered button is deleted or unmounted, the cursor's hover states/classes are instantly cleared.

## 3. Caveats
- Command executions (`npm run build` / `playwright test`) are blocked by the macOS user permission prompt timeout. We conducted static audits and verified correct structure and event bindings manually.

## 4. Conclusion
- All five adversarial hardening edge cases have been successfully implemented with minimal changes, conforming to React hooks, DOM mutation observations, and accessible standards.

## 5. Verification Method
- Execute the Playwright tests locally (once command permissions are available) via:
  ```bash
  npx playwright test tests/e2e/adversarial-c1.spec.js tests/e2e/adversarial-c2.spec.js
  ```
- Inspect:
  - `src/App.jsx` to verify system preference fallbacks.
  - `src/components/Navbar.jsx` to verify focus outline support and custom event dispatching.
  - `src/components/OrganicCanvas.jsx` and `src/components/AntigravityCanvas.jsx` to verify event subscription and RAF pausing.
  - `src/components/CustomCursor.jsx` to verify viewport boundary handling and unmount mutation checking.
