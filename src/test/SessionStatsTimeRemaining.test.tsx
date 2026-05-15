import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SessionStats } from '../components/SessionStats';

const baseStats = {
  cyclesCompleted: 3,
  totalDuration: 125,
  breathsPerMinute: 3.8,
};

describe('SessionStats time remaining display', () => {
  it('shows time remaining when targetDuration and timeRemaining are provided', () => {
    render(
      <SessionStats
        stats={baseStats}
        isVisible={true}
        timeRemaining={175}
        targetDuration={5}
      />
    );
    expect(screen.getByText('2:55')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();
  });

  it('shows duration label when no target duration is set', () => {
    render(
      <SessionStats
        stats={baseStats}
        isVisible={true}
        timeRemaining={0}
        targetDuration={0}
      />
    );
    expect(screen.getByText('2:05')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  it('shows duration when timeRemaining is 0 but targetDuration is set', () => {
    render(
      <SessionStats
        stats={baseStats}
        isVisible={true}
        timeRemaining={0}
        targetDuration={5}
      />
    );
    expect(screen.getByText('2:05')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  it('is backward compatible — works with just stats and isVisible', () => {
    render(<SessionStats stats={baseStats} isVisible={true} />);
    expect(screen.getByText('2:05')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  it('shows remaining for 10-minute session with 5 minutes elapsed', () => {
    render(
      <SessionStats
        stats={baseStats}
        isVisible={true}
        timeRemaining={300}
        targetDuration={10}
      />
    );
    expect(screen.getByText('5:00')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();
  });
});
