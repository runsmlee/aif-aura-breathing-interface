import { useEffect } from 'react';

interface UseKeyboardShortcutsOptions {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isActive: boolean;
}

export function useKeyboardShortcuts({
  onStart,
  onPause,
  onReset,
  isActive,
}: UseKeyboardShortcutsOptions): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isActive) {
            onPause();
          } else {
            onStart();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onReset();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, onPause, onReset, isActive]);
}
