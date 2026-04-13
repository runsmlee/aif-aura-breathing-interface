interface WeeklyGoalProps {
  weeklyGoal: number;
  sessionsThisWeek: number;
  goalReached: boolean;
  justReachedGoal: boolean;
  onSetGoal: (goal: number) => void;
}

export function WeeklyGoal({
  weeklyGoal,
  sessionsThisWeek,
  goalReached,
  justReachedGoal,
  onSetGoal,
}: WeeklyGoalProps) {
  const progress = Math.min((sessionsThisWeek / weeklyGoal) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="px-4 py-3 bg-gray-900/40 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-medium">
            {sessionsThisWeek} of {weeklyGoal} this week
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSetGoal(Math.max(1, weeklyGoal - 1))}
              className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-200 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              aria-label="Decrease weekly goal"
            >
              −
            </button>
            <button
              onClick={() => onSetGoal(Math.min(14, weeklyGoal + 1))}
              className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-200 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              aria-label="Increase weekly goal"
            >
              +
            </button>
          </div>
        </div>

        <div
          className="w-full h-1.5 bg-gray-800/60 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={sessionsThisWeek}
          aria-valuemin={0}
          aria-valuemax={weeklyGoal}
          aria-label={`Weekly progress: ${sessionsThisWeek} of ${weeklyGoal}`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              goalReached
                ? 'bg-primary-400'
                : 'bg-primary-500/70'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {justReachedGoal && (
          <div
            className="mt-2 text-center text-xs text-primary-400 font-medium animate-fade-in"
            role="status"
            aria-live="polite"
          >
            Goal reached! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
