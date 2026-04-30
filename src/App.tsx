import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Header, ErrorBoundary } from './components';
import { useBreathingEngine, useAudioFeedback, useKeyboardShortcuts, useHapticFeedback } from './hooks';
import { useStreakTracker } from './hooks/useStreakTracker';
import { useWeeklyGoal } from './hooks/useWeeklyGoal';

const BreathingCircle = lazy(() => import('./components/BreathingCircle').then((m) => ({ default: m.BreathingCircle })));
const Controls = lazy(() => import('./components/Controls').then((m) => ({ default: m.Controls })));
const SessionStats = lazy(() => import('./components/SessionStats').then((m) => ({ default: m.SessionStats })));
const PatternSelector = lazy(() => import('./components/PatternSelector').then((m) => ({ default: m.PatternSelector })));
const DurationSelector = lazy(() => import('./components/DurationSelector').then((m) => ({ default: m.DurationSelector })));
const SessionSummary = lazy(() => import('./components/SessionSummary').then((m) => ({ default: m.SessionSummary })));
const OnboardingTip = lazy(() => import('./components/OnboardingTip').then((m) => ({ default: m.OnboardingTip })));
const SessionHistory = lazy(() => import('./components/SessionHistory').then((m) => ({ default: m.SessionHistory })));
const WeeklyGoal = lazy(() => import('./components/WeeklyGoal').then((m) => ({ default: m.WeeklyGoal })));

export function App() {
  const engine = useBreathingEngine();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playPhaseSound, playCompletionSound } = useAudioFeedback(soundEnabled);
  const { vibratePhase, vibrateCompletion } = useHapticFeedback(true);
  const prevPhaseRef = useRef(engine.phase);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryStats, setSummaryStats] = useState(engine.stats);
  const hasCompletedSession = useRef(false);

  // Streak and weekly goal tracking
  const { streakData, recordSession: recordStreak } = useStreakTracker();
  const {
    weeklyGoal,
    sessionsThisWeek,
    goalReached,
    justReachedGoal,
    setWeeklyGoal,
    incrementSessions,
  } = useWeeklyGoal();

  useKeyboardShortcuts({
    onStart: engine.start,
    onPause: engine.pause,
    onReset: engine.reset,
    isActive: engine.isActive,
  });

  // Show summary when engine reports a completed session
  useEffect(() => {
    if (engine.lastSessionSummary !== null) {
      hasCompletedSession.current = true;
      setSummaryStats(engine.lastSessionSummary.stats);
      setShowSummary(true);
      playCompletionSound();
      vibrateCompletion();
      // Record streak and increment weekly sessions on session completion
      recordStreak();
      incrementSessions();
    }
  }, [engine.lastSessionSummary, playCompletionSound, vibrateCompletion, recordStreak, incrementSessions]);

  // Play audio and haptic on phase transitions
  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    const newPhase = engine.phase;

    if (newPhase !== prevPhase && newPhase !== 'idle') {
      playPhaseSound(newPhase);
      vibratePhase(newPhase);
    }

    prevPhaseRef.current = newPhase;
  }, [engine.phase, playPhaseSound, vibratePhase]);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev: boolean) => !prev);
  }, []);

  const handleDismissSummary = useCallback(() => {
    setShowSummary(false);
  }, []);

  const handleStartAgain = useCallback(() => {
    setShowSummary(false);
    engine.start();
  }, [engine]);

  const handleReset = useCallback(() => {
    engine.reset();
    setShowSummary(false);
  }, [engine]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative">
      {/* Skip-to-content link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none"
      >
        Skip to content
      </a>
      <Header soundEnabled={soundEnabled} onToggleSound={handleToggleSound} streakData={streakData} weeklyGoalData={{ sessionsThisWeek, weeklyGoal }} />

      <main id="main-content" className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-8 px-4 py-4 sm:py-6 overflow-y-auto">
        {/* Breathing visualization */}
        <Suspense fallback={
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center bg-gray-900/40 animate-pulse" aria-hidden="true">
            <div className="w-16 h-16 rounded-full border-2 border-gray-700/50 border-t-primary-500/50 animate-spin" />
          </div>
        }>
          <BreathingCircle
          phase={engine.phase}
          progress={engine.progress}
          secondsRemaining={engine.secondsRemaining}
        />
        </Suspense>

        {/* Session stats */}
        <Suspense fallback={null}>
          <SessionStats stats={engine.stats} isVisible={engine.isActive} />
        </Suspense>

        {/* Controls */}
        <Suspense fallback={null}>
          <Controls
            isActive={engine.isActive}
            onStart={engine.start}
            onPause={engine.pause}
            onReset={handleReset}
            totalCyclesEverCompleted={engine.totalCyclesEverCompleted}
          />
        </Suspense>

        {/* Duration selector */}
        <Suspense fallback={null}>
          <DurationSelector
            targetDuration={engine.targetDuration}
            onSelect={engine.setTargetDuration}
            disabled={engine.isActive}
            timeRemaining={engine.timeRemaining}
          />
        </Suspense>

        {/* Secondary controls — hidden during active session for focus */}
        {!engine.isActive && (
          <>
            {/* Pattern selector */}
            <ErrorBoundary>
              <Suspense fallback={null}>
                <PatternSelector
                  currentPattern={engine.currentPattern}
                  onSelectPattern={engine.setPattern}
                  disabled={engine.isActive}
                />
              </Suspense>
            </ErrorBoundary>

            {/* Weekly goal nudge */}
            <ErrorBoundary>
              <Suspense fallback={null}>
                <WeeklyGoal
                  weeklyGoal={weeklyGoal}
                  sessionsThisWeek={sessionsThisWeek}
                  goalReached={goalReached}
                  justReachedGoal={justReachedGoal}
                  onSetGoal={setWeeklyGoal}
                />
              </Suspense>
            </ErrorBoundary>

            {/* Session history with 28-day calendar */}
            <ErrorBoundary>
              <Suspense fallback={null}>
                <SessionHistory
                  history={engine.sessionHistory}
                  onClear={engine.clearHistory}
                />
              </Suspense>
            </ErrorBoundary>
          </>
        )}
      </main>

      <footer className="py-4 text-center" role="contentinfo">
        <p className="text-xs text-gray-600">
          Focus on your breath. Find your calm.
        </p>
      </footer>

      {/* Session summary overlay */}
      <Suspense fallback={null}>
        <SessionSummary
          stats={summaryStats}
          pattern={engine.currentPattern}
          isVisible={showSummary}
          onDismiss={handleDismissSummary}
          onStartAgain={handleStartAgain}
          targetDuration={engine.targetDuration}
        />
      </Suspense>

      {/* Onboarding tips for new users */}
      <Suspense fallback={null}>
        <OnboardingTip hasCompletedASession={hasCompletedSession.current} />
      </Suspense>
    </div>
  );
}
