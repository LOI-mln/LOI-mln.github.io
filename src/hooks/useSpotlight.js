import { useEffect, useRef } from 'react';

const useSpotlight = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Emil Kowalski rule: Gate pointer effects to devices with fine pointers and hover
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    let rafId = null;
    let latestEvent = null;

    const updateSpotlights = () => {
      if (!latestEvent) return;
      const cards = container.querySelectorAll('.spotlight-card');
      const { clientX, clientY } = latestEvent;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${clientX - rect.left}px`);
        card.style.setProperty('--my', `${clientY - rect.top}px`);
      });

      rafId = null;
    };

    const handleMouseMove = (e) => {
      latestEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(updateSpotlights);
      }
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return containerRef;
};

export default useSpotlight;
