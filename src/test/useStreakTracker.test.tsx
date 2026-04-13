import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useStreakTracker } from '../hooks/useStreakTracker';
import { STREAK_KEY } from '../types';

beforeEach(() => {
  localStorage.clear();
});

describe('useStreakTracker', () => {
  it('starts with zero streak when no data exists', () => {
    const { result } = renderHook(() => useStreakTracker());
    expect(result.current.streakData.currentStreak).toBe(0);
    expect(result.current.streakData.longestStreak).toBe(0);
    expect(result.current.streakData.totalDays).toBe(0);
  });

  it('starts a streak on first session', () => {
    const { result } = renderHook(() => useStreakTracker());
    act(() => {
      result.current.recordSession();
    });
    expect(result.current.streakData.currentStreak).toBe(1);
    expect(result.current.streakData.longestStreak).toBe(1);
    expect(result.current.streakData.totalDays).toBe(1);
    expect(result.current.streakData.lastSessionDate).toBe(new Date().toISOString().slice(0, 10));
  });

  it('does not increment streak on same day', () => {
    const { result } = renderHook(() => useStreakTracker());
    act(() => {
      result.current.recordSession();
      result.current.recordSession();
    });
    expect(result.current.streakData.currentStreak).toBe(1);
    expect(result.current.streakData.totalDays).toBe(1);
  });

  it('increments streak on consecutive day', () => {
    // Record a session for "yesterday"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const streakData = {
      currentStreak: 3,
      longestStreak: 5,
      lastSessionDate: yesterday.toISOString().slice(0, 10),
      totalDays: 3,
    };
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));

    const { result: result2 } = renderHook(() => useStreakTracker());
    expect(result2.current.streakData.currentStreak).toBe(3);

    act(() => {
      result2.current.recordSession();
    });
    expect(result2.current.streakData.currentStreak).toBe(4);
  });

  it('resets streak when gap > 1 day', () => {
    // Set last session to 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const streakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastSessionDate: threeDaysAgo.toISOString().slice(0, 10),
      totalDays: 5,
    };
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));

    const { result: result2 } = renderHook(() => useStreakTracker());
    expect(result2.current.streakData.currentStreak).toBe(5); // loaded from storage

    act(() => {
      result2.current.recordSession();
    });
    expect(result2.current.streakData.currentStreak).toBe(1);
    expect(result2.current.streakData.longestStreak).toBe(5); // preserved
  });

  it('updates longestStreak when current exceeds it', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const streakData = {
      currentStreak: 4,
      longestStreak: 4,
      lastSessionDate: yesterday.toISOString().slice(0, 10),
      totalDays: 4,
    };
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));

    const { result: result2 } = renderHook(() => useStreakTracker());
    act(() => {
      result2.current.recordSession();
    });
    expect(result2.current.streakData.longestStreak).toBe(5);
  });

  it('resets streak data when resetStreak is called', () => {
    const { result } = renderHook(() => useStreakTracker());
    act(() => {
      result.current.recordSession();
      result.current.recordSession();
    });
    expect(result.current.streakData.currentStreak).toBe(1);

    act(() => {
      result.current.resetStreak();
    });
    expect(result.current.streakData.currentStreak).toBe(0);
    expect(result.current.streakData.longestStreak).toBe(0);
    expect(result.current.streakData.totalDays).toBe(0);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useStreakTracker());
    act(() => {
      result.current.recordSession();
    });

    // Load fresh
    const { result: result2 } = renderHook(() => useStreakTracker());
    expect(result2.current.streakData.currentStreak).toBe(1);
    expect(result2.current.streakData.lastSessionDate).toBe(new Date().toISOString().slice(0, 10));
  });

  it('sets isNewDayStreak when streak was broken and restarted', () => {
    // Had a streak going, broke it
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const streakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastSessionDate: threeDaysAgo.toISOString().slice(0, 10),
      totalDays: 5,
    };
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));

    const { result: result2 } = renderHook(() => useStreakTracker());
    act(() => {
      result2.current.recordSession();
    });
    expect(result2.current.isNewDayStreak).toBe(true);
  });

  it('does not set isNewDayStreak on first ever session', () => {
    const { result } = renderHook(() => useStreakTracker());
    act(() => {
      result.current.recordSession();
    });
    expect(result.current.isNewDayStreak).toBe(false);
  });
});
