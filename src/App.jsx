import { ThemeProvider } from './context/ThemeContext.jsx';
import { useReveal } from './hooks/useReveal.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
// anchor:skills
import Projects from './components/Projects.jsx';

/**
 * App = "composition root".
 * Yahan koi business logic nahi hoti — sirf sections ko order me joda jaata hai.
 * Scroll animations bhi yahan se enable hoti hain (ek baar).
 */
export default function App() {
  useReveal();

  return (
    <ThemeProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="app" id="top">
        <Header />

        <main id="main">
          {/* Sections yahan add hoti hain — anchor:hero */}
          <Hero />
          <About />
          {/* anchor:skills */}
          <Projects />
        </main>
      </div>
    </ThemeProvider>
  );
}