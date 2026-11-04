import React, { useState } from 'react';
import { Calendar, MapPin, ShieldCheck, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

// Les documents du parcours, dessinés en HTML : chacun est l'objet qui représente son étape

const Diploma = () => (
  <div className="doc doc-diploma">
    <p className="doc-diploma-top">République française</p>
    <p className="doc-diploma-title">Baccalauréat</p>
    <p className="doc-diploma-sub">Général · Spécialités Mathématiques et NSI</p>
    <div className="doc-diploma-foot">
      <span>Session 2024<br />Sainte-Foy-la-Grande</span>
      <span className="doc-diploma-seal">BAC</span>
    </div>
  </div>
);

const StudentCard = () => (
  <div className="doc doc-card">
    <div className="doc-card-head">
      <img src="/img/logos/iut-unilim.png" alt="" />
      <span>Carte d'étudiant</span>
    </div>
    <div className="doc-card-body">
      <span className="doc-chip" aria-hidden="true" />
      <div>
        <p className="doc-name">LOÏ Milan</p>
        <p className="doc-line">BUT Informatique</p>
        <p className="doc-line">IUT du Limousin · Limoges</p>
        <p className="doc-line doc-line--strong">2024 – 2027</p>
      </div>
    </div>
    <div className="doc-card-band">Université de Limoges</div>
  </div>
);

const BoardingPass = () => (
  <div className="doc doc-pass">
    <div className="doc-pass-main">
      <p className="doc-pass-head">Carte d'embarquement · Erasmus+</p>
      <p className="doc-pass-route">Limoges <span>→</span> Aberdeen</p>
      <dl className="doc-pass-grid">
        <div><dt>Passager</dt><dd>LOÏ / MILAN</dd></div>
        <div><dt>Départ</dt><dd>Avril 2026</dd></div>
        <div><dt>Retour</dt><dd>Juin 2026</dd></div>
        <div><dt>Destination</dt><dd>Université RGU</dd></div>
      </dl>
    </div>
    <div className="doc-pass-stub">
      <img src="/img/logos/rgu.svg" alt="" />
      <span className="doc-pass-code" aria-hidden="true" />
      <span className="doc-pass-dest">ABZ</span>
    </div>
  </div>
);

const Badge = () => (
  <div className="doc doc-badge">
    <span className="doc-badge-slot" aria-hidden="true" />
    <p className="doc-badge-company">Ceva Santé Animale</p>
    <span className="doc-monogram" aria-hidden="true">ML</span>
    <p className="doc-name">Milan Loï</p>
    <p className="doc-line">Alternant · Développeur & concepteur logiciel</p>
    <p className="doc-badge-foot">Libourne · depuis sept. 2026</p>
  </div>
);

const DOCUMENTS = [Diploma, StudentCard, BoardingPass, Badge];

// Les documents posés en éventail : celui de l'étape choisie passe devant, les autres se rangent derrière
const JourneyDocuments = ({ steps }) => {
  const [active, setActive] = useState(0);
  const count = steps.length;
  const go = (index) => setActive((index + count) % count);
  const step = steps[active];

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };

  return (
    <div className="jd">
      <div className="jd-desk" role="tablist" aria-label="Étapes du parcours" onKeyDown={onKeyDown}>
        <div className="jd-stack">
          {DOCUMENTS.map((Doc, i) => (
            <button
              key={steps[i].title}
              type="button"
              role="tab"
              id={`jd-tab-${i}`}
              aria-selected={i === active}
              aria-controls="jd-panel"
              aria-label={`${steps[i].date} : ${steps[i].title}`}
              tabIndex={i === active ? 0 : -1}
              className={`jd-doc jd-doc--${i}`}
              data-o={(i - active + count) % count}
              onClick={() => setActive(i)}
            >
              <Doc />
            </button>
          ))}
        </div>
      </div>

      <div className="jd-detail" role="tabpanel" id="jd-panel" aria-labelledby={`jd-tab-${active}`}>
        <div className="jd-detail-body" key={active}>
          <span className="jd-date"><Calendar size={12} />{step.date}</span>
          <h3 className="jd-title">{step.title}</h3>
          <p className="jd-sub">{step.sub}</p>
          {step.certifBadge && <span className="jd-badge jd-badge--ok"><ShieldCheck size={13} />{step.certifBadge}</span>}
          {step.badge && <span className="jd-badge"><Building2 size={13} />{step.badge}</span>}
          <p className="jd-desc">{step.desc}</p>
          <span className="jd-place"><MapPin size={12} />{step.location}</span>
        </div>
        <div className="jd-nav">
          <button type="button" className="jd-arrow" onClick={() => go(active - 1)} aria-label="Étape précédente"><ChevronLeft size={18} /></button>
          <span className="jd-count">Étape {active + 1} sur {count}</span>
          <button type="button" className="jd-arrow" onClick={() => go(active + 1)} aria-label="Étape suivante"><ChevronRight size={18} /></button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .jd {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 56px;
          align-items: center;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* Le bureau : les documents se superposent au centre */
        .jd-desk { position: relative; height: 460px; outline: none; }
        .jd-stack { position: absolute; inset: 0; transform-origin: center; }
        .jd-doc {
          position: absolute;
          left: 50%;
          top: 50%;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
          font: inherit;
          color: inherit;
          translate: -50% -50%;
          transition: transform 450ms var(--ease-out), filter 450ms var(--ease-out);
        }
        .jd-doc:focus-visible { outline: 3px solid var(--accent); outline-offset: 6px; border-radius: 18px; }
        /* Position de chaque document selon son rang derrière celui de devant */
        .jd-doc[data-o="0"] { z-index: 4; transform: rotate(0deg); }
        .jd-doc[data-o="1"] { z-index: 3; transform: translate(60px, -34px) rotate(7deg) scale(0.9); filter: brightness(0.97); }
        .jd-doc[data-o="2"] { z-index: 2; transform: translate(-58px, -46px) rotate(-8deg) scale(0.86); filter: brightness(0.95); }
        .jd-doc[data-o="3"] { z-index: 1; transform: translate(18px, -70px) rotate(3deg) scale(0.82); filter: brightness(0.93); }
        @media (hover: hover) and (pointer: fine) {
          .jd-doc:not([data-o="0"]):hover { filter: brightness(1); }
        }

        .doc {
          position: relative;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 2px 4px rgba(17, 24, 39, 0.06), 0 18px 40px rgba(17, 24, 39, 0.12);
          overflow: hidden;
          color: var(--text-primary);
        }
        .doc p { margin: 0; }
        /* Puce de la carte étudiante, dessinée */
        .doc-chip {
          flex-shrink: 0;
          width: 58px; height: 44px; border-radius: 8px;
          background:
            linear-gradient(90deg, transparent 18px, #b8913a 18px 20px, transparent 20px 38px, #b8913a 38px 40px, transparent 40px),
            linear-gradient(0deg, transparent 14px, #b8913a 14px 16px, transparent 16px 28px, #b8913a 28px 30px, transparent 30px),
            #e2c375;
          box-shadow: inset 0 0 0 1px #b8913a;
        }
        .doc-name { font-family: var(--font-display); font-size: 1.05rem; font-weight: 800; letter-spacing: -0.02em; text-transform: uppercase; }
        .doc-line { font-family: var(--font-subtitle); font-size: 0.8rem; color: var(--text-secondary); margin-top: 3px !important; }
        .doc-line--strong { color: var(--text-primary); font-weight: 700; }

        /* Diplôme du bac : papier crème, cadre et sceau */
        .doc-diploma {
          width: 400px;
          height: 280px;
          padding: 26px 30px;
          background: #fffbf2;
          border: 2px solid #e7d9b8;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .doc-diploma::before { content: ''; position: absolute; inset: 8px; border: 1px solid #e7d9b8; border-radius: 10px; pointer-events: none; }
        .doc-diploma-top { font-family: var(--font-subtitle); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7448; }
        .doc-diploma-title { margin-top: 18px !important; font-family: var(--font-creative); font-style: italic; font-size: 3rem; line-height: 1; color: #3b2f17; }
        .doc-diploma-sub { margin-top: 12px !important; font-family: var(--font-subtitle); font-size: 0.85rem; font-weight: 600; color: #5c4a26; }
        .doc-diploma-foot { margin-top: auto; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; text-align: left; font-family: var(--font-subtitle); font-size: 0.75rem; font-weight: 600; color: #8a7448; }
        .doc-diploma-seal {
          width: 58px; height: 58px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: #a81e24; color: #ffffff;
          font-family: var(--font-display); font-size: 0.85rem; font-weight: 800;
          box-shadow: 0 0 0 4px #fffbf2, 0 0 0 6px #a81e24;
        }

        /* Carte étudiante de l'IUT : format carte bancaire, bandeau rouge de l'université */
        .doc-card { width: 390px; height: 246px; display: flex; flex-direction: column; }
        .doc-card-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px 8px; }
        .doc-card-head img { height: 34px; width: auto; }
        .doc-card-head span { font-family: var(--font-subtitle); font-size: 0.72rem; font-weight: 700; color: #a81e24; text-transform: uppercase; letter-spacing: 0.08em; }
        .doc-card-body { flex: 1; display: flex; align-items: center; gap: 18px; padding: 4px 18px 12px; }
        .doc-card-band { padding: 9px 18px; background: #a81e24; color: #ffffff; font-family: var(--font-subtitle); font-size: 0.8rem; font-weight: 700; }

        /* Carte d'embarquement vers Aberdeen : violet de RGU, talon détachable */
        .doc-pass { width: 440px; min-height: 210px; display: flex; }
        .doc-pass-main { flex: 1; padding: 18px 20px; border-left: 8px solid #712177; }
        .doc-pass-head { font-family: var(--font-subtitle); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #712177; }
        .doc-pass-route { margin-top: 10px !important; font-family: var(--font-display); font-size: 1.45rem; font-weight: 800; letter-spacing: -0.03em; text-transform: uppercase; line-height: 1; }
        .doc-pass-route span { color: #712177; }
        .doc-pass-grid { margin: 16px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
        .doc-pass-grid dt { font-family: var(--font-subtitle); font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
        .doc-pass-grid dd { margin: 2px 0 0; font-family: var(--font-subtitle); font-size: 0.8rem; font-weight: 700; }
        .doc-pass-stub {
          width: 104px;
          padding: 16px 12px;
          border-left: 2px dashed #d8cbe0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          background: #faf6fb;
        }
        .doc-pass-stub img { width: 78px; height: auto; }
        .doc-pass-code { width: 64px; height: 54px; background: repeating-linear-gradient(90deg, #1f1328 0 2px, transparent 2px 4px, #1f1328 4px 5px, transparent 5px 8px); }
        .doc-pass-dest { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: #712177; }

        /* Badge Ceva : carte portrait avec fente pour le cordon */
        .doc-badge { width: 230px; height: 330px; padding: 22px 18px 0; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; text-align: center; border-top: 10px solid var(--bg-inverse); }
        .doc-badge-slot { width: 46px; height: 8px; border-radius: 6px; background: var(--bg-tertiary); box-shadow: inset 0 1px 2px rgba(17, 24, 39, 0.2); }
        .doc-badge-company { margin-top: 14px !important; font-family: var(--font-subtitle); font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent-hover); }
        .doc-monogram {
          margin: 16px 0 14px; width: 96px; height: 96px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--accent-light); color: var(--accent-hover);
          font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; letter-spacing: -0.04em;
        }
        .doc-badge .doc-line { line-height: 1.35; }
        .doc-badge-foot { margin-top: auto !important; width: calc(100% + 36px); padding: 10px 0; background: var(--accent); color: #ffffff; font-family: var(--font-subtitle); font-size: 0.75rem; font-weight: 700; }

        /* Détails de l'étape choisie */
        .jd-detail { display: flex; flex-direction: column; gap: 22px; }
        .jd-detail-body {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 30px;
          border-radius: 24px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 30px rgba(17, 24, 39, 0.04);
          animation: jd-in 320ms var(--ease-out) both;
        }
        .jd-date {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 50px;
          background: var(--accent-light); color: var(--accent-hover);
          font-family: var(--font-subtitle); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.05em;
        }
        .jd-title { margin: 14px 0 0; font-family: var(--font-title); font-size: 1.45rem; font-weight: 800; line-height: 1.2; color: var(--text-primary); }
        .jd-sub { margin: 4px 0 0; font-family: var(--font-subtitle); font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); }
        .jd-badge {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 10px;
          padding: 3px 10px; border-radius: 20px;
          font-family: var(--font-subtitle); font-size: 0.72rem; font-weight: 700;
          color: var(--accent-hover); background: var(--accent-light); border: 1px solid rgba(var(--accent-rgb), 0.25);
        }
        .jd-badge--ok { color: #047857; background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.25); }
        .jd-desc { margin: 14px 0 0; font-family: var(--font-body); font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary); }
        .jd-place { display: flex; align-items: center; gap: 6px; margin-top: 16px; font-family: var(--font-subtitle); font-size: 0.8rem; font-weight: 500; color: var(--text-muted); }

        .jd-nav { display: flex; align-items: center; gap: 14px; }
        .jd-count { font-family: var(--font-subtitle); font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); min-width: 96px; text-align: center; }
        .jd-arrow {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary);
          cursor: pointer;
          transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-normal) var(--ease-out);
        }
        .jd-arrow:active { transform: scale(0.94); }
        .jd-arrow:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        @media (hover: hover) and (pointer: fine) {
          .jd-arrow:hover { border-color: var(--border-color-hover); }
        }

        @keyframes jd-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        /* Tablette et téléphone : bureau au-dessus, réduit pour que les documents tiennent */
        @media (max-width: 1180px) {
          .jd { gap: 32px; }
          .jd-desk { height: 400px; }
          .jd-stack { transform: scale(0.84); }
        }
        @media (max-width: 960px) {
          .jd { grid-template-columns: 1fr; gap: 24px; }
          .jd-stack { transform: none; }
        }
        @media (max-width: 560px) {
          .jd-desk { height: 270px; }
          .jd-stack { transform: scale(0.68); }
          .jd-detail-body { padding: 22px; }
          .jd-nav { justify-content: center; }
        }
        @media (max-width: 380px) {
          .jd-stack { transform: scale(0.6); }
        }
      `}} />
    </div>
  );
};

export default JourneyDocuments;
