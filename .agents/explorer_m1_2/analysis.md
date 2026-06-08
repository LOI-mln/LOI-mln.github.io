# Analysis Report: Viewport-Based Canvas Performance Optimization for `OrganicCanvas.jsx`

## Executive Summary
This report analyzes `/src/components/OrganicCanvas.jsx` to optimize its animation loop using the Intersection Observer API. The current render loop runs continuously in the background, consuming CPU, GPU, and battery resources even when the canvas is scrolled off-screen or covered by solid elements. 

Due to the canvas's `position: 'fixed'` CSS styling, it remains statically positioned relative to the viewport. A standard Intersection Observer targeting the canvas element directly would always report it as intersecting (100% visible), rendering the optimization ineffective. To overcome this, we propose a **Sentinel Wrapper Strategy** where the canvas is wrapped in an absolute-positioned scrollable element that naturally exits the viewport as the user scrolls down. By observing this sentinel, we can reliably pause and resume the loop, eliminating resource waste.

---

## 1. Study of the Current Render Loop
In the current implementation of `OrganicCanvas.jsx`, the render loop is structured as follows:

*   **Initialization and Setup**: 
    The rendering process is encapsulated inside a React `useEffect` hook with an empty dependency array (`[]`), running once when the component mounts.
*   **Loop Scheduling and Progression**:
    *   A local variable `animationFrameId` tracks the requested animation frames.
    *   The `drawMesh` function performs clean-up (`ctx.clearRect`), calculates grid point offsets based on a running `time` increment (which increases by `0.003` per frame), applies mouse distortion physics, draws grid lines/accent points, and then schedules the next frame:
        ```javascript
        animationFrameId = requestAnimationFrame(drawMesh);
        ```
*   **Startup**:
    The loop is kicked off by an immediate invocation of `drawMesh();` at the bottom of the `useEffect` scope.
*   **Cancellation/Teardown**:
    A cleanup function is returned by the hook to prevent memory leaks and stop the loop when the component unmounts:
    ```javascript
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
    ```

### Major Performance Concern:
Once started, the loop runs indefinitely at the browser's refresh rate (typically 60Hz - 120Hz). Even when the user scrolls to sections with solid backgrounds (such as `#about` or the footer) that completely obscure the canvas, the browser continues recalculating and redrawing the 28x28 grid and the glowing mouse indicators.

---

## 2. The Viewport Visibility Challenge
Normally, `IntersectionObserver` detects when a target element enters or leaves the browser viewport. However, the canvas in `OrganicCanvas.jsx` uses the following styling (lines 175-183):

```javascript
style={{
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none',
}}
```

Because the canvas is fixed to the screen:
1. It does not scroll with the document page flow.
2. In the layout tree, its bounding rect is always identical to the viewport dimensions.
3. Observing this canvas directly via `IntersectionObserver` will always return `isIntersecting: true`, meaning the loop will **never** pause, regardless of where the user scrolls.

---

## 3. The Sentinel Wrapper Strategy
To resolve the fixed-position visibility issue, we propose wrapping the canvas inside an absolute-positioned container that acts as a scrolling visibility sentinel:

```html
<div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '250vh', pointerEvents: 'none', zIndex: 0 }}>
  <canvas ref={canvasRef} ... />
</div>
```

### Mechanism:
1. **Layout Behavior**: 
   The sentinel wrapper `div` has `position: 'absolute'`. Because its parent (defined in `index.css` as `.app-container`) has `position: 'relative'`, the sentinel starts at the top of the webpage and spans downward for `250vh`.
2. **Scroll Interaction**:
   As the user scrolls down, this sentinel `div` moves upward and eventually exits the top of the viewport.
3. **Observation**:
   The `IntersectionObserver` observes the sentinel `containerRef`. When the container scrolls out of the viewport, the observer triggers a callback with `isIntersecting = false`.
4. **Active Range**:
   A height of `250vh` covers the top of the page (Hero, Skills, and Projects sections), where the `OrganicCanvas` background is visible. Once the user scrolls below this range (to sections like About/AntigravityCanvas and the Timeline), the sentinel leaves the viewport, and the loop is safely paused.

---

## 4. Proposed Loop-Toggle Strategy
To prevent memory leaks, duplicate rendering loops, and race conditions, we must structure the toggle logic carefully:

1. **State Flags**:
   A local boolean `isAnimating` inside `useEffect` tracks the active state of the animation loop.
2. **Double-Request Guarding**:
   The `startLoop` function checks `!isAnimating`. If true, it updates `isAnimating = true` and kicks off `requestAnimationFrame(drawMesh)`. This prevents launching multiple concurrent loops.
3. **Execution Guarding**:
   Inside `drawMesh`, the very first check is `if (!isAnimating) return;`. If the loop has been paused, this guard stops any calculations, rendering, or subsequent `requestAnimationFrame` scheduling.
4. **Clean Cancel**:
   `stopLoop` sets `isAnimating = false` and cancels the current `animationFrameId`, immediately relinquishing resources.
5. **Browser Compatibility Fallback**:
   If `IntersectionObserver` is not supported (e.g. in legacy headless test runners), we fall back to starting the loop unconditionally.

### Proposed Code Integration for `OrganicCanvas.jsx`
Here is the concrete code structure for the implementation:

```javascript
import React, { useEffect, useRef } from 'react';

const OrganicCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let isAnimating = false; // Internal execution flag
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let devicePixelRatio = window.devicePixelRatio || 1;

    // Adapt resolution for Retina displays
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking event listeners
    const handleMouseMove = (e) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.tx = -1000;
      mouseRef.current.ty = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const rows = 28;
    const cols = 28;
    let time = 0;

    const drawMesh = () => {
      if (!isAnimating) return; // Exit guard

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      if (mouse.tx === -1000) {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      } else {
        if (mouse.x === -1000) {
          mouse.x = mouse.tx;
          mouse.y = mouse.ty;
        } else {
          mouse.x += (mouse.tx - mouse.x) * 0.1;
          mouse.y += (mouse.ty - mouse.y) * 0.1;
        }
      }

      time += 0.003;
      const grid = [];

      for (let r = 0; r <= rows; r++) {
        grid[r] = [];
        for (let c = 0; c <= cols; c++) {
          const baseX = (width / cols) * c;
          const baseY = (height / rows) * r;

          const waveX =
            Math.sin(c * 0.15 + time * 2) * 20 +
            Math.cos(r * 0.1 + time * 1.5) * 15;
          const waveY =
            Math.cos(c * 0.1 + time * 2.5) * 25 +
            Math.sin(r * 0.15 + time * 1) * 15;

          let posX = baseX + waveX;
          let posY = baseY + waveY;

          if (mouse.x !== -1000) {
            const dx = posX - mouse.x;
            const dy = posY - mouse.y;
            const dist = Math.hypot(dx, dy);
            const maxDist = 280;

            if (dist < maxDist) {
              const force = (1 - dist / maxDist) ** 2;
              const angle = Math.atan2(dy, dx);
              const push = force * 60;
              posX += Math.cos(angle) * push;
              posY += Math.sin(angle) * push;
            }
          }

          grid[r][c] = { x: posX, y: posY };
        }
      }

      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(17, 24, 39, 0.035)';

      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const pt = grid[r][c];
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const pt = grid[r][c];
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      if (mouse.x !== -1000) {
        ctx.fillStyle = '#e35d3b';
        for (let r = 0; r <= rows; r += 2) {
          for (let c = 0; c <= cols; c += 2) {
            const pt = grid[r][c];
            const dist = Math.hypot(pt.x - mouse.x, pt.y - mouse.y);
            if (dist < 150) {
              const opacity = (1 - dist / 150) * 0.6;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2 + opacity * 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(227, 93, 59, ${opacity})`;
              ctx.fill();
            }
          }
        }
      }

      if (isAnimating) {
        animationFrameId = requestAnimationFrame(drawMesh);
      }
    };

    const startLoop = () => {
      if (!isAnimating) {
        isAnimating = true;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(drawMesh);
      }
    };

    const stopLoop = () => {
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // IntersectionObserver implementation
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { root: null, rootMargin: '0px', threshold: 0 }
      );
      observer.observe(container);
    } else {
      // Fallback for environments lacking IntersectionObserver
      startLoop();
    }

    return () => {
      stopLoop();
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '250vh', // Scrolling sentinel boundary
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default OrganicCanvas;
```

---

## 5. Handoff Implementation Plan
For the implementer executing the code changes, follow these steps:
1. Update `src/components/OrganicCanvas.jsx` to introduce `containerRef` using `useRef(null)`.
2. Wrap the canvas return structure inside a `div` element configured with absolute positioning and a sentinel height (`250vh`). Set `ref={containerRef}` on this wrapper.
3. In `useEffect`, retrieve the container element and check for its presence alongside `canvas`.
4. Replace the initial `drawMesh()` invocation with the `IntersectionObserver` setup. Define helper functions `startLoop` and `stopLoop` with guard assertions.
5. In the `useEffect` cleanup return function, invoke `stopLoop()` and disconnect the observer.
6. Verify the implementation by scrolling the page and confirming CPU usage drops (or checking frame rates/console statements) when past the 250vh threshold.
