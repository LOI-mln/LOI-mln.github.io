import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  
  const visibleTitlesRef = useRef(new Set());

  // Détecter le défilement général pour le style de la barre
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 60;
      setScrolled(isScrolled);
      setShowContact(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // La barre ne se replie plus automatiquement sur les titres
  const isCollapsed = false;

  const handleContainerClick = () => {
    if (isCollapsed) {
      setHovered(true);
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: '20px',
        left: 0,
        width: '100%',
        zIndex: 1000,
        padding: '0 24px',
        pointerEvents: 'none',
      }}
    >
      <div
        className="glass-panel"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleContainerClick}
        style={{
          maxWidth: isCollapsed ? '48px' : (scrolled ? '900px' : '1200px'),
          height: isCollapsed ? '48px' : 'auto',
          margin: isCollapsed ? '0 0 0 8px' : '0 auto',
          padding: isCollapsed ? '0' : (scrolled ? '12px 28px' : '18px 36px'),
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          alignItems: 'center',
          pointerEvents: 'auto',
          borderRadius: isCollapsed ? '50%' : (scrolled ? '50px' : '24px'),
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isCollapsed ? '0 8px 24px rgba(255, 159, 28, 0.18)' : (scrolled ? '0 12px 30px rgba(0, 0, 0, 0.05)' : '0 4px 15px rgba(0, 0, 0, 0.01)'),
          background: isCollapsed ? 'rgba(255, 255, 255, 0.95)' : (scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.65)'),
          border: isCollapsed ? '1.5px solid var(--accent)' : '1px solid var(--border-color)',
          cursor: isCollapsed ? 'pointer' : 'default',
        }}
      >
        {/* 1. Icône de menu quand replié en cercle */}
        {isCollapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <Menu size={20} />
          </div>
        )}

        {/* 2. Logo (Masqué quand replié) */}
        <div
          style={{
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            opacity: isCollapsed ? 0 : 1,
            pointerEvents: isCollapsed ? 'none' : 'auto',
            transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <a
            href="#home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontFamily: 'var(--font-title)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            <span>MILAN</span>
            <span style={{ color: 'var(--accent)', fontWeight: 400 }}>LOÏ</span>
            <div
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#10b981', // Indicateur en ligne vert
                borderRadius: '50%',
                boxShadow: '0 0 10px #10b981',
              }}
            />
          </a>
        </div>

        {/* 3. Liens de navigation bureau (Masqués quand replié) */}
        <nav
          style={{
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            gap: '32px',
            opacity: isCollapsed ? 0 : 1,
            pointerEvents: isCollapsed ? 'none' : 'auto',
            transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="desktop-only"
        >
          {[
            { label: 'Accueil', href: '#home' },
            { label: 'Compétences', href: '#skills' },
            { label: 'Projets', href: '#projects' },
            { label: 'Parcours', href: '#timeline' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-subtitle)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                transition: 'var(--transition-fast)',
                position: 'relative',
                padding: '4px 0',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* 4. Liens sociaux et boutons (Masqués quand replié) */}
        <div
          style={{
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: isCollapsed ? 0 : 1,
            pointerEvents: isCollapsed ? 'none' : 'auto',
            transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="desktop-only"
        >
          <a
            href="https://github.com/LOI-mln"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profil GitHub de Milan"
            style={{
              color: 'var(--text-secondary)',
              transition: 'var(--transition-fast)',
              padding: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            <GithubIcon size={18} />
          </a>
          <a
            href="https://linkedin.com/in/milan-loi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profil LinkedIn de Milan"
            style={{
              color: 'var(--text-secondary)',
              transition: 'var(--transition-fast)',
              padding: '12px',
              marginRight: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            <LinkedinIcon size={18} />
          </a>

          {/* Bouton de contact dynamique au défilement */}
          <div
            style={{
              width: showContact ? '145px' : '0px',
              opacity: showContact ? 1 : 0,
              transform: showContact ? 'translate(0px, 0px) scale(1)' : 'translate(-60px, 40px) scale(0.7)',
              overflow: 'hidden',
              pointerEvents: showContact ? 'auto' : 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <a
              href="mailto:milan.loi@outlook.com"
              className="btn-editorial"
              style={{
                padding: '10px 20px',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
              }}
            >
              <span>Parlons-en</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Bouton menu mobile (Masqué quand replié) */}
        <button
          onClick={toggleMobileMenu}
          aria-label="Menu de navigation"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '10px',
            minWidth: '44px',
            minHeight: '44px',
            display: isCollapsed ? 'none' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile dépliant */}
      {mobileMenuOpen && !isCollapsed && (
        <div
          id="mobile-menu"
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '80px',
            left: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            borderRadius: '24px',
            pointerEvents: 'auto',
          }}
        >
          {[
            { label: 'Accueil', href: '#home' },
            { label: 'Compétences', href: '#skills' },
            { label: 'Projets', href: '#projects' },
            { label: 'Parcours', href: '#timeline' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-subtitle)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                padding: '12px 0', /* Touch Target améliorée */
                borderBottom: '1px solid rgba(0,0,0,0.03)',
              }}
            >
              {link.label}
            </a>
          ))}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <a
                href="https://github.com/LOI-mln"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Profil GitHub"
                style={{
                  color: 'var(--text-secondary)',
                  padding: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GithubIcon size={20} />
              </a>
              <a
                href="https://linkedin.com/in/milan-loi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Profil LinkedIn"
                style={{
                  color: 'var(--text-secondary)',
                  padding: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LinkedinIcon size={20} />
              </a>
            </div>

            <a
              href="mailto:milan.loi@outlook.com"
              className="btn-editorial"
              style={{
                padding: '8px 18px',
                fontSize: '0.85rem',
              }}
            >
              <span>Contact</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* Règles CSS pour le comportement adaptatif et animations de fondu */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}} />
    </header>
  );
};

export default Navbar;
