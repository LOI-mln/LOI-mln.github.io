import React from 'react';
// Contours Natural Earth (domaine public, via world-atlas) projetés en Mercator, de la Gironde à l'Écosse
import map from '../data/journey-map.json';

const { width, height, countries, cities } = map;

// Villes du parcours, dans l'ordre des étapes ; Libourne et Sainte-Foy sont voisines, leurs noms partent chacun d'un côté
const STOPS = [
  { key: 'sainteFoy', label: 'Sainte-Foy-la-Grande', dx: 9, dy: 12, anchor: 'start' },
  { key: 'limoges', label: 'Limoges', dx: 9, dy: 4, anchor: 'start' },
  { key: 'aberdeen', label: 'Aberdeen', dx: 9, dy: 4, anchor: 'start' },
  { key: 'libourne', label: 'Libourne', dx: -9, dy: -6, anchor: 'end' },
];

const at = (key) => cities[key].join(' ');

// Les trois trajets : en voiture jusqu'à Limoges, puis en avion vers Aberdeen et retour par l'Atlantique
const LEGS = [
  `M${at('sainteFoy')} Q226 452 ${at('limoges')}`,
  `M${at('limoges')} C150 360 110 200 ${at('aberdeen')}`,
  `M${at('aberdeen')} C60 160 60 380 ${at('libourne')}`,
];

// Silhouette d'avion, nez vers +x pour suivre la direction du trajet
const PLANE = 'M8.5 0L7 -1.2L2 -1.2L-1.5 -6L-3.5 -6L-1.5 -1.2L-5 -1.2L-6.5 -3L-8 -3L-7 0L-8 3L-6.5 3L-5 1.2L-1.5 1.2L-3.5 6L-1.5 6L2 1.2L7 1.2Z';

const JourneyMap = () => (
  <figure className="tl-map" aria-label="Carte du parcours : Sainte-Foy-la-Grande, Limoges, Aberdeen, puis Libourne">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true">
      {Object.entries(countries).map(([name, d]) => (
        <path key={name} d={d} className={`tl-land ${name === 'france' || name === 'uk' ? 'tl-land--home' : ''}`} />
      ))}

      {/* Trajet complet en pointillés, puis chaque étape tracée au fil du défilement */}
      <path d={LEGS.join(' ')} className="tl-route-base" />
      {LEGS.map((d, i) => (
        <path key={d} d={d} pathLength="1" className={`tl-route tl-route--${i + 2}`} />
      ))}

      {/* L'avion suit les deux vols */}
      {LEGS.slice(1).map((d, i) => (
        <g key={d} className={`tl-plane tl-plane--${i + 3}`} style={{ offsetPath: `path('${d}')` }}>
          <path d={PLANE} />
        </g>
      ))}

      {STOPS.map((stop, i) => {
        const [x, y] = cities[stop.key];
        return (
          <g key={stop.key} className={`tl-pin tl-pin--${i + 1}`}>
            <circle cx={x} cy={y} r="13" className="tl-pin-halo" />
            <circle cx={x} cy={y} r="5.5" className="tl-pin-dot" />
            <text x={x + stop.dx} y={y + stop.dy} textAnchor={stop.anchor} className="tl-pin-label">{stop.label}</text>
          </g>
        );
      })}
    </svg>
    <figcaption className="tl-map-caption">De la Gironde à l'Écosse, puis retour en Gironde</figcaption>
  </figure>
);

export default JourneyMap;
