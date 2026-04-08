import { useCallback, useEffect, useRef, useState } from 'react';
import { Header, BreathingCircle, Controls, PatternSelector, SessionStats, SessionSummary, OnboardingTip, DurationSelector, SessionHistory } from './components';
import { useBreathingEngine, useAudioFeedback, useKeyboardShortcuts } from './hooks';

export function App() {
  const engine = useBreathingEngine();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playPhaseSound, playCompletionSound } = useAudioFeedback(soundEnabled);
  const prevPhaseRef = useRef(engine.phase);
  const prevIsActiveRef = useRef(engine.isActive);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryStats, setSummaryStats] = useState(engine.stats);
  const hasCompletedSession = useRef(false);

  useKeyboardShortcuts({
    onStart: engine.start,
    onPause: engine.pause,
    onReset: engine.reset,
    isActive: engine.isActive,
  });

  // Play audio on phase transitions
  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    const newPhase = engine.phase;

    // Detect phase change to an active phase
    if (newPhase !== prevPhase && newPhase !== 'idle') {
      playPhaseSound(newPhase);
    }

    // Detect session pause after active (completion)
    if (prevIsActiveRef.current && !engine.isActive && prevPhase !== 'idle') {
      if (engine.cyclesCompleted > 0) {
        playCompletionSound();
        hasCompletedSession.current = true;
        setSummaryStats(engine.stats);
        setShowSummary(true);
      }
    }

    prevPhaseRef.current = newPhase;
    prevIsActiveRef.current = engine.isActive;
  }, [engine.phase, engine.isActive, engine.cyclesCompleted, engine.stats, playPhaseSound, playCompletionSound]);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev: boolean) => !prev);
  }, []);

  const handleDismissSummary = useCallback(() => {
    setShowSummary(false);
  }, []);

  const handleReset = useCallback(() => {
    engine.reset();
    setShowSummary(false);
  }, [engine]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative">
      <Header soundEnabled={soundEnabled} onToggleSound={handleToggleSound} />

      <main className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 py-4 sm:py-6">
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
      <SessionSummary
        stats={summaryStats}
        pattern={engine.currentPattern}
        isVisible={showSummary}
        onDismiss={handleDismissSummary}
        targetDuration={engine.targetDuration}
      />

      {/* Onboarding tips for new users */}
      <OnboardingTip hasCompletedASession={hasCompletedSession.current} />
    </div>
  );
}
