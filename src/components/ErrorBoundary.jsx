import { Component } from 'react';

/**
 * ErrorBoundary — React me class component (hooks se ye nahi ho sakta).
 *
 * Kaunsa problem solve karta hai: React me agar kisi component ka render
 * throw kar de (TypeError, undefined.property, etc.), toh bina boundary ke
 * POORI app ka DOM blank ho jaata hai — user ko blank screen dikhta hai,
 * aur developer ko console me sirf ek stack trace.
 *
 * Ye boundary us error ko pakad leti hai aur user ko readable message
 * dikhati hai. Real-world me yahan logging (Sentry etc.) bhi hoti hai.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  /** React render ke dauraan throw hone par state update */
  static getDerivedStateFromError(error) {
    return { error };
  }

  /** Sirf logging ke liye (side effects yahan allowed hain) */
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] App crash:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="crash">
          <div className="crash__card">
            <h1 className="crash__title">Kuch galat ho gaya</h1>
            <p className="crash__text">
              Is page me koi error aa gaya. Page reload karne se theek ho jayega.
            </p>
            <button className="btn btn--primary" type="button" onClick={() => window.location.reload()}>
              Reload page
            </button>
            {import.meta.env.DEV && (
              <pre className="crash__detail">{String(this.state.error?.message ?? this.state.error)}</pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}