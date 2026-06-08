# Handoff Report — Explorer 3 (Canvas Performance Integration)

## 1. Observation
We observed the following code components and performance integration patterns in the application:
1. **Layout Thrashing in Parallax Hook (`src/hooks/useParallax.js` lines 43-76)**:
   ```javascript
   const rect = el.getBoundingClientRect(); // Triggers reflow
   ...
   el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`; // Triggers layout invalidation
   ```
   This pattern runs on every scroll frame inside a global scroll event listener (lines 81-87), which is registered unconditionally for all mounts:
   ```javascript
   window.addEventListener('scroll', handleScroll, { passive: true });
   ```
2. **Expensive DOM Queries during Loading (`src/hooks/useScrollReveal.js` lines 27-48)**:
   The hook mounts a `MutationObserver` on `document.body`:
   ```javascript
   const mutationObserver = new MutationObserver(updateObservation);
   mutationObserver.observe(document.body, { childList: true, subtree: true });
   ```
   On every DOM change (such as progress bar width changes and loader log text changes in `src/App.jsx` lines 33-62), `updateObservation` is called, executing `document.querySelectorAll('.reveal-on-scroll, .reveal-scale')` (line 30).
3. **Rendering Invisible Canvases (`src/components/OrganicCanvas.jsx` line 162 & `src/components/AntigravityCanvas.jsx` line 264)**:
   Both canvas files call `drawMesh()` / `render()` to start their `requestAnimationFrame` loops immediately on mounting, even though the viewport is fully covered by the `loader-overlay` during the 1.8s load period.
4. **Offscreen Canvas Rendering (`src/sections/Skills.jsx` line 71 & `src/App.jsx` line 205)**:
   Two instances of `AntigravityCanvas` are rendered off-screen (in `Skills` and `About` sections) and maintain active `requestAnimationFrame` drawing loops at 60 FPS in the background.
5. **Canvas Sizing Issues on Mount (`src/components/AntigravityCanvas.jsx` lines 34-35)**:
   ```javascript
   let width = canvas.width = canvas.offsetWidth || window.innerWidth;
   let height = canvas.height = canvas.offsetHeight || window.innerHeight;
   ```
   If parent elements are not layout-complete or hidden during loader overlay rendering, `canvas.offsetWidth` and `offsetHeight` evaluate to `0` or wrong values. The canvas sizing is only refreshed on the window `resize` event.

---

## 2. Logic Chain
1. Calling `getBoundingClientRect()` followed by setting `el.style.transform` inside the same tick causes the browser to perform a synchronous reflow (Layout Thrashing). If multiple elements use `useParallax`, this causes cumulative frame drops and scroll jitter.
2. The `MutationObserver` fires on every DOM modification. Because the technical loading screen updates state/styles at 50ms intervals, the observer constantly queries the DOM. Since the DOM structure of this portfolio is static after mounting, the `MutationObserver` is completely redundant.
3. Running rendering loops (`requestAnimationFrame`) for canvases under a cover overlay or off-screen wastes CPU/GPU cycles, which translates to high initial processing overhead, scroll lag on mobile devices, and battery drain.
4. If a canvas calculates size on mount while its parent is hidden or collapsed, it gets initialized with `0` or incorrect dimensions. Because no other listener updates it (besides window resize), the drawing buffer is invalid, resulting in hidden or distorted particles when visible.
5. Cleaning up `IntersectionObserver` via `.disconnect()` on component unmount is standard. However, referencing `elementRef.current` inside the cleanup function is unsafe because React may clear the ref value to `null` before the cleanup block is executed. Capturing the DOM reference in a local variable resolves this.

---

## 3. Caveats
- We did not measure physical CPU/GPU utilization profiles or record frame trace files directly as we are limited to a read-only code analysis.
- Minor differences in layout resolution behaviors may exist depending on the browser engine (Chromium vs. WebKit/Gecko).

---

## 4. Conclusion
1. **Scroll Jitter** is caused by layout thrashing inside `useParallax.js`.
2. **Initial Loading Stutter** is caused by the redundant `MutationObserver` in `useScrollReveal.js`.
3. **Resource Waste** occurs because canvases run their animation loops when covered by the loader or scrolled off-viewport.
4. **Canvas Sizing Errors** occur because sizes are measured on mount while parent sections are not visible or fully laid out.
5. **Proper Cleanup** requires calling `disconnect()` on `IntersectionObserver` instances and using captured local variables for targets.

---

## 5. Verification Method
1. Run `npm run build` and `npm run lint` to ensure no syntax/compilation errors.
2. Open Chrome DevTools -> Performance tab, record a scroll trace, and verify that there are no "Forced Reflow" / "Layout Thrashing" warnings during scrolling.
3. Check the Console logs for canvas mount logs (`[AntigravityCanvas] SIZE INIT ...`) and verify that initial widths and heights are non-zero.
4. Verify that canvas rendering loops pause when components are off-screen (by placing a log statement in the rendering function and checking that it stops printing when off-screen).
