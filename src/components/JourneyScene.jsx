import React, { useEffect, useRef } from 'react';
import { Calendar, MapPin, ShieldCheck, Building2, ChevronDown } from 'lucide-react';
// Contours et fleuves Natural Earth (domaine public) projetés en Mercator, de l'Atlantique à la Pologne
import map from '../data/journey-map.json';

const { width, height, countries, rivers, cities } = map;
const at = (key) => cities[key].join(' ');

// Villes du parcours, dans l'ordre des étapes ; Libourne et Sainte-Foy sont voisines, leurs noms partent chacun d'un côté
const STOPS = [
  { key: 'sainteFoy', label: 'Sainte-Foy-la-Grande', dx: 6, dy: 9, anchor: 'start' },
  { key: 'limoges', label: 'Limoges', dx: 6, dy: 2.5, anchor: 'start' },
  { key: 'aberdeen', label: 'Aberdeen', dx: 6, dy: 2.5, anchor: 'start' },
  { key: 'libourne', label: 'Libourne', dx: -6, dy: -4, anchor: 'end' },
];

// Les trois trajets : en voiture jusqu'à Limoges, puis en avion vers Aberdeen et retour par l'Atlantique
const LEGS = [
  `M${at('sainteFoy')} Q379 575 ${at('limoges')}`,
  `M${at('limoges')} C300 480 250 300 ${at('aberdeen')}`,
  `M${at('aberdeen')} C200 260 220 520 ${at('libourne')}`,
];

// Fleuves des villes du parcours, nommés pendant les gros plans en France
const FRENCH_RIVERS = ['Dordogne', 'Vienne', 'Garonne', 'Loire', 'Seine', 'Rhône', 'Tarn'];
const RIVER_LABELS = [
  { text: 'Dordogne', x: 372, y: 589.5 },
  { text: 'Vienne', x: 392, y: 557 },
];

// Silhouette d'avion, nez vers +x pour suivre la direction du trajet
const PLANE = 'M8.5 0L7 -1.2L2 -1.2L-1.5 -6L-3.5 -6L-1.5 -1.2L-5 -1.2L-6.5 -3L-8 -3L-7 0L-8 3L-6.5 3L-5 1.2L-1.5 1.2L-3.5 6L-1.5 6L2 1.2L7 1.2Z';

// Plans de la caméra, en % du défilement de la scène : [moment, point visé x, y, zoom] ; le zoom final dépend de l'écran
// Gros plan sur Sainte-Foy, glissement vers Limoges, vue large pendant le vol, Aberdeen, vol retour, Libourne, vue d'ensemble
// Les villes françaises sont proches : gros plan (×7 sur ordinateur) pour qu'on voie la distance entre elles ;
// à l'étape de Limoges, la caméra vise le milieu du trajet pour garder les deux villes à l'écran
const CLOSE = 'var(--zoom-close)';
const BEATS = [
  [0, 368, 581, CLOSE],
  [14, 368, 581, CLOSE],
  [24, 375, 571, CLOSE],
  [36, 375, 571, CLOSE],
  [48, 345, 385, 0.9],
  [60, 318, 192, 3],
  [70, 318, 192, 3],
  [80, 335, 385, 0.9],
  [90, 359, 584, CLOSE],
  [94, 359, 584, CLOSE],
  [100, 340, 395, 'var(--zoom-end)'],
];

// Moments (en %) où chaque trajet se trace, où chaque ville s'allume et où chaque étape est à l'écran
const LEG_RANGES = [[14, 24], [38, 60], [72, 90]];
const PIN_RANGES = [null, [21, 25], [57, 61], [87, 91]];
const CARD_RANGES = [[0, 16], [17, 38], [52, 74], [84, 100]];

// Frise des étapes : moment où chacune est à l'écran (allumée) et où la frise emmène quand on clique dessus
const RAIL = [
  { year: '2020', label: 'Lycée', active: [0, 13], target: 4 },
  { year: '2024', label: 'BUT Informatique', active: [20, 36], target: 28 },
  { year: '2026', label: 'Stage à Aberdeen', active: [55, 72], target: 63 },
  { year: '2026', label: 'Alternance Ceva', active: [87, 100], target: 93 },
];
const railKeyframes = ([a, b], i) => {
  const on = 'color: var(--bg-inverse); opacity: 1;';
  const off = 'color: var(--text-muted); opacity: 0.6;';
  const frames = [a > 0 ? `0%, ${a - 3}% { ${off} } ${a}% { ${on} }` : `0% { ${on} }`, `${b}% { ${on} }`];
  if (b < 100) frames.push(`${b + 3}%, 100% { ${off} }`);
  return `@keyframes tl-rail-${i} { ${frames.join(' ')} } .tl-rail-item--${i} { animation-name: tl-rail-${i}; }`;
};

const range = ([a, b]) => `contain ${a}% contain ${b}%`;
const keyframes = `
  @keyframes tl-cam {
    ${BEATS.map(([p, x, y, z]) => `${p}% { transform: translate(var(--cx), var(--cy)) scale(${z}) translate(${-x}px, ${-y}px); }`).join('\n    ')}
  }
  @keyframes tl-counter {
    ${BEATS.map(([p, , , z]) => `${p}% { scale: calc(var(--ui) / ${z}); }`).join('\n    ')}
  }
  @keyframes tl-river-label {
    ${BEATS.map(([p, , , z]) => `${p}% { opacity: ${z === CLOSE ? 1 : 0}; }`).join('\n    ')}
  }
  @keyframes tl-leg-width {
    ${BEATS.map(([p, , , z]) => `${p}% { stroke-width: calc(1.6px * var(--ui) / ${z}); }`).join('\n    ')}
  }
  ${LEGS.map((_, i) => `.tl-leg--${i} { animation-range: ${range(LEG_RANGES[i])}, contain 0% contain 100%; }`).join('\n  ')}
  ${LEGS.slice(1).map((_, i) => `.tl-plane--${i + 1} { animation-range: ${range(LEG_RANGES[i + 1])}; }`).join('\n  ')}
  ${PIN_RANGES.map((r, i) => (r ? `.tl-pin--${i} .tl-pin-dot, .tl-pin--${i} .tl-pin-halo, .tl-pin--${i} .tl-pin-label { animation-range: ${range(r)}; }` : '')).join('\n  ')}
  ${CARD_RANGES.map((r, i) => `.tl-step--${i} { animation-range: ${range(r)}; }`).join('\n  ')}
  ${RAIL.map((item, i) => railKeyframes(item.active, i)).join('\n  ')}
`;

// Position du défilement (px) de chaque étape, à partir de son moment en % de la scène
const stepPositions = (scene) => {
  const top = scene.getBoundingClientRect().top + window.scrollY;
  const span = scene.offsetHeight - window.innerHeight;
  return { top, span, ys: RAIL.map((item) => top + (item.target / 100) * span) };
};

const JourneyScene = ({ steps }) => {
  const sceneRef = useRef(null);
  const snapping = useRef(false);

  // Va à une étape en douceur ; pendant le trajet et un court instant après, les gestes sont ignorés,
  // pour qu'un geste (et l'inertie d'un trackpad) ne fasse avancer que d'une étape
  const glide = (y) => {
    const lenis = window.__lenis;
    if (!lenis) { window.scrollTo({ top: y, behavior: 'smooth' }); return; }
    snapping.current = true;
    lenis.scrollTo(y, {
      duration: 1,
      lock: true,
      force: true,
      onComplete: () => {
        lenis.stop();
        setTimeout(() => { lenis.start(); snapping.current = false; }, 450);
      },
    });
  };

  // Saut vers une étape depuis la frise
  const goTo = (index) => {
    const scene = sceneRef.current;
    if (scene) glide(stepPositions(scene).ys[index]);
  };

  // Aimant d'étapes : dès qu'un geste quitte une étape dans la scène, elle file jusqu'à l'étape suivante dans son sens
  // (ou la précédente en remontant). Avant la première et après la dernière, le défilement reste libre.
  useEffect(() => {
    let lenis = null;
    let frame = 0;
    let unsubscribe = null;

    const onScroll = () => {
      const scene = sceneRef.current;
      if (snapping.current || !scene || !scene.offsetHeight) return; // scène masquée (mouvement réduit) : rien à aimanter
      if (!lenis.direction) return; // fin d'un défilement : pas de geste en cours
      const { top, span, ys } = stepPositions(scene);
      const y = lenis.scroll;
      if (y < top - window.innerHeight * 0.4 || y > top + span) return;
      if (ys.some((t) => Math.abs(t - y) < 12)) return; // encore posé sur une étape
      const after = ys.findIndex((t) => t > y);
      const next = lenis.direction > 0 ? after : (after === -1 ? ys.length - 1 : after - 1);
      if (next < 0 || next >= ys.length) return; // on sort de la scène : défilement libre
      glide(ys[next]);
    };

    // Lenis est créé par App après le montage de la scène : on l'attend
    const attach = () => {
      lenis = window.__lenis;
      if (!lenis) { frame = requestAnimationFrame(attach); return; }
      unsubscribe = lenis.on('scroll', onScroll);
    };
    attach();

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe?.();
    };
  }, []);

  return (
  <div className="tl-scene" ref={sceneRef}>
    <div className="tl-stage">
      <svg className="tl-scene-map" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g className="tl-camera">
          {Object.entries(countries).map(([name, d]) => (
            <path key={name} d={d} className={`tl-land ${name === 'france' || name === 'uk' ? 'tl-land--home' : ''}`} vectorEffect="non-scaling-stroke" />
          ))}

          {Object.entries(rivers).map(([name, d]) => (
            <path key={name} d={d} className={`tl-river ${FRENCH_RIVERS.includes(name) ? 'tl-river--home' : ''}`} vectorEffect="non-scaling-stroke" />
          ))}
          {RIVER_LABELS.map((label) => (
            <g key={label.text} className="tl-river-name" transform={`translate(${label.x} ${label.y})`}>
              <g className="tl-counter">
                <text className="tl-river-label">{label.text}</text>
              </g>
            </g>
          ))}

          {/* Trajet complet en pointillés, puis chaque étape tracée au fil du défilement */}
          <path d={LEGS.join(' ')} className="tl-route-base" vectorEffect="non-scaling-stroke" />
          {LEGS.map((d, i) => (
            <path key={d} d={d} pathLength="1" className={`tl-leg tl-leg--${i}`} />
          ))}

          {/* L'avion suit les deux vols et garde la même taille quel que soit le zoom */}
          {LEGS.slice(1).map((d, i) => (
            <g key={d} className={`tl-plane tl-plane--${i + 1}`} style={{ offsetPath: `path('${d}')` }}>
              <g className="tl-counter">
                <path d={PLANE} transform="scale(0.55)" />
              </g>
            </g>
          ))}

          {STOPS.map((stop, i) => (
            <g key={stop.key} className={`tl-pin tl-pin--${i}`} transform={`translate(${at(stop.key)})`}>
              <g className="tl-counter">
                <circle r="8" className="tl-pin-halo" />
                <circle r="3.6" className="tl-pin-dot" />
                <text x={stop.dx} y={stop.dy} textAnchor={stop.anchor} className="tl-pin-label">{stop.label}</text>
              </g>
            </g>
          ))}
        </g>
      </svg>

      {/* Frise des étapes : l'étape en cours s'allume au fil du défilement, un clic y emmène */}
      <nav className="tl-rail" aria-label="Étapes du parcours">
        <span className="tl-rail-fill" aria-hidden="true" />
        {RAIL.map((item, i) => (
          <button key={item.label} type="button" className={`tl-rail-item tl-rail-item--${i}`} onClick={() => goTo(i)}>
            <span className="tl-rail-dot" aria-hidden="true" />
            <span className="tl-rail-year">{item.year}</span>
            <span className="tl-rail-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <p className="tl-hint" aria-hidden="true"><ChevronDown size={16} />Fais défiler pour suivre le trajet</p>

      {/* L'étape en cours, par-dessus la carte : chacune remplace la précédente */}
      <ol className="tl-steps">
        {steps.map((step, i) => (
          <li key={step.title} className={`tl-step tl-step--${i}`}>
            <span className="tl-step-index">Étape {i + 1} sur {steps.length}</span>
            <span className="tl-step-date"><Calendar size={12} />{step.date}</span>
            <h3 className="tl-step-title">{step.title}</h3>
            <p className="tl-step-sub">{step.sub}</p>
            {step.certifBadge && <span className="tl-step-badge tl-step-badge--ok"><ShieldCheck size={13} />{step.certifBadge}</span>}
            {step.badge && <span className="tl-step-badge"><Building2 size={13} />{step.badge}</span>}
            <p className="tl-step-desc">{step.desc}</p>
            <span className="tl-step-place"><MapPin size={12} />{step.location}</span>
          </li>
        ))}
      </ol>
    </div>

    <style dangerouslySetInnerHTML={{ __html: `
      /* La scène ne s'affiche que si le navigateur sait animer au défilement et que le mouvement n'est pas réduit ;
         sinon la liste des étapes reste en place */
      .tl-scene { display: none; }
      @supports (animation-timeline: view()) {
        @media (prefers-reduced-motion: no-preference) {
          .tl-scene { display: block; }
          .tl-list { display: none !important; }
        }
      }

      /* Pleine largeur, 4,6 écrans de défilement : la carte reste fixe pendant que la caméra voyage */
      .tl-scene {
        position: relative;
        height: 460vh;
        width: 100vw;
        margin-left: calc(50% - 50vw);
        view-timeline: --journey block;
        /* Point de l'écran où la caméra centre la ville : à gauche des étapes sur ordinateur */
        --cx: ${width * 0.36}px;
        --cy: ${height * 0.5}px;
        /* Taille des repères à l'écran, compensée sur téléphone où la carte est rendue plus petite */
        --ui: 1;
        --zoom-end: 0.8;
        --zoom-close: 7;
      }
      .tl-stage {
        position: sticky;
        top: 0;
        height: 100vh;
        height: 100svh;
        overflow: hidden;
        background: #e8eef8;
      }
      /* Fondus haut et bas pour que la carte se fonde dans la page */
      .tl-stage::before, .tl-stage::after {
        content: '';
        position: absolute;
        left: 0; right: 0;
        height: 18vh;
        z-index: 1;
        pointer-events: none;
      }
      .tl-stage::before { top: 0; background: linear-gradient(var(--bg-secondary), transparent); }
      .tl-stage::after { bottom: 0; background: linear-gradient(transparent, var(--bg-secondary)); }

      .tl-scene-map { position: absolute; inset: 0; width: 100%; height: 100%; }
      .tl-camera {
        transform-origin: 0 0;
        animation: tl-cam var(--ease-in-out) both;
        animation-timeline: --journey;
        animation-range: contain 0% contain 100%;
      }
      .tl-counter {
        transform-origin: 0 0;
        animation: tl-counter var(--ease-in-out) both;
        animation-timeline: --journey;
        animation-range: contain 0% contain 100%;
      }

      .tl-land { fill: #f7f9fc; stroke: #d3dcea; stroke-width: 0.8px; }
      .tl-land--home { fill: #ffffff; stroke: #b9c8e2; }
      .tl-river { fill: none; stroke: #c7d6ee; stroke-width: 0.8px; stroke-linecap: round; stroke-linejoin: round; }
      .tl-river--home { stroke: #a9c1e8; stroke-width: 1.3px; }
      .tl-river-label {
        font-family: var(--font-body);
        font-size: 6.2px;
        font-style: italic;
        fill: #6f8fc4;
        paint-order: stroke;
        stroke: #ffffff;
        stroke-width: 2px;
      }
      .tl-river-name {
        animation: tl-river-label linear both;
        animation-timeline: --journey;
        animation-range: contain 0% contain 100%;
      }
      .tl-route-base { fill: none; stroke: rgba(var(--accent-rgb), 0.35); stroke-width: 1.2px; stroke-dasharray: 3 5; stroke-linecap: round; }
      .tl-leg {
        fill: none;
        stroke: var(--accent);
        stroke-linecap: round;
        stroke-dasharray: 1;
        /* Le trait se dessine sur sa propre plage ; son épaisseur compense le zoom (pas de non-scaling-stroke, qui casse pathLength) */
        animation: tl-draw var(--ease-in-out) both, tl-leg-width var(--ease-in-out) both;
        animation-timeline: --journey, --journey;
      }
      .tl-plane {
        fill: var(--accent-hover);
        offset-rotate: auto;
        animation: tl-fly var(--ease-in-out) both;
        animation-timeline: --journey;
      }
      .tl-pin-dot { fill: var(--accent); stroke: #ffffff; stroke-width: 1.6; }
      .tl-pin-halo { fill: rgba(var(--accent-rgb), 0.18); }
      .tl-pin-label {
        font-family: var(--font-subtitle);
        font-size: 7.2px;
        font-weight: 700;
        fill: var(--text-primary);
        paint-order: stroke;
        stroke: #ffffff;
        stroke-width: 2.4px;
      }
      .tl-pin circle { transform-box: fill-box; transform-origin: center; }
      .tl-pin-dot, .tl-pin-halo, .tl-pin-label { animation-timeline: --journey; animation-fill-mode: both; animation-timing-function: var(--ease-out); }
      .tl-pin-dot { animation-name: tl-pin; }
      .tl-pin-halo { animation-name: tl-halo; }
      .tl-pin-label { animation-name: tl-label; }
      .tl-pin--0 .tl-pin-dot, .tl-pin--0 .tl-pin-halo, .tl-pin--0 .tl-pin-label { animation: none; }

      /* Les étapes : une carte à droite sur ordinateur, en bas sur téléphone */
      .tl-steps { position: absolute; inset: 0; z-index: 2; margin: 0; padding: 0; list-style: none; pointer-events: none; }
      .tl-step {
        position: absolute;
        top: 50%;
        right: max(24px, calc((100vw - 1200px) / 2));
        translate: 0 -50%;
        width: min(440px, 40vw);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid var(--border-color);
        box-shadow: 0 24px 60px rgba(17, 24, 39, 0.12);
        animation: tl-card-mid linear both;
        animation-timeline: --journey;
      }
      .tl-step--0 { animation-name: tl-card-first; }
      .tl-step--3 { animation-name: tl-card-last; }
      .tl-step-index {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 12px;
      }
      .tl-step-date {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 50px;
        background: var(--accent-light);
        color: var(--accent-hover);
        font-family: var(--font-subtitle);
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.05em;
      }
      .tl-step-title {
        font-family: var(--font-title);
        font-size: 1.45rem;
        font-weight: 800;
        line-height: 1.2;
        color: var(--text-primary);
        margin: 14px 0 0;
      }
      .tl-step-sub {
        font-family: var(--font-subtitle);
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin: 4px 0 0;
      }
      .tl-step-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 10px;
        padding: 3px 10px;
        border-radius: 20px;
        font-family: var(--font-subtitle);
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--accent-hover);
        background: var(--accent-light);
        border: 1px solid rgba(var(--accent-rgb), 0.25);
      }
      .tl-step-badge--ok { color: #047857; background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.25); }
      .tl-step-desc {
        font-family: var(--font-body);
        font-size: 0.92rem;
        line-height: 1.6;
        color: var(--text-secondary);
        margin: 12px 0 0;
      }
      .tl-step-place {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 16px;
        font-family: var(--font-subtitle);
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--text-muted);
      }


      /* Frise des étapes, à gauche sur ordinateur */
      .tl-rail {
        position: absolute;
        z-index: 3;
        left: max(24px, calc((100vw - 1200px) / 2));
        top: 50%;
        translate: 0 -50%;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 14px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 12px 30px rgba(17, 24, 39, 0.1);
      }
      /* Rail vertical entre les points, qui se remplit au fil du défilement */
      .tl-rail::before, .tl-rail-fill {
        content: '';
        position: absolute;
        left: 30px;
        top: 34px;
        bottom: 34px;
        width: 2px;
        border-radius: 2px;
      }
      .tl-rail::before { background: rgba(17, 24, 39, 0.12); }
      .tl-rail-fill {
        background: var(--bg-inverse);
        transform-origin: top;
        animation: tl-rail-fill linear both;
        animation-timeline: --journey;
        animation-range: contain 0% contain 93%;
      }
      .tl-rail-item {
        position: relative;
        display: grid;
        grid-template-columns: 16px auto;
        grid-template-rows: auto auto;
        column-gap: 12px;
        align-items: center;
        padding: 8px 12px 8px 10px;
        border: none;
        border-radius: 12px;
        background: transparent;
        text-align: left;
        cursor: pointer;
        color: var(--text-muted);
        animation-timeline: --journey;
        animation-range: contain 0% contain 100%;
        animation-fill-mode: both;
        animation-timing-function: linear;
        transition: background-color var(--duration-normal) var(--ease-out);
      }
      .tl-rail-dot {
        grid-row: 1 / 3;
        width: 12px; height: 12px;
        border-radius: 50%;
        background: currentColor;
        box-shadow: 0 0 0 3px #ffffff;
      }
      .tl-rail-year { font-family: var(--font-subtitle); font-size: 0.72rem; font-weight: 700; line-height: 1.2; }
      .tl-rail-label { font-family: var(--font-subtitle); font-size: 0.9rem; font-weight: 700; line-height: 1.25; }
      .tl-rail-item:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      @media (hover: hover) and (pointer: fine) {
        .tl-rail-item:hover { background: var(--bg-tertiary); }
      }

      /* Indication de départ, qui s'efface dès qu'on commence à défiler */
      .tl-hint {
        position: absolute;
        z-index: 3;
        left: 50%;
        bottom: 28px;
        translate: -50% 0;
        margin: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 50px;
        background: var(--bg-inverse);
        color: #ffffff;
        font-family: var(--font-subtitle);
        font-size: 0.88rem;
        font-weight: 700;
        white-space: nowrap;
        pointer-events: none;
        animation: tl-hint linear both;
        animation-timeline: --journey;
        animation-range: contain 0% contain 6%;
      }
      .tl-hint svg { animation: tl-nudge 1.6s var(--ease-in-out) infinite; }

      /* Téléphone et tablette en portrait : ville centrée en haut, étape en bas */
      @media (max-width: 760px) {
        .tl-scene { --cx: ${width * 0.5}px; --cy: ${height * 0.25}px; --ui: 1.6; --zoom-end: 0.48; --zoom-close: 4.5; height: 520vh; }
        .tl-step {
          top: auto;
          bottom: max(16px, env(safe-area-inset-bottom));
          left: 16px;
          right: 16px;
          translate: none;
          width: auto;
          padding: 20px;
        }
        .tl-step-title { font-size: 1.2rem; }
        .tl-rail {
          top: 84px;
          left: 16px;
          right: 16px;
          translate: none;
          flex-direction: row;
          justify-content: space-between;
          padding: 6px 8px;
          border-radius: 16px;
        }
        .tl-rail::before, .tl-rail-fill { left: 26px; right: 26px; top: 21px; bottom: auto; width: auto; height: 2px; }
        .tl-rail-fill { transform-origin: left; animation-name: tl-rail-fill-x; }
        .tl-rail-item { grid-template-columns: auto; justify-items: center; row-gap: 6px; padding: 6px 8px; }
        .tl-rail-dot { grid-row: auto; }
        .tl-rail-label { display: none; }
        .tl-hint { top: 150px; bottom: auto; }
        .tl-step-desc { font-size: 0.85rem; line-height: 1.5; }
      }

      @keyframes tl-rail-fill { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      @keyframes tl-rail-fill-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes tl-hint { 0%, 40% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes tl-nudge { 0%, 100% { transform: translateY(-2px); } 50% { transform: translateY(3px); } }
      @keyframes tl-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
      @keyframes tl-fly {
        0% { offset-distance: 0%; opacity: 0; }
        8% { opacity: 1; }
        92% { opacity: 1; }
        100% { offset-distance: 100%; opacity: 0; }
      }
      @keyframes tl-pin { from { transform: scale(0.5); fill: #ffffff; } to { transform: scale(1); fill: var(--accent); } }
      @keyframes tl-halo { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes tl-label { from { opacity: 0.4; } to { opacity: 1; } }
      @keyframes tl-card-first {
        0%, 75% { opacity: 1; transform: none; }
        100% { opacity: 0; transform: translateY(-28px); }
      }
      @keyframes tl-card-mid {
        0% { opacity: 0; transform: translateY(28px); }
        22%, 80% { opacity: 1; transform: none; }
        100% { opacity: 0; transform: translateY(-28px); }
      }
      @keyframes tl-card-last {
        0% { opacity: 0; transform: translateY(28px); }
        25%, 100% { opacity: 1; transform: none; }
      }
      ${keyframes}
    `}} />
  </div>
  );
};

export default JourneyScene;
