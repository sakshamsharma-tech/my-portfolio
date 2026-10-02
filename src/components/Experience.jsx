import TimelineItem from './TimelineItem.jsx';
import { experience } from '../data/experience.js';

/**
 * Experience — vertical timeline (DUMB component).
 *
 * `<ol>` semantic list hai — timeline visual decoration hai, DOM me order
 * aur count dono machine-readable rehte hain (NFR-04).
 */
export default function Experience() {
  return (
    <section
      id={experience.id}
      className="section section--alt exp"
      aria-labelledby="experience-title"
    >
      <div className="container">
        <header className="section__head" data-reveal>
          <p className="eyebrow">{experience.eyebrow}</p>
          <h2 id="experience-title" className="section__title">
            {experience.title}
          </h2>
          <p className="section__sub">{experience.subtitle}</p>
        </header>

        <ol className="timeline" data-reveal>
          {experience.items.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}