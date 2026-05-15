/** Format a Date as a local YYYY-MM-DD string (timezone-safe) */
export function toLocalDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Format total seconds as M:SS for countdown displays */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Format total seconds as human-readable duration (e.g. "3m 15s") */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

/** Format a breathing pattern's timing as a compact string (e.g. "4 · 4 · 4 · 4") */
export function formatPatternTiming(pattern: { inhale: number; hold: number; exhale: number; holdAfterExhale: number }): string {
  const parts: string[] = [];
  if (pattern.inhale > 0) parts.push(String(pattern.inhale));
  if (pattern.hold > 0) parts.push(String(pattern.hold));
  if (pattern.exhale > 0) parts.push(String(pattern.exhale));
  if (pattern.holdAfterExhale > 0) parts.push(String(pattern.holdAfterExhale));
  return parts.join(' · ');
}
