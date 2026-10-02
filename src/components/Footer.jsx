import SocialLinks from './SocialLinks.jsx';
import { profile } from '../data/profile.js';

/**
 * Footer — page ka bottom (DUMB component, koi state nahi).
 *
 * AC-05.9 ke liye yahan YouTube social link hai (saare socials Footer me
 * dikhte hain — `SocialLinks` bina `only` prop ke sab render karta hai).
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__lead">
          <p className="footer__name">{profile.name}</p>
          <p className="footer__role">{profile.role}</p>
        </div>

        <SocialLinks className="socials--footer" />

        <p className="footer__meta">
          &copy; {year} {profile.name}. Built with React &amp; Vite.
        </p>
      </div>
    </footer>
  );
}