# Handoff Report — Milestone 1: Canvas Performance Optimization

## 1. Observation
I investigated the canvas components inside the React project to optimize their rendering loops when they are off-screen or the browser tab is hidden.

The targeted components and files are:
* **Antigravity Canvas**: `/Users/milan/LOI-mln.github.io/src/components/AntigravityCanvas.jsx`
* **Organic Canvas**: `/Users/milan/LOI-mln.github.io/src/components/OrganicCanvas.jsx`

During analysis of `AntigravityCanvas.jsx`, I observed that:
* The canvas was rendering continuously inside `useEffect` using `requestAnimationFrame(render)` regardless of its viewport visibility.
* Sizing was initially done on component mount using `resize();` which could calculate dimensions as 0px if the DOM layout was not fully resolved.

During analysis of `OrganicCanvas.jsx`, I observed that:
* The canvas was set to `position: 'fixed'` and rendered an organic mesh grid continuously using `requestAnimationFrame(drawMesh)`.
* It spanned the background of the main page, meaning we wanted to observe its container (extending to 250vh representing the main scrollable area) rather than the fixed canvas itself.

When attempting to run build/lint verification commands:
* `npm run build` and `npm run lint` timed out due to the environment waiting for user approval.
* I verified ESLint and code structure compliance manually (such as checking hook dependency arrays, scopes, and cleanups).

## 2. Logic Chain
1. To prevent off-screen CPU/GPU usage, the canvas animation loop needs to pause when the element leaves the viewport.
2. I implemented `IntersectionObserver` with a `threshold: 0` targeting the canvas in `AntigravityCanvas.jsx` and the 250vh sentinel div in `OrganicCanvas.jsx`.
3. To handle page visibility changes (e.g., switching tabs or minimizing the browser), I added a listener on `document` for `visibilitychange` to set `isPageVisible` and toggle the render loop.
4. To prevent canvas dimension bugs (like 0px width/height when entering the DOM or loading backgrounded), `resize()` is called within the IntersectionObserver callback specifically when the element intersects (`isIntersecting === true`).
5. To avoid duplicate render loops from rapid events or React re-renders, I added execution exit checks (`if (!isAnimating) return`) and double-request guards (clearing `animationFrameId` before scheduling another frame) on both components.
6. To prevent memory leaks, all observers are disconnected, listeners are removed, and pending animation frames are cancelled on component unmount inside the `useEffect` cleanup return.

## 3. Caveats
* The terminal commands (`npm run build` and `npm run lint`) timed out because they require user permission, which was not granted. The changes are verified manually for ESM import, React hook rules, and syntactic correctness.

## 4. Conclusion
The canvas components have been successfully optimized to implement viewport-based rendering:
1. `AntigravityCanvas.jsx` pauses animation when scrolled out or when the tab is hidden, and triggers dimensions recalculation on entry.
2. `OrganicCanvas.jsx` is wrapped in a 250vh absolute sentinel `div` observed by the `IntersectionObserver`, and implements double-request guarding and execution exit checks.
3. Component unmounting cleanups are robustly set up for both files.

## 5. Verification Method
To verify the implementation:
1. Run `npm run build` at the root `/Users/milan/LOI-mln.github.io` to ensure it compiles without issues.
2. Run `npm run lint` at the root `/Users/milan/LOI-mln.github.io` to ensure there are no ESLint style or syntax issues.
3. Launch the application (`npm run dev`) and inspect console logs:
   * Verify scrolling the page or switching tabs prints the log messages:
     * `[AntigravityCanvas] PAUSING RENDER LOOP` or `[OrganicCanvas] PAUSING RENDER LOOP` when out of view/hidden.
     * `[AntigravityCanvas] STARTING/RESUMING RENDER LOOP` or `[OrganicCanvas] STARTING/RESUMING RENDER LOOP` when entering view/visible.
     * `[AntigravityCanvas] Visible - Recalculating dimensions` on intersection.
