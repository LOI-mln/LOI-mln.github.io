# Scope: E2E Testing Track

## Architecture
The E2E Testing Track focuses on designing and implementing a comprehensive, dual-layered test suite to verify the Canvas Performance Optimization (F1) and the Theme Toggle Switch (F2) features.
- **Layer A**: A standard Playwright E2E suite (`tests/e2e/*.spec.js`) designed for local developer and CI environments, using actual browser scrolling and visibility triggers.
- **Layer B**: A zero-dependency visual E2E runner (`e2e-runner.html`) that executes the app inside an iframe and uses monkey-patched hooks to inspect frame-rates and toggle states instantly in any browser.

## Milestones
| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|-------------|--------|-----------------|
| 1 | Test Infrastructure Setup | Create Playwright configuration, install required dependencies if possible, and set up the `e2e-runner.html` test harness. | None | DONE | 83ef732b-4839-4712-9813-ccc1c5f5f2d9 |
| 2 | Test Cases Implementation | Implement all 27 planned test cases across Tiers 1-4 for F1 (canvas performance) and F2 (theme toggle) in both Playwright and the iframe runner. | M1 | DONE | 9e63adfd-6e01-4ef6-be3d-8fd6fd571796 |
| 3 | Documentation & Verification | Verify the compilation of test files, verify that the suite runner is functional, and write `TEST_INFRA.md` and `TEST_READY.md`. | M2 | DONE | 48699b9b-b179-457c-8b7b-cb6f589accd5 |

## Interface Contracts
### E2E Test ↔ React Application Hooks
- **DOM class/attributes**: Theme toggle must set the `.dark` class (or a `data-theme="dark"` attribute) on the `<html>` or `<body>` element.
- **Toggle switch element**: Theme toggle button in `Navbar.jsx` must be queryable via selector `header button[role="switch"]` or `header button.theme-toggle-btn` or contain the text "theme" / an svg icon.
- **Canvas Ref**: Canvas elements must be queryable in the DOM (`canvas` selector).
- **RequestAnimationFrame**: Tests will spy on `window.requestAnimationFrame` to track frame rendering.
- **IntersectionObserver**: Canvases must use IntersectionObserver to pause/resume their render loop when scrolled out of viewport.
- **LocalStorage**: Theme selection must be stored under the key `'theme'` with value `'dark'` or `'light'`.
