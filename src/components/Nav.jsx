import { useState } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';

// Module level — har render pe naya array mat banao, warna useEffect chalta rahega
const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

// Scroll-spy ko thoda zyada pata chahiye: 'home' bhi track karo (nav link nahi hai,
// isliye page ke top pe koi link highlight nahi hoga — sahi behaviour).
// Yehi thi wajah ki page ke top par "About" highlight ho raha tha.
const SPY_IDS = ['home', ...SECTIONS.map((s) => s.id)];

function MenuIcon({ open }) {
  return open ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const activeId = useScrollSpy(SPY_IDS);

  return (
    <>
      {/* Mobile par sirf yeh button dikhta hai, desktop par CSS se chhup jaata hai */}
      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <MenuIcon open={open} />
      </button>

      <nav
        id="primary-navigation"
        className={`nav${open ? ' nav--open' : ''}`}
        aria-label="Primary"
      >
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            className={`nav__link${activeId === section.id ? ' nav__link--active' : ''}`}
            href={`#${section.id}`}
            aria-current={activeId === section.id ? 'true' : undefined}
            onClick={() => setOpen(false)}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </>
  );
}