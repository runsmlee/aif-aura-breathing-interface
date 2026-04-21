import { useCallback, useEffect, useState } from 'react';
import { WEEKLY_GOAL_KEY, DEFAULT_WEEKLY_GOAL } from '../types';

interface UseWeeklyGoalReturn {
  weeklyGoal: number;
  sessionsThisWeek: number;
  goalReached: boolean;
  justReachedGoal: boolean;
  setWeeklyGoal: (goal: number) => void;
  setSessionsThisWeek: (count: number) => void;
  incrementSessions: () => void;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function loadGoal(): number {
  try {
    const raw = localStorage.getItem(WEEKLY_GOAL_KEY);
    if (raw) {
      const num = parseInt(raw, 10);
      if (num >= 1 && num <= 14) return num;
    }
  } catch {
    // Ignore
  }
  return DEFAULT_WEEKLY_GOAL;
}

function loadSessionsThisWeek(): number {
  try {
    const raw = localStorage.getItem('aura-sessions-this-week');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null && 'count' in parsed && 'weekStart' in parsed) {
        const weekStart = new Date(parsed.weekStart);
        const monday = getMonday(new Date());
        if (weekStart.getTime() === monday.getTime()) {
          return parsed.count as number;
        }
      }
    }
  } catch {
    // Ignore
  }
  return 0;
}

function saveSessionsThisWeek(count: number): void {
  try {
    const monday = getMonday(new Date());
    localStorage.setItem('aura-sessions-this-week', JSON.stringify({ count, weekStart: monday.toISOString() }));
  } catch {
    // Storage unavailable
  }
}

export function useWeeklyGoal(): UseWeeklyGoalReturn {
  const [weeklyGoal, setWeeklyGoalState] = useState<number>(loadGoal);
  const [sessionsThisWeek, setSessionsThisWeekState] = useState<number>(loadSessionsThisWeek);
  const [justReachedGoal, setJustReachedGoal] = useState(false);

  const goalReached = sessionsThisWeek >= weeklyGoal;

  const setWeeklyGoal = useCallback((goal: number) => {
    const clamped = Math.max(1, Math.min(14, goal));
    setWeeklyGoalState(clamped);
    try {
      localStorage.setItem(WEEKLY_GOAL_KEY, String(clamped));
    } catch {
      // Storage unavailable
    }
  }, []);

  const setSessionsThisWeek = useCallback((count: number) => {
    setSessionsThisWeekState(count);
    saveSessionsThisWeek(count);
  }, []);

  const incrementSessions = useCallback(() => {
    setSessionsThisWeekState((prev: number) => {
      const next = prev + 1;
      saveSessionsThisWeek(next);
      return next;
    });
  }, []);

  // Detect goal just reached
  useEffect(() => {
    if (goalReached && sessionsThisWeek === weeklyGoal && sessionsThisWeek > 0) {
      setJustReachedGoal(true);
      const timer = setTimeout(() => setJustReachedGoal(false), 3000);
      return () => clearTimeout(timer);
    }
    setJustReachedGoal(false);
  }, [goalReached, sessionsThisWeek, weeklyGoal]);

  // Reset weekly check — uses visibilitychange instead of polling for efficiency
  useEffect(() => {
    function checkWeekReset() {
      const monday = getMonday(new Date());
      try {
        const raw = localStorage.getItem('aura-sessions-this-week');
        if (raw) {
          const parsed = JSON.parse(raw);
          const weekStart = new Date(parsed.weekStart);
          if (weekStart.getTime() !== monday.getTime()) {
            setSessionsThisWeekState(0);
            saveSessionsThisWeek(0);
          }
        }
      } catch {
        // Ignore
      }
    }
    checkWeekReset();
    // Check when tab becomes visible again (e.g., user returns after midnight)
    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        checkWeekReset();
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return {
    weeklyGoal,
    sessionsThisWeek,
    goalReached,
    justReachedGoal,
    setWeeklyGoal,
    setSessionsThisWeek,
    incrementSessions,
  };
}
