import React, { useRef, useEffect } from 'react';
import useParallax from '../hooks/useParallax';

const TiltMockup = ({ children, speed = -0.05 }) => {
  const parallaxRef = useParallax(speed);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Gate interaction: only active on devices with fine pointers and hover capability
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let targetTransY = 0;
    let targetScale = 1;
    let currRotX = 0;
    let currRotY = 0;
    let currTransY = 0;
    let currScale = 1;

    let rafId = null;
    let isHovering = false;

    const render = () => {
      // Emil Kowalski spring lerp factor: 0.14 gives snappy tactile momentum without sluggish drag
      const factor = isHovering ? 0.14 : 0.08;
      currRotX += (targetRotX - currRotX) * factor;
      currRotY += (targetRotY - currRotY) * factor;
      currTransY += (targetTransY - currTransY) * factor;
      currScale += (targetScale - currScale) * factor;

      card.style.transform = `perspective(1000px) rotateX(${currRotX.toFixed(2)}deg) rotateY(${currRotY.toFixed(2)}deg) translateY(${currTransY.toFixed(2)}px) scale(${currScale.toFixed(3)})`;

      const isSettled =
        !isHovering &&
        Math.abs(currRotX) < 0.02 &&
        Math.abs(currRotY) < 0.02 &&
        Math.abs(currTransY) < 0.02 &&
        Math.abs(currScale - 1) < 0.002;

      if (!isSettled) {
        rafId = requestAnimationFrame(render);
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e) => {
      isHovering = true;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      targetRotX = ((y / rect.height) - 0.5) * -12;
      targetRotY = ((x / rect.width) - 0.5) * 12;
      targetTransY = -6;
      targetScale = 1.012;

      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.boxShadow = '0 30px 65px rgba(0, 0, 0, 0.2), 0 0 35px rgba(227, 93, 59, 0.08)';

      startLoop();
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetRotX = 0;
      targetRotY = 0;
      targetTransY = 0;
      targetScale = 1;
      card.style.boxShadow = '';
      startLoop();
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={parallaxRef}
      className="parallax-mockup-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        ref={cardRef}
        className="tilt-mockup-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '24px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
          transition: 'box-shadow 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default TiltMockup;
