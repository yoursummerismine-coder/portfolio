export default function ProjectGrid({ projects, large = false }) {
  return (
    <div className={`project-grid ${large ? "project-grid--large" : ""}`}>
      {projects.map((project) => (
        <article className="project-card" key={project.key}>
          <a href={`#/work/${project.key}`} className="project-card-link" aria-label={`View ${project.title}`}>
            <div className="project-thumbnail" style={{ aspectRatio: project.aspect }}>
              <img src={project.thumbnail} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" />
            </div>
            <div className="project-caption">
              <div className="project-title-row"><h2>{project.title}</h2><span>{project.year}</span></div>
              {project.subtitle && <p className="project-card-subtitle">{project.subtitle}</p>}
              <p className="project-card-role">{project.role}</p>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
