# Theme Switch UI & State Propagation — Mode Propagation to Canvas Components

This report presents our analysis of mode (light/dark) propagation to canvas-based background animations, specifically looking at `src/components/AntigravityCanvas.jsx` and its instantiations, along with additional layout observations regarding `src/components/OrganicCanvas.jsx`.

---

## 1. Executive Summary

- **Theme State Architecture**: The theme state (`theme` having value `'light'` or `'dark'`) resides in `src/App.jsx`. It is synced to LocalStorage, system preferences (`prefers-color-scheme`), and the DOM element (`document.documentElement`).
- **AntigravityCanvas Instantiations**: The component is instantiated in two places:
  1. **`src/App.jsx`** (within the "Hors-Piste" / Passions section, lines 299–305)
  2. **`src/sections/Skills.jsx`** (wrapped by `SkillsMesh` component, lines 8–14)
- **Current Mode Propagation**: In both locations, `mode={theme}` (or its wrapper equivalent) is correctly passed as a prop.
- **The Core Issue**:
  - `mode` is a dependency of `AntigravityCanvas`'s main `useEffect` hook.
  - When the theme toggles, the entire animation loop is destroyed (`cancelAnimationFrame`), the event listeners are removed, the IntersectionObserver is disconnected, and the canvas is fully re-initialized.
  - This causes all particles to be destroyed and randomized again, leading to an **abrupt visual jump** where particles pop and reappear in new locations.
- **Proposed Solution**: 
  - Store the `mode` in a React `useRef` to allow the canvas to read the latest mode without tearing down the `useEffect`.
  - Store a static normalized size factor (`sizeFactor`) and HSL colors inside particle instances, rather than pre-rendered strings and sizes.
  - Interpolate rendering parameters (opacities, sizes, line colors) dynamically inside the rendering loop (`render()`) using a simple numeric theme transition coefficient (`themeTransition`) for a smooth morphing animation.
- **Secondary Discovery (`OrganicCanvas.jsx`)**:
  - `OrganicCanvas` is instantiated in `src/App.jsx` but does not receive the `mode` prop.
  - It uses a hardcoded, semi-transparent dark stroke color (`rgba(17, 24, 39, 0.035)`), which has poor contrast in dark mode.
  - We recommend propagating `mode` to `OrganicCanvas` and adapting its grid stroke color.

---

## 2. In-Depth Flow & Trace

### A. Prop Propagation Chain
The path from user toggle to canvas instantiation is as follows:

```
[ App.jsx ]
   ├── state: const [theme, setTheme] = useState(...)
   │
   ├── Instantiation 1: <AntigravityCanvas mode={theme} ... /> (Passions Section)
   │
   └── Instantiation 2: <Skills theme={theme} />
           │
           └── [ Skills.jsx ]
                  └── <SkillsMesh mode={theme} />
                         │
                         └── <AntigravityCanvas mode={mode} ... />
```

### B. Current Canvas Behavior on Mode Change
When the `mode` prop changes, the `useEffect` cleanup runs:
1. `isAnimating` is set to `false`.
2. `observer.disconnect()` removes the Intersection Observer.
3. Event listeners (`resize`, `mousemove`, `mouseleave`, `visibilitychange`) are unbound.
4. `cancelAnimationFrame` stops the animation loop.
5. The `useEffect` starts executing again:
   - Registers new event listeners and observers.
   - Triggers `resize()` -> `initParticles()`.
   - `initParticles` recreates all particle objects at new randomized positions.

---

## 3. Recommended Optimization Strategies

To achieve a seamless transition without resets, we propose the following refactoring in `AntigravityCanvas.jsx`:

### 1. Decouple `mode` from the Main React Lifecycle
Use a separate effect to sync the `mode` prop to a `modeRef`. Remove `mode` from the main canvas `useEffect` dependency array.

```javascript
const modeRef = useRef(mode);

useEffect(() => {
  modeRef.current = mode;
}, [mode]);

// Main canvas effect
useEffect(() => {
  // ... loop logic ...
}, [colorScheme, density, clusterRight, velocityStretch]);
```

### 2. Track Theme Transition Progress
Maintain a float parameter `themeTransition` (0 = Light, 1 = Dark) inside the canvas loop that eases towards the target theme state:

```javascript
let themeTransition = modeRef.current === 'dark' ? 1 : 0;

const render = () => {
  if (!isAnimating) return;

  const targetTheme = modeRef.current === 'dark' ? 1 : 0;
  themeTransition += (targetTheme - themeTransition) * 0.08; // smooth easing

  // ... drawing calls passing themeTransition ...
};
```

### 3. Move Particle Initialization to Parametric Representation
Store colors as HSL parts and sizes as a factor `0..1` instead of static computed strings:

```javascript
class Particle {
  constructor() {
    // ... position initialization ...
    this.sizeFactor = Math.random();

    const palette = colorScheme === 'neon'
      ? [
          { h: 200, s: 100, l: 60 }, // Blue
          { h: 140, s: 100, l: 55 }, // Green
          { h: 360, s: 100, l: 60 }, // Red
          { h: 36,  s: 100, l: 55 }, // Yellow/Amber
          { h: 270, s: 100, l: 65 }  // Violet
        ]
      : [
          { h: 36, s: 100, l: 55 },  // Warm Amber
          { h: 24, s: 100, l: 50 },  // Deep Orange
          { h: 45, s: 100, l: 58 }   // Gold
        ];

    const colorConfig = palette[Math.floor(Math.random() * palette.length)];
    this.h = colorConfig.h;
    this.s = colorConfig.s;
    this.l = colorConfig.l;
    
    // ... wobble settings ...
  }

  draw(themeTransition) {
    const vx = this.x - this.prevX;
    const vy = this.y - this.prevY;
    const velocity = Math.hypot(vx, vy);

    // Interpolate alpha, radius range, and halo alpha
    const currentAlpha = 0.38 + (0.85 - 0.38) * themeTransition;
    const currentHaloAlpha = 0.10 + (0.22 - 0.10) * themeTransition;

    const radiusMin = 1.8 + (1.2 - 1.8) * themeTransition;
    const radiusMax = 4.0 + (2.7 - 4.0) * themeTransition;
    const radius = radiusMin + (radiusMax - radiusMin) * this.sizeFactor;

    const colorStr = `hsla(${this.h}, ${this.s}%, ${this.l}%, ${currentAlpha})`;

    if (velocityStretch && velocity > 0.8) {
      ctx.beginPath();
      ctx.moveTo(this.x - vx * 1.5, this.y - vy * 1.5);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = colorStr;
      ctx.lineWidth = radius * 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = colorStr;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x, this.y, radius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.h}, ${this.s}%, ${this.l}%, ${currentHaloAlpha})`;
      ctx.fill();
    }
  }
}
```

### 4. Interpolate Interconnection Line Colors
Modify the line-drawing nested loop in `render()` to interpolate RGB values dynamically:

```javascript
// Line base opacity: light = 0.22, dark = 0.28
const currentLineBaseOpacity = 0.22 + (0.28 - 0.22) * themeTransition;
const opacity = (1 - dist / connectionDistance) * currentLineBaseOpacity;

const darkR = 255, darkG = 255, darkB = 255, darkA = opacity;
let lightR, lightG, lightB, lightA;

if (colorScheme === 'neon') {
  lightR = 17; lightG = 24; lightB = 39; lightA = opacity * 0.45;
} else {
  lightR = 227; lightG = 93; lightB = 59; lightA = opacity * 0.8;
}

const r = lightR + (darkR - lightR) * themeTransition;
const g = lightG + (darkG - lightG) * themeTransition;
const b = lightB + (darkB - lightB) * themeTransition;
const a = lightA + (darkA - lightA) * themeTransition;

ctx.strokeStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
```

---

## 4. Integration with OrganicCanvas

`OrganicCanvas.jsx` renders a dynamic grid overlay under the interface. It currently has a hardcoded dark stroke color:

```javascript
ctx.strokeStyle = 'rgba(17, 24, 39, 0.035)';
```

**Recommendation**:
1. Update `src/App.jsx` line 268 to propagate the theme state:
   ```javascript
   <OrganicCanvas mode={theme} />
   ```
2. In `src/components/OrganicCanvas.jsx`, accept the `mode` prop:
   ```javascript
   const OrganicCanvas = ({ mode = 'light' }) => {
   ```
3. Use a ref to track `mode` in `OrganicCanvas.jsx` to prevent loop restarts on theme toggle:
   ```javascript
   const modeRef = useRef(mode);
   useEffect(() => {
     modeRef.current = mode;
   }, [mode]);
   ```
4. Update the line color based on `modeRef.current` inside the `drawMesh` function:
   ```javascript
   const currentMode = modeRef.current;
   ctx.strokeStyle = currentMode === 'dark' 
     ? 'rgba(255, 255, 255, 0.045)' 
     : 'rgba(17, 24, 39, 0.035)';
   ```
