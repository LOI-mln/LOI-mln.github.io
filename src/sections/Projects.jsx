import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import TextScramble from '../components/TextScramble';
import { 
  Globe, 
  Share2, 
  Router, 
  Users, 
  LayoutGrid, 
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
  FileText,
  Calendar,
  Clock,
  ShieldCheck,
  Layers,
  Terminal,
  Zap,
  Check,
  Lock
} from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Contenu texte des fiches, dans l'ordre d'affichage
const PROJECT_INFO = [
  {
    number: '01',
    category: 'Homelab & sécurité',
    title: 'Homelab Proxmox',
    meta: 'Projet personnel',
    summary: "Héberger mes propres services (cloud, média, domotique, DNS) et les cloisonner par VLAN.",
    points: [
      'Services virtualisés sous Proxmox VE',
      'Réseau découpé en VLAN, filtré par le pare-feu Proxmox',
      'Sauvegardes automatiques et suivi via les logs Proxmox',
    ],
    tags: ['Proxmox VE', 'VLAN', 'Pare-feu', 'Sauvegardes'],
    demo: {
      src: '/videos/homelab-reconstitution.mp4',
      poster: '/videos/homelab-reconstitution.jpg',
      duration: '29 s',
      button: 'Voir la reconstitution',
      label: 'Reconstitution en lab',
      note: "Architecture reproduite dans un lab Kathara (VLAN 802.1Q, pare-feu iptables) : ce n'est pas le matériel réel.",
    },
  },
  {
    number: '02',
    category: 'Recherche IA',
    title: 'RGU Aberdeen',
    meta: 'Stage Erasmus+ · Écosse · 2026',
    status: 'Publication prochaine',
    summary: "Mesurer la polarisation des discours politiques sur 5 réseaux sociaux, sans annotation manuelle.",
    points: [
      'Graphe de 20 641 nœuds, communautés détectées par Louvain (Q = 0,954)',
      'Indice We/Them, toxicité via Perspective API, mèmes classés avec CLIP',
      'Papier de recherche rédigé sous la direction du Dr Shahana Bano',
    ],
    tags: ['Python', 'NLP', 'CLIP', 'Perspective API'],
    link: { href: '/research_paper.pdf', label: 'Lire le papier', kind: 'pdf' },
  },
  {
    number: '03',
    category: 'Optimisation & full-stack',
    title: 'Unilim EDT',
    meta: "Projet BUT · Lead dev, équipe de 4 · 2025-2026",
    status: "En production à l'IUT",
    summary: "Générer automatiquement les emplois du temps de l'IUT, sans conflit de salle, d'enseignant ou de groupe.",
    points: [
      'Solveur par contraintes Google OR-Tools (CP-SAT) en Python',
      'Back-end Laravel 11, interface Vue 3 / Inertia.js, déployé avec Docker',
      "Utilisé par le département Informatique de l'IUT du Limousin",
    ],
    tags: ['OR-Tools', 'Python', 'Laravel', 'Vue 3'],
    demo: { src: '/videos/unilim-edt-demo.mp4', poster: '/videos/unilim-edt-demo.jpg', duration: '35 s' },
  },
  {
    number: '04',
    category: 'Réseau & infrastructure',
    title: 'Réseau Virtuel',
    meta: 'Projet BUT 1 · 3 étudiants · 2025',
    summary: "Simuler le réseau d'une entreprise découpé en 3 zones (serveurs, personnel, clients), reliées par un routeur central.",
    points: [
      "Lab virtuel de 13 machines sous Kathara, plan d'adressage par zone",
      "Routage statique entre les zones et NAT vers l'extérieur",
      'Services DHCP, FTP (vsftpd) et SSH',
    ],
    tags: ['Kathara', 'Routage', 'DHCP', 'Linux'],
    demo: { src: '/videos/reseau-kathara-demo.mp4', poster: '/videos/reseau-kathara-demo.jpg', duration: '33 s' },
    link: { href: 'https://github.com/LOI-mln/virtual-network', label: 'Voir le dépôt', kind: 'github' },
  },
];

// Vision de chaque projet en 3 étapes, dans l'ordre d'affichage des fiches
const PROJECT_VISION = [
  [
    { icon: Globe, step: 'Accès', title: 'Internet · box', chips: ['Certains services exposés'] },
    { icon: Server, step: 'Hôte', title: 'Proxmox VE', chips: ['Pare-feu Proxmox', 'Sauvegardes auto'] },
    { icon: Layers, step: 'Réseau', title: 'Services cloisonnés par VLAN', chips: ['Cloud', 'Média', 'Domotique · DNS'] },
  ],
  [
    { icon: Share2, step: 'Données', title: '5 réseaux sociaux', chips: ['Discours politiques', 'Mèmes'] },
    { icon: Network, step: 'Analyse', title: 'Graphe de 20 641 nœuds', chips: ['Louvain Q = 0,954', 'We/Them', 'Perspective API', 'CLIP'] },
    { icon: FileText, step: 'Résultat', title: 'Papier de recherche', chips: ['Publication prochaine'] },
  ],
  [
    { icon: Users, step: 'Contraintes', title: 'Salles, enseignants, groupes', chips: ['Aucun conflit autorisé'] },
    { icon: Cpu, step: 'Solveur', title: 'Google OR-Tools CP-SAT', chips: ['Python', 'Docker'] },
    { icon: Calendar, step: 'Application', title: "Emplois du temps de l'IUT", chips: ['Laravel 11', 'Vue 3', 'En production'] },
  ],
  [
    { icon: LayoutGrid, step: 'Zones', title: 'Serveurs, personnel, clients', chips: ['13 machines', 'Lab Kathara'] },
    { icon: Router, step: 'Routage', title: 'Routeur central et routes statiques', chips: ['NAT (iptables)'] },
    { icon: Server, step: 'Services', title: 'DHCP, FTP et SSH', chips: ['isc-dhcp-server', 'vsftpd'] },
  ],
];

// Schéma « Vision du projet » : étapes reliées de haut en bas
const ProjectVision = ({ steps }) => (
  <div className="pv">
    <span className="pv-label">Vision du projet</span>
    <ol className="pv-steps">
      {steps.map(({ icon: Icon, step, title, chips }) => (
        <li key={title} className="pv-step">
          <span className="pv-icon"><Icon size={18} /></span>
          <div className="pv-body">
            <span className="pv-step-label">{step}</span>
            <strong className="pv-title">{title}</strong>
            <div className="pv-chips">
              {chips.map((chip) => <span key={chip}>{chip}</span>)}
            </div>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

// Bloc texte d'une fiche : pastille, titre, contexte, résumé, points clés, pied (technos + lien)
// Fenêtre vidéo de démonstration (chargée seulement à l'ouverture)
const DemoModal = ({ demo, title, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Portail : la carte a une transformation CSS qui piégerait le position: fixed
  return createPortal(
    <div className="demo-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Démo de ${title}`}>
      <div className="demo-frame" onClick={(e) => e.stopPropagation()}>
        <div className="demo-head">
          <span>{demo.label || 'Démo réelle'} · {title}</span>
          <button type="button" onClick={onClose} aria-label="Fermer la démo">×</button>
        </div>
        <video src={demo.src} poster={demo.poster} controls autoPlay muted playsInline />
        {demo.note && <p className="demo-note">{demo.note}</p>}
      </div>
    </div>,
    document.body
  );
};

const ProjectSummary = ({ number, category, title, meta, status, summary, points, tags, link, demo }) => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
  <div className="project-content ps">
    <div className="ps-eyebrow">
      <span>{number}</span>
      <span>{category}</span>
    </div>
    <h3 className="ps-title">
      <TextScramble text={title} hover={true} />
    </h3>
    <p className="ps-meta">
      <span>{meta}</span>
      {status && <span className="ps-status">{status}</span>}
    </p>
    <p className="ps-summary">{summary}</p>
    <ul className="ps-points">
      {points.map((point) => (
        <li key={point}>
          <span className="ps-check"><Check size={12} strokeWidth={3} /></span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
    <div className="ps-footer">
      <div className="ps-tags">
        {tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="ps-actions">
        {demo && (
          <button type="button" className="ps-link ps-link--demo" onClick={() => setDemoOpen(true)}>
            <Play size={14} fill="currentColor" />
            <span>{demo.button || 'Voir la démo'} · {demo.duration}</span>
          </button>
        )}
        {link && (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="ps-link">
            {link.kind === 'github' ? <GithubIcon size={15} /> : <FileText size={15} />}
            <span>{link.label}</span>
            <ArrowUpRight size={15} />
          </a>
        )}
      </div>
    </div>
    {demoOpen && <DemoModal demo={demo} title={title} onClose={() => setDemoOpen(false)} />}
  </div>
  );
};

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
      for (let i = 0; i < 4; i++) {
        const mockup = mockupRefs.current[i];
        if (!mockup) continue;

        const mockupRect = mockup.getBoundingClientRect();
        
        // Déterminer le point de connexion selon le côté
        const isRightMockup = (i % 2 === 1);
        
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
        const thresholds = [0.1, 0.34, 0.58, 0.8]; // Seuils d'apparition
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

        {/* Branch 0 (pointing left to homelab mockup right edge) */}
        <path
          ref={el => branchRefs.current[0] = el}
          d=""
          fill="none"
          stroke="url(#branch-grad-left)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', willChange: 'stroke-dashoffset' }}
        />

        {/* Staggered Branch 1 (pointing right to project 1 mockup left edge) */}
        <path
          ref={el => branchRefs.current[1] = el}
          d=""
          fill="none"
          stroke="url(#branch-grad-right)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', willChange: 'stroke-dashoffset' }}
        />

        {/* Staggered Branch 2 (pointing left to project 2 mockup right edge) */}
        <path
          ref={el => branchRefs.current[2] = el}
          d=""
          fill="none"
          stroke="url(#branch-grad-left)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', willChange: 'stroke-dashoffset' }}
        />

        {/* Staggered Branch 3 (pointing right to project 3 mockup left edge) */}
        <path
          ref={el => branchRefs.current[3] = el}
          d=""
          fill="none"
          stroke="url(#branch-grad-right)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', willChange: 'stroke-dashoffset' }}
        />



        {/* Branch 0 Glowing Node */}
        <g
          ref={el => nodeRefs.current[0] = el}
          style={{ transition: 'opacity 0.2s ease', willChange: 'opacity, transform' }}
        >
          <circle cx="0" cy="0" r="8" fill="var(--accent)" opacity="0.35" className="pulse-dot" />
          <circle cx="0" cy="0" r="3.5" fill="var(--accent)" />
        </g>

        {/* Branch 1 Glowing Node */}
        <g
          ref={el => nodeRefs.current[1] = el}
          style={{ transition: 'opacity 0.2s ease', willChange: 'opacity, transform' }}
        >
          <circle cx="0" cy="0" r="8" fill="var(--accent)" opacity="0.35" className="pulse-dot" />
          <circle cx="0" cy="0" r="3.5" fill="var(--accent)" />
        </g>

        {/* Branch 2 Glowing Node */}
        <g
          ref={el => nodeRefs.current[2] = el}
          style={{ transition: 'opacity 0.2s ease', willChange: 'opacity, transform' }}
        >
          <circle cx="0" cy="0" r="8" fill="var(--accent)" opacity="0.35" className="pulse-dot" />
          <circle cx="0" cy="0" r="3.5" fill="var(--accent)" />
        </g>

        {/* Branch 3 Glowing Node */}
        <g
          ref={el => nodeRefs.current[3] = el}
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
            Quatre projets : mon homelab, un stage de recherche en IA, une application en production à l'IUT et une infrastructure réseau conçue en équipe.
          </p>
        </div>

        {/* 1. Homelab Proxmox (Infrastructure personnelle & Sécurité) */}
        <div className="project-card-showcase reveal-on-scroll">
          <div className="card-ambient-glow card-glow-violet" />
          <div className="project-row" style={{ display: 'flex', gap: '56px', alignItems: 'center', flexDirection: 'row-reverse', position: 'relative', zIndex: 1 }}>
            <ProjectSummary {...PROJECT_INFO[0]} />

            {/* Homelab Mockup (Console Proxmox) */}
            <div ref={el => mockupRefs.current[0] = el} className="project-mockup reveal-scale delay-200" style={{ flex: '0.95', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
              <ProjectVision steps={PROJECT_VISION[0]} />
            </div>
          </div>
        </div>

        {/* 2. Stage RGU Aberdeen (Recherche / Écosse) */}
        <div className="project-card-showcase reveal-on-scroll">
          <div className="card-ambient-glow card-glow-orange" />
          <div className="project-row" style={{ display: 'flex', gap: '56px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <ProjectSummary {...PROJECT_INFO[1]} />

            {/* RGU Mockup (Physical AI Research Workstation) */}
            <div ref={el => mockupRefs.current[1] = el} className="project-mockup reveal-scale delay-200" style={{ flex: '0.95', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
              <ProjectVision steps={PROJECT_VISION[1]} />
            </div>
          </div>
        </div>

        {/* 2. Projet "Unilim EDT" (Recherche Opérationnelle & Full-stack) */}
        <div className="project-card-showcase reveal-on-scroll">
          <div className="card-ambient-glow card-glow-emerald" />
          <div className="project-row" style={{ display: 'flex', gap: '56px', alignItems: 'center', flexDirection: 'row-reverse', position: 'relative', zIndex: 1 }}>
            <ProjectSummary {...PROJECT_INFO[2]} />

            {/* Unilim EDT Physical Mockup */}
            <div ref={el => mockupRefs.current[2] = el} className="project-mockup reveal-scale delay-200" style={{ flex: '0.95', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
              <ProjectVision steps={PROJECT_VISION[2]} />
            </div>
          </div>
        </div>

        {/* 3. Réseau Virtuel & Cybersécurité Cisco (SysAdmin / Réseaux) */}
        <div className="project-card-showcase reveal-on-scroll">
          <div className="card-ambient-glow card-glow-blue" />
          <div className="project-row" style={{ display: 'flex', gap: '56px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <ProjectSummary {...PROJECT_INFO[3]} />

            {/* Virtual Network Mockup (Physical Cisco NOC Operations Console) */}
            <div ref={el => mockupRefs.current[3] = el} className="project-mockup reveal-scale delay-200" style={{ flex: '0.95', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
              <ProjectVision steps={PROJECT_VISION[3]} />
            </div>
          </div>
        </div>
      </div>

      {/* Internal CSS for Physical Devices, Responsive Grid, and Live Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Premium Showcase Card Frame */
        .project-card-showcase {
          position: relative;
          border-radius: 28px;
          background: var(--bg-primary);
          border: 1px solid rgba(17, 24, 39, 0.08);
          box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04), 0 24px 48px -24px rgba(17, 24, 39, 0.14);
          padding: 14px;
          margin-bottom: 96px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .project-card-showcase:hover {
          transform: translateY(-4px);
          box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04), 0 32px 64px -28px rgba(17, 24, 39, 0.22);
        }
        .project-card-showcase .card-ambient-glow { display: none; }

        /* Teinte propre à chaque projet (RVB) */
        .card-glow-violet ~ .project-row { --tint: 124, 58, 237; }
        .card-glow-orange ~ .project-row { --tint: 227, 93, 59; }
        .card-glow-emerald ~ .project-row { --tint: 5, 150, 105; }
        .card-glow-blue ~ .project-row { --tint: 37, 99, 235; }

        .project-row {
          gap: 0 !important;
          align-items: stretch !important;
        }

        /* Panneau teinté qui accueille la vision du projet */
        .project-mockup {
          align-self: stretch;
          align-items: center;
          border-radius: 20px;
          padding: 44px 32px;
          border: 1px solid rgba(var(--tint), 0.12);
          background:
            radial-gradient(120% 90% at 50% 0%, rgba(var(--tint), 0.16), transparent 65%),
            radial-gradient(rgba(var(--tint), 0.16) 1px, transparent 1px) 0 0 / 18px 18px,
            rgba(var(--tint), 0.04);
        }

        /* Vision du projet : étapes reliées */
        .pv { width: 100%; max-width: 420px; }
        .pv-label {
          display: block;
          font-family: var(--font-subtitle);
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgb(var(--tint));
          margin-bottom: 16px;
        }
        .pv-steps {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 26px;
        }
        .pv-step {
          position: relative;
          display: flex; gap: 14px; align-items: flex-start;
          background: var(--bg-primary);
          border: 1px solid rgba(var(--tint), 0.14);
          border-radius: 16px;
          padding: 14px 16px;
          box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04), 0 8px 20px -12px rgba(var(--tint), 0.35);
        }
        /* Liaison verticale entre deux étapes */
        .pv-step + .pv-step::before {
          content: '';
          position: absolute;
          left: 34px; top: -27px;
          width: 2px; height: 26px;
          background: linear-gradient(rgba(var(--tint), 0.15), rgba(var(--tint), 0.6));
        }
        .pv-step + .pv-step::after {
          content: '';
          position: absolute;
          left: 31px; top: -6px;
          border: 4px solid transparent;
          border-top: 5px solid rgba(var(--tint), 0.6);
        }
        .pv-icon {
          flex-shrink: 0;
          width: 38px; height: 38px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.1);
        }
        .pv-body { display: flex; flex-direction: column; min-width: 0; }
        .pv-step-label {
          font-family: var(--font-subtitle);
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text-muted);
        }
        .pv-title {
          font-family: var(--font-subtitle);
          font-size: 1rem; font-weight: 700;
          color: var(--text-primary);
          margin: 2px 0 8px 0;
        }
        .pv-chips { display: flex; flex-wrap: wrap; gap: 5px; }
        .pv-chips span {
          font-family: var(--font-subtitle);
          font-size: 0.75rem; font-weight: 600;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.07);
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* Bloc texte des fiches */
        .ps {
          flex: 1;
          min-width: 300px;
          padding: 36px 40px 28px;
          display: flex;
          flex-direction: column;
        }
        .ps-eyebrow {
          align-self: flex-start;
          display: inline-flex; gap: 8px; align-items: center;
          font-family: var(--font-subtitle);
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.08);
          border: 1px solid rgba(var(--tint), 0.16);
          padding: 5px 12px;
          border-radius: 999px;
          margin-bottom: 18px;
        }
        .ps-eyebrow span:first-child { font-family: monospace; opacity: 0.7; }
        .ps-title {
          font-family: var(--font-title);
          font-size: clamp(2rem, 3.4vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--text-primary);
          margin: 0 0 10px 0;
        }
        .ps-meta {
          display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px;
          font-family: var(--font-subtitle);
          font-size: 0.85rem; font-weight: 600;
          color: var(--text-muted);
          margin: 0 0 22px 0;
        }
        .ps-status {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgb(var(--tint));
          font-weight: 700;
        }
        .ps-status::before {
          content: '';
          width: 7px; height: 7px; border-radius: 50%;
          background: rgb(var(--tint));
          box-shadow: 0 0 0 3px rgba(var(--tint), 0.18);
        }
        .ps-summary {
          font-family: var(--font-body);
          font-size: 1.12rem; line-height: 1.6;
          color: var(--text-primary);
          margin: 0 0 22px 0;
          max-width: 520px;
        }
        .ps-points {
          list-style: none; padding: 0;
          margin: 0 0 28px 0;
          display: flex; flex-direction: column; gap: 12px;
        }
        .ps-points li {
          display: flex; gap: 12px; align-items: flex-start;
          font-size: 0.95rem; line-height: 1.5;
          color: var(--text-secondary);
        }
        .ps-check {
          flex-shrink: 0;
          width: 20px; height: 20px; margin-top: 1px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.1);
        }
        .ps-footer {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(17, 24, 39, 0.07);
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: 14px;
        }
        .ps-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .ps-tags span {
          font-family: var(--font-subtitle);
          font-size: 0.76rem; font-weight: 600;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 4px 9px;
          border-radius: 6px;
        }
        .ps-link {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-subtitle);
          font-size: 0.88rem; font-weight: 700;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.08);
          padding: 9px 16px;
          border-radius: 999px;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        .ps-link svg:last-child { transition: transform 0.2s ease; }
        .ps-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .ps-link--demo {
          border: none;
          cursor: pointer;
          color: #fff;
          background: rgb(var(--tint));
        }

        /* Fenêtre de démo vidéo */
        .demo-backdrop {
          position: fixed; inset: 0;
          z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          background: rgba(17, 24, 39, 0.72);
          backdrop-filter: blur(6px);
        }
        .demo-frame {
          width: min(1100px, 100%);
          border-radius: 18px;
          overflow: hidden;
          background: #0b0f19;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6);
        }
        .demo-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px;
          font-family: var(--font-subtitle);
          font-size: 0.85rem; font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
        }
        .demo-head button {
          border: none; background: none; cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.6rem; line-height: 1;
        }
        .demo-frame video { display: block; width: 100%; height: auto; background: #000; }
        .demo-note {
          margin: 0;
          padding: 10px 16px 12px;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }
        @media (hover: hover) and (pointer: fine) {
          .ps-link:hover { background: rgba(var(--tint), 0.15); }
          .ps-link--demo:hover { background: rgba(var(--tint), 0.88); }
          .ps-link:hover svg:last-child { transform: translate(2px, -2px); }
        }

        /* Mobile : schéma compact sous le texte */
        @media (max-width: 767px) {
          .project-mockup {
            min-width: 0 !important;
            padding: 22px 14px !important;
          }
          .pv { max-width: none; }
          .pv-step { padding: 12px 14px; }
        }

        @media (max-width: 991px) {
          .organic-tree-svg {
            display: none !important;
          }
          .project-card-showcase {
            padding: 10px !important;
            margin-bottom: 40px !important;
            border-radius: 22px !important;
          }
          .project-row {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .ps {
            padding: 22px 16px 16px;
            min-width: 0;
          }
          .project-mockup {
            padding: 32px 16px;
          }
          .project-content {
            width: 100% !important;
            min-width: 100% !important;
          }
          .project-mockup {
            width: 100% !important;
            min-width: 100% !important;
          }
        }
      `}} />
    </section>
  );
};

export default Projects;
