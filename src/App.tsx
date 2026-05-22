import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Header, ErrorBoundary } from './components';
import { BreathingCircle } from './components/BreathingCircle';
import { Controls } from './components/Controls';
import { SessionStats } from './components/SessionStats';
import { useBreathingEngine, useAudioFeedback, useKeyboardShortcuts, useHapticFeedback } from './hooks';
import { useStreakTracker } from './hooks/useStreakTracker';
import { useWeeklyGoal } from './hooks/useWeeklyGoal';
import { usePersonalBest } from './hooks/usePersonalBest';
import { PHASE_COLORS } from './types';
import { formatPatternTiming } from './utils';

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

  // Personal best tracking
  const { personalBest, isNewBest, recordSession: recordPersonalBest } = usePersonalBest();

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
      // Record personal best
      recordPersonalBest(engine.lastSessionSummary.stats, engine.currentPattern.name);
    }
  }, [engine.lastSessionSummary, playCompletionSound, vibrateCompletion, recordStreak, incrementSessions, recordPersonalBest, engine.currentPattern.name]);

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
  }, [engine.start]);

  const handleReset = useCallback(() => {
    engine.reset();
    setShowSummary(false);
  }, [engine.reset]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative">
      {/* Skip-to-content link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none"
      >
        Skip to content
      </a>
      <Header soundEnabled={soundEnabled} onToggleSound={handleToggleSound} streakData={streakData} weeklyGoalData={{ sessionsThisWeek, weeklyGoal }} isSessionActive={engine.isActive} />

      <main id="main-content" className={`flex-1 flex flex-col items-center justify-center gap-4 sm:gap-8 px-4 py-4 sm:py-6 overflow-y-auto transition-all duration-500 ${engine.isActive ? 'session-active' : ''}`}>
        {/* SEO-targeted heading and benefit copy — visible when idle */}
        {!engine.isActive && (
          <div className="text-center max-w-md space-y-2 mb-2">
            <h1 className="text-xl sm:text-2xl font-medium tracking-wide text-white leading-snug">
              Breathing Exercises for Calm, Focus & Sleep
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Simple guided breathing patterns — box breathing, 4-7-8, and coherent breathing. Visual pacing keeps you on rhythm.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              No signup, no ads, just breathe.
            </p>
          </div>
        )}
        {/* Breathing visualization */}
        <BreathingCircle
          phase={engine.phase}
          progress={engine.progress}
          secondsRemaining={engine.secondsRemaining}
          phaseSequence={engine.phaseSequence}
          currentPhaseIndex={engine.currentPhaseIndex}
          cyclesCompleted={engine.cyclesCompleted}
          patternTiming={formatPatternTiming(engine.currentPattern)}
        />

        {/* Session stats */}
        <SessionStats stats={engine.stats} isVisible={engine.isActive} timeRemaining={engine.timeRemaining} targetDuration={engine.targetDuration} />

        {/* Controls */}
        <Controls
          isActive={engine.isActive}
          onStart={engine.start}
          onPause={engine.pause}
          onReset={handleReset}
          totalCyclesEverCompleted={engine.totalCyclesEverCompleted}
          phaseColor={engine.isActive ? PHASE_COLORS[engine.phase] : undefined}
        />

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

      <footer className="py-3 sm:py-4 text-center" role="contentinfo">
        <p className="text-[10px] sm:text-xs text-gray-600/80 tracking-wide transition-opacity duration-300">
          Focus on your breath. Find your calm.
        </p>
      </footer>

      {/* Session summary overlay */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <SessionSummary
            stats={summaryStats}
            pattern={engine.currentPattern}
            isVisible={showSummary}
            onDismiss={handleDismissSummary}
            onStartAgain={handleStartAgain}
            targetDuration={engine.targetDuration}
            isNewBest={isNewBest}
            personalBest={personalBest}
          />
        </Suspense>
      </ErrorBoundary>

      {/* Onboarding tips for new users */}
      <Suspense fallback={null}>
        <OnboardingTip hasCompletedASession={hasCompletedSession.current} />
      </Suspense>
    </div>
  );
}
