/**
 * DUMB component — ek category ka data render karta hai.
 * Koi state nahi, koi logic nahi. (Design doc 2.2)
 */
export default function SkillGroup({ group }) {
  return (
    <article className="skill-card" data-reveal>
      <header className="skill-card__head">
        <h3 className="skill-card__title">{group.label}</h3>
        <p className="skill-card__summary">{group.summary}</p>
      </header>

      <ul className="skill-card__list">
        {group.items.map((skill) => (
          <li key={skill.name} className="skill">
            <div className="skill__top">
              <span className="skill__name">{skill.name}</span>
              <span className="skill__level">{skill.level}%</span>
            </div>

            {/* Progress bar — width CSS variable se set hoti hai (no inline style rule nahi, 
                sirf dynamic value ke liye inline custom property) */}
            <div
              className="skill__track"
              role="meter"
              aria-label={`${skill.name} proficiency`}
              aria-valuenow={skill.level}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className="skill__fill" style={{ '--value': `${skill.level}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}