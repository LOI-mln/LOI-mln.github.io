import React, { useState, useEffect, useRef } from 'react';

const TextScramble = ({ text, duration = 1000, autostart = false, hover = false }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  const frameRef = useRef(null);

  const startScramble = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const len = text.length;
    const startTime = performance.now();
    
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      let result = '';
      for (let i = 0; i < len; i++) {
        if (text[i] === ' ') {
          result += ' ';
          continue;
        }
        const charThreshold = (i / len) * 0.7 + 0.15;
        if (progress >= charThreshold) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayText(result);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (autostart) {
      // Léger délai pour l'effet visuel
      const t = setTimeout(startScramble, Math.random() * 200 + 100);
      return () => clearTimeout(t);
    } else {
      setDisplayText(text);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, autostart]);

  if (hover) {
    return (
      <span onMouseEnter={startScramble} style={{ display: 'inline-block' }}>
        {displayText}
      </span>
    );
  }

  return <span style={{ display: 'inline-block' }}>{displayText}</span>;
};

export default TextScramble;
