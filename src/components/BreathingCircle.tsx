import { useMemo } from 'react';
import type { BreathingPhase } from '../types';
import { PHASE_LABELS, PHASE_COLORS, PHASE_GUIDANCE } from '../types';
import { usePrefersReducedMotion } from '../hooks';

interface BreathingCircleProps {
  phase: BreathingPhase;
  progress: number;
  secondsRemaining: number;
  phaseSequence?: readonly { phase: BreathingPhase; seconds: number }[];
  currentPhaseIndex?: number;
}

const CIRCLE_SIZE = 224; // 56 * 4 for crisp SVG
const CIRCLE_RADIUS = 108;
const STROKE_WIDTH = 3;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const RESPONSIVE_CIRCLE_SIZE = 256; // 64 * 4 for sm
const RESPONSIVE_CIRCLE_RADIUS = 124;
const RESPONSIVE_CIRCUMFERENCE = 2 * Math.PI * RESPONSIVE_CIRCLE_RADIUS;

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

/**
 * Phase ring indicator — shows tiny colored dots around the circle perimeter
 * to give a spatial sense of the full breathing cycle timing.
 * Each dot represents 1 second of the cycle, colored by its phase.
 */
function PhaseIndicatorRing({
  phaseSequence,
  currentPhaseIndex,
  phaseProgress,
}: {
  phaseSequence: readonly { phase: BreathingPhase; seconds: number }[];
  currentPhaseIndex: number;
  phaseProgress: number;
}) {
  const totalSeconds = phaseSequence.reduce((sum, p) => sum + p.seconds, 0);
  const dots = useMemo(() => {
    const result: { id: number; angleDeg: number; color: string; lit: boolean }[] = [];
    let idx = 0;
    for (const seg of phaseSequence) {
      for (let s = 0; s < seg.seconds; s++) {
        const angleDeg = (idx / totalSeconds) * 360 - 90;
        result.push({
          id: idx,
          angleDeg,
          color: PHASE_COLORS[seg.phase],
          lit: false,
        });
        idx++;
      }
    }
    return result;
  }, [phaseSequence, totalSeconds]);

  // Determine which dot is "current"
  let elapsedDotCount = 0;
  for (let i = 0; i < currentPhaseIndex; i++) {
    elapsedDotCount += phaseSequence[i].seconds;
  }
  const currentDot = elapsedDotCount + Math.floor(phaseProgress * phaseSequence[currentPhaseIndex].seconds);

  const radius = 132;

  return (
    <div className="absolute w-72 h-72 sm:w-80 sm:h-80 pointer-events-none" aria-hidden="true">
      {dots.map((d) => {
        const angleRad = (d.angleDeg * Math.PI) / 180;
        const isCurrent = d.id === currentDot;
        const isPast = d.id < currentDot;
        return (
          <div
            key={d.id}
            className="absolute rounded-full transition-opacity duration-200"
            style={{
              width: isCurrent ? '4px' : '2px',
              height: isCurrent ? '4px' : '2px',
              backgroundColor: d.color,
              opacity: isPast ? 0.15 : isCurrent ? 0.9 : 0.25,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translateX(${Math.cos(angleRad) * radius}px) translateY(${Math.sin(angleRad) * radius}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

function AmbientBackground({ phase }: { phase: BreathingPhase }) {
  const color = PHASE_COLORS[phase];
  if (phase === 'idle') return null;

  return (
    <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000 ease-out" aria-hidden="true">
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${color}08, transparent 60%)`,
          animation: 'ambientWave 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02] transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% 55%, ${color}, transparent 50%)`,
        }}
      />
    </div>
  );
}

function CircularProgressRing({
  progress,
  color,
  size,
  radius,
  circumference,
}: {
  progress: number;
  color: string;
  size: number;
  radius: number;
  circumference: number;
}) {
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg
      width={size / 4}
      height={size / 4}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute pointer-events-none"
      style={{ transform: 'rotate(-90deg)' }}
      aria-hidden="true"
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={STROKE_WIDTH}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: 'stroke-dashoffset 100ms linear, stroke 300ms ease-out',
          filter: `drop-shadow(0 0 6px ${color}66)`,
        }}
      />
    </svg>
  );
}

export function BreathingCircle({
  phase,
  progress,
  secondsRemaining,
  phaseSequence,
  currentPhaseIndex,
}: BreathingCircleProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scaleValue = useMemo(() => {
    if (phase === 'idle') return 0.45;
    if (phase === 'inhale') return 0.4 + progress * 0.6;
    if (phase === 'exhale') return 1 - progress * 0.6;
    return 1;
  }, [phase, progress]);

  const color = PHASE_COLORS[phase];
  const label = PHASE_LABELS[phase];
  const guidance = PHASE_GUIDANCE[phase];
  const isActive = phase !== 'idle';
  const transitionDuration = prefersReducedMotion ? '0ms' : '100ms';

  return (
    <>
      <AmbientBackground phase={phase} />
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6" role="img" aria-label={`Breathing phase: ${label}. ${guidance}`}>
        {/* Outer glow + particle ring */}
        <div className="relative flex items-center justify-center">
          {isActive && !prefersReducedMotion && (
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
              {/* Tertiary atmospheric glow */}
              <div
                className="absolute w-96 h-96 sm:w-[28rem] sm:h-[28rem] rounded-full opacity-[0.015] blur-3xl transition-colors duration-1000"
                style={{ backgroundColor: color }}
              />
              <ParticleRing color={color} />
              {/* Phase timing indicator — shows cycle progress spatially */}
              {phaseSequence && phaseSequence.length > 0 && currentPhaseIndex !== undefined && currentPhaseIndex >= 0 && (
                <PhaseIndicatorRing
                  phaseSequence={phaseSequence}
                  currentPhaseIndex={currentPhaseIndex}
                  phaseProgress={progress}
                />
              )}
            </>
          )}
          {isActive && prefersReducedMotion && (
            <div
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-[0.08] blur-2xl"
              style={{ backgroundColor: color }}
            />
          )}

          {/* Ambient ring for idle state — subtle pulsing glow with breathing animation */}
          {!isActive && !prefersReducedMotion && (
            <div
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-[0.06] blur-xl"
              style={{
                backgroundColor: '#6B7280',
                animation: 'idleBreath 6s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
          )}
          {!isActive && prefersReducedMotion && (
            <div
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-5 blur-xl border border-gray-700/30"
              aria-hidden="true"
            />
          )}

          {/* Idle invite ring — subtle outer ring that invites interaction */}
          {!isActive && !prefersReducedMotion && (
            <div
              className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-gray-700/20"
              style={{ animation: 'idleBreath 6s ease-in-out infinite' }}
              aria-hidden="true"
            />
          )}

          {/* Main circle */}
          <div
            className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center ${
              !isActive && !prefersReducedMotion ? 'idle-glow' : ''
            }`}
            style={{
              transform: `scale(${scaleValue})`,
              transition: `transform ${transitionDuration} linear`,
              background: isActive
                ? `radial-gradient(circle at 35% 35%, ${color}dd, ${color}88 60%, ${color}44)`
                : 'radial-gradient(circle at 35% 35%, #4B5563, #1F2937)',
              boxShadow: isActive
                ? `0 0 40px ${color}55, 0 0 80px ${color}33, 0 0 120px ${color}11, inset 0 0 30px ${color}22`
                : '0 0 30px rgba(75,85,99,0.15), inset 0 0 20px rgba(0,0,0,0.2)',
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
            {isActive && !prefersReducedMotion && (
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
                  className="text-4xl sm:text-5xl font-extralight text-white mt-1 tabular-nums tracking-wide"
                  style={{ textShadow: `0 0 30px ${color}66` }}
                >
                  {secondsRemaining}
                </p>
              )}
            </div>
          </div>

          {/* Circular progress ring overlay */}
          {isActive && (
            <>
              <div className="absolute w-56 h-56">
                <CircularProgressRing
                  progress={progress}
                  color={color}
                  size={CIRCLE_SIZE}
                  radius={CIRCLE_RADIUS}
                  circumference={CIRCUMFERENCE}
                />
              </div>
              <div className="absolute w-64 h-64 hidden sm:block">
                <CircularProgressRing
                  progress={progress}
                  color={color}
                  size={RESPONSIVE_CIRCLE_SIZE}
                  radius={RESPONSIVE_CIRCLE_RADIUS}
                  circumference={RESPONSIVE_CIRCUMFERENCE}
                />
              </div>
            </>
          )}
        </div>

        {/* Phase guidance text */}
        <p
          className={`text-xs sm:text-sm transition-all duration-300 max-w-xs text-center leading-relaxed ${
            isActive ? 'text-gray-400' : 'text-gray-500'
          }`}
          aria-live="polite"
          style={isActive ? { textShadow: `0 0 12px ${color}33` } : undefined}
        >
          {guidance}
        </p>

        {/* Phase progress bar (kept as secondary indicator) */}
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
