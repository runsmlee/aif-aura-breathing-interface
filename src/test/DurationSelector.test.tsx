import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DurationSelector } from '../components/DurationSelector';

describe('DurationSelector', () => {
  it('renders the radiogroup with accessible label', () => {
    render(
      <DurationSelector
        targetDuration={0}
        onSelect={vi.fn()}
        disabled={false}
        timeRemaining={0}
      />
    );
    expect(screen.getByRole('radiogroup', { name: /select session duration/i })).toBeInTheDocument();
  });

  it('renders all duration options', () => {
    render(
      <DurationSelector
        targetDuration={0}
        onSelect={vi.fn()}
        disabled={false}
        timeRemaining={0}
      />
    );
    expect(screen.getByRole('radio', { name: 'Free' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '2 min' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '5 min' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '10 min' })).toBeInTheDocument();
  });

  it('marks the selected duration as checked', () => {
    render(
      <DurationSelector
        targetDuration={5}
        onSelect={vi.fn()}
        disabled={false}
        timeRemaining={0}
      />
    );
    expect(screen.getByRole('radio', { name: '5 min' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onSelect when a duration is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DurationSelector
        targetDuration={0}
        onSelect={onSelect}
        disabled={false}
        timeRemaining={0}
      />
    );

    await user.click(screen.getByRole('radio', { name: '5 min' }));
    expect(onSelect).toHaveBeenCalledWith(5);
  });

  it('disables all radio buttons when disabled prop is true', () => {
    render(
      <DurationSelector
        targetDuration={0}
        onSelect={vi.fn()}
        disabled={true}
        timeRemaining={0}
      />
    );
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('shows time remaining countdown when timeRemaining > 0', () => {
    render(
      <DurationSelector
        targetDuration={5}
        onSelect={vi.fn()}
        disabled={true}
        timeRemaining={180}
      />
    );
    expect(screen.getByText(/Time remaining:/)).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('does not show time remaining when timeRemaining is 0', () => {
    render(
      <DurationSelector
        targetDuration={0}
        onSelect={vi.fn()}
        disabled={false}
        timeRemaining={0}
      />
    );
    expect(screen.queryByText(/Time remaining:/)).not.toBeInTheDocument();
  });
});
