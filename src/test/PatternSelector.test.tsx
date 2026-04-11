import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PatternSelector } from '../components/PatternSelector';
import { BREATHING_PATTERNS } from '../types';

describe('PatternSelector', () => {
  it('renders the radiogroup with accessible label', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByRole('radiogroup', { name: /select breathing pattern/i })).toBeInTheDocument();
  });

  it('renders all breathing patterns as radio options', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByRole('radio', { name: 'Box Breathing' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '4-7-8 Relaxation' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Coherent Breathing' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Energizing Breath' })).toBeInTheDocument();
  });

  it('marks the current pattern as checked', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[1]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByRole('radio', { name: '4-7-8 Relaxation' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Box Breathing' })).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onSelectPattern when a pattern is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={onSelect}
        disabled={false}
      />
    );

    await user.click(screen.getByRole('radio', { name: 'Coherent Breathing' }));
    expect(onSelect).toHaveBeenCalledWith(BREATHING_PATTERNS[2]);
  });

  it('disables all radio buttons when disabled prop is true', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={true}
      />
    );
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio: HTMLElement) => {
      expect(radio).toBeDisabled();
    });
  });

  it('renders the pattern description and timing', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByText(/equal parts inhale/i)).toBeInTheDocument();
    expect(screen.getByText(/4s in/)).toBeInTheDocument();
  });
});
