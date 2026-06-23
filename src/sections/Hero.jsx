import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, MapPin, Award, Shield, FileText } from 'lucide-react';
import MetricGrid from '../components/MetricGrid';

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '140px 24px 60px 24px',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >


      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexGrow: 1,
        }}
      >

        {/* Zone centrale du titre et du portrait */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '520px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginBottom: '40px',
          }}
          className="hero-center-wrapper"
        >
          {/* Titre géant en arrière-plan */}
          <div
            style={{
              position: 'absolute',
              top: '32%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              textAlign: 'center',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-title)", /* Alignement avec la charte Space Grotesk */
                fontSize: 'clamp(4.5rem, 16vw, 11rem)',
                fontWeight: 900,
                color: 'var(--accent)',
                lineHeight: 1,
                letterSpacing: '0.02em',
                margin: 0,
                textTransform: 'uppercase',
                opacity: 0.95,
              }}
            >
              <span className="hero-bg-letter hero-bg-letter-1">M</span>
              <span className="hero-bg-letter hero-bg-letter-2">I</span>
              <span className="hero-bg-letter hero-bg-letter-3" style={{ marginRight: '0.42em' }}>L</span>
              <span className="hero-bg-letter hero-bg-letter-4">A</span>
              <span className="hero-bg-letter hero-bg-letter-5">N</span>
            </h1>
          </div>

          {/* Portrait du concepteur logiciel */}
          <div
            className="hero-portrait-container"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              zIndex: 2,
            }}
          >
            <img
              src="/img/pp.png"
              alt="Milan LOÏ"
              onError={(e) => {
                e.target.src = 'img/pp.png';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(100%) contrast(1.05)',
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              }}
            />
          </div>

          {/* Titre de premier plan */}
          <div
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              textAlign: 'center',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-creative)',
                fontSize: 'clamp(2.6rem, 8vw, 5.8rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: 1,
                margin: 0,
                textTransform: 'none',
              }}
            >
              Concepteur <span className="accent-glow-text" style={{ padding: '0 0.05em' }}>Logiciel</span>
            </h2>
          </div>

          {/* Badge de statut R&D */}
          <div
            className="glass-panel desktop-only"
            style={{
              position: 'absolute',
              left: '0px',
              top: '55%',
              transform: 'translateY(-50%)',
              padding: '14px 22px',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-primary)',
              zIndex: 3,
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
            }}
          >
            <span
              className="pulse-dot"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--status-success)', // Point clignotant vert sémantique
                boxShadow: '0 0 10px var(--status-success)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-subtitle)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
              }}
            >
              Stage R&D // Limoges/Bordeaux
            </span>
          </div>

          {/* Courte introduction textuelle */}
          <div
            className="desktop-only"
            style={{
              position: 'absolute',
              right: '0px',
              top: '55%',
              transform: 'translateY(-50%)',
              maxWidth: '240px',
              textAlign: 'left',
              zIndex: 3,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              passionné par la conception d'architectures logicielles robustes et la recherche d'optimisation système basse latence.
            </p>
          </div>
        </div>

        {/* Contenu de secours pour mobiles */}
        <div
          className="mobile-only-hero-footer"
          style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
            marginBottom: '40px',
            width: '100%',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '10px 20px',
              borderRadius: '50px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-primary)',
            }}
          >
            <span
              className="pulse-dot"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--status-success)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-subtitle)', fontSize: '0.75rem', fontWeight: 700 }}>
              Stage R&D // Limoges/Bordeaux
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              maxWidth: '320px',
              lineHeight: 1.5,
            }}
          >
            passionné par la conception d'architectures logicielles robustes et la recherche d'optimisation système basse latence.
          </p>
        </div>

        {/* Bouton d'action principal */}
        <div
          className={`hero-contact-container hero-footer-row ${scrolled ? 'scrolled' : ''}`}
        >
          {/* Bouton de contact style pilule */}
          <a
            href="mailto:milan.loi@outlook.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 36px',
              borderRadius: '50px',
              backgroundColor: 'var(--bg-inverse)', // Fond sombre sémantique
              color: 'var(--text-inverse)',
              textDecoration: 'none',
              fontFamily: 'var(--font-subtitle)',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 10px 25px rgba(17, 24, 39, 0.12)',
              transition: 'var(--transition-smooth)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.backgroundColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 15px 30px var(--accent-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.backgroundColor = 'var(--bg-inverse)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(17, 24, 39, 0.12)';
            }}
          >
            <span>Parlons-en</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Section des statistiques (MetricGrid) */}
        <div className="reveal-on-scroll delay-300" style={{ width: '100%', marginTop: '50px' }}>
          <MetricGrid />
        </div>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heroPortraitEntry {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.96);
            filter: grayscale(100%) contrast(1.05) blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: grayscale(100%) contrast(1.05) blur(0);
          }
        }

        @keyframes letterReveal {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
            filter: blur(10px);
          }
          100% {
            opacity: 0.95;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes subTitleEntry {
          0% {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .hero-portrait-container img {
          animation: heroPortraitEntry 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 350ms;
        }

        .hero-bg-letter {
          display: inline-block;
          animation: letterReveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* Décalage d'affichage des lettres */
        .hero-bg-letter-1 { animation-delay: 200ms; }
        .hero-bg-letter-2 { animation-delay: 280ms; }
        .hero-bg-letter-3 { animation-delay: 360ms; }
        .hero-bg-letter-4 { animation-delay: 440ms; }
        .hero-bg-letter-5 { animation-delay: 520ms; }

        .hero-center-wrapper h2 {
          animation: subTitleEntry 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 650ms;
        }

        .desktop-only {
          animation: subTitleEntry 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-portrait-container + .desktop-only {
          animation-delay: 750ms;
        }
        .hero-portrait-container ~ .desktop-only {
          animation-delay: 850ms;
        }

        .hero-portrait-container {
          width: 400px !important;
          height: 500px !important;
        }
        .hero-contact-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 10px;
          margin-bottom: 10px;
          opacity: 1;
          transform: translate(0, 0) scale(1);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: auto;
          z-index: 50;
        }
        .hero-contact-container.scrolled {
          opacity: 0;
          transform: translate(min(32vw, 420px), -360px) scale(0.45);
          pointer-events: none;
        }
        @media (max-width: 991px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only-hero-footer {
            display: flex !important;
          }
          .hero-center-wrapper {
            height: 360px !important;
            margin-top: 40px !important;
            margin-bottom: 20px !important;
          }
          .hero-portrait-container {
            width: 260px !important;
            height: 325px !important;
          }
          .hero-footer-row {
            justify-content: center !important;
            text-align: center !important;
          }
          .hero-contact-container.scrolled {
            transform: translateY(-80px) scale(0.8) !important;
          }
        }

      `}} />
    </section>
  );
};

export default Hero;
