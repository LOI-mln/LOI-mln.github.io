import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
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
        padding: '110px 24px 60px 24px',
        /* clip et non hidden : hidden ferait de l'accueil un conteneur de défilement, et les chiffres ne suivraient plus la page */
        overflow: 'clip',
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
            marginBottom: '16px',
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
              aria-label="Milan Loï"
              style={{
                fontFamily: "var(--font-title)", /* Alignement avec la charte Space Grotesk */
                fontSize: 'clamp(4.5rem, 16vw, 11rem)',
                fontWeight: 700,
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
                filter: 'grayscale(100%) contrast(1.02) brightness(1.03)',
                maskImage: 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.6) 70%, transparent 92%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.6) 70%, transparent 92%)',
              }}
            />
          </div>

          {/* Halo lumineux d'arrière-plan pour détacher le texte du costume */}
          <div
            style={{
              position: 'absolute',
              bottom: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(90vw, 700px)',
              height: '180px',
              background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 45%, transparent 75%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

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
                textShadow: '0 0 20px rgba(255, 255, 255, 0.95), 0 0 35px rgba(255, 255, 255, 0.85), 0 0 8px rgba(255, 255, 255, 0.9)',
              }}
            >
              Concepteur <span style={{ color: 'var(--accent)' }}>Logiciel</span>
            </h2>
          </div>

          {/* Deux légendes d'affiche de part et d'autre du prénom : la recherche d'alternance et les villes */}
          <p className="hero-note hero-note--left">
            <span className="hero-note-kicker">
              <span className="hero-note-dot" aria-hidden="true" />
              Recherche une alternance
            </span>
            <span className="hero-note-main">Développement · sept. 2027</span>
          </p>
          <p className="hero-note hero-note--right">
            <span className="hero-note-kicker">
              <MapPin size={12} aria-hidden="true" />
              Localisation
            </span>
            <span className="hero-note-main">Limoges · Bordeaux</span>
          </p>
        </div>

        {/* Écrans étroits : la recherche d'alternance tient en une pastille, sous le titre */}
        <p className="hero-status-chip">
          <span className="hero-note-dot" aria-hidden="true" />
          Recherche une alternance · sept. 2027
        </p>

        {/* Phrase d'accroche : qui je suis en une lecture */}
        <p className="hero-pitch">
          <span>Développeur logiciel en alternance chez <strong className="hero-keep">Ceva Santé Animale</strong> et{'\u00A0'}en{'\u00A0'}3<sup>e</sup> année de <strong className="hero-keep">BUT Informatique</strong> à Limoges.</span>{' '}
          <span>Je poursuis en <strong>développement logiciel</strong> pour mon master.</span>
        </p>

        {/* Bouton d'action principal */}
        <div
          className={`hero-contact-container hero-footer-row ${scrolled ? 'scrolled' : ''}`}
        >
          {/* Bouton de contact style pilule (Emil Kowalski Tactile Button) */}
          <a
            href="mailto:milan.loi@outlook.com"
            className="hero-cta-btn"
          >
            <span>Parlons-en</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Trois repères : la démo d'un projet, la recherche, l'alternance */}
        <MetricGrid />
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

        /* Légendes d'affiche : alignées sur les bords de la page, à mi-hauteur du prénom */
        .hero-note {
          position: absolute;
          top: 32%;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 0;
          translate: 0 -50%;
          animation: subTitleEntry 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-note--left { left: 0; align-items: flex-start; animation-delay: 750ms; }
        .hero-note--right { right: 0; align-items: flex-end; text-align: right; animation-delay: 850ms; }
        .hero-note-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-subtitle);
          font-size: 0.75rem;
          line-height: 1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .hero-note--right .hero-note-kicker svg { color: var(--accent); }
        .hero-note-main {
          font-family: var(--font-subtitle);
          font-size: 1.125rem;
          line-height: 1.75rem;
          font-weight: 600;
          white-space: nowrap;
          color: var(--text-primary);
        }
        .hero-note-dot {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--status-success);
          animation: heroDotPulse 2s infinite;
        }
        @keyframes heroDotPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .hero-status-chip {
          display: none;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px;
          padding: 8px 16px;
          border-radius: 9999px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          font-family: var(--font-subtitle);
          font-size: 0.75rem;
          line-height: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          animation: subTitleEntry 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 750ms;
        }

        .hero-portrait-container {
          width: 400px !important;
          height: 500px !important;
        }
        /* Sur ordinateur, la scène suit la hauteur de la fenêtre : sur un portable, le bouton reste visible sans défiler */
        @media (min-width: 992px) {
          .hero-center-wrapper { height: min(520px, 57svh) !important; }
          .hero-center-wrapper h1 { font-size: min(11rem, 16vw, 19.5svh) !important; }
          .hero-center-wrapper h2 { font-size: min(5.8rem, 8vw, 10.2svh) !important; }
          .hero-portrait-container { width: auto !important; height: 96% !important; aspect-ratio: 4 / 5; }
        }
        /* Entre les deux, la pastille s'ajoute sous le titre : la scène lui laisse sa place */
        @media (min-width: 992px) and (max-width: 1199px) {
          .hero-center-wrapper { height: min(520px, 51svh) !important; }
        }

        .hero-pitch {
          max-width: 680px;
          margin: 0 auto 24px auto;
          text-align: center;
          font-family: var(--font-body);
          font-size: 1.125rem;
          line-height: 1.75rem;
          color: var(--text-primary);
          animation: subTitleEntry 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 300ms;
        }
        /* Une phrase par bloc : la coupure tombe entre les deux idées, jamais au milieu d'un nom */
        .hero-pitch > span { display: block; text-wrap: balance; }
        .hero-pitch strong {
          color: var(--accent-hover);
          font-weight: 700;
        }
        .hero-pitch .hero-keep { white-space: nowrap; }
        /* L'exposant ne doit pas écarter sa ligne des autres */
        .hero-pitch sup { line-height: 0; }
        .hero-contact-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          opacity: 1;
          transform: translate(0, 0) scale(1);
          transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
          pointer-events: auto;
          z-index: 50;
        }
        .hero-contact-container.scrolled {
          opacity: 0;
          transform: translate(min(32vw, 420px), -360px) scale(0.45);
          pointer-events: none;
        }

        .hero-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 36px;
          border-radius: 50px;
          background-color: var(--bg-inverse);
          color: var(--text-inverse);
          text-decoration: none;
          font-family: var(--font-subtitle);
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 10px 25px rgba(17, 24, 39, 0.12);
          transition: transform var(--duration-fast) var(--ease-out),
                      background-color var(--duration-normal) var(--ease-out),
                      box-shadow var(--duration-normal) var(--ease-out);
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }

        .hero-cta-btn svg {
          transition: transform var(--duration-fast) var(--ease-out);
        }

        @media (hover: hover) and (pointer: fine) {
          .hero-cta-btn:hover {
            transform: translateY(-2px);
            background-color: var(--accent);
            box-shadow: 0 15px 30px var(--accent-glow);
          }
          .hero-cta-btn:hover svg {
            transform: translateX(4px);
          }
        }

        .hero-cta-btn:active {
          transform: scale(0.97) translateY(0) !important;
          transition-duration: 80ms !important;
        }
        /* Sous 1200px, le prénom n'a plus la place pour ses légendes : la pastille prend le relais */
        @media (max-width: 1199px) {
          .hero-note { display: none; }
          .hero-status-chip { display: inline-flex; }
        }
        @media (max-width: 991px) {
          .hero-pitch { font-size: 1rem; line-height: 1.5rem; }
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
