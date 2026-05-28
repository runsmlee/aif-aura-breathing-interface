import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BreathingCircle } from '../components/BreathingCircle';

describe('BreathingCircle click-to-start', () => {
  it('calls onStart when the idle circle is clicked', () => {
    const onStart = vi.fn();
    render(
      <BreathingCircle
        phase="idle"
        progress={0}
        secondsRemaining={0}
        onStart={onStart}
      />
    );
    const circle = screen.getByRole('button', { name: /start breathing/i });
    fireEvent.click(circle);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('does not call onStart when an active phase circle is clicked', () => {
    const onStart = vi.fn();
    render(
      <BreathingCircle
        phase="inhale"
        progress={0.5}
        secondsRemaining={2}
        onStart={onStart}
      />
    );
    // Active circle should not have button role
    expect(screen.queryByRole('button', { name: /start breathing/i })).not.toBeInTheDocument();
  });

  it('renders the circle as a button with accessible label when idle', () => {
    const onStart = vi.fn();
    render(
      <BreathingCircle
        phase="idle"
        progress={0}
        secondsRemaining={0}
        onStart={onStart}
      />
    );
    const button = screen.getByRole('button', { name: /start breathing/i });
    expect(button).toBeInTheDocument();
  });

  it('does not render button role when onStart is not provided', () => {
    render(
      <BreathingCircle
        phase="idle"
        progress={0}
        secondsRemaining={0}
      />
    );
    expect(screen.queryByRole('button', { name: /start breathing/i })).not.toBeInTheDocument();
  });

  it('is keyboard accessible when idle with onStart', () => {
    const onStart = vi.fn();
    render(
      <BreathingCircle
        phase="idle"
        progress={0}
        secondsRemaining={0}
        onStart={onStart}
      />
    );
    const button = screen.getByRole('button', { name: /start breathing/i });
    expect(button).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
