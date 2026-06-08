# Handoff Report: Canvas Performance Optimization (Intersection Observer Strategy)

## 1. Observation
- **Target File**: `/Users/milan/LOI-mln.github.io/src/components/AntigravityCanvas.jsx`
- **Render loop scheduling**:
  Lines 215-260 declare the `render` function:
  ```javascript
  const render = () => {
    if (!isAnimating) return;
    // ...
    animationFrameId = requestAnimationFrame(render);
  };
  ```
- **Loop initiation on mount**:
  Line 264 calls the loop immediately:
  ```javascript
  console.log('[AntigravityCanvas] STARTING RENDER LOOP');
  render();
  ```
- **Tear-down on unmount / prop updates**:
  Lines 267-274 handle the cleanup:
  ```javascript
  return () => {
    console.log(`[AntigravityCanvas] UNMOUNTED - Mode: ${mode}`);
    isAnimating = false;
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
    cancelAnimationFrame(animationFrameId);
  };
  ```

## 2. Logic Chain
1. *Observation 1*: The `render` loop invokes itself via `requestAnimationFrame(render)` continuously as long as `isAnimating` remains `true`.
2. *Observation 2*: The component immediately starts this loop on mounting, regardless of whether the element is visible on the screen.
3. *Observation 3*: There is currently no check or listener in place for viewport visibility (no Intersection Observer or Page Visibility API).
4. *Deduction 1*: Running the loop off-screen causes unnecessary CPU and GPU usage.
5. *Deduction 2*: We can wrap the activation and suspension of the loop in an `IntersectionObserver` callback.
6. *Deduction 3*: By setting `isAnimating = false` initially and only invoking `requestAnimationFrame` when the canvas is intersecting, we avoid running the loop off-screen.
7. *Deduction 4*: To prevent duplicate `requestAnimationFrame` calls, we must guard the transition: we only start a loop if `!isAnimating` when entering, and we call `cancelAnimationFrame(animationFrameId)` and set `isAnimating = false` when exiting.
8. *Deduction 5*: Disconnecting the observer during the `useEffect` cleanup hook prevents memory leaks.

## 3. Caveats
- Browser support: `IntersectionObserver` is supported in all modern browsers. A fallback path has been added for legacy environments.
- Layout shifting: If the page layout shifts rapidly or canvas visibility changes repeatedly, the observer callback might fire frequently. Guarding the state transitions via `isAnimating` ensures no redundant animation loops are spawned.
- Resize behavior: Resize events are still listened to when the canvas is off-screen. This is left intact because if a resize occurs off-screen, the canvas drawing buffer and particles need to be properly calculated before the canvas becomes visible again to prevent flashing or scaling distortion.

## 4. Conclusion
The current `AntigravityCanvas` component executes its canvas rendering loop continuously, even when off-screen. Incorporating an `IntersectionObserver` to track viewport visibility is an optimal solution. The proposed strategy successfully:
- Automatically pauses calculations/drawing when the canvas is out of the viewport.
- Resumes the loop safely when scrolled back in.
- Guards against duplicate `requestAnimationFrame` executions.
- Disconnects the observer properly to prevent memory leaks.

Detailed proposed code modifications are saved in the analysis report at `/Users/milan/LOI-mln.github.io/.agents/explorer_m1_1/analysis.md`.

## 5. Verification Method
- **Inspection**: Confirm that `/Users/milan/LOI-mln.github.io/.agents/explorer_m1_1/analysis.md` has been successfully created.
- **Implementation Verification**:
  1. Once the changes are applied by the implementer, load the page.
  2. Open the browser devtools console.
  3. Scroll the canvas out of view and verify that `[AntigravityCanvas] OFF-SCREEN - PAUSING RENDER LOOP` is logged.
  4. Scroll the canvas back into view and verify that `[AntigravityCanvas] VISIBLE - STARTING/RESUMING RENDER LOOP` is logged.
  5. Check that CPU thread utilization decreases when the canvas is off-screen.
