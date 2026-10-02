import SocialIcon from './SocialIcon.jsx';
import { profile } from '../data/profile.js';

/**
 * SocialLinks — social icons ki row (DUMB component).
 *
 * Do jagah reuse hota hai:
 *   - Header (sirf `header: true` wala → sirf YouTube, compact rakhne ke liye)
 *   - Footer (saare links)
 *
 * Security (NFR-14): har external link par `rel="noreferrer noopener"`.
 *   - `noopener` → naya tab `window.opener` se linked nahi hoga (tabnabbing attack)
 *   - `noreferrer` → referrer header nahi jayega (privacy)
 *
 * `mailto:` links par ye attributes lagana harmless hai, par `target="_blank"`
 * mailto pe nahi lagana chahiye — wo neeche detect hota hai.
 */
export default function SocialLinks({ only = null, className = '' }) {
  const links = only
    ? profile.socials.filter((s) => s[only])
    : profile.socials;

  return (
    <ul className={`socials${className ? ` ${className}` : ''}`}>
      {links.map((social) => {
        const isMail = social.url.startsWith('mailto:');

        return (
          <li key={social.label}>
            <a
              className="social-btn"
              href={social.url}
              // AC-05.12 — accessible name screen reader ko mile (icon aria-hidden hai)
              aria-label={social.label}
              title={social.label}
              {...(isMail ? {} : { target: '_blank', rel: 'noreferrer noopener' })}
            >
              <SocialIcon name={social.icon} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}