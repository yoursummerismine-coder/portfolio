import { useState, useEffect, useRef } from "react";

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

html {
  scroll-behavior: smooth;
  background: var(--bg-primary);
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::selection {
  background: var(--accent);
  color: var(--bg-primary);
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 3px; }
`;

const NAV_ITEMS = ["Works", "About", "Contact"];

const FILMS = [
  {
    id: 1,
    title: "Untitled Short Film I",
    year: "2025",
    role: "Director of Photography",
    director: "Director Name",
    format: "Digital — Sony FX6",
    duration: "12 min",
    description:
      "A contemplative exploration of urban solitude through fragmented light and shadow. Shot across three nights in Seoul, the film traces the invisible boundaries between public and private space.",
    stills: [
      { aspect: "16/9", label: "Still 01" },
      { aspect: "16/9", label: "Still 02" },
      { aspect: "16/9", label: "Still 03" },
    ],
    vimeoUrl: "#",
  },
  {
    id: 2,
    title: "Untitled Short Film II",
    year: "2026",
    role: "Director of Photography",
    director: "Director Name",
    format: "Digital — BMPCC 6K",
    duration: "1 min",
    description:
      "An experimental piece built from circular objects — basketballs, pinwheels, wheels, eyes, full moons, plates — edited to an epic score. An exercise in visual rhythm and metaphor.",
    stills: [
      { aspect: "16/9", label: "Still 01" },
      { aspect: "16/9", label: "Still 02" },
      { aspect: "16/9", label: "Still 03" },
    ],
    vimeoUrl: "#",
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
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 clamp(24px, 5vw, 80px)",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(10,10,10,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.5s ease",
      }}
    >
      <button
        onClick={() => onNavigate("hero")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 400,
          letterSpacing: "0.04em",
          color: "var(--text-primary)",
        }}
      >
        Kyujin
      </button>

      <div style={{ display: "flex", gap: 32 }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item.toLowerCase())}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:
                activeSection === item.toLowerCase()
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              transition: "color 0.3s ease",
              padding: "4px 0",
              borderBottom:
                activeSection === item.toLowerCase()
                  ? "1px solid var(--accent-dim)"
                  : "1px solid transparent",
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

function FadeInSection({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section
      id="hero"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 clamp(24px, 5vw, 80px) clamp(48px, 8vh, 100px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 60% 40%, rgba(196,169,125,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 20% 80%, rgba(10,10,10,0.6) 0%, transparent 60%),
            linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.0) 30%, rgba(10,10,10,0.8) 100%)
          `,
          zIndex: 1,
        }}
      />

      {/* Film grain texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 3 }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 20,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transition: "all 1s ease 0.3s",
          }}
        >
          Cinematographer
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 8vw, 112px)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 1.2s ease 0.5s",
          }}
        >
          Kyujin
        </h1>

        <div
          style={{
            marginTop: 32,
            width: 48,
            height: 1,
            background: "var(--accent-dim)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "all 1s ease 0.9s",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 300,
            color: "var(--text-secondary)",
            marginTop: 20,
            lineHeight: 1.7,
            maxWidth: 420,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transition: "all 1s ease 1.1s",
          }}
        >
          Shaping light and shadow to find the emotional truth within each frame.
          <br />
          Based in Seoul.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 3,
          opacity: loaded ? 0.4 : 0,
          transition: "opacity 1.5s ease 1.6s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 32,
            background: "linear-gradient(180deg, var(--text-muted), transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.2); }
        }
      `}</style>
    </section>
  );
}

function FilmCard({ film, index }) {
  const [hovered, setHovered] = useState(null);

  return (
    <FadeInSection delay={index * 0.15}>
      <article
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 48,
          marginBottom: 80,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              {film.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 300,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                marginTop: 8,
              }}
            >
              {film.year} — {film.duration}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-dim)",
              }}
            >
              {film.role}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 4,
              }}
            >
              Dir. {film.director} · {film.format}
            </p>
          </div>
        </div>

        {/* Stills grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
            marginBottom: 28,
          }}
        >
          {film.stills.map((still, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                aspectRatio: still.aspect,
                background: `linear-gradient(${135 + i * 30}deg, #1a1918 0%, #252320 40%, #1e1c1a 100%)`,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.4s ease",
                transform: hovered === i ? "scale(1.01)" : "scale(1)",
              }}
            >
              {/* Placeholder frame lines */}
              <div
                style={{
                  position: "absolute",
                  inset: "12%",
                  border: "1px solid rgba(196,169,125,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    opacity: hovered === i ? 1 : 0.5,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {still.label}
                </span>
              </div>

              {/* Hover overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(196,169,125,0.04)",
                  opacity: hovered === i ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 300,
            lineHeight: 1.85,
            color: "var(--text-secondary)",
            maxWidth: 620,
          }}
        >
          {film.description}
        </p>

        {/* Watch link */}
        <a
          href={film.vimeoUrl}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 20,
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            textDecoration: "none",
            paddingBottom: 2,
            borderBottom: "1px solid var(--accent-dim)",
            transition: "color 0.3s ease, border-color 0.3s ease",
          }}
        >
          Watch on Vimeo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </article>
    </FadeInSection>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 80px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <FadeInSection>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 40,
          }}
        >
          About
        </p>
      </FadeInSection>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "clamp(40px, 6vw, 80px)",
        }}
      >
        <FadeInSection delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.3,
              color: "var(--text-primary)",
            }}
          >
            Light does not simply illuminate—
            <br />
            it reveals.
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.25}>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 300,
              lineHeight: 1.9,
              color: "var(--text-secondary)",
            }}
          >
            <p>
              I am a cinematography student at Dongguk University, Seoul,
              pursuing a career as a director of photography. My work is guided
              by the belief that the camera is not merely a recording device
              but a storytelling instrument — one that shapes how an audience
              feels before they understand why.
            </p>
            <br />
            <p>
              I study the interplay between naturalistic and expressive
              lighting, drawing from the traditions of classical
              cinematographers while searching for a visual language that is
              my own. Each project is an opportunity to understand light
              more deeply.
            </p>
            <br />
            <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
              Influences — Roger Deakins, Vittorio Storaro, Janusz Kamiński,
              Robert Richardson. I believe in the power of simplicity, the
              discipline of pre-visualization, and the courage to let a
              single frame breathe.
            </p>
          </div>
        </FadeInSection>
      </div>

      {/* Technical details */}
      <FadeInSection delay={0.35}>
        <div
          style={{
            marginTop: 64,
            paddingTop: 32,
            borderTop: "1px solid var(--border)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 32,
          }}
        >
          {[
            { label: "Education", value: "Dongguk University\nFilm & Visual Media" },
            { label: "Focus", value: "Cinematography\nLighting Design" },
            { label: "Tools", value: "DaVinci Resolve\nPremiere Pro" },
            { label: "Based in", value: "Seoul,\nSouth Korea" },
          ].map((item, i) => (
            <div key={i}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--accent-dim)",
                  marginBottom: 8,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  whiteSpace: "pre-line",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 80px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <FadeInSection>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 40,
          }}
        >
          Contact
        </p>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 300,
            lineHeight: 1.3,
            color: "var(--text-primary)",
            marginBottom: 40,
          }}
        >
          Let's create something
          <br />
          <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
            worth watching.
          </span>
        </h2>
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <a
            href="mailto:your.email@example.com"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 300,
              color: "var(--text-secondary)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 2,
              display: "inline-block",
              width: "fit-content",
              transition: "color 0.3s, border-color 0.3s",
            }}
          >
            your.email@example.com
          </a>

          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            {[
              { label: "Vimeo", url: "#" },
              { label: "Instagram", url: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "32px clamp(24px, 5vw, 80px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
        }}
      >
        © 2026 Kyujin. All rights reserved.
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        Every frame is a decision.
      </p>
    </footer>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const sections = ["works", "about", "contact"];
    const handleScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(id);
            return;
          }
        }
      }
      if (window.scrollY < 300) setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Nav activeSection={activeSection} onNavigate={scrollTo} />

      <HeroSection />

      {/* Works Section */}
      <section
        id="works"
        style={{
          padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 80px) 0",
        }}
      >
        <FadeInSection>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 56,
            }}
          >
            Selected Works
          </p>
        </FadeInSection>

        {FILMS.map((film, i) => (
          <FilmCard key={film.id} film={film} index={i} />
        ))}
      </section>

      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
