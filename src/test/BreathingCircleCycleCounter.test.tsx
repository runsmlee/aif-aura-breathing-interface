import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BreathingCircle } from '../components/BreathingCircle';

describe('BreathingCircle cycle counter', () => {
  it('shows cycle count during active session when cyclesCompleted > 0', () => {
    render(
      <BreathingCircle
        phase="inhale"
        progress={0.5}
        secondsRemaining={2}
        cyclesCompleted={3}
      />
    );
    expect(screen.getByText('cycle 3')).toBeInTheDocument();
  });

  it('does not show cycle count when cyclesCompleted is 0', () => {
    const { container } = render(
      <BreathingCircle
        phase="inhale"
        progress={0.5}
        secondsRemaining={2}
        cyclesCompleted={0}
      />
    );
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).not.toContain('cycle 0');
  });

  it('does not show cycle count in idle state', () => {
    render(
      <BreathingCircle
        phase="idle"
        progress={0}
        secondsRemaining={0}
        cyclesCompleted={5}
      />
    );
    expect(screen.queryByText(/cycle \d+/)).not.toBeInTheDocument();
  });

  it('defaults cyclesCompleted to 0 when not provided', () => {
    render(
      <BreathingCircle
        phase="inhale"
        progress={0.5}
        secondsRemaining={2}
      />
    );
    expect(screen.queryByText(/cycle/)).not.toBeInTheDocument();
  });
});
