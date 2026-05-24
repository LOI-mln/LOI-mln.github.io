import React, { useRef, useEffect } from 'react';
import useParallax from '../hooks/useParallax';

const TiltMockup = ({ children, speed = -0.05 }) => {
  const parallaxRef = useParallax(speed);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calcul des angles de rotation pour l'effet 3D
      const rotateX = ((y / rect.height) - 0.5) * -14;
      const rotateY = ((x / rect.width) - 0.5) * 14;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.boxShadow = '0 35px 80px rgba(0, 0, 0, 0.22), 0 0 40px rgba(255, 159, 28, 0.04)';
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      card.style.boxShadow = '';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
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
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
};


export default TiltMockup;
