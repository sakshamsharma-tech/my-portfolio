import { education } from '../data/education.js';

/**
 * Education — degree + certifications (DUMB component).
 *
 * Experience se alag section hai (FR-21) kyunki:
 *  - experience = "kahan kaam kiya" (timeline, vertical line)
 *  - education = "kaha padha" (simple list, no timeline)
 * Do designs mix karne se dono ka hierarchy kharab hota hai.
 */
export default function Education() {
  return (
    <section id="education" className="section edu" aria-labelledby="education-title">
      <div className="container">
        <header className="section__head" data-reveal>
          <p className="eyebrow">{education.eyebrow}</p>
          <h2 id="education-title" className="section__title">
            {education.title}
          </h2>
          <p className="section__sub">{education.subtitle}</p>
        </header>

        <ul className="edu-grid" data-reveal>
          {education.items.map((item) => (
            <li key={item.id} className="edu-card">
              <div className="edu-card__top">
                <h3 className="edu-card__degree">{item.degree}</h3>
                <span className="edu-card__period">{item.period}</span>
              </div>
              <p className="edu-card__school">
                {item.school}
                <span className="timeline-card__sep" aria-hidden="true">
                  ·
                </span>
                {item.location}
              </p>
              <p className="edu-card__detail">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}