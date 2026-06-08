# Canvas & IntersectionObserver Integration Performance Analysis

## Executive Summary
This report analyzes the global performance integration of both canvases (`OrganicCanvas` and `AntigravityCanvas`) in the React application, as well as the behavior of the `IntersectionObserver` setups in the `useParallax` and `useScrollReveal` hooks. 
Key findings show **significant layout thrashing and scroll jitter** during scroll events due to synchronous DOM reading (`getBoundingClientRect()`), **high CPU/GPU overhead** from canvas rendering loops running while obscured by the loading overlay or scrolled off-viewport, and a **highly redundant MutationObserver** that repeatedly queries the entire DOM during progress bar loading updates.

---

## 1. Race Conditions, Memory Leaks, and Scroll Jitter Analysis

### 1.1 `useParallax.js`
#### Observations:
* **Layout Thrashing and Jitter**: Inside the `updateParallax` function, it reads `getBoundingClientRect()` on every scroll frame (via RAF). This layout-triggering read operation is immediately followed by a write operation (`el.style.transform = ...`). If multiple elements utilize `useParallax` (e.g. `TiltMockup`), this creates a **Read-Write-Read-Write** loop that forces the browser to recalculate layouts repeatedly in the same frame, causing scroll jitter and drop in frame rates.
* **Redundant Scroll Event Handlers**: The global scroll handler is registered immediately upon component mounting, regardless of whether the element is visible. While `handleScroll` checks `isVisible` (which is modified by the `IntersectionObserver`), the callback function still executes on every scroll event for every instance, adding unnecessary overhead.
* **Desynchronization with Lenis**: The hook registers a listener to the window's native `'scroll'` event. Because the app utilizes the **Lenis** smooth scrolling library, native scroll events can fire out of sync with the custom animation frame loop managed by Lenis, causing minor positional stutter (jitter).

#### Recommendations:
1. **Remove `getBoundingClientRect()` from Scroll Loop**: Pre-calculate the element's static top layout offset relative to the document (`staticTop = rect.top + window.scrollY`) and the element's height (`elementHeight = rect.height`) once when it becomes visible (enters the viewport) and during window resize. On scroll, calculate the parallax shift using `window.scrollY` (or Lenis's scroll position) against the cached offsets, requiring **zero** layout-triggering DOM reads.
2. **Dynamic Scroll Listening**: Only register the window/Lenis scroll event listener when the `IntersectionObserver` detects the element is intersecting the viewport, and unregister it as soon as it leaves.
3. **Synchronize with Lenis**: Connect directly to Lenis's scroll callback or trigger updates in sync with Lenis's RAF loop instead of binding native event listeners.

---

### 1.2 `useScrollReveal.js`
#### Observations:
* **Excessive MutationObserver Overhead**: The hook observes the entire `document.body` for all mutations (`childList: true, subtree: true`). On *every* single DOM change, it calls `updateObservation()`, which queries the entire DOM for `.reveal-on-scroll` and `.reveal-scale` elements using `document.querySelectorAll()`.
* **Loader-Induced Performance Drops**: During the initial loader sequence (0% to 100%), the progress bar and technical log stream update the DOM rapidly (every 50ms, plus additional state updates). This causes the `MutationObserver` to fire dozens of times during loading, forcing expensive `querySelectorAll` calls that degrade loading performance.
* **Redundancy**: The DOM structure in this portfolio is mostly static after mounting. No components containing `.reveal-on-scroll` or `.reveal-scale` classes are loaded dynamically or appended to the body after the application has mounted.

#### Recommendations:
1. **Deactivate During Sizing & Loading**: Do not initialize scroll reveal observers until the loading overlay has fully finished fading out and has unmounted.
2. **Eliminate MutationObserver**: Since elements are static, scan the DOM exactly once after mount or after loading completes. The `MutationObserver` is completely unnecessary.
3. **Declarative Ref-Based Registration**: The clean React pattern is to register individual elements using a React ref returned by the hook (e.g. `const ref = useScrollReveal()`). This registers elements directly with a shared `IntersectionObserver` instance without query-selecting the entire document body.

---

## 2. Canvas Sizing and Initialization Behavior during Loading

### 2.1 Initialization & Rendering Hidden Canvases
* **Render Loop during Loader Screen**: Both `OrganicCanvas` (mounted at root) and `AntigravityCanvas` (mounted in `Skills` and `About`) start their `requestAnimationFrame` loops immediately when the app mounts. However, the screen is covered by a technical `loader-overlay` for the first 1.8 seconds. Drawing meshes and computing particle physics while hidden is a waste of CPU/GPU resources.
* **Offscreen Render Loops**: The two `AntigravityCanvas` instances in `Skills` and `About` are located far down the page. They start rendering at 60 FPS immediately upon mount and keep rendering even when off-screen.
* **IncorrectSizing Bug**: When canvas elements mount, their physical dimensions are calculated using:
  `let width = canvas.width = canvas.offsetWidth || window.innerWidth;`
  `let height = canvas.height = canvas.offsetHeight || window.innerHeight;`
  If parent sections are collapsed or hidden (e.g. `display: none` or size changes during load), their `offsetWidth`/`offsetHeight` return `0` or incorrect values. Since `resize()` is only bound to `window.resize`, the canvas buffer dimensions will remain incorrect (zero or distorted) when they scroll into view.

#### Recommendations:
1. **Pause Canvas Rendering when Obscured/Off-viewport**:
   * Pass the `loading` state from `App.jsx` to `OrganicCanvas` and only start the canvas animation loop once loading completes.
   * Wrap `AntigravityCanvas` with an `IntersectionObserver` that tracks the canvas's own intersection state. Pause the `requestAnimationFrame` loop (`cancelAnimationFrame`) when `isIntersecting === false` and resume it when it enters the viewport.
2. **On-Intersect Resize Sizing**: Call the `resize()` function inside the `IntersectionObserver` callback when the canvas first enters the viewport. This guarantees that its physical dimensions are measured only after the browser has resolved its layout, eliminating the `0` dimensions bug.
3. **Page Visibility Listener**: Listen to `document.addEventListener('visibilitychange')` to suspend all canvas animation loops when the user switches tabs.

---

## 3. Recommended IntersectionObserver Cleanups

To avoid memory leaks and ghost execution threads, the `IntersectionObserver` instances must be cleaned up properly on component unmount:
1. **Closure Element References**: Store the DOM node being observed in a local variable inside the `useEffect` (e.g. `const el = canvasRef.current`). When returning the cleanup function, call the cleanup actions on this captured variable rather than evaluating `canvasRef.current` inside the cleanup, since React may clear the ref to `null` before the cleanup function executes.
2. **Call `.disconnect()`**: Always call `observer.disconnect()` in the cleanup block to release all observed targets from memory.
3. **Cancel Animation Frames**: Ensure `cancelAnimationFrame(animationFrameId)` is called immediately upon unmount or when leaving viewport to prevent orphan RAF frames from continuing to schedule execution.

---

## 4. Proposed Code Diffs

Here are the proposed implementations for optimizing the hooks and canvas components.

### 4.1 Proposed Refactoring for `src/hooks/useParallax.js`
This refactor caches the element coordinates, removes `getBoundingClientRect()` from the scroll loop, and synchronizes with the window scroll smoothly.

```javascript
import { useEffect, useRef } from 'react';

export const useParallax = (speed = -0.06) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === 'undefined') return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (isTouch || !hasFinePointer) return;

    let isVisible = false;
    let animationFrameId = null;
    let staticTop = 0;
    let elementHeight = 0;

    el.style.willChange = 'transform';
    el.style.transition = 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)';

    const measureLayout = () => {
      // Temporarily remove transform to measure static position
      const currentTransform = el.style.transform;
      el.style.transform = '';
      
      const rect = el.getBoundingClientRect();
      staticTop = rect.top + window.scrollY;
      elementHeight = rect.height;
      
      // Restore transform
      el.style.transform = currentTransform;
    };

    const updateParallax = () => {
      if (!isVisible) return;

      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const elementCenter = staticTop + elementHeight / 2;
      const scrollCenter = scrollY + viewportHeight / 2;

      const diff = scrollCenter - elementCenter;
      const offset = diff * speed;

      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      animationFrameId = null;
    };

    const handleScroll = () => {
      if (isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(updateParallax);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          measureLayout();
          window.addEventListener('scroll', handleScroll, { passive: true });
          updateParallax();
        } else {
          window.removeEventListener('scroll', handleScroll);
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      },
      { root: null, threshold: 0 }
    );

    observer.observe(el);

    const handleResize = () => {
      if (isVisible) {
        measureLayout();
        updateParallax();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed]);

  return elementRef;
};

export default useParallax;
```

### 4.2 Proposed Refactoring for `src/hooks/useScrollReveal.js`
This eliminates the `MutationObserver` overhead during initial loading.

```javascript
import { useEffect } from 'react';

export const useScrollReveal = (loading = false) => {
  useEffect(() => {
    if (loading || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05,
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const updateObservation = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
      elements.forEach((el) => {
        if (!el.classList.contains('in-view')) {
          observer.observe(el);
        }
      });
    };

    // Scan the layout after loading completes and layout settles
    const timeoutId = setTimeout(updateObservation, 200);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loading]);
};

export default useScrollReveal;
```

### 4.3 Proposed Refactoring for `src/components/AntigravityCanvas.jsx`
This adds an viewport observation step inside the canvas itself to pause offscreen loop executions, triggers resize measurement inside intersection events to avoid `0` size issues, and supports page visibility changes.

```javascript
import React, { useEffect, useRef } from 'react';

const AntigravityCanvas = ({
  mode = 'light',
  colorScheme = 'amber',
  density = 'medium',
  clusterRight = false,
  velocityStretch = true
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let animationFrameId;
    let isVisible = false;
    
    let width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.offsetHeight || window.innerHeight;
    let devicePixelRatio = window.devicePixelRatio || 1;

    const isMobile = window.innerWidth < 768;
    let particleCount = 50;
    if (density === 'high') particleCount = isMobile ? 35 : 80;
    else if (density === 'medium') particleCount = isMobile ? 25 : 50;
    else if (density === 'low') particleCount = isMobile ? 12 : 25;

    const connectionDistance = 110;
    const repulsionRadius = 180;
    const particleAlpha = mode === 'dark' ? 0.85 : 0.38;
    const haloAlpha = mode === 'dark' ? 0.22 : 0.10;
    const lineBaseOpacity = mode === 'dark' ? 0.28 : 0.22;

    const neonColors = [
      `hsla(200, 100%, 60%, ${particleAlpha})`,
      `hsla(140, 100%, 55%, ${particleAlpha})`,
      `hsla(360, 100%, 60%, ${particleAlpha})`,
      `hsla(36, 100%, 55%, ${particleAlpha})`,
      `hsla(270, 100%, 65%, ${particleAlpha})`
    ];

    const amberColors = [
      `hsla(36, 100%, 55%, ${particleAlpha})`,
      `hsla(24, 100%, 50%, ${particleAlpha})`,
      `hsla(45, 100%, 58%, ${particleAlpha})`
    ];

    const resize = () => {
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      initParticles();
    };

    class Particle {
      constructor() {
        if (clusterRight) {
          const radius = Math.random() * Math.min(width, height) * 0.28;
          const angle = Math.random() * Math.PI * 2;
          this.baseX = width * 0.72 + Math.cos(angle) * radius;
          this.baseY = height * 0.5 + Math.sin(angle) * radius;
        } else {
          this.baseX = Math.random() * width;
          this.baseY = Math.random() * height;
        }

        this.x = this.baseX;
        this.y = this.baseY;
        this.prevX = this.x;
        this.prevY = this.y;
        this.radius = mode === 'dark' ? (Math.random() * 1.5 + 1.2) : (Math.random() * 2.2 + 1.8);
        const palette = colorScheme === 'neon' ? neonColors : amberColors;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.015 + 0.005;
        this.wobbleRadius = Math.random() * 12 + 6;
      }

      update() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.angle += this.speed;

        let targetX = this.baseX + Math.cos(this.angle) * this.wobbleRadius;
        let targetY = this.baseY + Math.sin(this.angle) * this.wobbleRadius;

        const mouse = mouseRef.current;
        if (mouse.x !== -1000) {
          const dx = targetX - mouse.x;
          const dy = targetY - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repulsionRadius) {
            const force = (repulsionRadius - dist) / repulsionRadius;
            const pushAngle = Math.atan2(dy, dx);
            const pushDistance = force * 70;
            targetX += Math.cos(pushAngle) * pushDistance;
            targetY += Math.sin(pushAngle) * pushDistance;
          }
        }

        this.x += (targetX - this.x) * 0.08;
        this.y += (targetY - this.y) * 0.08;
      }

      draw() {
        const vx = this.x - this.prevX;
        const vy = this.y - this.prevY;
        const velocity = Math.hypot(vx, vy);

        if (velocityStretch && velocity > 0.8) {
          ctx.beginPath();
          ctx.moveTo(this.x - vx * 1.5, this.y - vy * 1.5);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.radius * 2;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = this.color.replace(`${particleAlpha}`, `${haloAlpha}`);
          ctx.fill();
        }
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', resize, { passive: true });
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      ctx.lineWidth = 0.65;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * lineBaseOpacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            ctx.strokeStyle = mode === 'dark' 
              ? `rgba(255, 255, 255, ${opacity})`
              : (colorScheme === 'neon'
                  ? `rgba(17, 24, 39, ${opacity * 0.45})`
                  : `rgba(227, 93, 59, ${opacity * 0.8})`);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Viewport-based rendering trigger
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        
        if (isVisible) {
          resize(); // Recalculate dimensions on entering viewport to prevent 0px layout errors
          if (!wasVisible) {
            render();
          }
        } else if (wasVisible) {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    // Tab visibility handling
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (isVisible) {
        render();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, colorScheme, density, clusterRight, velocityStretch]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default AntigravityCanvas;
```
