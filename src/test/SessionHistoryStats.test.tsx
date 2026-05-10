import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SessionHistory } from '../components/SessionHistory';
import type { SessionRecord } from '../types';

const multiSessionHistory: SessionRecord[] = [
  {
    date: new Date().toISOString(),
    pattern: 'Box Breathing',
    cycles: 5,
    duration: 180,
    targetDuration: 5,
  },
  {
    date: new Date(Date.now() - 86400000).toISOString(),
    pattern: '4-7-8 Relaxation',
    cycles: 3,
    duration: 95,
    targetDuration: 0,
  },
  {
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    pattern: 'Coherent Breathing',
    cycles: 4,
    duration: 120,
    targetDuration: 0,
  },
];

describe('SessionHistory total practice stats', () => {
  it('shows total session count when expanded', async () => {
    const user = userEvent.setup();
    render(
      <SessionHistory history={multiSessionHistory} onClear={vi.fn()} />
    );

    await user.click(screen.getByRole('button', { name: /history/i }));

    const summary = screen.getByTestId('session-stats-summary');
    expect(summary.textContent).toContain('3 sessions');
  });

  it('shows total practice time when expanded', async () => {
    const user = userEvent.setup();
    render(
      <SessionHistory history={multiSessionHistory} onClear={vi.fn()} />
    );

    await user.click(screen.getByRole('button', { name: /history/i }));

    // 180 + 95 + 120 = 395s = 6m 35s
    const summary = screen.getByTestId('session-stats-summary');
    expect(summary.textContent).toContain('6m 35s total');
  });

  it('shows singular "session" for a single session', async () => {
    const singleHistory: SessionRecord[] = [
      {
        date: new Date().toISOString(),
        pattern: 'Box Breathing',
        cycles: 2,
        duration: 60,
        targetDuration: 0,
      },
    ];
    const user = userEvent.setup();
    render(
      <SessionHistory history={singleHistory} onClear={vi.fn()} />
    );

    await user.click(screen.getByRole('button', { name: /history/i }));

    const summary = screen.getByTestId('session-stats-summary');
    expect(summary.textContent).toContain('1 session');
  });

  it('does not show total stats when collapsed', () => {
    render(
      <SessionHistory history={multiSessionHistory} onClear={vi.fn()} />
    );

    expect(screen.queryByTestId('session-stats-summary')).not.toBeInTheDocument();
  });
});
