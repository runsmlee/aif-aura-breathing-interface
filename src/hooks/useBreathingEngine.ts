import { useCallback, useEffect, useRef, useState } from 'react';
import type { BreathingPattern, BreathingPhase, SessionStats, SessionDuration, SessionRecord } from '../types';
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
  targetDuration: SessionDuration;
  setTargetDuration: (duration: SessionDuration) => void;
  timeRemaining: number;
  sessionHistory: readonly SessionRecord[];
  clearHistory: () => void;
}

interface PhaseConfig {
  phase: BreathingPhase;
  duration: number;
}

const PATTERN_KEY = 'aura-pattern-preference';
const DURATION_KEY = 'aura-duration-preference';
const HISTORY_KEY = 'aura-session-history';

function loadFromStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveToStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable
  }
}

function loadHistory(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as SessionRecord[];
    }
  } catch {
    // Ignore
  }
  return [];
}

function saveHistory(records: SessionRecord[]): void {
  try {
    // Keep only last 50 sessions
    const trimmed = records.slice(-50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage unavailable
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
  const savedPatternName = useRef<string | null>(loadFromStorage(PATTERN_KEY));
  const savedDuration = useRef<SessionDuration>(
    ((): SessionDuration => {
      const val = loadFromStorage(DURATION_KEY);
      if (val === null) return 0;
      const num = parseInt(val, 10);
      if ([0, 2, 5, 10, 15, 20].includes(num)) return num as SessionDuration;
      return 0;
    })()
  );

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
  const [targetDuration, setTargetDurationState] = useState<SessionDuration>(savedDuration.current);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>(() => loadHistory());

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

  const recordSession = useCallback((
    cycles: number,
    totalSeconds: number,
    patternName: string,
    target: SessionDuration,
  ) => {
    if (cycles === 0) return;
    const record: SessionRecord = {
      date: new Date().toISOString(),
      pattern: patternName,
      cycles,
      duration: totalSeconds,
      targetDuration: target,
    };
    setSessionHistory((prev) => {
      const next = [...prev, record];
      saveHistory(next);
      return next;
    });
  }, []);

  const advancePhase = useCallback(() => {
    const sequence = phaseSequenceRef.current;
    phaseIndexRef.current = (phaseIndexRef.current + 1) % sequence.length;

    if (phaseIndexRef.current === 0) {
      setCyclesCompleted((prev: number) => prev + 1);
      setTotalCyclesEverCompleted((prev: number) => prev + 1);
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

    const now = Date.now();
    setSessionStartTime(now);

    // Set time remaining based on target duration
    if (savedDuration.current > 0) {
      setTimeRemaining(savedDuration.current * 60);
    } else {
      setTimeRemaining(0);
    }

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

      // Update time remaining for target duration
      setTimeRemaining((prev: number) => {
        if (prev <= 0) return 0;
        const nextVal = Math.max(0, prev - 0.1);
        return Math.round(nextVal * 10) / 10;
      });
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
    setTimeRemaining(0);
    phaseIndexRef.current = 0;
    phaseElapsedRef.current = 0;
  }, [clearTimer]);

  const setTargetDuration = useCallback((duration: SessionDuration) => {
    setTargetDurationState(duration);
    savedDuration.current = duration;
    saveToStorage(DURATION_KEY, String(duration));
  }, []);

  const clearHistory = useCallback(() => {
    setSessionHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ }
  }, []);

  const handleSetPattern = useCallback(
    (pattern: BreathingPattern) => {
      const wasActive = isActive;
      reset();
      setCurrentPattern(pattern);
      phaseSequenceRef.current = buildPhaseSequence(pattern);
      saveToStorage(PATTERN_KEY, pattern.name);
      if (wasActive) {
        start();
      }
    },
    [reset, isActive, start]
  );

  // Auto-stop when target duration is reached
  useEffect(() => {
    if (isActive && targetDuration > 0 && timeRemaining <= 0 && sessionStartTime !== null) {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      recordSession(cyclesCompleted, elapsed, currentPattern.name, targetDuration);
      pause();
    }
  }, [isActive, targetDuration, timeRemaining, sessionStartTime, cyclesCompleted, currentPattern, pause, recordSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const totalCycleDuration = phaseSequenceRef.current.reduce(
    (sum: number, p: PhaseConfig) => sum + p.duration,
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
    targetDuration,
    setTargetDuration,
    timeRemaining: Math.ceil(timeRemaining),
    sessionHistory,
    clearHistory,
  };
}
