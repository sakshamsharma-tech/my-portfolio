import { createContext, useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Context object — component se banata hai, provider se value deta hai.
// (export zaroori hai, kyunki useTheme hook isse import karta hai)
export const ThemeContext = createContext(null);

export const THEME_KEY = 'theme';
export const THEMES = ['dark', 'light'];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(THEME_KEY, 'dark');

  // React render ke baad <html data-theme> update hota hai
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#090b14' : '#f6f7fc');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  // value object har render pe naya na bane — warna sab consumers re-render honge
  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}