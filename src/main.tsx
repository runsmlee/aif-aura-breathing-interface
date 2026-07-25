import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

// Remove the preloader immediately — it lives outside #root as a sibling.
// React renders into #root, so the preloader never blocks the app.
function removePreloader(): void {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    // Hard fallback: remove after 500ms regardless of transition events
    setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 500);
  }
}

removePreloader();

try {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} catch (err) {
  // If React fails to mount, ensure the preloader is gone and show a fallback
  removePreloader();
  root.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:2rem;text-align:center;color:#9CA3AF;font-family:system-ui,sans-serif"><h1 style="font-size:1.5rem;color:#fff;margin-bottom:0.5rem">Box Breathing Timer</h1><p style="font-size:0.875rem">Something went wrong loading the app. Please refresh the page.</p></div>';
  console.error('Failed to mount React app:', err);
}

// Register service worker for offline PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed — app still works without it
    });
  });
}
