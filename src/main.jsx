import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/index.css';

// index.html me <div id="root"></div> hai — usme React render hota hai
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* App crash ho toh user ko blank screen nahi dikhega */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);