import React, { useEffect, useRef, useState } from 'react';
import { Code, Cpu, Server, Database, Users, ShieldAlert, ShieldCheck, Sparkles, Monitor, Building2 } from 'lucide-react';
import AntigravityCanvas from '../components/AntigravityCanvas';

// Canvas de fond ondulé
const SkillsMesh = ({ mode }) => {
  return (
    <AntigravityCanvas
      mode={mode}
      colorScheme="blue"
      density="low"
      clusterRight={false}
      velocityStretch={false}
    />
  );
};

// Les six compétences du BUT, dans l'ordre de la grille
const SKILLS = [
  {
    code: 'C1', title: 'Réaliser', icon: <Code size={20} />,
    highlights: ['Applications métiers chez Ceva Santé Animale', 'Unilim EDT : Laravel 11, Vue 3, OR-Tools', 'Questionary : Vue.js, réponses libres'],
    techs: ['React', 'Vue.js', 'Node.js', 'TypeScript', 'Python', 'PHP'],
  },
  {
    code: 'C2', title: 'Optimiser', icon: <Cpu size={20} />,
    highlights: ['Solveur OR-Tools CP-SAT (Unilim EDT)', 'Moteur de streaming FFmpeg', 'Exploration active de Rust'],
    techs: ['Python', 'OR-Tools', 'Rust', 'Java', 'Lua'],
  },
  {
    code: 'C3', title: 'Administrer', icon: <Server size={20} />,
    highlights: ['Postes et serveurs sous NixOS', 'Clusters Proxmox VE', 'Homelab personnel sécurisé'],
    techs: ['Proxmox VE', 'Docker', 'NixOS'],
  },
  {
    code: 'C4', title: 'Gérer', icon: <Database size={20} />,
    highlights: ['Schémas normalisés MariaDB', 'Optimisation des index SQL', 'Modélisation relationnelle'],
    techs: ['MariaDB', 'MySQL', 'SQL'],
  },
  {
    code: 'C5', title: 'Conduire', icon: <Users size={20} />,
    highlights: ['Scrum chez Ceva Santé Animale', "Lead d'une équipe de 4 devs (Unilim EDT)", 'Stage Erasmus+ de R&D en Écosse'],
    techs: ['Agile', 'Git', 'Gestion de projet'],
  },
  {
    code: 'C6', title: 'Sécuriser', icon: <ShieldAlert size={20} />,
    highlights: ['Cours Cisco de cybersécurité validé', 'Réseau multi-zones (Kathara)', 'Chiffrement AES-256'],
    techs: ['Cybersécurité', 'Cryptographie', 'Sécurité réseau'],
  },
];

// Outils et repères affichés dans la dernière carte
const TOOLBOX = [
  { label: 'Environnement', icon: <Monitor size={15} />, items: ['macOS', 'NixOS', 'Proxmox', 'Docker'] },
  { label: 'IA & automatisation', icon: <Sparkles size={15} />, items: ['NLP', 'CLIP', 'OR-Tools', 'LLM'], tone: 'ai' },
  { label: 'Certification', icon: <ShieldCheck size={15} />, items: ['Cisco · Introduction à la cybersécurité'], tone: 'ok' },
  { label: 'Entreprise', icon: <Building2 size={15} />, items: ['Alternance · Ceva Santé Animale'], tone: 'ai' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Caractères de largeur moyenne en Syne, pour que le titre ne déborde pas pendant le décodage
const GLYPHS = 'ABCDEHKNOPRSTUXZ0123456789#$%&';

// Titre qui se décode lettre par lettre : une fois à l'apparition, puis à chaque survol de la carte
const ScrambleTitle = ({ text, replay }) => {
  const ref = useRef(null);
  const frame = useRef(0);
  const [shown, setShown] = useState(text);

  const play = () => {
    if (prefersReducedMotion() || frame.current) return;
    const start = performance.now();
    const duration = 500 + text.length * 45;
    let lastSwap = 0;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const fixed = Math.floor(progress * text.length);
      if (now - lastSwap > 45 || progress === 1) {
        lastSwap = now;
        setShown([...text].map((ch, i) => (i < fixed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''));
      }
      frame.current = progress < 1 ? requestAnimationFrame(tick) : 0;
    };
    frame.current = requestAnimationFrame(tick);
  };

  // Premier décodage quand le titre arrive à l'écran
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { play(); observer.disconnect(); }
    }, { threshold: 0.8 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame.current); frame.current = 0; };
  }, []);

  useEffect(() => { if (replay) play(); }, [replay]);

  return (
    <h3 ref={ref} className="sk-card-title" aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </h3>
  );
};

// Carte d'une compétence : tout son contenu est visible, sans clic
const SkillCard = ({ code, title, icon, highlights, techs, featured, delay }) => {
  const [replay, setReplay] = useState(0);
  return (
    <div className={`sk-cell reveal-on-scroll ${delay}`}>
      <article
        className={`sk-card ${featured ? 'sk-card--featured' : ''}`}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setReplay((r) => r + 1)}
      >
        <span className="sk-card-light" aria-hidden="true" />
        <div className="sk-card-top">
          <span className="sk-card-icon">{icon}</span>
          <span className="sk-card-code">{code}</span>
          <span className="sk-card-level">Niveau 3</span>
        </div>
        <ScrambleTitle text={title} replay={replay} />
        <ul className="sk-card-list">
          {highlights.map((h) => <li key={h}>{h}</li>)}
        </ul>
        <div className="sk-card-tags">
          {techs.map((t) => <span key={t} className="sk-card-tag">{t}</span>)}
        </div>
      </article>
    </div>
  );
};

// Lumière qui suit la souris sur toute la grille, et inclinaison de la carte survolée
const useSpotlight = () => {
  const gridRef = useRef(null);
  const frame = useRef(0);

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const { clientX, clientY, target } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const hovered = target.closest('.sk-card');
      gridRef.current?.querySelectorAll('.sk-card').forEach((card) => {
        const r = card.getBoundingClientRect();
        const x = clientX - r.left;
        const y = clientY - r.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        const tilt = card === hovered;
        card.style.setProperty('--rx', tilt ? `${(0.5 - y / r.height) * 7}deg` : '0deg');
        card.style.setProperty('--ry', tilt ? `${(x / r.width - 0.5) * 9}deg` : '0deg');
      });
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    gridRef.current?.querySelectorAll('.sk-card').forEach((card) => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return { gridRef, onPointerMove, onPointerLeave };
};

// Section des compétences
const Skills = ({ theme }) => {
  const { gridRef, onPointerMove, onPointerLeave } = useSpotlight();
  return (
    <section id="skills" className="sk-section">
      <SkillsMesh mode={theme} />

      <div className="sk-inner">
        {/* En-tête de la section */}
        <div className="sk-header reveal-on-scroll">
          <div className="organic-badge" style={{ marginBottom: '16px' }}>
            MATRICE DE COMPÉTENCES
          </div>
          <h2 className="sk-title">
            Savoir-faire{' '}
            <span className="accent-glow-text" style={{ padding: '0 0.05em' }}>Professionnels</span>
          </h2>
          <p className="sk-subtitle">
            Compétences validées par le BUT Informatique et mon alternance chez Ceva Santé Animale, enrichies par mes projets et mon stage international.
          </p>
        </div>

        {/* Grille : deux rangées de trois compétences, Réaliser en vedette, puis la boîte à outils */}
        <div className="sk-grid" ref={gridRef} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
          {SKILLS.map((skill, i) => (
            <SkillCard key={skill.code} {...skill} featured={i === 0} delay={`delay-${(i % 3) * 100}`} />
          ))}

          <div className="sk-cell sk-cell--tools reveal-on-scroll delay-100">
            <aside className="sk-card sk-tools" aria-label="Boîte à outils">
              <span className="sk-card-light" aria-hidden="true" />
              <div className="sk-tools-grid">
                {TOOLBOX.map((group) => (
                  <div key={group.label} className={`sk-tools-group ${group.tone ? `sk-tools-group--${group.tone}` : ''}`}>
                    <span className="sk-tools-label">{group.icon}{group.label}</span>
                    <div className="sk-card-tags">
                      {group.items.map((item) => <span key={item} className="sk-card-tag">{item}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .sk-section {
          position: relative;
          background-color: var(--bg-secondary);
          overflow: hidden;
        }
        .sk-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px;
        }

        /* Styles de l'en-tête */
        .sk-header { text-align: center; margin-bottom: 40px; }
        .sk-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.04em;
          text-transform: uppercase;
          line-height: 1.2;
          margin: 0;
        }
        .sk-subtitle {
          max-width: 580px;
          margin: 12px auto 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* Grille : deux rangées de trois, puis la boîte à outils sur toute la largeur */
        .sk-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        /* Les cellules portent l'apparition au défilement, les cartes s'inclinent dedans */
        .sk-cell { display: flex; min-width: 0; }
        .sk-cell > .sk-card { flex: 1; }
        .sk-cell--tools { grid-column: 1 / -1; }

        /* Carte d'une compétence */
        .sk-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 22px 24px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 4px 16px rgba(17, 24, 39, 0.03);
          container-type: inline-size;
          transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px));
          transition: transform 0.4s var(--ease-out),
                      border-color var(--duration-normal) var(--ease-out),
                      box-shadow var(--duration-normal) var(--ease-out);
        }
        .sk-card > *:not(.sk-card-light) { position: relative; }

        /* Lumière : un halo dans la carte survolée, et un liseré qui éclaire les bordures de toute la grille */
        .sk-card-light {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--accent-rgb), 0.12), transparent 45%);
          opacity: 0;
          transition: opacity var(--duration-moderate) var(--ease-out);
          pointer-events: none;
        }
        .sk-card::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1.5px;
          border-radius: inherit;
          background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--accent-rgb), 0.9), rgba(var(--accent-rgb), 0.25) 40%, transparent 70%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity var(--duration-moderate) var(--ease-out);
          pointer-events: none;
        }
        @media (hover: hover) and (pointer: fine) {
          .sk-grid:hover .sk-card::after { opacity: 1; }
          .sk-card:hover .sk-card-light { opacity: 1; }
          .sk-card:hover {
            --lift: -4px;
            transition: transform 0.12s linear,
                        border-color var(--duration-normal) var(--ease-out),
                        box-shadow var(--duration-normal) var(--ease-out);
            box-shadow: 0 22px 44px rgba(17, 24, 39, 0.1);
          }
          .sk-card:hover .sk-card-icon {
            background: var(--accent-gradient);
            color: #ffffff;
            box-shadow: 0 6px 18px rgba(var(--accent-rgb), 0.35);
          }
        }

        .sk-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .sk-card-icon {
          width: 36px; height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--accent-light);
          color: var(--accent-hover);
          transition: background-color var(--duration-normal) var(--ease-out),
                      color var(--duration-normal) var(--ease-out),
                      box-shadow var(--duration-normal) var(--ease-out);
        }
        .sk-card-code {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-hover);
        }
        .sk-card-level {
          margin-left: auto;
          font-family: var(--font-subtitle);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          white-space: nowrap;
        }

        /* Syne est très large : « Administrer » fait 11,6 em, la taille suit donc la largeur de la carte */
        .sk-card-title {
          font-family: var(--font-display);
          font-size: min(1.6rem, 100cqi / 12);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--text-primary);
          margin: 0 0 14px;
          white-space: nowrap;
        }

        .sk-card-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sk-card-list li {
          position: relative;
          padding-left: 16px;
          font-family: var(--font-body);
          font-size: 0.86rem;
          line-height: 1.4;
          color: var(--text-primary);
        }
        .sk-card-list li::before {
          content: '';
          position: absolute;
          left: 0; top: 0.5em;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
        }

        .sk-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
        }
        .sk-card-tag {
          font-family: var(--font-subtitle);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--bg-tertiary);
          padding: 4px 11px;
          border-radius: 50px;
        }

        /* Réaliser, en vedette : carte sombre avec un reflet bleu */
        .sk-card--featured {
          background: var(--bg-inverse);
          border-color: rgba(255, 255, 255, 0.06);
          color: var(--text-inverse);
          box-shadow: 0 20px 48px rgba(17, 24, 39, 0.18);
        }
        .sk-card--featured::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 100% 0%, rgba(var(--accent-rgb), 0.35), transparent 60%);
          pointer-events: none;
        }
        .sk-card--featured .sk-card-light {
          background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(147, 197, 253, 0.16), transparent 45%);
        }
        .sk-card--featured .sk-card-icon { background: var(--accent-gradient); color: #ffffff; }
        .sk-card--featured .sk-card-code { color: #93c5fd; }
        .sk-card--featured .sk-card-level { color: rgba(255, 255, 255, 0.55); }
        .sk-card--featured .sk-card-title { color: #ffffff; }
        .sk-card--featured .sk-card-list li { color: #ffffff; }
        .sk-card--featured .sk-card-list li::before { background: #60a5fa; }
        .sk-card--featured .sk-card-tag { color: #ffffff; background: rgba(255, 255, 255, 0.1); }
        @media (hover: hover) and (pointer: fine) {
          .sk-card--featured:hover { box-shadow: 0 28px 60px rgba(17, 24, 39, 0.28); }
        }

        /* Boîte à outils : une bande de quatre groupes */
        .sk-tools-grid {
          display: grid;
          grid-template-columns: repeat(4, auto);
          justify-content: space-between;
          gap: 16px 24px;
        }
        .sk-tools .sk-card-tag { white-space: nowrap; }
        .sk-tools-group { display: flex; flex-direction: column; gap: 8px; }
        .sk-tools-group .sk-card-tags { margin-top: 0; }
        .sk-tools-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-subtitle);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }
        .sk-tools-group--ai .sk-tools-label { color: var(--accent-hover); }
        .sk-tools-group--ai .sk-card-tag { color: var(--accent-hover); background: var(--accent-light); }
        .sk-tools-group--ok .sk-tools-label { color: #047857; }
        .sk-tools-group--ok .sk-card-tag { background: rgba(16, 185, 129, 0.1); }

        /* Écrans moyens : la boîte à outils passe ses groupes sur deux colonnes */
        @media (max-width: 1100px) {
          .sk-tools-grid { grid-template-columns: repeat(2, auto); justify-content: start; column-gap: 48px; }
        }
        /* Tablette : deux colonnes */
        @media (max-width: 860px) {
          .sk-grid { grid-template-columns: 1fr 1fr; }
        }
        /* « Professionnels » est très long en Syne : la taille suit la largeur d'écran */
        @media (max-width: 560px) {
          .sk-title { font-size: 5.6vw; }
        }
        @media (max-width: 640px) {
          .sk-grid { grid-template-columns: 1fr; gap: 12px; }
          .sk-card { padding: 20px; }
          .sk-tools-grid { grid-template-columns: 1fr; gap: 14px; }
          .sk-tools .sk-card-tag { white-space: normal; }
        }
      `}} />
    </section>
  );
};

export default Skills;
