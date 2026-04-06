import { useCallback, useEffect, useRef, useState } from 'react';
import type { BreathingPattern, BreathingPhase, SessionStats } from '../types';

interface UseBreathingEngineReturn {
  phase: BreathingPhase;
  secondsRemaining: number;
  progress: number;
  isActive: boolean;
  cyclesCompleted: number;
  stats: SessionStats;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setPattern: (pattern: BreathingPattern) => void;
  currentPattern: BreathingPattern;
}

interface PhaseConfig {
  phase: BreathingPhase;
  duration: number;
}

const DEFAULT_PATTERN: BreathingPattern = {
  name: 'Box Breathing',
  description: 'Equal parts inhale, hold, exhale, hold.',
  inhale: 4,
  hold: 4,
  exhale: 4,
  holdAfterExhale: 4,
};

function buildPhaseSequence(pattern: BreathingPattern): PhaseConfig[] {
  const phases: PhaseConfig[] = [];

  if (pattern.inhale > 0) {
    phases.push({ phase: 'inhale', duration: pattern.inhale });
  }
  if (pattern.hold > 0) {
    phases.push({ phase: 'hold', duration: pattern.hold });
  }
  if (pattern.exhale > 0) {
    phases.push({ phase: 'exhale', duration: pattern.exhale });
  }
  if (pattern.holdAfterExhale > 0) {
    phases.push({ phase: 'hold', duration: pattern.holdAfterExhale });
  }

  return phases.length > 0 ? phases : [{ phase: 'inhale', duration: 4 }];
}

export function useBreathingEngine(): UseBreathingEngineReturn {
  const [currentPattern, setCurrentPattern] = useState<BreathingPattern>(DEFAULT_PATTERN);
  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const phaseIndexRef = useRef(0);
  const phaseElapsedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseSequenceRef = useRef<PhaseConfig[]>(buildPhaseSequence(DEFAULT_PATTERN));

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advancePhase = useCallback(() => {
    const sequence = phaseSequenceRef.current;
    phaseIndexRef.current = (phaseIndexRef.current + 1) % sequence.length;

    if (phaseIndexRef.current === 0) {
      setCyclesCompleted((prev) => prev + 1);
    }

    const nextPhaseConfig = sequence[phaseIndexRef.current];
    setPhase(nextPhaseConfig.phase);
    setSecondsRemaining(nextPhaseConfig.duration);
    setProgress(0);
    phaseElapsedRef.current = 0;
  }, []);

  const start = useCallback(() => {
    phaseSequenceRef.current = buildPhaseSequence(currentPattern);
    phaseIndexRef.current = 0;
    phaseElapsedRef.current = 0;

    const firstPhase = phaseSequenceRef.current[0];
    setPhase(firstPhase.phase);
    setSecondsRemaining(firstPhase.duration);
    setProgress(0);
    setIsActive(true);
    setCyclesCompleted(0);
    setSessionStartTime(Date.now());

    clearTimer();
    intervalRef.current = setInterval(() => {
      phaseElapsedRef.current += 0.1;
      const currentPhaseConfig = phaseSequenceRef.current[phaseIndexRef.current];
      const durationSeconds = currentPhaseConfig.duration;
      const elapsed = phaseElapsedRef.current;

      if (elapsed >= durationSeconds) {
        advancePhase();
      } else {
        setProgress(Math.min(elapsed / durationSeconds, 1));
        setSecondsRemaining(Math.ceil(durationSeconds - elapsed));
      }
    }, 100);
  }, [currentPattern, clearTimer, advancePhase]);

  const pause = useCallback(() => {
    clearTimer();
    setIsActive(false);
    setPhase('idle');
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsActive(false);
    setPhase('idle');
    setSecondsRemaining(0);
    setProgress(0);
    setCyclesCompleted(0);
    setSessionStartTime(null);
    phaseIndexRef.current = 0;
    phaseElapsedRef.current = 0;
  }, [clearTimer]);

  const handleSetPattern = useCallback(
    (pattern: BreathingPattern) => {
      const wasActive = isActive;
      reset();
      setCurrentPattern(pattern);
      phaseSequenceRef.current = buildPhaseSequence(pattern);
      if (wasActive) {
        start();
      }
    },
    [reset, isActive, start]
  );

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const totalCycleDuration = phaseSequenceRef.current.reduce(
    (sum, p) => sum + p.duration,
    0
  );

  const stats: SessionStats = {
    cyclesCompleted,
    totalDuration: sessionStartTime
      ? Math.floor((Date.now() - sessionStartTime) / 1000)
      : 0,
    breathsPerMinute:
      totalCycleDuration > 0 ? Math.round((60 / totalCycleDuration) * 10) / 10 : 0,
  };

  return {
    phase,
    secondsRemaining,
    progress,
    isActive,
    cyclesCompleted,
    stats,
    start,
    pause,
    reset,
    setPattern: handleSetPattern,
    currentPattern,
  };
}
