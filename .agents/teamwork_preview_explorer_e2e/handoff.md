# Handoff Report — E2E Test Suite Infrastructure & Design

This report summarizes the findings, framework feasibility assessment, and design of the E2E test suite for the portfolio canvas performance and theme toggle features.

---

## 1. Observation
We observed the following details from our investigation of the codebase and workspace:

- **Target Files & Locations**:
  - `src/App.jsx` (lines 1-606): Mounts the canvases (`OrganicCanvas` line 174, `AntigravityCanvas` line 205) and `Navbar` (line 183). It does not contain any theme state variables or prop wiring for canvas mode propagation.
  - `src/components/Navbar.jsx` (lines 1-400): Contains desktop/mobile responsive links, contacts, and social links, but **no theme toggle switch or state propagation is implemented**.
  - `src/components/OrganicCanvas.jsx` (lines 1-189): Renders a wavy mathematical mesh in a `requestAnimationFrame` loop (lines 51-160). It lacks any scroll/visibility pausing mechanism or theme class styling.
  - `src/components/AntigravityCanvas.jsx` (lines 1-294): Renders interactive floating dust particles. It reacts to a `mode` prop (`mode === 'dark'` vs `'light'`) to adjust line/particle visibility (lines 50-69, 104-106, 249-253). It runs a continuous render loop (lines 215-260) with no intersection or window visibility pausing hooks.
  - `package.json` (lines 1-34): Contains no test packages (Playwright, Vitest, or Cypress) in its dependencies or devDependencies.
- **Agent Sandbox Constraints**:
  - Command execution via `run_command` on the host macOS times out or gets blocked awaiting manual user approvals.
  - Running in **CODE_ONLY network mode** blocks network queries, which prevents downloading heavy E2E runner binaries (Playwright/Cypress) during the agent run.

---

## 2. Logic Chain
- **Theme Switch Missing**: Because the theme toggle switch is not yet implemented in `Navbar.jsx` and theme states are not yet defined in `App.jsx`, E2E test cases targeting F2 (Theme Toggle) will fail out-of-the-box until implemented.
- **Canvas Pausing Missing**: Because `OrganicCanvas.jsx` and `AntigravityCanvas.jsx` run their rendering loop inside infinite `requestAnimationFrame` hooks without listening to visibility or intersection observers, F1 test cases targeting canvas pausing will fail initially.
- **Framework Selection**: 
  - Standard E2E test suites (like Playwright) are the industry standard and must be designed for the project. The developer can easily install and execute them locally on their macOS environment where they have internet and terminal access.
  - However, in the isolated agent sandbox environment, these cannot be automatically installed/run due to network isolation.
  - Therefore, we propose a **Dual-Layered E2E Testing Strategy**:
    - **Layer A**: A standard Playwright spec suite (`playwright.config.js` and tests in `tests/e2e/`) that can be executed locally by the developer or in CI/CD pipelines.
    - **Layer B**: A zero-dependency visual E2E runner (`e2e-runner.html`) that loads the app inside an `<iframe>`, hacks/monkeys-patches the rendering loops and visibility triggers inside the frame, asserts states, and renders test results. This runner can be opened instantly in any browser without installing packages or starting complex node environments.

---

## 3. Caveats
- We did not write or test any actual code modifications on the target source files since this is a read-only investigation.
- We assume that when the implementation phase begins, the developer/worker will implement the global theme state and toggle switch strictly in line with the contracts described in `.agents/orchestrator/PROJECT.md` (e.g. using `mode` prop on `AntigravityCanvas` and toggling `classList` / storage inside `App.jsx`).

---

## 4. Conclusion
We proposed a comprehensive testing suite architecture satisfying all requirements:
1. **Playwright Config**: Standard local execution configuration.
2. **Playwright Spec Suite**: Complete tests covering Features 1 & 2 across Tiers 1-4 with specific assertion logic.
3. **Offline Iframe Test Runner (`e2e-runner.html`)**: Zero-dependency backup browser runner.
4. **Test Cases Design**:
  - **Tier 1 (Feature Coverage)**: 5 cases for F1 (canvas loading, loop FPS, intersection pausing, intersection resuming, visibility pausing) and 5 cases for F2 (toggle presence, class toggle, CSS variables shift, canvas prop update, storage persistence).
  - **Tier 2 (Boundary & Corner)**: 5 cases for F1 (scroll stress test, scale resize, zoom boundaries, background idle recovery, component cleanup) and 5 cases for F2 (toggle rate clicking, corrupt storage fallback, cross-tab sync, OS preference detection, responsive layout).
  - **Tier 3 (Cross-Feature Pairs)**: 2 cases (toggle during offscreen/paused state, toggle in background tab).
  - **Tier 4 (Application Scenarios)**: 5 real-world end-to-end user session journeys.

All details and code drafts have been written to `/Users/milan/LOI-mln.github.io/.agents/teamwork_preview_explorer_e2e/analysis.md`.

---

## 5. Verification Method
To verify this proposal:
1. Review the proposed test cases and configuration files in `analysis.md`.
2. Verify that all counts and targets meet the user requirements:
   - Tier 1: 5 cases for F1, 5 cases for F2. (Passes: 5 each)
   - Tier 2: 5 cases for F1, 5 cases for F2. (Passes: 5 each)
   - Tier 3: >= 1 case per feature pair. (Passes: 2 cases)
   - Tier 4: >= 5 application scenarios. (Passes: 5 scenarios)
3. Check the integration contracts in `analysis.md` against `.agents/orchestrator/PROJECT.md` and `sub_orch_impl/SCOPE.md`.
