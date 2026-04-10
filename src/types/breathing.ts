export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'idle';

export interface BreathingPattern {
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfterExhale: number;
}

export interface SessionStats {
  cyclesCompleted: number;
  totalDuration: number;
  breathsPerMinute: number;
}

export type SessionDuration = 0 | 2 | 5 | 10 | 15 | 20;

export interface SessionDurationOption {
  value: SessionDuration;
  label: string;
}

export const SESSION_DURATION_OPTIONS: SessionDurationOption[] = [
  { value: 0, label: 'Free' },
  { value: 2, label: '2 min' },
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
];

export interface SessionRecord {
  date: string;
  pattern: string;
  cycles: number;
  duration: number;
  targetDuration: number;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: 'Box Breathing',
    description: 'Equal parts inhale, hold, exhale, hold. Used by Navy SEALs for calm focus.',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
  },
  {
    name: '4-7-8 Relaxation',
    description: 'Dr. Weil\'s technique for deep relaxation and better sleep.',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfterExhale: 0,
  },
  {
    name: 'Coherent Breathing',
    description: 'Gentle 5-second cycle to balance your nervous system.',
    inhale: 5,
    hold: 0,
    exhale: 5,
    holdAfterExhale: 0,
  },
  {
    name: 'Energizing Breath',
    description: 'Quick cycles to boost alertness and energy.',
    inhale: 2,
    hold: 0,
    exhale: 2,
    holdAfterExhale: 0,
  },
];

export const PHASE_LABELS: Record<BreathingPhase, string> = {
  idle: 'Ready',
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
};

export const PHASE_GUIDANCE: Record<BreathingPhase, string> = {
  idle: 'Press Start to begin your session',
  inhale: 'Slowly breathe in through your nose',
  hold: 'Hold your breath gently',
  exhale: 'Slowly release through your mouth',
};

export const PHASE_COLORS: Record<BreathingPhase, string> = {
  idle: '#6B7280',
  inhale: '#14B8A6',
  hold: '#F59E0B',
  exhale: '#EF4444',
};
