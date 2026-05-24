import React, { useState, useEffect } from 'react';
import useSpotlight from '../hooks/useSpotlight';

// Assistant d'animation de comptage
const AnimatedNumber = ({ value, duration = 2000, start = 0, isFloat = false }) => {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    let startTime = null;
    let animationFrameId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Progression quadratique adoucie
      const easeProgress = progress * (2 - progress);
      const val = start + easeProgress * (value - start);
      
      if (isFloat) {
        setCurrent(parseFloat(val.toFixed(1)));
      } else {
        setCurrent(Math.floor(val));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration, start, isFloat]);

  return <span>{isFloat ? current.toFixed(1) : current.toLocaleString('fr-FR')}</span>;
};

const MetricGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useSpotlight();

  const metrics = [
    {
      id: 'projects',
      value: 42,
      suffix: '+',
      label: 'PROJETS BUILT',
      sub: 'Labo, académique & perso',
      startValue: 0,
      isFloat: false,
      details: [
        { label: 'Dépôts GitHub publics', val: '14' },
        { label: 'Projets académiques', val: '18' },
        { label: 'Homelab & infrastructure', val: '10' }
      ]
    },
    {
      id: 'loc',
      value: 237960,
      suffix: '',
      label: 'LINES OF CODE',
      sub: 'Python, PHP, Web, Java, Kotlin',
      startValue: 210000, // Valeur de départ pour l'animation
      isFloat: false,
      badge: 'GH.LIVE',
      details: [
        { label: '🐍 Python (Data & Scripting)', val: '8,86 MB (93,1%)' },
        { label: '🐘 PHP & Hack (M-Play/Web)', val: '331 KB (3,5%)' },
        { label: '🌐 Web (JS, CSS, HTML)', val: '242 KB (2,5%)' },
        { label: '☕ Kotlin & Java (Mobile/App)', val: '64 KB (0,7%)' }
      ]
    },
    {
      id: 'latency',
      value: 0.4,
      suffix: 's',
      label: 'LATENCY AVG',
      sub: 'Optimisation FFmpeg & CDN',
      startValue: 0.0,
      isFloat: true,
      details: [
        { label: 'Traitement FFmpeg local', val: '~0.3s' },
        { label: 'Cloudflare Edge CDN', val: '~0.4s' },
        { label: 'Temps de réponse cache', val: '~0.05s' }
      ]
    },
    {
      id: 'uptime',
      value: 99.9,
      suffix: '%',
      label: 'UPTIME SCORE',
      sub: 'Infrastructure Proxmox',
      startValue: 90.0,
      isFloat: true,
      details: [
        { label: 'Nœuds Proxmox HA', val: '3 physiques' },
        { label: 'Conteneurs Docker Swarm', val: '12+ actifs' },
        { label: 'Proxy inverse & SSL', val: 'Failover actif' }
      ]
    }
  ];

  return (
    <div
      ref={containerRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        width: '100%',
        marginTop: '60px',
      }}
    >
      {metrics.map((m, i) => {
        const isHovered = hoveredIndex === i;
        return (
          <div
            key={m.label}
            className="glass-panel spotlight-card"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              padding: '30px 24px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              height: '185px',
              background: 'rgba(255, 255, 255, 0.45)',
              border: isHovered ? '1px solid rgba(255, 159, 28, 0.35)' : '1px solid var(--border-color)',
              transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: isHovered ? '0 20px 40px rgba(255, 159, 28, 0.05)' : 'none',
              transition: 'var(--transition-smooth)',
            }}
          >
            {/* Effet de lumière spotlight */}
            <div
              className="spotlight-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px',
                background: 'radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), rgba(255, 159, 28, 0.08), transparent)',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
            {/* Barre d'accentuation à gauche */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: '20%',
                height: '60%',
                width: '4px',
                background: 'var(--accent-gradient)',
                borderRadius: '0 4px 4px 0',
                transition: 'var(--transition-smooth)',
                transform: isHovered ? 'scaleY(1.3)' : 'scaleY(1)',
              }}
            />

            {/* Badge clignotant pour les données en direct */}
            {m.badge && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-title)',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  background: 'rgba(255, 159, 28, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 159, 28, 0.2)',
                  zIndex: 2,
                }}
              >
                <span
                  className="pulse-dot"
                  style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#ff9f1c',
                  }}
                />
                {m.badge}
              </div>
            )}

            {/* Zone de contenu principal */}
            <div
              style={{
                transform: isHovered ? 'translateY(-20px)' : 'translateY(0)',
                opacity: isHovered ? 0.08 : 1,
                transition: 'var(--transition-smooth)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                <AnimatedNumber
                  value={m.value}
                  start={m.startValue}
                  isFloat={m.isFloat}
                />
                <span style={{ color: 'var(--accent)', marginLeft: '2px' }}>{m.suffix}</span>
              </span>
              
              <span
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.08em',
                  marginTop: '8px',
                }}
              >
                {m.label}
              </span>
              
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  lineHeight: 1.3,
                }}
              >
                {m.sub}
              </span>
            </div>

            {/* Tiroir d'informations détaillées au survol */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                padding: '24px',
                background: 'linear-gradient(to top, rgba(255,255,255,0.95) 75%, rgba(255,255,255,0.85))',
                transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                opacity: isHovered ? 1 : 0,
                transition: 'var(--transition-smooth)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                pointerEvents: isHovered ? 'auto' : 'none',
                borderTop: '1px solid rgba(17, 24, 39, 0.05)',
                borderRadius: '0 0 24px 24px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(255, 159, 28, 0.15)',
                  paddingBottom: '4px',
                  marginBottom: '2px',
                }}
              >
                Rapport détaillé
              </span>
              {m.details.map((d, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{d.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-title)' }}>
                    {d.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricGrid;
