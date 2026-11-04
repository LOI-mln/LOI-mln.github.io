import React from 'react';

// Chiffre qui défile jusqu'à sa valeur, chiffre par chiffre ; l'animation est posée par la section qui l'utilise
// (au défilement pour les projets, au chargement pour l'accueil). Sans animation, la valeur s'affiche telle quelle.
const RollingFigure = ({ value, prefix, suffix, className = '' }) => (
  <span className={`roll ${className}`} aria-label={`${prefix || ''}${value}${suffix || ''}`}>
    {prefix && <span className="roll-affix" aria-hidden="true">{prefix}</span>}
    {[...value].map((ch, i) => (/\d/.test(ch) ? (
      <span key={i} className="roll-digit" aria-hidden="true" style={{ '--d': ch, '--i': i }}>
        <span className="roll-strip">
          {'0123456789'.split('').map((n) => <span key={n}>{n}</span>)}
        </span>
      </span>
    ) : (
      <span key={i} aria-hidden="true">{ch === ' ' ? ' ' : ch}</span>
    )))}
    {suffix && <span className="roll-affix roll-affix--suffix" aria-hidden="true">{suffix}</span>}
  </span>
);

export default RollingFigure;
