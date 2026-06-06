import React, { useEffect, useRef } from 'react';

const OrganicCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
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

    // Rendu de la grille animée
    const drawMesh = () => {
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
      ctx.strokeStyle = 'rgba(17, 24, 39, 0.035)'; // Very subtle dark lines

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

      animationFrameId = requestAnimationFrame(drawMesh);
    };

    drawMesh();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
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
  );
};

export default OrganicCanvas;
