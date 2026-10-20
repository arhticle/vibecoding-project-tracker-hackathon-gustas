# Vibecoding Project Tracker — Design

**Status:** Completed · ready for `design-done`.

**Why this file exists.** This tracker is our primary tool. It provides a focused, high-contrast dark interface tailored for rapid AI-assisted development.

**Who owns this.** Person B / Design Lead.

---

## 1. Mood / vibe

A sleek, ultra-focused dark mode workspace inspired by modern developer platforms like Linear and Vercel.

References that capture the vibe:

- [Linear App](https://linear.app) — Minimalist layout, subtle borders, high contrast text.
- [Vercel Dashboard](https://vercel.com) — Monospaced accents, crisp dark background, functional UI.
- [Raycast](https://www.raycast.com) — Keyboard-first visual indicators and clear badge styling.

Anti-references — what we are explicitly **not** trying to look like:

- Heavy enterprise JIRA dashboards, clunky corporate tables, or default light-blue templates.

## 2. Color palette

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#6366F1` | Header accents, "+" button, focus rings |
| `brand-accent` | `#06B6D4` | Active highlights, hover states, interactive links |
| `surface-page` | `#0F172A` | Main page dark background |
| `surface-card` | `#1E293B` | Task card background, modal surface |
| `text-primary` | `#F8FAFC` | Primary headings, card titles, body text |
| `text-muted` | `#94A3B8` | Subtitles, captions, dates, task metadata |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#10B981` | Cards tagged `feature` (emerald accent stripe + badge) |
| `type-bug` | `#EF4444` | Cards tagged `bug` (crimson accent stripe + badge) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#10B981` | Deadline is more than 2 days out |
| `due-warning` | `#F59E0B` | Deadline is within 24 hours |
| `due-overdue` | `#EF4444` | Deadline has passed |
| `due-neutral` | `#64748B` | Task marked Done (overrides due date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Inter | Clean, neutral sans-serif optimized for screen legibility. |
| Body | Inter | Highly readable UI font for dense information hierarchy. |
| Monospace | JetBrains Mono | Distinct code styling for tags, assignees, and prompt snippets. |

Suggested sizes:

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

- **Cards:** Crisp Slate-800 cards with a subtle 1px Slate-700 border, no elevation shadow until hover.
- **Buttons:** Solid Indigo-600 fill, rounded-md corners, crisp focus rings, and active press feedback.
- **Modal:** Centered max-w-lg modal over a Slate-950 backdrop with 70% opacity and backdrop blur.
- **Empty states:** Slate-800 dashed border container with muted Slate-400 text and minimal icon.
- **Drag affordance:** Clean status dropdown menu paired with drag handles on card hover.

## 5. Voice / microcopy

| Where | Text |
|---|---|
| "+" button label | `+ New Task` |
| Empty column placeholder | `All clear here — keep vibing.` |
| Toast after "Copy as Prompt Context" | `Context copied! Ready to paste into your AI.` |
| Confirm-delete message | `Delete this task? This action cannot be undone.` |
| Handoff toast (M7 `task-owner`) | `Task handed off to {name}. Passed the torch!` |

## 6. Logo / wordmark

- **Product name:** `VibeTracker`
- **Wordmark style:** Bold Inter typography in `text-slate-50` with an Indigo-500 `brand-primary` accent dot.

## 7. Out of scope (this hackathon)

- Dark/Light mode toggle (fixed in dark mode).
- Custom font file downloads (using Google Web Fonts / standard CSS system fallbacks).
- Complex custom animations beyond basic 150ms hover transitions and toasts.

---

*DESIGN.md version: hackathon-starter v1*
