## 2026-06-06T17:37:47Z
You are the Worker for Milestone 1: Canvas Performance Optimization.
Your task is to modify the canvas components in the React application to implement viewport-based rendering using the Intersection Observer API.
Your working directory is /Users/milan/LOI-mln.github.io/.agents/worker_m1/.
Target files:
- /Users/milan/LOI-mln.github.io/src/components/AntigravityCanvas.jsx
- /Users/milan/LOI-mln.github.io/src/components/OrganicCanvas.jsx

Specifically:
1. Modify /Users/milan/LOI-mln.github.io/src/components/AntigravityCanvas.jsx:
   - Wrap the animation render loop with an IntersectionObserver (threshold: 0).
   - Pause the requestAnimationFrame loop when the canvas is scrolled out of the viewport.
   - Resume the loop when the canvas enters the viewport.
   - Recalculate dimensions (call resize()) inside the IntersectionObserver callback when it becomes visible to prevent 0px canvas sizing issues.
   - Add a listener to 'visibilitychange' to pause the render loop when the page is hidden, and resume it if it is visible.
   - Properly disconnect the observer and cancel the animation frame request on component unmount.
2. Modify /Users/milan/LOI-mln.github.io/src/components/OrganicCanvas.jsx:
   - Wrap the canvas in an absolute-positioned sentinel <div> element with a height of 250vh (matching scrollable area where the organic background should render).
   - Observe this sentinel <div> container using IntersectionObserver instead of the canvas itself.
   - Implement double-request guarding and execution exit checks to prevent multiple loops.
   - Properly disconnect the observer and cancel the animation frame request on component unmount.
3. Run `npm run build` and `npm run lint` in the workspace to verify the code compiles and lint checks pass.
4. Save your handoff report in a report at /Users/milan/LOI-mln.github.io/.agents/worker_m1/handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Provide a detailed summary of your changes and the build/lint output in your handoff report.
