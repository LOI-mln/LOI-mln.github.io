## 2026-06-06T17:42:31Z
You are the Worker for Milestone 1: Canvas Performance Optimization (Fixes).
Your task is to fix gaps and bugs identified during the review of /Users/milan/LOI-mln.github.io/src/components/OrganicCanvas.jsx.
Your working directory is /Users/milan/LOI-mln.github.io/.agents/worker_m1_fix/.

Specifically, modify /Users/milan/LOI-mln.github.io/src/components/OrganicCanvas.jsx:
1. Add a page visibility check to prevent rendering when the browser tab is hidden:
   - Track `isPageVisible` (initialized to `document.visibilityState === 'visible'`).
   - Listen to the 'visibilitychange' event on the `document` and update the animation state using the combination of `isIntersecting` and `isPageVisible` (similar to `AntigravityCanvas.jsx`).
   - Properly remove the 'visibilitychange' listener in the unmount cleanup.
2. Add an early-exit check inside the loop function `drawMesh`:
   - Place a guard clause `if (!isAnimating) return;` at the very start of `drawMesh()`.
3. Run `npm run build` and `npm run lint` in the workspace to verify the code compiles and lint checks pass.
4. Save your handoff report in a report at /Users/milan/LOI-mln.github.io/.agents/worker_m1_fix/handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Provide a detailed summary of your changes and the build/lint output in your handoff report.
