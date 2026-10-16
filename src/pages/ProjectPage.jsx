import { getProjects } from "../content";
import { Arrow } from "../components/Icons";
import { StillGallery, YouTubePlayer } from "../components/Media";

export default function ProjectPage({ project }) {
  const siblings = getProjects(project.group);
  const position = siblings.findIndex((item) => item.key === project.key);
  const previous = siblings[position - 1];
  const next = siblings[position + 1];
  const facts = [];
  if (project.brand) facts.push(["Client / Artist", project.brand]);
  if (project.director) facts.push(["Director", project.director]);
  if (project.format) facts.push(["Capture", project.format]);
  if (project.duration) facts.push([project.durationLabel || (project.duration === "In Post-Production" ? "Status" : "Runtime"), project.duration]);
  if (project.tools) facts.push(["Tools", project.tools]);
  if (project.group === "ai-work") facts.push(["Frame", project.aspect.replace(" / ", " : ")]);

  return (
    <article className="project-page">
      <a className="back-link" href={`#/${project.group}`}><Arrow direction="left" /> Back to {project.groupLabel}</a>
      <header className="project-header">
        <div><h1 id="page-title">{project.title}</h1><p>{project.titleKr && <>{project.titleKr}<span className="meta-separator">·</span></>}{project.category}<span className="meta-separator">·</span>{project.year}</p></div>
        <p className="project-header-role">{project.role}</p>
      </header>

      {project.watchUrl ? <YouTubePlayer project={project} /> : project.src ? (
        <div className="local-player" style={{ aspectRatio: project.aspect }}>
          <video src={project.src} poster={project.poster} controls playsInline preload="metadata" aria-label={project.title} />
        </div>
      ) : (
        <figure className="project-cover"><img src={project.thumbnail} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} fetchpriority="high" /></figure>
      )}

      <div className="project-information">
        <dl className="project-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <div className="project-description">{project.subtitle && project.group === "commercials" && <p>{project.subtitle}</p>}{project.description && <p>{project.description}</p>}{!project.watchUrl && !project.src && <p className="availability">Film link coming soon</p>}</div>
      </div>

      {project.stills && <StillGallery project={project} />}

      <nav className="project-pagination" aria-label="More projects">
        <div>{previous && <a href={`#/work/${previous.key}`}><Arrow direction="left" /><span><small>Previous</small>{previous.title}</span></a>}</div>
        <div>{next && <a href={`#/work/${next.key}`}><span><small>Next</small>{next.title}</span><Arrow /></a>}</div>
      </nav>
    </article>
  );
}
