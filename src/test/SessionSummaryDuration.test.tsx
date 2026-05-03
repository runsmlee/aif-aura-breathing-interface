import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SessionSummary } from '../components/SessionSummary';
import type { SessionStats, BreathingPattern } from '../types';

const mockPattern: BreathingPattern = {
  name: 'Box Breathing',
  description: 'Equal parts inhale, hold, exhale, hold.',
  inhale: 4,
  hold: 4,
  exhale: 4,
  holdAfterExhale: 4,
};

describe('SessionSummary duration message', () => {
  it('shows duration message for sessions over 10 minutes', () => {
    render(
      <SessionSummary
        stats={{ cyclesCompleted: 5, totalDuration: 660, breathsPerMinute: 3.8 }}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        onStartAgain={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByText('10+ minutes of mindfulness')).toBeInTheDocument();
  });

  it('shows duration message for sessions over 5 minutes', () => {
    render(
      <SessionSummary
        stats={{ cyclesCompleted: 3, totalDuration: 360, breathsPerMinute: 3.8 }}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        onStartAgain={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByText('5+ minutes of calm')).toBeInTheDocument();
  });

  it('shows duration message for sessions over 2 minutes', () => {
    render(
      <SessionSummary
        stats={{ cyclesCompleted: 2, totalDuration: 150, breathsPerMinute: 3.8 }}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        onStartAgain={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.getByText('A focused breathing break')).toBeInTheDocument();
  });

  it('does not show duration message for very short sessions', () => {
    render(
      <SessionSummary
        stats={{ cyclesCompleted: 1, totalDuration: 30, breathsPerMinute: 3.8 }}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={vi.fn()}
        onStartAgain={vi.fn()}
        targetDuration={0}
      />
    );
    expect(screen.queryByText(/minutes of/)).not.toBeInTheDocument();
    expect(screen.queryByText(/breathing break/)).not.toBeInTheDocument();
  });
});
