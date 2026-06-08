import React, { useEffect, useState } from 'react';
// Build stamp for debugging deployed bundle cache
console.log('App build: ' + new Date().toISOString());
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
  const [loaderLog, setLoaderLog] = useState('SYS.INIT // Initializing...');

  // Theme: force en 'light' et supprimer toute logique de dark-mode
  const theme = 'light';


  // Activer l'animation au défilement
  useScrollReveal();

  // Désactiver la restauration automatique du défilement du navigateur et forcer le retour en haut
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Animation de progression du chargement
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += Math.floor(Math.random() * 8) + 4;
      if (start >= 100) {
        start = 100;
        clearInterval(interval);
      }
      setProgress(start);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Textes de logs du chargeur selon la progression
  useEffect(() => {
    if (progress < 20) {
      setLoaderLog('SYS.INIT // Connecting to server...');
    } else if (progress < 45) {
      setLoaderLog('LOAD.CORE // Importing system variables...');
    } else if (progress < 70) {
      setLoaderLog('DB.QUERY // Mapping academic index...');
    } else if (progress < 85) {
      setLoaderLog('NET.EST // Establishing Aberdeen R&D link...');
    } else if (progress < 100) {
      setLoaderLog('MESH.GEN // Rendering dynamic lighting...');
    } else {
      setLoaderLog('SYS.READY // Milan Loï online.');
    }
  }, [progress]);


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

    // Forcer le défilement de Lenis tout en haut au démarrage
    lenis.scrollTo(0, { immediate: true });

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


  // Masquer le scrollbar pendant le chargement
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  // Écran de chargement minimaliste
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingFade(true);
      setTimeout(() => setLoading(false), 800);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Écran de chargement plein écran technique */}
      {loading && (
        <div className={`loader-overlay ${loadingFade ? 'fade-out' : ''}`}>
          {/* Grille technique en arrière-plan */}
          <div className="loader-grid-bg" />
          <div className="loader-scanlines" />

          {/* Brackets de coin HUD */}
          <div className="loader-corner loader-corner-tl" />
          <div className="loader-corner loader-corner-tr" />
          <div className="loader-corner loader-corner-bl" />
          <div className="loader-corner loader-corner-br" />

          {/* Particules ambiantes flottantes */}
          <div className="loader-ambient-particle" style={{ top: '15%', left: '10%', animationDelay: '0s', animationDuration: '6s' }} />
          <div className="loader-ambient-particle" style={{ top: '75%', left: '80%', animationDelay: '1.2s', animationDuration: '7s' }} />
          <div className="loader-ambient-particle" style={{ top: '30%', left: '85%', animationDelay: '2.5s', animationDuration: '5.5s' }} />
          <div className="loader-ambient-particle" style={{ top: '85%', left: '20%', animationDelay: '0.8s', animationDuration: '8s' }} />

          {/* En-tête technique supérieur */}
          <div className="loader-top-bar">
            <span className="loader-title">SYS.INIT // MILAN LOI PORTFOLIO</span>
            <span className="loader-status">SYS.LOC // ABERDEEN, SCOTLAND</span>
          </div>

          {/* Animation pl — grille de points orbitaux */}
          <div className="loader-center-giant">
            <div className="loader-pl-wrapper">
              <div className="pl">
                <div className="pl__dot"></div>
                <div className="pl__dot"></div>
                <div className="pl__dot pl__dot--red pl__dot--sm"></div>
                <div className="pl__dot"></div>
                <div className="pl__dot pl__dot--yellow pl__dot--lg"></div>
                <div className="pl__dot"></div>
                <div className="pl__dot pl__dot--blue pl__dot--sm"></div>
                <div className="pl__dot"></div>
                <div className="pl__dot pl__dot--green pl__dot--sm"></div>
              </div>
              <div className="loader-pl-label">
                <span className="loader-pl-percent">{progress}<span className="loader-pl-sym">%</span></span>
                <span className="loader-pl-name">MILAN LOÏ</span>
              </div>
            </div>
          </div>

          {/* Pied de page technique inférieur */}
          <div className="loader-bottom-bar">
            <span className="loader-log-stream">{loaderLog}</span>
            <span className="loader-version">V3.1.0 // PROD</span>
          </div>

          {/* Ligne de progression pleine largeur tout en bas */}
          <div className="loader-progress-line-container">
            <div className="loader-progress-line" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Contenu principal de l'application */}
      <div className="app-container">
        {/* Canvas de fond organique */}
        <OrganicCanvas mode="light" />

        {/* Grille de points en surimpression */}
        <div className="dot-grid-bg" />

        {/* Curseur coordonné sur mesure */}
        <CustomCursor />

        {/* Barre de navigation (toggle supprimé) */}
        <Navbar />

        {/* Sections principales */}
        <main>
          {/* Section d'accueil */}
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
                    className="section-title"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                      color: 'var(--text-primary)',
                      textTransform: 'uppercase',
                      lineHeight: '1.2',
                      margin: '0 0 20px 0',
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
                      borderRadius: '24px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(227, 93, 59, 0.05)';
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
                        backgroundColor: 'rgba(227, 93, 59, 0.08)',
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
                        Pratique régulière de la boxe anglaise en club pour le cardio et la condition physique. Adepte de randonnées d'endurance en autonomie dans les Pyrénées, les Alpes ou les Highlands, tennis et ski.
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
                      borderRadius: '24px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(227, 93, 59, 0.05)';
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
                        backgroundColor: 'rgba(227, 93, 59, 0.08)',
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
                      borderRadius: '24px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(227, 93, 59, 0.05)';
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
                        backgroundColor: 'rgba(227, 93, 59, 0.08)',
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
                      borderRadius: '24px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(227, 93, 59, 0.05)';
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
                        backgroundColor: 'rgba(227, 93, 59, 0.08)',
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
                        Achat, estimation et revente d'objets de collection (cartes de jeux, rétro-gaming), d'articles de mode en édition limitée (sneakers) et de matériel informatique de pointe (hardware) sur les plateformes en ligne (eBay, Vinted, etc.). Gestion des stocks, logistique internationale d'envoi et relations clients.
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
                      borderRadius: '24px',
                      display: 'flex',
                      gap: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(227, 93, 59, 0.05)';
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
                        backgroundColor: 'rgba(227, 93, 59, 0.08)',
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
