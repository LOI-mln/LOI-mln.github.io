import React, { useEffect, useRef } from 'react';

const AntigravityCanvas = ({
  mode = 'light',           // 'light' (fond clair) ou 'dark' (fond sombre)
  colorScheme = 'amber',    // 'amber' (dégradé d'orange chaud) ou 'neon' (multicolore néon)
  density = 'medium',       // 'high' (80 particules), 'medium' (50 particules) ou 'low' (25 particules)
  clusterRight = false,     // Activer la concentration des particules sur le tiers droit
  velocityStretch = true    // Activer l'étirement des particules rapides selon la vitesse
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const modeRef = useRef(mode);

  // Synchro du mode dans une référence pour éviter de recréer la boucle canvas
  useEffect(() => {
    modeRef.current = mode;
    console.log(`[AntigravityCanvas] MODE UPDATED - New Mode: ${mode}`);
  }, [mode]);

  useEffect(() => {
    console.log(`[AntigravityCanvas] MOUNTED/RECONSTRUCTED - Scheme: ${colorScheme}, Density: ${density}, ClusterRight: ${clusterRight}`);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('[AntigravityCanvas] ERROR - canvasRef.current est null !');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('[AntigravityCanvas] ERROR - Impossible de récupérer le contexte 2D !');
      return;
    }

    let particles = [];
    let animationFrameId = null;
    let isIntersecting = false;
    let isPageVisible = document.visibilityState === 'visible';
    let isAnimating = false;
    
    // Mesurer les dimensions physiques du DOM et logguer les valeurs initiales
    let width = canvas.width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.offsetHeight || window.innerHeight;
    let devicePixelRatio = window.devicePixelRatio || 1;

    console.log(`[AntigravityCanvas] SIZE INIT - offsetSize: ${canvas.offsetWidth}x${canvas.offsetHeight}, windowSize: ${window.innerWidth}x${window.innerHeight}, finalDrawingBuffer: ${width}x${height}, DPI: ${devicePixelRatio}`);

    // Déterminer la densité de particules
    const isMobile = window.innerWidth < 768;
    let particleCount = 50;
    if (density === 'high') particleCount = isMobile ? 35 : 80;
    else if (density === 'medium') particleCount = isMobile ? 25 : 50;
    else if (density === 'low') particleCount = isMobile ? 12 : 25;

    const connectionDistance = 110;
    const repulsionRadius = 180;

    const neonPalette = [
      { h: 200, s: 100, l: 60 },
      { h: 140, s: 100, l: 55 },
      { h: 360, s: 100, l: 60 },
      { h: 36,  s: 100, l: 55 },
      { h: 270, s: 100, l: 65 }
    ];

    const amberPalette = [
      { h: 36, s: 100, l: 55 },
      { h: 24, s: 100, l: 50 },
      { h: 45, s: 100, l: 58 }
    ];

    // Recalculer les limites et réinitialiser les points lors d'un redimensionnement
    const resize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      console.log(`[AntigravityCanvas] RESIZED - DrawingBuffer: ${canvas.width}x${canvas.height}, Stylesize: ${canvas.offsetWidth}x${canvas.offsetHeight}`);
      initParticles();
    };

    // Classe individuelle modélisant chaque point stellaire
    class Particle {
      constructor() {
        if (clusterRight) {
          // Centrer 60% des points dans une zone gaussienne sur la droite
          const radius = Math.random() * Math.min(width, height) * 0.28;
          const angle = Math.random() * Math.PI * 2;
          this.baseX = width * 0.72 + Math.cos(angle) * radius;
          this.baseY = height * 0.5 + Math.sin(angle) * radius;
        } else {
          // Répartir uniformément sur toute la grille
          this.baseX = Math.random() * width;
          this.baseY = Math.random() * height;
        }

        this.x = this.baseX;
        this.y = this.baseY;
        this.prevX = this.x;
        this.prevY = this.y;

        this.sizeFactor = Math.random();

        const palette = colorScheme === 'neon' ? neonPalette : amberPalette;
        const colorConfig = palette[Math.floor(Math.random() * palette.length)];
        this.h = colorConfig.h;
        this.s = colorConfig.s;
        this.l = colorConfig.l;

        // Variables du flottement orbital autonome (wobble)
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.015 + 0.005;
        this.wobbleRadius = Math.random() * 12 + 6;
      }

      // Mettre à jour les calculs de cinématique physique
      update() {
        this.prevX = this.x;
        this.prevY = this.y;

        // Incrémenter la rotation sur elle-même
        this.angle += this.speed;

        // Calculer la coordonnée oscillante
        let targetX = this.baseX + Math.cos(this.angle) * this.wobbleRadius;
        let targetY = this.baseY + Math.sin(this.angle) * this.wobbleRadius;

        // Appliquer la répulsion magnétique par rapport au curseur
        const mouse = mouseRef.current;
        if (mouse.x !== -1000) {
          const dx = targetX - mouse.x;
          const dy = targetY - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repulsionRadius) {
            // Force proportionnelle à la proximité
            const force = (repulsionRadius - dist) / repulsionRadius;
            const pushAngle = Math.atan2(dy, dx);
            const pushDistance = force * 70; // Recul maximal de 70px

            targetX += Math.cos(pushAngle) * pushDistance;
            targetY += Math.sin(pushAngle) * pushDistance;
          }
        }

        // Lissage cinématique par amortissement (easing 8%)
        this.x += (targetX - this.x) * 0.08;
        this.y += (targetY - this.y) * 0.08;
      }

      // Rendre le dessin de la particule
      draw(themeTransition) {
        const vx = this.x - this.prevX;
        const vy = this.y - this.prevY;
        const velocity = Math.hypot(vx, vy);

        const currentAlpha = 0.38 + (0.85 - 0.38) * themeTransition;
        const currentHaloAlpha = 0.10 + (0.22 - 0.10) * themeTransition;

        const radiusMin = 1.8 + (1.2 - 1.8) * themeTransition;
        const radiusMax = 4.0 + (2.7 - 4.0) * themeTransition;
        const radius = radiusMin + (radiusMax - radiusMin) * this.sizeFactor;

        const colorStr = `hsla(${this.h}, ${this.s}%, ${this.l}%, ${currentAlpha})`;

        if (velocityStretch && velocity > 0.8) {
          // Dessiner un faisceau étiré lors des pics de vitesse
          ctx.beginPath();
          ctx.moveTo(this.x - vx * 1.5, this.y - vy * 1.5);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = colorStr;
          ctx.lineWidth = radius * 2;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          // Rendu sphérique classique
          ctx.beginPath();
          ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = colorStr;
          ctx.fill();

          // Subtil halo lumineux sous la forme d'un second disque large et transparent
          ctx.beginPath();
          ctx.arc(this.x, this.y, radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${this.h}, ${this.s}%, ${this.l}%, ${currentHaloAlpha})`;
          ctx.fill();
        }
      }
    }

    // Générer toutes les instances de particules et logguer la création
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      console.log(`[AntigravityCanvas] INIT PARTICLES - Crées: ${particles.length} (Cible: ${particleCount})`);
    };

    window.addEventListener('resize', resize);

    // Suivi du curseur relativement aux coordonnées réelles du canvas
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Mettre en place un compteur de frames pour le debuggage de la boucle
    let frameDebugCount = 0;
    let themeTransition = modeRef.current === 'dark' ? 1 : 0;

    // Boucle d'animation principale par requestAnimationFrame
    const render = () => {
      if (!isAnimating) return;

      // Logguer les 3 premières frames pour s'assurer que la boucle tourne
      if (frameDebugCount < 3) {
        console.log(`[AntigravityCanvas] FRAME LOOP ACTIVE - Frame #${frameDebugCount}, Rendu en cours de ${particles.length} particules.`);
        frameDebugCount++;
      }

      const targetTheme = modeRef.current === 'dark' ? 1 : 0;
      themeTransition += (targetTheme - themeTransition) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Mettre à jour et dessiner les poussières
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(themeTransition);
      }

      // Dessiner le filet constellation d'interconnexions
      ctx.lineWidth = 0.65; // Traits légèrement plus prononcés
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const currentLineBaseOpacity = 0.22 + (0.28 - 0.22) * themeTransition;
            const opacity = (1 - dist / connectionDistance) * currentLineBaseOpacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
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
            ctx.stroke();
          }
        }
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    const updateAnimationState = (newIntersecting, newPageVisible, newMobileMenuOpen) => {
      if (newIntersecting !== undefined) isIntersecting = newIntersecting;
      if (newPageVisible !== undefined) isPageVisible = newPageVisible;
      if (newMobileMenuOpen !== undefined) isMobileMenuOpen = newMobileMenuOpen;

      const shouldAnimate = isIntersecting && isPageVisible && !isMobileMenuOpen;

      if (shouldAnimate && !isAnimating) {
        console.log('[AntigravityCanvas] STARTING/RESUMING RENDER LOOP');
        isAnimating = true;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        render();
      } else if (!shouldAnimate && isAnimating) {
        console.log('[AntigravityCanvas] PAUSING RENDER LOOP');
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
      const intersecting = entry.isIntersecting;
      if (intersecting) {
        console.log('[AntigravityCanvas] Visible - Recalculating dimensions');
        resize();
      }
      updateAnimationState(intersecting, undefined, undefined);
    }, { threshold: 0 });

    observer.observe(canvas);

    // Couper et détruire les références au démontage et logguer la fermeture
    return () => {
      console.log(`[AntigravityCanvas] UNMOUNTED - Last Mode: ${modeRef.current}`);
      isAnimating = false;
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mobile-menu-toggle', handleMobileMenuToggle);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [colorScheme, density, clusterRight, velocityStretch]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default AntigravityCanvas;
