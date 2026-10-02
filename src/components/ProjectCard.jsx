/**
 * DUMB component — props se render karta hai.
 * Testable in isolation kyunki koi state/dependency nahi.
 */
export default function ProjectCard({ project }) {
  return (
    <article className="project-card" data-reveal data-testid="project-card">
      <div className="project-card__top">
        <h3 className="project-card__title">{project.title}</h3>
        {project.featured && <span className="badge">Featured</span>}
        <span className="project-card__year">{project.year}</span>
      </div>

      <p className="project-card__blurb">{project.blurb}</p>

      <ul className="project-card__tags">
        {project.tags.map((tag) => (
          <li key={tag} className="tag">
            {tag}
          </li>
        ))}
      </ul>

      <div className="project-card__links">
        {project.demoUrl && (
          <a
            className="btn btn--ghost btn--sm"
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            Live demo
          </a>
        )}
        <a
          className="btn btn--ghost btn--sm"
          href={project.codeUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          Source code
        </a>
      </div>
    </article>
  );
}