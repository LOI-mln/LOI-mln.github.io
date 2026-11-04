import React from 'react';
import JourneyDocuments from '../components/JourneyDocuments';

const timelineData = [
  {
    date: '2020 - 2024',
    title: 'Lycée - Baccalauréat',
    sub: 'Spécialités Mathématiques et NSI',
    desc: 'Premiers pas passionnés en programmation avec le langage Python et l\'apprentissage des bases du développement web (HTML5/CSS3). Option de spécialisation scientifique renforcée.',
    location: 'Sainte-Foy-la-Grande, France'
  },
  {
    date: '2024 - Présent',
    title: 'BUT Informatique - 3ème Année',
    sub: 'IUT Limousin',
    desc: 'Spécialisation dans le développement logiciel full-stack, l\'intelligence artificielle, la cybersécurité et l\'administration système. Configuration Linux sous NixOS, virtualisation sous Proxmox et conteneurisation Docker. Validation de la certification officielle Cisco : Introduction à la cybersécurité.',
    location: 'Limoges, France',
    certifBadge: 'Certification Cisco · Introduction to Cybersecurity'
  },
  {
    date: 'Avril - Juin 2026',
    title: 'Stage Erasmus+ de Recherche',
    sub: 'Robert Gordon University (RGU)',
    desc: 'Stage de recherche Erasmus+ sous la supervision du Dr Shahana Bano. Conception de classifieurs NLP et multimodaux (CLIP, Perspective API) pour analyser la polarisation discursive et la propagande cross-plateforme. Papier de recherche rédigé, publication prochaine.',
    location: 'Aberdeen, Écosse'
  },
  {
    date: 'Sept. 2026 - Présent',
    title: 'Alternance · Développeur & Concepteur Logiciel',
    sub: 'Ceva Santé Animale',
    desc: 'Alternance au sein du groupe Ceva Santé Animale (5ème laboratoire vétérinaire mondial). Conception et développement d\'applications métiers et d\'outils internes, automatisation des flux de données, fiabilisation des processus et travail collaboratif en méthodologie Agile / DevOps.',
    location: 'Libourne / Nouvelle-Aquitaine, France',
    badge: 'Alternance Entreprise · Groupe International'
  }
];

const Timeline = () => (
  <section
    id="timeline"
    style={{
      position: 'relative',
      backgroundColor: 'var(--bg-secondary)',
      overflow: 'clip',
    }}
  >
    <div className="section-container" style={{ paddingBottom: '140px', position: 'relative' }}>
      {/* Titre de la section */}
      <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div className="organic-badge" style={{ marginBottom: '16px' }}>
          EVOLUTIONARY PATH
        </div>
        <h2
          className="section-title"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            lineHeight: '1.25',
            padding: '0.1em 0',
            margin: 0,
          }}
        >
          Mon <span className="accent-glow-text" style={{ padding: '0 0.05em' }}>Parcours</span>
        </h2>
        <p
          style={{
            maxWidth: '600px',
            margin: '16px auto 0 auto',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}
        >
          Quatre étapes, quatre documents : cliquez sur l'un d'eux pour le passer devant.
        </p>
      </div>

      <JourneyDocuments steps={timelineData} />
    </div>
  </section>
);

export default Timeline;
