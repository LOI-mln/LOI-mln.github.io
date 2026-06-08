import React, { useEffect, useRef } from 'react';

const OrganicCanvas = ({ mode = 'light' }) => {
  const canvasRef = useRef(null);
  const sentinelRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 });
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sentinel = sentinelRef.current;
    if (!canvas || !sentinel) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let isIntersecting = false;
    let isPageVisible = document.visibilityState === 'visible';
    let isMobileMenuOpen = false;
    let isAnimating = false;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let devicePixelRatio = window.devicePixelRatio || 1;

    // Adapter la résolution pour les écrans Retina
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    // Suivi de la souris
    const handleMouseMove = (e) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.tx = -1000;
      mouseRef.current.ty = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Configuration de la grille
    const rows = 28;
    const cols = 28;
    let time = 0;
    let themeTransition = modeRef.current === 'dark' ? 1 : 0;

    // Rendu de la grille animée
    const drawMesh = () => {
      if (!isAnimating) return;

      const targetTheme = modeRef.current === 'dark' ? 1 : 0;
      themeTransition += (targetTheme - themeTransition) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Interpolation fluide de la souris
      const mouse = mouseRef.current;
      if (mouse.tx === -1000) {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      } else {
        if (mouse.x === -1000) {
          mouse.x = mouse.tx;
          mouse.y = mouse.ty;
        } else {
          mouse.x += (mouse.tx - mouse.x) * 0.1;
          mouse.y += (mouse.ty - mouse.y) * 0.1;
        }
      }

      time += 0.003;

      // Calculer les positions de la grille
      const grid = [];

      for (let r = 0; r <= rows; r++) {
        grid[r] = [];
        for (let c = 0; c <= cols; c++) {
          // Position de base
          const baseX = (width / cols) * c;
          const baseY = (height / rows) * r;

          // Calcul des vagues pour le mouvement organique
          const waveX =
            Math.sin(c * 0.15 + time * 2) * 20 +
            Math.cos(r * 0.1 + time * 1.5) * 15;
          const waveY =
            Math.cos(c * 0.1 + time * 2.5) * 25 +
            Math.sin(r * 0.15 + time * 1) * 15;

          let posX = baseX + waveX;
          let posY = baseY + waveY;

          // Effet de déformation sous la souris
          if (mouse.x !== -1000) {
            const dx = posX - mouse.x;
            const dy = posY - mouse.y;
            const dist = Math.hypot(dx, dy);
            const maxDist = 280;

            if (dist < maxDist) {
              // Calcul de la force selon la distance
              const force = (1 - dist / maxDist) ** 2;
              const angle = Math.atan2(dy, dx);
              
              // Repousser légèrement les points
              const push = force * 60;
              posX += Math.cos(angle) * push;
              posY += Math.sin(angle) * push;
            }
          }

          grid[r][c] = { x: posX, y: posY };
        }
      }

      // Rendu des lignes de la grille
      ctx.lineWidth = 0.6;
      
      const lightR = 17, lightG = 24, lightB = 39;
      const darkR = 255, darkG = 255, darkB = 255;
      
      const r = lightR + (darkR - lightR) * themeTransition;
      const g = lightG + (darkG - lightG) * themeTransition;
      const b = lightB + (darkB - lightB) * themeTransition;
      
      ctx.strokeStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.035)`;

      // Lignes horizontales
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const pt = grid[r][c];
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // Lignes verticales
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const pt = grid[r][c];
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // Points lumineux à proximité du curseur
      if (mouse.x !== -1000) {
        ctx.fillStyle = '#e35d3b'; // Amber accent for glowing intersection points
        for (let r = 0; r <= rows; r += 2) {
          for (let c = 0; c <= cols; c += 2) {
            const pt = grid[r][c];
            const dist = Math.hypot(pt.x - mouse.x, pt.y - mouse.y);
            if (dist < 150) {
              const opacity = (1 - dist / 150) * 0.6;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2 + opacity * 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(227, 93, 59, ${opacity})`;
              ctx.fill();
            }
          }
        }
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(drawMesh);
    };

    const updateAnimationState = (newIntersecting, newPageVisible, newMobileMenuOpen) => {
      if (newIntersecting !== undefined) isIntersecting = newIntersecting;
      if (newPageVisible !== undefined) isPageVisible = newPageVisible;
      if (newMobileMenuOpen !== undefined) isMobileMenuOpen = newMobileMenuOpen;
      const shouldAnimate = isIntersecting && isPageVisible && !isMobileMenuOpen;

      if (shouldAnimate && !isAnimating) {
        console.log('[OrganicCanvas] STARTING/RESUMING RENDER LOOP');
        isAnimating = true;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        drawMesh();
      } else if (!shouldAnimate && isAnimating) {
        console.log('[OrganicCanvas] PAUSING RENDER LOOP');
        isAnimating = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    };

    const handleVisibilityChange = () => {
      updateAnimationState(undefined, document.visibilityState === 'visible', undefined);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleMobileMenuToggle = (e) => {
      updateAnimationState(undefined, undefined, e.detail ? e.detail.open : false);
    };
    window.addEventListener('mobile-menu-toggle', handleMobileMenuToggle);

    const observer = new IntersectionObserver(([entry]) => {
      updateAnimationState(entry.isIntersecting, undefined, undefined);
    }, { threshold: 0 });

    observer.observe(sentinel);

    return () => {
      console.log('[OrganicCanvas] UNMOUNTED');
      isAnimating = false;
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mobile-menu-toggle', handleMobileMenuToggle);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={sentinelRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '250vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default OrganicCanvas;
