/**
 * TimelineItem — experience timeline ka ek entry (DUMB component).
 *
 * A11y: `<article>` + `<ol>` me children → screen reader ko "list of 3 items"
 * bolke sunaata hai. Timeline visual vertical line hai, DOM me `<ol>` hai.
 */
export default function TimelineItem({ item }) {
  return (
    <li className="timeline__item">
      <article className="timeline-card">
        <header className="timeline-card__head">
          <div>
            <h3 className="timeline-card__role">{item.role}</h3>
            <p className="timeline-card__org">
              {item.company}
              {item.location && (
                <>
                  <span className="timeline-card__sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="timeline-card__loc">{item.location}</span>
                </>
              )}
            </p>
          </div>

          {/* Machine-readable dates — screen reader "3 saal" sunega,
              human ko compact period dikhega */}
          <div className="timeline-card__when">
            <span className="timeline-card__period">{item.period}</span>
            {item.type && <span className="timeline-card__type">{item.type}</span>}
            {item.current && (
              <span className="timeline-card__now">Current</span>
            )}
          </div>
        </header>

        <p className="timeline-card__summary">{item.summary}</p>

        <ul className="timeline-card__points">
          {item.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        {item.stack?.length > 0 && (
          <ul className="timeline-card__stack" aria-label="Technologies used">
            {item.stack.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  );
}