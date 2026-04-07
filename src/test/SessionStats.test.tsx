import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SessionStats } from '../components/SessionStats';

const baseStats = {
  cyclesCompleted: 3,
  totalDuration: 125,
  breathsPerMinute: 3.8,
};

describe('SessionStats', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(
      <SessionStats stats={baseStats} isVisible={false} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders stats when visible', () => {
    render(<SessionStats stats={baseStats} isVisible={true} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2:05')).toBeInTheDocument();
    expect(screen.getByText('3.8')).toBeInTheDocument();
  });

  it('renders stat labels', () => {
    render(<SessionStats stats={baseStats} isVisible={true} />);
    expect(screen.getByText('Cycles')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('BPM')).toBeInTheDocument();
  });

  it('has accessible status role', () => {
    render(<SessionStats stats={baseStats} isVisible={true} />);
    expect(screen.getByRole('status', { name: /session statistics/i })).toBeInTheDocument();
  });

  it('formats zero duration correctly', () => {
    render(
      <SessionStats
        stats={{ ...baseStats, totalDuration: 0 }}
        isVisible={true}
      />
    );
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('formats duration with seconds only', () => {
    render(
      <SessionStats
        stats={{ ...baseStats, totalDuration: 45 }}
        isVisible={true}
      />
    );
    expect(screen.getByText('0:45')).toBeInTheDocument();
  });
});
