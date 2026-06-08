## 2026-06-06T17:35:08Z

Optimize the portfolio's performance by pausing background canvas rendering when out of the viewport, and implement a beautifully crafted dark/light theme toggle.

Working directory: /Users/milan/LOI-mln.github.io
Integrity mode: development

## Requirements

### R1. Canvas Performance Optimization
Implement viewport-based rendering for OrganicCanvas and AntigravityCanvas using the Intersection Observer API. The `requestAnimationFrame` loops must only run when the canvases are visible in the viewport to conserve CPU, GPU, and battery resources.

### R2. Dark/Light Theme Toggle (Highly Polished Switch)
Add an interactive, custom-designed theme toggle switch in the Navbar that:
- Switches between light and dark modes.
- Uses a beautifully crafted and animated custom switch (e.g. featuring smooth morphing transitions, micro-interactions, or a creative sun/moon sliding track) rather than a simple static icon.
- Updates the document theme (e.g., toggling a class on the `<html>` or `<body>` element) and updates CSS variables.
- Passes the appropriate `mode` prop (`'light'` or `'dark'`) to AntigravityCanvas.
- Persists the theme choice in `localStorage`.

## Acceptance Criteria

### Performance
- [ ] Intersection Observer is active on both canvas components.
- [ ] The animation loop (`requestAnimationFrame`) for `AntigravityCanvas` does not execute when the "#about" section is completely off-screen.
- [ ] The animation loop for `OrganicCanvas` pauses when it is covered or scrolled off-screen.

### Theme Support & Design
- [ ] Theme toggle switch is highly polished with micro-animations, fully accessible, responsive, and visible in the navbar.
- [ ] Clicking the toggle updates all global colors smoothly (using CSS transitions).
- [ ] The selected theme persists on page reload.
- [ ] `AntigravityCanvas` switches its visual style (point size, connections opacity/color) based on the active theme.
