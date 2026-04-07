import { useMemo } from 'react';
import type { BreathingPhase } from '../types';
import { PHASE_LABELS, PHASE_COLORS } from '../types';

interface BreathingCircleProps {
  phase: BreathingPhase;
  progress: number;
  secondsRemaining: number;
}

function ParticleRing({ color, isActive }: { color: string; isActive: boolean }) {
  if (!isActive) return null;

  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30) * (Math.PI / 180),
      delay: i * 0.15,
      size: 3 + Math.random() * 2,
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
    <div className="flex flex-col items-center justify-center gap-6" role="img" aria-label={`Breathing phase: ${label}`}>
      {/* Outer glow + particle ring */}
      <div className="relative flex items-center justify-center">
        {isActive && (
          <>
            <div
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-15 blur-2xl animate-pulse-ring"
              style={{ backgroundColor: color }}
            />
            <ParticleRing color={color} isActive={isActive} />
          </>
        )}

        {/* Main circle */}
        <div
          className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center"
          style={{
            transform: `scale(${scaleValue})`,
            transition: 'transform 300ms ease-in-out',
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
  );
}
