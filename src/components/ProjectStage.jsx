import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Pause, Play, Maximize2 } from 'lucide-react';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Vrai quand l'élément est assez visible à l'écran
const useInView = (ref) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
};

// Passe un élément en plein écran ; sur iPhone, seule la vidéo sait le faire (webkitEnterFullscreen)
const enterFullscreen = (el) => {
  if (!el) return false;
  if (el.requestFullscreen) { el.requestFullscreen().catch(() => {}); return true; }
  if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); return true; }
  if (el.webkitEnterFullscreen) { el.webkitEnterFullscreen(); return true; }
  return false;
};

// Cadre de fenêtre : barre de titre, boutons pause et plein écran, pied optionnel
const StageWindow = ({ title, footer, paused, onTogglePause, onFullscreen, light, innerRef, label, children }) => (
  <figure ref={innerRef} className={`stage ${light ? 'stage--light' : ''}`}>
    <div className="stage-bar">
      <span className="stage-dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="stage-title">{title}</span>
      {onTogglePause && (
        <button
          type="button"
          className="stage-toggle"
          onClick={onTogglePause}
          aria-label={paused ? `Relancer : ${label}` : `Mettre en pause : ${label}`}
        >
          {paused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
        </button>
      )}
      {onFullscreen && (
        <button type="button" className="stage-toggle" onClick={onFullscreen} aria-label={`Voir en plein écran : ${title}`}>
          <Maximize2 size={13} />
        </button>
      )}
    </div>
    <div className="stage-body">{children}</div>
    {footer && <figcaption className="stage-footer">{footer}</figcaption>}
  </figure>
);

// Démo vidéo jouée directement dans la fiche, seulement quand elle est visible
const VideoStage = ({ title, footer, src, poster }) => {
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useInView(frameRef);
  const [paused, setPaused] = useState(prefersReducedMotion);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, paused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => { video.controls = document.fullscreenElement === video || document.webkitFullscreenElement === video; };
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
    };
  }, []);

  const openFullscreen = () => {
    const video = videoRef.current;
    setPaused(false);
    video?.play().catch(() => {});
    enterFullscreen(video);
  };

  return (
    <StageWindow
      light
      innerRef={frameRef}
      title={title}
      footer={footer}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onFullscreen={openFullscreen}
      label="la démo vidéo"
    >
      <video
        ref={videoRef}
        className="stage-video"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={title}
      />
    </StageWindow>
  );
};

// Capture fixe de l'application
const ImageStage = ({ title, footer, src, alt }) => {
  const imageRef = useRef(null);
  const openFullscreen = () => {
    if (!enterFullscreen(imageRef.current)) window.open(src, '_blank', 'noopener');
  };

  return (
    <StageWindow light title={title} footer={footer} onFullscreen={openFullscreen}>
      <img ref={imageRef} className="stage-video" src={src} alt={alt} loading="lazy" />
    </StageWindow>
  );
};

// Délai avant de passer à l'étape suivante du terminal
const terminalDelay = (line) => {
  if (!line) return 4200;
  if (line.cmd) return 420;
  if (line.comment) return 200;
  return 70;
};

// Terminal qui rejoue les commandes et sorties réelles d'un lab
const TerminalStage = ({ title, footer, lines, label }) => {
  const frameRef = useRef(null);
  const screenRef = useRef(null);
  const inView = useInView(frameRef);
  const [reduced] = useState(prefersReducedMotion);
  const [paused, setPaused] = useState(reduced);
  const [pos, setPos] = useState({ line: 0, char: 0 });

  const showAll = reduced && paused;

  useEffect(() => {
    if (!inView || paused) return;
    const line = lines[pos.line];
    const typing = line?.cmd && pos.char < line.cmd.length;
    let next;
    if (typing) next = { line: pos.line, char: pos.char + 1 };
    else if (line) next = { line: pos.line + 1, char: 0 };
    else next = { line: 0, char: 0 };

    const delay = typing ? 18 + Math.random() * 30 : terminalDelay(line);
    const timer = setTimeout(() => setPos(next), delay);
    return () => clearTimeout(timer);
  }, [inView, paused, pos, lines]);

  // Le texte reste collé en bas, comme dans un vrai terminal
  useLayoutEffect(() => {
    const screen = screenRef.current;
    if (screen && !showAll) screen.scrollTop = screen.scrollHeight;
  }, [pos.line, showAll]);

  const visible = showAll ? lines : lines.slice(0, pos.line + 1);

  return (
    <StageWindow
      innerRef={frameRef}
      title={title}
      footer={footer}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      label="le terminal"
    >
      <div
        ref={screenRef}
        className={`stage-term ${showAll ? 'stage-term--static' : ''}`}
        role="img"
        aria-label={label}
        {...(showAll ? { 'data-lenis-prevent': true } : {})}
      >
        {visible.map((line, i) => {
          const isCurrent = !showAll && i === pos.line;
          if (line.cmd) {
            return (
              <code key={i}>
                <span className="stage-prompt">{line.prompt}</span>{' '}
                <span className="stage-cmd">{isCurrent ? line.cmd.slice(0, pos.char) : line.cmd}</span>
                {isCurrent && <span className="stage-caret" />}
              </code>
            );
          }
          if (line.comment) return <code key={i} className="stage-comment">{line.comment}</code>;
          return <code key={i} className={line.tone ? `stage-out--${line.tone}` : undefined}>{line.out || ' '}</code>;
        })}
        {!showAll && pos.line >= lines.length && <span className="stage-caret" />}
      </div>
    </StageWindow>
  );
};

// Résultats du papier : une ligne par communauté, avec le détail de celle qui est sélectionnée
const ResearchStage = ({ title, footer, rows, max, label }) => {
  const frameRef = useRef(null);
  const inView = useInView(frameRef);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!inView || paused) return;
    const timer = setInterval(() => setSelected((s) => (s + 1) % rows.length), 3000);
    return () => clearInterval(timer);
  }, [inView, paused, rows.length]);

  return (
    <StageWindow
      innerRef={frameRef}
      title={title}
      footer={footer}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      label="le défilement des communautés"
    >
      <div className="stage-data">
        <p className="stage-data-head">
          <span>{label}</span>
          <span>Indice</span>
        </p>
        <ul className="stage-rows">
          {rows.map((row, i) => {
            const isOn = selected === i;
            return (
              <li key={row.name}>
                <button
                  type="button"
                  className={`stage-row ${isOn ? 'stage-row--on' : ''}`}
                  aria-expanded={isOn}
                  onClick={() => { setSelected(i); setPaused(true); }}
                >
                  <span className="stage-row-line">
                    <span className="stage-row-name">{row.name}</span>
                    <span className="stage-row-value">{row.index}</span>
                  </span>
                  <span className="stage-bar-track">
                    <span
                      className="stage-bar-fill"
                      style={{ transform: `scaleX(${inView ? parseFloat(row.index.replace(',', '.')) / max : 0})` }}
                    />
                  </span>
                  <span className="stage-row-detail">
                    <span>We {row.we}</span>
                    <span>Them {row.them}</span>
                    <span>Ratio {row.ratio}</span>
                    <span>Toxicité {row.toxicity}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </StageWindow>
  );
};

// Fenêtre affichée à côté du texte d'un projet
const ProjectStage = ({ kind, ...props }) => (
  <>
    {kind === 'video' && <VideoStage {...props} />}
    {kind === 'image' && <ImageStage {...props} />}
    {kind === 'terminal' && <TerminalStage {...props} />}
    {kind === 'research' && <ResearchStage {...props} />}

    <style dangerouslySetInnerHTML={{ __html: `
      .stage {
        flex: 1;
        width: 100%;
        min-width: 0;
        min-height: 480px;
        margin: 0;
        display: flex;
        flex-direction: column;
        border-radius: 14px;
        overflow: hidden;
        background: #0d1420;
        color: #e6edf7;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 2px 4px rgba(17, 24, 39, 0.12), 0 30px 60px -24px rgba(var(--tint), 0.55);
      }
      .stage--light {
        background: #ffffff;
        color: var(--text-primary);
        border-color: rgba(17, 24, 39, 0.1);
        /* La fenêtre prend la taille de la vidéo, centrée dans le panneau */
        flex: none;
        align-self: center;
        min-height: 0;
      }
      .stage--light .stage-body { flex: none; aspect-ratio: 16 / 10; }

      .stage-bar {
        flex-shrink: 0;
        display: flex; align-items: center; gap: 12px;
        padding: 8px 12px 8px 12px;
        background: rgba(255, 255, 255, 0.04);
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      }
      .stage--light .stage-bar {
        background: var(--bg-secondary);
        border-bottom-color: rgba(17, 24, 39, 0.08);
      }
      .stage-dots { display: flex; gap: 4px; flex-shrink: 0; }
      .stage-dots i { width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; }
      .stage-dots i:nth-child(2) { background: #febc2e; }
      .stage-dots i:nth-child(3) { background: #28c840; }
      .stage-title {
        flex: 1; min-width: 0;
        text-align: center;
        font-family: var(--font-body);
        font-size: 0.75rem; line-height: 16px; font-weight: 600;
        color: rgba(230, 237, 247, 0.72);
      }
      .stage--light .stage-title { color: var(--text-secondary); }
      .stage-toggle {
        flex-shrink: 0;
        width: 26px; height: 26px;
        display: flex; align-items: center; justify-content: center;
        border: none; border-radius: 6px;
        background: transparent;
        color: rgba(230, 237, 247, 0.72);
        cursor: pointer;
        transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
      }
      .stage--light .stage-toggle { color: var(--text-secondary); }
      .stage-video:fullscreen { object-fit: contain; background: #0b0f19; }
      .stage-toggle:focus-visible,
      .stage-row:focus-visible {
        outline: 2px solid #8ab4ff;
        outline-offset: -2px;
      }
      .stage--light .stage-toggle:focus-visible { outline-color: var(--accent); }

      .stage-body { flex: 1; min-height: 0; position: relative; display: flex; }
      .stage-footer {
        flex-shrink: 0;
        padding: 8px 16px;
        font-family: var(--font-body);
        font-size: 0.75rem; line-height: 16px; font-weight: 600;
        color: rgba(230, 237, 247, 0.62);
        border-top: 1px solid rgba(255, 255, 255, 0.07);
      }
      .stage--light .stage-footer {
        color: var(--text-secondary);
        border-top-color: rgba(17, 24, 39, 0.08);
      }

      /* Démo vidéo : affichée en entier */
      .stage-video {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        object-fit: contain;
        background: var(--bg-secondary);
      }

      /* Terminal */
      .stage-term {
        position: absolute; inset: 0;
        padding: 16px 16px;
        overflow: hidden;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        line-height: 16px;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      .stage-term code { display: block; font: inherit; }
      .stage-term--static { overflow-y: auto; }
      .stage-prompt { color: #8ab4ff; font-weight: 600; }
      .stage-cmd { color: #ffffff; font-weight: 600; }
      .stage-comment { color: #8b98ad; margin-top: 12px; }
      .stage-comment:first-child { margin-top: 0; }
      .stage-out--good { color: #5eead4; }
      .stage-out--bad { color: #fca5a5; }
      .stage-caret {
        display: inline-block;
        width: 0.55em; height: 1.05em;
        margin-left: 2px;
        vertical-align: text-bottom;
        background: #e6edf7;
        animation: stageCaret 1s steps(1) infinite;
      }
      @keyframes stageCaret { 50% { opacity: 0; } }

      /* Résultats de recherche */
      .stage-data {
        flex: 1; min-width: 0;
        display: flex; flex-direction: column;
        padding: 12px 8px 8px;
      }
      .stage-data-head {
        display: flex; justify-content: space-between; gap: 16px;
        margin: 0 8px 8px;
        font-family: var(--font-body);
        font-size: 0.75rem; line-height: 16px; font-weight: 600;
        color: rgba(230, 237, 247, 0.62);
      }
      .stage-rows {
        flex: 1;
        list-style: none; margin: 0; padding: 0;
        display: flex; flex-direction: column; justify-content: space-between; gap: 2px;
      }
      .stage-row {
        display: block; width: 100%;
        padding: 8px 8px;
        border: none; border-radius: 8px;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
        font-family: var(--font-body);
        transition: background-color 0.25s var(--ease-out);
      }
      .stage-row--on { background: rgba(255, 255, 255, 0.07); }
      .stage-row-line { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
      .stage-row-name { font-size: 0.75rem; line-height: 16px; font-weight: 600; color: rgba(230, 237, 247, 0.82); }
      .stage-row--on .stage-row-name { color: #ffffff; }
      .stage-row-value {
        font-family: var(--font-mono);
        font-size: 0.75rem; line-height: 16px;
        font-variant-numeric: tabular-nums;
        color: #8ab4ff;
      }
      .stage-bar-track {
        display: block;
        height: 4px; margin-top: 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .stage-bar-fill {
        display: block; height: 100%;
        border-radius: 4px;
        background: #60a5fa;
        transform-origin: left center;
        transition: transform 1.1s var(--ease-out);
      }
      .stage-row-detail {
        display: flex; flex-wrap: wrap; gap: 2px 12px;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        font-size: 0.75rem; line-height: 16px; font-weight: 500;
        font-variant-numeric: tabular-nums;
        color: rgba(230, 237, 247, 0.72);
        transition: max-height 0.3s var(--ease-out), opacity 0.25s var(--ease-out), margin 0.3s var(--ease-out);
      }
      .stage-row--on .stage-row-detail { max-height: 44px; margin-top: 8px; opacity: 1; }

      @media (hover: hover) and (pointer: fine) {
        .stage-toggle:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
        .stage--light .stage-toggle:hover { background: rgba(17, 24, 39, 0.06); color: var(--text-primary); }
        .stage-row:hover { background: rgba(255, 255, 255, 0.05); }
        .stage-row--on:hover { background: rgba(255, 255, 255, 0.07); }
      }

      @media (max-width: 991px) {
        .stage { min-height: 400px; }
        .stage--light { min-height: 0; }
        .stage-term { font-size: 0.75rem; line-height: 16px; padding: 12px 12px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .stage-caret { animation: none; }
        .stage-bar-fill, .stage-row-detail { transition: none; }
      }
    `}} />
  </>
);

export default ProjectStage;
