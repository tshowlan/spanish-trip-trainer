# Tripfluent — Design System & Constitution

*Companion to `tripfluent-learning-engine-spec.md`, `tripfluent-scores-mvp-spec.md`, and the working rules. This document governs how every user-facing element looks, moves, and feels. Claude Code sessions: read this before building ANY user-facing UI. Where a feature spec says what an element does, this document says how it feels — both bind.*

---

## 0. The rule that governs the rest

**No user-facing UI ships from a text description alone.** Every new user-facing element follows: design artifact (Claude Design / approved mockup) → Tom approves → build to match → side-by-side comparison against the artifact is the acceptance test. "Match this exactly, adapted to our tokens" is the build instruction — Code implements designs, it does not invent them.

For elements too small to warrant an artifact (a label, a spacing fix), the component standards (§3) and motion rules (§4) below fully determine the outcome — there should be no design decisions left to make at build time.

---

## 1. Feel principles

These play the same role as the scores spec's copy guardrail ("recommends, never threatens") — short rules any session can hold:

1. **Calm, never busy.** One focal point per screen. If two elements compete for attention, one of them is wrong.
2. **Motion explains, never decorates.** Every animation must communicate state change (arriving, leaving, updating). Zero ambient/idle animation.
3. **Respond in 100ms.** Every interactive element gives visible feedback within 100ms of touch — before any work completes.
4. **Nothing flashes, nothing jumps.** No layout shift after first paint; values update in place with transitions; loading states reserve their space.
5. **Premium is quiet.** Restraint over spectacle: the count-up hero number and a color crossfade ARE the celebration (scores spec §3). No confetti, mascots, bouncing.
6. **Data-forward, human-warm.** Numbers and type carry the interface (Whoop/Oura); warmth comes from the cream palette, the serif moments, and the narrative copy — never from cartoon elements.
7. **Reference anchors:** Whoop (dials, data hierarchy, restraint), Oura (sheets, insight cards, calm motion), Airbnb (trip warmth, photography discipline). When designing a component, name which anchor it steals from.

### 1.1 UI copy rules
Apply to ALL user-facing text: labels, buttons, exercise prompts, anchors, primers, culture notes, hero copy. (Internal specs/docs are exempt.)
- **No em dashes (—) in UI copy.** Use a colon, a period, or parentheses instead. Punctuation in the UI should be as quiet as the motion.
- Copy tone rules from the other specs bind here too: the §8b.1 guardrail (recommends, never threatens), narrative specifics over generic placeholders (learning spec §9b.1), wit lives in reward lines and culture notes, not in labels.
- Buttons are verbs, one or two words ("Continue," "Start the lesson"). Labels are nouns. No exclamation points outside reward lines.
- **If the data can only mean one thing, don't caption the meaning** (decisions 2026-07-16): no "right now" next to a live clock, no "on pace" restating a tick the eye already reads. The reading is the label.
- Every design artifact's copy is reviewed against these rules before approval — copy in an approved artifact ships verbatim.

---

## 2. Tokens (single source of truth: `styles.css` lines 1–61)

**The app's real token block in `styles.css` is the source of truth — this document references it, never duplicates values.** No hardcoded colors, fonts, radii, shadows, or durations anywhere else in the codebase; the remediation audit (§6) enforces this. Design artifacts (`design/`) copy the token block verbatim so approved mockups are transplantable.

### 2.1 Rules of the existing system (bind everywhere)
- **Dual dark blocks:** dark theme is deliberately defined twice (`prefers-color-scheme` for "system" + `:root[data-theme="dark"]` for the manual toggle). Any token added to one dark block MUST be added to the other, or the themes drift. Every design artifact must be checked in both themes.
- **Gold pairing:** `--accent` (bright gold) is fills/highlights; `--accent-2` (deep gold) is text/numbers legible on cream. A pair, not interchangeable.
- **Score bands reuse core tokens** (`--green` / `--secondary` / `--accent-2` / `--text-dim` per the scores spec) — palette changes ripple system-wide by design.
- **Type split:** `--font-display` (Plus Jakarta Sans — headings, phrases, buttons, labels) vs `--font-text` (Inter — body, captions). Jakarta won the font flag; the flag machinery should be removed per `tripfluent-dev-font-flag.md` §6.
- **The press interaction is a push-down, not a scale:** `--shadow: 0 3px 0` reads as elements sitting proud of the surface, so pressed states translate down 2px while the shadow collapses to `--shadow-press` (`0 1px 0`, added §2.2). This is the app's signature button physics — use it on every raised interactive element; never scale-transforms.
- **Gold sound wave:** audio controls render their speaker/wave glyph in `--accent-2` (gold). This is a brand element, integral to the identity (candidate motif for a future lighthouse-logo evolution) — audio glyphs are never navy, never gray.
- **Gold is the app's light** (decisions 2026-07-16): gold marks what is lit / current / alive — the flame, audio glyphs, the pace tick, NEW material, kickers, the active nav tab, the Tripfluent crown. **Blue** marks interactive/secondary plus the Strong band. The active nav tab is gold with a Whoop-style under-glow + notch rising from the bar's bottom edge (light comes from beneath, matching the ground glow) — this replaced the old blue active state.
- **Mask-don't-paint** (decisions 2026-07-16): any surface fading over the gradient ground (atmosphere photos, primer images, the top crown) fades via **mask / transparency**, never by painting toward a background color — painting to a flat color seams against a gradient; masking dissolves into the true ground by construction.
- **Halo rule** (decisions 2026-07-16): a mark on a **light ground** (a white letterform halo over a photo) uses the **standard brand colors in both themes**; no halo → theme-token colors. Applies to the wordmark and any future mark placed over imagery.
- **Dark theme is a gradient ground, not a flat fill:** dark `--bg` is a navy linear gradient + a warm top radial, and `--bg-card` / `--bg-elevated` are **translucent + blurred** (Oura-style). This is a `styles.css` token change that MUST be applied to **both dark blocks** (`prefers-color-scheme` and `[data-theme="dark"]`), per the dual-dark-block rule above.

### 2.2 Proposed token ADDITIONS (adopt or reject deliberately; add to styles.css + both dark blocks if adopted)
- **Duration rule (two classes):** interaction/state transitions (presses, sheets, swaps, crossfades) cap at 300ms; **value-change animations** (count-ups, bar fills/springs, number rolls) may run up to 600ms — they run in parallel and gate nothing. Sanctioned examples: the 600ms hero count-up (scores spec §3), the progress bar's 0.5s spring. Keep 160ms `--transition` as the micro-interaction default; `--t-slow: 300ms` for sheets/screen transitions.
- **Weight rule (rule, not token):** Jakarta at 500/600 for display, Inter at 400/500 for text. 700+ banned — hierarchy from size and color, not heaviness.
- **Reduced motion:** honor `prefers-reduced-motion` — transitions collapse to instant state changes; springs settle instantly.
- Semantic-color usage rule: `--green`/`--red` appear as accents (borders, text, small fills) — never full-bleed panels.

---

## 3. Component standards

Every recurring element is one of these components. Building a one-off variant of an existing component is a defect.

### 3.1 Buttons
- Primary (filled `--accent`, `--r-md`, 48px min height), Secondary (bordered, transparent), Tertiary (text-only). One primary per screen, max.
- Press state: **push-down** — `translateY(2px)` + shadow collapse to `--shadow-press` (§2.1 governs); never scale. Disabled: 40% opacity, no interaction.
- Min touch target 44×44px including padding — applies to EVERYTHING tappable (this is the fix-class for small icon buttons).

### 3.2 Audio controls (the slow-voice fix)
One `AudioControl` component, three variants — never ad-hoc speaker buttons. **All audio glyphs in `--accent-2` gold (§2.1) — the gold sound wave is a brand element.**
- **Inline speaker** (in cards/exercises): 44px target, icon-only, plays at 1.0×. Playing state: icon swaps to animated gold bars (the one sanctioned "active" animation, tied to actual playback).
- **Speed toggle**: a paired pill on the speaker — tap cycles 1.0× → 0.75× (shows "0.75×" label while slowed). Slow state persists for the current item only, resets on next item. Never a separate turtle button floating elsewhere.
- **Chunk audio** (§4b.5 cards): tapping the chunk IS the audio trigger — no separate icon. Playing state: text chunks go gold (text + underline); the boxed new/error chunk gets a soft gold ring.
- Raised speaker buttons use the push-down press physics (§2.1).
- **Built:** `audioControl(play, {speed})` in `ui.js` (`.ac-*` in `styles.css`), matches `design/audio-control.html`; passed the §5 diff clean. Replaced every ad-hoc audio button (speak-btn/waveButton/slow-btn/pb-speak/intro rows); `corr-audio` stays a plain speaker per the correction-sheet artifact. Note: the speed pill is 30px tall (the approved artifact) rather than the §3.1 44px target, same accepted exception as `corr-audio` (40px).

### 3.3 Sheets & popovers (the correction-moment fix)
- **All modal content is a bottom sheet.** No centered popups, no JS alerts, no toasts carrying important content. Enter: slide-up + scrim fade, `--t-slow`, `--ease-out`. Exit: reverse with `--ease-in`. Drag-to-dismiss where dismissal is allowed.
- **Correction sheet spec** (learning spec §4c.2): scrim over the exercise (context stays visible behind), sheet with — correct answer large in `--font-ui` 20, chunk-segmented if the item has `chunks`, auto-played audio with replay control, `anchor` line in `--ink-secondary`, single Continue button. Not dismissible by scrim-tap (the tap-through is the pedagogy). Wrong answer shown small and struck-through above the correct one — acknowledgment without dwelling. **Non-chunked items** (no `chunks` field): the phrase renders as a single plain (non-tappable) pill in the same slot — same layout, no popover. **Built:** `showCorrection()` in `lesson.js`, matches `design/correction-sheet.html`. A short forced beat (~1.2s) disables Continue so the correction can't be blown past.
- **Confirm sheet** (`confirmSheet()` in `ui.js` — replaces all `alert()`/`confirm()`): grabber, title, one-line body, the **safe/stay action as the filled primary**, the destructive choice as a quiet ghost below it (`--red` ghost when `danger:true`). Scrim-tap or the safe button cancels (these ARE dismissible, unlike the correction sheet). Copy per §1.1 (verb buttons).
- Non-blocking notices (e.g. a transient status) are small top pills, `--t-base` fade, auto-dismiss 1.5s.

### 3.4 Tappable text & chunk semantics (the phrase-tap fix)
- Any tappable text region gets a visible affordance. **No invisible tap targets.**
- **Chunk semantics, app-wide (unified 2026-07-16):** box + gold marks attend-here material only (NEW pieces on presentation cards, the ERROR chunk on the correction sheet). All other chunks — known material anywhere, hintable text in exercises — render as plain text with the dotted hint underline (tappable: meaning popover + chunk audio, gold while active). The sentence always reads as a sentence; segmentation shows through per-chunk underlines, never through pill walls.
- Tap response: text/underline press-darkens (goes gold) in 100ms; meaning appears as a small anchored popover (`--t-base`), not a sheet. One popover at a time; tapping elsewhere dismisses. No hint button/lightbulb — the sentence is the interface (§4b.5 hint layer, `design/hint-popover.html`).
- Chunk states (§4b.5): NEW piece = soft `--accent` fill box + small NEW tag (only when new chunks are ≤ half; all-new phrases render fully underlined, no boxes). Known = dotted-underline text; tap-popover carries meaning + provenance. Gold = attend here, green = success only, app-wide.

### 3.5 Exercise chrome
- Progress bar: hairline, top of screen, `--accent`, moves only forward (learning spec), animates `--t-base`.
- Correct feedback: input border + subtle background wash to `--accent`, `--t-base`; one soft confirmation sound (optional, respects mute). No full-screen green flash.
- Incorrect: wash to `--danger` at low opacity, then the correction sheet. Never shake animations.
- Tiles (tap-to-build): `--r-md`, `--surface` with border; picked = lifted to raised elevation in the answer row; chunk tiles are visually wider pills vs word tiles (granularity should be *visible*).

### 3.6 Cards, chips, dials
- Presentation card, primer card, pattern-moment interstitial: `--r-xl`, generous padding (24px), serif for the scene/phrase moment per the font decision.
- **Dismissals are active, app-wide.** Teaching surfaces (presentation card §4c.1, pattern moment §4c.3) exit via a one-tap **ungraded** recognition micro-rep — a two-soft-option meaning check on the NEW material — never a passive "Got it"/Continue. Options render unmarked so the card's own gold marker doesn't trivialize the check; wrong → gold-ring the correct one (card can't be failed), correct → green + 650ms auto-advance. Keeps the card from being skimmable without becoming a test. (Exception: the correction sheet's Continue stays a button — it's a forced processing beat, §3.3, not a teach-then-exit card.)
- Home chips and standing line: per the §8b mockups — `--r-md`, fixed positions, counts update in place with a number-roll transition (`--t-base`).
- Dials: per scores spec — number + trend, band color as the arc, no evaluative labels.

---

## 4. Interaction rules (bind everywhere)

1. Every tap: visible state change ≤100ms.
2. Every async action >300ms: skeleton or spinner *in the element's reserved space* — no layout shift, no full-screen blockers under 2s.
3. Keyboard: never covers the input being typed into; exercise input areas scroll into view above it.
4. Haptics (Capacitor later): light tick on correct, none on incorrect (the sheet is the feedback), medium on lesson complete. Never on ordinary taps.
5. Audio autoplay only where specced (presentation cards, correction sheet, listening exercises) — never on screen entry elsewhere.
6. Empty/zero states are designed states with copy, never blank regions (e.g. Mistakes chip at 0: disabled-quiet, §8b.3).
7. **One-time celebratory motion is sanctioned when it EXPLAINS a state change** (decisions 2026-07-16): the Tripfluent crown's sheen sweep fires once, only on a band-crossing event, to say "this was just achieved." Looping or ambient versions of the same effect remain banned (§1 feel principle 2) — the test is whether the motion communicates a change that just happened. Always disabled under `prefers-reduced-motion`.

---

## 5. Workflow (add to working rules)

1. New user-facing element → design in **Claude Design** (design.claude.ai) using this document as the brief (paste §1–§4 relevant parts). Iterate there until exciting — "acceptable" is not the bar.
2. Quick single-component explorations may start as chat mockups; winners graduate to Claude Design for full fidelity.
3. Approved artifact → committed to `design/` in the repo (HTML or image + a line naming its component in §3) → build instruction is "match exactly, adapt to tokens."
   - **Mock at the app's baseline width: a 390px-wide `.phone` frame** (modern iPhone logical width; the app renders 375–480px, centered). A narrower mock (the early ones were 340px) makes every px value read proportionally *small* on real devices — the home hero had to be scaled up 28→33px to compensate, and the §5 diff then flags a size it can't tell from a real miss. At 390px, artifact px transfer **1:1** to the app and the computed-style diff stays exact. When re-mocking a 340px artifact at 390px, resize the frame and let the type/spacing scale with it.
4. **Precedence rule: built components override artifact stand-ins.** "Match exactly" applies to the element the artifact designs and its behavior; surrounding chrome (inputs, nav, existing components) composes from what's already built in the app. Artifacts mark stand-in elements in their captions. This is exactly what the acceptance diff's "shared-component stand-in" bucket (rule 5) enforces: a generic `.ex-input` or `.continue` in a feedback artifact never restyles the global `.text-input` / `.btn`.
   - **Token precedence:** artifact token blocks are reference snapshots, never normative — live `styles.css` values always win. An artifact is normative for its designed element's geometry, behavior, and relative styling (what's gold, what's boxed, what's dotted), not for token values. Acceptance diffs treat token-block deltas as exempt when the app is ahead (e.g. the dark-atmosphere translucency the artifacts' solid tokens predate); artifacts refresh their token blocks opportunistically when next revised.
5. **Acceptance is a mechanical diff, not an eyeball — MANDATORY on every design build, no exceptions.** Eyeballing screenshots let a green-not-gold / 14px-not-4px progress bar ship twice AND let the entire home header ship wrong (old gradient flame instead of the gold flame, flag emoji instead of the "ES · ES" chip, font-based instead of the vectorized wordmark, spark not inline) — because it was screenshotted, never diffed. **A build is not "done" until its artifact has a `DESIGN_PAIRS` entry and a diff run that's clean (or only render-identical noise).** Two layers, BOTH required:
   0. **Markup fidelity (structure/content) — the diff does NOT catch this.** The computed-style diff compares *styles*, so it will not flag a wrong SVG (gradient flame vs the design's gold flame), a flag emoji where the artifact draws a text chip, a font-based vs a vectorized wordmark, or missing/renamed markup. FIRST, for every element the artifact draws, confirm the app uses the SAME markup — same icon/SVG paths, same element content and nesting — not just the same computed styles. Copy the artifact's SVG/markup rather than approximating it.
      - **Grep the class name before you (re)use it.** The whole app shares one CSS scope and one JS global scope. Reusing a class (or top-level function) name that already exists elsewhere silently collides: e.g. the insight `.whisper .spark` inherited `height:32px` from an unrelated bar-chart `.spark` and never sat inline for two rounds. Before adding a class from an artifact, `grep -n "\.<class>" styles.css` (and for a new top-level JS name, grep the `.js` files); if it exists, scope your selector or rename. Same hazard as the duplicate-top-level-name JS bug (see `reference_preview_cache`).
   1. **Map every element the artifact draws** to its app selector, up front. The artifact defines the *whole screen* — chrome you assumed was already correct (the progress bar, the shared header) is in scope. Record the map in `tools/design-diff.js` (`DESIGN_PAIRS`); "assumed unchanged" is where the misses hide.
   2. **Run the diff:** serve the repo, drive the app to the exact state the artifact depicts, then `designDiff('/design/<artifact>.html', DESIGN_PAIRS.<name>)` in the Browser-pane console. It loads the artifact in a theme-matched iframe and reports every property that differs per element pair. (Theme is handled: it bakes the app's effective theme into the artifact at parse time.)
   3. **Triage each diff into one of three** — this is judgment, the tool only surfaces candidates:
      - **Build miss** → the artifact wins; fix the app. (e.g. tick 18px→16px.)
      - **Shared-component stand-in** → the artifact approximated a global component (`.ex-input` for the app-wide `.text-input`, `.continue` for `.btn`). Do NOT restyle the global from one feedback artifact; note it and move on.
      - **Intentional divergence** → the app deviates on purpose (the §8.3 bar spring vs the artifact's plainer transition). Flag it back to chat to resolve; never silently overwrite either side.
   4. **Then** the side-by-side screenshot, for what computed-style can't judge (rhythm, balance). Screenshot-only is never acceptance on its own.
6. Any new recurring pattern discovered during design gets ADDED to §3 in the same PR — the constitution grows; one-offs don't.

## 6. Remediation audit (one-time, do first)

1. Inventory every interactive element in the current app; score each against §3/§4 (pass / fix / redesign).
2. Cluster failures into component patterns (expected: audio controls, popups→sheets, tappable text, small touch targets, progress/feedback states).
3. Redesign each PATTERN once in Claude Design; one Code sweep replaces all instances per pattern.
4. Migrate any hardcoded style values into tokens as encountered (same cleanup spirit as the font-flag task).
5. Exit criteria: zero JS alerts/centered popups, zero <44px touch targets, zero off-token values, all audio through `AudioControl`, all modals through the sheet component.

## 7. Explicitly banned

JS `alert()`/`confirm()`; centered modal popups; confetti/particles/mascots; bold-weight UI text; ambient animation; shake-on-error; layout shift after paint; more than one primary button per screen; new easing curves; durations >300ms (except the hero count-up); invisible tap targets; full-bleed semantic-color panels.
