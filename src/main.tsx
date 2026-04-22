import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

// Fade out the CSS preloader once React takes over
const preloader = document.getElementById('preloader');
if (preloader) {
  preloader.classList.add('fade-out');
  preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  // Fallback removal in case transitionend doesn't fire
  setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 600);
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
