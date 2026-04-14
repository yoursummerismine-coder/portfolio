import { useState, useEffect, useRef } from "react";

const HERO_IMAGE = "/hero.jpg";
const STILLS_LB = [
  "/stills/lb-01.jpg", "/stills/lb-02.jpg", "/stills/lb-03.jpg",
  "/stills/lb-04.jpg", "/stills/lb-05.jpg", "/stills/lb-06.jpg",
];

const STILLS_TC = [
  "/stills/tc-01.jpg", "/stills/tc-02.jpg", "/stills/tc-03.jpg",
];

const STILLS_TB = [
  "/stills/tb-01.jpg", "/stills/tb-02.jpg", "/stills/tb-03.jpg",
];

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Libre+Franklin:wght@300;400;500&display=swap');
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: #161616;
  --text-primary: #e8e4df;
  --text-secondary: #8a857e;
  --text-muted: #5a5650;
  --accent: #c4a97d;
  --accent-dim: #8a7a5e;
  --border: #222220;
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Libre Franklin', sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--bg-primary); }
body { font-family: var(--font-body); background: var(--bg-primary); color: var(--text-primary); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
::selection { background: var(--accent); color: var(--bg-primary); }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 3px; }
`;

const NAV_ITEMS = ["Works", "About", "Contact"];

const FILMS = [
  {
    id: 1,
    title: "Ear Candle",
    titleKr: "이봉",
    category: "Short Film",
    year: "2026",
    role: "Director of Photography · DI Colorist",
    director: "Park Jinyoung",
    format: "Digital — Sony Burano",
    duration: "In Post-Production",
    description:
      "A portrait of disconnection — between a person and the world surrounding them. Deep shadows and stark contrast carve out the isolation, letting darkness speak as loudly as light.",
    stills: STILLS_LB,
    watchUrl: null,
    watchLabel: null,
  },
  {
    id: 2,
    title: "Trash Can",
    titleKr: "쓰레기통",
    category: "Short Film",
    year: "2024",
    role: "Director of Photography",
    director: "Kim Boae",
    format: "Digital — Sony FX6",
    duration: "19 min",
    description:
      "Fluorescent corridors and muted daylight frame quiet acts of care and loss. The camera holds its distance — observing rather than intruding — finding meaning in the objects people carry and the spaces they pass through.",
    stills: STILLS_TC,
    watchUrl: "https://youtu.be/j2Ym8KJnWGk?si=Zrtgty2UYI4Z7iq6",
    watchLabel: "Watch on YouTube",
  },
  {
    id: 3,
    title: "How to Dispose of Tangerine Box",
    titleKr: "귤박스를 처리하는 방법",
    category: "Short Film",
    year: "2023",
    role: "Gaffer",
    director: "Cha Hyunseo",
    format: "",
    duration: "",
    description:
      "Warm practicals and soft window light fill a domestic interior where two people navigate the small, unspoken weight of being together. As gaffer, the goal was to let every lamp in the room do the storytelling.",
    stills: STILLS_TB,
    watchUrl: null,
    watchLabel: null,
  },
];

function Nav({ activeSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 clamp(24px, 5vw, 80px)", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.5s ease",
    }}>
      <button onClick={() => onNavigate("hero")} style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400,
        letterSpacing: "0.04em", color: "var(--text-primary)",
      }}>Kyujin</button>
      <div style={{ display: "flex", gap: 32 }}>
        {NAV_ITEMS.map((item) => (
          <button key={item} onClick={() => onNavigate(item.toLowerCase())} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 400,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: activeSection === item.toLowerCase() ? "var(--text-primary)" : "var(--text-secondary)",
            transition: "color 0.3s ease", padding: "4px 0",
            borderBottom: activeSection === item.toLowerCase() ? "1px solid var(--accent-dim)" : "1px solid transparent",
          }}>{item}</button>
        ))}
      </div>
    </nav>
  );
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`, ...style,
    }}>{children}</div>
  );
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section id="hero" style={{
      height: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end",
      padding: "0 clamp(24px, 5vw, 80px) clamp(48px, 8vh, 100px)", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: "cover", backgroundPosition: "center 30%", zIndex: 0,
        opacity: loaded ? 1 : 0, transform: loaded ? "scale(1)" : "scale(1.05)",
        transition: "opacity 1.8s ease 0.2s, transform 3s ease 0s",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: `linear-gradient(180deg, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.1) 30%, rgba(10,10,10,0.85) 75%, rgba(10,10,10,0.98) 100%),
                     linear-gradient(90deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.3) 100%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.035, zIndex: 2, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: "relative", zIndex: 3 }}>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 400,
          letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)",
          marginBottom: 20, opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(12px)", transition: "all 1s ease 0.3s",
        }}>Cinematographer</p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(48px, 8vw, 112px)",
          fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.01em",
          color: "var(--text-primary)", opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 1.2s ease 0.5s",
        }}>Kyujin</h1>
        <div style={{
          marginTop: 32, width: 48, height: 1, background: "var(--accent-dim)",
          opacity: loaded ? 1 : 0, transform: loaded ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left", transition: "all 1s ease 0.9s",
        }} />
        <p style={{
          fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300,
          color: "var(--text-secondary)", marginTop: 20, lineHeight: 1.7, maxWidth: 420,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(12px)",
          transition: "all 1s ease 1.1s",
        }}>
          Shaping light and shadow to find the emotional truth within each frame.<br />Based in Seoul.
        </p>
      </div>
      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 3,
        opacity: loaded ? 0.4 : 0, transition: "opacity 1.5s ease 1.6s",
      }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>Scroll</span>
        <div style={{ width: 1, height: 32, background: "linear-gradient(180deg, var(--text-muted), transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes scrollPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
    </section>
  );
}

function StillsGallery({ stills }) {
  const [lightbox, setLightbox] = useState(null);

  if (!stills || stills.length === 0) {
    return (
      <div style={{
        aspectRatio: "21/9", background: "linear-gradient(135deg, #1a1918 0%, #252320 40%, #1e1c1a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28,
      }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Stills Coming Soon
        </span>
      </div>
    );
  }

  const topRow = stills.slice(0, 3);
  const bottomRow = stills.slice(3, 6);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${topRow.length}, 1fr)`, gap: 3, marginBottom: bottomRow.length > 0 ? 3 : 28 }}>
        {topRow.map((src, i) => (
          <div key={i} onClick={() => setLightbox(i)} style={{
            aspectRatio: "16/9", backgroundImage: `url(${src})`, backgroundSize: "cover",
            backgroundPosition: "center", cursor: "pointer", transition: "filter 0.4s ease, transform 0.4s ease",
            filter: "brightness(0.9)", position: "relative",
          }}
            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "scale(1.01)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = "brightness(0.9)"; e.currentTarget.style.transform = "scale(1)"; }}
          />
        ))}
      </div>
      {bottomRow.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${bottomRow.length}, 1fr)`, gap: 3, marginBottom: 28 }}>
          {bottomRow.map((src, i) => (
            <div key={i + 3} onClick={() => setLightbox(i + 3)} style={{
              aspectRatio: "16/9", backgroundImage: `url(${src})`, backgroundSize: "cover",
              backgroundPosition: "center", cursor: "pointer", transition: "filter 0.4s ease, transform 0.4s ease",
              filter: "brightness(0.9)", position: "relative",
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "scale(1.01)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "brightness(0.9)"; e.currentTarget.style.transform = "scale(1)"; }}
            />
          ))}
        </div>
      )}

      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out",
          backdropFilter: "blur(8px)",
        }}>
          <img src={stills[lightbox]} alt="" style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain" }} />
          <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 16 }}>
            {stills.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightbox(i); }} style={{
                width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer",
                background: i === lightbox ? "var(--accent)" : "var(--text-muted)", transition: "background 0.3s",
              }} />
            ))}
          </div>
          <button onClick={() => setLightbox(null)} style={{
            position: "absolute", top: 24, right: 24, background: "none", border: "none",
            color: "var(--text-secondary)", fontSize: 24, cursor: "pointer", fontFamily: "var(--font-body)",
          }}>✕</button>
        </div>
      )}
    </>
  );
}

function FilmCard({ film, index }) {
  return (
    <FadeIn delay={index * 0.15}>
      <article style={{ borderTop: "1px solid var(--border)", paddingTop: 48, marginBottom: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.15em",
              textTransform: "uppercase", color: "var(--accent-dim)", marginBottom: 8,
            }}>{film.category}</p>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 400, fontStyle: "italic", color: "var(--text-primary)", lineHeight: 1.2,
            }}>
              {film.title}
              {film.titleKr && (
                <span style={{ fontSize: "0.5em", fontStyle: "normal", fontWeight: 300, color: "var(--text-muted)", marginLeft: 12 }}>
                  {film.titleKr}
                </span>
              )}
            </h3>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 300,
              color: "var(--text-muted)", letterSpacing: "0.08em", marginTop: 8,
            }}>{film.year}{film.duration ? ` — ${film.duration}` : ""}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-dim)" }}>{film.role}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Dir. {film.director}{film.format ? ` · ${film.format}` : ""}</p>
          </div>
        </div>

        <StillsGallery stills={film.stills} />

        <p style={{
          fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300,
          lineHeight: 1.85, color: "var(--text-secondary)", maxWidth: 620,
        }}>{film.description}</p>

        {film.watchUrl && (
          <a href={film.watchUrl} style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20,
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 400,
            letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)",
            textDecoration: "none", paddingBottom: 2, borderBottom: "1px solid var(--accent-dim)",
          }}>
            {film.watchLabel || "Watch"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
          </a>
        )}
        {!film.watchUrl && (
          <p style={{ marginTop: 20, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontStyle: "italic" }}>Coming Soon</p>
        )}
      </article>
    </FadeIn>
  );
}

function AboutSection() {
  return (
    <section id="about" style={{ padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 80px)", borderTop: "1px solid var(--border)" }}>
      <FadeIn>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 40 }}>About</p>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(40px, 6vw, 80px)" }}>
        <FadeIn delay={0.1}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 300, fontStyle: "italic", lineHeight: 1.3, color: "var(--text-primary)",
          }}>Light does not simply illuminate—<br />it reveals.</h2>
        </FadeIn>
        <FadeIn delay={0.25}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, lineHeight: 1.9, color: "var(--text-secondary)" }}>
            <p>I am a cinematography student at Dongguk University, Seoul, pursuing a career as a director of photography. My work is guided by the belief that the camera is not merely a recording device but a storytelling instrument — one that shapes how an audience feels before they understand why.</p>
            <br />
            <p>I study the interplay between naturalistic and expressive lighting, drawing from the traditions of classical cinematographers while searching for a visual language that is my own. Each project is an opportunity to understand light more deeply.</p>
            <br />
            <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Influences — Roger Deakins, Vittorio Storaro, Janusz Kamiński, Robert Richardson. I believe in the power of simplicity, the discipline of pre-visualization, and the courage to let a single frame breathe.</p>
          </div>
        </FadeIn>
      </div>
      <FadeIn delay={0.35}>
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32 }}>
          {[
            { label: "Education", value: "Dongguk University\nFilm & Visual Media" },
            { label: "Focus", value: "Cinematography\nLighting Design" },
            { label: "Tools", value: "DaVinci Resolve\nPremiere Pro" },
            { label: "Based in", value: "Seoul,\nSouth Korea" },
          ].map((item, i) => (
            <div key={i}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent-dim)", marginBottom: 8 }}>{item.label}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 300, lineHeight: 1.7, color: "var(--text-secondary)", whiteSpace: "pre-line" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" style={{ padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 80px)", borderTop: "1px solid var(--border)" }}>
      <FadeIn>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 40 }}>Contact</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 300, lineHeight: 1.3, color: "var(--text-primary)", marginBottom: 40 }}>
          Let's create something<br /><span style={{ fontStyle: "italic", color: "var(--accent)" }}>worth watching.</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <a href="mailto:yoursummerismine@gmail.com" style={{
            fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300,
            color: "var(--text-secondary)", textDecoration: "none",
            borderBottom: "1px solid var(--border)", paddingBottom: 2,
            display: "inline-block", width: "fit-content",
          }}>yoursummerismine@gmail.com</a>
          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            {[{ label: "Instagram", url: "https://instagram.com/headingtostar" }].map((link) => (
              <a key={link.label} href={link.url} style={{
                fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none",
              }}>{link.label}</a>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const s = document.createElement("style"); s.textContent = FONTS_CSS;
    document.head.appendChild(s); return () => document.head.removeChild(s);
  }, []);
  useEffect(() => {
    const sections = ["works", "about", "contact"];
    const handleScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) { const r = el.getBoundingClientRect(); if (r.top <= 200 && r.bottom > 200) { setActiveSection(id); return; } }
      }
      if (window.scrollY < 300) setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Nav activeSection={activeSection} onNavigate={scrollTo} />
      <HeroSection />
      <section id="works" style={{ padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 80px) 0" }}>
        <FadeIn>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 56 }}>Selected Works</p>
        </FadeIn>
        {FILMS.map((film, i) => (<FilmCard key={film.id} film={film} index={i} />))}
      </section>
      <AboutSection />
      <ContactSection />
      <footer style={{ padding: "32px clamp(24px, 5vw, 80px)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.08em", color: "var(--text-muted)" }}>© 2026 Kyujin. All rights reserved.</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.08em", color: "var(--text-muted)", fontStyle: "italic" }}>Every frame is a decision.</p>
      </footer>
    </div>
  );
}
