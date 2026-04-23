import type { StreakData } from '../types';

interface WeeklyGoalData {
  sessionsThisWeek: number;
  weeklyGoal: number;
}

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  streakData?: StreakData;
  weeklyGoalData?: WeeklyGoalData;
}

export function Header({ soundEnabled, onToggleSound, streakData, weeklyGoalData }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-4 sm:py-6" role="banner">
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" aria-hidden="true" />
        <div>
          <h1 className="text-lg sm:text-xl font-medium tracking-wide text-white leading-tight">
            Aura
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-500 tracking-wider uppercase">
            Breathing Interface
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {streakData && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              streakData.currentStreak > 0
                ? 'bg-primary-500/10 text-primary-400'
                : 'text-gray-600'
            }`}
            role="status"
            aria-live="polite"
            aria-label={`Streak: ${streakData.currentStreak} days`}
          >
            {streakData.currentStreak > 0 ? (
              <>
                <span aria-hidden="true">🔥</span>
                <span className="tabular-nums">{streakData.currentStreak}</span>
                <span className="hidden sm:inline"> day{streakData.currentStreak !== 1 ? 's' : ''} streak</span>
              </>
            ) : (
              <span>Start your streak</span>
            )}
          </div>
        )}

        {weeklyGoalData && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              weeklyGoalData.sessionsThisWeek >= weeklyGoalData.weeklyGoal
                ? 'bg-primary-500/20 text-primary-300'
                : 'text-gray-500'
            }`}
            role="status"
            aria-live="polite"
            aria-label={`Weekly goal: ${weeklyGoalData.sessionsThisWeek} of ${weeklyGoalData.weeklyGoal} sessions`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
              <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z" clipRule="evenodd" />
            </svg>
            <span className="tabular-nums">{weeklyGoalData.sessionsThisWeek}/{weeklyGoalData.weeklyGoal}</span>
          </div>
        )}

        <button
          onClick={onToggleSound}
          className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
