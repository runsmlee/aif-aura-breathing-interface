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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Calm Your Mind in 60 Seconds');
  });

  it('renders benefit-led hero copy', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/calm your mind in 60 seconds/i)).toBeInTheDocument();
    expect(screen.getAllByText(/box breathing timer/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/breathe in, hold, exhale, hold/i)).toBeInTheDocument();
    expect(screen.getByText(/no signup, no ads/i)).toBeInTheDocument();
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

  it('renders structured SEO content with box breathing H2s', async () => {
    await act(async () => {
      render(<App />);
    });
    const headings = screen.getAllByRole('heading', { level: 2 });
    const headingTexts = headings.map((h) => h.textContent);
    expect(headingTexts.some(t => t?.includes('Box Breathing'))).toBe(true);
    expect(headingTexts.some(t => t?.includes('How the Box Breathing Timer Works'))).toBe(true);
  });

  it('renders box breathing technique description with pattern timing details', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/equal 4-second phases/i)).toBeInTheDocument();
  });

  it('renders SEO keywords for box breathing', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getAllByText(/box breathing for anxiety/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders when-to-use guidance for box breathing', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('heading', { level: 3, name: /when to use box breathing/i })).toBeInTheDocument();
  });

  it('renders how-it-helps section for box breathing', async () => {
    await act(async () => {
      render(<App />);
    });
    const howItHelps = screen.getAllByRole('heading', { level: 3 }).filter(h =>
      h.textContent?.includes('How It Helps')
    );
    expect(howItHelps.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the box breathing guide section', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('region', { name: /box breathing guide/i })).toBeInTheDocument();
  });

  it('renders click-to-start hint on idle breathing circle', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getAllByText(/tap the circle to start/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders benefit subheading focused on box breathing', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/breathe in, hold, exhale, hold/i)).toBeInTheDocument();
    expect(screen.getByText(/four seconds each/i)).toBeInTheDocument();
  });
});
