import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../App';

describe('App', () => {
  it('renders the Aura header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Aura')).toBeInTheDocument();
  });

  it('renders the Start button', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('button', { name: /start breathing/i })).toBeInTheDocument();
  });

  it('renders the breathing pattern selector', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('radiogroup', { name: /select breathing pattern/i })).toBeInTheDocument();
  });

  it('renders the footer message', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/focus on your breath/i)).toBeInTheDocument();
  });

  it('renders all breathing patterns as options', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Box Breathing')).toBeInTheDocument();
    expect(screen.getByText('4-7-8 Relaxation')).toBeInTheDocument();
    expect(screen.getByText('Coherent Breathing')).toBeInTheDocument();
    expect(screen.getByText('Energizing Breath')).toBeInTheDocument();
  });

  it('renders the initial breathing circle with idle state', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });
});
