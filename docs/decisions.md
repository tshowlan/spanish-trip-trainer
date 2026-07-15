# Decisions

Append-only. Product and technical decisions, most-recent last, one-line rationale each. Settled unless
Tom explicitly reopens. Do not relitigate.

## 2026-07-14

- **No streaks; Momentum with smooth decay instead.** — Loss-aversion streak mechanics are Duolingo-coded;
  a rolling 7-day Momentum that dents gradually is honest and binge-proof.
- **Keep the daily flame counter, display-only.** — A passive consistency mirror is fine; it feeds nothing
  (not scores, tiers, or recommendations) and never appears in notifications.
- **No hearts/lives.** — A wrong answer already resets that phrase's SRS stability; a lives system punishes
  errors twice and teaches fear of guessing.
- **Remove XP/gems entirely; replace with Status tiers + score-delta feedback.** — Two progression systems
  competed for meaning; the session log derives everything, so nothing is lost.
- **Five permanent status tiers, computed client-side.** — App is a PWA with no server evaluator; tiers ride
  the synced progress blob like everything else. Server-side daily eval deferred.
- **Repurpose the Supabase `xp` column to carry Trip Readiness for the group view.** — With XP gone the column
  is free; the existing `order by xp desc` becomes the Readiness sort with zero schema change.
- **Stay a web PWA; do not wrap in Capacitor yet.** — Fast edit→push→live iteration matters more than native
  features right now; native-only capabilities (haptics) degrade gracefully.
- **Coverage is strength-aware AND demand-weighted (not equal-weight lesson completion).** — Readiness should
  mean "ready for the interactions this trip contains," not "% of lessons ticked."
- **Every intake question must move a weight, set entry depth, or set a trip parameter, or it's cut.** — Kept:
  destination, tripDate, tripType, lodging, transport, allergies, veg/GF, chat, level. Cut: solo, off-beaten,
  cities, dialect.
- **Content stays pure data, decoupled from the engine; no build step.** — Adding a country is a new pack +
  one registry entry; the engine never changes. Protected invariant.
- **Item identity is the phrase (`pack:slug(es)`), not its lesson.** — Items keep SRS history across the
  tiered-spiral reshuffle and lesson moves.
- **No em dashes in rendered text.** — Hyphen only for compound words / numeric ranges; use comma/colon/period
  otherwise. Code comments exempt (not rendered).
- **No emoji in rendered UI; use `icon()`/`soundIcon()`.** — Consistent monochrome icon system. Exceptions:
  country flags and the one-time onboarding trip-style picker.
- **Peru is scaffolded-for but not to be built.** — Standing content direction.

## 2026-07-15

- 2026-07-15 — Design-first pipeline: no user-facing UI ships from a text description alone; artifact in design/ → build to match → side-by-side comparison is acceptance (design system §0/§5). Rationale: kills "Code invented something mediocre" failure mode; makes design quality checkable.
- 2026-07-15 — design/ directory at repo root holds approved UI artifacts; docs/ holds specs. Artifacts override text descriptions of visuals. Canonical names, no version suffixes (git history is the versioning).
- 2026-07-15 — Font: Plus Jakarta Sans wins the A/B; --font-display stays Jakarta, --font-text stays Inter. Remove the dev font flag. Rationale: decided after live comparison.
- 2026-07-15 — Gold sound wave is a brand element: all audio glyphs render in --accent-2, never navy/gray (design system §2.1/§3.2). Rationale: integral identity element; candidate motif for future lighthouse logo evolution.
- 2026-07-15 — Press physics: raised interactive elements press DOWN (translateY 2px + shadow collapse from 0 3px 0 to 0 1px 0), never scale. Rationale: the hard offset shadow reads as elements sitting proud; push-down is the honest interpretation and the app's signature feel.
- 2026-07-15 — UI copy rules (design system §1.1): no em dashes in user-facing copy (colon/period/parentheses instead); buttons are verbs (1–2 words); labels are nouns; no exclamation points outside reward lines; approved-artifact copy ships verbatim. Internal docs exempt.
- 2026-07-15 — All modal content is a bottom sheet; JS alert()/confirm(), centered popups banned (design system §3.3/§7). Correction sheet: scrim-tap does NOT dismiss — Continue is the only exit (tap-through is the pedagogy, learning spec §4c.2).
- 2026-07-15 — styles.css:1–61 is the single token source of truth; design system references it, never duplicates values. Dark tokens must be added to BOTH dark blocks. --accent/--accent-2 are a pair (fill vs text-legible), not interchangeable.
- 2026-07-15 — AudioControl: tap-while-playing restarts (no pause; clips are 1–4s). Speed pill (0.75×) appears only in listening exercises (listen-and-type, understand-the-reply), never on presentation cards or the correction sheet. Rationale: slow-listening is a scaffold for the native axis, not a general amenity; everywhere-availability would let users avoid real-speed Spanish.
- 2026-07-15 — Duration rule refined into two classes: interaction/state transitions cap at 300ms; value-change animations (count-ups, bar fills/springs, number rolls) may run up to 600ms since they run parallel and gate nothing. Progress bar's 0.5s spring sanctioned under this rule; hero count-up now covered by the same principle instead of a one-off exception.
- 2026-07-15 — Artifact precedence: built components override artifact stand-ins for anything not the subject of the artifact ("match exactly" = the designed element + behavior; surrounding chrome composes from the app's real components, e.g. .text-input). Artifacts mark stand-ins in captions going forward (design system §5.4).
