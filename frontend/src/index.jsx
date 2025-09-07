import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { register as registerServiceWorker } from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline support
registerServiceWorker();

// Report web vitals for performance monitoring
reportWebVitals();
