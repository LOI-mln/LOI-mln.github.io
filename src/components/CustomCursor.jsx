import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const hudRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isClickedRef = useRef(false);
  const hoveredElRef = useRef(null);

  useEffect(() => {
    // Désactiver le curseur sur les écrans tactiles
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    
    if (isTouch || !hasFinePointer) {
      return;
    }

    setEnabled(true);

    const mouse = { x: -100, y: -100, tx: -100, ty: -100 };
    let currentScale = 1.0;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    const handleMouseDown = () => {
      isClickedRef.current = true;
    };
    
    const handleMouseUp = () => {
      isClickedRef.current = false;
    };

    const handleMouseLeaveViewport = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const handleMouseEnterViewport = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveViewport);
    document.addEventListener('mouseenter', handleMouseEnterViewport);

    // Gérer le survol des éléments interactifs
    const addHoverClass = (e) => {
      isHoveredRef.current = true;
      hoveredElRef.current = e ? e.currentTarget : null;
      if (ringRef.current) ringRef.current.classList.add('cursor-hovered');
      if (hudRef.current) hudRef.current.classList.add('hud-visible');
    };
    
    const removeHoverClass = () => {
      isHoveredRef.current = false;
      hoveredElRef.current = null;
      if (ringRef.current) ringRef.current.classList.remove('cursor-hovered');
      if (hudRef.current) hudRef.current.classList.remove('hud-visible');
    };

    const updateHoverListeners = () => {
      const targets = document.querySelectorAll('a, button, [role="button"], .interactive-card, input, textarea, .sk-node');
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', addHoverClass);
        target.removeEventListener('mouseleave', removeHoverClass);
        target.addEventListener('mouseenter', addHoverClass);
        target.addEventListener('mouseleave', removeHoverClass);
      });
    };

    // Liaison initiale des écouteurs
    updateHoverListeners();

    // Observer les modifications dynamiques du DOM
    const observer = new MutationObserver(() => {
      if (hoveredElRef.current && !document.body.contains(hoveredElRef.current)) {
        removeHoverClass();
      }
      updateHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Boucle d'animation fluide (interpolation)
    const renderCursor = () => {
      if (mouse.x === -100) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      } else {
        // Interpolation pour le suivi de l'anneau extérieur
        mouse.x += (mouse.tx - mouse.x) * 0.15;
        mouse.y += (mouse.ty - mouse.y) * 0.15;
      }

      // Calculer l'échelle cible selon l'état
      let targetScale = 1.0;
      if (isClickedRef.current) {
        targetScale = 0.75;
      } else if (isHoveredRef.current) {
        targetScale = 1.625; // 52px / 32px
      }

      // Appliquer l'échelle de façon fluide
      currentScale += (targetScale - currentScale) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.tx}px, ${mouse.ty}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) scale(${currentScale})`;
      }
      if (hudRef.current && isHoveredRef.current) {
        hudRef.current.textContent = `SYS.TRK // X:${Math.round(mouse.tx)} Y:${Math.round(mouse.ty)}`;
      }

      animationFrameId = requestAnimationFrame(renderCursor);
    };

    renderCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveViewport);
      document.removeEventListener('mouseenter', handleMouseEnterViewport);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Point central */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
      />

      {/* Anneau extérieur */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
      >
        <span
          ref={hudRef}
          className="custom-cursor-hud"
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Masquer le curseur par défaut */
        @media (hover: hover) and (pointer: fine) {
          body, a, button, [role="button"], input, textarea, select {
            cursor: none !important;
          }
        }

        .custom-cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background-color: var(--accent);
          border-radius: 50%;
          transform: translate3d(-100px, -100px, 0);
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          margin-left: -4px;
          margin-top: -4px;
          transition: opacity 0.15s ease;
        }

        .custom-cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          border: 1.5px solid var(--border-color);
          border-radius: 50%;
          transform: translate3d(-100px, -100px, 0) scale(1);
          pointer-events: none;
          z-index: 99998;
          will-change: transform;
          margin-left: -16px;
          margin-top: -16px;
          background-color: transparent;
          transform-origin: center center;
          transition: border 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.15s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* État survolé */
        .custom-cursor-ring.cursor-hovered {
          border: 1.5px solid var(--accent);
          background-color: var(--accent-light);
        }

        /* Coordonnées affichées */
        .custom-cursor-hud {
          position: absolute;
          top: 60px;
          font-family: monospace;
          font-size: 8px;
          font-weight: 700;
          color: var(--accent);
          white-space: nowrap;
          letter-spacing: 0.05em;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        .custom-cursor-hud.hud-visible {
          opacity: 1;
        }
      `}} />
    </>
  );
};

export default CustomCursor;
