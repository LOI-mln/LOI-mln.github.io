import { useEffect } from 'react';

// Hook d'animation au défilement pour révéler les éléments
export const useScrollReveal = () => {
  useEffect(() => {
    // Vérifier le support dans l'environnement navigateur
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observerOptions = {
      root: null, // Fenêtre d'affichage
      rootMargin: '0px 0px -10% 0px', // Déclenchement à 10% d'entrée dans l'écran
      threshold: 0.05, // Seuil de visibilité de 5%
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Arrêter d'observer une fois l'élément affiché
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const updateObservation = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
      elements.forEach((el) => {
        if (!el.classList.contains('in-view')) {
          observer.observe(el);
        }
      });
    };

    // Scan initial après le chargement
    const timeoutId = setTimeout(updateObservation, 400);

    // Observer les changements dynamiques du DOM
    const mutationObserver = new MutationObserver(updateObservation);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

export default useScrollReveal;
