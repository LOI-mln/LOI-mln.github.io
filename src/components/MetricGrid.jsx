import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import RollingFigure from './RollingFigure';

// Trois repères de l'accueil, en aplats de couleur comme les affiches des projets ; chacun mène à sa section
const METRICS = [
  {
    figure: { value: '200', prefix: '≈ ' },
    label: "personnes utilisent mon appli d'emplois du temps à l'IUT",
    href: '#projet-1',
    tone: 'emerald',
  },
  {
    figure: { value: '3', suffix: 'mois' },
    label: "de recherche en IA à l'université Robert Gordon d'Aberdeen",
    href: '#projet-3',
    tone: 'accent',
  },
  {
    figure: { value: '1', suffix: 'an' },
    label: "d'alternance comme développeur chez Ceva Santé Animale",
    href: '#timeline',
    tone: 'ink',
  },
];

const MetricGrid = () => (
  <div className="mg-grid">
    {METRICS.map((m, i) => (
      <a key={m.href} href={m.href} className={`mg-tile mg-tile--${m.tone}`} style={{ '--n': i }}>
        <RollingFigure {...m.figure} className="mg-figure" />
        <span className="mg-label">{m.label}</span>
        <ArrowUpRight className="mg-arrow" size={20} aria-hidden="true" />
      </a>
    ))}

    <style dangerouslySetInnerHTML={{ __html: `
      .mg-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
        width: 100%;
        margin-top: 60px;
      }
      .mg-tile {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 28px;
        min-height: 200px;
        padding: 26px 28px;
        border-radius: 24px;
        color: #ffffff;
        text-decoration: none;
        background: rgb(var(--tone));
        transition: transform var(--duration-normal) var(--ease-out), background-color var(--duration-normal) var(--ease-out);
      }
      .mg-tile--emerald { --tone: 5, 150, 105; }
      .mg-tile--accent { --tone: 37, 99, 235; }
      .mg-tile--ink { --tone: 17, 24, 39; }

      .mg-figure {
        font-family: var(--font-display);
        font-size: clamp(3rem, 5.4vw, 4.6rem);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.05em;
      }
      .mg-figure .roll-affix { font-size: 0.5em; letter-spacing: -0.02em; }
      .mg-figure .roll-affix--suffix { margin-left: 0.35em; }
      .mg-label {
        max-width: 26ch;
        font-family: var(--font-body);
        font-size: 1rem;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.88);
      }
      .mg-arrow {
        position: absolute;
        top: 24px;
        right: 24px;
        opacity: 0.6;
        transition: transform var(--duration-normal) var(--ease-out), opacity var(--duration-normal) var(--ease-out);
      }
      .mg-tile:focus-visible { outline: 3px solid rgb(var(--tone)); outline-offset: 3px; }
      .mg-tile:active { transform: scale(0.98); }
      @media (hover: hover) and (pointer: fine) {
        .mg-tile:hover { transform: translateY(-3px); }
        .mg-tile:hover .mg-arrow { opacity: 1; transform: translate(2px, -2px); }
      }

      /* Les chiffres défilent quand les tuiles arrivent à l'écran (elles sont sous la ligne de flottaison) ;
         sans animation au défilement, ils défilent une fois au chargement, tuile après tuile */
      @media (prefers-reduced-motion: no-preference) {
        .mg-figure .roll-strip {
          animation: roll-in 1.1s var(--ease-out) both;
          animation-delay: calc(400ms + var(--n) * 120ms + var(--i) * 70ms);
        }
        @supports (animation-timeline: view()) {
          .mg-tile { view-timeline: --tile block; }
          .mg-figure .roll-strip {
            animation-duration: auto;
            animation-delay: 0s;
            animation-timeline: --tile;
            animation-range: entry calc(10% + var(--n) * 8% + var(--i) * 6%) cover calc(45% + var(--n) * 4%);
          }
        }
      }

      @media (max-width: 860px) {
        .mg-grid { grid-template-columns: 1fr; gap: 12px; margin-top: 40px; }
        .mg-tile { min-height: 0; gap: 12px; padding: 20px 22px; }
        .mg-figure { font-size: 2.8rem; }
        .mg-label { font-size: 0.95rem; }
        .mg-arrow { top: 20px; right: 20px; }
      }
    `}} />
  </div>
);

export default MetricGrid;
