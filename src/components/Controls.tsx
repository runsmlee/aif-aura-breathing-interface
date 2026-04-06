interface ControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function Controls({ isActive, onStart, onPause, onReset }: ControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {!isActive ? (
        <button
          onClick={onStart}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 min-w-[140px]"
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
  );
}
