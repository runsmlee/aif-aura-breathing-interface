import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BreathingCircle } from '../components/BreathingCircle';

describe('BreathingCircle phase transition improvements', () => {
  it('renders a smooth color blend overlay during active phase', () => {
    const { container } = render(
      <BreathingCircle phase="inhale" progress={0.5} secondsRemaining={2} />
    );
    // The smooth color blend overlay should be present during active phases
    const overlay = container.querySelector('.pointer-events-none.rounded-full');
    expect(overlay).toBeInTheDocument();
  });

  it('does not render color blend overlay during idle phase', () => {
    const { container } = render(
      <BreathingCircle phase="idle" progress={0} secondsRemaining={0} />
    );
    // During idle, the color blend overlay should not be present
    const overlays = container.querySelectorAll('.pointer-events-none.rounded-full');
    // Only ambient/invite ring overlays should be present, not the phase color blend
    const hasPhaseBlend = Array.from(overlays).some(
      (el) => (el as HTMLElement).style.background?.includes('#14B8A6') ||
              (el as HTMLElement).style.background?.includes('#EF4444') ||
              (el as HTMLElement).style.background?.includes('#F59E0B')
    );
    expect(hasPhaseBlend).toBe(false);
  });

  it('applies smooth glow transition to the main circle during active phase', () => {
    const { container } = render(
      <BreathingCircle phase="exhale" progress={0.3} secondsRemaining={3} />
    );
    // The main circle should have a box-shadow transition
    const mainCircle = container.querySelector('.w-56.rounded-full, .w-64.rounded-full');
    expect(mainCircle).toBeInTheDocument();
    const style = (mainCircle as HTMLElement).style;
    expect(style.transition).toContain('box-shadow');
    expect(style.transition).toContain('500ms');
  });

  it('applies the exhale phase color correctly to the glow', () => {
    const { container } = render(
      <BreathingCircle phase="exhale" progress={0.5} secondsRemaining={2} />
    );
    const mainCircle = container.querySelector('[class*="w-56"][class*="rounded-full"][class*="relative"]');
    expect(mainCircle).toBeInTheDocument();
    const style = (mainCircle as HTMLElement).style;
    // Exhale color (#EF4444) should appear in the box-shadow
    expect(style.boxShadow).toContain('EF4444');
  });

  it('applies the hold phase color correctly to the glow', () => {
    const { container } = render(
      <BreathingCircle phase="hold" progress={0.5} secondsRemaining={2} />
    );
    const mainCircle = container.querySelector('[class*="w-56"][class*="rounded-full"][class*="relative"]');
    expect(mainCircle).toBeInTheDocument();
    const style = (mainCircle as HTMLElement).style;
    // Hold color (#F59E0B) should appear in the box-shadow
    expect(style.boxShadow).toContain('F59E0B');
  });
});
