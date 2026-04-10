import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BreathingCircle } from '../components/BreathingCircle';

describe('BreathingCircle', () => {
  it('renders the idle state with "Ready" label', () => {
    render(<BreathingCircle phase="idle" progress={0} secondsRemaining={0} />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('renders idle guidance text', () => {
    render(<BreathingCircle phase="idle" progress={0} secondsRemaining={0} />);
    expect(screen.getByText('Press Start to begin your session')).toBeInTheDocument();
  });

  it('renders the inhale phase with correct label and countdown', () => {
    render(<BreathingCircle phase="inhale" progress={0.5} secondsRemaining={2} />);
    expect(screen.getByText('Breathe In')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders inhale guidance text', () => {
    render(<BreathingCircle phase="inhale" progress={0.5} secondsRemaining={2} />);
    expect(screen.getByText('Slowly breathe in through your nose')).toBeInTheDocument();
  });

  it('renders the hold phase with correct label', () => {
    render(<BreathingCircle phase="hold" progress={0.3} secondsRemaining={3} />);
    expect(screen.getByText('Hold')).toBeInTheDocument();
  });

  it('renders the exhale phase with correct label', () => {
    render(<BreathingCircle phase="exhale" progress={0.7} secondsRemaining={1} />);
    expect(screen.getByText('Breathe Out')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders progress bar during active phases', () => {
    const { container } = render(
      <BreathingCircle phase="inhale" progress={0.5} secondsRemaining={2} />
    );
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('does not render progress bar during idle phase', () => {
    const { container } = render(
      <BreathingCircle phase="idle" progress={0} secondsRemaining={0} />
    );
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('has an accessible aria-label for the breathing visualization', () => {
    render(<BreathingCircle phase="inhale" progress={0.5} secondsRemaining={2} />);
    expect(screen.getByRole('img', { name: /breathing phase: breathe in/i })).toBeInTheDocument();
  });
});
