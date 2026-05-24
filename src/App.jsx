import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AntigravityCanvas from './components/AntigravityCanvas';
import CustomCursor from './components/CustomCursor';
import OrganicCanvas from './components/OrganicCanvas';
import Hero from './sections/Hero';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Timeline from './sections/Timeline';
import CurtainReveal from './components/CurtainReveal';
import { Heart, Trophy, Zap, ShieldCheck, Flame, Compass, ShoppingBag, Sparkles } from 'lucide-react';
import Lenis from 'lenis';
import useScrollReveal from './hooks/useScrollReveal';

function App() {
  const [loading, setLoading] = useState(true);
  const [loadingFade, setLoadingFade] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaderText, setLoaderText] = useState('SYS.INITIALIZATION');

  // Activer l'animation au défilement
  useScrollReveal();


  // Initialiser le défilement fluide Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Recalibrer Lenis lors du redimensionnement ou des mutations
    const handleResize = () => lenis.resize();
    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(() => {
      lenis.resize();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      lenis.destroy();
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);


  // Simulation de l'écran de chargement
  useEffect(() => {
    const statuses = [
      'SYS.INITIALIZATION',
      'RESOLVING.CORE.DEPENDENCIES',
      'MOUNTING.ORGANIC.GRID',
      'OPTIMIZING.INTERFACES',
      'SYS.READY'
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 3) + 1;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setLoaderText(statuses[4]);
        clearInterval(interval);
        
        setTimeout(() => {
          setLoadingFade(true);
          setTimeout(() => {
            setLoading(false);
          }, 800);
        }, 600);
      } else {
        setProgress(currentProgress);
        
        if (currentProgress < 25) setLoaderText(statuses[0]);
        else if (currentProgress < 50) setLoaderText(statuses[1]);
        else if (currentProgress < 75) setLoaderText(statuses[2]);
        else setLoaderText(statuses[3]);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Écran de chargement */}
      {loading && (
        <div className={`loader-overlay ${loadingFade ? 'fade-out' : ''}`}>
          <div className="loader-grid-bg" />
          <div className="loader-scanlines" />
          
          {/* Système de particules interactif en constellation */}
          <AntigravityCanvas
            mode="dark"
            colorScheme="neon"
            density="high"
            clusterRight={true}
            velocityStretch={true}
          />
          
          {/* Barre supérieure HUD */}
          <div className="loader-hud-top">
            <span>SYSTEM: MILAN_LOI_PORTFOLIO</span>
            <span>STATUS: {loaderText}</span>
            <span>TEMP CPU: 42°C</span>
          </div>

          {/* Zone centrale en plein écran */}
          <div className="loader-center-content">
            <div className="loader-circle-wrapper-huge">
              <svg className="loader-circle-svg" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" className="loader-circle-bg" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  className="loader-circle-fill"
                  strokeDasharray="100 100"
                  strokeDashoffset={100 - progress}
                />
              </svg>
              <span className="loader-circle-percentage-huge">{progress}%</span>
            </div>
            <h1 className="loader-fullscreen-title">
              MILAN<span style={{ color: 'var(--accent)', fontWeight: 300 }}>.LOÏ</span>
            </h1>
            <p className="loader-fullscreen-subtitle">CONCEPTEUR LOGICIEL & DÉVELOPPEUR IA</p>
          </div>
        </div>
      )}

      {/* Contenu principal de l'application */}
      <div className="app-container">
        {/* Canvas de fond organique */}
        <OrganicCanvas />

        {/* Grille de points en surimpression */}
        <div className="dot-grid-bg" />

        {/* Curseur coordonné sur mesure */}
        <CustomCursor />

        {/* Barre de navigation */}
        <Navbar />

        {/* Sections principales */}
        <main>
          {/* Section d'accueil et statistiques */}
          <Hero />

          {/* Matrice de compétences */}
          <Skills />

          {/* Showcase des projets */}
          <Projects />

          {/* Section Hors-Piste / Passions */}
          <section
            id="about"
            style={{
              position: 'relative',
              backgroundColor: 'var(--bg-primary)',
            }}
          >
            {/* Constellation interactive subtile ambrée */}
            <AntigravityCanvas
              mode="light"
              colorScheme="amber"
              density="low"
              clusterRight={false}
              velocityStretch={false}
            />
            <div className="section-container" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '60px', 
                  flexWrap: 'wrap', 
                  alignItems: 'flex-start' 
                }}
              >
                {/* Colonne gauche : En-tête éditorial */}
                <div 
                  style={{ 
                    flex: '1', 
                    minWidth: '280px', 
                    position: 'sticky', 
                    top: '120px',
                    paddingBottom: '30px'
                  }}
                >
                  <div className="organic-badge" style={{ marginBottom: '16px', width: 'fit-content' }}>
                    HORS-PISTE
                  </div>
                  <h2
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                      lineHeight: '1.2',
                      margin: '0 0 20px 0',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 800,
                    }}
                  >
                    Au-delà <span className="accent-glow-text" style={{ padding: '0 0.05em' }}>du code</span>
                  </h2>
                  <p
                    style={{
                      maxWidth: '400px',
                      color: 'var(--text-secondary)',
                      fontSize: '1.05rem',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.6,
                      margin: 0
                    }}
                  >
                    Mes passions, activités secondaires et engagements au quotidien, présentés en toute simplicité.
                  </p>
                </div>

                {/* Colonne droite : Cartes passions */}
                <div 
                  style={{ 
                    flex: '1.5', 
                    minWidth: '320px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '24px' 
                  }}
                >
                  {/* Carte Sport et Nature */}
                  <div
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '20px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 159, 28, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 159, 28, 0.08)',
                        color: 'var(--accent-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trophy size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                        Sports & Outdoor
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        Pratique régulière de la boxe anglaise en club pour le cardio, le focus et le dépassement de soi. Adepte de randonnées d'endurance en autonomie dans les Pyrénées, les Alpes ou les Highlands, tennis et ski.
                      </p>
                    </div>
                  </div>

                  {/* Carte Optimisation de latence */}
                  <div
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '20px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 159, 28, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 159, 28, 0.08)',
                        color: 'var(--accent-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Zap size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                        Optimisation Latence
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        Recherche empirique sur la réduction de l'input lag matériel et logiciel. Tuning de contrôleurs haute fréquence (claviers magnétiques à effet Hall), OS de jeu légers et micro-firmwares.
                      </p>
                    </div>
                  </div>

                  {/* Carte Recherche en IA */}
                  <div
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '20px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 159, 28, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 159, 28, 0.08)',
                        color: 'var(--accent-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                        Recherche & R&D IA
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        Veille constante sur les derniers modèles de langage, l'ingénierie de prompt, et l'intégration d'outils IA dans des écosystèmes locaux (Homelab, Docker, etc.). Capacité à collaborer de manière fluide avec des agents IA pour accélérer le cycle de développement logiciel.
                      </p>
                    </div>
                  </div>

                  {/* Carte Commerce de collection */}
                  <div
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '20px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 159, 28, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 159, 28, 0.08)',
                        color: 'var(--accent-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ShoppingBag size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                        Achat-Revente & Trade
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        Achat, estimation et revente de collections (Pokémon), vêtements/chaussures de marque (sneakers) et matériel informatique (hardware) sur les plateformes en ligne (Cardmarket, Vinted). Gestion des stocks, logistique d'envoi et service client.
                      </p>
                    </div>
                  </div>

                  {/* Carte Expérience McDo */}
                  <div
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '20px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 159, 28, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 159, 28, 0.08)',
                        color: 'var(--accent-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ShieldCheck size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                        Expérience Terrain
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        Équipier polyvalent chez McDonald's en parallèle de mes études. Une immersion terrain exigeante qui enseigne l'efficacité sous pression, le rythme soutenu et le travail d'équipe rapide.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ligne de vie du parcours */}
          <Timeline />
        </main>

        {/* Pied de page éditorial */}
        <footer
          style={{
            position: 'relative',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            padding: '48px 24px',
            zIndex: 2,
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              width: '100%',
            }}
          >
            {/* Initiales et identité */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                MILAN LOÏ
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                }}
              >
                Concepteur Logiciel & Développeur IA // IUT Limousin
              </span>
            </div>

            {/* Indicateur de technologies utilisées */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-subtitle)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              <span>Conçu avec</span>
              <Heart size={12} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
              <span>en React & Vite</span>
            </div>

            {/* Statistiques système du projet */}
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
              }}
            >
              LOC: 18,742 // ABERDEEN ERASMUS+ // v3.1.0
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
