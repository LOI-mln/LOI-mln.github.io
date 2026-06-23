import React, { useState, useEffect, useRef } from 'react';
import TextScramble from '../components/TextScramble';
import TiltMockup from '../components/TiltMockup';
import { 
  Play, 
  Network, 
  ClipboardList, 
  Briefcase, 
  ExternalLink, 
  ArrowUpRight, 
  Cpu, 
  Activity, 
  Database, 
  CheckCircle, 
  Flame, 
  Server, 
  AlertTriangle,
  FileText 
} from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Projects = () => {
  const sectionRef = useRef(null);
  const trunkRef = useRef(null);
  const branchRefs = useRef([]);
  const nodeRefs = useRef([]);
  const headingRef = useRef(null);
  const mockupRefs = useRef([]);
  const targetCoordsRef = useRef([]);

  useEffect(() => {
    const updateTreeCoordinates = () => {
      if (window.innerWidth <= 991) return;

      const sec = sectionRef.current;
      if (!sec) return;

      const sectionRect = sec.getBoundingClientRect();
      const sectionWidth = sectionRect.width;
      const sectionHeight = sectionRect.height;

      // Position de l'en-tête
      const heading = headingRef.current;
      if (!heading) return;
      const headingRect = heading.getBoundingClientRect();
      
      // Point de départ du tronc de l'arbre
      const startX = headingRect.left + headingRect.width / 2 - sectionRect.left;
      const startY = headingRect.bottom - sectionRect.top;

      const centerX = sectionWidth / 2;

      // Positions des maquettes et cibles
      const targets = [];
      for (let i = 0; i < 3; i++) {
        const mockup = mockupRefs.current[i];
        if (!mockup) continue;

        const mockupRect = mockup.getBoundingClientRect();
        
        // Déterminer le point de connexion selon le côté
        const isRightMockup = (i % 2 === 0);
        
        const targetX = isRightMockup 
          ? mockupRect.left - sectionRect.left - 5 
          : mockupRect.right - sectionRect.left + 5;
        
        // Centre vertical de la maquette
        const targetY = mockupRect.top + mockupRect.height / 2 - sectionRect.top;

        targets.push({ x: targetX, y: targetY, isRight: isRightMockup });
      }

      if (targets.length === 0) return;

      // Construction du tronc de l'arbre
      let trunkD = `M ${startX},${startY}`;
      const transitionY = startY + 60;
      trunkD += ` C ${startX},${startY + 30} ${centerX},${transitionY - 30} ${centerX},${transitionY}`;

      // Points de contrôle pour rendre le tronc ondulé
      const trunkPoints = [];
      const startWaveY = transitionY;
      const endWaveY = targets[targets.length - 1].y + 100;
      const numPoints = 12;
      const waveFreq = 2.5;
      
      for (let k = 0; k <= numPoints; k++) {
        const t = k / numPoints;
        const y = startWaveY + (endWaveY - startWaveY) * t;
        const sway = Math.sin(t * Math.PI * 2 * waveFreq) * 20;
        trunkPoints.push({ x: centerX + sway, y: y });
      }

      // Tracer le tronc ondulé avec des courbes de Bézier
      for (let k = 0; k < trunkPoints.length - 1; k++) {
        const p0 = trunkPoints[k];
        const p1 = trunkPoints[k + 1];
        const midY = (p0.y + p1.y) / 2;
        trunkD += ` C ${p0.x},${midY} ${p1.x},${midY} ${p1.x},${p1.y}`;
      }

      // Finir le tronc tout droit vers le bas
      trunkD += ` L ${centerX},${sectionHeight - 40}`;

      // Mettre à jour l'élément DOM du tronc
      const trunk = trunkRef.current;
      if (trunk) {
        trunk.setAttribute('d', trunkD);
      }

      // Dessiner les branches et les nœuds lumineux
      targets.forEach((target, idx) => {
        const branch = branchRefs.current[idx];
        if (!branch) return;

        // Point de départ de la branche sur le tronc
        const branchStartY = Math.max(transitionY, target.y - 80);
        
        // Récupérer l'abscisse du tronc à cette hauteur
        const t = (branchStartY - startWaveY) / (endWaveY - startWaveY);
        const swayVal = Math.sin(Math.max(0, Math.min(1, t)) * Math.PI * 2 * waveFreq) * 20;
        const trunkXAtHeight = centerX + swayVal;

        // Relier le tronc à la maquette
        const cp1x = trunkXAtHeight + (target.isRight ? 40 : -40);
        const cp1y = branchStartY;
        const cp2x = target.x + (target.isRight ? -60 : 60);
        const cp2y = target.y;

        const branchD = `M ${trunkXAtHeight},${branchStartY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${target.x},${target.y}`;
        branch.setAttribute('d', branchD);
      });
      targetCoordsRef.current = targets;
    };

    // Initialiser les valeurs du tracé SVG
    const initDashValues = () => {
      const trunk = trunkRef.current;
      if (trunk) {
        const length = trunk.getTotalLength();
        trunk.style.strokeDasharray = length;
        trunk.style.strokeDashoffset = length;
      }

      branchRefs.current.forEach((branch) => {
        if (branch) {
          const length = branch.getTotalLength();
          branch.style.strokeDasharray = length;
          branch.style.strokeDashoffset = length;
        }
      });

      nodeRefs.current.forEach((node) => {
        if (node) {
          node.style.opacity = 0;
          node.style.transform = 'scale(0)';
        }
      });
    };

    const handleScroll = () => {
      // Mettre à jour les coordonnées dynamiquement
      updateTreeCoordinates();

      const sec = sectionRef.current;
      if (!sec) return;

      const rect = sec.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const sectionTop = rect.top;

      // Progression du défilement
      const scrolled = viewportHeight - sectionTop;
      const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - 350)));

      // Animation de croissance du tronc
      const trunk = trunkRef.current;
      if (trunk) {
        const length = trunk.getTotalLength();
        trunk.style.strokeDasharray = length;
        const trunkProgress = Math.max(0, Math.min(1, progress * 1.25));
        trunk.style.strokeDashoffset = length - (length * trunkProgress);
      }

      // Animation des branches décalées
      branchRefs.current.forEach((branch, idx) => {
        if (!branch) return;
        const length = branch.getTotalLength();
        branch.style.strokeDasharray = length;
        const thresholds = [0.15, 0.48, 0.78]; // Seuils d'apparition
        const start = thresholds[idx];
        const branchProgress = Math.max(0, Math.min(1, (progress - start) * 6.0));
        branch.style.strokeDashoffset = length - (length * branchProgress);

        // Rendu des nœuds lumineux terminaux
        const node = nodeRefs.current[idx];
        if (node) {
          const nodeProgress = Math.max(0, Math.min(1, (branchProgress - 0.78) * 4.5));
          node.style.opacity = nodeProgress;
          
          const coords = targetCoordsRef.current[idx];
          if (coords) {
            node.style.transform = `translate(${coords.x}px, ${coords.y}px) scale(${nodeProgress})`;
          } else {
            node.style.transform = `scale(${nodeProgress})`;
          }
        }
      });
    };

    // Calculer les chemins et hauteurs
    updateTreeCoordinates();
    initDashValues();

    // Écouteurs d'événements passifs
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Calcul initial
    handleScroll();

    // Déclencher une mise à jour différée après chargement des images
    const loadTimeout = setTimeout(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(loadTimeout);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-primary)',
        padding: '120px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Organic Scroll-Drawn Connecting Tree SVG */}
      <svg
        className="organic-tree-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id="trunk-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ff7a00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent-hover)" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="branch-grad-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="branch-grad-left" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Dynamic hand-drawn organic trunk path */}
        <path
          ref={trunkRef}
          d=""
          fill="none"
          stroke="url(#trunk-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', willChange: 'stroke-dashoffset' }}
        />

        {/* Staggered Branch 1 (pointing right to project 1 mockup left edge) */}
        <path
          ref={el => branchRefs.current[0] = el}
          d=""
          fill="none"
          stroke="url(#branch-grad-right)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', willChange: 'stroke-dashoffset' }}
        />

        {/* Staggered Branch 2 (pointing left to project 2 mockup right edge) */}
        <path
          ref={el => branchRefs.current[1] = el}
          d=""
          fill="none"
          stroke="url(#branch-grad-left)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', willChange: 'stroke-dashoffset' }}
        />

        {/* Staggered Branch 3 (pointing right to project 3 mockup left edge) */}
        <path
          ref={el => branchRefs.current[2] = el}
          d=""
          fill="none"
          stroke="url(#branch-grad-right)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', willChange: 'stroke-dashoffset' }}
        />



        {/* Branch 1 Glowing Node */}
        <g
          ref={el => nodeRefs.current[0] = el}
          style={{ transition: 'opacity 0.2s ease', willChange: 'opacity, transform' }}
        >
          <circle cx="0" cy="0" r="8" fill="var(--accent)" opacity="0.35" className="pulse-dot" />
          <circle cx="0" cy="0" r="3.5" fill="var(--accent)" />
        </g>

        {/* Branch 2 Glowing Node */}
        <g
          ref={el => nodeRefs.current[1] = el}
          style={{ transition: 'opacity 0.2s ease', willChange: 'opacity, transform' }}
        >
          <circle cx="0" cy="0" r="8" fill="var(--accent)" opacity="0.35" className="pulse-dot" />
          <circle cx="0" cy="0" r="3.5" fill="var(--accent)" />
        </g>

        {/* Branch 3 Glowing Node */}
        <g
          ref={el => nodeRefs.current[2] = el}
          style={{ transition: 'opacity 0.2s ease', willChange: 'opacity, transform' }}
        >
          <circle cx="0" cy="0" r="8" fill="var(--accent)" opacity="0.35" className="pulse-dot" />
          <circle cx="0" cy="0" r="3.5" fill="var(--accent)" />
        </g>


      </svg>

      {/* Subtle warm background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          background: 'radial-gradient(circle, rgba(227, 93, 59, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Heading */}
        <div ref={headingRef} className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '90px' }}>
          <div className="organic-badge" style={{ marginBottom: '16px' }}>
            RÉALISATIONS MAJEURES
          </div>
          <h2
            className="section-title"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              lineHeight: '1.15',
              margin: 0,
            }}
          >
            Showcase <span className="accent-glow-text" style={{ padding: '0 0.05em' }}>Éditorial</span>
          </h2>
          <p
            style={{
              maxWidth: '620px',
              margin: '20px auto 0 auto',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
            }}
          >
            Sélection exclusive de mes 4 projets les plus marquants, illustrés par des maquettes interactives haute-fidélité codées directement en HTML/CSS.
          </p>
        </div>

        {/* 1. Stage RGU Limoges/Bordeaux (Recherche / Écosse) */}
        <div className="project-row" style={{ display: 'flex', gap: '60px', alignItems: 'center', marginBottom: '120px' }}>
          <div className="project-content reveal-on-scroll" style={{ flex: '1', minWidth: '320px' }}>
            <span style={{ fontFamily: 'var(--font-subtitle)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              N° 001 / RECHERCHE & R&D IA
            </span>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              <TextScramble text="RGU Limoges/Bordeaux" hover={true} />
            </h3>
            <p style={{ fontFamily: 'var(--font-creative)', fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', color: 'var(--accent-hover)', fontStyle: 'italic', fontWeight: 300, margin: '0 0 24px 0' }}>
              Quantifier la polarisation discursive par une approche multimodale et réseau.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '32px' }}>
              Stage de recherche au laboratoire d'IA de la Robert Gordon University (Limoges/Bordeaux) sous la supervision du Dr Shahana Bano. Rédaction d'un papier de recherche (publication prochaine) sur la polarisation sociale sur 5 plateformes. Modélisation d'un graphe d'interactions de 20k nœuds (Louvain Q = 0,95), création d'un index de polarisation composite (We/Them & Perspective API) et classification zero-shot de mèmes politiques via OpenAI CLIP.
            </p>

            {/* 2x2 Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '32px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rôle</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Chercheur R&D NLP</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Année</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>2026</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Publication prochaine</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Équipe</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Solo / RGU Lab</span>
              </div>
            </div>

            {/* Tech & CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {['Python', 'OpenAI CLIP', 'Perspective API', 'Louvain Modularity', 'Complex Networks', 'PyTorch & NLP'].map(tech => (
                <span key={tech} className="organic-badge" style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(227, 93, 59, 0.06)' }}>
                  {tech}
                </span>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a 
                href="/research_paper.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-editorial"
                aria-label="Consulter le papier de recherche (PDF)"
                style={{ padding: '12px 28px', fontSize: '0.85rem' }}
              >
                <span>Lire le Papier</span>
                <FileText size={16} />
              </a>
            </div>
          </div>

          {/* RGU Mockup (Scientific Research Terminal) */}
          <div ref={el => mockupRefs.current[0] = el} className="project-mockup reveal-scale delay-200" style={{ flex: '1', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
            <TiltMockup>
              <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', backgroundColor: 'rgba(9, 11, 20, 0.95)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)', padding: '0', display: 'flex', height: '340px', overflow: 'hidden', position: 'relative' }}>
              
              {/* Subtle background cyber grid */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px)', backgroundSize: '16px 16px', pointerEvents: 'none' }} />

              {/* Left Navigation Sidebar */}
              <div style={{ width: '135px', backgroundColor: 'rgba(6, 8, 14, 0.7)', borderRight: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', padding: '16px 10px', gap: '18px', zIndex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ANALYSIS TOOLKIT</span>
                  <div style={{ width: '15px', height: '2px', backgroundColor: 'var(--accent)', borderRadius: '1px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'Overview & Baselines', active: false },
                    { name: 'Echo Chambers Network', active: false },
                    { name: 'Polarization & Toxicity', active: true },
                    { name: 'Cross-Platform Metrics', active: false },
                    { name: 'Import Dataset', active: false }
                  ].map((nav, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: nav.active ? 'var(--accent)' : 'rgba(255, 255, 255, 0.15)',
                        boxShadow: nav.active ? '0 0 10px var(--accent), 0 0 4px var(--accent)' : 'none',
                        border: nav.active ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                      }} />
                      <span style={{ 
                        fontSize: '0.56rem', 
                        fontWeight: nav.active ? 800 : 500, 
                        color: nav.active ? '#ffffff' : 'rgba(255, 255, 255, 0.45)', 
                        lineHeight: 1.25,
                        letterSpacing: '0.01em'
                      }}>{nav.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 18px', gap: '14px', overflowY: 'auto', zIndex: 1 }}>
                
                {/* Heatmap Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '4px', height: '10px', backgroundColor: 'var(--accent)', borderRadius: '2px' }} />
                      Polarization Heatmap
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.48rem', color: 'var(--accent)', backgroundColor: 'rgba(227, 93, 59, 0.08)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(227, 93, 59, 0.15)' }}>SYS.ACTIVE</span>
                  </div>
                  
                  {/* Grid Table for Heatmap */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', overflow: 'hidden' }}>
                    {/* Header Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.9fr', backgroundColor: 'rgba(255,255,255,0.02)', padding: '4px 6px', fontSize: '0.45rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                      <span>Echo Chamber</span>
                      <span style={{ textAlign: 'center' }}>We_Them</span>
                      <span style={{ textAlign: 'center' }}>Mean_Tox</span>
                      <span style={{ textAlign: 'center' }}>Pol_Index</span>
                    </div>

                    {/* Row 1: Alt-Right */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.9fr', padding: '4px 6px', fontSize: '0.45rem', alignItems: 'center', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Alt-Right Echo</span>
                      <span style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800, boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)' }}>1.07</span>
                      <span style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800 }}>0.43</span>
                      <span style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800 }}>0.46</span>
                    </div>

                    {/* Row 2: Progressive */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.9fr', padding: '4px 6px', fontSize: '0.45rem', alignItems: 'center', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Progressive Network</span>
                      <span style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800, boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)' }}>1.03</span>
                      <span style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800 }}>0.46</span>
                      <span style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800 }}>0.47</span>
                    </div>

                    {/* Row 3: Conspiracy */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.9fr', padding: '4px 6px', fontSize: '0.45rem', alignItems: 'center', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Conspiracy & Fringe</span>
                      <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800, boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)' }}>0.19</span>
                      <span style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800 }}>0.52</span>
                      <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800 }}>0.10</span>
                    </div>

                    {/* Row 4: Climate Change */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.9fr', padding: '4px 6px', fontSize: '0.45rem', alignItems: 'center', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Climate Change</span>
                      <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800, boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)' }}>0.19</span>
                      <span style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800 }}>0.46</span>
                      <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#ffffff', textAlign: 'center', borderRadius: '4px', padding: '1px 0', margin: '0 4px', fontWeight: 800 }}>0.09</span>
                    </div>
                  </div>
                </div>

                {/* Temporal Chart Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '4px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '2px' }} />
                    Temporal 'We vs Them' Prevalence
                  </span>
                  
                  <div style={{ width: '100%', height: '70px', backgroundColor: 'rgba(5, 7, 12, 0.8)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', padding: '4px' }}>
                    {/* SVG grid lines background */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0', pointerEvents: 'none' }}>
                      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.02)' }} />
                      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.02)' }} />
                      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.02)' }} />
                    </div>

                    {/* SVG area chart representing we vs them count */}
                    <svg viewBox="0 0 300 70" style={{ width: '100%', height: '100%', overflow: 'visible', zIndex: 1 }}>
                      <defs>
                        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* we_count (Blue area) */}
                      <path
                        d="M 10 55 Q 50 20, 90 45 T 170 35 T 250 50 L 290 15 L 290 70 L 10 70 Z"
                        fill="url(#blueGrad)"
                        stroke="#3b82f6"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      {/* them_count (Pink/Red area) */}
                      <path
                        d="M 10 60 Q 50 15, 90 40 T 170 20 T 250 30 L 290 8 L 290 70 L 10 70 Z"
                        fill="url(#redGrad)"
                        stroke="#ef4444"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                      {/* Interactive dot tracking simulation */}
                      <circle cx="150" cy="27" r="3.5" fill="var(--accent)" stroke="#ffffff" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 4px var(--accent))' }} />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.48rem', fontWeight: 700, justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 6px #3b82f6' }} /> we_count</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%', boxShadow: '0 0 6px #ef4444' }} /> them_count</span>
                  </div>
                </div>

              </div>
            </div>
          </TiltMockup>
        </div>
      </div>

{/* 2. Projet "Questionary" (Web / NLP & Full-stack) */}
        <div className="project-row" style={{ display: 'flex', gap: '60px', alignItems: 'center', marginBottom: '120px', flexDirection: 'row-reverse' }}>
          <div className="project-content reveal-on-scroll" style={{ flex: '1', minWidth: '320px' }}>
            <span style={{ fontFamily: 'var(--font-subtitle)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              N° 002 / NLP & FULL-STACK WEB
            </span>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              <TextScramble text="Questionary" hover={true} />
            </h3>
            <p style={{ fontFamily: 'var(--font-creative)', fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', color: 'var(--accent-hover)', fontStyle: 'italic', fontWeight: 300, margin: '0 0 24px 0' }}>
              Comprendre les réponses, au-delà des mots.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '32px' }}>
              Application web d'analyse sémantique et de création de formulaires dynamiques. Conçue en équipe, elle intègre un moteur d'analyse de sentiment NLP en temps réel pour traiter les réponses ouvertes et déclencher instantanément des flux d'alertes intelligents par e-mail et Slack en cas de retours critiques.
            </p>

            {/* 2x2 Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '32px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rôle</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Lead Dev & NLP Integration</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Année</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>2025</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>MVP validé</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Équipe</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>6 Développeurs</span>
              </div>
            </div>

            {/* Tech & CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {['Vue.js', 'PHP', 'MariaDB', 'NLP / Sentiment', 'SQL', 'Alerting API'].map(tech => (
                <span key={tech} className="organic-badge" style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(227, 93, 59, 0.06)' }}>
                  {tech}
                </span>
              ))}
            </div>
            
            <a 
              href="https://github.com/Mdeterne/Web-app-questionary" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-editorial"
              aria-label="Explorer le dépôt GitHub de l'application Questionary"
              style={{ padding: '12px 28px', fontSize: '0.85rem' }}
            >
              <span>Explorer le Dépôt</span>
              <GithubIcon size={16} />
            </a>
          </div>

          {/* Questionary HTML Mockup (Clean SaaS Dashboard) */}
          <div ref={el => mockupRefs.current[1] = el} className="project-mockup" style={{ flex: '1', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
            <TiltMockup>
              <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', backgroundColor: '#f9fafb', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 25px 60px rgba(17,24,39,0.06)', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '320px' }}>
              {/* Dark Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', backgroundColor: '#1e1e1e', padding: '8px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClipboardList size={11} color="#ffffff" />
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em' }}>QUESTIONARY</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.52rem', fontWeight: 700, color: '#ffffff' }}>Université de Limoges</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                </div>
              </div>

              {/* Title Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.45rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Analyse des résultats</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b' }}>Questionnaire de Démonstration</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{ border: 'none', backgroundColor: '#22c55e', color: '#ffffff', fontSize: '0.5rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <span>Exporter</span>
                  </button>
                  <button style={{ border: 'none', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.5rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                    <span>Retour</span>
                  </button>
                </div>
              </div>

              {/* Body Area */}
              <div style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                {/* 64 Responses Ovale Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '50px', padding: '3px 10px', width: 'fit-content' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#b91c1c' }} />
                  <span style={{ fontSize: '0.52rem', fontWeight: 800 }}>64 réponses collectées</span>
                </div>

                {/* Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {/* Card 1 */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#1e293b' }}>Quel est votre prénom ?</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { label: 'Je recommande...', val: '95%' },
                        { label: 'Sympa et très bien', val: '65%' },
                        { label: 'Excellent projet', val: '60%' }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.45rem', color: '#71717a' }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' }}>{item.label}</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.val}`, height: '100%', backgroundColor: '#c25959' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button style={{ border: 'none', backgroundColor: '#18181b', color: '#ffffff', fontSize: '0.45rem', fontWeight: 800, padding: '3px', borderRadius: '4px', marginTop: '2px', cursor: 'pointer' }}>
                      Voir toutes les réponses (40)
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#1e293b' }}>Quelles fonctionnalités préférez-vous ?</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { label: 'Interface intuitive', val: '85%' },
                        { label: 'Analyses détaillées', val: '80%' },
                        { label: 'Rapidité', val: '70%' }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.45rem', color: '#71717a' }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' }}>{item.label}</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.val}`, height: '100%', backgroundColor: '#c25959' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TiltMockup>
        </div>
      </div>

{/* 3. Réseau Virtuel (SysAdmin / Réseaux) */}
        <div className="project-row" style={{ display: 'flex', gap: '60px', alignItems: 'center', marginBottom: '40px' }}>
          <div className="project-content reveal-on-scroll" style={{ flex: '1', minWidth: '320px' }}>
            <span style={{ fontFamily: 'var(--font-subtitle)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              N° 003 / SYSADMIN & INFRASTRUCTURE
            </span>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              <TextScramble text="Réseau Virtuel" hover={true} />
            </h3>
            <p style={{ fontFamily: 'var(--font-creative)', fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', color: 'var(--accent-hover)', fontStyle: 'italic', fontWeight: 300, margin: '0 0 24px 0' }}>
              Architecturer la stabilité à grande échelle.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '32px' }}>
              Simulation complète d'une infrastructure réseau d'entreprise à grande échelle connectant plus de 2000 machines virtuelles réparties sur plusieurs sous-réseaux. Configuration complète de l'allocation dynamique (DHCP), de la résolution de noms locale (DNS) et des protocoles de routage dynamique sécurisé (OSPF et RIP).
            </p>

            {/* 2x2 Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '32px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rôle</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Lead Architecte Réseau</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Année</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>2025</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Projet validé</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Équipe</span>
                <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>3 Collaborateurs</span>
              </div>
            </div>

            {/* Tech & CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {['Réseaux', 'SysAdmin', 'OSPF / RIP', 'Virtualisation', 'DHCP & DNS'].map(tech => (
                <span key={tech} className="organic-badge" style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(227, 93, 59, 0.06)' }}>
                  {tech}
                </span>
              ))}
            </div>
            
            <a 
              href="https://github.com/LOI-mln/virtual-network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-editorial"
              aria-label="Explorer le dépôt GitHub du projet Réseau Virtuel"
              style={{ padding: '12px 28px', fontSize: '0.85rem' }}
            >
              <span>Explorer le Dépôt</span>
              <GithubIcon size={16} />
            </a>
          </div>

          {/* Virtual Network Mockup (Infrastructure Node Diagram) */}
          <div ref={el => mockupRefs.current[2] = el} className="project-mockup reveal-scale delay-200" style={{ flex: '1', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
            <TiltMockup>
              <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', backgroundColor: '#090d16', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 30px 70px rgba(0,0,0,0.35)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Server size={14} color="#10b981" />
                  <span style={{ fontFamily: 'var(--font-subtitle)', fontSize: '0.72rem', fontWeight: 800, color: '#9ca3af' }}>NET-MONITOR PRO</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#10b981' }}>OSPF ACTIVE - 100% ONLINE</span>
                </div>
              </div>

              {/* SVG Topology Visualizer with animated pulses */}
              <div style={{ backgroundColor: 'rgba(0,0,0,0.22)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Active Enterprise Topology (Virtual Segment)</span>
                
                <div style={{ width: '100%', height: '110px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <svg viewBox="0 0 300 110" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Connection lines */}
                    <line x1="50" y1="55" x2="110" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <line x1="50" y1="55" x2="110" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <line x1="110" y1="25" x2="190" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <line x1="110" y1="85" x2="190" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <line x1="190" y1="25" x2="250" y2="55" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <line x1="190" y1="85" x2="250" y2="55" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    
                    {/* Animated data packet pulses */}
                    <circle r="3" fill="var(--accent)" style={{ animation: 'movePacket1 3s infinite linear' }} />
                    <circle r="3" fill="#10b981" style={{ animation: 'movePacket2 4s infinite linear' }} />

                    {/* Nodes (Circles with labels) */}
                    {/* Edge Switch */}
                    <circle cx="50" cy="55" r="14" fill="#1e293b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    <text x="50" y="58" fontSize="8" fill="#ffffff" fontWeight="bold" textAnchor="middle">SW-1</text>

                    {/* Core Router 1 */}
                    <circle cx="110" cy="25" r="14" fill="var(--accent)" stroke="rgba(227, 93, 59, 0.3)" strokeWidth="1.5" />
                    <text x="110" y="28" fontSize="8" fill="#ffffff" fontWeight="bold" textAnchor="middle">R-1</text>

                    {/* Core Router 2 */}
                    <circle cx="110" cy="85" r="14" fill="var(--accent)" stroke="rgba(227, 93, 59, 0.3)" strokeWidth="1.5" />
                    <text x="110" y="88" fontSize="8" fill="#ffffff" fontWeight="bold" textAnchor="middle">R-2</text>

                    {/* Firewall */}
                    <circle cx="190" cy="25" r="14" fill="#1e293b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    <text x="190" y="28" fontSize="8" fill="#ffffff" fontWeight="bold" textAnchor="middle">FW-1</text>

                    {/* Distribution Switch */}
                    <circle cx="190" cy="85" r="14" fill="#1e293b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    <text x="190" y="88" fontSize="8" fill="#ffffff" fontWeight="bold" textAnchor="middle">SW-2</text>

                    {/* Server Cluster */}
                    <circle cx="250" cy="55" r="14" fill="#10b981" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
                    <text x="250" y="58" fontSize="7" fill="#ffffff" fontWeight="bold" textAnchor="middle">SRV-A</text>
                  </svg>
                </div>
              </div>

              {/* DHCP Leases & active stats */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 700 }}>VMs ACTIVES</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>2 048</span>
                </div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 700 }}>TRAFIC GLOBAL</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent)' }}>4.8 Gbps</span>
                </div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 700 }}>LATENCE DNS</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>1.1 ms</span>
                </div>
              </div>
            </div>
          </TiltMockup>
        </div>
      </div>
      </div>

      {/* Internal CSS for responsive grid, direction swap on hover and keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 991px) {
          .organic-tree-svg {
            display: none !important;
          }
          .project-row {
            flex-direction: column !important;
            gap: 40px !important;
            margin-bottom: 80px !important;
          }
          .project-content {
            width: 100% !important;
          }
          .project-mockup {
            width: 100% !important;
          }
        }
        
        /* Interactive data packet SVG animations */
        @keyframes movePacket1 {
          0% { cx: 50; cy: 55; opacity: 1; }
          40% { cx: 110; cy: 25; }
          75% { cx: 190; cy: 25; }
          100% { cx: 250; cy: 55; opacity: 0; }
        }
        
        @keyframes movePacket2 {
          0% { cx: 50; cy: 55; opacity: 1; }
          40% { cx: 110; cy: 85; }
          75% { cx: 190; cy: 85; }
          100% { cx: 250; cy: 55; opacity: 0; }
        }
      `}} />
    </section>
  );
};

export default Projects;
