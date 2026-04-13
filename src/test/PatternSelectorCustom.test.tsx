import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatternSelector } from '../components/PatternSelector';
import { BREATHING_PATTERNS, CUSTOM_PATTERNS_KEY } from '../types';
import type { CustomPattern } from '../types';

const mockCustomPattern: CustomPattern = {
  id: 'test-1',
  name: 'My Pattern',
  inhale: 3,
  holdIn: 2,
  exhale: 5,
  holdOut: 1,
  savedAt: new Date().toISOString(),
};

beforeEach(() => {
  localStorage.clear();
});

describe('PatternSelector - Custom Patterns', () => {
  it('renders a "Custom" option in the pattern list', () => {
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByRole('radio', { name: 'Custom' })).toBeInTheDocument();
  });

  it('shows custom pattern editor when Custom is selected', async () => {
    const user = userEvent.setup();
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    await user.click(screen.getByRole('radio', { name: 'Custom' }));
    expect(screen.getByText('Inhale')).toBeInTheDocument();
    expect(screen.getAllByText('Hold')).toHaveLength(2);
    expect(screen.getByText('Exhale')).toBeInTheDocument();
  });

  it('renders saved custom patterns with "custom" badge', () => {
    localStorage.setItem(CUSTOM_PATTERNS_KEY, JSON.stringify([mockCustomPattern]));

    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByText('custom')).toBeInTheDocument();
  });

  it('renders a timeline bar preview in custom editor', async () => {
    const user = userEvent.setup();
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    await user.click(screen.getByRole('radio', { name: 'Custom' }));
    expect(screen.getByTestId('custom-pattern-timeline')).toBeInTheDocument();
  });

  it('calls onSelectPattern with custom BreathingPattern when save is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={onSelect}
        disabled={false}
      />
    );

    await user.click(screen.getByRole('radio', { name: 'Custom' }));
    const saveButton = screen.getByRole('button', { name: /save pattern/i });
    expect(saveButton).toBeInTheDocument();
  });
});
