import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useWeeklyGoal } from '../hooks/useWeeklyGoal';
import { WEEKLY_GOAL_KEY } from '../types';

beforeEach(() => {
  localStorage.clear();
});

describe('useWeeklyGoal', () => {
  it('starts with default goal of 5', () => {
    const { result } = renderHook(() => useWeeklyGoal());
    expect(result.current.weeklyGoal).toBe(5);
    expect(result.current.sessionsThisWeek).toBe(0);
    expect(result.current.goalReached).toBe(false);
  });

  it('loads saved goal from localStorage', () => {
    localStorage.setItem(WEEKLY_GOAL_KEY, '7');
    const { result } = renderHook(() => useWeeklyGoal());
    expect(result.current.weeklyGoal).toBe(7);
  });

  it('clamps goal between 1 and 14', () => {
    const { result } = renderHook(() => useWeeklyGoal());
    act(() => {
      result.current.setWeeklyGoal(0);
    });
    expect(result.current.weeklyGoal).toBe(1);

    act(() => {
      result.current.setWeeklyGoal(20);
    });
    expect(result.current.weeklyGoal).toBe(14);
  });

  it('increments session count', () => {
    const { result } = renderHook(() => useWeeklyGoal());
    act(() => {
      result.current.incrementSessions();
      result.current.incrementSessions();
      result.current.incrementSessions();
    });
    expect(result.current.sessionsThisWeek).toBe(3);
  });

  it('detects goal reached', () => {
    const { result } = renderHook(() => useWeeklyGoal());
    act(() => {
      result.current.incrementSessions();
      result.current.incrementSessions();
      result.current.incrementSessions();
      result.current.incrementSessions();
      result.current.incrementSessions();
    });
    expect(result.current.goalReached).toBe(true);
    expect(result.current.sessionsThisWeek).toBe(5);
  });

  it('sets justReachedGoal when goal is met exactly', () => {
    const { result } = renderHook(() => useWeeklyGoal());
    act(() => {
      result.current.incrementSessions();
      result.current.incrementSessions();
      result.current.incrementSessions();
      result.current.incrementSessions();
      result.current.incrementSessions();
    });
    expect(result.current.justReachedGoal).toBe(true);
  });

  it('persists goal to localStorage', () => {
    const { result } = renderHook(() => useWeeklyGoal());
    act(() => {
      result.current.setWeeklyGoal(8);
    });
    expect(localStorage.getItem(WEEKLY_GOAL_KEY)).toBe('8');
  });

  it('allows setting sessions directly', () => {
    const { result } = renderHook(() => useWeeklyGoal());
    act(() => {
      result.current.setSessionsThisWeek(3);
    });
    expect(result.current.sessionsThisWeek).toBe(3);
  });
});
