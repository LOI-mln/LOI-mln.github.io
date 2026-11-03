import React from 'react';
import { Code, Cpu, Server, Database, Users, ShieldAlert, ShieldCheck, Sparkles, Monitor, Building2 } from 'lucide-react';
import AntigravityCanvas from '../components/AntigravityCanvas';

// Canvas de fond ondulé
const SkillsMesh = ({ mode }) => {
  return (
    <AntigravityCanvas
      mode={mode}
      colorScheme="blue"
      density="low"
      clusterRight={false}
      velocityStretch={false}
    />
  );
};

// Les six compétences du BUT, dans l'ordre de la grille
const SKILLS = [
  {
    code: 'C1', title: 'Réaliser', icon: <Code size={20} />,
    desc: 'Développer des applications complexes avec des architectures robustes et réactives.',
    highlights: ['Alternance Ceva Santé Animale : applications métiers et SI', 'Unilim EDT : Laravel 11, Vue 3 et OR-Tools', 'Questionary : Vue.js et analyse des réponses libres'],
    techs: ['React', 'Vue.js', 'Node.js', 'TypeScript', 'Python', 'PHP', 'Docker'],
  },
  {
    code: 'C2', title: 'Optimiser', icon: <Cpu size={20} />,
    desc: 'Maximiser les performances algorithmiques et matérielles des applications.',
    highlights: ['Solveur OR-Tools CP-SAT (Unilim EDT)', 'Moteur de streaming FFmpeg', 'Exploration active de Rust'],
    techs: ['Python', 'Google OR-Tools', 'Rust', 'Java', 'Lua'],
  },
  {
    code: 'C3', title: 'Administrer', icon: <Server size={20} />,
    desc: 'Configurer et sécuriser des systèmes, hyperviseurs et services réseau.',
    highlights: ['Postes et serveurs sous NixOS', 'Clusters Proxmox VE', 'Homelab personnel sécurisé'],
    techs: ['Proxmox VE', 'Docker', 'NixOS'],
  },
  {
    code: 'C4', title: 'Gérer', icon: <Database size={20} />,
    desc: 'Concevoir et gérer des bases de données relationnelles performantes.',
    highlights: ['Schémas normalisés MariaDB', 'Optimisation des index SQL', 'Modélisation relationnelle'],
    techs: ['MariaDB', 'MySQL', 'SQL'],
  },
  {
    code: 'C5', title: 'Conduire', icon: <Users size={20} />,
    desc: 'Coordonner des équipes et appliquer les méthodologies agiles.',
    highlights: ['Agilité et Scrum en entreprise (Ceva Santé Animale)', "Lead d'une équipe de 4 devs (Unilim EDT)", 'Stage Erasmus+ de R&D en Écosse'],
    techs: ['Agile', 'Git', 'Gestion de projet'],
  },
  {
    code: 'C6', title: 'Sécuriser', icon: <ShieldAlert size={20} />,
    desc: 'Protéger les données et systèmes contre les menaces numériques.',
    highlights: ['Cours Cisco validé : Introduction à la cybersécurité', 'Architecture réseau multi-zones (Kathara)', 'Cryptographie et chiffrement AES-256'],
    techs: ['Cybersécurité', 'Cryptographie', 'Sécurité réseau'],
  },
];

// Outils et repères affichés dans la dernière carte
const TOOLBOX = [
  { label: 'Environnement', icon: <Monitor size={15} />, items: ['macOS', 'NixOS', 'Proxmox', 'Docker'] },
  { label: 'IA & automatisation', icon: <Sparkles size={15} />, items: ['NLP', 'CLIP', 'OR-Tools', 'LLM'], tone: 'ai' },
  { label: 'Certification', icon: <ShieldCheck size={15} />, items: ['Cisco · Introduction à la cybersécurité'], tone: 'ok' },
  { label: 'Entreprise', icon: <Building2 size={15} />, items: ['Alternance · Ceva Santé Animale'], tone: 'ai' },
];

// Carte d'une compétence : tout son contenu est visible, sans clic
const SkillCard = ({ code, title, icon, desc, highlights, techs, featured, delay }) => (
  <article className={`sk-card sk-card--${code.toLowerCase()} ${featured ? 'sk-card--featured' : ''} reveal-on-scroll ${delay}`}>
    <div className="sk-card-top">
      <span className="sk-card-icon">{icon}</span>
      <span className="sk-card-code">{code}</span>
      <span className="sk-card-level">Niveau 3 · Adapter</span>
    </div>
    <h3 className="sk-card-title">{title}</h3>
    <p className="sk-card-desc">{desc}</p>
    <ul className="sk-card-list">
      {highlights.map((h) => <li key={h}>{h}</li>)}
    </ul>
    <div className="sk-card-tags">
      {techs.map((t) => <span key={t} className="sk-card-tag">{t}</span>)}
    </div>
  </article>
);

// Section des compétences
const Skills = ({ theme }) => (
  <section id="skills" className="sk-section">
    <SkillsMesh mode={theme} />

    <div className="sk-inner">
      {/* En-tête de la section */}
      <div className="sk-header reveal-on-scroll">
        <div className="organic-badge" style={{ marginBottom: '16px' }}>
          MATRICE DE COMPÉTENCES
        </div>
        <h2 className="sk-title">
          Savoir-faire{' '}
          <span className="accent-glow-text" style={{ padding: '0 0.05em' }}>Professionnels</span>
        </h2>
        <p className="sk-subtitle">
          Compétences validées par le BUT Informatique et mon alternance chez Ceva Santé Animale, enrichies par mes projets et mon stage international.
        </p>
      </div>

      {/* Grille : Réaliser en vedette, puis les autres compétences et la boîte à outils */}
      <div className="sk-grid">
        {SKILLS.map((skill, i) => (
          <SkillCard key={skill.code} {...skill} featured={i === 0} delay={`delay-${(i % 3) * 100}`} />
        ))}

        <aside className="sk-card sk-tools reveal-on-scroll delay-100">
          <h3 className="sk-tools-title">Boîte à outils</h3>
          <div className="sk-tools-grid">
            {TOOLBOX.map((group) => (
              <div key={group.label} className={`sk-tools-group ${group.tone ? `sk-tools-group--${group.tone}` : ''}`}>
                <span className="sk-tools-label">{group.icon}{group.label}</span>
                <div className="sk-card-tags">
                  {group.items.map((item) => <span key={item} className="sk-card-tag">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>

    <style dangerouslySetInnerHTML={{
      __html: `
      .sk-section {
        position: relative;
        background-color: var(--bg-secondary);
        overflow: hidden;
      }
      .sk-inner {
        position: relative;
        z-index: 1;
        max-width: 1200px;
        margin: 0 auto;
        padding: 96px 24px;
      }

      /* Styles de l'en-tête */
      .sk-header { text-align: center; margin-bottom: 56px; }
      .sk-title {
        font-family: var(--font-display);
        font-size: clamp(2rem, 4.5vw, 3.2rem);
        font-weight: 800;
        color: var(--text-primary);
        letter-spacing: -0.04em;
        text-transform: uppercase;
        line-height: 1.2;
        margin: 0;
      }
      .sk-subtitle {
        max-width: 580px;
        margin: 12px auto 0;
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.6;
      }

      /* Grille : 7 + 5, puis 4 + 4 + 4, puis 5 + 7 */
      .sk-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 20px;
      }
      .sk-card--c1 { grid-column: span 7; }
      .sk-card--c2 { grid-column: span 5; }
      .sk-card--c3, .sk-card--c4, .sk-card--c5 { grid-column: span 4; }
      .sk-card--c6 { grid-column: span 5; }
      .sk-tools { grid-column: span 7; }

      /* Carte d'une compétence */
      .sk-card {
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid var(--border-color);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 4px 16px rgba(17, 24, 39, 0.03);
        container-type: inline-size;
        transition: transform var(--duration-normal) var(--ease-out),
                    border-color var(--duration-normal) var(--ease-out),
                    box-shadow var(--duration-normal) var(--ease-out);
      }
      @media (hover: hover) and (pointer: fine) {
        .sk-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-color-hover);
          box-shadow: 0 20px 44px rgba(17, 24, 39, 0.07);
        }
        .sk-card:hover .sk-card-icon {
          background: var(--accent-gradient);
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(var(--accent-rgb), 0.35);
        }
      }

      .sk-card-top {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 22px;
      }
      .sk-card-icon {
        width: 42px; height: 42px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: var(--accent-light);
        color: var(--accent-hover);
        transition: background-color var(--duration-normal) var(--ease-out),
                    color var(--duration-normal) var(--ease-out),
                    box-shadow var(--duration-normal) var(--ease-out);
      }
      .sk-card-code {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--accent-hover);
      }
      .sk-card-level {
        margin-left: auto;
        font-family: var(--font-subtitle);
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text-muted);
        white-space: nowrap;
      }

      /* Syne est très large : « Administrer » fait 11,6 em, la taille suit donc la largeur de la carte */
      .sk-card-title {
        font-family: var(--font-display);
        font-size: min(2rem, 100cqi / 12);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: -0.03em;
        line-height: 1.05;
        color: var(--text-primary);
        margin: 0 0 10px;
      }
      .sk-card-desc {
        font-family: var(--font-body);
        font-size: 0.95rem;
        line-height: 1.55;
        color: var(--text-secondary);
        margin: 0 0 20px;
        max-width: 46ch;
      }

      .sk-card-list {
        list-style: none;
        padding: 0;
        margin: 0 0 22px;
        display: flex;
        flex-direction: column;
        gap: 9px;
      }
      .sk-card-list li {
        position: relative;
        padding-left: 18px;
        font-family: var(--font-body);
        font-size: 0.9rem;
        line-height: 1.4;
        color: var(--text-primary);
      }
      .sk-card-list li::before {
        content: '';
        position: absolute;
        left: 0; top: 0.5em;
        width: 7px; height: 7px;
        border-radius: 50%;
        background: var(--accent);
      }

      .sk-card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: auto;
        position: relative;
      }
      .sk-card-tag {
        font-family: var(--font-subtitle);
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-primary);
        background: var(--bg-tertiary);
        padding: 6px 13px;
        border-radius: 50px;
      }

      /* Réaliser, en vedette : carte sombre, titre plus grand */
      .sk-card--featured {
        padding: 36px;
        background: var(--bg-inverse);
        border-color: rgba(255, 255, 255, 0.06);
        color: var(--text-inverse);
        box-shadow: 0 24px 60px rgba(17, 24, 39, 0.18);
      }
      .sk-card--featured::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 100% 0%, rgba(var(--accent-rgb), 0.35), transparent 55%);
        pointer-events: none;
      }
      .sk-card--featured > * { position: relative; }
      .sk-card--featured .sk-card-icon { background: var(--accent-gradient); color: #ffffff; }
      .sk-card--featured .sk-card-code { color: #93c5fd; }
      .sk-card--featured .sk-card-level { color: rgba(255, 255, 255, 0.55); }
      .sk-card--featured .sk-card-title { color: #ffffff; font-size: min(3.4rem, 100cqi / 9); margin-bottom: 14px; }
      .sk-card--featured .sk-card-desc { color: rgba(255, 255, 255, 0.72); font-size: 1.02rem; }
      .sk-card--featured .sk-card-list li { color: #ffffff; font-size: 0.95rem; }
      .sk-card--featured .sk-card-list li::before { background: #60a5fa; }
      .sk-card--featured .sk-card-tag { color: #ffffff; background: rgba(255, 255, 255, 0.1); }
      @media (hover: hover) and (pointer: fine) {
        .sk-card--featured:hover { border-color: rgba(var(--accent-rgb), 0.5); box-shadow: 0 28px 64px rgba(17, 24, 39, 0.24); }
      }

      /* Boîte à outils */
      .sk-tools-title {
        font-family: var(--font-display);
        font-size: clamp(1.6rem, 2.4vw, 2rem);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: -0.03em;
        line-height: 1.05;
        color: var(--text-primary);
        margin: 0 0 24px;
      }
      .sk-tools-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px 28px;
      }
      .sk-tools-group { display: flex; flex-direction: column; gap: 12px; }
      .sk-tools-group .sk-card-tags { margin-top: 0; }
      .sk-tools-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-subtitle);
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text-muted);
      }
      .sk-tools-group--ai .sk-tools-label { color: var(--accent-hover); }
      .sk-tools-group--ai .sk-card-tag { color: var(--accent-hover); background: var(--accent-light); }
      .sk-tools-group--ok .sk-tools-label { color: #047857; }
      .sk-tools-group--ok .sk-card-tag { background: rgba(16, 185, 129, 0.1); }

      /* Tablette : deux colonnes, Réaliser sur toute la largeur, la boîte à outils à côté de Sécuriser */
      @media (max-width: 960px) {
        .sk-grid { grid-template-columns: 1fr 1fr; }
        .sk-card--c1 { grid-column: 1 / -1; }
        .sk-card--c2, .sk-card--c3, .sk-card--c4, .sk-card--c5, .sk-card--c6, .sk-tools { grid-column: span 1; }
        .sk-tools-grid { grid-template-columns: 1fr; gap: 20px; }
      }
      /* « Professionnels » est très long en Syne : la taille suit la largeur d'écran */
      @media (max-width: 560px) {
        .sk-title { font-size: 5.6vw; }
      }
      @media (max-width: 640px) {
        .sk-grid { grid-template-columns: 1fr; gap: 16px; }
        .sk-card, .sk-card--featured { padding: 24px; }
        .sk-tools-grid { grid-template-columns: 1fr; gap: 20px; }
      }
    `}} />
  </section>
);

export default Skills;
