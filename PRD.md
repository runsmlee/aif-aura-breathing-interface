# Aura — Guided Breathing & Meditation App

## Product Overview

Aura is a guided breathing and meditation web app that helps users reduce stress, improve focus, and build a consistent mindfulness habit through structured breathing exercises with real-time visual guidance, audio feedback, and progress tracking.

**Target Audience**: Adults seeking stress relief, better sleep, or improved focus through breathing exercises.

**Deployment**: Static site hosted on Vercel (React + Vite). No backend required — all data persists in localStorage.

---

## Problem Statement

Modern life creates chronic stress. Breathing exercises are one of the most accessible, evidence-based tools for managing stress and anxiety, but most people lack the structure and feedback needed to practice consistently. Existing apps are often cluttered, require accounts, or hide breathing exercises behind paywalls.

## Solution

Aura provides an immediate, no-account-required breathing experience with:
- Real-time visual and audio guidance through each breath
- Multiple scientifically-backed breathing patterns
- Session tracking and streak gamification
- A calm, focused dark UI optimized for meditation

---

## Core Features

### 1. Breathing Engine
- Phase-based breathing: **Inhale → Hold → Exhale → Hold (optional)**
- 100ms tick interval for smooth progress animation
- Real-time progress ring and countdown timer
- Auto-stop when target duration is reached
- BPM (breaths per minute) computed from cycle duration

### 2. Breathing Patterns
| Pattern | Inhale | Hold | Exhale | Hold After | Purpose |
|---------|--------|------|--------|------------|---------|
| Box Breathing | 4s | 4s | 4s | 4s | Navy SEAL calm focus |
| 4-7-8 Relaxation | 4s | 7s | 8s | 0s | Dr. Weil deep relaxation |
| Coherent Breathing | 5s | 0s | 5s | 0s | Nervous system balance |
| Energizing Breath | 2s | 0s | 2s | 0s | Quick energy boost |

### 3. Custom Patterns
- Users create up to 5 custom patterns
- Range sliders for each phase (1–10 seconds)
- Visual timeline preview
- Name input for custom patterns
- Persisted in localStorage

### 4. Session Duration
| Option | Description |
|--------|-------------|
| Free | No time limit, manual stop |
| 2 / 5 / 10 / 15 / 20 min | Timed sessions with auto-stop |

### 5. Visual Guidance (BreathingCircle)
- Animated circle that expands on inhale, contracts on exhale
- SVG circular progress ring showing phase progress
- Phase-specific colors (teal=inhale, amber=hold, red=exhale, gray=idle)
- Ambient glow particles
- Background radial gradient
- Countdown seconds displayed inside circle
- Phase guidance text below circle

### 6. Audio Feedback (useAudioFeedback)
- Web Audio API oscillator tones — no external audio files
- Inhale: 440Hz, Hold: 392Hz, Exhale: 349Hz
- Completion chime: C5 + E5 dual tone
- Smooth gain envelopes (fade in/out)
- Toggle on/off via header control

### 7. Haptic Feedback (useHapticFeedback)
- Vibration API for mobile devices
- Phase transition vibration patterns
- Completion celebration vibration
- Enabled by default

### 8. Keyboard Shortcuts (useKeyboardShortcuts)
- Start: Enter/Space
- Pause: Escape or Space
- Reset: R

### 9. Streak Tracking (useStreakTracker)
- Consecutive-day streak with timezone-aware date comparison
- Longest streak record
- Total practice days
- Cross-tab sync via `StorageEvent` listener
- Persisted in localStorage (`aura-streaks`)

### 10. Weekly Goal (useWeeklyGoal)
- Configurable goal: 1–14 sessions per week
- Monday-based ISO week detection
- Auto-resets at week boundary
- Celebration state with 3-second timeout
- Persisted in localStorage (`aura-weekly-goal`)

### 11. Session History (SessionHistory + SessionCalendar)
- Last 50 sessions stored
- 28-day heatmap calendar (4×7 grid)
- Session intensity coloring (0/1/2/3+ sessions)
- Day click filters the history list
- Tooltips with session count
- Today indicator ring
- Clear history option

### 12. Session Summary (SessionSummary)
- Modal overlay after session completion
- Shows cycles completed, total duration, BPM
- Pattern name and target duration
- "Start Again" and "Dismiss" actions
- Focus trap for accessibility
- Escape key dismissal

### 13. Onboarding Tips (OnboardingTip)
- Contextual tips for first-time users
- Dismissed after first session completion
- 3–4 tip rotation on mount
- Smooth fade/slide animations

### 14. Header
- App branding "Aura"
- Sound toggle button with icon
- Streak display (flame icon + count)
- Weekly goal progress indicator

---

## Technical Architecture

### State Management
- React hooks (useState, useCallback, useRef, useEffect)
- No external state management library
- All state computed from the breathing engine hook

### Data Persistence
| Key | Storage Location | Content |
|-----|-----------------|---------|
| `aura-pattern-preference` | localStorage | Selected pattern name |
| `aura-duration-preference` | localStorage | Selected duration |
| `aura-session-history` | localStorage | Last 50 sessions (JSON array) |
| `aura-streaks` | localStorage | Streak data |
| `aura-weekly-goal` | localStorage | Weekly goal count |
| `aura-custom-patterns` | localStorage | User-created patterns (max 5) |

### Component Architecture
- **App**: Root layout, engine coordination, state wiring
- **Header**: Branding, controls, streak display
- **BreathingCircle**: SVG visualization, progress ring, particles
- **Controls**: Start/Pause/Reset buttons
- **DurationSelector**: Duration chip selector
- **PatternSelector**: Preset + custom pattern picker
- **SessionStats**: Live stats (cycles, duration, BPM)
- **WeeklyGoal**: Goal setting + progress bar
- **SessionHistory**: Calendar heatmap + session list
- **SessionSummary**: Completion modal
- **OnboardingTip**: First-visit tips

### Lazy Loading
7 components loaded via `React.lazy` + `Suspense`:
- SessionStats, PatternSelector, DurationSelector, SessionSummary, OnboardingTip, SessionHistory, WeeklyGoal

### Accessibility (WCAG 2.1 AA)
- Semantic HTML with ARIA labels
- `role="progressbar"` with `aria-valuenow/min/max`
- `aria-live="polite"` for phase guidance
- `role="dialog"` + `aria-modal="true"` for summary
- Focus trap in modal (useFocusTrap hook)
- Keyboard navigation (Enter/Space/Escape/R)
- `prefers-reduced-motion` respected (disables animations)

---

## Design Tokens

### Colors
- **Primary**: #0EA5E9 (sky blue — founder brand color)
- **Background**: gray-950 (#030712)
- **Phase Inhale**: #14B8A6 (teal)
- **Phase Hold**: #F59E0B (amber)
- **Phase Exhale**: #EF4444 (red)
- **Phase Idle**: #6B7280 (gray)
- **Text Primary**: white
- **Text Secondary**: gray-400
- **Text Muted**: gray-500/gray-600

### Typography
- Font: system sans-serif (clean, modern)
- Heading: font-medium, tracking-wider
- Counters: font-extralight, tabular-nums
- Body: text-sm to text-base

### Spacing
- 4px base grid
- Mobile-first responsive (320px → sm → md → lg)
- 44px minimum touch targets

### Animation
- Phase transitions: 100ms linear
- Color changes: 300ms ease-out
- Glow effects: 1000ms ease-out
- Reduced motion: 0ms (all animations disabled)

---

## Analytics Events

- `page_view`: App mount
- `session_start`: User starts a breathing session
- `session_complete`: Session finishes (auto-stop or manual pause after 1+ cycle)
- `pattern_change`: User selects a different breathing pattern
- `duration_change`: User selects a different session duration
- `custom_pattern_created`: User saves a custom pattern
- `weekly_goal_set`: User changes their weekly goal
- `sound_toggled`: User enables/disables sound

---

## Acceptance Criteria

1. User can start a breathing session within 2 taps (pattern + start)
2. Visual circle expands/contracts in sync with breathing phases
3. Audio tones play on each phase transition
4. Session completes when target duration is reached
5. Session summary shows accurate stats (cycles, duration, BPM)
6. Streak increments on consecutive practice days
7. Weekly goal resets on Monday
8. Custom patterns persist across page reloads
9. Session history shows last 50 sessions in 28-day calendar
10. All 127 existing tests pass
11. Build produces <200KB initial bundle
12. App is fully functional on mobile (320px+)
13. Keyboard shortcuts work for desktop users
14. Accessibility: screen reader compatible, keyboard navigable
15. `prefers-reduced-motion` disables all animations
