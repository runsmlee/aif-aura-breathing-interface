import { SESSION_DURATION_OPTIONS } from '../types';
import type { SessionDuration } from '../types';

interface DurationSelectorProps {
  targetDuration: SessionDuration;
  onSelect: (duration: SessionDuration) => void;
  disabled: boolean;
  timeRemaining: number;
}

function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function DurationSelector({
  targetDuration,
  onSelect,
  disabled,
  timeRemaining,
}: DurationSelectorProps) {
  const showCountdown = timeRemaining > 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 text-center">
        Session Length
      </h2>
      <div
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap"
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
              {formatTimeRemaining(timeRemaining)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
