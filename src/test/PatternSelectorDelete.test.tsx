import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatternSelector } from '../components/PatternSelector';
import { BREATHING_PATTERNS, CUSTOM_PATTERNS_KEY } from '../types';
import type { CustomPattern } from '../types';

const mockCustomPattern: CustomPattern = {
  id: 'test-del-1',
  name: 'My Pattern',
  inhale: 3,
  holdIn: 2,
  exhale: 5,
  holdOut: 1,
  savedAt: new Date().toISOString(),
};

const mockCustomPattern2: CustomPattern = {
  id: 'test-del-2',
  name: 'Another Pattern',
  inhale: 4,
  holdIn: 0,
  exhale: 4,
  holdOut: 0,
  savedAt: new Date().toISOString(),
};

beforeEach(() => {
  localStorage.clear();
});

describe('PatternSelector - Delete Custom Patterns', () => {
  it('renders a delete button for each custom pattern', () => {
    localStorage.setItem(CUSTOM_PATTERNS_KEY, JSON.stringify([mockCustomPattern]));
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByRole('button', { name: /delete my pattern/i })).toBeInTheDocument();
  });

  it('removes custom pattern from list when delete is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CUSTOM_PATTERNS_KEY,
      JSON.stringify([mockCustomPattern, mockCustomPattern2])
    );
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );
    // Both patterns should be in the list
    expect(screen.getByRole('button', { name: /delete my pattern/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete another pattern/i })).toBeInTheDocument();

    // Delete the first one
    await user.click(screen.getByRole('button', { name: /delete my pattern/i }));

    // Only the second pattern should remain
    expect(screen.queryByRole('button', { name: /delete my pattern/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete another pattern/i })).toBeInTheDocument();
  });

  it('persists deletion to localStorage', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CUSTOM_PATTERNS_KEY,
      JSON.stringify([mockCustomPattern, mockCustomPattern2])
    );
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete my pattern/i }));

    const stored = JSON.parse(localStorage.getItem(CUSTOM_PATTERNS_KEY) ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('test-del-2');
  });

  it('calls onSelectPattern with default when deleted pattern was selected', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    localStorage.setItem(CUSTOM_PATTERNS_KEY, JSON.stringify([mockCustomPattern]));
    render(
      <PatternSelector
        currentPattern={{
          name: 'My Pattern',
          description: '',
          inhale: 3,
          hold: 2,
          exhale: 5,
          holdAfterExhale: 1,
        }}
        onSelectPattern={onSelect}
        disabled={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete my pattern/i }));

    // Should auto-select Box Breathing as fallback
    expect(onSelect).toHaveBeenCalledWith(BREATHING_PATTERNS[0]);
  });

  it('delete buttons are disabled when component is disabled', () => {
    localStorage.setItem(CUSTOM_PATTERNS_KEY, JSON.stringify([mockCustomPattern]));
    render(
      <PatternSelector
        currentPattern={BREATHING_PATTERNS[0]}
        onSelectPattern={vi.fn()}
        disabled={true}
      />
    );
    expect(screen.getByRole('button', { name: /delete my pattern/i })).toBeDisabled();
  });
});
