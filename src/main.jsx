import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './styles/index.css';

// index.html me <div id="root"></div> hai — usme React render hota hai
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);