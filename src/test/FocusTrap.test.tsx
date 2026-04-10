import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SessionSummary } from '../components/SessionSummary';
import type { SessionStats, BreathingPattern } from '../types';

const mockStats: SessionStats = {
  cyclesCompleted: 3,
  totalDuration: 60,
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

describe('Focus Trap (via SessionSummary)', () => {
  it('focuses the dismiss button when dialog opens', async () => {
    const onDismiss = vi.fn();

    const { rerender } = render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={false}
        onDismiss={onDismiss}
        onStartAgain={vi.fn()}
        targetDuration={0}
      />
    );

    // Make dialog visible
    rerender(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={onDismiss}
        onStartAgain={vi.fn()}
        targetDuration={0}
      />
    );

    // Wait for animation
    await screen.findByRole('dialog', { name: /session summary/i });

    // The Breathe Again button should be focused (first focusable element)
    const startAgainButton = screen.getByRole('button', { name: /start another breathing session/i });
    expect(startAgainButton).toHaveFocus();
  });

  it('allows dismissing with the focused button', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <SessionSummary
        stats={mockStats}
        pattern={mockPattern}
        isVisible={true}
        onDismiss={onDismiss}
        onStartAgain={vi.fn()}
        targetDuration={0}
      />
    );

    await screen.findByRole('dialog', { name: /session summary/i });

    await user.click(screen.getByRole('button', { name: /close session summary/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
