import React, { useState, useEffect, useRef } from 'react';
import { Code, Cpu, Server, Database, Users, ShieldAlert, ShieldCheck, Sparkles, Monitor, Building2, Briefcase } from 'lucide-react';
import AntigravityCanvas from '../components/AntigravityCanvas';

// Canvas de fond ondulé
const SkillsMesh = ({ mode }) => {
  return (
    <AntigravityCanvas
      mode={mode}
      colorScheme="amber"
      density="low"
      clusterRight={false}
      velocityStretch={false}
    />
  );
};

// Section des compétences
const Skills = ({ theme }) => {
  const [active, setActive] = useState(null);

  const skills = [
    {
      id: 'c1', code: 'C1', title: 'Réaliser', icon: <Code size={22} />,
      level: 'Niveau 3 · Adapter',
      desc: 'Développer des applications complexes avec des architectures robustes et réactives.',
      highlights: ['Alternance Ceva Santé Animale (Applications métiers & SI)', 'Unilim EDT (Laravel 11 / Vue 3 / OR-Tools)', 'Questionary (Vue.js + NLP)'],
      techs: ['React', 'Vue.js', 'Node.js', 'TypeScript', 'Python', 'PHP', 'Docker'],
    },
    {
      id: 'c2', code: 'C2', title: 'Optimiser', icon: <Cpu size={22} />,
      level: 'Niveau 3 · Adapter',
      desc: 'Maximiser les performances algorithmiques et matérielles des applications.',
      highlights: ['Solveur OR-Tools CP-SAT (Unilim EDT)', 'Moteur streaming FFmpeg', 'Exploration active de Rust'],
      techs: ['Python', 'Google OR-Tools', 'Rust', 'Java', 'Lua'],
    },
    {
      id: 'c3', code: 'C3', title: 'Administrer', icon: <Server size={22} />,
      level: 'Niveau 3 · Adapter',
      desc: 'Configurer et sécuriser des systèmes, hyperviseurs et services réseau.',
      highlights: ['NixOS', 'Clusters Proxmox VE', 'Homelab personnel sécurisé'],
      techs: ['Proxmox VE', 'Docker', 'NixOS'],
    },
    {
      id: 'c4', code: 'C4', title: 'Gérer', icon: <Database size={22} />,
      level: 'Niveau 3 · Adapter',
      desc: 'Concevoir et gérer des bases de données relationnelles performantes.',
      highlights: ['Schémas normalisés MariaDB', 'Optimisation indexes SQL', 'Modélisation relationnelle'],
      techs: ['MariaDB', 'MySQL', 'SQL', 'Modélisation BDD'],
    },
    {
      id: 'c5', code: 'C5', title: 'Conduire', icon: <Users size={22} />,
      level: 'Niveau 3 · Adapter',
      desc: 'Coordonner des équipes et appliquer les méthodologies agiles.',
      highlights: ['Agilité & Scrum en entreprise (Ceva Santé Animale)', 'Lead équipe 4 devs (Unilim EDT)', 'Stage Erasmus+ R&D Écosse'],
      techs: ['Agile', 'Git', 'Gestion de Projet', 'Collaboration'],
    },
    {
      id: 'c6', code: 'C6', title: 'Sécuriser', icon: <ShieldAlert size={22} />,
      level: 'Niveau 3 · Adapter',
      desc: 'Protéger les données et systèmes contre les menaces numériques.',
      highlights: ['Certification Cisco Ethical Hacker (en préparation)', 'Cours Cisco validé : Introduction à la cybersécurité', 'Architecture réseau multi-zones (Kathara)', 'Cryptographie & Chiffrement AES-256'],
      techs: ['Cisco CyberSec', 'Cybersécurité', 'Cryptographie', 'AES-256', 'Sécurité Réseau'],
    },
  ];

  const activeSkill = skills.find((s) => s.id === active);

  return (
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

        {/* Ruban des technologies, de l'IA et des certifications */}
        <div className="sk-ribbon reveal-on-scroll delay-100">
          <div className="sk-ribbon-group">
            <Monitor size={15} style={{ color: 'var(--accent-hover)', flexShrink: 0 }} />
            <span className="sk-ribbon-label">Environnement</span>
            {['macOS', 'NixOS', 'Proxmox', 'Docker'].map((e) => (
              <span key={e} className="sk-env-tag">{e}</span>
            ))}
          </div>
          <span className="sk-ribbon-sep" />
          <div className="sk-ribbon-group">
            <Sparkles size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span className="sk-ribbon-label" style={{ color: 'var(--accent-hover)' }}>IA & Auto.</span>
            {['NLP', 'CLIP', 'OR-Tools', 'LLM'].map((a) => (
              <span key={a} className="sk-ai-tag">{a}</span>
            ))}
          </div>
          <span className="sk-ribbon-sep" />
          <div className="sk-ribbon-group">
            <ShieldCheck size={15} style={{ color: '#10b981', flexShrink: 0 }} />
            <span className="sk-ribbon-label" style={{ color: '#10b981' }}>Certification</span>
            <span className="sk-env-tag" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--text-primary)', fontWeight: 700 }}>
              Cisco · Introduction à la cybersécurité
            </span>
            <span className="sk-env-tag" style={{ border: '1px dashed rgba(16, 185, 129, 0.4)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 700 }}>
              Cisco · Ethical Hacker (en préparation)
            </span>
          </div>
          <span className="sk-ribbon-sep" />
          <div className="sk-ribbon-group">
            <Building2 size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span className="sk-ribbon-label" style={{ color: 'var(--accent)' }}>Entreprise</span>
            <span className="sk-env-tag" style={{ border: '1px solid rgba(227, 93, 59, 0.3)', background: 'rgba(227, 93, 59, 0.08)', color: 'var(--text-primary)', fontWeight: 700 }}>
              Alternance · Ceva Santé Animale
            </span>
          </div>
        </div>

        {/* Noeuds de compétences interactifs */}
        <div className="sk-nodes reveal-scale delay-200">
          {skills.map((skill) => {
            const isActive = active === skill.id;
            return (
              <button
                key={skill.id}
                className={`sk-node ${isActive ? 'sk-node--on' : ''}`}
                onClick={() => setActive(isActive ? null : skill.id)}
              >
                <span className={`sk-node-icon ${isActive ? 'sk-node-icon--on' : ''}`}>
                  {skill.icon}
                </span>
                <div className="sk-node-body">
                  <span className="sk-node-code">{skill.code}</span>
                  <span className="sk-node-name">{skill.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Panneau de détails */}
        <div className={`sk-detail ${activeSkill ? 'sk-detail--open' : ''}`}>
          {activeSkill && (
            <div className="sk-detail-box" key={activeSkill.id}>
              {/* Colonne 1: Description et niveau */}
              <div className="sk-detail-col sk-detail-main">
                <p className="sk-detail-desc">{activeSkill.desc}</p>
                <div className="sk-detail-level">
                  <span>{activeSkill.level}</span>
                </div>
              </div>
              {/* Colonne 2: Réalisations marquantes */}
              <div className="sk-detail-col">
                <span className="sk-detail-label">Réalisations</span>
                <ul className="sk-detail-list">
                  {activeSkill.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
              {/* Colonne 3: Technologies */}
              <div className="sk-detail-col">
                <span className="sk-detail-label">Stack</span>
                <div className="sk-detail-tags">
                  {activeSkill.techs.map((t) => <span key={t} className="sk-detail-tag">{t}</span>)}
                </div>
              </div>
            </div>
          )}
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
        .sk-header { text-align: center; margin-bottom: 40px; }
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

        /* Styles du ruban de badges */
        .sk-ribbon {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 48px;
          padding: 14px 28px;
          border-radius: 80px;
          background: var(--glass-bg);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
        }
        .sk-ribbon-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .sk-ribbon-sep {
          width: 1px;
          height: 22px;
          background: var(--border-color);
        }
        .sk-ribbon-label {
          font-family: var(--font-subtitle);
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sk-env-tag {
          font-family: var(--font-subtitle);
          font-weight: 700;
          font-size: 0.7rem;
          color: var(--text-primary);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          padding: 4px 14px;
          border-radius: 50px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .sk-ai-tag {
          font-family: var(--font-subtitle);
          font-weight: 700;
          font-size: 0.7rem;
          color: var(--accent-hover);
          background: var(--accent-light);
          border: 1px solid rgba(var(--accent-rgb), 0.18);
          padding: 4px 14px;
          border-radius: 50px;
          box-shadow: 0 2px 6px rgba(var(--accent-rgb), 0.02);
        }

        /* Styles des nœuds */
        .sk-nodes {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 18px;
        }

        .sk-node {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 26px 14px 16px;
          border-radius: 80px;
          border: 1px solid var(--border-color);
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          cursor: pointer;
          transition: transform var(--duration-fast) var(--ease-out),
                      background-color var(--duration-normal) var(--ease-out),
                      border-color var(--duration-normal) var(--ease-out),
                      box-shadow var(--duration-normal) var(--ease-out);
          outline: none;
          font-family: inherit;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }
        @media (hover: hover) and (pointer: fine) {
          .sk-node:hover {
            background: var(--bg-primary);
            opacity: 0.95;
            border-color: rgba(var(--accent-rgb), 0.4);
            transform: translateY(-3px);
            box-shadow: 0 16px 36px rgba(0,0,0,0.06);
          }
        }
        .sk-node:active {
          transform: scale(0.97) translateY(0) !important;
          transition-duration: 80ms !important;
        }
        .sk-node--on {
          background: var(--bg-primary) !important;
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 4px var(--accent-light), 0 16px 36px rgba(0,0,0,0.06) !important;
          transform: translateY(-3px) !important;
        }

        .sk-node-icon {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          display: flex; align-items: center; justify-content: center;
          transition: background-color var(--duration-normal) var(--ease-out),
                      color var(--duration-normal) var(--ease-out),
                      box-shadow var(--duration-normal) var(--ease-out);
          flex-shrink: 0;
        }
        .sk-node-icon--on {
          background: var(--accent-gradient);
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(var(--accent-rgb), 0.35);
        }

        .sk-node-body {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .sk-node-code {
          font-family: var(--font-subtitle);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--accent-hover);
          opacity: 0.75;
          margin-bottom: 2px;
        }
        .sk-node--on .sk-node-code { opacity: 1; }
        .sk-node-name {
          font-family: var(--font-title);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.15;
        }

        /* Styles du panneau de détail */
        .sk-detail {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s var(--ease-out),
                      margin 0.35s var(--ease-out),
                      opacity 0.22s var(--ease-out);
          opacity: 0;
        }
        .sk-detail--open {
          max-height: 320px;
          margin-top: 36px;
          opacity: 1;
        }

        .sk-detail-box {
          display: grid;
          grid-template-columns: 1.4fr 1fr 0.8fr;
          gap: 36px;
          padding: 32px 36px;
          border-radius: 24px;
          background: var(--glass-bg);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.04);
          animation: skReveal 220ms var(--ease-drawer) forwards;
          transform-origin: top center;
        }
        @keyframes skReveal {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sk-detail-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sk-detail-main { gap: 18px; }

        .sk-detail-desc {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .sk-detail-level {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sk-detail-level span {
          font-family: var(--font-subtitle);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
        }
        .sk-detail-label {
          font-family: var(--font-subtitle);
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--accent-hover);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.8;
        }

        .sk-detail-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sk-detail-list li {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: var(--text-primary);
          line-height: 1.4;
          padding-left: 16px;
          position: relative;
        }
        .sk-detail-list li::before {
          content: '';
          position: absolute;
          left: 0; top: 6px;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
        }

        .sk-detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .sk-detail-tag {
          font-family: var(--font-subtitle);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--bg-tertiary);
          padding: 5px 13px;
          border-radius: 50px;
        }

        /* Styles adaptatifs mobiles */
        @media (max-width: 860px) {
          .sk-detail-box {
            grid-template-columns: 1fr 1fr !important;
          }
          .sk-detail-box .sk-detail-col:last-child {
            grid-column: 1 / -1;
          }
          .sk-detail--open { max-height: 420px; }
        }
        @media (max-width: 600px) {
          .sk-nodes { flex-direction: column; align-items: stretch; }
          .sk-detail-box {
            grid-template-columns: 1fr !important;
            padding: 24px;
          }
          .sk-detail--open { max-height: 650px; }
          .sk-ribbon {
            flex-direction: column;
            border-radius: 20px;
            gap: 12px;
          }
          .sk-ribbon-sep { width: 100%; height: 1px; }
        }
      `}} />
    </section>
  );
};

export default Skills;
