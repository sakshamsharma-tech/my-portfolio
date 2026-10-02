import { useEffect, useState } from 'react';

/**
 * Scroll position dekh kar batata hai ki user kaun si section me hai.
 * Nav ka "active" highlight isi se chalta hai.
 *
 * @param {string[]} ids  section element ids
 * @param {number} offset sticky header ki height
 */
export function useScrollSpy(ids, offset = 140) {
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    function onScroll() {
      const line = window.scrollY + offset;

      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        // element mila aur uska top line se upar chala gaya → yeh active hai
        if (el && el.offsetTop <= line) current = id;
      }
      // page ke bilkul neeche ho toh last section active
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = ids[ids.length - 1] ?? current;
      }

      setActiveId((prev) => (prev === current ? prev : current));
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offset]);

  return activeId;
}