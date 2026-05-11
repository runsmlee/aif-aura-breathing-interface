import { useCallback, useEffect, useRef, useState } from 'react';
import type { SessionStats } from '../types';

const PERSONAL_BEST_KEY = 'aura-personal-best';
const NEW_BEST_DISPLAY_MS = 5000;

export interface PersonalBestRecord {
  cyclesCompleted: number;
  totalDuration: number;
  breathsPerMinute: number;
  patternName: string;
  recordedAt: string;
}

interface UsePersonalBestReturn {
  personalBest: PersonalBestRecord | null;
  isNewBest: boolean;
  recordSession: (stats: SessionStats, patternName: string) => void;
  resetPersonalBest: () => void;
}

function loadPersonalBest(): PersonalBestRecord | null {
  try {
    const raw = localStorage.getItem(PERSONAL_BEST_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'totalDuration' in parsed &&
        'cyclesCompleted' in parsed
      ) {
        return parsed as PersonalBestRecord;
      }
    }
  } catch {
    // Ignore corrupt data
  }
  return null;
}

function savePersonalBest(record: PersonalBestRecord): void {
  try {
    localStorage.setItem(PERSONAL_BEST_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable
  }
}

export function usePersonalBest(): UsePersonalBestReturn {
  const [personalBest, setPersonalBest] = useState<PersonalBestRecord | null>(loadPersonalBest);
  const [isNewBest, setIsNewBest] = useState(false);
  const newBestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-clear isNewBest after display timeout
  useEffect(() => {
    if (isNewBest) {
      if (newBestTimerRef.current) clearTimeout(newBestTimerRef.current);
      newBestTimerRef.current = setTimeout(() => setIsNewBest(false), NEW_BEST_DISPLAY_MS);
    }
    return () => {
      if (newBestTimerRef.current) clearTimeout(newBestTimerRef.current);
    };
  }, [isNewBest]);

  const recordSession = useCallback((stats: SessionStats, patternName: string) => {
    setPersonalBest((prev) => {
      // First session or longer duration than previous best
      if (prev === null || stats.totalDuration > prev.totalDuration) {
        const newRecord: PersonalBestRecord = {
          cyclesCompleted: stats.cyclesCompleted,
          totalDuration: stats.totalDuration,
          breathsPerMinute: stats.breathsPerMinute,
          patternName,
          recordedAt: new Date().toISOString(),
        };
        savePersonalBest(newRecord);
        setIsNewBest(true);
        return newRecord;
      }

      setIsNewBest(false);
      return prev;
    });
  }, []);

  const resetPersonalBest = useCallback(() => {
    setPersonalBest(null);
    setIsNewBest(false);
    try {
      localStorage.removeItem(PERSONAL_BEST_KEY);
    } catch {
      // Storage unavailable
    }
  }, []);

  return { personalBest, isNewBest, recordSession, resetPersonalBest };
}
