import { FILMOGRAPHY } from "../data";
import { CATEGORIES, getProjects } from "../content";
import ProjectGrid from "../components/ProjectGrid";
import { Arrow } from "../components/Icons";

export function HomePage() {
  return (
    <section className="home-page" aria-labelledby="page-title">
      <h1 className="sr-only" id="page-title">Kyujin Choi — Cinematographer · AI Artist</h1>
      <div className="home-stage">
        <div className="home-graphic" aria-hidden="true">
          <svg viewBox="0 0 1100 760" focusable="false">
            <g className="home-frame-echo" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
              <path d="M84 207 768 31 925 385 139 527Z" />
              <path d="M247 317 913 145 1064 480 341 669Z" />
            </g>
            <path className="home-frame" fill="currentColor" d="M147 251 832 72 1005 439 205 653Z" />
            <path className="home-frame-cutout" d="M217 283 794 138 924 408 261 594Z" />
          </svg>
        </div>
        <div className="home-caption"><p className="home-role">Cinematographer · AI Artist</p><a className="text-link" href="#/archive">View archive <Arrow /></a></div>
      </div>
    </section>
  );
}

export function GalleryPage({ group }) {
  const projects = getProjects(group);
  const label = CATEGORIES.find((item) => item.id === group).label;
  return (
    <section aria-labelledby="page-title">
      <header className="page-heading"><h1 id="page-title">{label}</h1><p>{projects.length} projects</p></header>
      <ProjectGrid projects={projects} large={group === "commercials" || group === "films"} />
    </section>
  );
}

export function CrewPage() {
  return (
    <section aria-labelledby="page-title">
      <header className="page-heading"><h1 id="page-title">Crew</h1><p>{FILMOGRAPHY.length} selected credits</p></header>
      <div className="crew-intro"><h2>Filmography</h2><p>Camera department, cinematography, lighting and direction · 2020—2026</p></div>
      <div className="crew-table" role="list">
        {FILMOGRAPHY.map((item) => (
          <article className="crew-row" role="listitem" key={item.id}>
            <p className="crew-year">{item.year}</p>
            <div className="crew-work"><h3>{item.watchUrl ? <a href={item.watchUrl} target="_blank" rel="noreferrer">{item.title}<Arrow /></a> : item.title}{item.titleEn && <span>{item.titleEn}</span>}</h3><p>{item.format}{item.director !== "—" ? ` · Dir. ${item.director}` : ""}</p></div>
            <p className="crew-role">{item.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AboutPage() {
  const facts = [["Education", "Dongguk University\nDepartment of Film"], ["Focus", "Cinematography · Lighting\nAI Visual Media"], ["Tools", "DaVinci Resolve\nPremiere Pro"], ["Based in", "Seoul, South Korea"]];
  return (
    <section aria-labelledby="page-title">
      <header className="page-heading"><h1 id="page-title">About</h1></header>
      <div className="about-layout"><h2>Light does not simply illuminate.<br />It reveals.</h2><div className="prose"><p>I studied film at Dongguk University, Seoul, specializing in cinematography and lighting within the Department of Film. My work is rooted in the belief that light is not decoration — it is language.</p><p>Beyond traditional filmmaking, I explore the intersection of cinematography and AI-driven visual media, asking how emerging tools can expand visual storytelling while preserving the craft at its core.</p></div></div>
      <dl className="about-facts">{facts.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <a className="text-link about-crew-link" href="#/crew">View crew work <Arrow /></a>
    </section>
  );
}

export function ContactPage() {
  return (
    <section aria-labelledby="page-title">
      <header className="page-heading"><h1 id="page-title">Contact</h1></header>
      <div className="contact-layout"><h2>Let’s create something<br />worth watching.</h2><div className="contact-links"><a href="mailto:yoursummerismine@gmail.com"><span>yoursummerismine@gmail.com</span><Arrow /></a><a href="https://instagram.com/headingtostar" target="_blank" rel="noreferrer"><span>Instagram</span><Arrow /></a></div></div>
    </section>
  );
}
