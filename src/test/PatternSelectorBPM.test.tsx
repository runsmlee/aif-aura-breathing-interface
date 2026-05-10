import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PatternSelector } from '../components/PatternSelector';
import { BREATHING_PATTERNS } from '../types';

describe('PatternSelector BPM display', () => {
  it('shows BPM for Box Breathing (4-4-4-4 = 16s cycle)', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    // 60 / 16 = 3.75, rounded to 3.8
    expect(screen.getByText(/3\.8/)).toBeInTheDocument();
  });

  it('shows BPM for 4-7-8 Relaxation (4+7+8 = 19s cycle)', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[1]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    // 60 / 19 ≈ 3.16, rounded to 3.2
    expect(screen.getByText(/3\.2/)).toBeInTheDocument();
  });

  it('shows BPM for Coherent Breathing (5+5 = 10s cycle)', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[2]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    // 60 / 10 = 6.0
    expect(screen.getByText(/6\.0/)).toBeInTheDocument();
  });

  it('shows BPM for Energizing Breath (2+2 = 4s cycle)', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[3]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    // 60 / 4 = 15.0
    expect(screen.getByText(/15\.0/)).toBeInTheDocument();
  });
});
