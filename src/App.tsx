import { Header, BreathingCircle, Controls, PatternSelector, SessionStats } from './components';
import { useBreathingEngine } from './hooks';

export function App() {
  const engine = useBreathingEngine();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center gap-8 sm:gap-10 px-4 py-6 sm:py-8">
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
          onReset={engine.reset}
        />

        {/* Pattern selector */}
        <PatternSelector
          currentPattern={engine.currentPattern}
          onSelectPattern={engine.setPattern}
          disabled={engine.isActive}
        />
      </main>

      <footer className="py-4 text-center">
        <p className="text-xs text-gray-600">
          Focus on your breath. Find your calm.
        </p>
      </footer>
    </div>
  );
}
