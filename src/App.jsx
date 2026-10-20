import { useEffect, useRef, useState } from "react";
import { getProject } from "./content";
import Sidebar from "./components/Sidebar";
import ProjectPage from "./pages/ProjectPage";
import { HomePage, GalleryPage, CrewPage, AboutPage, ContactPage } from "./pages/IndexPages";
import "./styles.css";

const GALLERY_ROUTES = new Set(["archive", "commercials", "films", "ai-work"]);

function parseRoute(hash) {
  let path = hash.replace(/^#\/?/, "").replace(/\/$/, "");
  if (path === "career") path = "crew";
  if (path.startsWith("work/")) {
    const project = getProject(path.slice(5));
    if (project) return { page: "project", active: project.group, project, title: project.title };
  }
  if (GALLERY_ROUTES.has(path) || ["crew", "about", "contact"].includes(path)) return { page: path, active: path, title: path === "ai-work" ? "AI Work" : path.charAt(0).toUpperCase() + path.slice(1) };
  return { page: "home", active: "", title: "Cinematographer · AI Artist" };
}

export default function Portfolio() {
  const [hash, setHash] = useState(window.location.hash);
  const mainRef = useRef(null);
  const route = parseRoute(hash);

  useEffect(() => {
    const handleHash = () => {
      setHash(window.location.hash);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    document.title = route.page === "home" ? "Kyujin Choi — Cinematographer · AI Artist" : `${route.title} — Kyujin Choi`;
    const frame = window.requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [hash, route.page, route.title]);

  let page;
  if (GALLERY_ROUTES.has(route.page)) page = <GalleryPage group={route.page} />;
  else if (route.page === "project") page = <ProjectPage key={route.project.key} project={route.project} />;
  else if (route.page === "crew") page = <CrewPage />;
  else if (route.page === "about") page = <AboutPage />;
  else if (route.page === "contact") page = <ContactPage />;
  else page = <HomePage />;

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); mainRef.current.focus(); mainRef.current.scrollIntoView(); }}>Skip to content</a>
      <Sidebar activePage={route.active} />
      <main id="main-content" ref={mainRef} tabIndex={-1} className={`site-main ${route.page === "home" ? "site-main--home" : ""}`}>
        <div className="route-view" key={hash}>{page}</div>
        <footer className="content-footer"><p>© 2026 Kyujin</p>{route.page !== "home" && <p>Every frame is a decision.</p>}</footer>
      </main>
    </div>
  );
}
