import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { usePersonalBest } from '../hooks/usePersonalBest';

describe('usePersonalBest', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null personal best when no sessions recorded', () => {
    const { result } = renderHook(() => usePersonalBest());
    expect(result.current.personalBest).toBeNull();
  });

  it('records a personal best session', () => {
    const { result } = renderHook(() => usePersonalBest());

    act(() => {
      result.current.recordSession({ cyclesCompleted: 5, totalDuration: 120, breathsPerMinute: 7.5 }, 'Box Breathing');
    });

    expect(result.current.personalBest).not.toBeNull();
    expect(result.current.personalBest?.cyclesCompleted).toBe(5);
    expect(result.current.personalBest?.totalDuration).toBe(120);
    expect(result.current.personalBest?.breathsPerMinute).toBe(7.5);
    expect(result.current.personalBest?.patternName).toBe('Box Breathing');
  });

  it('updates personal best when a longer session is recorded', () => {
    const { result } = renderHook(() => usePersonalBest());

    act(() => {
      result.current.recordSession({ cyclesCompleted: 3, totalDuration: 60, breathsPerMinute: 7.5 }, 'Box Breathing');
    });

    expect(result.current.personalBest?.totalDuration).toBe(60);

    act(() => {
      result.current.recordSession({ cyclesCompleted: 8, totalDuration: 180, breathsPerMinute: 6.0 }, '4-7-8 Relaxation');
    });

    expect(result.current.personalBest?.totalDuration).toBe(180);
    expect(result.current.personalBest?.cyclesCompleted).toBe(8);
    expect(result.current.personalBest?.patternName).toBe('4-7-8 Relaxation');
  });

  it('does not update personal best for shorter sessions', () => {
    const { result } = renderHook(() => usePersonalBest());

    act(() => {
      result.current.recordSession({ cyclesCompleted: 8, totalDuration: 180, breathsPerMinute: 6.0 }, 'Box Breathing');
    });

    act(() => {
      result.current.recordSession({ cyclesCompleted: 2, totalDuration: 30, breathsPerMinute: 8.0 }, 'Energizing Breath');
    });

    expect(result.current.personalBest?.totalDuration).toBe(180);
    expect(result.current.personalBest?.cyclesCompleted).toBe(8);
  });

  it('persists personal best to localStorage', () => {
    const { result } = renderHook(() => usePersonalBest());

    act(() => {
      result.current.recordSession({ cyclesCompleted: 5, totalDuration: 120, breathsPerMinute: 7.5 }, 'Box Breathing');
    });

    // Check localStorage was updated
    const stored = localStorage.getItem('aura-personal-best');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.totalDuration).toBe(120);
  });

  it('loads personal best from localStorage on mount', () => {
    localStorage.setItem('aura-personal-best', JSON.stringify({
      cyclesCompleted: 10,
      totalDuration: 300,
      breathsPerMinute: 6.0,
      patternName: 'Coherent Breathing',
      recordedAt: new Date().toISOString(),
    }));

    const { result } = renderHook(() => usePersonalBest());
    expect(result.current.personalBest?.totalDuration).toBe(300);
    expect(result.current.personalBest?.cyclesCompleted).toBe(10);
    expect(result.current.personalBest?.patternName).toBe('Coherent Breathing');
  });

  it('resets personal best', () => {
    const { result } = renderHook(() => usePersonalBest());

    act(() => {
      result.current.recordSession({ cyclesCompleted: 5, totalDuration: 120, breathsPerMinute: 7.5 }, 'Box Breathing');
    });

    expect(result.current.personalBest).not.toBeNull();

    act(() => {
      result.current.resetPersonalBest();
    });

    expect(result.current.personalBest).toBeNull();
    expect(localStorage.getItem('aura-personal-best')).toBeNull();
  });

  it('reports isNewBest correctly', () => {
    const { result } = renderHook(() => usePersonalBest());

    // First session is always a new best
    act(() => {
      result.current.recordSession({ cyclesCompleted: 3, totalDuration: 60, breathsPerMinute: 7.5 }, 'Box Breathing');
    });
    expect(result.current.isNewBest).toBe(true);

    // Second shorter session is not a new best
    act(() => {
      result.current.recordSession({ cyclesCompleted: 1, totalDuration: 20, breathsPerMinute: 8.0 }, 'Energizing Breath');
    });
    expect(result.current.isNewBest).toBe(false);

    // Third longer session is a new best
    act(() => {
      result.current.recordSession({ cyclesCompleted: 10, totalDuration: 300, breathsPerMinute: 6.0 }, 'Coherent Breathing');
    });
    expect(result.current.isNewBest).toBe(true);
  });
});
