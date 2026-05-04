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
            className="group relative px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 min-w-[140px] shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35"
            aria-label="Start breathing session"
          >
            <span className="relative z-10">Start</span>
            <div className="absolute inset-0 rounded-2xl bg-primary-400/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
          </button>
        ) : (
          <>
            <button
              onClick={onPause}
              className="px-6 py-3 bg-gray-700/90 hover:bg-gray-600 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 min-w-[100px] backdrop-blur-sm"
              aria-label="Pause breathing session"
            >
              Pause
            </button>
            <button
              onClick={onReset}
              className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700 text-gray-300 font-medium rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 min-w-[100px] backdrop-blur-sm"
              aria-label="Reset breathing session"
            >
              Reset
            </button>
          </>
        )}
      </div>

      {/* Keyboard shortcut hints — hidden on small screens (touch devices) */}
      <div className="hidden sm:flex items-center gap-4 text-[10px] text-gray-600 select-none" aria-hidden="true">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-800/60 rounded text-gray-500 font-mono text-[10px] border border-gray-700/40">Space</kbd>
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-800/60 rounded text-gray-500 font-mono text-[10px] border border-gray-700/40">Esc</kbd>
          <span>Pause</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-800/60 rounded text-gray-500 font-mono text-[10px] border border-gray-700/40">R</kbd>
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
