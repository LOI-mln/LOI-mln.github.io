# Handoff Report: Canvas Performance Optimization (Milestone 1)

## 1. Observation

Direct observations from the project codebase:

1. **`src/hooks/useScrollReveal.js` (lines 42-43)**:
   ```javascript
   const mutationObserver = new MutationObserver(updateObservation);
   mutationObserver.observe(document.body, { childList: true, subtree: true });
   ```
   The `updateObservation` callback calls `document.querySelectorAll('.reveal-on-scroll, .reveal-scale')` on every trigger.

2. **`src/App.jsx` (lines 35-42)**:
   An interval updates the `progress` state:
   ```javascript
   const interval = setInterval(() => {
     start += Math.floor(Math.random() * 8) + 4;
     ...
     setProgress(start);
   }, 50);
   ```
   This updates the loading percentage text content in the DOM every 50ms (20 times per second).

3. **`src/hooks/useParallax.js` (lines 22-23)**:
   ```javascript
   el.style.willChange = 'transform';
   el.style.transition = 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)'; // Transition fluide
   ```
   And `updateParallax` updates `el.style.transform` directly on scroll via `requestAnimationFrame`.

4. **`src/App.jsx` (lines 174 & 205)**:
   ```javascript
   <OrganicCanvas />
   ```
   and inside the `<section id="about">`:
   ```javascript
   <AntigravityCanvas
     mode="light"
     colorScheme="amber"
     density="low"
     clusterRight={false}
     velocityStretch={false}
   />
   ```
   Both canvas components are mounted at the initial render, even while the full-screen loader (`loading = true`) is displayed.

5. **`src/sections/Skills.jsx` (lines 6-16)**:
   ```javascript
   const SkillsMesh = () => {
     return (
       <AntigravityCanvas
         mode="light"
         colorScheme="amber"
         ...
       />
     );
   };
   ```
   This second instance of `AntigravityCanvas` is mounted immediately on the page within the `Skills` section.

6. **`src/components/AntigravityCanvas.jsx` (lines 215-265)**:
   The requestAnimationFrame render loop starts immediately upon mount, clearing the canvas context and iterating over particles and connections:
   ```javascript
   const render = () => {
     if (!isAnimating) return;
     ...
     ctx.clearRect(0, 0, width, height);
     ...
     animationFrameId = requestAnimationFrame(render);
   };
   render();
   ```

---

## 2. Logic Chain

1. **MutationObserver CPU Overhead**:
   * The `progress` state changes every 50ms during the loading phase (Observation 2).
   * Because the progress state renders updates into the DOM, it triggers child and subtree mutations.
   * The `MutationObserver` on `document.body` catches these mutations because it is configured with `subtree: true` (Observation 1).
   * Consequently, `updateObservation()` runs 20 times per second, executing a global `document.querySelectorAll` search and re-binding elements to the `IntersectionObserver`.
   * This results in high CPU utilization and layout thrashing before the user has even finished loading the page.

2. **Continuous Render Loops**:
   * `OrganicCanvas` and `AntigravityCanvas` start their requestAnimationFrame loops immediately on mount (Observations 4, 5, 6).
   * During the first 2.6 seconds, the full-screen loading overlay obscures everything. However, the canvases are active and drawing beneath the overlay (Observation 4).
   * Since `AntigravityCanvas` is inside sections positioned below the fold (`Skills` and `about`), they are off-screen. Despite being off-screen, their rendering loops compute particle trajectories and constellation line connections at 60 FPS (Observation 6).
   * This creates unnecessary GPU/CPU cycles, causing performance degradation, especially on mobile devices.

3. **Scroll Jitter**:
   * The `useParallax` hook binds to the `scroll` event and calls `requestAnimationFrame` to update `transform` (Observation 3).
   * A CSS transition of `0.1s` is applied to `transform` on the same element (Observation 3).
   * When scrolling, the browser attempts to smooth out the Javascript-directed coordinate updates using the CSS transition engine.
   * This causes a lag between the viewport scroll position and the element's position, resulting in visible scroll jitter.

---

## 3. Caveats

* **Lenis Interactions**: We assumed that the smooth scrolling library Lenis is working normally. We also observed a `MutationObserver` inside the Lenis setup in `App.jsx` that calls `lenis.resize()` on every subtree mutation. If the DOM mutation rate is high, this could compound layout recalculation overheads.
* **Network Constraints**: We operate in CODE_ONLY mode, so we didn't search external documentation on IntersectionObserver or Lenis, but local inspection is sufficient.
* **Run Command Timeout**: A dry-run build command was proposed but timed out waiting for authorization. The logic remains sound as no source code modifications were made.

---

## 4. Conclusion

The application's canvas integration and scroll effects suffer from significant optimization gaps. To resolve these:
1. **Remove MutationObserver**: In `useScrollReveal.js`, replace the unthrottled `MutationObserver` on the body with a simple one-off timeout scanning the DOM after loading finishes.
2. **Implement IntersectionObserver inside Canvases**: Observe each canvas element using an `IntersectionObserver` and pause/resume their requestAnimationFrame loops based on visibility.
3. **Delay Canvas Mounting**: Render canvases only after the loading overlay is fully removed (`!loading && <OrganicCanvas />`).
4. **Remove CSS transitions on Parallax**: Remove the CSS `transition` style on `transform` in `useParallax.js` to eliminate scroll jitter.
5. **Optimize Lenis resize MutationObserver**: Check if document height has actually changed before invoking `lenis.resize()`.

---

## 5. Verification Method

1. **Inspect Files**:
   Verify the locations and line numbers in:
   * `/Users/milan/LOI-mln.github.io/src/hooks/useScrollReveal.js`
   * `/Users/milan/LOI-mln.github.io/src/hooks/useParallax.js`
   * `/Users/milan/LOI-mln.github.io/src/components/AntigravityCanvas.jsx`
   * `/Users/milan/LOI-mln.github.io/src/App.jsx`
2. **Build Verification**:
   Execute the build locally using:
   ```bash
   npm run build
   ```
3. **Verification of fixes**:
   After proposed optimizations are applied by an Implementer, verify that the console logs for `[AntigravityCanvas] IN VIEW` and `[AntigravityCanvas] OUT OF VIEW` are printed when scrolling past the Skills and About sections, confirming the pausing of off-screen loops.
