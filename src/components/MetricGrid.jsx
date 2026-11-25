import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import RollingFigure from './RollingFigure';
import { Badge } from './JourneyDocuments';

// Fenêtre miniature : une vraie capture de la démo, recadrée sur ce qui se lit en petit
// (zoom : agrandissement ; x, y : décalage du recadrage, en % de la largeur de la fenêtre)
const MiniWindow = ({ title, src, zoom, x, y }) => (
  <div className="mg-win" style={{ '--zoom': zoom, '--x': x, '--y': y }}>
    <div className="mg-win-bar">
      <span className="mg-win-dots"><i /><i /><i /></span>
      <span className="mg-win-title">{title}</span>
    </div>
    <div className="mg-win-body">
      <img src={src} alt="" loading="lazy" decoding="async" />
    </div>
  </div>
);

// Enveloppe commune : la cellule apparaît au défilement, la carte entière est le lien vers sa section
const Card = ({ n, tone, href, lead, label, children }) => (
  <div className={`mg-cell ${lead ? 'mg-cell--lead' : ''} reveal-on-scroll`} style={{ '--n': n }}>
    <a href={href} className={`mg-card mg-card--${tone}`} aria-label={label}>
      {children}
    </a>
  </div>
);

const More = ({ children }) => (
  <span className="mg-more">
    {children}
    <ArrowUpRight size={16} aria-hidden="true" />
  </span>
);

// Trois repères de l'accueil : chacun montre sa preuve (la démo du projet, le badge de l'alternance)
// à la couleur de son établissement, comme les fiches des projets, et mène à sa section
const MetricGrid = () => (
  <div className="mg-grid">
    <Card
      n={0}
      lead
      tone="unilim"
      href="#projet-1"
      label="Environ 200 personnes utilisent mon appli d'emplois du temps à l'IUT. Voir le projet"
    >
      <div className="mg-copy">
        <div className="mg-head">
          <img className="mg-logo" src="/img/logos/iut-unilim.png" alt="" />
          <More>Voir le projet</More>
        </div>
        <p className="mg-status">Application en production</p>
        <div className="mg-fact">
          <RollingFigure value="200" prefix="≈ " className="mg-figure" />
          <p className="mg-label">personnes utilisent mon appli d'emplois du temps à l'IUT</p>
        </div>
      </div>
      <div className="mg-stage" aria-hidden="true">
        <MiniWindow title="Unilim EDT · Emploi du temps" src="/videos/unilim-edt-demo.jpg" zoom={1.485} x={11.6} y={34.8} />
      </div>
    </Card>

    <Card
      n={1}
      tone="rgu"
      href="#projet-3"
      label="3 mois de recherche en IA à l'université Robert Gordon d'Aberdeen. Voir le projet"
    >
      <div className="mg-copy">
        <div className="mg-head">
          <img className="mg-logo mg-logo--rgu" src="/img/logos/rgu.svg" alt="" />
        </div>
        <div className="mg-fact">
          <RollingFigure value="3" suffix="mois" className="mg-figure" />
          <p className="mg-label">de recherche en IA à l'université Robert Gordon d'Aberdeen</p>
        </div>
        <More>Voir le projet</More>
      </div>
      <div className="mg-stage" aria-hidden="true">
        <MiniWindow title="We vs Them" src="/videos/rgu-dashboard-demo.jpg" zoom={1.8} x={93} y={21} />
      </div>
    </Card>

    <Card
      n={2}
      tone="ceva"
      href="#timeline"
      label="1 an d'alternance comme développeur chez Ceva Santé Animale. Voir le parcours"
    >
      <div className="mg-copy">
        <div className="mg-head">
          <p className="mg-status">En cours depuis sept. 2026</p>
        </div>
        <div className="mg-fact">
          <RollingFigure value="1" suffix="an" className="mg-figure" />
          <p className="mg-label">d'alternance comme développeur chez Ceva Santé Animale</p>
        </div>
        <More>Voir le parcours</More>
      </div>
      <div className="mg-stage mg-stage--badge" aria-hidden="true">
        <div className="mg-lanyard">
          <div className="mg-badge"><Badge /></div>
        </div>
      </div>
    </Card>

    <style dangerouslySetInnerHTML={{ __html: `
      .mg-grid {
        --mg-ease: cubic-bezier(0.22, 1, 0.36, 1);
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        grid-auto-rows: minmax(264px, auto);
        gap: 16px;
        width: 100%;
        margin-top: 40px;
      }
      /* Le projet en production occupe la grande case ; la recherche et l'alternance se partagent la colonne de droite */
      .mg-cell { grid-column: span 5; display: flex; min-width: 0; }
      .mg-cell--lead { grid-column: span 7; grid-row: span 2; }
      .mg-cell.reveal-on-scroll {
        transform: translateY(32px);
        transition: opacity 700ms var(--mg-ease), transform 700ms var(--mg-ease);
        transition-delay: calc(var(--n) * 90ms);
      }
      .mg-cell.reveal-on-scroll.in-view { transform: none; }

      /* Carte blanche, et sa preuve posée sur un panneau à la couleur de l'établissement (comme les fiches des projets) */
      .mg-card {
        position: relative;
        flex: 1;
        min-width: 0;
        display: flex;
        gap: 12px;
        padding: 12px;
        border-radius: 24px;
        text-decoration: none;
        color: var(--text-primary);
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04), 0 16px 32px -16px rgba(17, 24, 39, 0.1);
        transition: transform 500ms var(--mg-ease), box-shadow 500ms var(--mg-ease), border-color 300ms var(--mg-ease);
      }
      .mg-card--unilim { --tint: 168, 30, 36; }
      .mg-card--rgu { --tint: 113, 33, 119; }
      .mg-card--ceva { --tint: var(--accent-rgb); }
      .mg-cell--lead .mg-card { flex-direction: column; }
      .mg-card p { margin: 0; }

      .mg-copy {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 16px 12px 16px 16px;
      }
      .mg-cell--lead .mg-copy { flex: none; align-self: stretch; padding: 16px 16px 12px; }
      .mg-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; min-height: 24px; }
      .mg-logo { display: block; height: 40px; width: auto; }
      .mg-logo--rgu { height: 24px; }
      .mg-status {
        display: inline-flex;
        align-items: baseline;
        gap: 8px;
        font-family: var(--font-subtitle);
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 700;
        color: rgb(var(--tint));
      }
      .mg-status::before { content: ''; flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; background: currentColor; translate: 0 -1px; }
      .mg-cell--lead .mg-status { margin-top: 24px; }

      /* Le chiffre en Syne à la couleur de l'établissement, sa phrase à côté (grande case) ou dessous */
      .mg-fact { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
      .mg-cell--lead .mg-fact { flex-direction: row; align-items: flex-end; gap: 24px; margin-top: 8px; }
      .mg-figure {
        flex-shrink: 0;
        font-family: var(--font-display);
        font-size: 3.75rem;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.05em;
        color: rgb(var(--tint));
      }
      .mg-cell--lead .mg-figure { font-size: 6rem; }
      .mg-figure .roll-affix { font-size: 0.5em; letter-spacing: -0.02em; }
      .mg-figure .roll-affix--suffix { margin-left: 0.3em; }
      .mg-label {
        font-family: var(--font-body);
        font-size: 1rem;
        line-height: 1.5rem;
        color: var(--text-secondary);
        text-wrap: pretty;
      }
      .mg-cell--lead .mg-label { max-width: 28ch; padding-bottom: 8px; font-size: 1.125rem; line-height: 1.75rem; color: var(--text-primary); text-wrap: balance; }

      .mg-more {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-top: auto;
        padding-top: 12px;
        font-family: var(--font-subtitle);
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 700;
        white-space: nowrap;
        color: rgb(var(--tint));
      }
      .mg-head .mg-more { margin-top: 0; padding-top: 0; }
      .mg-more svg { transition: transform 500ms var(--mg-ease); }

      /* Panneau teinté : rayon = rayon de la carte moins l'écart (24 - 12) */
      .mg-stage {
        position: relative;
        flex: none;
        width: 200px;
        overflow: hidden;
        border-radius: 12px;
        background: rgba(var(--tint), 0.09);
      }
      .mg-cell--lead .mg-stage { flex: 1; width: auto; min-height: 240px; }
      .mg-stage--badge { min-height: 240px; }

      /* Fenêtre de démo, coupée par le bord du panneau */
      .mg-win {
        position: absolute;
        top: 32px;
        left: 20px;
        width: 300px;
        border-radius: 12px;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid rgba(17, 24, 39, 0.1);
        box-shadow: 0 2px 4px rgba(17, 24, 39, 0.06), 0 24px 48px -16px rgba(var(--tint), 0.45);
        transition: transform 500ms var(--mg-ease);
      }
      .mg-cell--lead .mg-win { top: 32px; left: 32px; right: 32px; width: auto; }
      .mg-win-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--bg-secondary); }
      .mg-win-dots { display: flex; gap: 4px; flex-shrink: 0; }
      .mg-win-dots i { width: 8px; height: 8px; border-radius: 50%; background: #ff5f57; }
      .mg-win-dots i:nth-child(2) { background: #febc2e; }
      .mg-win-dots i:nth-child(3) { background: #28c840; }
      .mg-win-title {
        flex: 1;
        min-width: 0;
        padding-right: 32px;
        text-align: center;
        font-family: var(--font-body);
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-secondary);
      }
      .mg-cell:not(.mg-cell--lead) .mg-win-title { padding-right: 0; text-align: left; }
      .mg-win-body { aspect-ratio: 16 / 10; overflow: hidden; background: var(--bg-secondary); }
      .mg-win-body img {
        display: block;
        width: calc(var(--zoom, 1) * 100%);
        max-width: none;
        margin-left: calc(var(--x, 0) * -1%);
        margin-top: calc(var(--y, 0) * -1%);
      }

      /* Badge de l'alternance, pendu à son cordon : il se balance au survol */
      .mg-lanyard {
        position: absolute;
        top: 0;
        --s: 0.56;
        left: 50%;
        width: 0;
        transform-origin: 50% 0;
        transform: rotate(4deg);
        transition: transform 700ms var(--mg-ease);
      }
      .mg-lanyard::before {
        content: '';
        position: absolute;
        z-index: 1;
        top: -8px;
        left: -6px;
        width: 12px;
        height: calc(40px + 36px * var(--s));
        border-radius: 2px;
        background: var(--bg-inverse);
      }
      .mg-badge { position: absolute; top: 32px; left: -115px; width: 230px; transform: scale(var(--s)); transform-origin: 50% 0; }
      .mg-badge .doc { box-shadow: 0 4px 8px rgba(17, 24, 39, 0.08), 0 32px 48px -16px rgba(var(--tint), 0.5); }

      .mg-card:focus-visible { outline: 3px solid rgb(var(--tint)); outline-offset: 4px; }
      .mg-card:active { transform: scale(0.985); }
      @media (hover: hover) and (pointer: fine) {
        .mg-card:hover {
          transform: translateY(-4px);
          border-color: rgba(var(--tint), 0.3);
          box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04), 0 32px 48px -24px rgba(var(--tint), 0.35);
        }
        .mg-card:hover .mg-more svg { transform: translate(2px, -2px); }
        .mg-card:hover .mg-win { transform: translateY(-8px); }
        .mg-card:hover .mg-lanyard { transform: rotate(-3deg); }
      }

      /* En mouvement : la preuve monte dans son panneau après la carte, et les chiffres défilent une fois, à l'arrivée */
      @media (prefers-reduced-motion: no-preference) {
        .mg-cell:not(.in-view) .mg-win, .mg-cell:not(.in-view) .mg-lanyard { opacity: 0; }
        .mg-cell.in-view .mg-win { animation: mg-rise 800ms var(--mg-ease) backwards; animation-delay: calc(200ms + var(--n) * 90ms); }
        .mg-cell.in-view .mg-lanyard { animation: mg-swing 1s cubic-bezier(0.34, 1.4, 0.64, 1) backwards; animation-delay: calc(200ms + var(--n) * 90ms); }
        .mg-cell:not(.in-view) .roll-strip { transform: translateY(0); }
        .mg-cell.in-view .roll-strip {
          animation: roll-in 1.2s var(--mg-ease) both;
          animation-delay: calc(250ms + var(--n) * 90ms + var(--i) * 80ms);
        }
      }
      @keyframes mg-rise { from { opacity: 0; transform: translateY(32px); } }
      @keyframes mg-swing { from { opacity: 0; transform: rotate(-14deg); } }

      /* Tablette : la grande case sur toute la largeur, les deux autres côte à côte */
      @media (max-width: 1080px) {
        .mg-cell { grid-column: span 6; }
        .mg-cell--lead { grid-column: span 12; grid-row: auto; }
        .mg-cell--lead .mg-stage { min-height: 280px; }
      }
      /* Plus étroit : une colonne, les petites cases s'allongent et gardent leur preuve à droite */
      @media (max-width: 960px) {
        .mg-grid { grid-auto-rows: auto; }
        .mg-cell, .mg-cell--lead { grid-column: span 12; }
        .mg-stage { width: 240px; min-height: 216px; }
      }
      @media (max-width: 760px) {
        .mg-grid { gap: 12px; }
        .mg-copy { padding: 12px 4px 12px 12px; }
        .mg-cell--lead .mg-copy { padding: 12px 12px 8px; }
        .mg-logo { height: 32px; }
        .mg-logo--rgu { height: 20px; }
        .mg-cell--lead .mg-status { margin-top: 16px; }
        .mg-cell--lead .mg-fact { flex-direction: column; align-items: flex-start; gap: 8px; }
        .mg-cell--lead .mg-figure { font-size: 4.5rem; }
        .mg-cell--lead .mg-label { padding-bottom: 0; font-size: 1rem; line-height: 1.5rem; }
        .mg-figure { font-size: 3rem; }
        .mg-stage, .mg-stage--badge { width: 128px; min-height: 232px; }
        .mg-lanyard { --s: 0.46; }
        .mg-cell--lead .mg-stage { min-height: 200px; }
        .mg-cell--lead .mg-win { top: 24px; left: 16px; right: 16px; }
        .mg-win { top: 24px; left: 16px; width: 240px; }
        .mg-cell:not(.mg-cell--lead) .mg-win-title { visibility: hidden; }
      }
    `}} />
  </div>
);

export default MetricGrid;
