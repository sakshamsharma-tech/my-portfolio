import { skillGroups, toolStack } from '../data/skills.js';
import SkillGroup from './SkillGroup.jsx';

/** DUMB component — poora section map karta hai. */
export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section__head" data-reveal>
          <p className="eyebrow">Skills</p>
          <h2 className="section__title">
            Tools I reach for <span>every day</span>
          </h2>
          <p className="section__sub">
            Percentages ko seriously mat lo — yeh sirf batata hai ki kaun sa tool
            roz kaam me aata hai aur kaun sa kabhi kabhi.
          </p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <SkillGroup key={group.id} group={group} />
          ))}
        </div>

        <div className="stack" data-reveal>
          <h3 className="stack__title">Also in the toolbox</h3>
          <ul className="stack__list">
            {toolStack.map((tool) => (
              <li key={tool} className="stack__item">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}