# Analysis Report: Global Canvas Performance Integration & Lifecycle Optimization

## Executive Summary
This report analyzes the global performance integration of `OrganicCanvas` and `AntigravityCanvas` in the React portfolio application. The investigation identified three major performance bottlenecks:
1. **Unthrottled MutationObserver Overhead**: The `useScrollReveal` hook observes the entire document body (`subtree: true`) for dynamic changes. Because the full-screen technical loader updates progress indicators 20 times per second, this triggers continuous, duplicate DOM scans (`querySelectorAll`) and observer registrations, creating a massive CPU bottleneck during initial load.
2. **Wasteful Off-screen Canvas Loops**: Both `OrganicCanvas` and two instances of `AntigravityCanvas` (in `Skills` and `about` sections) are mounted immediately and execute their `requestAnimationFrame` loops continuously. They draw complex grids and calculate particle distances even when hidden beneath the loading screen overlay or positioned far below the fold.
3. **Scroll Jitter in Parallax Hook**: The `useParallax` hook applies a CSS `transition: transform 0.1s` style to dynamic scroll-linked movements. The delay introduced by this CSS transition conflicts with direct `requestAnimationFrame` scroll updates, resulting in visual lag and jitter (stuttering).

---

## 1. IntersectionObserver & MutationObserver Analysis

### 1.1 `useScrollReveal.js` Performance Overhead
The `useScrollReveal` hook is instantiated globally in `App.jsx` on line 22:
```javascript
// Activer l'animation au défilement
useScrollReveal();
```

Inside `src/hooks/useScrollReveal.js` (lines 29-43):
```javascript
29:     const updateObservation = () => {
30:       const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
31:       elements.forEach((el) => {
32:         if (!el.classList.contains('in-view')) {
33:           observer.observe(el);
34:         }
35:       });
36:     };
...
42:     const mutationObserver = new MutationObserver(updateObservation);
43:     mutationObserver.observe(document.body, { childList: true, subtree: true });
```

#### Issues Identified:
* **Layout Thrashing during Loading Screen**: The progress bar updates every 50ms (lines 35-42 of `App.jsx`) and prints diagnostic logs to the DOM. Since the `MutationObserver` watches `document.body` with `subtree: true`, every single log change and percentage increment triggers a call to `updateObservation`. This performs a global `querySelectorAll` search and re-adds elements to the `IntersectionObserver` 20 times per second before the page is even interactive.
* **Redundancy**: The scroll reveal targets are static DOM nodes declared in JSX. A deep `MutationObserver` is entirely unnecessary since these elements do not change dynamically after mount.

### 1.2 `useParallax.js` Scroll Jitter
Inside `src/hooks/useParallax.js` (lines 21-36):
```javascript
21:     el.style.willChange = 'transform';
22:     el.style.transition = 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)'; // Transition fluide
23: 
24:     const observer = new IntersectionObserver(
25:       ([entry]) => {
26:         isVisible = entry.isIntersecting;
...
```

#### Issues Identified:
* **Dynamic Transform vs. CSS Transition Conflict**: Setting a CSS transition on `transform` while updating it via `requestAnimationFrame` on scroll events is a performance anti-pattern. As the user scrolls, the JS thread updates `transform` coordinates immediately, but the CSS transition engine forces the element to animate slowly to the new position over 100ms. This causes the element to fall behind the scroll position and jitter (stutter/shiver) visibly.

---

## 2. Canvas Behavior during Initialization and Loading

The application uses three canvas components that are mounted immediately at page load:
1. **Background Canvas**: `OrganicCanvas` rendered at the root level of `App.jsx`.
2. **Skills Canvas**: `AntigravityCanvas` inside `src/sections/Skills.jsx`.
3. **About Canvas**: `AntigravityCanvas` inside `App.jsx` under `<section id="about">`.

### 2.1 Initialization while Covered by Loading Screen
During the first 2.6 seconds of page load (`loading = true`), a full-screen HUD loading overlay covers the viewport. However:
* `OrganicCanvas` immediately gets a 2D context, calculates a 28x28 grid (841 vertex updates and mesh drawings per frame), and starts its `requestAnimationFrame` render loop immediately (lines 160-162 of `OrganicCanvas.jsx`).
* Both `AntigravityCanvas` instances (in `Skills` and `about` sections) initialize, generate particle arrays, register event listeners, and start rendering immediately.
* **Impact**: Significant CPU and GPU cycles are spent rendering animations that are entirely hidden under the loader, delaying DOM compilation and causing potential loading stutter.

### 2.2 Continuous Rendering of Off-screen Canvases
`AntigravityCanvas` elements in `Skills` and `about` are located lower on the page (off-screen initially).
* Their `requestAnimationFrame` loops run constantly.
* At medium or high density settings, they perform expensive inter-particle distance checks (complexity $O(N^2)$ where $N$ is particle count) and canvas path strokes 60 times per second while invisible to the user.
* **Impact**: Unnecessary power consumption, memory footprint, and frame drops on low-end or mobile devices.

---

## 3. Recommended Cleanups and Best Practices

### 3.1 Cleaning up IntersectionObserver on Component Unmount
* **Always disconnect**: Always call `observer.disconnect()` in the `useEffect` cleanup function.
* **Stable target reference**: If using `observer.unobserve(element)`, avoid querying `elementRef.current` inside the cleanup function because React may nullify the ref before the cleanup runs. Instead, store `elementRef.current` in a local variable inside the effect scope and unobserve that local reference.
```javascript
useEffect(() => {
  const elementToObserve = elementRef.current;
  if (!elementToObserve) return;

  const observer = new IntersectionObserver(...);
  observer.observe(elementToObserve);

  return () => {
    // Safely unobserve the captured DOM element
    observer.unobserve(elementToObserve);
    // Alternatively, tear down the observer instance entirely
    observer.disconnect();
  };
}, []);
```

### 3.2 Freeze Canvases when Covered or Off-screen
Modify both `OrganicCanvas` and `AntigravityCanvas` to:
1. **Freeze when loading**: Check a prop (e.g. `isActive` or `loading`) or only mount them when the page loader is finished (`!loading && <OrganicCanvas />`).
2. **Freeze when off-screen**: Wrap the rendering logic in an `IntersectionObserver` that pauses the `requestAnimationFrame` loop when `isIntersecting` is `false`.

### 3.3 Optimize Lenis Resize MutationObserver
In `App.jsx` (lines 91-94), Lenis uses an unthrottled `MutationObserver` on the body. During the loader phase, this fires continuously.
* **Solution**: Check if the height actually changed before invoking `lenis.resize()`, and debounce the callback.

---

## 4. Proposed Refactoring Diffs

### 4.1 Optimize `App.jsx`
* Render canvas elements only after the loading screen fades out.
* Optimize the Lenis MutationObserver to check for layout height updates.

```diff
<<<< Proposed App.jsx mounting logic
-       {/* Contenu principal de l'application */}
-       <div className="app-container">
-         {/* Canvas de fond organique */}
-         <OrganicCanvas />
+       {/* Contenu principal de l'application */}
+       <div className="app-container">
+         {/* Canvas de fond organique rendu uniquement après chargement */}
+         {!loading && <OrganicCanvas />}
```

```diff
<<<< Proposed Lenis MutationObserver in App.jsx
-     const observer = new MutationObserver(() => {
-       lenis.resize();
-     });
-     observer.observe(document.body, { childList: true, subtree: true });
+     let lastHeight = document.body.scrollHeight;
+     const observer = new MutationObserver(() => {
+       const newHeight = document.body.scrollHeight;
+       if (newHeight !== lastHeight) {
+         lastHeight = newHeight;
+         lenis.resize();
+       }
+     });
+     observer.observe(document.body, { childList: true, subtree: true });
```

### 4.2 Freeze off-screen animation loops in `AntigravityCanvas.jsx`
Insert an `IntersectionObserver` inside `AntigravityCanvas`'s `useEffect` to start/stop the animation frame loop based on element visibility.

```diff
<<<< Proposed IntersectionObserver logic in AntigravityCanvas.jsx
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // ... setup and config ...
    
    let isVisible = false;
    let animationFrameId;

    const render = () => {
      if (!isAnimating || !isVisible) return;
      
      // ... rendering loop ...
      
      animationFrameId = requestAnimationFrame(render);
    };

    // Observer de visibilité pour geler le canvas hors écran
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        console.log('[AntigravityCanvas] IN VIEW - Starting render loop');
        render();
      } else {
        console.log('[AntigravityCanvas] OUT OF VIEW - Pausing render loop');
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    }, { threshold: 0.01 });

    visibilityObserver.observe(canvas);

    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [mode, colorScheme, density, clusterRight, velocityStretch]);
```

### 4.3 Replace MutationObserver with simple load-reveal in `useScrollReveal.js`
Since the elements are statically defined in React JSX, we can replace the unthrottled MutationObserver on the body with a simple timer or direct scan when components mount, or mount it after loading completes.

```diff
<<<< Proposed useScrollReveal.js
  export const useScrollReveal = () => {
    useEffect(() => {
      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
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
  
-     // Scan initial après le chargement
-     const timeoutId = setTimeout(updateObservation, 400);
- 
-     // Observer les changements dynamiques du DOM
-     const mutationObserver = new MutationObserver(updateObservation);
-     mutationObserver.observe(document.body, { childList: true, subtree: true });
- 
-     return () => {
-       clearTimeout(timeoutId);
-       observer.disconnect();
-       mutationObserver.disconnect();
-     };
+     // Scan unique après chargement
+     const timeoutId = setTimeout(updateObservation, 500);
+ 
+     // Plus de MutationObserver sur document.body
+     return () => {
+       clearTimeout(timeoutId);
+       observer.disconnect();
+     };
    }, []);
  };
```

### 4.4 Fix Scroll Jitter in `useParallax.js`
Remove the CSS `transition` rule from the element, and optionally reduce recalculation frequencies.

```diff
<<<< Proposed useParallax.js
    // Préparer l'accélération matérielle GPU
    el.style.willChange = 'transform';
-   el.style.transition = 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)'; // Transition fluide
+   // Retirer la transition CSS qui cause le retard cinématique et le sautillement (scroll jitter)
+   el.style.transition = 'none'; 
```
