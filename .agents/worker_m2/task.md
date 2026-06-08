# Task Description for Worker M2

## Objective
Implement Milestone 2: Theme Switch UI & State Propagation in Milan's portfolio. You must ensure that all code is genuine and functional (no dummy/mock implementations), builds without errors, and passes all relevant Playwright tests.

---

## MANDATORY INTEGRITY WARNING
> **DO NOT CHEAT.** All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

---

## Detailed Requirements

### 1. index.html (FOUC Prevention)
- Add an inline blocking script inside the `<head>` of `/Users/milan/LOI-mln.github.io/index.html` (before any stylesheets or body content) to immediately detect and apply the theme to the `html` element from `localStorage` or fallback to system preference.
- Code pattern:
  ```html
  <script>
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        if (stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (e) {}
    })();
  </script>
  ```

### 2. Navbar.jsx (Polished Sun/Moon Toggle Switch)
- Replace the static icon button with a custom animated sun/moon theme switch UI.
- The button **MUST** have `role="switch"`, `aria-checked={theme === 'dark'}`, and the class name `theme-toggle-btn` (so the Playwright locator in E2E tests finds it).
- Support both `toggleTheme` and `setTheme` in the props to prevent contract mismatches.
- Use the **SVG Morphing Toggle** (Option A in explorer_m2_2 analysis) inside the button. It uses a single SVG with a mask `cx`, `cy`, and `r` that transitions smoothly when the theme changes, alongside transition styles for the rays and rotation.
- Include a `<style>` block inside `Navbar.jsx` (or add to `src/index.css`) containing the CSS transition selectors for `.theme-toggle-svg`, `.sun-center`, `.moon-mask-circle`, and `.sun-ray`.

### 3. AntigravityCanvas.jsx (Decouple rendering from theme rebuild)
- Modify `AntigravityCanvas.jsx` to match the exact patch recommendations in `/Users/milan/LOI-mln.github.io/.agents/explorer_m2_3/theme_propagation.patch`.
- Specifically:
  - Keep a `modeRef = useRef(mode)` and update it inside a `useEffect` whenever `mode` changes.
  - Remove `mode` from the main `useEffect` dependency array so the canvas is **not** unmounted or reinitialized when the theme toggles.
  - Track a `themeTransition` value in the rendering loop (easing from 0 to 1 for dark theme, and 1 to 0 for light theme).
  - Interpolate particle colors (`h, s, l`, particle alpha, and halo alpha) and constellation line colors/opacities dynamically using `themeTransition` inside the frame loops to prevent visually harsh transitions.

### 4. OrganicCanvas.jsx (Accept mode and transition grid colors)
- Pass the theme prop to `OrganicCanvas` as `mode={theme}` in `App.jsx`.
- Update `OrganicCanvas.jsx` to accept the `mode` prop.
- Decouple it similarly to `AntigravityCanvas`:
  - Store `mode` in a `modeRef`.
  - Use a `themeTransition` float in the render loop.
  - Interpolate `ctx.strokeStyle` from `rgba(17, 24, 39, 0.035)` in light mode to `rgba(255, 255, 255, 0.035)` in dark mode to keep the grid lines visible but extremely subtle in both themes.

### 5. CustomCursor.jsx (Border color semantic mapping)
- In `/src/components/CustomCursor.jsx`, locate the `.custom-cursor-ring` styles.
- Change the hardcoded border style:
  `border: 1.5px solid rgba(17, 24, 39, 0.22);`
  to use the semantic variable:
  `border: 1.5px solid var(--border-color);`
- This ensures the cursor ring outline adjusts automatically and remains visible over dark sections in light/dark themes.

### 6. index.css (Smooth global transition fades)
- Add CSS transition properties to `body`, `.glass-panel`, `.dot-grid-bg`, `header`, `footer`, and `.theme-toggle-btn` to fade colors smoothly during theme switching:
  ```css
  body,
  .glass-panel,
  .dot-grid-bg,
  header,
  footer,
  .theme-toggle-btn {
    transition: background-color 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                color 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                background-image 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  ```
- Define the dot grid background image for dark mode:
  ```css
  .dark .dot-grid-bg, [data-theme="dark"] .dot-grid-bg {
    background-image: 
      radial-gradient(circle, rgba(243, 244, 246, 0.015) 1.5px, transparent 1.5px);
  }
  ```

---

## Verification and Quality Gates
- Verify that Vite compiles successfully with `npm run build`.
- Make sure that after you implement, the theme transitions are smooth, the canvases do not reset or flicker on switch, and the cursor adapts.
- Document any changes made in a handoff report at `/Users/milan/LOI-mln.github.io/.agents/worker_m2/handoff.md`.
