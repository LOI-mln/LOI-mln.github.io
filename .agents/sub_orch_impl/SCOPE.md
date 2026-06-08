# Scope: Canvas Performance & Theme Toggle Implementation

## Architecture
- **State Management**: Root component (`src/App.jsx`) holds the global theme state (`light` or `dark`).
- **Theme Injection**: Toggles `html.classList.add('dark')` / `html.classList.remove('dark')` and persists the preference in `localStorage`.
- **Canvas Rendering**: 
  - `OrganicCanvas` and `AntigravityCanvas` mount an `IntersectionObserver` to monitor their own viewport visibility.
  - When visible, their animation frame loops run; when off-screen, the loops stop.
- **Theme Propagation**:
  - The theme mode (`mode` prop: `'light'` or `'dark'`) is passed to `AntigravityCanvas`.
  - `AntigravityCanvas` updates its color scheme and styles dynamically when the theme changes.
- **Theme Switch UI**:
  - Rendered in `Navbar.jsx` with access to the global toggle mechanism.
  - Fully animated, responsive, accessible, and polished.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Canvas Performance Optimization | Implement Intersection Observer on both OrganicCanvas and AntigravityCanvas to pause rendering when out of viewport. | None | DONE |
| 2 | Theme Switch UI & State Propagation | Implement global theme state, custom animated toggle in Navbar, localStorage persistence, document theme class toggling, CSS variable overrides, and mode propagation to AntigravityCanvas. | None | DONE |
| 3 | E2E Integration | Wait for E2E tests to be ready and ensure all tests pass. | M1, M2 | DONE |
| 4 | Adversarial Hardening | white-box code audit and hardening against edge cases (e.g. storage exceptions, mobile menu resource conservation, outline accessibility, cursor boundaries). | M3 | IN_PROGRESS |


## Interface Contracts
### `App.jsx` ↔ `Navbar.jsx`
- Pass `theme` (`'light'` | `'dark'`) and `toggleTheme` (`() => void`) to `Navbar`.

### `App.jsx` ↔ `AntigravityCanvas.jsx`
- Pass `mode={theme}` to `AntigravityCanvas`.

### `Skills.jsx` ↔ `AntigravityCanvas.jsx`
- Let `Skills.jsx` read theme or propagate theme to its inner `SkillsMesh` rendering `AntigravityCanvas`. Wait! Does `Skills.jsx` need to be aware of the theme? Yes! In `Skills.jsx`, `SkillsMesh` renders `AntigravityCanvas` with a hardcoded `mode="light"`. We should make sure `SkillsMesh` adapts to the current theme too, or reads the theme mode from a global context/prop/document attribute. Let's make sure it updates dynamically.
