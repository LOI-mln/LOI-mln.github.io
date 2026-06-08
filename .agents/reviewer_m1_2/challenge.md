## Challenge Summary

**Overall risk assessment**: MEDIUM

## Challenges

### [High] Challenge 1: OrganicCanvas continues animation loop in background tabs on legacy/non-standard browsers
- Assumption challenged: Relying on the browser's native requestAnimationFrame throttling for background tabs is sufficient.
- Attack scenario: On some browsers or webviews, requestAnimationFrame is not fully throttled when the tab is hidden, leading to battery and CPU consumption while the portfolio is not active.
- Blast radius: High resource usage when backgrounded.
- Mitigation: Explicitly add a `visibilitychange` listener to `OrganicCanvas.jsx` to stop the loop when the page visibility changes, just like in `AntigravityCanvas.jsx`.

### [Medium] Challenge 2: Performance bottleneck on low-end devices during concurrent scrolling
- Assumption challenged: Processing 784 coordinates with multiple Math functions (sin, cos, hypot) 60 times per second is cheap.
- Attack scenario: When scrolling fast, CPU usage spikes as the grid coordinates deform under mouse/scroll interaction, leading to scroll lag on low-end devices.
- Blast radius: Scroll stuttering.
- Mitigation: Implement mobile/device detection to reduce rows/cols to 14x14 dynamically, or throttle/cache calculations.

### [Low] Challenge 3: Visual flickering during resize
- Assumption challenged: Re-initializing particles is the best resize handling strategy.
- Attack scenario: Resizing the browser window resets particle positions, creating a jarring jump.
- Blast radius: Minor visual UX degradation.
- Mitigation: Scale coordinates on resize instead of regenerating.

## Stress Test Results

- Multi-tab test → OrganicCanvas might continue animating in background → Predicted behavior: resource usage stays high in background tabs if browser doesn't throttle -> FAIL
- Window resizing → AntigravityCanvas resets and regenerates particles → Actual behavior: particles flicker and jump to new coordinates -> FAIL

## Unchallenged Areas

- Core React rendering lifecycle — reason not challenged: standard React patterns are followed.
