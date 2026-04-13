import { useState, useMemo, useCallback, useEffect } from 'react';
import { BREATHING_PATTERNS, CUSTOM_PATTERNS_KEY, MAX_CUSTOM_PATTERNS } from '../types';
import type { BreathingPattern, CustomPattern } from '../types';

interface PatternSelectorProps {
  currentPattern: BreathingPattern;
  onSelectPattern: (pattern: BreathingPattern) => void;
  disabled: boolean;
}

function formatPatternTiming(pattern: BreathingPattern): string {
  const parts: string[] = [];
  if (pattern.inhale > 0) parts.push(`${pattern.inhale}s in`);
  if (pattern.hold > 0) parts.push(`${pattern.hold}s hold`);
  if (pattern.exhale > 0) parts.push(`${pattern.exhale}s out`);
  if (pattern.holdAfterExhale > 0) parts.push(`${pattern.holdAfterExhale}s hold`);
  return parts.join(' · ');
}

function loadCustomPatterns(): CustomPattern[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PATTERNS_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as CustomPattern[];
    }
  } catch {
    // Ignore
  }
  return [];
}

function saveCustomPatterns(patterns: CustomPattern[]): void {
  try {
    const trimmed = patterns.slice(0, MAX_CUSTOM_PATTERNS);
    localStorage.setItem(CUSTOM_PATTERNS_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage unavailable
  }
}

function customToBreathingPattern(custom: CustomPattern): BreathingPattern {
  return {
    name: custom.name,
    description: `Custom: ${custom.inhale}s in · ${custom.holdIn}s hold · ${custom.exhale}s out · ${custom.holdOut}s hold`,
    inhale: custom.inhale,
    hold: custom.holdIn,
    exhale: custom.exhale,
    holdAfterExhale: custom.holdOut,
  };
}

function PatternTimeline({ inhale, holdIn, exhale, holdOut }: { inhale: number; holdIn: number; exhale: number; holdOut: number }) {
  const total = inhale + holdIn + exhale + holdOut;
  if (total === 0) return null;

  const segments = [
    { width: (inhale / total) * 100, color: '#14B8A6', label: 'Inhale' },
    { width: (holdIn / total) * 100, color: '#F59E0B', label: 'Hold' },
    { width: (exhale / total) * 100, color: '#EF4444', label: 'Exhale' },
    { width: (holdOut / total) * 100, color: '#F59E0B', label: 'Hold' },
  ].filter((s) => s.width > 0);

  return (
    <div
      data-testid="custom-pattern-timeline"
      className="flex rounded-full overflow-hidden h-2 mt-3"
      role="img"
      aria-label={`Pattern timeline: ${inhale}s inhale, ${holdIn}s hold, ${exhale}s exhale, ${holdOut}s hold`}
    >
      {segments.map((seg, i) => (
        <div
          key={`${seg.label}-${i}`}
          className="h-full transition-all duration-300"
          style={{ width: `${seg.width}%`, backgroundColor: seg.color }}
          title={`${seg.label}: ${seg.width.toFixed(0)}%`}
        />
      ))}
    </div>
  );
}

function CustomPatternEditor({
  onSelectPattern,
  disabled,
  customPatterns,
  setCustomPatterns,
}: {
  onSelectPattern: (pattern: BreathingPattern) => void;
  disabled: boolean;
  customPatterns: CustomPattern[];
  setCustomPatterns: (p: CustomPattern[]) => void;
}) {
  const [inhale, setInhale] = useState(4);
  const [holdIn, setHoldIn] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [holdOut, setHoldOut] = useState(0);
  const [name, setName] = useState('');

  const handleSave = useCallback(() => {
    const patternName = name.trim() || `Custom ${customPatterns.length + 1}`;
    const newPattern: CustomPattern = {
      id: `custom-${Date.now()}`,
      name: patternName,
      inhale,
      holdIn,
      exhale,
      holdOut,
      savedAt: new Date().toISOString(),
    };
    const updated = [...customPatterns, newPattern].slice(0, MAX_CUSTOM_PATTERNS);
    setCustomPatterns(updated);
    saveCustomPatterns(updated);
    setName('');

    const bp = customToBreathingPattern(newPattern);
    onSelectPattern(bp);
  }, [name, inhale, holdIn, exhale, holdOut, customPatterns, setCustomPatterns, onSelectPattern]);

  return (
    <div className="mt-3 p-3 bg-gray-900/60 rounded-xl space-y-3 animate-fade-in">
      <PatternTimeline inhale={inhale} holdIn={holdIn} exhale={exhale} holdOut={holdOut} />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider w-14 flex-shrink-0">Inhale</label>
          <input
            type="range"
            min={1}
            max={10}
            value={inhale}
            onChange={(e) => setInhale(Number(e.target.value))}
            disabled={disabled}
            className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
            aria-label="Inhale duration"
          />
          <span className="text-xs text-gray-400 w-8 text-right tabular-nums">{inhale}s</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider w-14 flex-shrink-0">Hold</label>
          <input
            type="range"
            min={0}
            max={10}
            value={holdIn}
            onChange={(e) => setHoldIn(Number(e.target.value))}
            disabled={disabled}
            className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
            aria-label="Hold after inhale duration"
          />
          <span className="text-xs text-gray-400 w-8 text-right tabular-nums">{holdIn}s</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider w-14 flex-shrink-0">Exhale</label>
          <input
            type="range"
            min={1}
            max={10}
            value={exhale}
            onChange={(e) => setExhale(Number(e.target.value))}
            disabled={disabled}
            className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
            aria-label="Exhale duration"
          />
          <span className="text-xs text-gray-400 w-8 text-right tabular-nums">{exhale}s</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider w-14 flex-shrink-0">Hold</label>
          <input
            type="range"
            min={0}
            max={10}
            value={holdOut}
            onChange={(e) => setHoldOut(Number(e.target.value))}
            disabled={disabled}
            className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
            aria-label="Hold after exhale duration"
          />
          <span className="text-xs text-gray-400 w-8 text-right tabular-nums">{holdOut}s</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Custom ${customPatterns.length + 1}`}
          maxLength={30}
          disabled={disabled}
          className="flex-1 px-3 py-1.5 bg-gray-800/60 rounded-lg text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
          aria-label="Pattern name"
        />
        <button
          onClick={handleSave}
          disabled={disabled}
          className="px-3 py-1.5 bg-primary-600/80 text-white text-xs font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          aria-label="Save pattern"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export function PatternSelector({
  currentPattern,
  onSelectPattern,
  disabled,
}: PatternSelectorProps) {
  const [customPatterns, setCustomPatterns] = useState<CustomPattern[]>(loadCustomPatterns);
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  const isCustomSelected = currentPattern.name === 'Custom' || customPatterns.some((p) => p.name === currentPattern.name);

  // Re-sync when external storage changes
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === CUSTOM_PATTERNS_KEY && e.newValue) {
        try {
          const parsed: CustomPattern[] = JSON.parse(e.newValue);
          setCustomPatterns(parsed);
        } catch {
          // Ignore
        }
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  interface PatternDisplay extends BreathingPattern {
    isCustom: boolean;
    customId?: string;
  }

  const allPatterns = useMemo((): PatternDisplay[] => {
    const builtIn: PatternDisplay[] = BREATHING_PATTERNS.map((p) => ({ ...p, isCustom: false }));
    const custom: PatternDisplay[] = customPatterns.map((cp) => ({
      ...customToBreathingPattern(cp),
      isCustom: true,
      customId: cp.id,
    }));
    return [...builtIn, ...custom];
  }, [customPatterns]);

  const handleSelectCustom = useCallback(() => {
    const defaultCustom: BreathingPattern = {
      name: 'Custom',
      description: 'Create your own breathing pattern',
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 0,
    };
    onSelectPattern(defaultCustom);
    setShowCustomEditor(true);
  }, [onSelectPattern]);

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 text-center">
        Breathing Pattern
      </h2>
      <div
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        role="radiogroup"
        aria-label="Select breathing pattern"
      >
        {allPatterns.map((pattern) => {
          const isSelected = pattern.name === currentPattern.name;
          return (
            <button
              key={pattern.isCustom ? `custom-${pattern.customId}` : pattern.name}
              onClick={() => {
                onSelectPattern(pattern);
                setShowCustomEditor(false);
              }}
              disabled={disabled}
              role="radio"
              aria-checked={isSelected}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${
                  isSelected
                    ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/50'
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
              `}
            >
              {pattern.name}
              {pattern.isCustom && (
                <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary-500/20 text-primary-300 align-middle leading-none">
                  custom
                </span>
              )}
            </button>
          );
        })}

        {/* Custom editor trigger */}
        <button
          onClick={handleSelectCustom}
          disabled={disabled}
          role="radio"
          aria-checked={isCustomSelected && !customPatterns.some((p) => p.name === currentPattern.name)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${
              isCustomSelected && !customPatterns.some((p) => p.name === currentPattern.name)
                ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/50'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
          `}
        >
          Custom
        </button>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500 leading-relaxed">
          {currentPattern.description}
        </p>
        <p className="text-[10px] text-gray-600 mt-1 tracking-wide">
          {formatPatternTiming(currentPattern)}
        </p>
      </div>

      {/* Custom pattern editor */}
      {showCustomEditor && (
        <CustomPatternEditor
          onSelectPattern={onSelectPattern}
          disabled={disabled}
          customPatterns={customPatterns}
          setCustomPatterns={setCustomPatterns}
        />
      )}
    </div>
  );
}
