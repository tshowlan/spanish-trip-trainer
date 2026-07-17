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
- 2026-07-15 — App-wide attention semantics: GOLD directs attention (new material on presentation cards, error locus on the correction sheet); GREEN confirms success (the wash) and nothing else; "known" is the unmarked default. Checkmarks retired from chunk marking (achievement semantics contradicted "new"). Rationale: attention should point where learning happens; one signal per phrase, never competing marks.
- 2026-07-15 — Presentation card: mark new chunks only when ≤ half the chunks are new; all-new cards carry no marks (header label suffices). Known-chunk popovers show provenance (source lesson) — narrative continuity between lessons.
- 2026-07-15 — Hint layer: dotted underline is the exercise affordance (pills reserved for presentation/correction contexts — exercise sentences must read as sentences). Hint-used is accounted silently (cold-axis block, no UI flag). Rationale: axes aren't user-facing; visible flagging shames the safety net. No persistent hint button — the sentence is the interface.
- 2026-07-15 — Chunk segmentation criteria (learning spec §11.1): one communicative function per chunk; glosses must compose naturally into the full translation; never split inside a dependency needing grammar explanation (subjunctive clauses, clitics); chunks must be plausibly reusable units; 2–4 chunks per phrase. Rationale: coarse chunks are how a phrases-first app quarantines grammar it refuses to teach ("cuando tenga un momento" stays whole so "tenga" never needs a subjunctive lesson). Word-level granularity is the keywords/blank-rotation/word-tiles layer's job, not the chunks'.
- 2026-07-16 — Mask-don't-paint: any surface fading over the gradient ground (photos, primer images, crowns) fades via mask/transparency, NEVER by painting toward a background color. Rationale: painting to a flat color seams against gradient grounds; masking dissolves into the true ground by construction.
- 2026-07-16 — Halo rule: halo = light ground = standard brand colors (in both themes); no halo = theme-token colors. Applies to wordmark and any future mark over imagery.
- 2026-07-16 — Gold is the app's light: gold marks what is lit/current/alive — flame, audio glyphs, pace tick, NEW material, kickers, active nav tab, the crown. Blue marks interactive/secondary + the Strong band. Nav active state changed blue→gold under this rule, with under-glow + notch rising from the bar's bottom edge (light comes from beneath, matching the ground glow).
- 2026-07-16 — Readiness bands renamed: Low / Fair / Strong / Tripfluent. Labels must be stative + bidirectional (test: completes "Readiness: ___"); progression/arrival words banned (crossings from decay are routine — a week off costs ~13pts at 72). Newness is the baseline state's job, not the bottom band's. Top band = the brand name: reaching it IS becoming tripfluent. Sweep ALL occurrences of "Fluent for your trip" in scores spec copy.
- 2026-07-16 — Band chip: the hero's status renders as a chip (band-colored 13% fill, sentence case), distinct from dim-caps metric NAMES. Tripfluent chip wears the metallic crown (gradient border = specular gold, one-time sheen on crossing only). Color = level, tick = pace, deltas = trend — three questions, three channels, no red anywhere by design.
- 2026-07-16 — Pace de-duplication: the gold tick on the Readiness arc is the sole ambient pace signal. Subline = pure countdown. Pace WORDS appear only on divergence (detail view / whisper slot).
- 2026-07-16 — Destination presence: line by default, weather tile inside ~3 weeks (the app leans toward the trip as it approaches — same instinct as cram mode). Weather conditions render as static texture; ambient animation stays banned. Copy rule addition: if the data can only mean one thing, don't caption the meaning (no "right now" next to a live clock).
- 2026-07-16 — One-time celebratory motion is sanctioned when it EXPLAINS a state change (crown sheen on band-crossing); looping/ambient versions remain banned.
- 2026-07-16 — Surfaces keep native scroll physics (rubber-band overscroll) even when content fits — user-driven physics is feedback, not ambient animation, and an inert surface reads as a frozen web page. Suppress pull-to-refresh (overscroll-behavior-y: contain) wherever bounce is enabled.
- 2026-07-16 — Chunk rendering unified: gold box = attend here (new/error) only; everything else is dotted-underline tappable text, matching the exercise hint layer. Pill walls retired. One vocabulary across presentation, correction, and exercises. (Supersedes the 2026-07-15 "pills reserved for presentation/correction contexts" half of the hint-layer decision.)
- 2026-07-16 — Gold marks a POINT, never a region: correction sheet boxes the error chunk only when the error is localized to exactly one chunk; diffuse errors (2+ chunks) render the correction as the plain phrase — no boxes (a multi-spot marking claims precision the learner doesn't have; the whole phrase IS the correction). Presentation card's ≤-half newness rule is the same principle applied to new material.
- 2026-07-16 — State vs progression separation is architectural: home = state (readiness, pacing), Learn = progression (completion, passes), Progress = reflection. No completion metrics on home, ever.
- 2026-07-16 — The pace tick is the crown's shadow on today: position = readiness required now to hold Tripfluent at landing, rising across the trip to converge on 85 at T-0. Rendered as a Submariner-style solid gold triangle index outside the track (pearl considered, removed at mock size). Ahead = green gap wash; behind = unpainted.
- 2026-07-16 — Tripfluent is a HELD title (state), and "Landed Tripfluent" is the permanent record (progression) — the metallic moment exists correctly in both worlds. Decay explained exactly twice: first reveal + first downward crossing; geometry carries it thereafter.
- 2026-07-16 — App-wide `.btn` reconciled to the design-system button spec (15px/600/radius-md/48px min). The prior 17/800/r16 button predated the constitution and violated the weight cap and radius tokens; every approved artifact already used the DS spec, so the app moves to the artifacts, not vice versa.
- 2026-07-16 — Token precedence: live styles.css outranks artifact token snapshots; artifacts are normative for designed-element geometry/behavior/relative styling only. Ends re-issue churn when atmosphere/token systems evolve.
