import { BREATHING_PATTERNS } from '../types';
import type { BreathingPattern } from '../types';

interface PatternSelectorProps {
  currentPattern: BreathingPattern;
  onSelectPattern: (pattern: BreathingPattern) => void;
  disabled: boolean;
}

export function PatternSelector({
  currentPattern,
  onSelectPattern,
  disabled,
}: PatternSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 text-center">
        Breathing Pattern
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="radiogroup" aria-label="Select breathing pattern">
        {BREATHING_PATTERNS.map((pattern) => {
          const isSelected = pattern.name === currentPattern.name;
          return (
            <button
              key={pattern.name}
              onClick={() => onSelectPattern(pattern)}
              disabled={disabled}
              role="radio"
              aria-checked={isSelected}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${
                  isSelected
                    ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/50'
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {pattern.name}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
        {currentPattern.description}
      </p>
    </div>
  );
}
