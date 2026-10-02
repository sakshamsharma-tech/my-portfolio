import { useEffect } from 'react';

/**
 * Jo bhi element par `data-reveal` attribute hai, use scroll par fade-in karta hai.
 * IntersectionObserver browser ka native API hai — koi extra library nahi.
 */
export function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]:not(.is-visible)');

    // Browser support nahi karta → sab dikha do (content kabhi chhupna nahi chahiye)
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // ek baar dikha, phir observe band
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}