interface ControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  totalCyclesEverCompleted: number;
}

export function Controls({
  isActive,
  onStart,
  onPause,
  onReset,
  totalCyclesEverCompleted,
}: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        {!isActive ? (
          <button
            onClick={onStart}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 min-w-[140px] shadow-lg shadow-primary-500/20"
            aria-label="Start breathing session"
          >
            Start
          </button>
        ) : (
          <>
            <button
              onClick={onPause}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              aria-label="Pause breathing session"
            >
              Pause
            </button>
            <button
              onClick={onReset}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              aria-label="Reset breathing session"
            >
              Reset
            </button>
          </>
        )}
      </div>

      {/* Keyboard shortcut hints */}
      <div className="flex items-center gap-4 text-[10px] text-gray-600" aria-hidden="true">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-800/60 rounded text-gray-500 font-mono text-[10px]">
            Space
          </kbd>
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-800/60 rounded text-gray-500 font-mono text-[10px]">
            Esc
          </kbd>
          <span>Reset</span>
        </span>
      </div>

      {/* Lifetime cycles counter */}
      {totalCyclesEverCompleted > 0 && !isActive && (
        <p className="text-xs text-gray-500 animate-fade-in">
          {totalCyclesEverCompleted} {totalCyclesEverCompleted === 1 ? 'cycle' : 'cycles'} completed
        </p>
      )}
    </div>
  );
}
