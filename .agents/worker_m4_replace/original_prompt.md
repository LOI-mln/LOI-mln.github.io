# Worker M4 Replace Directory
Initialized for Milestone 4: Adversarial Hardening (Replacement).

## 2026-06-07T08:30:06Z
**Context**: Executing Milestone 4: Adversarial Hardening (Edge cases and robust behavior).
**Content**: You are assigned to implement code fixes for the edge cases and bugs identified during the Milestone 3 E2E Integration quality reviews and challenges.

Please read the reports from Challenger M3-2 at `/Users/milan/LOI-mln.github.io/.agents/challenger_m3_2/handoff.md` and Reviewer M3-2 at `/Users/milan/LOI-mln.github.io/.agents/reviewer_m3_2/handoff.md`.

Specifically, you need to implement:
1. **System Theme Sync Robustness (`src/App.jsx`)**:
   - Introduce a `hasUserPref` boolean state tracking whether the user has explicitly set a preference.
   - Initialize it by checking if `localStorage.getItem('theme') !== null` (wrap in a try-catch to return false if blocked).
   - Set `hasUserPref` to `true` inside `toggleTheme`.
   - Update `handleMediaQueryChange` and `handleSystemCheck` (inside the `useEffect` on line 73) to check `if (!hasUserPref)` before calling `setTheme`.
2. **Mobile Menu Canvas Conservation (`src/components/Navbar.jsx`, `src/components/OrganicCanvas.jsx`, `src/components/AntigravityCanvas.jsx`)**:
   - In `Navbar.jsx`, create a helper function `closeMobileMenu = () => { setMobileMenuOpen(false); window.dispatchEvent(new CustomEvent('mobile-menu-toggle', { detail: { open: false } })); };`
   - In `Navbar.jsx`'s `toggleMobileMenu`, dispatch `window.dispatchEvent(new CustomEvent('mobile-menu-toggle', { detail: { open: !mobileMenuOpen } }));`
   - Replace the inline `onClick={() => setMobileMenuOpen(false)}` on mobile links in `Navbar.jsx` with `onClick={closeMobileMenu}`.
   - In both `OrganicCanvas.jsx` and `AntigravityCanvas.jsx`, subscribe to this `mobile-menu-toggle` window event during their mount `useEffect` loops. Keep track of a local `isMobileMenuOpen` variable, and ensure `updateAnimationState` computes `const shouldAnimate = isIntersecting && isPageVisible && !isMobileMenuOpen;` to pause/resume the requestAnimationFrame loop accordingly.
3. **Accessibility (Focus Ring Outline) (`src/components/Navbar.jsx`)**:
   - Remove the inline style `outline: 'none'` on the theme toggle button in `Navbar.jsx` to ensure default keyboard focus outlines are visible, or replace it with proper Tailwind styling.
4. **Custom Cursor Viewport Boundary Escape (`src/components/CustomCursor.jsx`)**:
   - In `CustomCursor.jsx`, subscribe to document-level `mouseleave` and `mouseenter` events to hide the custom cursor dot and ring when the mouse pointer leaves the browser viewport, and show them when it enters.

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Document all changes, build outcomes, and test results in `/Users/milan/LOI-mln.github.io/.agents/worker_m4_replace/handoff.md`.
**Action**: Implement the required fixes, verify the build, write your handoff report, and send a message when done.

## 2026-06-07T08:32:59Z
**Context**: Milestone 4 Adversarial Hardening
**Content**: Challenger M4-1 (Replacement) has completed its white-box audit and generated adversarial test cases.
Please copy the test files from:
- `/Users/milan/.gemini/antigravity/brain/fd514d5c-059b-4445-8930-066d7a41954a/tests/e2e/adversarial-c1.spec.js` to `tests/e2e/adversarial-c1.spec.js`
- `/Users/milan/.gemini/antigravity/brain/7eb03339-10c3-4912-9e51-3af4c8de9a57/tests/e2e/adversarial-c2.spec.js` to `tests/e2e/adversarial-c2.spec.js`
Then, proceed to implement the fixes for all the identified edge cases and bugs:
1. System Theme Sync Robustness (App.jsx)
2. Mobile Menu Canvas Conservation (Navbar.jsx, OrganicCanvas.jsx, AntigravityCanvas.jsx)
3. Accessibility (Focus Ring Outline) (Navbar.jsx)
4. Custom Cursor Viewport Boundary Escape (CustomCursor.jsx)
5. Custom Cursor Hover Sticking on element unmount (CustomCursor.jsx)
Make sure all E2E tests (including the new adversarial ones) pass. Document your changes in your handoff.md.
**Action**: Copy the test files, implement the fixes, run the build/tests, and write your handoff report.
