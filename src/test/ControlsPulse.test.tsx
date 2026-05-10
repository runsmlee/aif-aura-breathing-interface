import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Controls } from '../components/Controls';

describe('Controls start button pulse animation', () => {
  it('applies start-pulse class to the Start button', () => {
    render(
      <Controls
        isActive={false}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        totalCyclesEverCompleted={0}
      />
    );
    const startButton = screen.getByRole('button', { name: /start breathing/i });
    expect(startButton.className).toContain('start-pulse');
  });

  it('does not apply start-pulse when session is active', () => {
    render(
      <Controls
        isActive={true}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        totalCyclesEverCompleted={0}
      />
    );
    // When active, Pause and Reset buttons should not have start-pulse
    const pauseButton = screen.getByRole('button', { name: /pause breathing/i });
    expect(pauseButton.className).not.toContain('start-pulse');
  });

  it('start-pulse still appears when there are completed cycles', () => {
    render(
      <Controls
        isActive={false}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        totalCyclesEverCompleted={5}
      />
    );
    const startButton = screen.getByRole('button', { name: /start breathing/i });
    expect(startButton.className).toContain('start-pulse');
  });
});
