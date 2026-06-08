# Analysis & Strategy Report: Viewport-Based Canvas Performance Optimization for `OrganicCanvas.jsx`

## Executive Summary
This report presents a comprehensive optimization strategy for the animation loop in `/src/components/OrganicCanvas.jsx` using a combination of the **Intersection Observer API** and the **Page Visibility API**.

The current implementation of `OrganicCanvas.jsx` executes a continuous animation loop (`requestAnimationFrame`) in the background. Because it is styled with `position: fixed` to cover the entire screen, it remains physically in the viewport at all times, making a direct `IntersectionObserver` on the canvas element ineffective.

To resolve this and achieve maximum battery and CPU efficiency, we propose a **Sentinel Wrapper Strategy** with a **Unified Animation Controller**. This design pauses the animation loop and detaches heavy interactive event listeners (e.g., `mousemove`) when the canvas is either scrolled out of its visual bounds or when the browser tab becomes inactive.

---

## 1. Study of the Current Render Loop in `OrganicCanvas.jsx`

The render loop in `OrganicCanvas.jsx` is structured inside a single React `useEffect` hook with an empty dependency array (`[]`):

*   **Variables & Scope**:
    *   `animationFrameId` (line 12): Tracks the current scheduled frame.
    *   `time` (line 48): A scalar incremented by `0.003` per frame to drive wave functions.
*   **Startup**:
    *   `drawMesh()` is called once on mount (line 162).
*   **Scheduling**:
    *   `drawMesh` schedules its next execution recursively via `animationFrameId = requestAnimationFrame(drawMesh);` (line 159) at the very end of the draw phase.
*   **Cancellation**:
    *   The cleanup return function (lines 164-169) cancels the scheduled frame using `cancelAnimationFrame(animationFrameId)` and removes global window/document event listeners.

### The Problem:
Because the canvas is styled with `position: fixed`, it covers $100\%$ of the screen and stays locked in the viewport during scroll. In its current state, it draws a 28x28 grid and computes trigonometric displacement for every vertex ($28 \times 28 = 784$ points per frame) continuously, even when the user scrolls to the lower half of the page where the background is completely obscured by opaque sections (such as `#about` or the footer).

---

## 2. The Viewport Visibility Challenge
An `IntersectionObserver` measures layout intersection. Since the canvas is fixed to the screen:
1. It does not scroll with the document page flow.
2. In the layout tree, its bounding rectangle is always identical to the viewport dimensions.
3. Observing this canvas directly via `IntersectionObserver` will always return `isIntersecting: true`. The loop would never pause.

---

## 3. Recommended Detection Strategy: Sentinel Wrapper
To track visual visibility without altering visual rendering, we wrap the canvas in a scrolling sentinel element:

```html
<div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: sentinelHeight, pointerEvents: 'none', zIndex: 0 }}>
  <canvas ref={canvasRef} ... />
</div>
```

### How the Sentinel Works:
1. **Scrolling Flow**: Since the wrapper has `position: absolute`, it is positioned relative to the document flow. As the user scrolls down, this wrapper scrolls up and out of the viewport.
2. **Visual Fixedness**: The inner `<canvas>` retains `position: fixed`, so it continues to render correctly at the viewport level while the wrapper is still visible.
3. **Trigger Threshold**: When the sentinel container scrolls out of the viewport, the `IntersectionObserver` observes the intersection state change (`isIntersecting: false`) and pauses the loop.
4. **Decoupled Configuration**:
   *   We introduce `sentinelHeight` as a React prop (defaulting to `'250vh'`, which covers the Hero, Skills, and Projects sections).
   *   Alternatively, the component can automatically fall back to observing `canvasRef.current.parentElement` if no container ref is defined, giving maximum developer flexibility.

---

## 4. Proposed Loop-Toggle & Guarding Strategy
To prevent double animation loops (which cause double-speed execution and screen tearing) and memory leaks, we establish a clean state machine within `useEffect`:

### State Machine Architecture
*   `isVisible` (boolean): Tracks if the sentinel wrapper is in the viewport.
*   `isPageActive` (boolean): Tracks if the browser tab/window is active (`document.visibilityState === 'visible'`).
*   `isAnimating` (boolean): Tracks whether the animation loop is currently active.

### Control Functions
1.  **`startLoop()`**:
    *   Checks the condition: `if (!isAnimating && isVisible && isPageActive)`.
    *   If met, sets `isAnimating = true`.
    *   **Optimization**: Dynamically attaches mouse trackers (`mousemove`, `mouseleave`) and invokes `resize()` to ensure correct dimensions.
    *   Kicks off the loop: `animationFrameId = requestAnimationFrame(drawMesh)`.
2.  **`stopLoop()`**:
    *   Sets `isAnimating = false`.
    *   Cancels the current animation frame: `cancelAnimationFrame(animationFrameId)`.
    *   **Optimization**: Detaches mouse trackers to avoid executing callback logic when hidden.
3.  **`drawMesh()` Guard**:
    *   A failsafe check `if (!isAnimating) return;` at the top of `drawMesh` ensures no subsequent frame is scheduled if a stop occurred during the execution phase.

---

## 5. Proposed Code Draft

Below is the proposed implementation to replace the content of `src/components/OrganicCanvas.jsx`:

```javascript
import React, { useEffect, useRef } from 'react';

const OrganicCanvas = ({ sentinelHeight = '250vh' }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const sentinel = containerRef.current || canvas?.parentElement;
    if (!canvas || !sentinel) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let isAnimating = false;
    let isVisible = false;
    let isPageActive = true;

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

    // Keep resize listener bound at all times to ensure size is always accurate
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking event listeners (bound/unbound dynamically)
    const handleMouseMove = (e) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.tx = -1000;
      mouseRef.current.ty = -1000;
    };

    const rows = 28;
    const cols = 28;
    let time = 0;

    const drawMesh = () => {
      if (!isAnimating) return; // Fail-safe guard

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
      if (!isAnimating && isVisible && isPageActive) {
        isAnimating = true;
        
        // Ensure size is correct upon resuming (handles size changes while inactive)
        resize();

        // Bind interactive event listeners dynamically
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        // Schedule first frame
        animationFrameId = requestAnimationFrame(drawMesh);
      }
    };

    const stopLoop = () => {
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      // Unbind interactive listeners to save CPU cycles
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };

    // IntersectionObserver Setup
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { root: null, rootMargin: '0px', threshold: 0 }
      );
      observer.observe(sentinel);
    } else {
      // Fallback for non-supported environments (e.g. older browsers/test environments)
      isVisible = true;
      startLoop();
    }

    // Page Visibility API Setup
    const handleVisibilityChange = () => {
      isPageActive = document.visibilityState === 'visible';
      if (isPageActive) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopLoop();
      if (observer) {
        observer.disconnect();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resize);
    };
  }, [sentinelHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: sentinelHeight, // Flexible scrolling sentinel boundary
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

## 6. Synthesis and Comparison of Gen 1 vs. Gen 2 Proposal

| Feature | Gen 1 Implementation Plan | Gen 2 Enhanced Proposal (This Work) | Benefit / Improvements |
| :--- | :--- | :--- | :--- |
| **Sentinel Strategy** | Hardcoded internal sentinel wrapper only. | Hybrid sentinel: internal wrapper + fallback parent element detection (`canvas.parentElement`). | Prevents breakage if component layout hierarchy changes; simplifies customization. |
| **Tab/Page Visibility** | Not considered. | Complete integration with `document.visibilityState` (Page Visibility API). | Pauses execution when browser tab is inactive, saving power on background tabs. |
| **Interactive Event Listeners** | Kept active at all times. | Dynamically attached/detached during `startLoop`/`stopLoop` phase. | Reduces CPU overhead on mouse tracking events when canvas is hidden or inactive. |
| **Stale Resize Handling** | Standard setup. | Re-executes `resize()` immediately inside `startLoop()` prior to animation restart. | Prevents drawing stretching or layout shifts if window dimensions change while hidden. |

---

## 7. Verification Method

To independently verify the implementation after integration:
1.  **Visual Verification**:
    *   Scroll past the sentinel boundary (e.g. 250vh). Inspect the canvas DOM element; it should remain correctly positioned in the DOM, but not animate.
    *   Scroll back to the top; the mesh motion should resume smoothly without jumps.
2.  **Performance Verification**:
    *   Open Chrome DevTools -> **Performance Monitor**.
    *   Observe the **CPU usage** and **JS Heap** at the top of the page.
    *   Scroll down past the sentinel boundary. Confirm CPU usage drops.
    *   Open Chrome DevTools -> **Rendering** tab. Enable **Frame Rendering Stats**. Observe that the frame rates drops or requestAnimationFrame stops logging when scrolled down.
3.  **Active Tab Verification**:
    *   Switch to a different browser tab and switch back. Check logs or verify that animation was paused using Performance Monitor tracing.
