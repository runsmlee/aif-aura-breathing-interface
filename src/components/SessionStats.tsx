import { useRef, useEffect, useState } from 'react';
import type { SessionStats as SessionStatsType } from '../types';
import { formatCountdown } from '../utils/format';

interface SessionStatsProps {
  stats: SessionStatsType;
  isVisible: boolean;
  timeRemaining?: number;
  targetDuration?: number;
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-light text-white tabular-nums">
        {value}
      </p>
      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

/**
 * Throttles value updates to prevent aria-live from flooding screen readers.
 * Updates the throttled value at most once per `intervalMs` milliseconds.
 */
function useThrottledValue<T>(value: T, intervalMs: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdateRef.current;
    if (elapsed >= intervalMs) {
      lastUpdateRef.current = now;
      setThrottled(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        setThrottled(value);
      }, intervalMs - elapsed);
      return () => clearTimeout(timer);
    }
  }, [value, intervalMs]);

  return throttled;
}

export function SessionStats({ stats, isVisible, timeRemaining, targetDuration }: SessionStatsProps) {
  if (!isVisible) {
    return null;
  }

  // Throttle aria-live updates to once per second to avoid overwhelming screen readers
  // Visual updates still happen every render (100ms), only the ARIA announcements are throttled
  const throttledStats = useThrottledValue(stats, 1000);
  const throttledTimeRemaining = useThrottledValue(timeRemaining, 1000);

  const showTimeRemaining = targetDuration !== undefined && targetDuration > 0 && throttledTimeRemaining !== undefined && throttledTimeRemaining > 0;

  return (
    <>
      {/* Visual stats — updated every render for smooth display */}
      <div
        className="flex items-center justify-center gap-6 sm:gap-8 animate-fade-in-down"
        aria-hidden="true"
      >
        <StatItem value={String(stats.cyclesCompleted)} label="Cycles" />
        <div className="w-px h-8 bg-gray-800/60" aria-hidden="true" />
        {showTimeRemaining ? (
          <StatItem value={formatCountdown(timeRemaining ?? 0)} label="Remaining" />
        ) : (
          <StatItem value={formatCountdown(stats.totalDuration)} label="Duration" />
        )}
        <div className="w-px h-8 bg-gray-800/60" aria-hidden="true" />
        <StatItem value={String(stats.breathsPerMinute)} label="BPM" />
      </div>
      {/* Screen reader announcements — throttled to avoid flooding */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Session statistics"
        className="sr-only"
      >
        {throttledStats.cyclesCompleted} cycles,{' '}
        {showTimeRemaining
          ? `${formatCountdown(throttledTimeRemaining ?? 0)} remaining`
          : `${formatCountdown(throttledStats.totalDuration)} duration`
        },{' '}
        {throttledStats.breathsPerMinute} breaths per minute
      </div>
    </>
  );
}
