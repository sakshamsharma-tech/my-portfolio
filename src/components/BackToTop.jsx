import { useEffect, useState } from 'react';

/**
 * BackToTop — page top pe wapas le jaane wala button (SMART component).
 *
 * Ye SMART hai kyunki useState chahiye: button tab dikhe jab user ne
 * kaafi scroll kiya ho. Baaki sab DUMB.
 *
 * 500px ka threshold kyun? Chhota enough ki button utna scroll par aaye
 * jab user ko zaroorat lage, aur bada enough ki shuru me screen clean rahe.
 */
const SHOW_AFTER = 500;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`to-top${visible ? ' to-top--visible' : ''}`}
      // `aria-hidden` + `tabIndex=-1`: chhupa hua button keyboard focus
      // me na aaye (focus karne se kuch nahi hota, sirf dikhta hai)
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="to-top__label">Top</span>
    </button>
  );
}