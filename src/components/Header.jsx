import Nav from './Nav.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import SocialLinks from './SocialLinks.jsx';
import { profile } from '../data/profile.js';
import { useEffect, useState } from 'react';

/**
 * DUMB component — koi apna state nahi, sirf props/layout render karta hai.
 * Scroll hone par border/shadow dikhane ke liye chhota sa scroll state hai.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a className="brand" href="#top">
          <span className="brand__mark" aria-hidden="true">
            {profile.initials}
          </span>
          <span>{profile.name}</span>
        </a>

        <div className="header__actions">
          <Nav />
          {/* Header me sirf YouTube icon (AC-05.9) — poori social row
              header ko crowded kar deti, khaas kar mobile par.
              Baaki sab links Footer me hain. */}
          <SocialLinks only="header" className="socials--header" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}