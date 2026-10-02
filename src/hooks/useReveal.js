import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-reveal]';

/**
 * Jo bhi element par `data-reveal` attribute hai, use viewport me aate hi
 * fade-in karta hai (IntersectionObserver — browser ka native API).
 *
 * ------------------------------------------------------------------
 * ⚠️ IS HOOK KA SAABSE IMPORTANT HISAAB (ek baar me bug hua tha):
 *
 * Pehle ye sirf `[]` dependency ke saath mount pe chalti thi.
 * Iska matlab: filter jaise dynamic lists jo NAYE `[data-reveal]` elements
 * render karti hain, unhe kabhi observe hi nahi kiya gaya → wo
 * `opacity: 0` par ATAK jate the → user ko page par invisible.
 *
 * Isliye ab do observer chal rahe hain:
 *   1. IntersectionObserver → animation trigger karta hai
 *   2. MutationObserver     → naye DOM nodes ko pakadta hai aur turant
 *                             observe karne lagta hai
 *
 * Sirf App.jsx me ek baar call karna kaafi hai — har section ke liye nahi.
 * ------------------------------------------------------------------
 */
export function useReveal() {
  useEffect(() => {
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // ek baar dikha, phir chhod do
              });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
          )
        : null;

    function observe(el) {
      if (!el || el.classList.contains('is-visible')) return;

      // Browser support nahi karta → content kabhi chhupa nahi hona chahiye
      if (!observer) {
        el.classList.add('is-visible');
        return;
      }
      observer.observe(el);
    }

    // 1) Abhi maujood saare elements
    document.querySelectorAll(REVEAL_SELECTOR).forEach(observe);

    // 2) Future me React jo bhi naya reveal-element add karega
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches(REVEAL_SELECTOR)) observe(node);
          node.querySelectorAll(REVEAL_SELECTOR).forEach(observe);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}