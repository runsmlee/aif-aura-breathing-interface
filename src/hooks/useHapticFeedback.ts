import { useCallback } from 'react';

const PHASE_VIBRATION_MS: Record<string, number> = {
  inhale: 50,
  hold: 30,
  exhale: 80,
};

const COMPLETION_PATTERN: number[] = [50, 50, 50, 50, 100];

export function useHapticFeedback(enabled: boolean) {
  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!enabled) return;
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate(pattern as VibratePattern);
        }
      } catch {
        // Vibration API not available
      }
    },
    [enabled]
  );

  const vibratePhase = useCallback(
    (phase: 'inhale' | 'hold' | 'exhale') => {
      vibrate(PHASE_VIBRATION_MS[phase] ?? 50);
    },
    [vibrate]
  );

  const vibrateCompletion = useCallback(() => {
    vibrate(COMPLETION_PATTERN);
  }, [vibrate]);

  return { vibratePhase, vibrateCompletion };
}
