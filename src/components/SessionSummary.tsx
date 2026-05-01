import React, { useEffect, useState } from 'react';
import type { SessionStats as SessionStatsType, BreathingPattern } from '../types';
import { formatDuration } from '../utils/format';
import { useFocusTrap, usePrefersReducedMotion } from '../hooks';

interface SessionSummaryProps {
  stats: SessionStatsType;
  pattern: BreathingPattern;
  isVisible: boolean;
  onDismiss: () => void;
  onStartAgain: () => void;
  targetDuration: number;
}

function getMotivationalMessage(cycles: number): string {
  if (cycles === 0) return 'Every breath counts.';
  if (cycles <= 2) return 'Nice start. Keep going.';
  if (cycles <= 5) return 'Great session. Well done.';
  if (cycles <= 10) return 'Impressive dedication.';
  return 'Incredible commitment. You are a breathing master.';
}

function getCompletionEmoji(cycles: number): string {
  if (cycles <= 2) return '🌱';
  if (cycles <= 5) return '🌿';
  if (cycles <= 10) return '🌳';
  return '🏔️';
}

export function SessionSummary({ stats, pattern, isVisible, onDismiss, onStartAgain, targetDuration }: SessionSummaryProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const focusTrapRef = useFocusTrap(isVisible);

  useEffect(() => {
    if (isVisible) {
      const delay = prefersReducedMotion ? 0 : 50;
      const timer = setTimeout(() => setAnimateIn(true), delay);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [isVisible, prefersReducedMotion]);

  // Close on Escape key
  useEffect(() => {
    if (!isVisible) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  const hitTarget = targetDuration > 0 && stats.totalDuration >= targetDuration * 60 - 5;
  const animationClass = prefersReducedMotion
    ? 'opacity-100 translate-y-0 scale-100'
    : animateIn
      ? 'opacity-100 translate-y-0 scale-100'
      : 'opacity-0 translate-y-4 scale-95';

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
        ref={focusTrapRef as React.RefObject<HTMLDivElement>}
        className={`w-full max-w-sm bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 transition-all duration-300 ${animationClass}`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-500/20 flex items-center justify-center ring-1 ring-primary-500/10" aria-hidden="true">
            <span className="text-xl">{getCompletionEmoji(stats.cyclesCompleted)}</span>
          </div>
          <h2 className="text-xl font-medium text-white">Session Complete</h2>
          <p className="text-sm text-gray-400 mt-1">{getMotivationalMessage(stats.cyclesCompleted)}</p>
          {hitTarget && (
            <p className="text-xs text-primary-400 mt-1 font-medium">
              Target reached — {targetDuration} min
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-800/50 rounded-2xl ring-1 ring-gray-700/30">
            <p className="text-2xl font-light text-white tabular-nums">{stats.cyclesCompleted}</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Cycles</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-2xl ring-1 ring-gray-700/30">
            <p className="text-2xl font-light text-white tabular-nums">{formatDuration(stats.totalDuration)}</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Duration</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-2xl ring-1 ring-gray-700/30">
            <p className="text-2xl font-light text-white tabular-nums">{stats.breathsPerMinute}</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">BPM</p>
          </div>
        </div>

        {/* Pattern used */}
        <p className="text-center text-xs text-gray-500 mb-6">
          Pattern: {pattern.name}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onStartAgain}
            className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 shadow-lg shadow-primary-500/20"
            aria-label="Start another breathing session"
          >
            Breathe Again
          </button>
          <button
            onClick={onDismiss}
            className="w-full px-6 py-2.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 font-medium rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            aria-label="Close session summary"
          >
            I&apos;m Done
          </button>
        </div>
      </div>
    </div>
  );
}
