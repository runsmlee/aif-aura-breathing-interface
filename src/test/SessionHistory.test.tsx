import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SessionHistory } from '../components/SessionHistory';
import type { SessionRecord } from '../types';

const mockHistory: SessionRecord[] = [
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
];

describe('SessionHistory', () => {
  it('renders nothing when history is empty', () => {
    const { container } = render(
      <SessionHistory history={[]} onClear={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the history toggle button when history exists', () => {
    render(
      <SessionHistory history={mockHistory} onClear={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
  });

  it('shows history count', () => {
    render(
      <SessionHistory history={mockHistory} onClear={vi.fn()} />
    );
    expect(screen.getByText('(2)')).toBeInTheDocument();
  });

  it('expands to show session details on click', async () => {
    const user = userEvent.setup();
    render(
      <SessionHistory history={mockHistory} onClear={vi.fn()} />
    );

    const button = screen.getByRole('button', { name: /history/i });
    await user.click(button);

    expect(screen.getByRole('list', { name: /recent sessions/i })).toBeInTheDocument();
  });

  it('shows clear history button when expanded', async () => {
    const user = userEvent.setup();
    render(
      <SessionHistory history={mockHistory} onClear={vi.fn()} />
    );

    const button = screen.getByRole('button', { name: /history/i });
    await user.click(button);

    expect(screen.getByRole('button', { name: /clear session history/i })).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(
      <SessionHistory history={mockHistory} onClear={onClear} />
    );

    const button = screen.getByRole('button', { name: /history/i });
    await user.click(button);

    const clearButton = screen.getByRole('button', { name: /clear session history/i });
    await user.click(clearButton);

    expect(onClear).toHaveBeenCalledOnce();
  });

  it('has accessible aria-expanded attribute', () => {
    render(
      <SessionHistory history={mockHistory} onClear={vi.fn()} />
    );
    const button = screen.getByRole('button', { name: /history/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows streak when there are consecutive days', () => {
    const todayHistory: SessionRecord[] = [
      {
        date: new Date().toISOString(),
        pattern: 'Box Breathing',
        cycles: 3,
        duration: 120,
        targetDuration: 0,
      },
    ];
    render(
      <SessionHistory history={todayHistory} onClear={vi.fn()} />
    );
    // Should show "1 day streak"
    expect(screen.getByText(/1 day streak/i)).toBeInTheDocument();
  });
});
