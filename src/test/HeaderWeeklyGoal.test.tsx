import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../components/Header';

const baseProps = {
  soundEnabled: true,
  onToggleSound: vi.fn(),
};

describe('Header - Weekly Goal Mini Indicator', () => {
  it('renders weekly goal progress when weeklyGoalData is provided', () => {
    render(
      <Header
        {...baseProps}
        weeklyGoalData={{ sessionsThisWeek: 3, weeklyGoal: 5 }}
      />
    );
    expect(screen.getByText('3/5')).toBeInTheDocument();
  });

  it('does not render weekly goal indicator when weeklyGoalData is not provided', () => {
    render(<Header {...baseProps} />);
    expect(screen.queryByText(/\d\/\d/)).not.toBeInTheDocument();
  });

  it('shows goal reached indicator when sessions meet the goal', () => {
    render(
      <Header
        {...baseProps}
        weeklyGoalData={{ sessionsThisWeek: 5, weeklyGoal: 5 }}
      />
    );
    expect(screen.getByText('5/5')).toBeInTheDocument();
    // The goal reached element should have an accessible label
    const goalEl = screen.getByRole('status', { name: /weekly goal/i });
    expect(goalEl).toBeInTheDocument();
  });

  it('renders goal indicator with accessible label', () => {
    render(
      <Header
        {...baseProps}
        weeklyGoalData={{ sessionsThisWeek: 2, weeklyGoal: 7 }}
      />
    );
    const goalEl = screen.getByRole('status', { name: /weekly goal.*2.*7/i });
    expect(goalEl).toBeInTheDocument();
  });
});
