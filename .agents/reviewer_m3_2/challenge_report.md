## Challenge Summary

**Overall risk assessment**: LOW

The E2E integration implementation is highly robust, but contains implicit assumptions that could lead to edge-case failures under resource constraints, private browsing restrictions, or atypical user interactions.

---

## Challenges

### [Medium] Challenge 1: LocalStorage Availability Failure bypasses Media Query in Head Script
- **Assumption challenged**: The FOUC script assumes that if `localStorage` fails to read (throws exception), it is safe to skip the prefers-color-scheme setting in the `<head>`.
- **Attack scenario**: A user visits the portfolio in private browsing mode on Safari or with third-party cookie/local storage blocking enabled. The `localStorage.getItem` call throws a `SecurityError`. The try-catch block immediately captures the error and jumps to the empty `catch` block, skipping media query checks.
- **Blast radius**: The HTML page renders in the default light theme, causing a bright white FOUC on page load for dark-mode system preference users until the React app initializes.
- **Mitigation**: Extract the `localStorage` lookup to its own `try/catch` and let the media query check run regardless:
  ```javascript
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  ```

### [Low] Challenge 2: Custom Cursor Freezing on Viewport Mouse Leave
- **Assumption challenged**: The custom cursor assumes the pointer will always remain within the document boundary.
- **Attack scenario**: A user moves the mouse rapidly out of the browser window (e.g., upward to the address bar or search tab). The `mousemove` event stops firing.
- **Blast radius**: The custom cursor ring and dot remain frozen at the last known coordinates on the edge of the viewport rather than fading or disappearing.
- **Mitigation**: Add a listener on `document` for the `mouseleave` event to hide/fade out the custom cursor elements.
  ```javascript
  const handleMouseLeaveDoc = () => {
    if (dotRef.current) dotRef.current.style.opacity = 0;
    if (ringRef.current) ringRef.current.style.opacity = 0;
  };
  const handleMouseEnterDoc = () => {
    if (dotRef.current) dotRef.current.style.opacity = 1;
    if (ringRef.current) ringRef.current.style.opacity = 1;
  };
  document.addEventListener('mouseleave', handleMouseLeaveDoc);
  document.addEventListener('mouseenter', handleMouseEnterDoc);
  ```

### [Low] Challenge 3: Lack of IntersectionObserver Support Fallback
- **Assumption challenged**: Assumes the target user agent supports `IntersectionObserver`.
- **Attack scenario**: A user accesses the page using an older browser or in an automated testing sandbox (e.g., outdated selenium/webdriver version) without `IntersectionObserver`.
- **Blast radius**: The application throws a reference error `IntersectionObserver is not defined` and crashes on load.
- **Mitigation**: Wrap the observer construction in a feature-check block, falling back to constant animation if unsupported:
  ```javascript
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => { ... });
    observer.observe(canvas);
  } else {
    // fallback behavior
    isIntersecting = true;
    render();
  }
  ```

---

## Stress Test Results

- **Corrupted LocalStorage payload** → `theme-toggle.spec.js` injects `'corrupted-data-value'` into storage → App falls back to default settings without crashing → **PASS**
- **Rapid click stress test** → `theme-toggle.spec.js` clicks the toggle 10 times rapidly → UI transitions smoothly and DOM matches final state → **PASS**
- **Page visibility change during execution** → Page visibility set to `'hidden'` → Canvas loops stop rendering immediately → **PASS**
- **Unmounting mid-animation** → DOM cleared mid-render → Loop halts, observers/event listeners are cleaned up, preventing memory leaks → **PASS**

---

## Unchallenged Areas

- **System preference changes during background idle** — reason not challenged: Simulated storage changes and system changes are already fully covered by Playwright specs `F2-T2-03` and `F2-T2-04`.
