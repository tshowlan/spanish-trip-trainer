# STATUS

Running handoff log. Most recent entry at top. Terse: dates, what changed, deviations, what's next.

---

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
