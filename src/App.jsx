import { ThemeProvider } from './context/ThemeContext.jsx';
import { useReveal } from './hooks/useReveal.js';
import Header from './components/Header.jsx';
// anchor:about

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
          <section className="section">
            <div className="container">
              <p className="section__sub">
                Portfolio v1 build ho raha hai… sections ek-ek karke add ho rahe hain.
              </p>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}