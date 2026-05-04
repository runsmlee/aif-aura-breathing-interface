import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SessionSummary } from '../components/SessionSummary';
import type { SessionStats, PersonalBestRecord } from '../types';

const baseStats: SessionStats = {
  cyclesCompleted: 5,
  totalDuration: 120,
  breathsPerMinute: 7.5,
};

const basePattern = {
  name: 'Box Breathing',
  description: 'Equal parts inhale, hold, exhale, hold.',
  inhale: 4,
  hold: 4,
  exhale: 4,
  holdAfterExhale: 4,
};

describe('SessionSummary with Personal Best', () => {
  it('shows personal best badge when session is a new best', () => {
    render(
      <SessionSummary
        stats={baseStats}
        pattern={basePattern}
        isVisible={true}
        onDismiss={() => {}}
        onStartAgain={() => {}}
        targetDuration={0}
        isNewBest={true}
        personalBest={null}
      />
    );

    expect(screen.getByText(/new personal best/i)).toBeInTheDocument();
  });

  it('does not show personal best badge when not a new best', () => {
    render(
      <SessionSummary
        stats={baseStats}
        pattern={basePattern}
        isVisible={true}
        onDismiss={() => {}}
        onStartAgain={() => {}}
        targetDuration={0}
        isNewBest={false}
        personalBest={null}
      />
    );

    expect(screen.queryByText(/new personal best/i)).not.toBeInTheDocument();
  });

  it('shows personal best comparison when previous best exists', () => {
    const personalBest: PersonalBestRecord = {
      cyclesCompleted: 3,
      totalDuration: 60,
      breathsPerMinute: 8.0,
      patternName: 'Box Breathing',
      recordedAt: new Date().toISOString(),
    };

    render(
      <SessionSummary
        stats={baseStats}
        pattern={basePattern}
        isVisible={true}
        onDismiss={() => {}}
        onStartAgain={() => {}}
        targetDuration={0}
        isNewBest={true}
        personalBest={personalBest}
      />
    );

    expect(screen.getByText(/previous best/i)).toBeInTheDocument();
    expect(screen.getByText(/1m 0s/)).toBeInTheDocument();
  });

  it('shows improvement percentage when beating previous best', () => {
    const personalBest: PersonalBestRecord = {
      cyclesCompleted: 3,
      totalDuration: 60,
      breathsPerMinute: 8.0,
      patternName: 'Box Breathing',
      recordedAt: new Date().toISOString(),
    };

    render(
      <SessionSummary
        stats={baseStats}
        pattern={basePattern}
        isVisible={true}
        onDismiss={() => {}}
        onStartAgain={() => {}}
        targetDuration={0}
        isNewBest={true}
        personalBest={personalBest}
      />
    );

    // 120 is 100% more than 60
    expect(screen.getByText(/100% longer/i)).toBeInTheDocument();
  });

  it('renders without personal best props (backward compatible)', () => {
    render(
      <SessionSummary
        stats={baseStats}
        pattern={basePattern}
        isVisible={true}
        onDismiss={() => {}}
        onStartAgain={() => {}}
        targetDuration={0}
      />
    );

    expect(screen.getByText('Session Complete')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // cycles
  });
});
