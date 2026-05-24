import { useEffect, useRef } from 'react';

// Hook de parallaxe fluide optimisé pour le défilement
export const useParallax = (speed = -0.06) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === 'undefined') return;

    // Désactiver la parallaxe sur les écrans tactiles
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (isTouch || !hasFinePointer) {
      return;
    }

    let isVisible = false;
    let animationFrameId = null;

    // Préparer l'accélération matérielle GPU
    el.style.willChange = 'transform';
    el.style.transition = 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)'; // Transition fluide

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          updateParallax();
        } else if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { root: null, threshold: 0 }
    );

    observer.observe(el);

    const updateParallax = () => {
      if (!isVisible || !elementRef.current) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Récupérer la translation Y actuelle de l'élément
      const transform = el.style.transform;
      let currentTranslationY = 0;
      if (transform) {
        // Détecter la translation 3D
        const match3d = transform.match(/translate3d\(\s*[^,]+\s*,\s*(-?[\d.]+)(?:px)?\s*,\s*[^)]+\)/);
        if (match3d) {
          currentTranslationY = parseFloat(match3d[1]) || 0;
        } else {
          // Détecter la translation Y classique
          const matchY = transform.match(/translateY\(\s*(-?[\d.]+)(?:px)?\s*\)/);
          if (matchY) {
            currentTranslationY = parseFloat(matchY[1]) || 0;
          }
        }
      }

      // Calculer la position statique réelle de l'élément
      const staticElementTop = rect.top + scrollY - currentTranslationY;
      const elementHeight = rect.height;

      // Calculer l'écart par rapport au centre de l'écran
      const elementCenter = staticElementTop + elementHeight / 2;
      const scrollCenter = scrollY + viewportHeight / 2;

      const diff = scrollCenter - elementCenter;
      const offset = diff * speed;

      // Appliquer la transformation 3D fluidifiée
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;

      animationFrameId = null;
    };

    const handleScroll = () => {
      if (isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Positionnement initial
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed]);

  return elementRef;
};

export default useParallax;

