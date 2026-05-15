import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BreathingCircle } from '../components/BreathingCircle';

describe('BreathingCircle pattern timing preview', () => {
  it('shows pattern timing in idle state when provided', () => {
    render(
      <BreathingCircle
        phase="idle"
        progress={0}
        secondsRemaining={0}
        patternTiming="4 · 4 · 4 · 4"
      />
    );
    expect(screen.getByText('4 · 4 · 4 · 4')).toBeInTheDocument();
  });

  it('does not show pattern timing during active session', () => {
    render(
      <BreathingCircle
        phase="inhale"
        progress={0.5}
        secondsRemaining={2}
        patternTiming="4 · 4 · 4 · 4"
      />
    );
    expect(screen.queryByText('4 · 4 · 4 · 4')).not.toBeInTheDocument();
  });

  it('does not show pattern timing when not provided', () => {
    render(
      <BreathingCircle
        phase="idle"
        progress={0}
        secondsRemaining={0}
      />
    );
    // Only "Ready" text should be visible, no timing
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
  });

  it('shows shorter pattern timing correctly', () => {
    render(
      <BreathingCircle
        phase="idle"
        progress={0}
        secondsRemaining={0}
        patternTiming="2 · 2"
      />
    );
    expect(screen.getByText('2 · 2')).toBeInTheDocument();
  });
});
