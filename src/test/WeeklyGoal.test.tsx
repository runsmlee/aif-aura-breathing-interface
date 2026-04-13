import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeeklyGoal } from '../components/WeeklyGoal';

beforeEach(() => {
  localStorage.clear();
});

describe('WeeklyGoal', () => {
  it('renders the weekly goal card', () => {
    render(
      <WeeklyGoal
        weeklyGoal={5}
        sessionsThisWeek={3}
        goalReached={false}
        justReachedGoal={false}
        onSetGoal={vi.fn()}
      />
    );
    expect(screen.getByText(/3 of 5 this week/i)).toBeInTheDocument();
  });

  it('shows goal reached celebration when goal is met', () => {
    render(
      <WeeklyGoal
        weeklyGoal={5}
        sessionsThisWeek={5}
        goalReached={true}
        justReachedGoal={true}
        onSetGoal={vi.fn()}
      />
    );
    expect(screen.getByText(/goal reached/i)).toBeInTheDocument();
  });

  it('renders a progress bar', () => {
    render(
      <WeeklyGoal
        weeklyGoal={5}
        sessionsThisWeek={3}
        goalReached={false}
        justReachedGoal={false}
        onSetGoal={vi.fn()}
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5');
  });

  it('shows goal adjustment controls', () => {
    render(
      <WeeklyGoal
        weeklyGoal={5}
        sessionsThisWeek={3}
        goalReached={false}
        justReachedGoal={false}
        onSetGoal={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /decrease weekly goal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increase weekly goal/i })).toBeInTheDocument();
  });

  it('calls onSetGoal when goal is changed', async () => {
    const user = userEvent.setup();
    const onSetGoal = vi.fn();
    render(
      <WeeklyGoal
        weeklyGoal={5}
        sessionsThisWeek={3}
        goalReached={false}
        justReachedGoal={false}
        onSetGoal={onSetGoal}
      />
    );

    await user.click(screen.getByRole('button', { name: /increase weekly goal/i }));
    expect(onSetGoal).toHaveBeenCalledWith(6);
  });
});
