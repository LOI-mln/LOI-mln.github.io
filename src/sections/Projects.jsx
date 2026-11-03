import React, { useState, useEffect } from 'react';
import { 
  createPortal } from 'react-dom';
import ProjectStage from '../components/ProjectStage';
import { 
  Globe, 
  Play, 
  Network, 
  ClipboardList, 
  Briefcase, 
  ExternalLink, 
  ArrowUpRight, 
  Activity, 
  Database, 
  CheckCircle, 
  Flame, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ShieldCheck, 
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
    category: 'Application en production',
    title: "Emplois du temps de l'IUT",
    figure: { value: '200', prefix: '≈ ', label: "personnes s'en servent à l'IUT" },
    meta: "Unilim EDT · Projet BUT · Lead dev, équipe de 4 · 2025-2026",
    status: "En production à l'IUT",
    summary: "L'IUT du Limousin faisait ses emplois du temps à la main. L'application les génère toute seule, sans qu'une salle, un enseignant ou un groupe soit pris deux fois.",
    points: [
      "Environ 200 personnes s'en servent au département Informatique, étudiants et enseignants",
      '3 promotions, 66 enseignants et près de 7 800 heures de cours à placer sur l\'année',
      "J'encadre l'équipe de 4 développeurs qui la fait évoluer",
    ],
    tags: ['Python', 'Laravel', 'Vue 3'],
    demo: { src: '/videos/unilim-edt-demo.mp4', poster: '/videos/unilim-edt-demo.jpg', duration: '35 s' },
  },
  {
    number: '02',
    category: 'Site web',
    title: 'Site du club de badminton',
    figure: { value: '25', label: 'partenaires du club mis en avant' },
    meta: 'Badminton Club Montponnais (bcm24.fr) · depuis 2026',
    status: 'En ligne',
    summary: "Le club de badminton de Montpon-Ménestérol, actif depuis 1999, n'avait pas de site à jour. Il en a maintenant un qu'il gère seul.",
    points: [
      'Tout pour venir jouer : 5 créneaux par semaine sur 5 terrains, tarifs et inscription en ligne',
      'Les 4 équipes en interclubs et les 25 partenaires du club mis en avant',
      'Le bureau publie le calendrier et envoie la newsletter sans passer par moi',
    ],
    tags: ['Next.js', 'React'],
    demo: { src: '/videos/bcm-site-demo.mp4', poster: '/videos/bcm-site-demo.jpg', duration: '14 s', label: 'Visite réelle' },
    link: { href: 'https://www.bcm24.fr', label: 'Voir le site', kind: 'site' },
  },
  {
    number: '03',
    category: 'Recherche IA',
    title: 'RGU Aberdeen',
    figure: { value: '32 000', prefix: '+', label: "commentaires analysés par l'IA" },
    meta: 'Stage Erasmus+ · Écosse · 2026',
    status: 'Publication prochaine',
    summary: "Mesurer à quel point les débats politiques en ligne divisent, sur 5 réseaux sociaux, avec de l'IA plutôt qu'en lisant tout à la main.",
    points: [
      'Plus de 32 000 commentaires et 2 000 mèmes analysés automatiquement',
      "L'IA repère les mèmes qui parlent de « nous » (40 %) et ceux qui visent « eux » (23 %)",
      "Résultat : des bulles presque étanches, où chacun ne parle qu'à son camp",
      'Papier de recherche rédigé sous la direction du Dr Shahana Bano',
    ],
    tags: ['Python', 'IA', 'NLP'],
    demo: { src: '/videos/rgu-dashboard-demo.mp4', poster: '/videos/rgu-dashboard-demo.jpg', duration: '21 s', label: 'Dashboard réel', button: 'Voir le dashboard' },
    link: { href: '/research_paper.pdf', label: 'Lire le papier', kind: 'pdf' },
  },
  {
    number: '04',
    category: 'Application web',
    title: 'Questionary',
    figure: { value: '2 400', label: "étudiants de l'IUT pourraient l'utiliser" },
    meta: 'Projet BUT · En équipe · 2025-2026',
    summary: "Créer un questionnaire, le partager par QR code et lire les résultats sans passer par un tableur, réponses libres comprises.",
    points: [
      "Pensée pour tout l'IUT du Limousin : 2 400 étudiants sur 5 sites, connexion avec le compte de l'université",
      "Des questions qui s'adaptent selon les réponses précédentes",
      'Résultats prêts à partager : mots les plus cités, export PDF, Excel ou CSV',
    ],
    tags: ['Vue.js', 'PHP', 'MariaDB'],
    link: { href: 'https://github.com/Mdeterne/php-mariadb-Questionary', label: 'Voir le dépôt', kind: 'github' },
  },
];

// Fenêtre de chaque projet, dans l'ordre d'affichage des fiches : uniquement du contenu réel
const c = (comment) => ({ comment });
const run = (prompt, cmd) => ({ prompt, cmd });
const out = (text, tone) => ({ out: text, tone });

const PROJECT_STAGE = [
  {
    kind: 'video',
    title: 'Unilim EDT · Emploi du temps',
    footer: "Démo réelle de l'application",
    src: '/videos/unilim-edt-demo.mp4',
    poster: '/videos/unilim-edt-demo.jpg',
  },
  {
    kind: 'video',
    title: 'bcm24.fr',
    footer: 'Visite réelle du site en ligne',
    src: '/videos/bcm-site-demo.mp4',
    poster: '/videos/bcm-site-demo.jpg',
  },
  {
    kind: 'video',
    title: 'We vs Them · Dashboard',
    footer: 'Dashboard réel du stage · CLIP, toxicité et graphe Louvain',
    src: '/videos/rgu-dashboard-demo.mp4',
    poster: '/videos/rgu-dashboard-demo.jpg',
  },
  {
    kind: 'image',
    title: 'Questionary · Accueil',
    footer: "Capture réelle de l'application",
    src: '/img/cards/questionary.png',
    alt: "Accueil de Questionary : création d'un questionnaire, import et liste des questionnaires avec leur QR code",
  },
];

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

// Fiche d'un projet, sur la feuille qui recouvre son affiche : texte à la couleur du projet, démo sur un aplat de cette couleur
const ProjectSheet = ({ project, stage, flipped }) => {
  const [demoOpen, setDemoOpen] = useState(false);
  const { title, category, meta, status, summary, points, tags, link, demo } = project;

  return (
    <div className={`pj-sheet-inner ${flipped ? 'pj-sheet-inner--flipped' : ''}`}>
      <div className="pj-copy">
        <p className="pj-copy-status">{status || category}</p>
        <h3 className="pj-copy-title">{title}</h3>
        <p className="pj-copy-meta">{meta}</p>
        <p className="pj-copy-summary">{summary}</p>
        <ul className="pj-copy-points">
          {points.map((point) => <li key={point}>{point}</li>)}
        </ul>
        <div className="pj-copy-foot">
          <p className="pj-copy-tags">{tags.join(' · ')}</p>
          <div className="pj-copy-actions">
            {demo && (
              <button type="button" className="pj-btn pj-btn--fill" onClick={() => setDemoOpen(true)}>
                <Play size={14} fill="currentColor" />
                <span>{demo.button || 'Voir la démo'} · {demo.duration}</span>
              </button>
            )}
            {link && (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="pj-btn">
                {link.kind === 'github' && <GithubIcon size={15} />}
                {link.kind === 'pdf' && <FileText size={15} />}
                {link.kind === 'site' && <ExternalLink size={15} />}
                <span>{link.label}</span>
                <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="pj-media">
        <ProjectStage {...stage} />
      </div>
      {demoOpen && <DemoModal demo={demo} title={title} onClose={() => setDemoOpen(false)} />}
    </div>
  );
};

// Teinte de chaque projet (RVB), dans l'ordre des fiches
const TINTS = ['emerald', 'cyan', 'accent', 'violet'];

// Chiffre qui défile jusqu'à sa valeur, chiffre par chiffre, quand l'affiche arrive
const RollingFigure = ({ value, prefix }) => (
  <span className="pj-figure-value" aria-label={`${prefix || ''}${value}`}>
    {prefix && <span className="pj-figure-prefix" aria-hidden="true">{prefix}</span>}
    {[...value].map((ch, i) => (/\d/.test(ch) ? (
      <span key={i} className="pj-digit" aria-hidden="true" style={{ '--d': ch, '--i': i }}>
        <span className="pj-digit-strip">
          {'0123456789'.split('').map((n) => <span key={n}>{n}</span>)}
        </span>
      </span>
    ) : (
      <span key={i} aria-hidden="true">{ch === ' ' ? '\u202f' : ch}</span>
    )))}
  </span>
);

const Projects = () => (
  <section
    id="projects"
    style={{
      position: 'relative',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '120px',
      /* clip et non hidden : hidden ferait de la section un conteneur de défilement, et les affiches ne resteraient pas fixes */
      overflow: 'clip',
    }}
  >
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
      <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '90px' }}>
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
          Quatre projets : une application en production à l'IUT, le site d'un club de badminton, un stage de recherche en IA et une application de questionnaires.
        </p>
      </div>
    </div>

    {/* Un chapitre par projet : son affiche reste fixe, puis sa fiche remonte par-dessus comme une feuille */}
    {PROJECT_INFO.map((project, i) => (
      <article key={project.title} className={`pj-chapter pj-chapter--${TINTS[i]}`}>
        <div className="pj-poster">
          <div className="pj-poster-inner">
            <div className="pj-poster-text">
              <p className="pj-poster-category">{project.category}</p>
              <h3 className="pj-poster-title">{project.title}</h3>
            </div>
            <p className="pj-figure">
              <RollingFigure {...project.figure} />
              <span className="pj-figure-label">{project.figure.label}</span>
            </p>
          </div>
        </div>

        <div className="pj-sheet">
          <ProjectSheet project={project} stage={PROJECT_STAGE[i]} flipped={i % 2 === 0} />
        </div>
      </article>
    ))}

      <style dangerouslySetInnerHTML={{ __html: `
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
        /* Chapitres : une affiche fixe dans la teinte du projet, puis la fiche qui remonte par-dessus */
        .pj-chapter { position: relative; view-timeline: --chapter block; }
        .pj-chapter--emerald { --tint: 5, 150, 105; }
        .pj-chapter--cyan { --tint: 14, 116, 144; }
        .pj-chapter--accent { --tint: 37, 99, 235; }
        .pj-chapter--violet { --tint: 124, 58, 237; }

        .pj-poster {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          display: flex;
          align-items: center;
          background: rgb(var(--tint));
          color: #ffffff;
          overflow: hidden;
        }
        .pj-poster-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 96px 24px 48px;
          container-type: inline-size;
          min-height: 72vh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 44px;
        }
        .pj-poster-category {
          margin: 0 0 18px;
          font-family: var(--font-subtitle);
          font-size: 1.05rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
        }
        .pj-poster-title {
          margin: 0;
          font-family: var(--font-display);
          /* Syne est très large : le mot le plus long (« Questionary », ~11,5 em) doit toujours tenir, avec une marge */
          font-size: min(clamp(2.6rem, 6.2vw, 6.4rem), 100cqi / 12.5);
          max-width: 14ch;
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          text-wrap: balance;
        }
        /* Le chiffre en bas à droite répond au titre en haut à gauche ; sa légende passe dessous */
        .pj-figure { margin: 0; align-self: flex-end; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; text-align: right; }
        .pj-figure-value {
          display: inline-flex;
          align-items: flex-start;
          font-family: var(--font-display);
          font-size: clamp(4rem, 10vw, 9rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.05em;
          font-variant-numeric: tabular-nums;
        }
        .pj-figure-prefix { margin-right: 0.04em; }
        .pj-digit { display: inline-block; height: 1em; overflow: hidden; }
        .pj-digit-strip { display: flex; flex-direction: column; transform: translateY(calc(var(--d) * -1em)); }
        .pj-digit-strip span { height: 1em; line-height: 1; }
        .pj-figure-label {
          font-family: var(--font-body);
          font-size: 1.15rem;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.9);
          max-width: 26ch;
        }

        /* La feuille : un écran blanc aux coins hauts arrondis qui recouvre l'affiche */
        .pj-sheet {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: 72px 24px;
          box-sizing: border-box;
          background: var(--bg-primary);
          border-radius: 36px 36px 0 0;
          box-shadow: 0 -24px 60px rgba(17, 24, 39, 0.12);
        }
        .pj-sheet-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          gap: 64px;
          align-items: center;
        }
        .pj-sheet-inner--flipped .pj-media { order: -1; }
        .pj-sheet-inner--flipped { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); }

        /* Texte de la fiche : mêmes voix que l'affiche (Syne en capitales, couleur du projet) */
        .pj-copy { container-type: inline-size; }
        .pj-copy-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px;
          font-family: var(--font-subtitle);
          font-size: 0.95rem;
          font-weight: 700;
          color: rgb(var(--tint));
        }
        .pj-copy-status::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
        .pj-copy-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: min(2.6rem, 100cqi / 12.5);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          text-wrap: balance;
          color: rgb(var(--tint));
        }
        .pj-copy-meta {
          margin: 14px 0 0;
          font-family: var(--font-subtitle);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .pj-copy-summary {
          margin: 24px 0 0;
          font-family: var(--font-body);
          font-size: 1.15rem;
          line-height: 1.55;
          color: var(--text-primary);
        }
        .pj-copy-points {
          list-style: none;
          margin: 22px 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pj-copy-points li {
          position: relative;
          padding-left: 24px;
          font-family: var(--font-body);
          font-size: 0.98rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }
        .pj-copy-points li::before {
          content: '';
          position: absolute;
          left: 0; top: 0.42em;
          width: 12px; height: 12px;
          border-radius: 4px;
          background: rgb(var(--tint));
        }
        .pj-copy-foot {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .pj-copy-tags {
          margin: 0;
          font-family: var(--font-subtitle);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .pj-copy-actions { display: flex; flex-wrap: wrap; gap: 10px; }
        .pj-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-family: var(--font-subtitle);
          font-size: 0.92rem;
          font-weight: 700;
          text-decoration: none;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.1);
          transition: background-color var(--duration-normal) var(--ease-out), transform var(--duration-fast) var(--ease-out);
        }
        .pj-btn--fill { color: #ffffff; background: rgb(var(--tint)); }
        .pj-btn:active { transform: scale(0.97); }
        @media (hover: hover) and (pointer: fine) {
          .pj-btn:hover { background: rgba(var(--tint), 0.18); }
          .pj-btn--fill:hover { background: rgba(var(--tint), 0.88); }
        }

        /* La démo posée sur un aplat de la couleur du projet, comme un morceau de son affiche */
        .pj-media {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(24px, 4vw, 56px);
          border-radius: 28px;
          background: rgb(var(--tint));
        }
        .pj-media > * { width: 100%; }

        /* En mouvement : les chiffres défilent quand l'affiche arrive, et l'affiche recule quand la feuille la couvre */
        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) {
            .pj-digit-strip {
              animation: pj-roll var(--ease-out) both;
              animation-timeline: --chapter;
              animation-range: cover calc(20vh + var(--i) * 4vh) cover calc(85vh + var(--i) * 4vh);
            }
            .pj-poster-inner {
              transform-origin: 50% 30%;
              animation: pj-recede linear both;
              animation-timeline: --chapter;
              animation-range: cover 100vh cover 200vh;
            }
          }
        }
        @keyframes pj-roll { from { transform: translateY(0); } }
        @keyframes pj-recede { to { scale: 0.9; opacity: 0.25; } }

        @media (max-width: 860px) {
          .pj-poster-inner { gap: 32px; padding: 96px 20px 40px; }
          .pj-figure { align-self: flex-start; align-items: flex-start; text-align: left; }

          .pj-figure-value { font-size: clamp(3.6rem, 22vw, 6rem); }
          .pj-sheet { padding: 40px 16px; border-radius: 28px 28px 0 0; }
          .pj-sheet-inner, .pj-sheet-inner--flipped { grid-template-columns: 1fr; gap: 28px; }
          .pj-sheet-inner--flipped .pj-media { order: 0; }
          .pj-media { padding: 16px; border-radius: 22px; }
        }
      `}} />
  </section>
);

export default Projects;
