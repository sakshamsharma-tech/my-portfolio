import { profile } from '../data/profile.js';

/** DUMB component — content profile.js se render karta hai. */
export default function About() {
  return (
    <section className="section section--alt" id="about">
      <div className="container">
        <div className="about">
          <div className="about__main" data-reveal>
            <p className="eyebrow">About me</p>
            <h2 className="section__title">
              A developer who cares about <span>the details</span>
            </h2>
            {profile.about.map((para) => (
              <p key={para} className="section__sub about__para">
                {para}
              </p>
            ))}
          </div>

          <aside className="about__side" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <ul className="facts">
              <li className="facts__row">
                <span className="facts__key">Email</span>
                <a className="facts__val" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
              <li className="facts__row">
                <span className="facts__key">Phone</span>
                <a className="facts__val" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                  {profile.phone}
                </a>
              </li>
              <li className="facts__row">
                <span className="facts__key">Location</span>
                <span className="facts__val">{profile.location}</span>
              </li>
              <li className="facts__row">
                <span className="facts__key">Status</span>
                <span className="facts__val facts__val--ok">
                  <span className="pill__dot" aria-hidden="true" />
                  {profile.availability}
                </span>
              </li>
            </ul>

            <ul className="stats">
              {profile.stats.map((stat) => (
                <li key={stat.label} className="stats__item">
                  <strong className="stats__value gradient-text">{stat.value}</strong>
                  <span className="stats__label">{stat.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}