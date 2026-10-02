import { profile } from '../data/profile.js';
import SocialIcon from './SocialIcon.jsx';

/**
 * DUMB component — saara data `profile` se aata hai, koi state nahi.
 * AC-01.1 naam, AC-01.2 role + summary, AC-01.3 2 CTA buttons.
 */
export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__glow" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__text" data-reveal>
          <p className="pill">
            <span className="pill__dot" aria-hidden="true" />
            {profile.availability}
          </p>

          <h1 className="hero__title">
            Hi, mai <span className="gradient-text">{profile.name}</span>
          </h1>

          <p className="hero__role">
            <span className="hero__role-label">I&rsquo;m a</span>
            <strong>{profile.role}</strong>
          </p>

          <p className="hero__tagline">{profile.tagline}</p>

          <div className="hero__cta">
            <a className="btn btn--primary" href="#projects">
              View my work
            </a>
            <a className="btn btn--ghost" href={profile.resumeUrl} download>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
              </svg>
              Resume
            </a>
          </div>

          <ul className="hero__socials">
            {profile.socials.map((item) => (
              <li key={item.label}>
                <a
                  className="social-btn"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={item.label}
                  title={item.label}
                >
                  <SocialIcon name={item.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual side */}
        <div className="hero__visual" data-reveal style={{ '--reveal-delay': '120ms' }}>
          <div className="avatar-card">
            <div className="avatar-card__glow" aria-hidden="true" />
            <div className="avatar-card__monogram">{profile.initials}</div>
            <div className="avatar-card__meta">
              <span>{profile.name}</span>
              <small>{profile.location}</small>
            </div>
          </div>

          <div className="chip chip--1" aria-hidden="true">
            React 19
          </div>
          <div className="chip chip--2" aria-hidden="true">
            Vite
          </div>
          <div className="chip chip--3" aria-hidden="true">
            CSS Architecture
          </div>
          <div className="chip chip--4" aria-hidden="true">
            Testing
          </div>
        </div>
      </div>
    </section>
  );
}