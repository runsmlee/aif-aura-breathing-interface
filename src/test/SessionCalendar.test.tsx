import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SessionCalendar } from '../components/SessionCalendar';
import type { SessionRecord } from '../types';

function makeRecord(daysAgo: number, count = 1): SessionRecord[] {
  const records: SessionRecord[] = [];
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setMinutes(d.getMinutes() + i);
    records.push({
      date: d.toISOString(),
      pattern: 'Box Breathing',
      cycles: 3,
      duration: 120,
      targetDuration: 5,
    });
  }
  return records;
}

beforeEach(() => {
  localStorage.clear();
});

describe('SessionCalendar', () => {
  it('renders day-of-week headers', () => {
    render(<SessionCalendar history={[]} onDayClick={vi.fn()} />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(7);
    expect(headers[0].textContent).toBe('S');
  });

  it('renders 28 day cells (4×7 grid)', () => {
    render(<SessionCalendar history={[]} onDayClick={vi.fn()} />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(28);
  });

  it('shows tooltip for days with sessions', () => {
    const records = makeRecord(0, 2);
    render(<SessionCalendar history={records} onDayClick={vi.fn()} />);
    const todayCell = screen.getByTitle(/2 sessions on/i);
    expect(todayCell).toBeInTheDocument();
  });

  it('calls onDayClick when a day cell is clicked', async () => {
    const user = userEvent.setup();
    const onDayClick = vi.fn();
    render(<SessionCalendar history={[]} onDayClick={onDayClick} />);
    const cells = screen.getAllByRole('gridcell');
    await user.click(cells[27]); // last cell (most recent day)
    expect(onDayClick).toHaveBeenCalledTimes(1);
  });

  it('applies color intensity classes based on session count', () => {
    const records = [...makeRecord(0, 3), ...makeRecord(1, 1)];
    render(<SessionCalendar history={records} onDayClick={vi.fn()} />);
    const cells = screen.getAllByRole('gridcell');
    // Today has 3 sessions — should have higher intensity class
    const todayCell = cells[27];
    expect(todayCell.className).toContain('bg-primary');
  });
});
