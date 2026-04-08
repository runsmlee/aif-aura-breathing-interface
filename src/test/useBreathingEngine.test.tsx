import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useBreathingEngine } from '../hooks/useBreathingEngine';

describe('useBreathingEngine', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useBreathingEngine());
    expect(result.current.phase).toBe('idle');
    expect(result.current.isActive).toBe(false);
    expect(result.current.cyclesCompleted).toBe(0);
  });

  it('transitions to active state on start', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.phase).toBe('inhale');
  });

  it('returns to idle on pause', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.phase).toBe('idle');
  });

  it('clears all state on reset', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.start();
    });

    // Advance time
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.phase).toBe('idle');
    expect(result.current.cyclesCompleted).toBe(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.secondsRemaining).toBe(0);
  });

  it('progresses through phases over time', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.start();
    });

    // Box breathing: 4s inhale, 4s hold, 4s exhale, 4s hold
    // After 2 seconds (20 ticks of 100ms)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.phase).toBe('inhale');
    expect(result.current.progress).toBeCloseTo(0.5, 1);

    // After 4 seconds — should transition to hold
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.phase).toBe('hold');
  });

  it('counts completed cycles', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.start();
    });

    // Box breathing full cycle = 16s
    act(() => {
      vi.advanceTimersByTime(16000);
    });

    expect(result.current.cyclesCompleted).toBe(1);
  });

  it('changes pattern and persists preference', () => {
    const { result } = renderHook(() => useBreathingEngine());

    const newPattern = {
      name: 'Coherent Breathing',
      description: 'Gentle 5-second cycle to balance your nervous system.',
      inhale: 5,
      hold: 0,
      exhale: 5,
      holdAfterExhale: 0,
    };

    act(() => {
      result.current.setPattern(newPattern);
    });

    expect(result.current.currentPattern.name).toBe('Coherent Breathing');

    // Verify localStorage was called
    expect(localStorage.getItem('aura-pattern-preference')).toBe('Coherent Breathing');
  });

  it('restarts session when pattern changes during active session', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);

    const newPattern = {
      name: 'Energizing Breath',
      description: 'Quick cycles to boost alertness and energy.',
      inhale: 2,
      hold: 0,
      exhale: 2,
      holdAfterExhale: 0,
    };

    act(() => {
      result.current.setPattern(newPattern);
    });

    // Should still be active with the new pattern
    expect(result.current.isActive).toBe(true);
    expect(result.current.currentPattern.name).toBe('Energizing Breath');
  });

  it('computes stats correctly', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.start();
    });

    // Advance 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Stats should be reasonable
    expect(result.current.stats.totalDuration).toBeGreaterThanOrEqual(9);
    expect(result.current.stats.breathsPerMinute).toBeGreaterThan(0);
  });

  it('initializes with default target duration of 0 (free)', () => {
    const { result } = renderHook(() => useBreathingEngine());
    expect(result.current.targetDuration).toBe(0);
  });

  it('sets target duration and persists it', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.setTargetDuration(5);
    });

    expect(result.current.targetDuration).toBe(5);
    expect(localStorage.getItem('aura-duration-preference')).toBe('5');
  });

  it('shows time remaining when target is set and active', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.setTargetDuration(2);
    });

    act(() => {
      result.current.start();
    });

    // 2 min = 120 seconds remaining
    expect(result.current.timeRemaining).toBe(120);
  });

  it('decrements time remaining during session', () => {
    const { result } = renderHook(() => useBreathingEngine());

    act(() => {
      result.current.setTargetDuration(2);
    });

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timeRemaining).toBeLessThan(120);
    expect(result.current.timeRemaining).toBeGreaterThan(0);
  });

  it('has empty session history initially', () => {
    const { result } = renderHook(() => useBreathingEngine());
    expect(result.current.sessionHistory).toEqual([]);
  });

  it('clears history', () => {
    const { result } = renderHook(() => useBreathingEngine());
    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.sessionHistory).toEqual([]);
  });
});
