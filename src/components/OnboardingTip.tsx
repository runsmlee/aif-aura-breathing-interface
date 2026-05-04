import { useState, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';
import { useFocusTrap, usePrefersReducedMotion } from '../hooks';

interface OnboardingTipProps {
  hasCompletedASession: boolean;
}

const TIPS = [
  {
    icon: '🫁',
    title: 'Breathe with the circle',
    text: 'Watch the circle expand as you inhale and contract as you exhale. Follow its rhythm.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard shortcuts',
    text: 'Press Space to start or pause, Escape to reset. Works anytime.',
  },
  {
    icon: '🎯',
    title: 'Choose your pattern',
    text: 'Try Box Breathing for focus, 4-7-8 for relaxation, or Coherent for balance.',
  },
];

const STORAGE_KEY = 'aura-onboarding-dismissed';

function hasBeenDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Storage unavailable
  }
}

export function OnboardingTip({ hasCompletedASession }: OnboardingTipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const focusTrapRef = useFocusTrap(isVisible);

  useEffect(() => {
    if (!hasBeenDismissed() && !hasCompletedASession) {
      const delay = prefersReducedMotion ? 0 : 1200;
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedASession, prefersReducedMotion]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    markDismissed();
  }, []);

  const handleNext = useCallback(() => {
    if (currentTip < TIPS.length - 1) {
      setCurrentTip((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  }, [currentTip, handleDismiss]);

  // Allow Escape key dismissal for accessibility
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleDismiss]);

  const handlePrev = useCallback(() => {
    if (currentTip > 0) {
      setCurrentTip((prev) => prev - 1);
    }
  }, [currentTip]);

  if (!isVisible) return null;

  const tip = TIPS[currentTip];
  const enterAnimation = prefersReducedMotion ? '' : 'animate-fade-in-up';

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Quick tips"
    >
      <div ref={focusTrapRef as RefObject<HTMLDivElement>} className={`w-full max-w-sm bg-gray-900 border border-gray-800/80 rounded-3xl p-6 shadow-2xl shadow-black/50 ${enterAnimation}`}>
        {/* Tip content */}
        <div className="text-center mb-5">
          <span className="text-3xl" role="img" aria-hidden="true">{tip.icon}</span>
          <h3 className="text-lg font-medium text-white mt-3">{tip.title}</h3>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">{tip.text}</p>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-5" aria-hidden="true">
          {TIPS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i === currentTip ? 'bg-primary-500 w-4' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {currentTip > 0 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-xl"
            >
              Back
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-xl"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            {currentTip < TIPS.length - 1 ? 'Next' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
}
