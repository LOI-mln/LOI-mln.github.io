# Handoff Report: Viewport-Based Canvas Performance Optimization for `OrganicCanvas.jsx`

## 1. Observation
- **File Checked**: `src/components/OrganicCanvas.jsx` (Lines 1 to 189).
  - The render loop is scheduled via `animationFrameId = requestAnimationFrame(drawMesh);` at line 159.
  - The loop is initiated by calling `drawMesh();` at line 162.
  - The cleanup is performed at lines 164-169:
    ```javascript
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
    ```
  - The style of the returned `canvas` element at lines 175-183 uses `position: 'fixed'`, `top: 0`, `left: 0`, `width: '100%'`, `height: '100%'`, `zIndex: 0`, and `pointerEvents: 'none'`.
- **File Checked**: `src/App.jsx` (Lines 173-174).
  - The canvas component is rendered directly inside `.app-container`:
    ```javascript
    {/* Canvas de fond organique */}
    <OrganicCanvas />
    ```
- **File Checked**: `src/index.css` (Lines 92-98).
  - `.app-container` has the styles:
    ```css
    position: relative;
    min-height: 100vh;
    z-index: 1;
    display: flex;
    flex-direction: column;
    ```
- **File Checked**: `src/components/AntigravityCanvas.jsx` (Lines 277-291).
  - The canvas element returned has `position: 'absolute'`, `inset: 0`, allowing it to naturally scroll with its relative parent `#about` section.

---

## 2. Logic Chain
1. **Fact**: `OrganicCanvas` rendering uses a recursive `requestAnimationFrame` loop that runs non-stop once initialized (Observation: lines 159, 162).
2. **Fact**: The `OrganicCanvas` element has `position: 'fixed'` and covers 100% of the viewport (Observation: lines 175-183).
3. **Reasoning**: An element styled with `position: 'fixed'` sits relative to the viewport window. It does not scroll with the document page flow.
4. **Reasoning**: If a standard `IntersectionObserver` is registered on a `position: 'fixed'` canvas, its bounding rect will always be within the viewport bounds. Consequently, the observer will always report `isIntersecting: true`.
5. **Reasoning**: The page has multiple sections (such as Project and About), and when scrolling down, the organic canvas is covered by solid background sections (e.g. `backgroundColor: 'var(--bg-primary)'` on the `#about` section).
6. **Solution**: If we wrap the `canvas` in an absolute-positioned wrapper element (`position: 'absolute'`, `top: 0`, `left: 0`, `width: '100%'`, `height: '250vh'`), this wrapper will be positioned relative to the `.app-container` and scroll up and out of the viewport.
7. **Conclusion**: Observing this wrapper sentinel instead of the canvas element allows the `IntersectionObserver` to trigger a transition to `isIntersecting = false` when the user scrolls past the top sections of the website.
8. **Loop Control**: To toggle the loop safely, we need a local boolean flag `isAnimating` in the `useEffect` closure scope. The `drawMesh` function should exit early if `!isAnimating`, and starting the loop should be guarded with `if (!isAnimating)` to prevent duplicate execution paths and multiple scheduled requestAnimationFrame threads.

---

## 3. Caveats
- **Sentinel Height**: The height of `250vh` is chosen because it encompasses the visible portion of the background canvas (Hero, Skills, and Projects sections). If the page sections change in height significantly, the sentinel height may need adjustment. It can be exposed as a prop on `OrganicCanvas` (e.g. `activeHeight="250vh"`) to make it easily configurable.
- **Scroll Speed**: Extremely rapid scrolling may cause a brief lag of a frame or two before the observer registers the exit and stops the loop, which is normal and acceptable behavior.

---

## 4. Conclusion
We have formulated a clean, reliable, and leak-proof strategy to pause and resume the `OrganicCanvas` animation loop using a **Sentinel Wrapper Strategy**. This prevents CPU and GPU cycles from being wasted when the background grid is scrolled out of view or covered.

The strategy requires:
1. Creating a `containerRef` pointing to an absolute-positioned sentinel wrapper `div` (`250vh` high).
2. Observing the sentinel wrapper using `IntersectionObserver`.
3. Adding state-guarded helper functions `startLoop()` and `stopLoop()` that toggle a local `isAnimating` flag to control `requestAnimationFrame` scheduling and execution.
4. Clean teardown of the observer and animation frames in the `useEffect` cleanup hook.

---

## 5. Verification Method
To verify the implementation once applied:
1. **Interactive Inspection**:
   - In `OrganicCanvas.jsx`, add a temporary console log inside the observer callback:
     ```javascript
     console.log(`[OrganicCanvas] intersecting: ${entry.isIntersecting}`);
     ```
   - Run the application development server (`npm run dev` or equivalent).
   - Load the homepage, scroll down below the Projects section (past the hero/skills zone).
   - Verify that the console logs `[OrganicCanvas] intersecting: false` and the rendering stops.
   - Scroll back up to the top and verify that the console logs `[OrganicCanvas] intersecting: true` and the grid mesh animates smoothly.
2. **Preventing Duplicate Loops**:
   - Add a debug log at the start of `drawMesh()` (e.g. `console.log("Draw frame")`).
   - Scroll up and down repeatedly.
   - Verify that there is never more than one frame log per refresh cycle (avoiding double execution paths).
3. **No Project Memory Leaks**:
   - Verify that when the component is unmounted or reloaded, the observer is successfully disconnected using `observer.disconnect()`.
