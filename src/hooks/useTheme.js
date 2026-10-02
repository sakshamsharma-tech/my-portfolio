import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/** Context ko consume karne ka hook. Provider ke bahar use kiya toh error dega. */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() ko <ThemeProvider> ke andar use karo');
  }
  return ctx;
}