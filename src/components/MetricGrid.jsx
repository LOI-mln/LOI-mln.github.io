import React, { useState, useEffect } from 'react';
import useSpotlight from '../hooks/useSpotlight';
import { GraduationCap, Code, Cpu, Building2, MapPin, Layers, Users, Calendar, FileText } from 'lucide-react';

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
      className="glass-panel spotlight-card metric-morph-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
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
        border: isHovered ? '1px solid rgba(227, 93, 59, 0.35)' : '1px solid var(--border-color)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(227, 93, 59, 0.06)' : 'none',
        transition: 'transform var(--duration-fast) var(--ease-out), border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)',
      }}
    >
      {/* Effet de lumière spotlight */}
      <div
        className="spotlight-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          background: 'radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), rgba(227, 93, 59, 0.08), transparent)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity var(--duration-fast) var(--ease-out)',
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
          transition: 'transform var(--duration-normal) var(--ease-out)',
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
          transform: isHovered ? 'translateY(-6px) scale(0.98)' : 'translateY(0) scale(1)',
          transition: 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out)',
          pointerEvents: isHovered ? 'none' : 'auto',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.05em',
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
          transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.98)',
          transition: 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out)',
          pointerEvents: isHovered ? 'auto' : 'none',
          zIndex: 3,
        }}
      >
        {/* En-tête compact de la carte */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.4rem',
                fontWeight: 700,
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
        </div>

        {/* Détails visuels spécifiques */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', marginTop: '8px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {m.details.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(227, 93, 59, 0.08)', color: 'var(--accent)', flexShrink: 0 }}>
                  <Icon size={11} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricGrid = () => {
  const containerRef = useSpotlight();

  const metrics = [
    {
      id: 'alternance',
      value: 1,
      suffix: ' an',
      label: "D'ALTERNANCE",
      sub: 'Ceva Santé Animale · depuis sept. 2026',
      startValue: 0,
      isFloat: false,
      details: [
        { icon: Building2, label: 'Entreprise', value: 'Ceva Santé Animale' },
        { icon: Code, label: 'Poste', value: 'Développeur logiciel' },
        { icon: MapPin, label: 'Lieu', value: 'Libourne' },
      ],
    },
    {
      id: 'production',
      value: 1,
      suffix: '',
      label: 'APPLI EN PRODUCTION',
      sub: 'Unilim EDT · IUT du Limousin',
      startValue: 0,
      isFloat: false,
      details: [
        { icon: Cpu, label: 'Solveur', value: 'OR-Tools CP-SAT' },
        { icon: Layers, label: 'Stack', value: 'Laravel 11 · Vue 3' },
        { icon: Users, label: 'Équipe', value: '4 développeurs' },
      ],
    },
    {
      id: 'recherche',
      value: 3,
      suffix: ' mois',
      label: 'DE RECHERCHE EN ÉCOSSE',
      sub: 'Erasmus+ · Robert Gordon University',
      startValue: 0,
      isFloat: false,
      details: [
        { icon: GraduationCap, label: 'Labo', value: 'RGU, Aberdeen' },
        { icon: Calendar, label: 'Période', value: 'Avril – Juin 2026' },
        { icon: FileText, label: 'Résultat', value: 'Papier en publication' },
      ],
    },
  ];

  return (
    <>
      {/* Styles globaux injectés pour les états réactifs des cartes */}
      <style dangerouslySetInnerHTML={{ __html: `
        .metric-morph-card {
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          cursor: pointer;
        }

        .metric-morph-card:active {
          transform: scale(0.97) translateY(0) !important;
          transition-duration: 80ms !important;
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
