import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Controls } from '../components/Controls';

describe('Controls', () => {
  it('renders Start button when not active', () => {
    render(<Controls isActive={false} onStart={vi.fn()} onPause={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: /start breathing/i })).toBeInTheDocument();
  });

  it('renders Pause and Reset buttons when active', () => {
    render(<Controls isActive={true} onStart={vi.fn()} onPause={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: /pause breathing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset breathing/i })).toBeInTheDocument();
  });

  it('calls onStart when Start button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<Controls isActive={false} onStart={onStart} onPause={vi.fn()} onReset={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /start breathing/i }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('calls onPause when Pause button is clicked', async () => {
    const user = userEvent.setup();
    const onPause = vi.fn();
    render(<Controls isActive={true} onStart={vi.fn()} onPause={onPause} onReset={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /pause breathing/i }));
    expect(onPause).toHaveBeenCalledOnce();
  });

  it('calls onReset when Reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<Controls isActive={true} onStart={vi.fn()} onPause={vi.fn()} onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: /reset breathing/i }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
