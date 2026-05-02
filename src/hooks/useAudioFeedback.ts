import { useCallback, useEffect, useRef } from 'react';

interface UseAudioFeedbackReturn {
  playPhaseSound: (phase: 'inhale' | 'hold' | 'exhale') => void;
  playCompletionSound: () => void;
}

// Frequencies for each phase — lower for exhale (calming), higher for inhale (energizing)
const PHASE_FREQUENCIES: Record<'inhale' | 'hold' | 'exhale', number> = {
  inhale: 440,    // A4 — gentle, uplifting
  hold: 392,      // G4 — steady, grounding
  exhale: 349.23, // F4 — calming, releasing
};

export function useAudioFeedback(enabled: boolean): UseAudioFeedbackReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number = 0.15, volume: number = 0.08) => {
      if (!enabled) return;

      try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        // Smooth envelope to avoid clicks
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch {
        // Audio not available, silently ignore
      }
    },
    [enabled, getAudioContext]
  );

  const playPhaseSound = useCallback(
    (phase: 'inhale' | 'hold' | 'exhale') => {
      const freq = PHASE_FREQUENCIES[phase];
      playTone(freq, 0.2, 0.06);
    },
    [playTone]
  );

  const playCompletionSound = useCallback(() => {
    if (!enabled) return;
    // Clear any pending completion timer to prevent stale tones
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
    }
    // Play a gentle two-note chime
    playTone(523.25, 0.3, 0.05); // C5
    completionTimerRef.current = setTimeout(() => playTone(659.25, 0.4, 0.05), 150); // E5
  }, [enabled, playTone]);

  // Cleanup audio context and pending timers on unmount
  useEffect(() => {
    return () => {
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return { playPhaseSound, playCompletionSound };
}
