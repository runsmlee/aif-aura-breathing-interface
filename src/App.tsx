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

      <main id="main-content" className="flex-1 flex flex-col overflow-y-auto">
        {/* Centered breathing interface */}
        <div className={`flex-1 flex flex-col items-center justify-center gap-4 sm:gap-8 px-4 py-4 sm:py-6 transition-all duration-500 ${engine.isActive ? 'session-active' : ''}`}>
          {/* Brand-forward H1 and benefit copy — visible when idle */}
          {!engine.isActive && (
            <div className="text-center max-w-md space-y-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-medium tracking-wide text-white leading-snug">
                Box Breathing Timer
              </h1>
              <p className="text-base sm:text-lg font-light text-teal-400/80 tracking-wide">
                Calm your mind in 60 seconds
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Follow the breathing circle to pace each inhale and exhale. Whether you need a quick breathing exercise for anxiety, a breathing technique for sleep, or want to learn how to do 4-7-8 breathing, just tap the circle and follow along. No signup, no ads — just breathe.
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
            onStart={!engine.isActive ? engine.start : undefined}
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
        </div>

        {/* Structured SEO content — below the fold, visible only when idle */}
        {!engine.isActive && (
          <section aria-label="Breathing techniques guide" className="max-w-2xl mx-auto px-6 py-12 sm:py-16 space-y-12">
            <div>
              <h2 className="text-lg sm:text-xl font-medium tracking-wide text-white mb-3">Box Breathing for Anxiety and Stress Relief</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Box breathing — also known as four-square breathing or tactical breathing — uses equal 4-second phases: inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Originally developed for Navy SEALs to maintain composure under extreme pressure, this technique activates your parasympathetic nervous system and measurably lowers cortisol levels within minutes.
              </p>
              <h3 className="text-sm font-medium text-gray-300 mb-2">When to use box breathing for anxiety</h3>
              <ul className="text-sm text-gray-400 leading-relaxed space-y-1 mb-4 list-disc list-inside">
                <li>Before a stressful meeting, presentation, or difficult conversation</li>
                <li>During an anxiety spike or panic episode to regain control</li>
                <li>Before bed to calm a racing mind</li>
                <li>Anytime you need to reset quickly and regain focus</li>
              </ul>
              <h3 className="text-sm font-medium text-gray-300 mb-2">How It Helps</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The equal timing creates a predictable rhythm that your nervous system can synchronize with. The hold phases give your body time to absorb oxygen and signal safety to your brain. Studies show that just 5 minutes of box breathing can reduce blood pressure and heart rate, making it one of the fastest evidence-based techniques for acute stress relief.
              </p>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium tracking-wide text-white mb-3">4-7-8 Breathing for Sleep and Deep Relaxation</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                The 4-7-8 breathing technique, popularized by Dr. Andrew Weil, follows a structured 4-second inhale, 7-second hold, and 8-second exhale pattern. The extended hold and exhale phases create a natural braking effect on your nervous system, slowing your heart rate and signaling your body that it is safe to relax.
              </p>
              <h3 className="text-sm font-medium text-gray-300 mb-2">When to use 4-7-8 breathing for sleep</h3>
              <ul className="text-sm text-gray-400 leading-relaxed space-y-1 mb-4 list-disc list-inside">
                <li>Lying in bed when you cannot fall asleep</li>
                <li>During nighttime anxiety or racing thoughts</li>
                <li>After a stressful day to decompress</li>
                <li>For generalized anxiety and panic episodes</li>
              </ul>
              <h3 className="text-sm font-medium text-gray-300 mb-2">How It Helps</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The long exhale phase activates your vagus nerve, which controls your parasympathetic nervous system. This shifts your body from "fight or flight" to "rest and digest" mode. Many people report falling asleep within minutes of starting the 4-7-8 technique, making it one of the most popular natural sleep aids available.
              </p>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium tracking-wide text-white mb-3">Coherent Breathing for Heart Rate Variability</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Coherent breathing uses equal 5-second inhale and 5-second exhale phases, producing a steady 6 breaths per minute. Research demonstrates that coherent breathing synchronizes your heart rate variability (HRV) with your respiratory cycle, optimizing vagal tone and autonomic balance for whole-body benefits.
              </p>
              <h3 className="text-sm font-medium text-gray-300 mb-2">When to use coherent breathing</h3>
              <ul className="text-sm text-gray-400 leading-relaxed space-y-1 mb-4 list-disc list-inside">
                <li>Daily practice for long-term stress resilience</li>
                <li>Before meditation to settle the mind</li>
                <li>During work sessions to maintain focus and clarity</li>
                <li>As a warm-up before physical exercise or performance</li>
              </ul>
              <h3 className="text-sm font-medium text-gray-300 mb-2">How It Helps</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                By breathing at 6 breaths per minute, you naturally stimulate your baroreflex — the mechanism that regulates blood pressure. Regular coherent breathing practice improves heart rate variability, which is a key indicator of cardiovascular health and stress resilience. Even a single 10-minute session can improve focus and calm for hours afterward.
              </p>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium tracking-wide text-white mb-3">How Aura&apos;s Breathing Exercises Work</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Aura guides you with a visual breathing circle that expands as you inhale and contracts as you exhale. A color-coded progress ring shows your current phase — teal for inhale, amber for hold, red for exhale — with a countdown timer inside so you always know how many seconds remain. Simply choose a breathing technique, tap the circle to start, and follow the rhythm. No accounts, no subscriptions, no distractions — just free guided breathing exercises that work anywhere, on any device.
              </p>
            </div>
          </section>
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
