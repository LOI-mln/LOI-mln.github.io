import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import RollingFigure from './RollingFigure';

// Trois repères de l'accueil, en cartes claires comme le reste du site ; chacun mène à sa section
const METRICS = [
  {
    figure: { value: '200', prefix: '≈ ' },
    label: "personnes utilisent mon appli d'emplois du temps à l'IUT",
    href: '#projet-1',
  },
  {
    figure: { value: '3', suffix: 'mois' },
    label: "de recherche en IA à l'université Robert Gordon d'Aberdeen",
    href: '#projet-3',
  },
  {
    figure: { value: '1', suffix: 'an' },
    label: "d'alternance comme développeur chez Ceva Santé Animale",
    href: '#timeline',
  },
];

const MetricGrid = () => (
  <div className="mg-grid">
    {METRICS.map((m, i) => (
      <a key={m.href} href={m.href} className="mg-tile" style={{ '--n': i }}>
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
        min-height: 190px;
        padding: 26px 28px;
        border-radius: 24px;
        text-decoration: none;
        color: var(--text-primary);
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 16px rgba(17, 24, 39, 0.04);
        transition: transform var(--duration-normal) var(--ease-out), border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
      }

      /* Le chiffre en Syne bleu nuit, son unité en bleu */
      .mg-figure {
        font-family: var(--font-display);
        font-size: clamp(3rem, 5.4vw, 4.6rem);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.05em;
        color: var(--text-primary);
      }
      .mg-figure .roll-affix { font-size: 0.5em; letter-spacing: -0.02em; color: var(--accent); }
      .mg-figure .roll-affix--suffix { margin-left: 0.35em; }
      .mg-label {
        max-width: 28ch;
        font-family: var(--font-body);
        font-size: 1rem;
        line-height: 1.45;
        color: var(--text-secondary);
      }
      .mg-arrow {
        position: absolute;
        top: 24px;
        right: 24px;
        color: var(--text-muted);
        transition: transform var(--duration-normal) var(--ease-out), color var(--duration-normal) var(--ease-out);
      }
      .mg-tile:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
      .mg-tile:active { transform: scale(0.98); }
      @media (hover: hover) and (pointer: fine) {
        .mg-tile:hover { transform: translateY(-3px); border-color: var(--border-color-hover); box-shadow: 0 16px 36px rgba(17, 24, 39, 0.08); }
        .mg-tile:hover .mg-arrow { color: var(--accent); transform: translate(2px, -2px); }
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
