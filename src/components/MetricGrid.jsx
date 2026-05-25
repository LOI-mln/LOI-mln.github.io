import React, { useState, useEffect } from 'react';
import useSpotlight from '../hooks/useSpotlight';
import { GraduationCap, Server, Code, Zap, Cpu } from 'lucide-react';

// Icône GitHub personnalisée pour éviter les problèmes d'export de lucide-react
const GithubIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

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

// Composant individuel de carte métrique morphique
const MetricCard = ({ m }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="glass-panel spotlight-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '24px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        height: '215px',
        background: 'rgba(255, 255, 255, 0.45)',
        border: isHovered ? '1px solid rgba(255, 159, 28, 0.35)' : '1px solid var(--border-color)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(255, 159, 28, 0.06)' : 'none',
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

      {/* 1. Vue par défaut (Masquée au survol avec fondu) */}
      <div
        style={{
          position: 'absolute',
          inset: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isHovered ? 'none' : 'auto',
          zIndex: 2,
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

      {/* 2. Vue Morphique détaillée (Affichee au survol) */}
      <div
        style={{
          position: 'absolute',
          inset: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isHovered ? 'auto' : 'none',
          zIndex: 3,
        }}
      >
        {/* En-tête compact de la carte */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              {m.isFloat ? m.value.toFixed(1) : m.value.toLocaleString('fr-FR')}
              <span style={{ color: 'var(--accent)' }}>{m.suffix}</span>
            </span>
            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.62rem',
                fontWeight: 800,
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
                marginLeft: '8px',
                textTransform: 'uppercase',
              }}
            >
              {m.label}
            </span>
          </div>

          {/* Badge spécial live */}
          {m.badge && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.58rem',
                fontWeight: 800,
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.05em',
                color: 'var(--accent)',
                background: 'rgba(255, 159, 28, 0.08)',
                padding: '2px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 159, 28, 0.15)',
              }}
            >
              <span className="pulse-badge-dot" />
              {m.badge}
            </div>
          )}
        </div>

        {/* Détails visuels spécifiques */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', marginTop: '8px' }}>
          
          {/* CAS 1 : PROJETS BUILT */}
          {m.id === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(255, 159, 28, 0.08)', color: 'var(--accent)' }}>
                  <GithubIcon size={11} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Dépôts GitHub</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(17, 24, 39, 0.04)', borderRadius: '2px', margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: isHovered ? '38%' : '0%', height: '100%', background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: '16px', textAlign: 'right' }}>17</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(255, 159, 28, 0.08)', color: 'var(--accent)' }}>
                  <GraduationCap size={11} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Académiques</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(17, 24, 39, 0.04)', borderRadius: '2px', margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: isHovered ? '40%' : '0%', height: '100%', background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: '16px', textAlign: 'right' }}>18</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(255, 159, 28, 0.08)', color: 'var(--accent)' }}>
                  <Server size={11} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Homelab & Infra</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(17, 24, 39, 0.04)', borderRadius: '2px', margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: isHovered ? '22%' : '0%', height: '100%', background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: '16px', textAlign: 'right' }}>10</span>
              </div>
            </div>
          )}

          {/* CAS 2 : LIGNES DE CODE (GITHUB STATS) */}
          {m.id === 'loc' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', justifyContent: 'center' }}>
              {/* Barre de distribution GitHub stylisée */}
              <div style={{ display: 'flex', height: '8px', width: '100%', borderRadius: '4px', overflow: 'hidden', marginTop: '2px', marginBottom: '8px', background: 'rgba(17, 24, 39, 0.05)' }}>
                <div style={{ width: isHovered ? '84.54%' : '0%', background: '#3572A5', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' }} />
                <div style={{ width: isHovered ? '9.49%' : '0%', background: '#4F5D95', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }} />
                <div style={{ width: isHovered ? '4.64%' : '0%', background: '#f1e05a', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' }} />
                <div style={{ width: isHovered ? '1.15%' : '0%', background: '#A97BFF', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s' }} />
                <div style={{ width: isHovered ? '0.18%' : '0%', background: '#9ca3af', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' }} />
              </div>
              
              {/* Grille compacte des langages */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', width: '100%', fontSize: '0.68rem', fontFamily: 'var(--font-body)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3572A5' }} />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Python</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>8.86 Mo</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4F5D95' }} />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>PHP & Hack</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>994 Ko</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f1e05a' }} />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Web Frontend</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>485 Ko</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A97BFF' }} />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Java/Kotlin</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>120 Ko</span>
                </div>
              </div>
            </div>
          )}

          {/* CAS 3 : LATENCY AVG */}
          {m.id === 'latency' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}>
                  <Cpu size={11} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>FFmpeg local</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(17, 24, 39, 0.04)', borderRadius: '2px', margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: isHovered ? '60%' : '0%', height: '100%', background: '#10b981', borderRadius: '2px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: '32px', textAlign: 'right' }}>~0.3s</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}>
                  <Zap size={11} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Cloudflare Edge</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(17, 24, 39, 0.04)', borderRadius: '2px', margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: isHovered ? '80%' : '0%', height: '100%', background: '#10b981', borderRadius: '2px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: '32px', textAlign: 'right' }}>~0.4s</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.08)', color: '#06b6d4' }}>
                  <Zap size={11} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Cache CDN</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(17, 24, 39, 0.04)', borderRadius: '2px', margin: '0 8px', overflow: 'hidden' }}>
                  <div style={{ width: isHovered ? '15%' : '0%', height: '100%', background: '#06b6d4', borderRadius: '2px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: '32px', textAlign: 'right' }}>~0.05s</span>
              </div>
            </div>
          )}

          {/* CAS 4 : UPTIME SCORE */}
          {m.id === 'uptime' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)' }}>
                  <span className="pulse-green-dot pulse-green-dot-active" style={{ animationDelay: '0s' }} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Nœuds Proxmox HA</span>
                <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--text-primary)' }}>3 Physiques</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)' }}>
                  <span className="pulse-green-dot pulse-green-dot-active" style={{ animationDelay: '0.6s' }} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Docker Swarm</span>
                <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--text-primary)' }}>12+ Actifs</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)' }}>
                  <span className="pulse-green-dot pulse-green-dot-active" style={{ animationDelay: '1.2s' }} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Reverse Proxy & SSL</span>
                <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.58rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>ACTIVE</span>
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const MetricGrid = () => {
  const containerRef = useSpotlight();

  const metrics = [
    {
      id: 'projects',
      value: 45,
      suffix: '+',
      label: 'PROJETS BUILT',
      sub: 'Labo, académique & perso',
      startValue: 0,
      isFloat: false,
    },
    {
      id: 'loc',
      value: 261490,
      suffix: '',
      label: 'LINES OF CODE',
      sub: 'Python, PHP, Web, Java, Kotlin',
      startValue: 210000,
      isFloat: false,
      badge: 'LIVE.GH',
    },
    {
      id: 'latency',
      value: 0.4,
      suffix: 's',
      label: 'LATENCY AVG',
      sub: 'Optimisation FFmpeg & CDN',
      startValue: 0.0,
      isFloat: true,
    },
    {
      id: 'uptime',
      value: 99.9,
      suffix: '%',
      label: 'UPTIME SCORE',
      sub: 'Infrastructure Proxmox',
      startValue: 90.0,
      isFloat: true,
    }
  ];

  return (
    <>
      {/* Styles globaux injectés pour les animations d'états pulsants et réactifs */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes livePulse {
          0% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        
        @keyframes badgePulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }

        .pulse-green-dot {
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
        }
        
        .pulse-green-dot-active {
          animation: livePulse 2s infinite ease-in-out;
        }

        .pulse-badge-dot {
          width: 6px;
          height: 6px;
          background-color: #ff9f1c;
          border-radius: 50%;
          display: inline-block;
          animation: badgePulse 1.5s infinite ease-in-out;
        }
      `}} />

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
        {metrics.map((m) => (
          <MetricCard key={m.id} m={m} />
        ))}
      </div>
    </>
  );
};

export default MetricGrid;
