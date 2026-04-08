import { useMemo } from 'react';
import type { BreathingPhase } from '../types';
import { PHASE_LABELS, PHASE_COLORS } from '../types';

interface BreathingCircleProps {
  phase: BreathingPhase;
  progress: number;
  secondsRemaining: number;
}

function ParticleRing({ color }: { color: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30) * (Math.PI / 180),
      delay: i * 0.15,
      size: 3 + (((i * 7) % 5) * 0.5),
    }));
  }, []);

  return (
    <div className="absolute w-72 h-72 sm:w-80 sm:h-80 pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: color,
            opacity: 0.4,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translateX(${Math.cos(p.angle) * 140}px) translateY(${Math.sin(p.angle) * 140}px)`,
            animation: `particleFloat ${2 + p.delay}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function AmbientBackground({ phase }: { phase: BreathingPhase }) {
  const color = PHASE_COLORS[phase];
  if (phase === 'idle') return null;

  return (
    <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000 ease-out" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.03] transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${color}, transparent 70%)`,
        }}
      />
    </div>
  );
}

export function BreathingCircle({
  phase,
  progress,
  secondsRemaining,
}: BreathingCircleProps) {
  const scaleValue = useMemo(() => {
    if (phase === 'idle') return 0.4;
    if (phase === 'inhale') return 0.4 + progress * 0.6;
    if (phase === 'exhale') return 1 - progress * 0.6;
    return 1;
  }, [phase, progress]);

  const color = PHASE_COLORS[phase];
  const label = PHASE_LABELS[phase];
  const isActive = phase !== 'idle';

  return (
    <>
      <AmbientBackground phase={phase} />
      <div className="flex flex-col items-center justify-center gap-6" role="img" aria-label={`Breathing phase: ${label}`}>
        {/* Outer glow + particle ring */}
        <div className="relative flex items-center justify-center">
          {isActive && (
            <>
              <div
                className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-15 blur-2xl animate-pulse-ring"
                style={{ backgroundColor: color }}
              />
              {/* Secondary subtle glow ring */}
              <div
                className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full opacity-[0.04] blur-3xl transition-colors duration-700"
                style={{ backgroundColor: color }}
              />
              <ParticleRing color={color} />
            </>
          )}

          {/* Ambient ring for idle state */}
          {!isActive && (
            <div
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-5 blur-xl border border-gray-700/30"
              aria-hidden="true"
            />
          )}

          {/* Main circle */}
          <div
            className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center"
            style={{
              transform: `scale(${scaleValue})`,
              transition: 'transform 100ms linear',
              background: isActive
                ? `radial-gradient(circle at 35% 35%, ${color}dd, ${color}88 60%, ${color}44)`
                : 'radial-gradient(circle at 35% 35%, #4B5563, #1F2937)',
              boxShadow: isActive
                ? `0 0 40px ${color}55, 0 0 80px ${color}33, 0 0 120px ${color}11, inset 0 0 30px ${color}22`
                : '0 0 20px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2)',
            }}
          >
            {/* Inner highlight */}
            <div
              className="absolute inset-2 rounded-full opacity-30"
              style={{
                background: isActive
                  ? `radial-gradient(circle at 30% 25%, white, transparent 60%)`
                  : `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.1), transparent 60%)`,
              }}
              aria-hidden="true"
            />

            {/* Ripple effect on phase change */}
            {isActive && (
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-10"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
            )}

            {/* Inner content */}
            <div className="text-center z-10 relative">
              <p
                className={`text-base sm:text-lg font-medium tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
                style={{ textShadow: isActive ? `0 0 20px ${color}88` : 'none' }}
              >
                {label}
              </p>
              {isActive && secondsRemaining > 0 && (
                <p
                  className="text-4xl sm:text-5xl font-extralight text-white mt-1 tabular-nums"
                  style={{ textShadow: `0 0 30px ${color}66` }}
                >
                  {secondsRemaining}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phase progress bar */}
        {isActive && (
          <div
            className="w-48 sm:w-56 h-1.5 bg-gray-800/80 rounded-full overflow-hidden backdrop-blur-sm"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${label} progress`}
          >
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}88`,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
