import { useCallback, useEffect, useState } from 'react';
import type { StreakData } from '../types';
import { STREAK_KEY } from '../types';

interface UseStreakTrackerReturn {
  streakData: StreakData;
  isNewDayStreak: boolean;
  recordSession: () => void;
  resetStreak: () => void;
}

function toLocalDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayString(): string {
  return toLocalDateStr(new Date());
}

function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toLocalDateStr(d);
}

function loadStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'currentStreak' in parsed &&
        'longestStreak' in parsed &&
        'lastSessionDate' in parsed &&
        'totalDays' in parsed
      ) {
        return parsed as StreakData;
      }
    }
  } catch {
    // Ignore
  }
  return { currentStreak: 0, longestStreak: 0, lastSessionDate: '', totalDays: 0 };
}

function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable
  }
}

export function useStreakTracker(): UseStreakTrackerReturn {
  const [streakData, setStreakData] = useState<StreakData>(loadStreakData);
  const [isNewDayStreak, setIsNewDayStreak] = useState(false);

  const recordSession = useCallback(() => {
    const today = todayString();
    const yesterday = yesterdayString();

    setStreakData((prev: StreakData) => {
      if (prev.lastSessionDate === today) {
        // Already recorded today
        setIsNewDayStreak(false);
        return prev;
      }

      let newStreak: number;
      let newTotalDays: number;
      let newIsNewDayStreak = false;

      if (prev.lastSessionDate === yesterday) {
        newStreak = prev.currentStreak + 1;
        newIsNewDayStreak = false;
      } else {
        newStreak = 1;
        newIsNewDayStreak = prev.currentStreak > 0;
      }

      newTotalDays = prev.totalDays + 1;
      const newLongest = Math.max(prev.longestStreak, newStreak);

      setIsNewDayStreak(newIsNewDayStreak);

      const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastSessionDate: today,
        totalDays: newTotalDays,
      };

      saveStreakData(updated);
      return updated;
    });
  }, []);

  const resetStreak = useCallback(() => {
    const empty: StreakData = { currentStreak: 0, longestStreak: 0, lastSessionDate: '', totalDays: 0 };
    setStreakData(empty);
    saveStreakData(empty);
    setIsNewDayStreak(false);
  }, []);

  // Sync across tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STREAK_KEY && e.newValue) {
        try {
          const parsed: StreakData = JSON.parse(e.newValue);
          setStreakData(parsed);
        } catch {
          // Ignore
        }
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { streakData, isNewDayStreak, recordSession, resetStreak };
}
