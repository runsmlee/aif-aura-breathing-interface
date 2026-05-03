import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BreathingCircle } from '../components/BreathingCircle';

describe('BreathingCircle idle state improvements', () => {
  it('renders the idle state with "Ready" label', () => {
    render(<BreathingCircle phase="idle" progress={0} secondsRemaining={0} />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('renders idle guidance text inviting interaction', () => {
    render(<BreathingCircle phase="idle" progress={0} secondsRemaining={0} />);
    expect(screen.getByText('Press Start to begin your session')).toBeInTheDocument();
  });

  it('does not render progress bar in idle state', () => {
    const { container } = render(<BreathingCircle phase="idle" progress={0} secondsRemaining={0} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('renders the idle invite ring in idle state', () => {
    const { container } = render(<BreathingCircle phase="idle" progress={0} secondsRemaining={0} />);
    // The idle invite ring should be rendered (border ring)
    const inviteRing = container.querySelector('.border-gray-700\\/20');
    expect(inviteRing).toBeInTheDocument();
  });

  it('does not render invite ring during active phase', () => {
    const { container } = render(<BreathingCircle phase="inhale" progress={0.5} secondsRemaining={2} />);
    const inviteRing = container.querySelector('.border-gray-700\\/20');
    expect(inviteRing).not.toBeInTheDocument();
  });
});
