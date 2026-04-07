import { useEffect, useState } from 'react';
import type { SessionStats as SessionStatsType, BreathingPattern } from '../types';

interface SessionSummaryProps {
  stats: SessionStatsType;
  pattern: BreathingPattern;
  isVisible: boolean;
  onDismiss: () => void;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function getMotivationalMessage(cycles: number): string {
  if (cycles === 0) return 'Every breath counts.';
  if (cycles <= 2) return 'Nice start. Keep going.';
  if (cycles <= 5) return 'Great session. Well done.';
  if (cycles <= 10) return 'Impressive dedication.';
  return 'Incredible commitment. You are a breathing master.';
}

export function SessionSummary({ stats, pattern, isVisible, onDismiss }: SessionSummaryProps) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        animateIn ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Session summary"
    >
      <div
        className={`w-full max-w-sm bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-500/20 flex items-center justify-center" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-white">Session Complete</h2>
          <p className="text-sm text-gray-400 mt-1">{getMotivationalMessage(stats.cyclesCompleted)}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-800/50 rounded-2xl">
            <p className="text-2xl font-light text-white tabular-nums">{stats.cyclesCompleted}</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Cycles</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-2xl">
            <p className="text-2xl font-light text-white tabular-nums">{formatDuration(stats.totalDuration)}</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Duration</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-2xl">
            <p className="text-2xl font-light text-white tabular-nums">{stats.breathsPerMinute}</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">BPM</p>
          </div>
        </div>

        {/* Pattern used */}
        <p className="text-center text-xs text-gray-500 mb-6">
          Pattern: {pattern.name}
        </p>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          aria-label="Close session summary"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
