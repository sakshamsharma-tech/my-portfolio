import { useCallback, useEffect, useState } from 'react';

/**
 * useState + localStorage ka combined hook.
 * Do jagah use ho raha hai (theme, contact draft) — isliye reusable banaya.
 *
 * @param {string} key   localStorage me key
 * @param {*} initialValue  tab jab key na ho
 * @returns {[value, setValue]} jaise useState — par value browser me bhi save hoti hai
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : JSON.parse(raw);
    } catch {
      // Private mode / storage blocked ho toh crash nahi hona chahiye
      return initialValue;
    }
  });

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore quota / permission errors */
        }
        return resolved;
      });
    },
    [key],
  );

  // Doosre tab me value change ho toh yahan sync karo
  useEffect(() => {
    function onStorage(event) {
      if (event.key !== key || event.newValue == null) return;
      try {
        setValue(JSON.parse(event.newValue));
      } catch {
        /* ignore malformed value */
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, set];
}