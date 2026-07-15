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
