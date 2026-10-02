/**
 * Vitest setup — har test file se pehle chalta hai (vite.config.js me registered).
 *
 * Ye file "test jaanch" ki foundation hai:
 *  1. `@testing-library/jest-dom` → DOM assertions (`toBeInTheDocument`,
 *     `toHaveAttribute`, ...) plain English me likhne deta hai
 *  2. `user-event` ka `userEvent.setup()` → real keyboard/mouse events
 *  3. JSDOM jo nahi kar pata, uska chhota polyfill (matchMedia, scrollTo)
 */
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup(); // har test ke baad DOM saaf — test ek dusre ko affect na kare
  vi.clearAllMocks();
});

/**
 * JSDOM ki known limitations ka polyfill.
 * Ye zaroori hai kyunki humara code in browser APIs par depend karta hai.
 */

// 1. matchMedia — theme toggle system-preference check karta hai
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false, // default: user light mode me hai
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated API, bs
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// 2. scrollTo / scrollIntoView — anchor links + useScrollSpy
window.scrollTo = vi.fn();
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// 3. IntersectionObserver — `useReveal` iska use karta hai.
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

// 4. ResizeObserver — kuch layout components iska use karte hain
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}