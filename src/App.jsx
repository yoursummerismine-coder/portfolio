import { useEffect, useRef, useState } from "react";
import { AI_WORKS, FILMOGRAPHY, FILMS } from "./data";
import "./styles.css";

const NAV_ITEMS = [
  { label: "Films", id: "films" },
  { label: "AI Work", id: "ai-work" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

const Arrow = ({ direction = "right" }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
    {direction === "left" ? (
      <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
    ) : (
      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
    )}
  </svg>
);

const CloseIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function Header({ activeSection = "", crew = false, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (id) => {
    setMenuOpen(false);
    onNavigate?.(id);
  };

  return (
    <header className="site-header">
      <a className="brand" href={crew ? "#" : "#hero"} aria-label="Kyujin portfolio home">
        Kyujin
      </a>

      {!crew && (
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      )}

      {crew ? (
        <a className="back-link" href="#">
          <Arrow direction="left" />
          Back to portfolio
        </a>
      ) : (
        <nav
          id="primary-navigation"
          className={`primary-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-link"
              aria-current={activeSection === item.id ? "location" : undefined}
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
          <a className="nav-link" href="#/crew">
            Crew
          </a>
        </nav>
      )}
    </header>
  );
}

function FocusRail() {
  const marks = ["0.7", "1", "1.5", "2", "5", "7", "10", "15", "30", "∞"];

  return (
    <div className="focus-rail" aria-hidden="true">
      <span className="focus-unit">ft</span>
      <div className="focus-track">
        {marks.map((mark) => (
          <span className={mark === "5" ? "focus-mark is-active" : "focus-mark"} key={mark}>
            <i />
            <b>{mark}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-heading">
        <h1 id="hero-title">Kyujin Choi</h1>
        <p className="hero-index">01 / Seoul</p>
      </div>

      <figure className="hero-frame">
        <img
          src="/hero.jpg"
          alt="A cinematic close-up of an older woman in deep green-toned light"
          width="1208"
          height="678"
          fetchpriority="high"
        />
      </figure>

      <FocusRail />

      <div className="hero-copy">
        <p>Shaping light and shadow to find the emotional truth within each frame.</p>
        <p className="hero-role">Cinematographer · Seoul</p>
      </div>
    </section>
  );
}

function SectionHeading({ number, title, description }) {
  return (
    <header className="section-heading">
      <p className="section-number">{number}</p>
      <div>
        <h2>{title}</h2>
        {description && <p className="section-intro">{description}</p>}
      </div>
    </header>
  );
}

function MediaLightbox({ items, index, kind, onClose, onChange }) {
  const closeRef = useRef(null);
  const current = items[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onChange(index <= 0 ? items.length - 1 : index - 1);
      if (event.key === "ArrowRight") onChange(index >= items.length - 1 ? 0 : index + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, items.length, onChange, onClose]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={kind === "image" ? "Film still viewer" : "AI work viewer"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label="Close viewer">
        <CloseIcon />
      </button>
      <button
        type="button"
        className="lightbox-arrow is-left"
        onClick={() => onChange(index <= 0 ? items.length - 1 : index - 1)}
        aria-label="Previous item"
      >
        <Arrow direction="left" />
      </button>

      <div className="lightbox-stage">
        {kind === "image" ? (
          <img src={current} alt="" />
        ) : (
          <video key={current.src} src={current.src} poster={current.poster} controls autoPlay playsInline />
        )}
      </div>

      <button
        type="button"
        className="lightbox-arrow is-right"
        onClick={() => onChange(index >= items.length - 1 ? 0 : index + 1)}
        aria-label="Next item"
      >
        <Arrow />
      </button>
      <p className="lightbox-count">
        {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </p>
    </div>
  );
}

function FilmProject({ film, index }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <article className="film-project">
      <header className="film-header">
        <p className="film-sequence">{String(index + 1).padStart(2, "0")}</p>
        <div className="film-title-group">
          <p className="meta-label">{film.category}</p>
          <h3>{film.title}</h3>
          <p className="film-title-kr">{film.titleKr}</p>
        </div>
        <div className="film-role">
          <p>{film.role}</p>
          <span>{film.year}</span>
        </div>
      </header>

      <div className="stills-layout">
        <button
          type="button"
          className="still-main"
          style={film.stillAspect ? { aspectRatio: film.stillAspect } : undefined}
          onClick={() => setLightboxIndex(0)}
          aria-label={`Open first still from ${film.title}`}
        >
          <img
            src={film.stills[0]}
            alt=""
            loading="lazy"
            width={film.stillWidth || "1920"}
            height={film.stillHeight || "1080"}
          />
          <span className="still-open">View stills</span>
        </button>

        <div className="film-details">
          <dl>
            <div>
              <dt>Director</dt>
              <dd>{film.director}</dd>
            </div>
            {film.format && (
              <div>
                <dt>Capture</dt>
                <dd>{film.format}</dd>
              </div>
            )}
            {film.duration && (
              <div>
                <dt>{film.durationLabel || "Status"}</dt>
                <dd>{film.duration}</dd>
              </div>
            )}
          </dl>
          <p className="film-description">{film.description}</p>
          {film.watchUrl ? (
            <a className="text-link" href={film.watchUrl} target="_blank" rel="noreferrer">
              {film.watchLabel}
              <Arrow />
            </a>
          ) : (
            <p className="coming-soon">Film link coming soon</p>
          )}
        </div>
      </div>

      <div className="still-strip">
        {film.stills.slice(1).map((still, stillIndex) => (
          <button
            type="button"
            key={still}
            style={film.stillAspect ? { aspectRatio: film.stillAspect } : undefined}
            onClick={() => setLightboxIndex(stillIndex + 1)}
            aria-label={`Open still ${stillIndex + 2} from ${film.title}`}
          >
            <img
              src={still}
              alt=""
              loading="lazy"
              width={film.stillWidth || "1920"}
              height={film.stillHeight || "1080"}
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <MediaLightbox
          items={film.stills}
          index={lightboxIndex}
          kind="image"
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </article>
  );
}

function FilmsSection() {
  return (
    <section className="section films-section" id="films" aria-labelledby="films-title">
      <SectionHeading number="02" title="Selected Films" />
      <div className="film-list">
        {FILMS.map((film, index) => (
          <FilmProject key={film.id} film={film} index={index} />
        ))}
      </div>
    </section>
  );
}

function AIWorkCard({ work, index, onOpen }) {
  return (
    <button
      type="button"
      className="ai-card"
      onClick={onOpen}
      aria-label={`Open AI moving image study ${index + 1}`}
    >
      <span className="ai-media" style={work.aspect ? { "--ai-aspect": work.aspect } : undefined}>
        <video src={work.src} poster={work.poster} muted playsInline preload="metadata" />
        <span className="play-mark" aria-hidden="true">Play</span>
      </span>
      <span className="ai-card-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{work.tools || "Generative moving image"}</span>
        <span>{work.year}</span>
      </span>
    </button>
  );
}

function AIWorkSection() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <section className="section ai-section" id="ai-work" aria-labelledby="ai-work-title">
      <SectionHeading
        number="03"
        title="AI Work"
        description="Visual experiments at the intersection of cinematography and generative tools — a continuing study in how machine-made imagery can carry emotional and compositional intent."
      />
      <div className="ai-grid">
        {AI_WORKS.map((work, index) => (
          <AIWorkCard key={work.id} work={work} index={index} onOpen={() => setLightboxIndex(index)} />
        ))}
      </div>
      <p className="section-note">AI Artist · More works in progress.</p>

      {lightboxIndex !== null && (
        <MediaLightbox
          items={AI_WORKS}
          index={lightboxIndex}
          kind="video"
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </section>
  );
}

function AboutSection() {
  const facts = [
    ["Education", "Dongguk University\nDepartment of Film"],
    ["Focus", "Cinematography · Lighting\nAI Visual Media"],
    ["Tools", "DaVinci Resolve\nPremiere Pro"],
    ["Based in", "Seoul, South Korea"],
  ];

  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <SectionHeading number="04" title="About" />
      <div className="about-grid">
        <p className="about-statement">Light does not simply illuminate. It reveals.</p>
        <div className="about-copy">
          <p>
            I studied film at Dongguk University, Seoul, specializing in cinematography and lighting within
            the Department of Film. My work is rooted in the belief that light is not decoration — it is
            language.
          </p>
          <p>
            Beyond traditional filmmaking, I explore the intersection of cinematography and AI-driven visual
            media, asking how emerging tools can expand visual storytelling while preserving the craft at its
            core.
          </p>
        </div>
      </div>
      <dl className="fact-grid">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <a className="crew-callout" href="#/crew">
        <span>View crew work</span>
        <Arrow />
      </a>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <SectionHeading number="05" title="Contact" />
      <div className="contact-grid">
        <p className="contact-statement">Let’s create something worth watching.</p>
        <div className="contact-links">
          <a href="mailto:yoursummerismine@gmail.com">yoursummerismine@gmail.com</a>
          <a href="https://instagram.com/headingtostar" target="_blank" rel="noreferrer">
            Instagram <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>© 2026 Kyujin. All rights reserved.</p>
      <p>Every frame is a decision.</p>
    </footer>
  );
}

function CrewPage() {
  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header crew />
      <main className="crew-page" id="main-content">
        <header className="crew-hero">
          <p className="section-number">Crew / Selected credits</p>
          <h1>Crew Work</h1>
          <p>Camera department, cinematography, lighting and direction · 2020—2026</p>
        </header>

        <section className="crew-list" aria-labelledby="filmography-title">
          <h2 id="filmography-title">Filmography</h2>
          <div className="crew-table" role="list">
            {FILMOGRAPHY.map((item, index) => (
              <article className="crew-row" role="listitem" key={item.id}>
                <p>{item.year}</p>
                <div>
                  <h3>
                    {item.watchUrl ? (
                      <a
                        className="crew-title-link"
                        href={item.watchUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.title} — Watch on YouTube`}
                      >
                        {item.title}
                      </a>
                    ) : item.title}
                    {item.titleEn && <span>{item.titleEn}</span>}
                  </h3>
                  <p>{item.format}{item.director !== "—" ? ` · Dir. ${item.director}` : ""}</p>
                </div>
                <p>{item.role}</p>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return hash;
}

export default function Portfolio() {
  const hash = useHashRoute();
  const reducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState("");
  // "#/career" is the previous URL for this page; keep it working for shared links.
  const isCrewRoute = hash === "#/crew" || hash === "#/career";

  useEffect(() => {
    if (isCrewRoute) return undefined;
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-32% 0px -56% 0px", threshold: [0, 0.1, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isCrewRoute]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  if (isCrewRoute) return <CrewPage />;

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header activeSection={activeSection} onNavigate={scrollTo} />
      <main id="main-content">
        <Hero />
        <FilmsSection />
        <AIWorkSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
