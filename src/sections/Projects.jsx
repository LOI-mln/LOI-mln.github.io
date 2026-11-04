import React from 'react';
import ProjectStage from '../components/ProjectStage';
import RollingFigure from '../components/RollingFigure';
import { ExternalLink, ArrowUpRight, FileText } from 'lucide-react';

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
    logo: { src: '/img/logos/iut-unilim.png', alt: 'IUT du Limousin, Université de Limoges', height: 64 },
    figure: { value: '200', prefix: '≈ ', label: "personnes s'en servent à l'IUT" },
    meta: "Unilim EDT · Projet BUT · Lead dev, équipe de 4 · 2025-2026",
    status: "En production à l'IUT",
    summary: "L'IUT faisait ses emplois du temps à la main. L'application les construit seule : 3 promotions, 66 enseignants, près de 7 800 heures de cours par an.",
    points: [
      { t: "Génération automatique", d: "un emploi du temps complet, sans aucun conflit, en un clic" },
      { t: "Retouches en direct", d: "on déplace un cours, les conflits sont repérés aussitôt" },
      { t: "Suivi des heures", d: "prévu et réalisé comparés pour chaque enseignant" },
    ],
    tags: ['Python', 'Laravel', 'Vue 3'],
  },
  {
    number: '02',
    category: 'Site web',
    title: 'Site du club de badminton',
    logo: { src: '/img/logos/bcm.png', alt: 'Badminton Club Montponnais', height: 116 },
    figure: { value: '25', label: 'partenaires du club mis en avant' },
    meta: 'Badminton Club Montponnais (bcm24.fr) · depuis 2026',
    status: 'En ligne',
    summary: "Le club de Montpon-Ménestérol, actif depuis 1999, a enfin un site à jour qu'il gère seul.",
    points: [
      { t: "Inscription 100 % en ligne", d: "de la fiche d'inscription au paiement, sans papier" },
      { t: "Espace du bureau", d: "newsletter, calendrier et mails aux adhérents, sans développeur" },
      { t: "Calendrier de la saison", d: "chaque tournoi et chaque soirée du club avec sa fiche" },
    ],
    tags: ['Next.js', 'React'],
    link: { href: 'https://www.bcm24.fr', label: 'Voir le site', kind: 'site' },
  },
  {
    number: '03',
    category: 'Recherche IA',
    title: 'RGU Aberdeen',
    logo: { src: '/img/logos/rgu.svg', alt: 'Robert Gordon University', height: 48 },
    figure: { value: '32 000', prefix: '+', label: "commentaires analysés par l'IA" },
    meta: 'Stage Erasmus+ · Écosse · 2026',
    status: 'Publication prochaine',
    summary: "Mesurer à quel point les débats politiques en ligne divisent, sur 5 réseaux sociaux, avec de l'IA plutôt qu'en lisant tout à la main.",
    points: [
      { t: "IA qui lit et qui voit", d: "la toxicité des messages et le sens des mèmes, image et texte" },
      { t: "Carte des communautés", d: "des bulles où chacun ne parle qu'à son camp" },
      { t: "Dashboard interactif", d: "explorer les résultats et analyser de nouvelles données" },
    ],
    tags: ['Python', 'IA', 'NLP'],
    link: { href: '/research_paper.pdf', label: 'Lire le papier', kind: 'pdf' },
  },
  {
    number: '04',
    category: 'Application web',
    title: 'Questionary',
    logo: { src: '/img/logos/iut-unilim.png', alt: 'IUT du Limousin, Université de Limoges', height: 64 },
    figure: { value: '2 400', label: "étudiants de l'IUT pourraient l'utiliser" },
    meta: 'Projet BUT · En équipe · 2025-2026',
    summary: "Créer un questionnaire, le partager et lire les résultats sans tableur. Pensée pour les 2 400 étudiants de l'IUT du Limousin.",
    points: [
      { t: "Partage par QR code", d: "on répond avec son compte de l'université" },
      { t: "Questions conditionnelles", d: "le questionnaire s'adapte aux réponses" },
      { t: "Analyse automatique", d: "graphiques, mots les plus cités et exports PDF ou Excel" },
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

// Fiche d'un projet, sur la feuille qui recouvre son affiche : texte à la couleur du projet, démo sur un aplat de cette couleur
const ProjectSheet = ({ project, stage, flipped }) => {
  const { title, category, meta, status, summary, points, tags, link } = project;

  return (
    <div className={`pj-sheet-inner ${flipped ? 'pj-sheet-inner--flipped' : ''}`}>
      <div className="pj-copy">
        <p className="pj-copy-status">{status || category}</p>
        <h3 className="pj-copy-title">{title}</h3>
        <p className="pj-copy-meta">{meta}</p>
        <p className="pj-copy-summary">{summary}</p>
        <ul className="pj-copy-points">
          {points.map((point) => <li key={point.t}><strong>{point.t}</strong> — {point.d}</li>)}
        </ul>
        <div className="pj-copy-foot">
          <p className="pj-copy-tags">{tags.join(' · ')}</p>
          <div className="pj-copy-actions">
            {link && (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="pj-btn pj-btn--fill">
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
    </div>
  );
};

// Teinte de chaque projet (RVB), dans l'ordre des fiches
// Couleur de l'établissement de chaque projet : rouge de l'Université de Limoges, vert du club, violet de RGU
const TINTS = ['unilim', 'bcm', 'rgu', 'unilim'];

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
      <article key={project.title} id={`projet-${i + 1}`} className={`pj-chapter pj-chapter--${TINTS[i]}`}>
        <div className="pj-poster">
          <div className="pj-poster-inner">
            <div className="pj-poster-text">
              {project.logo && (
                <img
                  className="pj-poster-logo"
                  src={project.logo.src}
                  alt={project.logo.alt}
                  style={{ '--logo-h': `${project.logo.height}px` }}
                />
              )}
              <p className="pj-poster-category">{project.category}</p>
              <h3 className="pj-poster-title">{project.title}</h3>
            </div>
            <p className="pj-figure">
              <RollingFigure {...project.figure} className="pj-figure-value" />
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

        /* Chapitres : une affiche fixe dans la teinte du projet, puis la fiche qui remonte par-dessus */
        .pj-chapter { position: relative; view-timeline: --chapter block; }
        .pj-chapter--unilim { --tint: 168, 30, 36; }
        .pj-chapter--bcm { --tint: 22, 163, 74; }
        .pj-chapter--rgu { --tint: 113, 33, 119; }

        .pj-poster {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          display: flex;
          align-items: center;
          /* Affiche claire, sur le fond du site : titre en bleu nuit, catégorie et chiffre à la couleur du projet */
          background: var(--bg-secondary);
          color: var(--text-primary);
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
        .pj-poster-logo { display: block; height: var(--logo-h); width: auto; margin: 0 0 22px; }
        .pj-poster-category {
          margin: 0 0 18px;
          font-family: var(--font-subtitle);
          font-size: 1.05rem;
          font-weight: 700;
          color: rgb(var(--tint));
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
          color: rgb(var(--tint));
        }
        .pj-figure-label {
          font-family: var(--font-body);
          font-size: 1.15rem;
          line-height: 1.4;
          color: var(--text-secondary);
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
        .pj-copy-points strong { font-weight: 700; color: var(--text-primary); }
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

        /* La démo posée sur un panneau légèrement teinté de la couleur du projet */
        .pj-media {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(24px, 4vw, 56px);
          border-radius: 28px;
          background: rgba(var(--tint), 0.1);
        }
        .pj-media > * { width: 100%; }

        /* En mouvement : les chiffres défilent quand l'affiche arrive, et l'affiche recule quand la feuille la couvre */
        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) {
            .pj-figure-value .roll-strip {
              animation: roll-in var(--ease-out) both;
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
        @keyframes pj-recede { to { scale: 0.9; opacity: 0.25; } }

        @media (max-width: 860px) {
          .pj-poster-inner { gap: 32px; padding: 96px 20px 40px; }
          .pj-figure { align-self: flex-start; align-items: flex-start; text-align: left; }
          .pj-poster-logo { height: calc(var(--logo-h) * 0.75); margin-bottom: 16px; }

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
