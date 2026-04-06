import type { SessionStats as SessionStatsType } from '../types';

interface SessionStatsProps {
  stats: SessionStatsType;
  isVisible: boolean;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SessionStats({ stats, isVisible }: SessionStatsProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-center gap-6 sm:gap-8 animate-fade-in"
      role="status"
      aria-label="Session statistics"
    >
      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-light text-white tabular-nums">
          {stats.cyclesCompleted}
        </p>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
          Cycles
        </p>
      </div>
      <div className="w-px h-8 bg-gray-800" />
      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-light text-white tabular-nums">
          {formatDuration(stats.totalDuration)}
        </p>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
          Duration
        </p>
      </div>
      <div className="w-px h-8 bg-gray-800" />
      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-light text-white tabular-nums">
          {stats.breathsPerMinute}
        </p>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
          BPM
        </p>
      </div>
    </div>
  );
}
