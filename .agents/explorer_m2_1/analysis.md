# Analysis: Theme Switch UI & State Propagation

An analysis of the global theme state, localStorage persistence, document theme class toggling, and initial setup in `src/App.jsx` and related components in the Milan Loï portfolio.

---

## 1. Executive Summary

The portfolio implements a robust, reactive, and accessible theme switching system that synchronizes light/dark modes across the UI, canvas components, CSS custom properties, system preferences, and multiple open tabs.

### Core Strengths:
1. **Robust Initialization**: Checks `localStorage` with safety checks for corrupted data, falling back to system preference (`window.matchMedia`).
2. **Dynamic DOM Sync**: Syncs state to the `<html>` element using both classes (`.dark`) and attributes (`data-theme`), supporting multiple CSS targeting patterns.
3. **Reactive Canvas Synchronization**: Automatically redraws the interactive `AntigravityCanvas` particles and connections when the theme changes.
4. **Cross-Tab Synchronization**: Automatically synchronizes theme states across multiple tabs using the `storage` event listener.

### Key Improvement Areas:
1. **FOUC (Flash of Unstyled Content)**: The initial HTML has no theme class, causing a flash of light theme on dark-theme systems before React loads.
2. **OrganicCanvas Visibility**: The organic grid canvas uses hardcoded dark stroke styles (`rgba(17, 24, 39, 0.035)`), making it invisible in dark mode.
3. **CustomCursor Visibility**: The custom cursor outer ring uses a hardcoded dark border (`rgba(17, 24, 39, 0.22)`), losing visibility on dark backgrounds.

---

## 2. Detailed Technical Analysis

### 2.1. Initialization & State Setup
In `src/App.jsx` (Lines 21-38), theme state is initialized using React's lazy initializer pattern:

```javascript
const [theme, setTheme] = useState(() => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch (e) {
    // ignore
  }
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {
    // ignore
  }
  return 'light';
});
```

#### Code Analysis:
* **Lazy Initialization**: Using a callback inside `useState` ensures the initialization logic (checking `localStorage` and `matchMedia`) runs only once during the initial mount, preventing expensive disk reads on subsequent renders.
* **Corrupted Value Safeguard**: Validates the retrieved string `stored === 'dark' || stored === 'light'`. If a user or browser extension corrupts the `theme` key in `localStorage` with a value like `'garbage'`, it cleanly ignores it and falls back to system preferences.
* **Storage Protection**: The entire read operation is wrapped in a `try-catch` block. This is critical for users operating in private browsing modes (e.g. Safari Private Window) where reading from/writing to storage can throw runtime exceptions.
* **System Match Fallback**: Uses `window.matchMedia('(prefers-color-scheme: dark)').matches` as a secondary fallback.
* **System Preference Syncing** (Lines 73-113):
  A secondary listener dynamically updates the state if the system preference changes (e.g., system transitions scheduled from day to night) **only if** the user hasn't explicitly set their own manual preference in `localStorage`:
  ```javascript
  const handleMediaQueryChange = (e) => {
    try {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    } catch (err) {
      if (!theme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    }
  };
  ```

---

### 2.2. DOM Class & Attribute Toggling
In `src/App.jsx` (Lines 45-59), synchronization to the DOM is managed via a side effect:

```javascript
useEffect(() => {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
  } else {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
  }
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // ignore
  }
}, [theme]);
```

#### Code Analysis:
* **Targeting `document.documentElement`**: Directly targets the `<html>` element, which is standard for Tailwind-style `.dark` configurations and CSS custom variable scoping.
* **Dual Toggling**: Applies `.dark` class **and** `data-theme` attribute. This is extremely robust:
  - Class toggling supports class-based CSS selectors (`.dark .element`).
  - Attribute toggling supports data selectors (`[data-theme="dark"] .element`), which is common in CSS design systems.
* **Local Storage Syncing**: Commits the state to `localStorage` safely inside `try-catch`.

---

### 2.3. Theme Propagation & Interaction

State and the toggle function are propagated to children via React props:

```jsx
<Navbar theme={theme} toggleTheme={toggleTheme} />
<Skills theme={theme} />
<AntigravityCanvas mode={theme} ... />
```

#### 2.3.1. Navbar Component
In `src/components/Navbar.jsx` (Lines 256-297), the toggle switch uses the prop:
```jsx
<button
  onClick={toggleTheme}
  role="switch"
  aria-checked={theme === 'dark'}
  aria-label="Changer de thème"
  className="theme-toggle-btn"
  ...
>
  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
</button>
```
* **Accessibility Compliance**: Properly specifies `role="switch"` and `aria-checked={theme === 'dark'}`, enabling screen readers to identify the button's purpose and state.
* **Interactive Transition**: Sun and moon SVG icons render dynamically according to the theme.

#### 2.3.2. AntigravityCanvas Component
Propagated down to the canvas as the `mode` prop. In `src/components/AntigravityCanvas.jsx` (Lines 53-55, 250-255):
* Determines particle sizes and opacity constants (`particleAlpha`, `haloAlpha`, `lineBaseOpacity`) based on `mode`.
* Adjusts connection stroke styles dynamically:
  ```javascript
  ctx.strokeStyle = mode === 'dark' 
    ? `rgba(255, 255, 255, ${opacity})`
    : (colorScheme === 'neon'
        ? `rgba(17, 24, 39, ${opacity * 0.45})`
        : `rgba(227, 93, 59, ${opacity * 0.8})`);
  ```
* Recreates particles and redraws the canvas on theme change because `mode` is listed in the dependency array of its initialization effect.

---

## 3. Findings & Defect Mapping

| Component | Code Location | Finding / Issue | Impact | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `index.html` | `/index.html` | Missing pre-render head script for theme sync. | High | FOUC (Flash of Unstyled Content): A dark-themed user loading the page experiences a bright white flash before React loads. |
| `OrganicCanvas` | `/src/components/OrganicCanvas.jsx:123` | Hardcoded line strokes `rgba(17, 24, 39, 0.035)`. | Medium | The organic mesh lines are completely invisible in dark mode (dark lines on `#090b11` background). |
| `CustomCursor` | `/src/components/CustomCursor.jsx:170` | Hardcoded outer ring border `rgba(17, 24, 39, 0.22)`. | Medium | The custom cursor outer follower ring loses visibility/contrast on dark-themed sections. |

---

## 4. Proposals and Design Sketches

To address the identified findings, we propose three localized, non-disruptive changes.

### Proposal A: Prevent FOUC via Head Script Ingestion (index.html)
Add a tiny blocking script in the `<head>` of `/index.html` to sync the theme before HTML renders.

#### Before -> After Design:
```html
<!-- index.html (Before) -->
<head>
  <meta charset="UTF-8" />
  <title>Milan LOÏ | Portfolio Informatique & IA</title>
  ...
</head>
```

```html
<!-- index.html (After) -->
<head>
  <meta charset="UTF-8" />
  <title>Milan LOÏ | Portfolio Informatique & IA</title>
  <script>
    (function() {
      try {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (e) {}
    })();
  </script>
  ...
</head>
```

---

### Proposal B: Dynamic Theme Styling in `OrganicCanvas.jsx`
Allow `OrganicCanvas` to accept a `theme` prop and dynamically shift stroke colors.

#### Before -> After Design:
```javascript
// OrganicCanvas.jsx (Before)
const OrganicCanvas = () => {
  ...
  // Line 123
  ctx.strokeStyle = 'rgba(17, 24, 39, 0.035)'; // Very subtle dark lines
```

```javascript
// OrganicCanvas.jsx (After)
const OrganicCanvas = ({ theme = 'light' }) => {
  ...
  // Line 123
  ctx.strokeStyle = theme === 'dark' 
    ? 'rgba(243, 244, 246, 0.025)' // Subtle light lines for dark mode
    : 'rgba(17, 24, 39, 0.035)';  // Subtle dark lines for light mode
```
In `App.jsx`, update the rendering of `OrganicCanvas`:
```jsx
{/* Canvas de fond organique */}
<OrganicCanvas theme={theme} />
```

---

### Proposal C: CSS Token Synchronization in `CustomCursor.jsx`
Switch the cursor border style from a hardcoded color to a CSS design token variable.

#### Before -> After Design:
```css
/* CustomCursor.jsx (Before - Line 170) */
.custom-cursor-ring {
  border: 1.5px solid rgba(17, 24, 39, 0.22);
}
```

```css
/* CustomCursor.jsx (After - Line 170) */
.custom-cursor-ring {
  border: 1.5px solid var(--border-color);
  opacity: 0.85; /* Soften the token border slightly for aesthetics */
}
```
*Rationale*: `var(--border-color)` is already mapped in `index.css` to change from `rgba(17, 24, 39, 0.08)` (light mode) to `rgba(243, 244, 246, 0.08)` (dark mode). Utilizing it ensures automatic responsiveness to theme toggles without passing props.

---

## 5. Verification Protocol

To verify the theme state initialization, class/attribute toggling, and propagation, use the following procedures:

1. **Verify E2E Coverage**: Check `/tests/e2e/theme-toggle.spec.js` for unit and integration assertions:
   - Run `npx playwright test theme-toggle.spec.js` to execute isolation and integration tests.
   - Run `npx playwright test cross-feature.spec.js` to verify interaction behavior.
2. **Verify FOUC Prevention**:
   - Inspect `/index.html` to confirm the head script blocking logic runs prior to parser completion.
3. **Verify Canvas Adaptations**:
   - Scroll to the "Skills" and "Hors-Piste" sections. Toggle the theme button and verify visual particle color updates instantly in `AntigravityCanvas`.
   - Verify `OrganicCanvas` properly transitions grid line opacities under light and dark backgrounds.
4. **Verify Storage and Cross-Tab Events**:
   - Open the portfolio in two adjacent windows. Toggle theme in Window A and verify Window B changes theme instantly via storage event listeners.
