import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../components/Header';
import type { StreakData } from '../types';

const baseProps = {
  soundEnabled: true,
  onToggleSound: vi.fn(),
};

describe('Header - Streak Badge', () => {
  it('renders streak badge when streak > 0', () => {
    const streakData: StreakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastSessionDate: new Date().toISOString().slice(0, 10),
      totalDays: 5,
    };
    render(<Header {...baseProps} streakData={streakData} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/days? streak/i)).toBeInTheDocument();
  });

  it('shows start your streak when streak is 0', () => {
    const streakData: StreakData = {
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: '',
      totalDays: 0,
    };
    render(<Header {...baseProps} streakData={streakData} />);
    expect(screen.getByText('Start your streak')).toBeInTheDocument();
  });

  it('renders without streakData prop (backward compat)', () => {
    render(<Header {...baseProps} />);
    expect(screen.getByText('Aura')).toBeInTheDocument();
    // No streak badge should be shown
    expect(screen.queryByText('Start your streak')).not.toBeInTheDocument();
  });
});
