# Project: Portfolio Canvas Performance and Dark/Light Theme Toggle

## Architecture
This project focuses on two core enhancements to the Vite React portfolio:
1. **Canvas Performance Optimization (Viewport-Based Rendering)**:
   - Use the Intersection Observer API in `OrganicCanvas.jsx` and `AntigravityCanvas.jsx`.
   - Control the render/animation loops (`requestAnimationFrame`) to execute only when the canvases are intersecting the viewport.
2. **Dark/Light Theme Toggle**:
   - Add a highly polished, interactive toggle switch in `Navbar.jsx`.
   - Toggle theme state between `'light'` and `'dark'`.
   - Update the document theme on the `<html>` or `<body>` element (using a class or attribute like `data-theme`).
   - Define custom CSS variables for dark/light themes in `index.css`.
   - Pass the appropriate `mode` prop (`'light'` or `'dark'`) to `AntigravityCanvas`.
   - Persist theme preference in `localStorage`.

## Code Layout
The target source files for modification are:
- `src/App.jsx` — Core application container, theme state, parent of canvases and navbar.
- `src/components/Navbar.jsx` — Navigation bar where the custom toggle switch is integrated.
- `src/components/OrganicCanvas.jsx` — Grid mesh background canvas, needs viewport optimization.
- `src/components/AntigravityCanvas.jsx` — Interactive constellation canvas, needs viewport optimization and theme style updates (point size, connections color/opacity).
- `src/sections/Skills.jsx` — Renders `SkillsMesh` which utilizes `AntigravityCanvas` and needs theme prop propagation.
- `src/index.css` — Global stylesheet where CSS variables and design tokens for light/dark themes are defined.

## Milestones
| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|-------------|--------|-----------------|
| 1 | E2E Testing Track | Define & create E2E test suites (Tiers 1-4) in an independent test framework. | None | DONE | 0cdb1331-7bd4-482b-9549-a8699dd4fb91 |
| 2 | Canvas Performance Optimization | Implement Intersection Observer inside `OrganicCanvas` and `AntigravityCanvas` to pause `requestAnimationFrame` when out of viewport. | None | DONE | c5879107-8f1b-4bb5-92bd-d164d85902a8 |
| 3 | Theme Toggle Switch & Style Propagation | Add custom sun/moon toggle switch, theme state wiring, persistence, CSS variables for dark/light theme, and propagates theme to canvases. | None | DONE | c5879107-8f1b-4bb5-92bd-d164d85902a8 |
| 4 | Final Integration & E2E Verification | Ensure the implementation track passes all tests, and harden coverage via white-box challenger. Run Forensic Audit. | M1, M2, M3 | IN_PROGRESS | 23ad9db8-f1f2-4bda-9220-5e00e94f26a5 |

## Interface Contracts
### Theme Toggle State Propagation
- **`Navbar`**: Receives `theme` (`'light' | 'dark'`) and `setTheme` (`(theme: string) => void`) props. Toggles the theme between `'light'` and `'dark'`.
- **`AntigravityCanvas`**: Receives `mode` (`'light' | 'dark'`) prop. Updates drawing parameters (point sizes, alphas, colors) when `mode` changes.
- **`OrganicCanvas`**: Automatically updates its grid lines and particles based on CSS variables or direct DOM theme attributes.

### Intersection Observer API Usage
- Canvases must set up an `IntersectionObserver` instance targetting their canvas element.
- When `isIntersecting` is true, start/resume the render loop.
- When `isIntersecting` is false, cancel/pause the render loop (`cancelAnimationFrame`).
- Clean up the observer on component unmount.
