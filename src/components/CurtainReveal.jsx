import React, { useRef, useEffect, useState } from 'react';

const CurtainReveal = () => {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const contentRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Activer sur les ordinateurs pour de meilleures performances
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const content = contentRef.current;

    if (!section || !left || !right) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrollY = -rect.top; // Position de défilement relative
      const maxScroll = sectionHeight - window.innerHeight;

      if (maxScroll <= 0) return;

      // Calcul de la progression de 0 à 1
      const rawProgress = scrollY / maxScroll;
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Déplacement 3D des rideaux
      left.style.transform = `translate3d(${-progress * 100}%, 0, 0)`;
      right.style.transform = `translate3d(${progress * 100}%, 0, 0)`;

      // Animation du contenu révélé
      if (content) {
        content.style.opacity = Math.max(0.1, progress * 1.2);
        content.style.transform = `scale(${0.9 + progress * 0.1})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <section ref={sectionRef} className="curtain-container">
      <div className="curtain-sticky-wrapper">
        {/* Contenu révélé */}
        <div ref={contentRef} className="curtain-reveal-content">
          <span className="organic-badge" style={{ marginBottom: '16px', color: '#ff9f1c', background: 'rgba(255, 159, 28, 0.08)' }}>
            COLLECTION EXCLUSIVE
          </span>
          <h3 className="curtain-reveal-h3">
            SÉLECTION DE <span className="accent-glow-text" style={{ padding: '0 0.05em' }}>PROJETS</span>
          </h3>
          <p className="curtain-reveal-p">
            Découvrez quatre réalisations majeures conçues avec rigueur académique, 
            performance système et intégration d'intelligence artificielle.
          </p>
          <div className="curtain-mouse-scroll">
            <span className="scroll-wheel" />
            <span className="scroll-text">Continuez à défiler pour ouvrir</span>
          </div>
        </div>

        {/* Rideau gauche */}
        <div ref={leftRef} className="curtain-panel curtain-left">
          <div className="curtain-panel-inner">
            <h2 className="curtain-text">SHOW</h2>
          </div>
        </div>

        {/* Rideau droit */}
        <div ref={rightRef} className="curtain-panel curtain-right">
          <div className="curtain-panel-inner">
            <h2 className="curtain-text">CASE</h2>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .curtain-container {
          position: relative;
          height: 220vh; /* Ligne temporelle du défilement */
          background-color: var(--bg-secondary);
        }

        .curtain-sticky-wrapper {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #07080b; /* Couleur de fond */
          z-index: 10;
        }

        /* Styles communs des rideaux */
        .curtain-panel {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          background-color: var(--bg-secondary);
          z-index: 3;
          display: flex;
          align-items: center;
          overflow: hidden;
          will-change: transform;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.12);
        }

        .curtain-left {
          left: 0;
          border-right: 1px solid var(--border-color);
        }

        .curtain-right {
          right: 0;
          border-left: 1px solid var(--border-color);
        }

        /* Centrage du texte */
        .curtain-left .curtain-panel-inner {
          position: absolute;
          right: 0;
          width: 200%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-right: 50%; /* Centrage à gauche */
        }

        .curtain-right .curtain-panel-inner {
          position: absolute;
          left: 0;
          width: 200%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 50%; /* Centrage à droite */
        }

        .curtain-text {
          font-family: var(--font-title);
          font-size: clamp(3rem, 10vw, 8.5rem);
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0;
          user-select: none;
        }

        /* Styles du contenu révélé */
        .curtain-reveal-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 24px;
          background: radial-gradient(circle at center, rgba(255, 159, 28, 0.04) 0%, rgba(7, 8, 11, 0) 70%);
          will-change: transform, opacity;
        }

        .curtain-reveal-h3 {
          font-family: var(--font-title);
          font-size: clamp(2rem, 5vw, 3.8rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 10px 0;
        }

        .curtain-reveal-p {
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.55);
          max-width: 58ch;
          line-height: 1.6;
          margin: 12px 0 32px 0;
        }

        /* Indicateur de défilement souris */
        .curtain-mouse-scroll {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .scroll-wheel {
          width: 20px;
          height: 32px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-radius: 20px;
          position: relative;
        }

        .scroll-wheel::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 50%;
          width: 4px;
          height: 6px;
          background-color: #ff9f1c;
          border-radius: 50%;
          transform: translateX(-50%);
          animation: wheelScroll 1.8s infinite ease-in-out;
        }

        @keyframes wheelScroll {
          0% { top: 6px; opacity: 0; }
          30% { opacity: 1; }
          100% { top: 16px; opacity: 0; }
        }

        .scroll-text {
          font-family: var(--font-subtitle);
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}} />
    </section>
  );
};

export default CurtainReveal;
