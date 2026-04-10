import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Header, BreathingCircle, Controls, PatternSelector, SessionStats, DurationSelector, SessionHistory } from './components';
import { useBreathingEngine, useAudioFeedback, useKeyboardShortcuts, useHapticFeedback } from './hooks';

const SessionSummary = lazy(() => import('./components/SessionSummary').then((m) => ({ default: m.SessionSummary })));
const OnboardingTip = lazy(() => import('./components/OnboardingTip').then((m) => ({ default: m.OnboardingTip })));

export function App() {
  const engine = useBreathingEngine();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled] = useState(true);
  const { playPhaseSound, playCompletionSound } = useAudioFeedback(soundEnabled);
  const { vibratePhase, vibrateCompletion } = useHapticFeedback(hapticEnabled);
  const prevPhaseRef = useRef(engine.phase);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryStats, setSummaryStats] = useState(engine.stats);
  const hasCompletedSession = useRef(false);

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
    }
  }, [engine.lastSessionSummary, playCompletionSound, vibrateCompletion]);

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
      <Header soundEnabled={soundEnabled} onToggleSound={handleToggleSound} />

      <main className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-8 px-4 py-4 sm:py-6 overflow-y-auto">
        {/* Breathing visualization */}
        <BreathingCircle
          phase={engine.phase}
          progress={engine.progress}
          secondsRemaining={engine.secondsRemaining}
        />

        {/* Session stats */}
        <SessionStats stats={engine.stats} isVisible={engine.isActive} />

        {/* Controls */}
        <Controls
          isActive={engine.isActive}
          onStart={engine.start}
          onPause={engine.pause}
          onReset={handleReset}
          totalCyclesEverCompleted={engine.totalCyclesEverCompleted}
        />

        {/* Duration selector */}
        <DurationSelector
          targetDuration={engine.targetDuration}
          onSelect={engine.setTargetDuration}
          disabled={engine.isActive}
          timeRemaining={engine.timeRemaining}
        />

        {/* Pattern selector */}
        <PatternSelector
          currentPattern={engine.currentPattern}
          onSelectPattern={engine.setPattern}
          disabled={engine.isActive}
        />

        {/* Session history */}
        <SessionHistory
          history={engine.sessionHistory}
          onClear={engine.clearHistory}
        />
      </main>

      <footer className="py-4 text-center">
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
