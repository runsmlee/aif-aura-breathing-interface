import type { SessionStats as SessionStatsType } from '../types';
import { formatCountdown } from '../utils/format';

interface SessionStatsProps {
  stats: SessionStatsType;
  isVisible: boolean;
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

export function SessionStats({ stats, isVisible }: SessionStatsProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-center gap-6 sm:gap-8 animate-fade-in-down"
      role="status"
      aria-live="polite"
      aria-label="Session statistics"
    >
      <StatItem value={String(stats.cyclesCompleted)} label="Cycles" />
      <div className="w-px h-8 bg-gray-800/60" aria-hidden="true" />
      <StatItem value={formatCountdown(stats.totalDuration)} label="Duration" />
      <div className="w-px h-8 bg-gray-800/60" aria-hidden="true" />
      <StatItem value={String(stats.breathsPerMinute)} label="BPM" />
    </div>
  );
}
