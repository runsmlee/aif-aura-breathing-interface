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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Guided Breathing Exercises — Box, 4-7-8, Coherent');
  });

  it('renders benefit copy text', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/visual rhythm guide/i)).toBeInTheDocument();
    expect(screen.getByText(/reduce stress, improve focus/i)).toBeInTheDocument();
  });

  it('renders the Start button', async () => {
    await act(async () => {
      render(<App />);
    });
    const startButtons = screen.getAllByRole('button', { name: /start breathing/i });
    expect(startButtons.length).toBeGreaterThanOrEqual(1);
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
    expect(headingTexts.some(t => t?.includes('Box Breathing'))).toBe(true);
    expect(headingTexts.some(t => t?.includes('4-7-8'))).toBe(true);
    expect(headingTexts.some(t => t?.includes('Coherent Breathing'))).toBe(true);
    expect(headingTexts.some(t => t?.includes('How'))).toBe(true);
  });

  it('renders technique descriptions with pattern timing details', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/equal 4-second phases/i)).toBeInTheDocument();
    expect(screen.getByText(/4-second inhale, 7-second hold, and 8-second exhale/i)).toBeInTheDocument();
    expect(screen.getByText(/5-second inhale and 5-second exhale/i)).toBeInTheDocument();
  });

  it('renders SEO keywords for breathing techniques', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getAllByText(/box breathing for anxiety/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/4-7-8 breathing for sleep/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/coherent breathing.*heart rate variability/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders when-to-use guidance for each technique', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('heading', { level: 3, name: /when to use box breathing/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /when to use 4-7-8/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /when to use coherent breathing/i })).toBeInTheDocument();
  });

  it('renders how-it-helps sections for each technique', async () => {
    await act(async () => {
      render(<App />);
    });
    const howItHelps = screen.getAllByRole('heading', { level: 3 }).filter(h =>
      h.textContent?.includes('How It Helps')
    );
    expect(howItHelps.length).toBeGreaterThanOrEqual(3);
  });

  it('renders the breathing techniques guide section', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('region', { name: /breathing techniques guide/i })).toBeInTheDocument();
  });

  it('renders click-to-start hint on idle breathing circle', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getAllByText(/tap the circle to start/i).length).toBeGreaterThanOrEqual(1);
  });
});
