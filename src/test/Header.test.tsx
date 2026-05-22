import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../components/Header';

describe('Header', () => {
  it('renders the Aura brand mark', () => {
    render(<Header soundEnabled={true} onToggleSound={vi.fn()} />);
    expect(screen.getByText('Aura')).toBeInTheDocument();
  });

  it('renders sound toggle button with correct label when enabled', () => {
    render(<Header soundEnabled={true} onToggleSound={vi.fn()} />);
    expect(screen.getByRole('button', { name: /mute sound/i })).toBeInTheDocument();
  });

  it('renders sound toggle button with correct label when disabled', () => {
    render(<Header soundEnabled={false} onToggleSound={vi.fn()} />);
    expect(screen.getByRole('button', { name: /enable sound/i })).toBeInTheDocument();
  });

  it('calls onToggleSound when sound button is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Header soundEnabled={true} onToggleSound={onToggle} />);

    await user.click(screen.getByRole('button', { name: /mute sound/i }));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
