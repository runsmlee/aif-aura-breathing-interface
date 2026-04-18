import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OnboardingTip } from '../components/OnboardingTip';

describe('OnboardingTip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when user has already completed a session', () => {
    const { container } = render(<OnboardingTip hasCompletedASession={true} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when onboarding has been dismissed before', () => {
    localStorage.setItem('aura-onboarding-dismissed', 'true');
    const { container } = render(<OnboardingTip hasCompletedASession={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows onboarding tips after delay for new users', () => {
    render(<OnboardingTip hasCompletedASession={false} />);
    act(() => {
      vi.advanceTimersByTime(1300);
    });
    expect(screen.getByText('Breathe with the circle')).toBeInTheDocument();
  });

  it('navigates through tips with Next button', () => {
    render(<OnboardingTip hasCompletedASession={false} />);
    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(screen.getByText('Breathe with the circle')).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
  });

  it('dismisses onboarding when Skip is clicked', () => {
    render(<OnboardingTip hasCompletedASession={false} />);
    act(() => {
      vi.advanceTimersByTime(1300);
    });

    const skipButton = screen.getByRole('button', { name: /skip/i });
    fireEvent.click(skipButton);

    expect(screen.queryByText('Breathe with the circle')).not.toBeInTheDocument();
  });

  it('has accessible dialog role', () => {
    render(<OnboardingTip hasCompletedASession={false} />);
    act(() => {
      vi.advanceTimersByTime(1300);
    });
    expect(screen.getByRole('dialog', { name: /quick tips/i })).toBeInTheDocument();
  });

  it('persists dismissed state to localStorage', () => {
    render(<OnboardingTip hasCompletedASession={false} />);
    act(() => {
      vi.advanceTimersByTime(1300);
    });

    const skipButton = screen.getByRole('button', { name: /skip/i });
    fireEvent.click(skipButton);

    expect(localStorage.getItem('aura-onboarding-dismissed')).toBe('true');
  });

  it('shows Back button on second tip', () => {
    render(<OnboardingTip hasCompletedASession={false} />);
    act(() => {
      vi.advanceTimersByTime(1300);
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('dismisses on Escape key press', () => {
    render(<OnboardingTip hasCompletedASession={false} />);
    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(screen.getByText('Breathe with the circle')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByText('Breathe with the circle')).not.toBeInTheDocument();
    expect(localStorage.getItem('aura-onboarding-dismissed')).toBe('true');
  });
});
