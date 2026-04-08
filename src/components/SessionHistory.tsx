import { useState } from 'react';
import type { SessionRecord } from '../types';

interface SessionHistoryProps {
  history: readonly SessionRecord[];
  onClear: () => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (days === 1) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (days < 7) {
    return `${days}d ago`;
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function getStreakCount(records: readonly SessionRecord[]): number {
  if (records.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daySet = new Set<string>();
  for (const r of records) {
    const d = new Date(r.date);
    d.setHours(0, 0, 0, 0);
    daySet.add(d.toISOString().slice(0, 10));
  }

  const checkDate = new Date(today);
  while (daySet.has(checkDate.toISOString().slice(0, 10))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

export function SessionHistory({ history, onClear }: SessionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const streak = getStreakCount(history);

  if (history.length === 0) return null;

  const recentHistory = history.slice(-10).reverse();

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-900/60 rounded-xl text-sm transition-all duration-200 hover:bg-gray-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
        aria-expanded={isExpanded}
        aria-controls="session-history-content"
      >
        <span className="flex items-center gap-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>History</span>
          <span className="text-gray-600">({history.length})</span>
        </span>
        <span className="flex items-center gap-2">
          {streak > 0 && (
            <span className="text-xs text-primary-400 font-medium">
              {streak} day{streak !== 1 ? 's' : ''} streak
            </span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isExpanded && (
        <div
          id="session-history-content"
          className="mt-2 bg-gray-900/40 rounded-xl overflow-hidden animate-fade-in"
        >
          <ul className="divide-y divide-gray-800/50" role="list" aria-label="Recent sessions">
            {recentHistory.map((record, idx) => (
              <li
                key={`${record.date}-${idx}`}
                className="px-4 py-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500/60" aria-hidden="true" />
                  <span className="text-gray-400">{record.pattern}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <span>{record.cycles} cycle{record.cycles !== 1 ? 's' : ''}</span>
                  <span>{formatDuration(record.duration)}</span>
                  <span className="text-gray-600">{formatDate(record.date)}</span>
                </div>
              </li>
            ))}
          </ul>
          {history.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-800/50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                  setIsExpanded(false);
                }}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
                aria-label="Clear session history"
              >
                Clear history
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
