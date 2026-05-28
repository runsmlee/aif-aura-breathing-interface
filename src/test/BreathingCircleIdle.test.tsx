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
    expect(screen.getByText('Tap the circle to start your breathing session')).toBeInTheDocument();
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

  it('applies idle-circle-breath animation class in idle state', () => {
    const { container } = render(<BreathingCircle phase="idle" progress={0} secondsRemaining={0} />);
    // The main circle should have the idle-circle-breath class for the breathing animation
    const mainCircle = container.querySelector('.idle-circle-breath');
    expect(mainCircle).toBeInTheDocument();
  });

  it('does not apply idle-circle-breath class during active phase', () => {
    const { container } = render(<BreathingCircle phase="inhale" progress={0.5} secondsRemaining={2} />);
    const mainCircle = container.querySelector('.idle-circle-breath');
    expect(mainCircle).not.toBeInTheDocument();
  });

  it('does not use inline transform in idle state without reduced motion', () => {
    const { container } = render(<BreathingCircle phase="idle" progress={0} secondsRemaining={0} />);
    // The main circle should NOT have an inline transform — CSS animation handles scale
    const mainCircle = container.querySelector('.idle-circle-breath');
    expect(mainCircle).toBeInTheDocument();
    // Inline transform should be absent (CSS animation handles it)
    expect((mainCircle as HTMLElement).style.transform).toBe('');
  });
});
