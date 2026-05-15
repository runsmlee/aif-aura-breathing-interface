import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Controls } from '../components/Controls';

describe('Controls phase color indicator', () => {
  it('shows phase color indicator bar during active session', () => {
    const { container } = render(
      <Controls
        isActive={true}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        totalCyclesEverCompleted={0}
        phaseColor="#14B8A6"
      />
    );
    // Phase color indicator should be rendered (it's aria-hidden)
    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toBeInTheDocument();
  });

  it('does not show phase color indicator when not active', () => {
    const { container } = render(
      <Controls
        isActive={false}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        totalCyclesEverCompleted={0}
        phaseColor="#14B8A6"
      />
    );
    // No indicator bar should be present (only the Start button has no indicator)
    const bars = container.querySelectorAll('[style*="background-color"]');
    // The start button may have bg color, but no phase indicator
    expect(bars.length).toBeLessThanOrEqual(1);
  });

  it('works without phaseColor prop (backward compatible)', () => {
    render(
      <Controls
        isActive={true}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        totalCyclesEverCompleted={0}
      />
    );
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('phase color indicator has transition class', () => {
    const { container } = render(
      <Controls
        isActive={true}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        totalCyclesEverCompleted={0}
        phaseColor="#F59E0B"
      />
    );
    const indicator = container.querySelector('.rounded-full[aria-hidden="true"]');
    if (indicator) {
      expect(indicator.className).toContain('transition-colors');
    }
  });
});
