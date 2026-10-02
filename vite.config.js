// Vite + React + Vitest ka ek hi config file
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages repo ke naam ke hisaab se base path set hota hai
  // (local dev me '/' hi rehta hai — isliye kuch nahi karna padta)
  base: process.env.VITE_BASE_PATH || '/',

  plugins: [react()],

  server: {
    port: 5173,
    open: true, // npm run dev chalate hi browser khul jayega
  },

  preview: {
    port: 4173,
  },

  // ---- Vitest (test runner) ----
  test: {
    environment: 'jsdom', // browser jaisa environment
    globals: true, // describe/it/expect bina import ke
    setupFiles: ['./src/test/setup.js'], // har test se pehle yeh chalta hai
    include: ['src/**/*.test.{js,jsx}'],
  },
});