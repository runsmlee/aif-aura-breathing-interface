import { SESSION_DURATION_OPTIONS } from '../types';
import type { SessionDuration } from '../types';
import { formatCountdown } from '../utils/format';

interface DurationSelectorProps {
  targetDuration: SessionDuration;
  onSelect: (duration: SessionDuration) => void;
  disabled: boolean;
  timeRemaining: number;
}

export function DurationSelector({
  targetDuration,
  onSelect,
  disabled,
  timeRemaining,
}: DurationSelectorProps) {
  const showCountdown = timeRemaining > 0;
  const totalSessionSeconds = targetDuration * 60;
  const elapsedSeconds = totalSessionSeconds > 0 && timeRemaining > 0
    ? totalSessionSeconds - timeRemaining
    : 0;
  const sessionProgressPercent = totalSessionSeconds > 0 && timeRemaining > 0
    ? Math.round((elapsedSeconds / totalSessionSeconds) * 100)
    : 0;
  const showSessionProgress = targetDuration > 0 && timeRemaining > 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 text-center">
        Session Length
      </h2>
      <div
        className="flex gap-2 justify-center flex-wrap transition-all duration-200"
        role="radiogroup"
        aria-label="Select session duration"
      >
        {SESSION_DURATION_OPTIONS.map((option) => {
          const isSelected = option.value === targetDuration;
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              disabled={disabled}
              role="radio"
              aria-checked={isSelected}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap
                ${
                  isSelected
                    ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/50'
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {showCountdown && (
        <div className="mt-2 text-center animate-fade-in">
          <p className="text-xs text-gray-500">
            Time remaining:{' '}
            <span className="text-primary-400 tabular-nums font-medium">
              {formatCountdown(timeRemaining)}
            </span>
          </p>
        </div>
      )}

      {/* Session progress bar — shows elapsed time relative to target */}
      {showSessionProgress && (
        <div className="mt-2 animate-fade-in">
          <div
            className="w-full h-1 bg-gray-800/80 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={sessionProgressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Session progress"
          >
            <div
              className="h-full rounded-full transition-all duration-200 ease-linear bg-gradient-to-r from-primary-500/70 to-primary-400/80"
              style={{ width: `${sessionProgressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
