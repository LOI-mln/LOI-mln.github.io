import React, { useEffect } from 'react';
// Build stamp for debugging deployed bundle cache
console.log('App build: ' + new Date().toISOString());
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import OrganicCanvas from './components/OrganicCanvas';
import Hero from './sections/Hero';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Timeline from './sections/Timeline';
import About from './sections/About';
import CurtainReveal from './components/CurtainReveal';
import { ArrowUpRight } from 'lucide-react';
import Lenis from 'lenis';
import useScrollReveal from './hooks/useScrollReveal';

function App() {

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


  return (
    <>
      {/* Curseur sur mesure : hors de .app-container (z-index: 1) pour passer au-dessus des fenêtres de démo */}
      <CustomCursor />

      {/* Contenu principal de l'application */}
      <div className="app-container">
        {/* Canvas de fond organique */}
        <OrganicCanvas mode="light" />

        {/* Grille de points en surimpression */}
        <div className="dot-grid-bg" />

        {/* Barre de navigation (toggle supprimé) */}
        <Navbar />

        {/* Sections principales */}
        <main>
          {/* Section d'accueil */}
          <Hero />

          {/* Showcase des projets */}
          <Projects />

          {/* Matrice de compétences */}
          <Skills />

          {/* Section Hors-Piste / Passions */}
          <About />

          {/* Ligne de vie du parcours */}
          <Timeline />
        </main>

        {/* Pied de page : aplat bleu nuit, le nom revient en grand */}
        <footer className="site-footer field">
          <p className="site-footer-name">Milan Loï</p>
          <div className="site-footer-row">
            <span>Concepteur logiciel · BUT Informatique · Limoges</span>
            <a href="https://github.com/LOI-mln/LOI-mln.github.io" target="_blank" rel="noopener noreferrer">
              Code source sur GitHub <ArrowUpRight size={14} />
            </a>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            .site-footer {
              position: relative;
              z-index: 2;
              padding: 72px 24px 32px;
              background: var(--bg-inverse);
              color: #ffffff;
              overflow: clip;
              container-type: inline-size;
            }
            /* Le nom occupe toute la largeur : sa taille suit celle du pied de page (« Milan Loï » fait ~8,6 em en Syne) */
            .site-footer-name {
              margin: 0 0 40px;
              text-align: center;
              font-family: var(--font-display);
              font-size: calc((100cqi - 48px) / 8.8);
              font-weight: 800;
              line-height: 0.9;
              letter-spacing: -0.05em;
              text-transform: uppercase;
              white-space: nowrap;
            }
            .site-footer-row {
              max-width: 1200px;
              margin: 0 auto;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 12px 24px;
              font-family: var(--font-subtitle);
              font-size: 0.9rem;
              font-weight: 600;
              color: rgba(255, 255, 255, 0.7);
            }
            .site-footer-row a { display: inline-flex; align-items: center; gap: 6px; color: #ffffff; }
            @media (hover: hover) and (pointer: fine) {
              .site-footer-row a:hover { color: #93c5fd; }
            }
          `}} />
        </footer>
      </div>
    </>
  );
}

export default App;
