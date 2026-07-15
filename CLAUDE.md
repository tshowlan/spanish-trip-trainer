# CLAUDE.md — Tripfluent architecture & conventions

Stable context for all Claude sessions. Read this + `STATUS.md` first. `docs/` holds the specs;
`docs/decisions.md` holds settled decisions (do not relitigate). `OVERVIEW.md` is an older, deeper
content-architecture design doc — useful background, but where it conflicts with this file, this file wins.

## What it is
Tripfluent: a travel-Spanish PWA. Pick a **destination + trip date** → a countdown-paced, scenario-based
plan (order food, transit, hotel, dietary/allergy phrases, emergencies). Each destination is its own
**trip** with separate progress. Premium fitness-app aesthetic (Whoop/Oura dials: Trip Readiness,
Momentum, Retention), deliberately anti-Duolingo.

## Stack (deliberate constraints — preserve them)
- **Vanilla JavaScript (ES2020+), no framework, no build step.** Plain `<script>` files loaded in order
  in `index.html`. Zero client-side runtime dependencies.
- **State = one `localStorage` object** (`sts_state_v1`, see `state.js`), mirrored to per-trip snapshots
  in `state.trips[dest]`, synced to **Supabase** (a JSON progress blob) via plain `fetch` (no SDK).
- **Plain CSS** with design tokens (custom properties); light/cream + dark theme; theme-aware.
- **Web PWA on GitHub Pages.** Network-first service worker (`sw.js`) for offline. Capacitor/native path
  is kept open but **not wired** — the app is web-only today and stays a PWA for fast iteration (see decisions).
- **Backend:** Supabase Postgres + RPC functions (`supabase_setup.sql`), email/password auth (account =
  recovery vault + group sync), web-push via an edge function (`supabase/`).

## Module map (current)
- `state.js` — `DEFAULT_STATE`, `STORE_KEY`, `DEST_FIELDS` (per-trip snapshot fields), load/save.
- `engine.js` — content registry `CONTENT` (country → pack), `activePack()`, `rebuildDeck()` (filters
  `requires` lessons, injects generated allergy + dietary lessons), `meetsReq()`, `buildAllergyLesson()`,
  `buildDietaryLesson()`, `seedPlacement()` (level → entry depth), item-id normalize pass.
- `srs.js` — exposure ladder + SM-2-lite scheduler. `chooseType()` (+ `opts.prefer` for §8.5 rhythm),
  `recordAnswer()`/`recordExposure()`, `itemStrength()`, mastery axes {production, cold, native, chained}.
- `scoring.js` — Readiness/Momentum/Retention/Coverage/Recency, pace projection, `scoreDivergence()`,
  `scoreTrend()`, daily `scoreHistory` snapshots (`_recordDaily`). Coverage is strength-aware + demand-weighted.
- `weights.js` — `CONTENT_WEIGHTS` (demand weights per category) + modifier vectors + `effectiveWeights()`.
- `tiers.js` — five status tiers, `earnedTier()`/`currentTier()`, `migrateXpToFloor()`, `applyTierUpdate()`.
- `charts.js` — `trendChart()` (§7.2: readiness climb / momentum rhythm / retention sawtooth).
- `audio.js` — TTS `speak()`, `playSound()`, `haptic()` (Capacitor-or-`navigator.vibrate`).
- `ui.js` — `$`, `el`, `toast`, `renderTopbar`, Phosphor `icon()` (256 viewBox, supports multi-element
  markup), `soundIcon()` (animated waveform).
- `lesson.js` — session composer (`composeSession`/`composeReview`/`applyRhythm`), exercise renderers,
  grading + feedback, primers, chained exchanges, speed round, completion (`finishLesson`/`finishReview`).
- `cloud.js`, `accounts.js`, `push.js` — Supabase sync, auth, web-push. `categoryOf()` lives in `cloud.js`.
- `trips.js` — per-destination snapshot/restore, `checkTripCompletion()` (freeze archive record).
- `nav.js` — bottom `TABS`. `screen-*.js` — home, learn, onboarding, phrasebook, progress, settings/profile.
  (`screen-quests.js` is on disk but unlinked from `TABS` — Quests was dissolved.)
- `app.js` — boot order (migrations → `rebuildDeck` → `migrateXpToFloor` → `checkTripCompletion` →
  `applyTierUpdate` → first render).

## Content
- Packs are **pure data, zero logic**: `curriculum.js` (Spain / Castilian, `key:"spain"`) and
  `content_mx.js` (Mexico, `key:"mexico"`). Shape: `pack → stages[] → lessons[] → items[]`.
- **Tiered spiral:** 3 passes (Survival / Comfort / Fluent), `pass:N` on stages. Item identity is the
  **phrase** — auto-id `pack:slug(es)`, so items keep SRS history across reshuffles.
- Item fields (all optional beyond `es`/`en`): `tier, tags, keywords, difficulty, contextEs/En, note,
  anchor, variants, reply, requires, primer, chain`. Authoring content = writing phrase pairs; exercises
  are generated. Content/engine separation is a protected invariant — adding a country never touches the engine.
- Validate packs with `node tools/audit-pack.mjs <pack>.js` (keyword coverage, n+1, cast-name-in-`es`, dupes).

## Conventions (do these every time)
- **Deploy = commit → push to `main` → GitHub Pages.** No build.
- **Bump `sw.js` `CACHE` (`sts-vNN`) on every deploy** or clients serve stale scripts. Currently `sts-v107`.
- **A new module needs BOTH** an `index.html` `<script>` (correct load order) **and** an `sw.js` `ASSETS` entry.
- **Rendered text: no em dashes.** Use comma/colon/period. Hyphen only for compound words / numeric ranges;
  en dashes → hyphen. (Code comments may keep em dashes — they're not rendered.)
- **No emoji in rendered UI** — use `icon()` / `soundIcon()`. Exceptions kept on purpose: country flags and
  the one-time onboarding trip-style picker.
- **Verification without a browser:** the preview/SW pins stale scripts, so verify via `node --check` +
  served-file/sandbox extraction (brace-match a function, `new Function`, stub globals), not a live preview.
- Commits end with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## Current priorities (see STATUS.md for detail)
- **Done:** scores + lesson experience (spec §8), personalization/intake (demand-weighted Coverage,
  intake wired), XP→Status migration (client), §3 Home/IA overhaul, §7.2 trend charts.
- **Next:** §6 Notifications engine (mostly a Supabase **edge function** — scheduling/traffic-rules/caps;
  client foundation exists). Minor: Learn-tab search, Profile↔Settings merge.
- **Known gap:** existing users who onboarded before the intake change have empty `profile.lodging/transport`,
  so their gated transport/lodging lessons stay hidden until a re-onboard or a Settings editor.
