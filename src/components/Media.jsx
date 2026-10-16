import { useCallback, useEffect, useRef, useState } from "react";
import { getYouTubeId } from "../content";
import { useModalFocus } from "../hooks/useModalFocus";
import { Arrow, CloseIcon, PlayIcon } from "./Icons";

export function YouTubePlayer({ project }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(project.watchUrl);
  return (
    <>
      <div className={`project-player ${playing ? "is-playing" : ""}`} style={{ aspectRatio: playing ? "16 / 9" : project.aspect }}>
        {playing ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`} title={`${project.title} — YouTube player`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        ) : (
          <button type="button" className="video-poster" onClick={() => setPlaying(true)} aria-label={`Play ${project.title}`}>
            <img src={project.thumbnail} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} fetchpriority="high" />
            <span className="video-play"><span className="video-play-circle"><PlayIcon /></span><span>Play film</span></span>
          </button>
        )}
      </div>
      <a className="text-link watch-link" href={project.watchUrl} target="_blank" rel="noreferrer">Watch on YouTube <Arrow /></a>
    </>
  );
}

export function StillGallery({ project }) {
  const [index, setIndex] = useState(null);
  const close = useCallback(() => setIndex(null), []);
  const dialogRef = useRef(null);
  const items = project.stills;
  useModalFocus(dialogRef, index !== null, close);

  useEffect(() => {
    if (index === null) return undefined;
    const handleArrows = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((current) => (current + (event.key === "ArrowLeft" ? -1 : 1) + items.length) % items.length);
      }
    };
    window.addEventListener("keydown", handleArrows);
    return () => window.removeEventListener("keydown", handleArrows);
  }, [index, items.length]);

  return (
    <section className="stills-section" aria-labelledby="stills-title">
      <div className="section-label"><h2 id="stills-title">Stills</h2><p>{items.length} images</p></div>
      <div className="still-grid">
        {items.map((src, stillIndex) => (
          <button key={src} type="button" onClick={() => setIndex(stillIndex)} aria-label={`Open still ${stillIndex + 1} from ${project.title}`}>
            <img src={src} alt="" width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      {index !== null && (
        <div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label="Film still viewer" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <button className="lightbox-close" type="button" onClick={close} aria-label="Close viewer"><CloseIcon /></button>
          <button className="lightbox-arrow is-left" type="button" onClick={() => setIndex((current) => (current - 1 + items.length) % items.length)} aria-label="Previous item"><Arrow direction="left" /></button>
          <img src={items[index]} alt={`Still ${index + 1} from ${project.title}`} />
          <button className="lightbox-arrow is-right" type="button" onClick={() => setIndex((current) => (current + 1) % items.length)} aria-label="Next item"><Arrow /></button>
          <p className="lightbox-count" aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</p>
        </div>
      )}
    </section>
  );
}
