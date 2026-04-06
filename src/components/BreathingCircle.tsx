import { useMemo } from 'react';
import type { BreathingPhase } from '../types';
import { PHASE_LABELS, PHASE_COLORS } from '../types';

interface BreathingCircleProps {
  phase: BreathingPhase;
  progress: number;
  secondsRemaining: number;
}

export function BreathingCircle({
  phase,
  progress,
  secondsRemaining,
}: BreathingCircleProps) {
  const scaleValue = useMemo(() => {
    if (phase === 'idle') return 0.4;
    if (phase === 'inhale') return 0.4 + progress * 0.6;
    if (phase === 'exhale') return 1 - progress * 0.6;
    return 1;
  }, [phase, progress]);

  const color = PHASE_COLORS[phase];
  const label = PHASE_LABELS[phase];
  const isActive = phase !== 'idle';

  return (
    <div className="flex flex-col items-center justify-center gap-6" role="img" aria-label={`Breathing phase: ${label}`}>
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center">
        {isActive && (
          <div
            className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-20 blur-xl animate-pulse-ring"
            style={{ backgroundColor: color }}
          />
        )}

        {/* Main circle */}
        <div
          className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out"
          style={{
            transform: `scale(${scaleValue})`,
            background: isActive
              ? `radial-gradient(circle at 40% 40%, ${color}cc, ${color}66)`
              : 'radial-gradient(circle at 40% 40%, #374151, #1F2937)',
            boxShadow: isActive
              ? `0 0 60px ${color}44, 0 0 120px ${color}22`
              : '0 0 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* Inner content */}
          <div className="text-center z-10">
            <p
              className={`text-lg sm:text-xl font-medium tracking-wide transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}
            >
              {label}
            </p>
            {isActive && secondsRemaining > 0 && (
              <p className="text-4xl sm:text-5xl font-light text-white mt-2 tabular-nums">
                {secondsRemaining}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Phase progress bar */}
      {isActive && (
        <div className="w-48 sm:w-56 h-1 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} progress`}>
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: color,
            }}
          />
        </div>
      )}
    </div>
  );
}
