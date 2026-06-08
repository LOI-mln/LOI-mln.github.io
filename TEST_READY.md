# TEST READY — E2E Test Suite Validation & Delivery

This document certifies that the End-to-End (E2E) Test Suite for the Milan Loï Portfolio project is complete, verified, and ready for deployment verification.

---

## 🚀 How to Run the Test Suite

The test suite supports two execution methods to accommodate both automation (CI/CD) and local manual auditing.

### Method 1: Playwright Command Line Interface (CLI)

Use this method to run headless automated tests across Chromium, Firefox, and WebKit.

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Execute Playwright Tests**:
   ```bash
   npx playwright test
   ```
3. **View the Test Report**:
   ```bash
   npx playwright show-report
   ```

*Note: Playwright will automatically spin up the Vite development server using the command `npm run dev` and run the tests against `http://localhost:5173` as specified in `playwright.config.js`.*

---

### Method 2: Zero-Dependency Browser Visual Runner

Use this method to run tests directly within a standard browser window via a custom-made dashboard HUD.

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
2. **Access the Visual Test Runner**:
   Open your browser and navigate to:
   ```
   http://localhost:5173/tests/e2e/e2e-runner.html
   ```
3. **Execute Tests**:
   Click the **"Run Test Suite"** button on the dashboard to execute all 27 tests sequentially. You will see the application respond inside the viewport simulation in real-time, with logs printed in the console panel.

---

## 📊 Coverage Summary

A total of **27** opaque-box E2E test cases have been implemented, covering performance optimization and style adaptation requirements.

| Test Tier | Tier Description | Scenarios Count | Files Location | Status |
| :--- | :--- | :---: | :--- | :--- |
| **Tier 1** | Unit & Component Isolation | 10 | `canvas-performance.spec.js`<br>`theme-toggle.spec.js` | ✅ Complete |
| **Tier 2** | Integration & Edge Cases | 10 | `canvas-performance.spec.js`<br>`theme-toggle.spec.js` | ✅ Complete |
| **Tier 3** | Cross-Feature Interactions | 2 | `cross-feature.spec.js` | ✅ Complete |
| **Tier 4** | Real-World Application Journeys | 5 | `application-scenarios.spec.js` | ✅ Complete |
| **Total** | **All Tiers Combined** | **27** | | **✅ 100% Ready** |

---

## 📋 Feature Checklist Mapping

The table below maps the two main optimized features to their corresponding test cases across all four tiers of verification.

| Feature Area | Tier 1 (Isolation) | Tier 2 (Integration & Edges) | Tier 3 (Cross-Feature) | Tier 4 (Journeys) |
| :--- | :--- | :--- | :--- | :--- |
| **F1: Canvas Performance** (Pausing requestAnimationFrame loops offscreen or inactive) | • **F1-T1-01**: Mount & Init<br>• **F1-T1-02**: FPS / Delta Check<br>• **F1-T1-03**: Viewport Scroll Pause<br>• **F1-T1-04**: Viewport Scroll Resume<br>• **F1-T1-05**: Page Visibility Pausing | • **F1-T2-01**: Rapid Scroll Stress<br>• **F1-T2-02**: Canvas Resizing<br>• **F1-T2-03**: Zoom Offscreen Scale<br>• **F1-T2-04**: Long-Term Background Idle<br>• **F1-T2-05**: Unmount Cleanup | • **F3-01**: Theme Toggle while Canvas Offscreen<br>• **F3-02**: Theme Toggle in Hidden Background Tab | • **F4-01**: First-Time User Experience (FTUX)<br>• **F4-04**: Full Interactive Session<br>• **F4-05**: Mobile Layout Resource Conservation |
| **F2: Theme Toggle Switch** (Accessible switch, custom vars, color persistence) | • **F2-T1-01**: Toggle Visibility / A11y<br>• **F2-T1-02**: DOM Class Toggling<br>• **F2-T1-03**: CSS Variable Shifts<br>• **F2-T1-04**: Canvas Color Propagation<br>• **F2-T1-05**: LocalStorage Persistence | • **F2-T2-01**: Click Parity Stress Test<br>• **F2-T2-02**: Corrupted Storage Fallback<br>• **F2-T2-03**: Cross-Tab Storage Sync<br>• **F2-T2-04**: System Query Alignment<br>• **F2-T2-05**: Responsive Sizes | • **F3-01**: Theme Toggle while Canvas Offscreen<br>• **F3-02**: Theme Toggle in Hidden Background Tab | • **F4-01**: First-Time User Experience (FTUX)<br>• **F4-02**: Returning User with Dark Theme<br>• **F4-03**: System Preference Alignment<br>• **F4-04**: Full Interactive Session<br>• **F4-05**: Mobile Layout Resource Conservation |
