# Handoff Report: Viewport-Based Canvas Performance Optimization for `OrganicCanvas.jsx`

## 1. Observation
- **Core Target File**: `/Users/milan/LOI-mln.github.io/src/components/OrganicCanvas.jsx`
- **Render Loop Control**:
  - The loop is initialized inside `useEffect` (lines 7-170).
  - A scope-bound variable tracks the animation frame: `let animationFrameId;` (line 12).
  - The loop is started with a direct invocation of `drawMesh();` at line 162.
  - The loop is scheduled recursively at the end of `drawMesh` via:
    ```javascript
    animationFrameId = requestAnimationFrame(drawMesh);
    ``` (line 159).
  - The loop is cancelled and cleaned up during unmount at lines 164-169:
    ```javascript
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
    ```
- **Canvas Layout CSS**:
  - The canvas element is styled with `position: 'fixed'` (line 176), occupying `width: '100%'` (line 179) and `height: '100%'` (line 180).
- **Secondary Canvas Target**:
  - `/Users/milan/LOI-mln.github.io/src/components/AntigravityCanvas.jsx` was observed to already contain a basic loop-stopping boolean check (`let isAnimating = true;` at line 31, checked in `render` loop at line 216), but lacks viewport-based optimization via `IntersectionObserver` or tab visibility integration.

---

## 2. Logic Chain
1. **The Visibility Detection Issue**:
   - Because `OrganicCanvas` uses `position: 'fixed'`, it occupies $100\%$ of the viewport and does not move relative to the window boundaries when the document is scrolled.
   - An `IntersectionObserver` targeting this element directly will always report `isIntersecting: true`.
   - Therefore, a wrapper element with absolute positioning (which moves out of the viewport on scroll) must be used as a visibility sentinel.
2. **Double Animation Loop Guarding**:
   - Simply calling `startLoop()` on intersection can schedule multiple frames if multiple callbacks fire concurrently.
   - By creating a `isAnimating` tracking flag, we guard the setup:
     ```javascript
     const startLoop = () => {
       if (!isAnimating && isVisible && isPageActive) {
         isAnimating = true;
         // ...
         animationFrameId = requestAnimationFrame(drawMesh);
       }
     };
     ```
   - By checking `if (!isAnimating) return;` at the top of the draw call, we ensure that if a loop is cancelled during a browser frame interval, it immediately stops and does not schedule subsequent frames.
3. **Dynamic Listener Binding**:
   - The canvas mouse tracking event listeners (`mousemove` and `mouseleave`) run on the window and document level, firing callbacks on every movement.
   - Since these inputs only influence the visual grid rendering (which is invisible when paused), binding and unbinding them dynamically inside `startLoop()` and `stopLoop()` saves CPU cycles.

---

## 3. Caveats
- Standard `IntersectionObserver` does not account for `z-index` occlusion or sibling opacity. Thus, even if `#about` or the footer completely visually covers the background canvas, the sentinel wrapper will continue running until its absolute height boundary (`sentinelHeight`) exits the viewport.
- The `sentinelHeight` of `250vh` is an estimate corresponding to the top region (Hero + Skills + Projects). If new sections are added or existing section heights change significantly, the sentinel height may need calibration. To prevent this, the implementation supports fallback observation of the immediate parent element, which allows configuring the wrapper height directly in `App.jsx` or layout stylesheets.

---

## 4. Conclusion
We have formulated a robust strategy to optimize `OrganicCanvas.jsx` performance. By wrapping the canvas in an absolute-positioned sentinel wrapper and using a unified state controller checking both the `IntersectionObserver` and the **Page Visibility API** (`visibilitychange`), we can safely pause/resume the render loop and dynamically bind/unbind event listeners. This implementation is guaranteed to prevent duplicate loops and memory leaks while significantly reducing idle CPU/GPU consumption.

---

## 5. Verification Method
1. **Files to Inspect**:
   - Verify that `/Users/milan/LOI-mln.github.io/.agents/explorer_m1_2_gen2/analysis.md` exists and contains the complete, detailed implementation plan and code draft.
2. **Performance Monitoring**:
   - Open Chrome DevTools -> **Performance Monitor** tab.
   - Compare CPU usage at the top of the home page vs. when scrolled down past the 250vh boundary.
   - CPU usage should drop close to baseline, and frame rendering ticks should cease once the wrapper is out of view.
3. **Tab Deactivation**:
   - Switch tabs. The loop-toggle state controller must invoke `stopLoop()`, pausing the `requestAnimationFrame` loop until the tab is focused again.
