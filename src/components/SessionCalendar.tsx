import { useMemo, useCallback } from 'react';
import type { SessionRecord } from '../types';

interface SessionCalendarProps {
  history: readonly SessionRecord[];
  onDayClick: (dateStr: string) => void;
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface DayData {
  dateStr: string;
  dayOfWeek: number;
  sessions: number;
  isToday: boolean;
  isFuture: boolean;
  label: string;
}

function toLocalDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTooltip(date: Date, sessions: number): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = dayNames[date.getDay()];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[date.getMonth()];
  return `${sessions} session${sessions !== 1 ? 's' : ''} on ${dayName} ${monthName} ${date.getDate()}`;
}

function getIntensityClass(sessions: number): string {
  if (sessions === 0) return 'bg-gray-800/40';
  if (sessions === 1) return 'bg-primary-500/30';
  if (sessions === 2) return 'bg-primary-500/50';
  return 'bg-primary-500/70';
}

function buildCalendarDays(history: readonly SessionRecord[]): DayData[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toLocalDateStr(today);

  // Count sessions per day (using local date strings)
  const sessionCounts = new Map<string, number>();
  for (const record of history) {
    const d = new Date(record.date);
    const key = toLocalDateStr(d);
    sessionCounts.set(key, (sessionCounts.get(key) ?? 0) + 1);
  }

  // Start from the Sunday that gives us a 4-week grid (4×7 = 28 cells)
  // where today falls in the correct day-of-week column.
  // Today's position in the grid = 21 + today.getDay()
  const todayDayOfWeek = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - todayDayOfWeek - 21);

  const days: DayData[] = [];

  for (let i = 0; i < 28; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = toLocalDateStr(d);
    const isToday = dateStr === todayStr;
    const isFuture = d.getTime() > today.getTime();
    const sessions = isFuture ? 0 : (sessionCounts.get(dateStr) ?? 0);

    days.push({
      dateStr,
      dayOfWeek: d.getDay(),
      sessions,
      isToday,
      isFuture,
      label: isFuture ? '' : formatTooltip(d, sessions),
    });
  }

  return days;
}

export function SessionCalendar({ history, onDayClick }: SessionCalendarProps) {
  const days = useMemo(() => buildCalendarDays(history), [history]);

  const handleClick = useCallback(
    (dateStr: string) => {
      onDayClick(dateStr);
    },
    [onDayClick],
  );

  // Render as 4 rows × 7 cols
  const rows: DayData[][] = [];
  for (let r = 0; r < 4; r++) {
    rows.push(days.slice(r * 7, (r + 1) * 7));
  }

  return (
    <div
      className="w-full max-w-md mx-auto mt-2"
      role="grid"
      aria-label="28-day session calendar"
    >
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((label, i) => (
          <div
            key={`${label}-${i}`}
            role="columnheader"
            className="text-center text-[9px] text-gray-600 font-medium tracking-wider"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-7 gap-1">
          {row.map((day) => (
            <button
              key={day.dateStr}
              role="gridcell"
              aria-label={day.label}
              title={day.label}
              onClick={() => handleClick(day.dateStr)}
              className={`aspect-square rounded-sm transition-colors duration-150 hover:ring-1 hover:ring-primary-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-950 cursor-pointer ${getIntensityClass(day.sessions)}${day.isToday ? ' ring-1 ring-primary-400/30' : ''}${day.isFuture ? ' opacity-20' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
