# Codebase Modifications — Milestone 2

The following changes were made to implement Milestone 2 features, theme propagation, resource conservation, and E2E testing:

## 1. App-wide Theme Architecture (`src/App.jsx`)
- Implemented global `theme` state defaulting to `'light'` (or `'dark'` based on user system preference).
- Added synchronization with `localStorage` (key: `'theme'`).
- Added system preference media query listener (`prefers-color-scheme: dark`) to synchronize theme dynamically if the user has no custom stored preference.
- Added cross-tab/storage-event synchronization (`storage` event listener) to ensure multi-tab theme alignment.
- Propagated the `theme` and `toggleTheme` handlers to the following downstream components:
  - `<Navbar theme={theme} toggleTheme={toggleTheme} />`
  - `<AntigravityCanvas mode={theme} />` (within the `#about` section)
  - `<Skills theme={theme} />` (within the skills section)

## 2. Accessible Navbar Theme Toggle (`src/components/Navbar.jsx`)
- Integrated a theme toggle control button following modern accessibility standards:
  - Added `role="switch"` and `aria-checked={theme === 'dark'}` attributes.
  - Linked trigger action to the app-wide `toggleTheme` function.
- Converted hardcoded color hex values to CSS variable expressions for panel backgrounds (`--navbar-bg-collapsed`, `--navbar-bg-scrolled`, `--navbar-bg-idle`, `--mobile-menu-bg`).

## 3. Theme-aware Section Components
### `src/sections/Timeline.jsx`
- Replaced hardcoded `#ffffff` backgrounds on cards with theme-aware `var(--bg-primary)` styling.

### `src/sections/Skills.jsx`
- Propagated the active `theme` prop to `<SkillsMesh mode={theme} />` (which encapsulates `AntigravityCanvas`).
- Replaced hardcoded backdrop opacities (`rgba(255, 255, 255, 0.65)`, `rgba(255, 255, 255, 0.7)`, `rgba(255, 255, 255, 0.9)`) and solid colors (`#ffffff`) on badges, node buttons, active states, and detail drawers with custom design system variables (`var(--glass-bg)`, `var(--bg-primary)`) to support high-contrast readability in dark mode.

## 4. E2E Test Suite Dashboard (`tests/e2e/e2e-runner.html`)
- Corrected the initial/placeholder stats counts for E2E scenarios from `7` to `27` to represent all implemented tests.
- Updated `updateStats()` inside the dashboard script to dynamically compute and insert the total scenario count (`statTotal`) to ensure the dashboard reflects execution status accurately.
