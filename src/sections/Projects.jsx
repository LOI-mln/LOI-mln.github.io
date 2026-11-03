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
    title: 'Site du BCM',
    figure: { value: '25', label: 'partenaires du club mis en avant' },
    meta: 'Badminton Club Montponnais · depuis 2026',
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

// Bloc texte d'une fiche : pastille, titre, contexte, résumé, points clés, pied (technos + lien)
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

const ProjectSummary = ({ number, category, title, meta, status, summary, points, tags, link, demo }) => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
  <div className="project-content ps">
    <div className="ps-eyebrow">
      <span>{number}</span>
      <span>{category}</span>
    </div>
    <h3 className="ps-title">
      {title}
    </h3>
    <p className="ps-meta">
      <span>{meta}</span>
      {status && <span className="ps-status">{status}</span>}
    </p>
    <p className="ps-summary">{summary}</p>
    <ul className="ps-points">
      {points.map((point) => (
        <li key={point}>
          <span className="ps-check"><Check size={12} strokeWidth={3} /></span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
    <div className="ps-footer">
      <div className="ps-tags">
        {tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="ps-actions">
        {demo && (
          <button type="button" className="ps-link ps-link--demo" onClick={() => setDemoOpen(true)}>
            <Play size={14} fill="currentColor" />
            <span>{demo.button || 'Voir la démo'} · {demo.duration}</span>
          </button>
        )}
        {link && (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="ps-link">
            {link.kind === 'github' && <GithubIcon size={15} />}
            {link.kind === 'pdf' && <FileText size={15} />}
            {link.kind === 'site' && <ExternalLink size={15} />}
            <span>{link.label}</span>
            <ArrowUpRight size={15} />
          </a>
        )}
      </div>
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
          <div className="project-card-showcase">
            <div className={`card-ambient-glow card-glow-${TINTS[i]}`} />
            <div className="project-row" style={{ display: 'flex', gap: '56px', alignItems: 'center', flexDirection: i % 2 ? 'row' : 'row-reverse', position: 'relative', zIndex: 1 }}>
              <ProjectSummary {...project} />
              <div className="project-mockup" style={{ flex: '1.15', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
                <ProjectStage {...PROJECT_STAGE[i]} />
              </div>
            </div>
          </div>
        </div>
      </article>
    ))}

      <style dangerouslySetInnerHTML={{ __html: `
        /* Premium Showcase Card Frame */
        .project-card-showcase {
          position: relative;
          border-radius: 28px;
          background: var(--bg-primary);
          border: 1px solid rgba(17, 24, 39, 0.08);
          box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04), 0 24px 48px -24px rgba(17, 24, 39, 0.14);
          padding: 14px;
          margin-bottom: 96px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .project-card-showcase:hover {
          transform: translateY(-4px);
          box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04), 0 32px 64px -28px rgba(17, 24, 39, 0.22);
        }
        .project-card-showcase .card-ambient-glow { display: none; }

        /* Teinte propre à chaque projet (RVB) */
        .card-glow-violet ~ .project-row { --tint: 124, 58, 237; }
        .card-glow-accent ~ .project-row { --tint: 37, 99, 235; }
        .card-glow-emerald ~ .project-row { --tint: 5, 150, 105; }
        .card-glow-cyan ~ .project-row { --tint: 14, 116, 144; }

        .project-row {
          gap: 0 !important;
          align-items: stretch !important;
        }

        /* Panneau teinté qui accueille la fenêtre du projet */
        .project-mockup {
          align-self: stretch;
          align-items: stretch;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(var(--tint), 0.12);
          background:
            radial-gradient(120% 90% at 50% 0%, rgba(var(--tint), 0.16), transparent 65%),
            radial-gradient(rgba(var(--tint), 0.16) 1px, transparent 1px) 0 0 / 18px 18px,
            rgba(var(--tint), 0.04);
        }

        /* Bloc texte des fiches */
        .ps {
          flex: 1;
          min-width: 300px;
          padding: 36px 40px 28px;
          display: flex;
          flex-direction: column;
        }
        .ps-eyebrow {
          align-self: flex-start;
          display: inline-flex; gap: 8px; align-items: center;
          font-family: var(--font-subtitle);
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.08);
          border: 1px solid rgba(var(--tint), 0.16);
          padding: 5px 12px;
          border-radius: 999px;
          margin-bottom: 18px;
        }
        .ps-eyebrow span:first-child { font-family: monospace; opacity: 0.7; }
        .ps-title {
          font-family: var(--font-title);
          font-size: clamp(2rem, 3.4vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--text-primary);
          margin: 0 0 10px 0;
        }
        .ps-meta {
          display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px;
          font-family: var(--font-subtitle);
          font-size: 0.85rem; font-weight: 600;
          color: var(--text-muted);
          margin: 0 0 22px 0;
        }
        .ps-status {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgb(var(--tint));
          font-weight: 700;
        }
        .ps-status::before {
          content: '';
          width: 7px; height: 7px; border-radius: 50%;
          background: rgb(var(--tint));
          box-shadow: 0 0 0 3px rgba(var(--tint), 0.18);
        }
        .ps-summary {
          font-family: var(--font-body);
          font-size: 1.12rem; line-height: 1.6;
          color: var(--text-primary);
          margin: 0 0 22px 0;
          max-width: 520px;
        }
        .ps-points {
          list-style: none; padding: 0;
          margin: 0 0 28px 0;
          display: flex; flex-direction: column; gap: 12px;
        }
        .ps-points li {
          display: flex; gap: 12px; align-items: flex-start;
          font-size: 0.95rem; line-height: 1.5;
          color: var(--text-secondary);
        }
        .ps-check {
          flex-shrink: 0;
          width: 20px; height: 20px; margin-top: 1px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.1);
        }
        .ps-footer {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(17, 24, 39, 0.07);
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: 14px;
        }
        .ps-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .ps-tags span {
          font-family: var(--font-subtitle);
          font-size: 0.76rem; font-weight: 600;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 4px 9px;
          border-radius: 6px;
        }
        .ps-link {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-subtitle);
          font-size: 0.88rem; font-weight: 700;
          color: rgb(var(--tint));
          background: rgba(var(--tint), 0.08);
          padding: 9px 16px;
          border-radius: 999px;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        .ps-link svg:last-child { transition: transform 0.2s ease; }
        .ps-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .ps-link--demo {
          border: none;
          cursor: pointer;
          color: #fff;
          background: rgb(var(--tint));
        }

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
        @media (hover: hover) and (pointer: fine) {
          .ps-link:hover { background: rgba(var(--tint), 0.15); }
          .ps-link--demo:hover { background: rgba(var(--tint), 0.88); }
          .ps-link:hover svg:last-child { transform: translate(2px, -2px); }
        }

        /* Mobile : fenêtre compacte sous le texte */
        @media (max-width: 767px) {
          .project-mockup {
            min-width: 0 !important;
            padding: 12px !important;
          }
        }

        @media (max-width: 991px) {
          .project-card-showcase {
            padding: 10px !important;
            margin-bottom: 40px !important;
            border-radius: 22px !important;
          }
          .project-row {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .ps {
            padding: 22px 16px 16px;
            min-width: 0;
          }
          .project-mockup {
            padding: 32px 16px;
          }
          .project-content {
            width: 100% !important;
            min-width: 100% !important;
          }
          .project-mockup {
            width: 100% !important;
            min-width: 100% !important;
          }
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
          font-size: clamp(2.6rem, 6.2vw, 6.4rem);
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
        .pj-sheet > .project-card-showcase { width: 100%; max-width: 1200px; margin: 0 auto; }

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
          .pj-poster-title { font-size: clamp(2.2rem, 11vw, 3.6rem); }
          .pj-figure-value { font-size: clamp(3.6rem, 22vw, 6rem); }
          .pj-sheet { padding: 40px 12px; border-radius: 28px 28px 0 0; }
        }
      `}} />
  </section>
);

export default Projects;
