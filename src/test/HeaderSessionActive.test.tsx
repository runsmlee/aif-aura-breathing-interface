import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../components/Header';

describe('Header session-active indicator', () => {
  it('renders the session-active indicator dot when session is active', () => {
    const { container } = render(
      <Header soundEnabled={true} onToggleSound={vi.fn()} isSessionActive={true} />
    );
    // The dot should have the calm-500 class when session is active
    const dot = container.querySelector('.bg-calm-500');
    expect(dot).toBeInTheDocument();
  });

  it('renders the idle indicator dot when session is not active', () => {
    const { container } = render(
      <Header soundEnabled={true} onToggleSound={vi.fn()} isSessionActive={false} />
    );
    const dot = container.querySelector('.bg-primary-500');
    expect(dot).toBeInTheDocument();
  });

  it('defaults to idle indicator when isSessionActive is not provided', () => {
    const { container } = render(
      <Header soundEnabled={true} onToggleSound={vi.fn()} />
    );
    const dot = container.querySelector('.bg-primary-500');
    expect(dot).toBeInTheDocument();
  });

  it('still renders all header elements when isSessionActive is true', () => {
    render(
      <Header soundEnabled={true} onToggleSound={vi.fn()} isSessionActive={true} />
    );
    expect(screen.getByText('Aura')).toBeInTheDocument();
    expect(screen.getByText('Breathing Interface')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mute sound/i })).toBeInTheDocument();
  });
});
