import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DurationSelector } from '../components/DurationSelector';

describe('DurationSelector - Session Progress Bar', () => {
  it('renders a progress bar when session is active with a timed duration', () => {
    render(
      <DurationSelector
        targetDuration={5}
        onSelect={vi.fn()}
        disabled={true}
        timeRemaining={180}
      />
    );
    // 5 min = 300s target, 180s remaining = 120s elapsed = 40% done
    const progressBar = screen.getByRole('progressbar', { name: /session progress/i });
    expect(progressBar).toBeInTheDocument();
  });

  it('progress bar reflects elapsed time correctly', () => {
    render(
      <DurationSelector
        targetDuration={5}
        onSelect={vi.fn()}
        disabled={true}
        timeRemaining={150}
      />
    );
    // 5 min = 300s, remaining = 150s, elapsed = 150s = 50%
    const progressBar = screen.getByRole('progressbar', { name: /session progress/i });
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('does not render progress bar for free (untimed) sessions', () => {
    render(
      <DurationSelector
        targetDuration={0}
        onSelect={vi.fn()}
        disabled={true}
        timeRemaining={0}
      />
    );
    expect(screen.queryByRole('progressbar', { name: /session progress/i })).not.toBeInTheDocument();
  });

  it('does not render progress bar when timeRemaining is 0 but target is set', () => {
    render(
      <DurationSelector
        targetDuration={5}
        onSelect={vi.fn()}
        disabled={false}
        timeRemaining={0}
      />
    );
    expect(screen.queryByRole('progressbar', { name: /session progress/i })).not.toBeInTheDocument();
  });
});
