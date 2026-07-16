# STATUS

Running handoff log. Most recent entry at top. Terse: dates, what changed, deviations, what's next.

## 2026-07-16 — Home build STAGE 1: atmosphere everywhere (Claude Code)
- App-wide dark-theme atmosphere shipped (both dark blocks): `--bg` #05060d, `--bg-card`/`--bg-elevated`/`--bg-nav`/`--border` now translucent; new `--ground` token (navy linear + warm top radial) and `--card-blur`. `body` background = `var(--ground, var(--bg))` fixed — gradient ground in dark, cream fallback in light (token fallback = zero light-theme change, verified). Curated surface classes get `backdrop-filter: var(--card-blur)` (frosted only in dark).
- Nav: active tab now **gold** (`--accent-2`) with the Whoop under-glow (`::before` radial from the bottom edge) + notch (`::after`), replacing the blue pill. Applies in both themes ("gold is the app's light").
- Verified in browser: dark = gradient ground + frosted cards + gold nav; light = unchanged cream + opaque cards + gold nav; readable both; no console errors. SW → v122.
- **Next stages:** (2) home screen composition to `design/home.html` via the §5 gate; (3) photo plumbing + free-licensed placeholders (user chose Unsplash/Pexels). Photo licensing still a ship blocker for final images.

## 2026-07-16 — Home build STAGE 2a: dial cluster (bands + crown + pace tick) (Claude Code)
- `readinessBand` labels → **Low / Fair / Strong / Tripfluent** (scoring.js). Readiness ring arc now tracks the band color (green/blue/gold/dim) via `band.cls` (was red/yellow/green `r-*`, now unused).
- Readiness hero: "Trip Readiness" ring label removed; the band renders as a **chip** (`.band-chip`, band-colored 13% fill) beneath the arc. **Tripfluent = crown** (metallic gold gradient border) with a **one-time sheen that fires only on crossing into the top band** (`state.lastBandTop` tracks it; `.just-crossed` gates the animation; reduced-motion disables it).
- Pace tick now **gold** (`--accent-2`, was `--text`) = the sole ambient pace signal. Countdown subline is **pure countdown** ("121d out"), the "· on pace / · behind" text removed. Negative dial delta is **dim, not red**.
- Verified in browser (dial cluster for Strong 72 + Tripfluent 91): gold tick, band chip, metallic crown, dim delta all correct; new labels confirmed in the served file (browser showed stale labels = HTTP script cache only). SW → v123.
- **Stage 2 remaining:** fade action tile, insight line (gold spark + green delta), presence line + weather tile. Header/photo-crown deferred to Tom's design session + Stage 3 photos.

## 2026-07-16 — Home build STAGE 2b: insight line + presence line (Claude Code)
- **Insight line** (`insightLine()`): gold spark + "Your last 2 weeks moved Readiness +N" with N in green display weight. Real data via `scoreTrend("readiness", 14)`; shows only the encouraging positive case (silence otherwise — never a negative nudge).
- **Presence line** (`presenceLine()`): green dot + the destination's LOCAL time ("7:06pm in Spain") via `Intl.DateTimeFormat` + a new `tz` field on `DESTINATIONS` (Europe/Madrid, America/Mexico_City) — free, no fetch. **Temperature omitted** (optional until the cached weather fetch lands, per §3.2) rather than faked; the weather TILE (inside ~3 weeks) also waits on that fetch.
- Both wired into `renderHome` under Practice, in rhythm (not bottom-pinned). Verified in browser: styling + real tz math correct. SW → v124.
- **Fade action tile moved to Stage 3** — its payoff is the session photo bleeding in, so it bundles with the photo work rather than half-building a navy block now. **Stage 3** = photo plumbing + free-licensed placeholders + fade tile + (with Tom's design session) the photo-crown header + weather tile when the fetch exists.

## 2026-07-16 — Home build STAGE 3a: fade action tile (Claude Code)
- Photo plumbing already existed: `introPhoto(lesson)` → `./img/<region>/<name>.jpg`, with 6 real Mexico photos tracked in `img/mx/` (Spain currently reuses them — `img/es/` is a TODO, being filled next).
- `heroTile` rebuilt to the **fade composition** (`design/home.html`): navy block + gold kicker (kind → "Next lesson"/"Review"/"Countdown"/etc.) + title + sub, with the session photo bleeding in from the right under a navy→transparent gradient. `heroState` now returns the `lesson` so the tile shows that lesson's primer photo; other actions get a warm destination default. Kind-coded background colors retired (kicker carries the kind now).
- Verified in browser (lesson + review tiles with real photos): photo bleed + gradient + gold kicker + readable text all correct. SW → v125.
- **Stage 3 remaining:** free-licensed Spain placeholders into `img/es/` + region fix (so Spain stops reusing Mexico photos); then the photo-crown header + weather tile (both gated on Tom's design session / the weather fetch).

## 2026-07-16 — Home build STAGE 3b: Spain placeholder photos (Claude Code)
- Pulled CC0 (public-domain, no-attribution) Spain photos via Openverse, **verified by eye** (titles were unreliable — the first pass returned an exhibition banner, a museum reliquary, a football stadium, a UK street named "Seville", and one non-image SVG). Kept the 3 that are genuinely good Spain scenes: `img/es/cafe.jpg` (Café Moka, Barcelona), `market.jpg` (Mercado Central, Valencia), `default.jpg` (Plaza Mayor, Madrid). Resized to ~200-350KB. Provenance in `img/es/CREDITS.txt`.
- `introPhoto` now resolves Spain's café/market/default to `img/es/`; every other category **falls back to the good `img/mx` set** (`ES_PHOTOS` gates per-name, so no 404s and nothing off-topic). Add a name to `ES_PHOTOS` when its `img/es/<name>.jpg` is chosen.
- Verified path resolution (Spain vs Mexico) + all three are valid JPEGs viewed. SW → v126.
- **Deliberately did NOT chase all 6 via CC0** — the pool is noisy and curated placeholders want a human eye (Tom is choosing final photos anyway). Food/transport/sights use the on-topic mx photos until Spain versions land.
- **Home build remaining (all externally gated):** photo-crown header (Tom's design session on header↔gradient), weather tile + temperature (cached weather edge function). The data-driven home is complete.

## 2026-07-16 — Home build STAGE 3c: photo crown + trip header + atmosphere (Claude Code)
- **Correction:** I had wrongly deferred the whole photo crown — Tom clarified the design session is about how the header works on the OTHER pages, not the home itself. The home must match `design/home.html` fully, photo included. Built it.
- **Home atmosphere** (`setHomeAtmo`/`clearHomeAtmo` in screen-home.js): a fixed layer behind the content — a destination **photo crown** (`destHero()` → the wide es/mx scenic) that **masks into the ground** (mask-don't-paint) + a warm **destination ground-glow** sweeping from bottom-left. Torn down when leaving home (nav.js `showTabbar`/`hideTabbar`), verified restored on return.
- **Trip header block**: big destination name + countdown ("Spain · 128 days out") anchoring over the photo.
- **photo-on treatment** (`body.home-lit`): transparent topbar, wordmark **halo forcing standard brand colors** (halo rule), white header text with shadow — both themes.
- Verified in the real app (seeded returning-user state, fresh port to beat the HTTP cache) in **dark + light**: photo crown + masking, trip header, band chip, fade tile, presence line all present and matching the design; atmosphere correctly torn down off-home. SW → v127.
- **Home now matches design/home.html.** Genuinely remaining: the header treatment on **other pages** (Tom's design session) and the **weather tile + temperature** (cached weather edge function).

## 2026-07-16 — Header layout applied app-wide (Claude Code)
- Clarified: the header as designed in `design/home.html` (`.approw`) IS the app-wide header spec — not a separate design session. Restructured the shared `.topbar`: **wordmark LEFT** (`order:-1`, was absolute-centered), **flame + language grouped RIGHT** (`.stat.streak` gets `margin-left:auto`; lang-flag no longer `margin-left:auto`). Wordmark height 22→20 to match.
- Applies to every screen. Photo-on treatment (wordmark halo + standard colors + white text) stays **home-only** via `body.home-lit`; other pages show the wordmark in normal brand colors, no halo.
- Verified in the real app: home (halo over photo) + Progress (plain), both correct. SW → v128.
- **Home + header now complete.** Only genuinely remaining home item: **weather tile + temperature** (cached weather edge function).

## 2026-07-16 — Home screen designed + approved (design/home.html)
- Atmosphere: photo + tint. Photo crowns top, dissolves via SELF-MASK (mask-don't-paint rule, see decisions); destination ground-glow sweeps diagonally from bottom-left (26% peak, full height), stacked BENEATH the photo. Dark theme = gradient ground (navy linear + warm top radial), cards translucent + blur — this is a styles.css token change: dark --bg becomes the gradient treatment, --bg-card translucent; APPLY TO BOTH DARK BLOCKS.
- Wordmark: real SVG, fills → --wordmark-1/-2 tokens (update source SVG in repo); white letterform halo in photo contexts; halo forces standard navy/blue fills in both themes.
- Dials: Readiness hero + gold pace tick = SOLE pace signal (subline = pure countdown; pace words only on divergence in detail view/whisper). Bands: Low / Fair / Strong / Tripfluent — chip treatment (sentence case, band-colored 13% fill). Tripfluent chip: metallic gradient border + soft gold halo + ONE-TIME sheen sweep, fired only on band-crossing events, disabled under prefers-reduced-motion. No ring label. Flankers: bare indices + 7-day delta whispers (negative = dim, never red).
- Action tile: fade style (navy block → session image bleeding in right; image = lesson's primer photo double-duty; review sessions = destination texture/icon).
- Practice: bordered-row pattern (icon + label + chevron). Insight line: gold spark + delta in --green display-weight, sits in rhythm under Practice (never margin-auto'd to bottom).
- Presence: quiet line by default ("6:12pm in Mallorca · 74°"); upgrades to the dynamic weather TILE inside ~3 weeks to trip (sky gradient keyed to destination-local time; conditions as STATIC texture — no ambient animation). Local time = tz math, free. Temperature = needs cached weather fetch (edge function) — build the line + tile with temp OPTIONAL until that lands.
- Nav: active tab gold with Whoop-style under-glow rising from the bar's bottom edge + bright notch. This changes the current blue active state — see decisions ("gold is the app's light").
- BEFORE SHIP: license or replace the Port de Sóller photo (watermarked stock preview); destination photo sourcing now scoped to ~1/destination for home + 1/lesson for primers.
- PENCILED (do not build): tint intensity as live variable (candidates: days-to-trip, momentum, destination-local time of day — the weather tile is the proof-of-concept for the last one); ±2pt display hysteresis at band boundaries.
- APPLIED (Claude Code): committed design/home.html; threaded all doc edits — scores-spec §1.1 bands (Low/Fair/Strong/Tripfluent, "Fluent for your trip" swept) + §3.2 (pace tick sole signal, band chip + crown, no ring label, countdown-only subline, insight line, presence/weather-tile); design-system §2.1 (gold-is-the-light, mask-don't-paint, halo rule, dark gradient-ground token note), §1.1 (don't-caption-the-obvious), §4 (one-time explanatory motion); decisions ×8. **BUILD is a separate pass, not started** — this is the design + docs stamp. The dark-theme token change is app-wide (affects every screen) and the photo licensing is a ship blocker; both to weigh when the build starts.

## 2026-07-15 — Hint popover approved + chunking authoring rule ratified
- NEW: design/hint-popover.html. Exercise hint affordance = dotted underline (no pill fill in exercises); tap = gold + chunk audio + canonical navy popover. Hints free on first pass; in review a used hint silently blocks the cold axis (no UI acknowledgment). Blank never hintable. No hint button — ambient layer; one-time discoverability tooltip only if needed. STAND-INS: progress bar, option buttons.
- Chunking authoring rule (5 criteria) added to learning-engine spec §11.1 + audit check — governs the ~150-phrase chunking pass. Chunk segmentations are content: revisable when hint-tap telemetry flags confusing cuts.
- Remediation queue remaining: home hero tile + chips re-cut in real tokens.
  - DONE (Claude Code): committed design/hint-popover.html; threaded §11.1 rule 9 + §11.2 check-10 extension + design-system §3.4 context rule + decisions. **Audit check implemented** in `tools/audit-pack.mjs` (>4 chunks / any single-word chunk → informational). The hint-layer *build* (dotted-underline affordance in exercises + hint-tap logging + cold-axis gate in review) is unbuilt — that's chunk-pipeline Phase 3, still pending.

## 2026-07-15 — Presentation card designed + approved
- NEW: design/presentation-card.html (§4c.1 / §4b.5), both layouts: chunked long phrase + short item w/ tappable context sentence. Composes built components (chunk pills, popover, AudioControl); STAND-IN: progress bar.
- New attention-semantics system ratified (see decisions): gold marks the NEW chunk (soft --accent fill + NEW tag, ≤-half rule); known chunks unmarked, popover carries provenance ("from Ordering Tacos").
- FOLLOW-UP on built correction sheet: replace the known-chunk green outline with gold on the ERROR chunk (cuenta/cuento chunk in the reference example). Small edit; same semantics.
  - DONE (Claude Code): `showCorrection` now marks the error chunk gold (`.corr-chunk.error`) instead of the green known-outline+check (both retired). Error locus = chunk whose normalized text is absent from the typed attempt (`wrong`), capped at ≤ half (a mostly-wrong attempt gets no marks; the struck-through line carries it). No `wrong` text (e.g. MC misses) → no marks. Updated `design/correction-sheet.html` to match (la cuenta = gold error). Diff gate clean; error detection verified (only "la cuenta" marked for the cuento attempt). SW v121.
- Build order: presentation card ships with M1's ladder work (it's the exposure-0 slot type).

## 2026-07-15 — AudioControl built (§3.2), first run through the diff gate (Claude Code)

Built the unified `AudioControl` to `design/audio-control.html`; retired every ad-hoc audio button.

- NEW `audioControl(play, {speed})` in `ui.js` — variant A (44px gold inline speaker, glyph → animated
  gold bars only while playing, tap restarts) and A2 (+ speed pill 1x/0.75x, gold when slowed, resets per
  item). `.ac-*` CSS in `styles.css` matches the artifact.
- **Replaced:** all `speak-btn`/`soundIcon` "Hear it" buttons (present card, intro card, primer reveal,
  es→en MC) → variant A plain speaker; `waveButton`+`slow-btn` in the three listening exercises
  (renderReply/renderListenChoice/renderListen) → variant A2; `pb-speak` (phrasebook) → variant A; intro
  list rows → row-as-trigger with the gold speaker visual (variant C). Chunk pills (present + correction)
  gained the variant-C gold-ring `.playing` state. Fixes an off-brand bug too: the old wave button was
  `--secondary` blue, not gold.
- **Removed dead code:** `soundIcon()`, `waveButton()`, and `.speak-btn/.wave-btn/.wv/.slow-btn/.sound-ic/
  .intro-spk/.pb-speak` CSS. `corr-audio` left as-is (governed by the correction-sheet artifact, which is a
  plain speaker per the AudioControl rules).
- **Acceptance (§5 gate): clean.** `designDiff('/design/audio-control.html', DESIGN_PAIRS.audioControl)`
  returned zero mismatches on `.ac-speaker/.ac-bars/.ac-bars span/.ac-speed`. All four component states
  screenshot-verified; listening exercise renders fresh with speaker+pill; no boot errors. Phrasebook
  visual blocked only by the preview's stale HTTP script cache (source verified correct; same pattern as
  the verified listening integration) — fresh on deploy via the SW bump.
- Minor accepted deviation: speed pill is 30px tall (matches the approved artifact) vs the §6 44px
  touch-target target, consistent with how `corr-audio` (40px) was handled. SW → v120.

## 2026-07-15 — AudioControl designed + approved
- NEW: design/audio-control.html (§3.2 component sheet, live states). Three variants: inline speaker (44px, gold glyph → animated gold bars while playing), speaker + speed pill (1× → 0.75×, gold when slowed, resets per item), chunk pill (pill is the trigger, gold ring while playing). Disabled = 40% opacity, never hidden.
- Build: replace every ad-hoc speaker/turtle button in the app with AudioControl instances per variant. This completes the original offender list (slow-voice button, phrase taps, correction popup).
- Behavioral rules in the artifact's rules block are normative: restart-not-pause; speed pill scoped to listening exercises only; bars freeze under prefers-reduced-motion; autoplay only where specced.

---

## 2026-07-15 — Design-diff acceptance gate + diff-caught fixes (Claude Code)

Built after two silent artifact mismatches (progress bar green-not-gold, 14px-not-4px) passed a
screenshot-only check. Root cause: "side-by-side = acceptance" relied on the eye. Fix: make acceptance
a **mechanical computed-style diff**.

- NEW `tools/design-diff.js` (dev-only, not an app asset / not in sw.js): `designDiff(artifactUrl, pairs)`
  loads a `design/` artifact in a theme-matched iframe and diffs computed styles of mapped element pairs
  vs the live app. `DESIGN_PAIRS` records the artifact→app selector map for correctFeedback + correctionSheet.
  Theme parity via srcdoc parse-time injection (a Chromium bug leaves descendant `var(--token)` used-values
  stale when data-theme is toggled post-paint — pre-injection sidesteps it). Container-independent property
  set; width/height treated as advisory.
- Design system §5 rewritten: acceptance = map every element the artifact draws → run the diff → triage
  each row into build-miss (fix) / shared-component stand-in (leave global) / intentional divergence (flag
  to chat) → *then* screenshot. Screenshot-only is never acceptance.
- **Diff-caught fixes (build misses):** correct-answer tick 18px→16px (`lesson.js`); `.corr-audio` stray
  UA button padding → `padding:0` (`styles.css`).
- **Flagged for decision — all three now RESOLVED:**
  - **Global `.btn` had no `font-family` → every button rendered in Arial.** Tom's call: fix the font only,
    keep existing 17px/800 sizing. Done — `.btn` now `font-family: var(--font-display)` (SW v119).
  - `.pbar > i` 0.5s spring vs artifact 0.3s → **spring stays**, now sanctioned under the refined §2.2
    duration rule (value-change animations may run to 600ms). No change.
  - `.text-input` geometry vs artifacts' generic stand-in input → **app geometry wins** per the new
    shared-component precedence rule (design system). Artifacts' input was a stand-in. No change.
- SW → v118, then v119 (button font). Design system §2.2 (duration rule) + §5 (precedence) updated by Tom.

## 2026-07-15 — Correct-answer wash (§3.5), built to design/correct-feedback.html (Claude Code)

Closes the last visible-feedback gap: correct answers no longer keep the old footer.

- NEW artifact `design/correct-feedback.html` (APPROVED 2026-07-15) committed to `design/`.
- **The wash (§3.5):** on a right answer `finishGrade` adds `.qcorrect` to `#qbody` → input gets green
  border + `color-mix(green 8%, --bg-card)` fill (160ms). Progress bar advances; a gold `.answer-tick`
  (checkmark polyline, `--accent-2`) pops in beside it. Hold 650ms, then the item fades out
  (`.leaving`, opacity/translateY-6, 200ms) and `next()` swaps in — **auto-advance, no tap**. Any
  "Restored"/extra note rides as a toast. Haptic/confirm-sound deferred to Capacitor (§4.4), per artifact.
- Correction sheet (wrong path, committed 4275624) unchanged. Both feedback states now verified
  side-by-side against their `design/` artifacts in the browser.
- SW → v115.

**Remaining §6:** off-token migration (~25 hex); artifact-gated components (AudioControl §3.2, hint
popover §3.4, home hero tile §3.6) still blocked on chat design artifacts.

## 2026-07-15 — Design system build: press physics, sheets, correction-sheet pilot (Claude Code)

Built from `docs/tripfluent-design-system.md` + `design/correction-sheet.html`.

- §2.2 tokens adopted: `--shadow-press` (both dark blocks), `--t-slow` 300ms, global
  `prefers-reduced-motion`. Weight/semantic-color are rules (no token).
- Press physics (§2.1): every `:active` is push-down now (translateY; raised elements collapse the
  offset shadow to `--shadow-press`). No scale-transforms remain. NOTE: doc §3.1 still says "scale to
  0.97" — stale, §2.1 governs; reconcile the doc line.
- Dialogs (§3.3/§7): all five `confirm()` → `confirmSheet()` bottom sheet (safe action primary,
  destructive as quiet ghost).
- Correction sheet (§3.3 pilot, built to `design/correction-sheet.html`): `showCorrection()` replaces
  the wrong-answer footer — scrim over dimmed exercise, struck-through attempt, gold "The phrase"
  label, chunk pills (known = green outline + check, tappable → meaning popover), gold replay audio,
  anchor line, single Continue (scrim-tap does NOT dismiss). Shake-on-error removed. Correct answers
  keep the light footer for now.
- Font flag removed (Jakarta won): all DEV-FONT-FLAG machinery + Schibsted/Source-Serif faces gone.
- Verified in browser: confirm sheet + correction sheet render and match the artifact. SW → v114.

**Remaining §6 remediation:** run the full interactive-element inventory; AudioControl component
(unify speaker buttons + speed toggle); §3.4 tappable-text hint popovers (chunk pipeline Phase 3);
correct-answer feedback → §3.5 wash (currently still a footer); off-token audit.

## 2026-07-15 — §6 remediation: inventory + touch-target sweep (Claude Code)

Design system §6 remediation started (correction sheet, confirm sheets, press physics, font flag
already done in earlier commits).

- **Inventory triage** of the interactive surface:
  - Needs a CHAT ARTIFACT before build (§0 rule — user-facing components): **AudioControl** (§3.2 — unify
    the 8 ad-hoc audio patterns: soundIcon/waveButton/slow-btn/pb-speak/corr-audio/intro-hear/speak-btn),
    **hint popover** (§3.4, also chunk Phase 3), **home hero tile + chips** redesign. Correct-answer wash
    (§3.5) already in progress with chat.
  - Mechanical (no artifact, done/queued here): touch targets (done), off-token migration (~25 hardcoded
    hex in styles.css >L70 — mostly #fff on filled buttons + the scene-tint hues; queued).
- **Touch-target sweep (§3.1 / §6 exit criterion):** icon-btn, lang-flag-top, close-btn, pb-speak, pb-save
  now min 44×44 (centered). Tabs (~51px) and mic-btn (100px) already pass; corr-audio stays 40px to match
  the approved artifact. SW → v114.

**Remaining §6:** off-token migration; and the three artifact-gated components above (blocked on chat).

## 2026-07-15 — Design system + design-first pipeline
- NEW: `docs/tripfluent-design-system.md` — design constitution: feel principles, UI copy rules (§1.1), token rules referencing styles.css:1–61 as source of truth (§2), component standards (§3: buttons, AudioControl, sheets, tappable text/chunk pills, exercise chrome, cards), interaction rules (§4), design-first workflow (§5), remediation audit plan (§6), banned list (§7).
- NEW: `design/` directory at repo root (sibling to docs/). Approved UI artifacts live here; Code matches them exactly. First artifact committed: `design/correction-sheet.html` (v2, real tokens, light+dark, live interactions).
- Correction sheet designed and approved as the pipeline pilot (learning spec §4c.2 + design system §3.3). Implements: 300ms sheet slide + scrim, struck-through wrong answer, chunk pills with known-chunk green outline, gold audio button with push-down press, anchor line, single Continue exit (scrim-tap does not dismiss).
- Font flag decided: Plus Jakarta Sans wins. Remove dev-font-flag machinery per tripfluent-dev-font-flag.md §6 (grep DEV-FONT-FLAG).
- IN PROGRESS: remediation audit (design system §6) — inventory interactive elements, cluster into patterns, redesign per pattern. Queue after correction sheet: presentation card w/ chunk pills → AudioControl component sheet → hint popover → home hero tile + chips.
- PENDING DECISION: design system §2.2 proposed token additions (--t-slow 300ms tier, weight rules, prefers-reduced-motion, semantic-color usage rule) — adopt/reject as a block.
- NEXT: Code reads docs/tripfluent-design-system.md; build correction sheet to match design/correction-sheet.html (side-by-side comparison = acceptance); run §6 inventory; add design/ rule line to CLAUDE.md.

## 2026-07-14 — Chunk pipeline Phase 1 (learning §4b.5) (Claude Code)

Long-phrase chunking, foundation phase. Spec edit (learning-engine §4b.5 + §11.2 #10) committed.

- **Schema:** items may carry `chunks: [[es-fragment, en-meaning], …]` (tier-2/3 long phrases; optional).
- **Segmented tappable present card:** chunked items render as pills; `_chunkKnown()` marks pieces the
  learner already owns (muted) vs the new one (accented) — a long sentence reads as one new chunk on
  known material. Tap a pill = meaning reveal + chunk audio (TTS). Non-chunked items unchanged.
- **Audit (§11.2 #10):** chunks must appear verbatim in order and concatenate (normalized) to `es` —
  hard error otherwise; long tier-2/3 phrases missing chunks flagged informationally.
- **Seed content:** `chunks` authored on 4 long Spain phrases (s5-real/s5-fix). Both packs audit clean.
- Verified in browser: card renders, known/new split correct, tap-toggle reveal works. SW → v111.

**Phase 2 (next):** chunk-granularity exercises — chunk-match (rung 1), blank-a-chunk + chunk-tile build
with descending granularity (rung 2→3), whole-phrase-MC demotion rule, `chooseType` routing.
**Phase 3:** tappable hint layer across all exercises + hint-tap logging + cold-axis gating in review.
**Content pass (parallel):** author `chunks` on remaining long phrases (~6 Spain, ~8 Mexico flagged).

## 2026-07-14 — Back up scoreHistory to the cloud (Claude Code)

- **Bug:** `scoreHistory` (daily dial snapshots — the substrate for the pace tick, delta whispers,
  and §7.2 charts) was local-only: not in the sync payload, not in DEST_FIELDS. So it didn't restore
  on login/device change, and a reset silently blanked those three features until it re-accumulated
  (one row/day). Core progress (lessons/learn/sessions) was never at risk — those are backed up.
- **Fix:** `scoreHistory` added to the `p_progress` sync payload and merged back in `applyPlayer` via
  `_mergeHistory` (union by date, local wins same-day, sorted, cap 120). Now durable across reloads/devices.
  Does not retroactively recover history already lost locally; those features self-heal over ~1-2 days of use.
- SW → v110.

## 2026-07-14 — Boot hardening + small fixes (Claude Code)

- **Stuck-splash fix (root cause: mid-deploy version skew).** Boot render is now wrapped so a
  render/auth throw can never strand the splash — `runSplash()` always runs (`.finally`), with a
  fallback to `renderOnboarding()`. Diagnosed via browser repro: current code renders fine across
  fresh/returning/past-trip states; the crash was a stale cached `app.js` (`$("#gear")` null-deref)
  loading against the new `index.html`. Resolved on Tom's device by re-fetching.
- **Em dashes** removed from two rendered strings (trip-complete overlay kicker, migration-card body).
- **Onboarding date input clipping:** `type="date"` got `-webkit-appearance:none` + indicator/value
  styling so the native iOS control stops overflowing its box.
- SW → v109.

## 2026-07-14 — Reconcile build to edited §3 tab map + §1b.5 (Claude Code)

Tom edited the scores/learning-engine/xp specs; reconciled the build to match.

- **Tabs (scores §3.1):** now **Home / Learn / Progress / Profile**. Phrases dissolved as a tab and
  **folded into Learn** as a second view (Library / Phrases segmented toggle; `phrasebookBody(wrap)`
  refactored out of `renderPhrasebook`). Quests already gone.
- **Header (scores §3.2):** removed the profile icon + settings gear; flame + wordmark + language flag
  only. Flag is now a tappable destination switcher (→ `renderTrips`). Dropped the `#gear`/`#profile`
  boot listeners.
- **Profile tab (scores §3.1):** `renderProfile` is now the tab and absorbs all Settings rows (theme,
  sound, reminder, trips, group, edit profile, reset, version). `renderSettings` aliased to it. Added a
  `user` icon to the PH map.
- **Seeded items (learning §1b.5):** `seedPlacement` now seeds ladder state — `exposures: 4` (scaffold-
  ready, never presentation-carded) with the S≈7 strength — was `exposures: 1`.
- **Spec edit committed:** `docs/tripfluent-scores-mvp-spec.md` (Tom's tab-map resolution).

Pending from the same spec edits (not yet built): learning §1b.5 audit additions (weight-vs-share report
+ depth checklist in `tools/audit-pack.mjs`) and content sizing to weights; xp §6 master notifications
toggle (rides with the §6 notifications engine).

## 2026-07-14 — Scores/IA + Personalization + XP→Status (Claude Code)

Large multi-track pass. Deployed through `sw.js` `sts-v107`. Specs: `docs/tripfluent-scores-mvp-spec.md`,
`docs/tripfluent-personalization-weights-spec.md`, `docs/tripfluent-xp-to-status-migration-spec.md`.

**Built / changed**
- Lesson experience (scores spec §8): removed hearts/lives; haptics (`haptic()` in `audio.js`, web
  `navigator.vibrate` + dormant Capacitor branch); motion (card spring, drawing checkmark, shake,
  question slide-in, pace-bar overshoot, scenario tint); "Restored" moment; §8.5 exercise-variety
  rhythm (`applyRhythm` + `chooseType(opts.prefer)`).
- Personalization/intake spec (all build-order steps): `weights.js` (demand weights + modifiers +
  `effectiveWeights`); **Coverage is now strength-aware + demand-weighted** (`scoring.js`); onboarding
  asks lodging + transport (unlocks previously-dark `requires` lessons); tripType wired to modifiers;
  `seedPlacement()` wires the level quiz to entry depth; veg/GF dietary lesson (`buildDietaryLesson`);
  cut dead needs (solo/off_beaten/cities) + deleted `profile.dialect`; returning-user trip-creation
  skips account-scoped questions.
- XP→Status migration spec (client): `tiers.js` five permanent tiers + legacy XP→floor grandfather +
  migration card + tier-up moment; trip lifecycle/archive (`checkTripCompletion`, frozen departure
  record, finish-line summary, archive shelf); **XP/gems removed everywhere** (session log is the record);
  group view reworked to Readiness comparison.
- Scores spec §3 (Home & IA): Home stripped to state + action (dial cluster, smart action tile, Practice
  chooser, one divergence line); new **Learn** tab (`screen-learn.js`) hosts the relocated lesson map with
  per-category coverage + per-lesson strength rings (replaced 3-star ratings); **Quests dissolved**; dial
  polish (pace tick, delta whispers, size asymmetry); Progress consolidated (tier + trends + divergence +
  archive). §7.2 trend charts (`charts.js`): climb / rhythm / sawtooth. §5.3 returning-user seam copy.
- Earlier same day: removed all em dashes from rendered text; Spain-pack narrative parity; assorted
  lesson/phrasebook polish; emoji → `icon()`/`soundIcon()`.

**Deviations from spec (documented)**
- Tiers computed **client-side** (PWA), carried in the synced blob — spec assumed a server-side daily
  evaluator. Sustained-day tier paths therefore read only recorded `scoreHistory` (a gap breaks a run):
  conservative, never dishonest.
- Group Readiness comparison **repurposes the existing `xp` int column** to carry Readiness (server sort
  `order by xp desc` becomes the Readiness sort) — zero Supabase schema change. Pre-migration members read
  stale/dimmed until they re-sync. Tier + weekly momentum ride in synced `stats` JSON under `__score`.
- Multi-language tiers (Ambassador via 2nd language, World Citizen) are implemented but **unreachable** —
  both packs are Spanish. Two-trips-at-85 path to Ambassador works.
- Haptics no-op on iOS Safari (web `navigator.vibrate` unsupported) — intended, degrades gracefully.

**Verification**: `node --check` + served-file/sandbox extraction for all logic; `tools/audit-pack.mjs`
clean on both packs. **No live browser check this session** — worth a device pass.

**Next**
- §6 Notifications engine — mostly a Supabase **edge function** (scheduling, priority countdown>pace>
  retention>group, quiet hours, caps). Client foundation exists (`notifSnapshot()`, pace check, reminder
  settings row).
- Minor: Learn-tab search; full Profile↔Settings merge.
- Backfill: existing users have empty `profile.lodging/transport` → add a Settings editor or re-onboard
  path so their gated lessons unlock.
