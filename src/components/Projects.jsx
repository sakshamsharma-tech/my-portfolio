import { useMemo, useState } from 'react';
import { projects, projectTags, ALL_TAGS } from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';

/**
 * SMART component — yahan state hai (filter), isliye yahan logic hai.
 *
 * useMemo: `visible` har render pe naya array na bane — sirf tab jab
 * activeTag ya projects change ho. (Design doc 2.5 "state colocation")
 */
export default function Projects() {
  const [activeTag, setActiveTag] = useState(ALL_TAGS);

  const visibleProjects = useMemo(
    () =>
      activeTag === ALL_TAGS
        ? projects
        : projects.filter((project) => project.tags.includes(activeTag)),
    [activeTag],
  );

  return (
    <section className="section section--alt" id="projects">
      <div className="container">
        <div className="section__head" data-reveal>
          <p className="eyebrow">Projects</p>
          <h2 className="section__title">
            Things I have <span>actually shipped</span>
          </h2>
          <p className="section__sub">
            Filter karke dekho — har project ka apna tag hai. Sirf wahi dikhega jo
            tum select karoge.
          </p>
        </div>

        {/* Filter bar — role="group" screen readers ke liye */}
        <div className="filters" role="group" aria-label="Filter projects by technology" data-reveal>
          {projectTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`filter${activeTag === tag ? ' filter--active' : ''}`}
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <p className="filters__count" role="status">
          Showing {visibleProjects.length} of {projects.length} projects
          {activeTag !== ALL_TAGS && (
            <>
              {' '}
              tagged <strong>{activeTag}</strong>
            </>
          )}
        </p>

        <div className="projects-grid">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}