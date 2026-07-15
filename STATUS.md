# STATUS

Running handoff log. Most recent entry at top. Terse: dates, what changed, deviations, what's next.

---

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
