import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import RollingFigure from './RollingFigure';

// Trois repères de l'accueil, réunis dans un seul bandeau sobre (le même matériau que la barre de navigation).
// Chacun donne un chiffre, ce qu'il compte, puis le fait qui le rend concret, et mène à sa section.
const METRICS = [
  {
    kicker: 'Projet en production',
    figure: { value: '200', prefix: '≈ ' },
    title: "personnes utilisent mon appli à\u00A0l'IUT",
    text: "Elle construit seule les emplois du temps de 3\u00A0promotions et 66\u00A0enseignants, soit près de 7\u00A0800 heures de cours par an.",
    href: '#projet-1',
  },
  {
    kicker: 'Recherche en IA',
    figure: { value: '32 000', prefix: '+' },
    title: "commentaires analysés par\u00A0l'IA",
    text: "Trois mois de recherche à l'université Robert Gordon d'Aberdeen, pour mesurer à quel point les débats politiques en ligne divisent.",
    href: '#projet-3',
  },
  {
    kicker: 'Alternance en cours',
    figure: { value: '5', suffix: 'e' },
    rank: true,
    title: 'laboratoire vétérinaire mondial',
    text: "En alternance chez Ceva Santé Animale depuis septembre 2026, je conçois des applications métiers et des outils internes.",
    href: '#timeline',
  },
];

const MetricGrid = () => (
  <div className="mg-grid reveal-on-scroll">
    {METRICS.map((m, i) => (
      <a key={m.href} href={m.href} className="mg-item" style={{ '--n': i }}>
        <span className="mg-kicker">{m.kicker}</span>
        <RollingFigure {...m.figure} className={`mg-figure ${m.rank ? 'mg-figure--rank' : ''}`} />
        <span className="mg-title">{m.title}</span>
        <span className="mg-label">{m.text}</span>
        <ArrowUpRight className="mg-arrow" size={18} aria-hidden="true" />
      </a>
    ))}

    <style dangerouslySetInnerHTML={{ __html: `
      /* Un seul panneau : l'écart de 1px laisse voir le fond, qui dessine les filets entre les colonnes */
      .mg-grid {
        --mg-ease: cubic-bezier(0.22, 1, 0.36, 1);
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1px;
        width: 100%;
        margin-top: 40px;
        overflow: hidden;
        border-radius: 24px;
        border: 1px solid var(--border-color);
        background: var(--border-color);
        box-shadow: 0 1px 2px rgba(17, 24, 39, 0.03), 0 16px 32px -24px rgba(17, 24, 39, 0.1);
      }
      .mg-grid.reveal-on-scroll {
        transform: translateY(32px);
        transition: opacity 700ms var(--mg-ease), transform 700ms var(--mg-ease);
      }
      .mg-grid.reveal-on-scroll.in-view { transform: none; }

      .mg-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 32px;
        text-decoration: none;
        color: var(--text-primary);
        background: var(--bg-primary);
        transition: background-color 300ms var(--mg-ease);
      }
      .mg-kicker {
        max-width: 100%;
        padding-right: 32px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: var(--font-subtitle);
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-muted);
      }
      /* Le chiffre en Space Grotesk, la police du prénom au-dessus ; son unité en bleu, seule couleur du bandeau */
      .mg-figure {
        margin-top: 24px;
        font-family: var(--font-title);
        font-size: 4.5rem;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -0.04em;
        /* Chiffres proportionnels : en chasse fixe, le « 1 » de Space Grotesk prend un empattement lourd */
        font-variant-numeric: normal;
        color: var(--text-primary);
      }
      .mg-figure .roll-affix { font-size: 0.45em; font-weight: 600; letter-spacing: -0.02em; color: var(--accent); }
      .mg-figure .roll-affix--suffix { margin-left: 0.25em; }
      /* « ≈ » et « + » se centrent sur la hauteur des chiffres au lieu de tomber sur la ligne de base */
      .mg-figure .roll-affix:not(.roll-affix--suffix) { align-self: center; margin-right: 0.12em; }
      /* Rang (« 5e ») : la lettre monte en exposant */
      .mg-figure--rank .roll-affix--suffix { align-self: flex-start; margin: 0.12em 0 0 0.06em; }
      /* Ce que le chiffre compte, puis le fait qui le rend concret */
      .mg-title {
        margin-top: 8px;
        font-family: var(--font-subtitle);
        font-size: 1.125rem;
        line-height: 1.75rem;
        font-weight: 600;
        text-wrap: balance;
        color: var(--text-primary);
      }
      .mg-label {
        max-width: 40ch;
        margin-top: 8px;
        font-family: var(--font-body);
        font-size: 1rem;
        line-height: 1.5rem;
        color: var(--text-secondary);
        text-wrap: pretty;
      }
      .mg-arrow {
        position: absolute;
        top: 30px;
        right: 30px;
        color: var(--text-muted);
        transition: transform 500ms var(--mg-ease), color 300ms var(--mg-ease);
      }

      .mg-item:focus-visible { outline: 3px solid var(--accent); outline-offset: -3px; border-radius: 8px; }
      .mg-item:active { background: var(--bg-tertiary); }
      @media (hover: hover) and (pointer: fine) {
        .mg-item:hover { background: var(--bg-secondary); }
        .mg-item:hover .mg-arrow { color: var(--accent); transform: translate(2px, -2px); }
      }

      /* Les chiffres défilent une fois, quand le bandeau arrive à l'écran */
      @media (prefers-reduced-motion: no-preference) {
        .mg-grid:not(.in-view) .roll-strip { transform: translateY(0); }
        .mg-grid.in-view .roll-strip {
          animation: roll-in 1.2s var(--mg-ease) both;
          animation-delay: calc(200ms + var(--n) * 120ms + var(--i) * 80ms);
        }
      }

      @media (max-width: 1080px) {
        .mg-item { padding: 24px; }
        .mg-figure { font-size: 3rem; }
        .mg-arrow { top: 22px; right: 22px; }
      }
      /* Tablette et téléphone : les trois repères s'empilent dans le même panneau, séparés par les mêmes filets */
      @media (max-width: 900px) {
        .mg-grid { grid-template-columns: 1fr; }
        .mg-figure { margin-top: 16px; font-size: 3.75rem; }
        .mg-label { max-width: 56ch; }
      }
    `}} />
  </div>
);

export default MetricGrid;
