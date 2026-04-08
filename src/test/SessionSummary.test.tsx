import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SessionSummary } from '../components/SessionSummary';
import type { SessionStats, BreathingPattern } from '../types';

const mockStats: SessionStats = {
  cyclesCompleted: 5,
  totalDuration: 180,
  breathsPerMinute: 3.8,
};

const mockPattern: BreathingPattern = {
  name: 'Box Breathing',
  description: 'Equal parts inhale, hold, exhale, hold.',
  inhale: 4,
  hold: 4,
  exhale: 4,
  holdAfterExhale: 4,
};

describe('SessionSummary', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={false}
        onDismiss={vi.fn()}
        targetDuration={0}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders session complete heading when visible', () => {
    render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByText('Session Complete')).toBeInTheDocument();
  });

  it('renders stats values', () => {
    render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3m 0s')).toBeInTheDocument();
    expect(screen.getByText('3.8')).toBeInTheDocument();
  });

  it('renders stat labels', () => {
    render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByText('Cycles')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('BPM')).toBeInTheDocument();
  });

  it('renders pattern name', () => {
    render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByText(/Pattern: Box Breathing/)).toBeInTheDocument();
  });

  it('calls onDismiss when Continue button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={onDismiss}
        targetDuration={0}
      />
    );

    await user.click(screen.getByRole('button', { name: /close session summary/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has accessible dialog role', () => {
    render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByRole('dialog', { name: /session summary/i })).toBeInTheDocument();
  });

  it('shows motivational message based on cycles', () => {
    render(
      <SessionSummary
        stats={{ ...mockStats, cyclesCompleted: 7 }}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByText('Impressive dedication.')).toBeInTheDocument();
  });

  it('shows target reached message when target was met', () => {
    render(
      <SessionSummary
        stats={{ ...mockStats, totalDuration: 180 }}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        targetDuration={3} // 3 min target, 180s actual
      />
    );
    expect(screen.getByText(/Target reached/)).toBeInTheDocument();
  });

  it('does not show target reached when no target set', () => {
    render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.queryByText(/Target reached/)).not.toBeInTheDocument();
  });
});
