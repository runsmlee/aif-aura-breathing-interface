import { describe, it, expect } from 'vitest';
import { formatPatternTiming } from '../utils/format';

describe('formatPatternTiming', () => {
  it('formats Box Breathing pattern correctly', () => {
    const result = formatPatternTiming({ inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 });
    expect(result).toBe('4 · 4 · 4 · 4');
  });

  it('formats 4-7-8 pattern correctly', () => {
    const result = formatPatternTiming({ inhale: 4, hold: 7, exhale: 8, holdAfterExhale: 0 });
    expect(result).toBe('4 · 7 · 8');
  });

  it('formats Coherent Breathing pattern correctly', () => {
    const result = formatPatternTiming({ inhale: 5, hold: 0, exhale: 5, holdAfterExhale: 0 });
    expect(result).toBe('5 · 5');
  });

  it('formats Energizing Breath pattern correctly', () => {
    const result = formatPatternTiming({ inhale: 2, hold: 0, exhale: 2, holdAfterExhale: 0 });
    expect(result).toBe('2 · 2');
  });

  it('formats custom pattern with all phases', () => {
    const result = formatPatternTiming({ inhale: 3, hold: 2, exhale: 4, holdAfterExhale: 1 });
    expect(result).toBe('3 · 2 · 4 · 1');
  });
});
