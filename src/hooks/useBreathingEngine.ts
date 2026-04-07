import { useCallback, useEffect, useRef, useState } from 'react';
import type { BreathingPattern, BreathingPhase, SessionStats } from '../types';
import { BREATHING_PATTERNS } from '../types';

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
  totalCyclesEverCompleted: number;
}

interface PhaseConfig {
  phase: BreathingPhase;
  duration: number;
}

const STORAGE_KEY = 'aura-pattern-preference';

function loadPatternPreference(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function savePatternPreference(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    // Storage unavailable, silently ignore
  }
}

const DEFAULT_PATTERN: BreathingPattern = {
  name: 'Box Breathing',
  description: 'Equal parts inhale, hold, exhale, hold. Used by Navy SEALs for calm focus.',
  inhale: 4,
  hold: 4,
  exhale: 4,
  holdAfterExhale: 4,
};

function findPatternByName(name: string): BreathingPattern {
  return BREATHING_PATTERNS.find((p) => p.name === name) ?? DEFAULT_PATTERN;
}

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
  // Initialize from localStorage preference
  const savedPatternName = useRef<string | null>(loadPatternPreference());
  const [currentPattern, setCurrentPattern] = useState<BreathingPattern>(() => {
    if (savedPatternName.current) {
      return findPatternByName(savedPatternName.current);
    }
    return DEFAULT_PATTERN;
  });

  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalCyclesEverCompleted, setTotalCyclesEverCompleted] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const phaseIndexRef = useRef(0);
  const phaseElapsedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseSequenceRef = useRef<PhaseConfig[]>(
    buildPhaseSequence(
      savedPatternName.current
        ? findPatternByName(savedPatternName.current)
        : DEFAULT_PATTERN
    )
  );

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
      setTotalCyclesEverCompleted((prev) => prev + 1);
    }

    const nextPhaseConfig = sequence[phaseIndexRef.current];
    setPhase(nextPhaseConfig.phase);
    setSecondsRemaining(nextPhaseConfig.duration);
    setProgress(0);
    phaseElapsedRef.current = 0;
  }, []);

  const start = useCallback(() => {
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
  }, [clearTimer, advancePhase]);

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
      savePatternPreference(pattern.name);
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
    totalCyclesEverCompleted,
  };
}
