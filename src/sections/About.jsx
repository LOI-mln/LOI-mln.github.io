import React from 'react';
import { Trophy, Zap, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

// Passions et engagements, dans l'ordre d'affichage
const ITEMS = [
  {
    icon: Trophy,
    title: 'Sports & Outdoor',
    text: "Pratique régulière de la boxe anglaise en club pour le cardio et la condition physique. Adepte de randonnées d'endurance en autonomie dans les Pyrénées, les Alpes ou les Highlands, tennis et ski.",
  },
  {
    icon: Zap,
    title: 'Optimisation Latence',
    text: "Recherche empirique sur la réduction de l'input lag matériel et logiciel. Tuning de contrôleurs haute fréquence (claviers magnétiques à effet Hall), OS de jeu légers et micro-firmwares.",
  },
  {
    icon: Sparkles,
    title: 'Recherche & R&D IA',
    text: "Veille constante sur les derniers modèles de langage, l'ingénierie de prompt, et l'intégration d'outils IA dans des écosystèmes locaux (Homelab, Docker, etc.). Capacité à collaborer de manière fluide avec des agents IA pour accélérer le cycle de développement logiciel.",
  },
  {
    icon: ShoppingBag,
    title: 'Achat-Revente & Trade',
    text: "Achat, estimation et revente d'objets de collection (cartes de jeux, rétro-gaming), d'articles de mode en édition limitée (sneakers) et de matériel informatique de pointe (hardware) sur les plateformes en ligne (eBay, Vinted, etc.). Gestion des stocks, logistique internationale d'envoi et relations clients.",
  },
  {
    icon: ShieldCheck,
    title: 'Expérience Terrain',
    text: "Équipier polyvalent chez McDonald's en parallèle de mes études. Une immersion terrain exigeante qui enseigne l'efficacité sous pression, le rythme soutenu et le travail d'équipe rapide.",
  },
];

// Section « Au-delà du code » : aplat vert, en-tête fixe à gauche, passions à droite
const About = () => (
  <section id="about" className="ab-section field">
    <div className="section-container ab-inner">
      <div className="ab-header">
        <div className="organic-badge" style={{ marginBottom: '16px', width: 'fit-content' }}>
          HORS-PISTE
        </div>
        <h2 className="section-title ab-title">
          Au-delà <span className="accent-glow-text">du code</span>
        </h2>
        <p className="ab-subtitle">
          Mes passions, activités secondaires et engagements au quotidien, présentés en toute simplicité.
        </p>
      </div>

      <ul className="ab-list">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="ab-item">
            <span className="ab-icon"><Icon size={18} /></span>
            <div>
              <h3 className="ab-item-title">{title}</h3>
              <p className="ab-item-text">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <style dangerouslySetInnerHTML={{ __html: `
      .ab-section { position: relative; background: rgb(5, 150, 105); color: #ffffff; }
      .ab-inner {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 60px;
        padding-top: 120px;
        padding-bottom: 120px;
      }
      .ab-header { flex: 1; min-width: 280px; position: sticky; top: 120px; padding-bottom: 30px; }
      .ab-title {
        font-size: clamp(2rem, 5vw, 3.2rem);
        color: #ffffff;
        text-transform: uppercase;
        line-height: 1.2;
        margin: 0 0 20px;
      }
      .ab-section .accent-glow-text { color: #a7f3d0; }
      .ab-subtitle {
        max-width: 400px;
        margin: 0;
        font-family: var(--font-body);
        font-size: 1.05rem;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.82);
      }

      .ab-list { flex: 1.5; min-width: 320px; margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 16px; }
      /* Panneaux un ton plus clair que l'aplat, sans bordure ni verre */
      .ab-item {
        display: flex;
        gap: 20px;
        padding: 24px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.1);
        transition: transform var(--duration-normal) var(--ease-out), background-color var(--duration-normal) var(--ease-out);
      }
      @media (hover: hover) and (pointer: fine) {
        .ab-item:hover { transform: translateY(-3px); background: rgba(255, 255, 255, 0.16); }
      }
      .ab-icon {
        flex-shrink: 0;
        width: 40px; height: 40px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: #ffffff;
        color: rgb(5, 150, 105);
      }
      .ab-item-title { margin: 0 0 6px; font-family: var(--font-title); font-size: 1.1rem; font-weight: 700; color: #ffffff; }
      .ab-item-text { margin: 0; font-size: 0.9rem; line-height: 1.55; color: rgba(255, 255, 255, 0.85); }

      @media (max-width: 760px) {
        .ab-inner { gap: 32px; padding-top: 88px; padding-bottom: 88px; }
        .ab-header { position: static; padding-bottom: 0; }
        .ab-list { min-width: 0; }
        .ab-item { padding: 20px; gap: 16px; }
      }
    `}} />
  </section>
);

export default About;
