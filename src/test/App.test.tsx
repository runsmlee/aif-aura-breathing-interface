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

  it('renders the brand-forward H1 heading', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Breathe with rhythm. Calm on command.');
  });

  it('renders benefit copy text', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/box breathing, 4-7-8, and coherent breathing/i)).toBeInTheDocument();
    expect(screen.getByText(/no signup, no ads, just breathe/i)).toBeInTheDocument();
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
    expect(screen.getAllByText('Box Breathing').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('4-7-8 Relaxation')).toBeInTheDocument();
    expect(screen.getAllByText('Coherent Breathing').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Energizing Breath')).toBeInTheDocument();
  });

  it('renders the initial breathing circle with idle state', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('renders structured SEO content with technique H2s', async () => {
    await act(async () => {
      render(<App />);
    });
    const headings = screen.getAllByRole('heading', { level: 2 });
    const headingTexts = headings.map((h) => h.textContent);
    expect(headingTexts).toContain('Box Breathing');
    expect(headingTexts).toContain('4-7-8 Relaxation Breathing');
    expect(headingTexts).toContain('Coherent Breathing');
    expect(headingTexts).toContain('How It Works');
  });

  it('renders technique descriptions with pattern timing details', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/equal 4-second phases/i)).toBeInTheDocument();
    expect(screen.getByText(/4-second inhale, 7-second hold, and 8-second exhale/i)).toBeInTheDocument();
    expect(screen.getByText(/equal 5-second inhale and 5-second exhale/i)).toBeInTheDocument();
  });

  it('renders the breathing techniques guide section', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('region', { name: /breathing techniques guide/i })).toBeInTheDocument();
  });
});
