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

  useEffect(() => {
    // Log du montage et des propriétés reçues
    console.log(`[AntigravityCanvas] MOUNTED - Mode: ${mode}, Scheme: ${colorScheme}, Density: ${density}, ClusterRight: ${clusterRight}`);
    
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
    let animationFrameId;
    let isAnimating = true;
    
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

    // Configurer des opacités robustes pour assurer une excellente visibilité (contraste accru en thème clair)
    const particleAlpha = mode === 'dark' ? 0.85 : 0.38;
    const haloAlpha = mode === 'dark' ? 0.22 : 0.10;
    const lineBaseOpacity = mode === 'dark' ? 0.28 : 0.22;

    // Déclarer les nuances néons vibrantes
    const neonColors = [
      `hsla(200, 100%, 60%, ${particleAlpha})`, // Bleu néon
      `hsla(140, 100%, 55%, ${particleAlpha})`, // Vert électrique
      `hsla(360, 100%, 60%, ${particleAlpha})`, // Rouge corail
      `hsla(36, 100%, 55%, ${particleAlpha})`,  // Jaune ambre
      `hsla(270, 100%, 65%, ${particleAlpha})`  // Violet éclatant
    ];

    // Déclarer la palette ambrée chaude
    const amberColors = [
      `hsla(36, 100%, 55%, ${particleAlpha})`,  // Ambre chaleureux
      `hsla(24, 100%, 50%, ${particleAlpha})`,  // Orange profond
      `hsla(45, 100%, 58%, ${particleAlpha})`   // Lueur d'or
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

        // Diamètre accru pour assurer une visibilité parfaite sur fond blanc
        this.radius = mode === 'dark' 
          ? (Math.random() * 1.5 + 1.2)   // diamètre 2.4 à 5.4 px
          : (Math.random() * 2.2 + 1.8);  // diamètre 3.6 à 8.0 px

        // Assigner la couleur selon le profil sélectionné
        const palette = colorScheme === 'neon' ? neonColors : amberColors;
        this.color = palette[Math.floor(Math.random() * palette.length)];

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
      draw() {
        const vx = this.x - this.prevX;
        const vy = this.y - this.prevY;
        const velocity = Math.hypot(vx, vy);

        if (velocityStretch && velocity > 0.8) {
          // Dessiner un faisceau étiré lors des pics de vitesse
          ctx.beginPath();
          ctx.moveTo(this.x - vx * 1.5, this.y - vy * 1.5);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.radius * 2;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          // Rendu sphérique classique
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();

          // Subtil halo lumineux sous la forme d'un second disque large et transparent
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = this.color.replace(`${particleAlpha}`, `${haloAlpha}`);
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
    resize();

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

    // Boucle d'animation principale par requestAnimationFrame
    const render = () => {
      if (!isAnimating) return;

      // Logguer les 3 premières frames pour s'assurer que la boucle tourne
      if (frameDebugCount < 3) {
        console.log(`[AntigravityCanvas] FRAME LOOP ACTIVE - Frame #${frameDebugCount}, Rendu en cours de ${particles.length} particules.`);
        frameDebugCount++;
      }

      ctx.clearRect(0, 0, width, height);

      // Mettre à jour et dessiner les poussières
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
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
            const opacity = (1 - dist / connectionDistance) * lineBaseOpacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Couleur de trait : Blanche en sombre, Gris charbon en clair/néon (blueprint), Ambrée en clair/ambre
            ctx.strokeStyle = mode === 'dark' 
              ? `rgba(255, 255, 255, ${opacity})`
              : (colorScheme === 'neon'
                  ? `rgba(17, 24, 39, ${opacity * 0.45})`
                  : `rgba(255, 159, 28, ${opacity * 0.8})`);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Lancer immédiatement la boucle d'animation
    console.log('[AntigravityCanvas] STARTING RENDER LOOP');
    render();

    // Couper et détruire les références au démontage et logguer la fermeture
    return () => {
      console.log(`[AntigravityCanvas] UNMOUNTED - Mode: ${mode}`);
      isAnimating = false;
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, colorScheme, density, clusterRight, velocityStretch]);

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
