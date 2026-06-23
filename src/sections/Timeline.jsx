import React, { useState } from 'react';
import { Calendar, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import useSpotlight from '../hooks/useSpotlight';
import TextScramble from '../components/TextScramble';

const Timeline = () => {
  const containerRef = useSpotlight();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const timelineData = [
    {
      date: '2020 - 2024',
      title: 'Lycée - Baccalauréat',
      sub: 'Spécialités Mathématiques et NSI',
      icon: <GraduationCap size={18} />,
      desc: 'Premiers pas passionnés en programmation avec le langage Python et l\'apprentissage des bases du développement web (HTML5/CSS3). Option de spécialisation scientifique renforcée.',
      location: 'Sainte-Foy-la-Grande, France'
    },
    {
      date: '2024 - Présent',
      title: 'BUT Informatique - 2ème Année',
      sub: 'IUT Limousin',
      icon: <CodeIcon />,
      desc: 'Spécialisation dans le développement logiciel full-stack, l\'intelligence artificielle, la cybersécurité et l\'administration système. Configuration Linux sous NixOS, virtualisation sous Proxmox et conteneurisation Docker.',
      location: 'Limoges, France'
    },
    {
      date: 'Avril - Juin 2026',
      title: 'Stage Erasmus+ de Recherche',
      sub: 'Robert Gordon University (RGU)',
      icon: <Briefcase size={18} />,
      desc: 'Stage de recherche Erasmus+ sous la supervision du Dr Shahana Bano. Conception de classifieurs NLP et multimodaux (CLIP, Perspective API) pour analyser la polarisation discursive et la propagande cross-plateforme. Papier de recherche rédigé, publication prochaine.',
      location: 'Limoges/Bordeaux'
    }
  ];

  return (
    <section
      id="timeline"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-secondary)',
        overflow: 'hidden',
      }}
    >
      {/* Lueur d'arrière-plan */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(227, 93, 59, 0.02) 0%, rgba(255, 255, 255, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div className="section-container" style={{ paddingBottom: '140px', position: 'relative', zIndex: 1 }}>
        {/* Titre de la section */}
        <div className="reveal-on-scroll" style={{ textAlign: 'center', marginBottom: '70px' }}>
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
            Un itinéraire académique et professionnel alliant théorie solide,
            expérimentations technologiques avancées et immersion internationale.
          </p>
        </div>

        {/* Conteneur de la timeline */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {/* Ligne verticale de liaison */}
          <div
            style={{
              position: 'absolute',
              left: '31px',
              top: '10px',
              bottom: '10px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--accent) 0%, var(--bg-tertiary) 100%)',
            }}
            className="timeline-line"
          />

          {/* Éléments de la timeline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
            }}
          >
            {timelineData.map((item, i) => {
              const isCurrent = item.date.includes('ACTUEL');
              const isHovered = hoveredIdx === i;

              return (
                <div
                  key={i}
                  className={`reveal-on-scroll delay-${i * 150}`}
                  style={{
                    display: 'flex',
                    gap: '28px',
                    position: 'relative',
                  }}
                >

                  {/* Point de repère sur la ligne */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-primary)',
                      border: isCurrent || isHovered ? '3px solid var(--accent)' : '2px solid var(--accent)',
                      boxShadow: isCurrent || isHovered
                        ? '0 0 25px rgba(227, 93, 59, 0.4)'
                        : '0 8px 24px rgba(227, 93, 59, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      flexShrink: 0,
                      zIndex: 2,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Carte de contenu de l'expérience */}
                  <div
                    className="glass-panel spotlight-card"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                      padding: '28px',
                      background: 'var(--bg-primary)',
                      borderWidth: '1px',
                      borderColor: isCurrent || isHovered ? 'rgba(227, 93, 59, 0.35)' : 'var(--border-color)',
                      borderRadius: '24px',
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      boxShadow: isCurrent || isHovered
                        ? '0 20px 40px rgba(227, 93, 59, 0.05)'
                        : '0 10px 30px rgba(0,0,0,0.01)',
                      transition: 'var(--transition-smooth)',
                      position: 'relative',
                      overflow: 'hidden',
                      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                    }}
                  >
                    {/* Effet spotlight au survol */}
                    <div
                      className="spotlight-overlay"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '24px',
                        background: 'radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), rgba(227, 93, 59, 0.08), transparent)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    />

                    {/* Badge de date */}
                    <span
                      style={{
                        fontFamily: 'var(--font-subtitle)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: 'var(--accent-hover)',
                        backgroundColor: 'var(--accent-light)',
                        padding: '4px 12px',
                        borderRadius: '50px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        letterSpacing: '0.05em',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <Calendar size={12} />
                      {item.date}
                    </span>

                    {/* Titre et sous-titre */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginTop: '16px',
                        position: 'relative',
                        zIndex: 2,
                        cursor: 'pointer',
                      }}
                    >
                      <TextScramble text={item.title} hover={true} />
                    </h3>

                    <h4
                      style={{
                        fontFamily: 'var(--font-subtitle)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        marginTop: '4px',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      {item.sub}
                    </h4>

                    {/* Description de l'expérience */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginTop: '12px',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      {item.desc}
                    </p>

                    {/* Localisation géographique */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'var(--font-subtitle)',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginTop: '18px',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Icône de code sur mesure
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export default Timeline;
