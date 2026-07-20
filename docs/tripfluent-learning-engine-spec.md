# Tripfluent — Learning Engine Upgrade Spec

*Implementation brief for Claude Code. Covers: enriched item schema, exposure ladder, mistake re-queue, session composer (two-layer model), SM-2-lite SRS, and new exercise types. Written to be implemented in the milestone order given in §9 — each milestone ships independently.*

*Companion documents (one system, three specs): `tripfluent-scores-mvp-spec.md` (Readiness/Momentum/Retention scores, home dials), `tripfluent-personalization-weights-spec.md` (demand weights, weighted Coverage, intake wiring, level→entry depth — reconciled with this spec in §1b.5 and §3), `tripfluent-content-map-handoff.md` (3-pass Mexico map decisions). Where this spec references weights or scores, those specs govern the formulas; this spec governs learning mechanics.*

---

## 0. Non-negotiable invariants (do not violate)

1. **Content stays pure data, engine stays generic.** Packs (`curriculum.js`, `content_mx.js`) contain zero logic. Adding a country never touches the engine.
2. **No build step, no framework, no runtime dependencies.** Vanilla JS (ES2020+), plain `<script>` load order, state in one `localStorage` object synced to the Supabase account.
3. **All new item fields are OPTIONAL.** Existing packs must keep working unmodified. Missing metadata is derived or defaulted at load time.
4. **Per-trip isolation.** All learning state (exposures, SRS, mistakes) is stored per trip under `state.trips[country]`, and rides along in the existing account backup.
5. **Scenario layer stays the user-facing map.** Unlock order, countdown pacing, and anxiety-descending sequencing are unchanged. The changes below alter *when items resurface*, not how the trip is presented.

---

## 1. Core architectural change: two-layer model

**Problem:** today an item lives and dies inside its lesson. Vocabulary is siloed, lessons can't assume prior knowledge, and review has no delivery mechanism.

**Fix:** split responsibilities.

- **Content layer (existing):** `pack → stages → lessons → items`. Defines what exists, what order lessons unlock, and which lesson *introduces* each item. Unchanged as an authoring surface.
- **Scheduling layer (new):** the **session** is the unit of play. When the user taps a lesson, they get a *session* composed of (a) due reviews pulled from anywhere in the trip, (b) recent misses, (c) new items from that lesson. The lesson determines only which new items enter the system.

The user still experiences "doing the Taxi lesson." Review is woven in as warm-up and interleave, never a separate chore screen.

---

## 1b. Tiered spiral structure (content sequencing change)

**Problem:** scenarios bundle wildly different difficulties — the Taxi lesson holds both "el maletero" and "¿Me puede ayudar con las maletas, por favor?" Sequencing by scenario alone makes difficulty bounce around the journey regardless of how gentle each exercise is. The exposure ladder fixes *hard exercise too early for a phrase*; it cannot fix *hard phrase too early in the trip*.

**Fix: spiral curriculum.** Every item gets a `tier`; lessons split by tier; the unlock order interleaves by **pass**, not by scenario depth.

### 1b.1 Tiers

| Tier | Meaning | Shape |
|---|---|---|
| 1 Survival | The 4–6 phrases that get you through the moment | Short, concrete, high-frequency (target ≤6 tokens) |
| 2 Comfort | Options, questions, variations | Medium; built ~80% from tier-1 chunks |
| 3 Fluent | Elaborate, polite, conversational | Long; frames + chunks from tiers 1–2 plus 1–2 new keywords |

`tier` is an optional item field (default 2). Lessons are tier-homogeneous: split "mx-taxi" into "mx-taxi-1", "mx-taxi-2" (, "-3"). A stage's scenarios don't all need every tier.

### 1b.0 Stage 0: Survival Kit + Pattern Machines (pass 0)
Before pass 1, a scenario-agnostic stage of two lesson kinds. **(a) Survival kit:** ~40 items across 3 lessons (courtesy + rescue, numbers + payment, locals-say + emergency) — sizing data-corrected 2026-07-19 from the Phase-1 inventory (the spec's original ~15–20 guess under-counted the natural kit; force-cutting would exile courtesy or emergency basics). Tier-1 shape rules apply. **(b) Pattern machines:** ~7–10 mini-lessons, each drilling one high-value `frame` with 3–4 fillers as ordinary short items sharing that `frame`. **The ratified head list (2026-07-19 reconciliation):** quiero ___ / ¿dónde está ___? / ¿cuánto cuesta ___? / ¿me puede traer ___? (absorbs me trae as the jacket-off variant) / ¿hay ___? / ¿a qué hora ___? (promoted from tail by census: 6 instances) / necesito ___. Demoted to tail: ¿puedo ___? (verb slot, grammatically heavier), qué/cómo/está (pattern-moment territory; está penciled as a possible 8th machine post-launch). **Reconciliation principle: head list = output value × content leverage; the census informs, it does not dictate** (quiero kept at 0 authored instances on output value — its absence was an authoring bias toward question-frames, not evidence against the frame). 7 machines shipped. Rationale: usage-based acquisition — grammar is abstracted from stored frames, so the learner owns generators before scenarios stage them; §6.3's frame fast-path then becomes the dominant scenario-lesson experience ("I already own this sentence"). **Engine impact: none** — authoring + unlock order, like §1b.2. Stage 0 lessons carry category `core`, exempt from the §1b.5 weight-share band (universal by definition, like the floor categories). Map UI: pass 0 renders as its own chapter, **"Survival kit"** (final copy, 2026-07-18); blurb "Your generators." Pattern machines are distinguished by their frame-shaped lesson NAMES ("Quiero ___") plus a "Pattern · N fillers" meta line — **no glyph** (a glyph that needs explaining is a failed glyph, and naming removes the frame-data dependency for rendering). Cram-mode floor (§1b.2) becomes: guarantee pass 0 + pass 1. **Head/tail split:** Stage-0 machines are deliberate instruction for the ~8–12 high-value **head frames** (the generators worth teaching first); low-value **tail frames** that only crystallize across 2–3 phrases get the organic §4c.3 pattern moment instead. A frame gets a machine or a pattern moment, never both.

### 1b.2 Pass-based unlock order

Unlock sequence = pass 1 (all tier-1 lessons across all scenarios, anxiety-descending order preserved within the pass) → pass 2 (tier-2 lessons, same scenario order) → pass 3. Effects, all deliberate:

- Difficulty rises monotonically across the journey instead of bouncing.
- Every scenario is revisited by design — content-layer circling-back. "Ordering II" lands weeks after "Ordering I," with tier-1 items in SRS rotation and tier-2 sentences composed of tier-1 chunks (this is what makes the §11.1 n+1 and spiral rules satisfiable).
- Partial completion = shallow readiness *everywhere*, the right failure mode for a countdown app. Cram mode's floor: guarantee pass 1.

Engine impact: none to flatten/unlock logic — this is authoring plus lesson ordering. Map UI: present passes as chapters. **Chapter naming set DECIDED (2026-07-18):** Survival kit (Chapter 0) / Essentials / Getting comfortable / Like a local — applied to the live deck stage titles, which resolves the old "Survival" vs "Survival kit" collision. Chapter progression stays whisper-level ("N of M" text, no stage bars, no pass chips inside chapters).

### 1b.3 Exercise gates by item length (fixes single-word items)

Mode eligibility gains token-count minimums, applied after the ladder's rung filter:

- **No tap-to-build under 4 tokens. No fill-in-the-blank under 3 tokens.** Building "el maletero" from two tiles is not an exercise.
- Short items use: multiple choice (both directions), matching, listen-and-pick — and presentation/production **in context** via a new optional field:

```js
{ es: "el maletero", en: "the trunk", tier: 1,
  contextEs: "¿Puede abrir el maletero?",   // OPTIONAL example sentence
  contextEn: "Can you open the trunk?" }
```

- Presentation card for short items shows the word + its context sentence, audio for both. If `contextEs` exists, blank exercises may blank the item *inside its context sentence* (the context's other tokens are scaffolding, not tested). Bare nouns with no sentence around them are the purest holophrase risk — the audit script flags short items missing context (§11.2).

### 1b.4 Scaffolded builds + honest production credit (fixes the "por favor" problem)

"Al aeropuerto, por favor" as tap-to-build is fake production — ordering tiles known since day one. Two mechanics:

- **Pre-placed scaffolding:** in tap-to-build, chunks whose keyword/token mastery is high everywhere (e.g. *por favor* after heavy exposure) render already locked in place; the learner assembles only the novel material. Difficulty comes from the item's *new* tokens, not total tokens. (Cheap heuristic pre-M3: a token qualifies as mastered scaffolding if it appears in ≥3 items with exposures ≥5.)
- **Credit weighting:** a build where >70% of tokens are mastered scaffolding does not set the `production` axis. Graduation requires a real cold rep — typed, or a build against competitive distractor tiles. Counts as a normal exposure/correct otherwise.

### 1b.5 Demand weights ↔ tiers (integration with `tripfluent-personalization-weights-spec.md`)

The personalization spec's demand weights (§1.1 there) and this spec's tiers are the same axis seen from two sides — make the mapping explicit:

- **A category's demand weight determines how deep its spiral goes.** High-weight categories (restaurant 0.27) earn tier-2/3 lessons (Talk to the Chef, Mezcal & Bars); low-weight, closed-set categories (airport 0.05) are complete at tier 1. This is the personalization spec's "depth, not just count" (§1.3 there), implemented as tiers.
- **Weights are also content allocation targets.** Weighted Coverage divides per category (`credit ÷ totalPhrases(category)`), so a heavy category with thin content lets a user bank its full weight from one lesson's material — **Readiness inflation**. A pack's item share per category should roughly track its weight share, within a ±40% relative tolerance band (not a quota). Exempt the floor categories the personalization spec exempts from modifiers (emergencies = stakes floor, airport = closed set): their weights intentionally exceed content needs.
- **Depth means breadth of moments, not thicker drilling:** a heavy category earns `reply` coverage (understanding the response is the real restaurant failure mode), `variants`, scoped recovery phrases, and sub-scenario lessons (breakfast/comedor, street stands, reservations, splitting the bill) — not more ways to phrase the same order.
- **Taxonomy rule:** demand weights key on a fixed coarse layer — one `category` per lesson (or a designated primary tag). Granular tags (`numbers`, `food`, `time`) live alongside for distractors/threads (§4b.4). One tag system cannot serve both jobs.
- The weight-vs-share gap is measured by the audit script (§11.2) from day one — Readiness inflation should be a known, shrinking number, never a silent one. Weights/formula ship as code now (per the personalization spec's sequencing); content sizing is authoring that trails it.
- Trip-plan follow-up note: when trimming a behind-pace path, cut depth from low-weight categories first.

---

## 2. Item schema (extend, don't break)

Every item gains optional fields. A **normalize pass at load time** (in `engine.js`, runs inside `rebuildDeck()`) fills in what's missing:

```js
{
  id: "mx.order.picante",     // stable, globally unique: pack.lesson.slug
                              // AUTO-DERIVED if absent: packKey + "." + lessonId-suffix + "." + slug(es)
                              // Derivation must be deterministic — same content = same id across loads.
  es: "¿Está muy picante?",
  en: "Is it very spicy?",
  note: "Colloquially '¿pica mucho?'",   // existing, unchanged

  tags: ["restaurant", "dietary"],  // powers phrasebook filters, topicStats, review grouping
  difficulty: 2,                    // 1–5 authoring hint; seeds initial SRS interval; default 2
  tier: 1,                          // 1 survival | 2 comfort | 3 fluent; default 2. See §1b.
  register: "neutral",              // formal | neutral | slang; default neutral

  contextEs: "¿Puede abrir el maletero?",  // OPTIONAL example sentence for short items (§1b.3)
  contextEn: "Can you open the trunk?",

  frame: "sin ___",                 // OPTIONAL sentence frame this item instantiates
  slot: "chile",                    // the word filling the frame's slot
                                    // Items sharing a frame form a family; see §6.3

  chunks: [                         // OPTIONAL (tier-2/3): authored segmentation powering the
    ["¿Está", "is it"],             // chunk pipeline (§4b.5) — segmented presentation, chunk
    ["muy picante", "very spicy"]   // exercises, tile-granularity descent, tappable hints.
  ],

  keywords: ["picante"],            // OPTIONAL: the 1–3 content words doing the semantic work.
                                    // Must appear verbatim in `es`. Powers blank rotation (§4b),
                                    // keyword threads (§6.2), distractor selection, and the
                                    // coverage audit (§11). Exact surface forms, NOT lemmas.

  variants: ["¿Pica mucho?"],       // OPTIONAL: other natural ways to say the same thing.
                                    // Accepted as correct in typed/spoken grading; occasionally
                                    // presented in recognition modes with a one-line
                                    // "another common way to say it" note (§4b.3).

  anchor: "Think: piquant",         // OPTIONAL memory hook — cognate, loanword, or mnemonic.
                                    // Shown on the presentation card and the correction
                                    // moment (§4c). Cognates first; imagery mnemonics only
                                    // where a genuinely good one exists — no forced puns.

  reply: {                          // OPTIONAL likely native response, for listening exercises
    es: "Sí, pica bastante",
    en: "Yes, it's quite spicy"
  },

  related: ["mx.market.picante"],   // cross-lesson concept links (spaced-review threads)
  audio: "mx/order/picante.mp3"     // optional native recording; falls back to TTS
}
```

**Rules for the normalize pass:**
- Runs once per `rebuildDeck()`, cheap (pure function over the pack).
- Auto-ID collisions: append `-2`, `-3`. Log a console warning so authoring can fix it.
- Build an `ITEM_INDEX` map (`id → item`) alongside `ALL_ITEMS` for O(1) lookup by scheduler and phrasebook.

---

## 3. Learning state (per trip, per item)

New shape under trip state. `srs.js` owns reads/writes.

```js
state.trips["mexico"].learn["mx.order.picante"] = {
  exposures: 3,        // total times shown (any mode, incl. presentation card)
  streak: 2,           // consecutive correct
  lapses: 1,           // total misses
  ease: 2.3,           // SM-2 ease factor (Milestone 3)
  interval: 3,         // days (Milestone 3)
  due: "2026-07-08",   // ISO date (Milestone 3)
  axes: { production: 0, cold: 0, native: 0, chained: 0 },  // 0/1 mastery flags
  lastSeen: "2026-07-04"
}
```

- Created lazily on first exposure. Absent entry = never seen.
- One interval per item + the axes checklist. **Do NOT implement four independent schedulers.**
- Keep entries small; this object syncs in the existing account backup.

**Seeded items (reconciliation with personalization spec §4 — level → entry depth):** when placement seeds stage-0/1 items as pre-known, seeding must set **ladder state, not just SRS strength**: initialize `exposures: 4` (recognition-cleared, scaffold-ready) alongside the reduced stability (S = 7 per the personalization spec) and a near-term `due`. This satisfies "never tested at 0 exposures" without presentation-carding a user who claimed the basics. Self-correction needs zero special cases: if seeded items fail reviews, rung-down (§4.1) and lapse handling (§5.3) walk them back down the ladder — on repeated failure, all the way back to a presentation card. Overclaimed placement re-teaches itself. Seeded items skip pass-1 lessons per the entry-depth design; the first-pass cap still applies to any lesson they actually play.

---

## 4. Exposure ladder (Milestone 1 — the highest-value change)

Replace the global-level heuristic in `lesson.js` `chooseType()` with a per-item ladder driven by `exposures` and `streak`. **Difficulty is a property of each phrase's state, never of the user's global level** — a brand-new elaborate phrase must start gentle even for a user who has aced everything else.

### 4.1 Rungs (thresholds scale with item difficulty)

Rung thresholds are `base + difficulty` (item `difficulty` 1–5, default 2), so short easy phrases graduate quickly and elaborate ones get more runway per rung:

| Rung | Enter at exposures ≥ | Modes |
|---|---|---|
| 0 Present | 0 (always first) | **Presentation card** (show es + en + note, autoplay TTS, tap-to-replay, "Got it" — not graded) |
| 1 Recognize | 1 | match, multiple-choice es→en — **the workhorses; weight these heavily** |
| 2 Scaffold | 2 + difficulty | **one-blank fill (primary)**, tap-to-build, multiple-choice en→es |
| 3 Cold | 5 + difficulty | type-answer, listen-and-type, speak-it (when built) |

Example: a difficulty-2 phrase scaffolds at 4 exposures, goes cold at 7. A difficulty-4 elaborate sentence scaffolds at 6, cold at 9.

**Hard rules:**
- An item's first appearance in the app is ALWAYS the presentation card. No exercise may test an item with `exposures === 0`.
- **First-pass cap:** during a lesson's *first* completion, the ladder is capped at rung 2 — cold-production modes never appear, regardless of counters. Cold modes live only in review sessions and lesson replays. (Principle: **lessons introduce, reviews interrogate.**)

**Rung-down on failure:** two consecutive misses on an item → silently serve its next appearance one rung lower (never announced). Reset on next success. **Multi-chunk miss weighting:** a diffuse miss on a chunked item (the correction sheet's 2+-chunk case, where no single error locus exists — see decisions 2026-07-16) signals the phrase isn't encoded and is a stronger rung-down input than a single-chunk miss of equal count; weight it accordingly (arguably harder than a localized miss). A single-chunk error is a surgical discrimination slip, not a failure to hold the phrase.

**Mode selection within a rung:** prefer the mode that advances an unmastered axis (§5.4); within rung 2, prefer one-blank fill until the item has passed it twice, then widen. Otherwise vary randomly for texture.

---

## 4b. Word-level mechanics (anti-holophrase measures)

**Problem:** phrase-first teaching risks learners memorizing sentences as frozen sound-shapes. Content words that appear once, in one phrase, in one format (e.g. *cambio*, *máquina*) never encode as usable words. These mechanics make the words inside phrases visible to the engine — without building a lexical database (see §10).

### 4b.1 Blank rotation (Milestone 1, needs `keywords`)
Fill-in-the-blank blanks a **keyword**, and successive reps of the same item **rotate which keyword is blanked** before ever blanking a function word. "¿Me puede dar cambio?" → rep 1 blanks *cambio*, rep 2 blanks *dar*... Track the last-blanked index in session memory (not persisted state). Items without `keywords` fall back to current behavior.

### 4b.2 Blank-count progression (Milestone 1)
Within rung 2, blank count grows with the item's progress: first passes = one blank; after 2 correct one-blank passes = two blanks (if the phrase has ≥2 keywords); then tap-to-build; then rung 3 typed. One-blank must be the *entry* difficulty of scaffolding — the workhorse mode the user meets most.

### 4b.3 Variant handling (Milestone 2, needs `variants`)
- **Grading:** typed and spoken answers are checked against `es` AND all `variants` (same typo tolerance). A learner producing any natural form is correct.
- **Presentation:** in recognition modes, ~1 in 4 reps after the item reaches rung 2 shows a variant instead of the canonical form, with the sub-line "Another common way to say it." Never in the item's first 3 exposures (canonical form must stabilize first).
- Listening exercises may use variants freely once rung 2 is reached — locals won't use the canonical string.

### 4b.4 Distractor ladder (Milestone 2)
Distractor quality scales with the **item's rung** (never the user's global level — same principle as §4.1). Early distractors make fragile memories winnable; late distractors force fine discrimination. Pasta as a wrong option for a number is correct behavior at rung 1 and a bug at rung 3.

| Item rung | Distractor pool |
|---|---|
| 1 Recognize | Whole deck, any category — semantically distant, easy wins by design |
| 2 Scaffold | Same tag/category as the answer (other numbers for a number, other dishes for a dish) — elimination-by-category stops working |
| 3 Cold (MC appearances in review) | Near-misses: same category PLUS surface similarity — shared keyword, closest normalized edit distance on `es`, similar token length. Known confusable pairs (sesenta/setenta) surface naturally via edit distance |

Rules:
- Selection is computed from existing metadata (`tags`, `keywords`, edit distance) — no new authoring fields.
- Rungs 1–2 keep at least one clearly-unrelated option (winnability floor). Rung 3 drops the freebie — all three wrong options may be plausible; the item has earned a real test.
- Fallback: if the same-tag pool is too small (<6 items), widen to the whole deck rather than repeating the same distractors every rep.
- **Tag granularity prerequisite:** same-category selection requires reasonably specific tags (`numbers`, `food`, `time`, `directions` as distinct tags, not one broad bucket). See §11.

### 4b.5 Chunk pipeline (long-phrase progression — the core experience for tier-2/3 phrases)

**Problem:** a long phrase arriving as a monolith produces two failures at once — the deep-end feeling (10 unbroken words read as one giant unknown, even when 80% is known material the learner can't *see* they own), and fake mastery (whole-phrase MC teaches silhouette recognition — spotting "the long one starting with ¿Me puede" — not understanding). The fix: make phrases visibly decomposable, and shrink the unit of work as mastery grows.

**Schema — authored segmentation (tier-2/3 phrases; short phrases don't need it):**

```js
es: "¿Me puede traer la cuenta cuando tenga un momento?",
chunks: [
  ["¿Me puede traer", "could you bring me"],
  ["la cuenta", "the check"],
  ["cuando tenga un momento", "when you have a moment"]
]
```

Chunk audio: per-chunk clips generated by the same TTS pre-generation script as phrase audio.

**For chunked items, each rung's exercises operate at chunk granularity before word granularity.** Same rungs, same thresholds, same first-pass cap — only the unit of work changes:

| Rung | Chunked-item modes |
|---|---|
| 0 Present | **Segmented tappable card:** each chunk is a pill — tap for meaning + chunk audio. **Chunks matching already-learned items or frames render as "known"** (visually marked). A tier-3 sentence displays as one new chunk attached to things you own — the deep-end feeling is refuted on screen, not soothed. |
| 1 Recognize | Chunk work replaces whole-phrase MC: match chunks↔meanings; highlighted-chunk → pick its meaning; hear a chunk → spot it in the written phrase. |
| 2 Scaffold | **Blank-a-chunk** with chunk-option MC, then the same blank typed (chunk-level promotion of §4b.1–4b.2 blank machinery); **tap-to-build with CHUNK tiles** — assemble 3 big pieces (easy AND meaningful: proves structure). |
| 2→3 | Tile granularity descends: chunk tiles → word tiles → typed cold. One granularity parameter on the build exercise, no new exercise types. |

**Whole-phrase MC eligibility rule:** for any item with `chunks`, whole-phrase multiple choice is not an eligible mode below graduation. It retains two honest jobs: short phrases (≤6 tokens — the phrase basically *is* a chunk) and speed-round filler for graduated items. Demoted, not deleted.

**Tappable hint layer (all exercises, chunked or not):** any chunk (or keyword) in an exercise prompt is tappable for its meaning. Free during a lesson's first pass; in review, a used hint means that rep cannot set the `cold` axis (counts as a normal correct otherwise). Safety net everywhere, mastery accounting stays honest. Log hint-taps per item — a high hint rate is the item asking for a rung-down.

**Chunks ↔ frames convergence:** "¿Me puede traer ___" is a chunk here and a `frame` elsewhere — the pattern moments (§4c.3) and this pipeline deliberately re-meet the learner with the same sentence-machines. Authoring rule: tier-2/3 phrases should be composed so their chunks are (or contain) previously-learned items/frames; the audit script checks chunk-to-known-material mapping and flags phrases with >1 genuinely-new chunk (§11.2).

**Meet the piece first:** for a chunked phrase whose audit-mapped genuinely-new chunk is not itself an existing item, the composer introduces that chunk as a micro-item (short-item presentation + one recognition rep) before the host phrase's presentation card, within the same session. The host phrase then arrives with **zero new pieces — only new assembly.** The micro-intro occupies a normal weave slot and obeys §6.1b rhythm rules.

---

## 4c. Encoding moments (digestion-side upgrades)

*Rationale: exercises are retrieval; these are the moments where new material actually encodes. Each converts a passive screen into an active one. (Framework check: PACER-style audit — retrieval, spacing, and practice were covered; analogous hooks, visible structure, and error-processing were the gaps.)*

### 4c.1 Presentation card upgrade (M1 field, M2 authoring)
The card shows es / en / `note` / audio as specced, **plus the `anchor` when present** ("Think: *piquant*"). For short items, the `contextEs` sentence renders below (§1b.3). The card is the app's one consumption moment — the anchor is what turns it into an encoding event.

**Active dismissal (card v2.1):** "Got it" is replaced by a one-tap ungraded recognition micro-rep — **one pattern on every variant: a two-soft-option meaning check on the NEW material** (the new chunk for chunked items; the item itself for short items; the piece for meet-the-piece). Options render unmarked, so the card's gold NEW marker doesn't trivialize the check; it's answerable by having read (attention gate, not memory test). Wrong option → gold-ring the correct one and the card waits; correct → green + 650ms auto-advance. Unrecorded beyond exposure 1: no red, no re-queue, no counters; the card cannot be failed. **Chunk taps remain pure exploration** (meaning popover + audio) — the dismissal never overloads the explore gesture. Distractor authoring: the wrong option should be a plausible near-meaning, not a random string (derivable ask for the content pass). Rationale: attention verification + generation effect at recognition cost, with the exit pointing at the same new material the card's whole layout attends to (v2's tap-a-known-chunk targeted *away* from the attention pointer — retired). The §6.1b immediate-retrieval slot (T₁) is unchanged. Design artifact: presentation-card v2.1 (`design/presentation-card.html`).

### 4c.2 Correction moment (Milestone 1)
On any miss, before the session continues: show the correct answer prominently, replay its audio, show the `anchor` if present, and **require a tap-through — never auto-advance.** A two-second forced processing beat is what makes the re-queue pedagogy instead of punishment (hypercorrection only fires if the correction is actually attended to). The §5.1 re-queue is unchanged; this specifies what the learner sees at the moment of error.

### 4c.3 Pattern moment (Milestone 2, needs `frame` data)
When a **tail frame's** 2nd or 3rd family member is introduced, show a one-time interstitial: the frame as a visible machine with its known slot-fillers. Kicker "PATTERN"; headline **"A pattern is forming"** — claims no user agency (the pattern formed *in* them; the app points at it), formation-in-progress, honest. The frame renders large with the slot in the **exercise-blank vocabulary** (blue underline — gold is new/error, and the slot is neither: it's the generator's mouth); a `frameGloss` line explains it ("¿Tiene…? = do you have…? Point it at anything you need."). Known fillers list as dotted-underline known material (tap = audio, gold while playing). A one-time fill sequence on entry drops the known fillers through the slot (~600ms each), then the slot rests OPEN — sanctioned explanatory motion ("this is a machine"), static under prefers-reduced-motion (fillers listed, slot open).

**Scoping — the head/tail split:** fires ONLY for frames **without** a completed Stage-0 pattern machine (§1b.0). **Head frames** (quiero, sin, ¿dónde está…?) are taught deliberately as machines FIRST and never see this screen — they use the §6.3 fast-path callout exclusively. This moment is the **organic reveal for TAIL frames** — patterns crystallizing across 2–3 phrases that don't merit pass-0 real estate (¿Tiene…?, está muy…?); teaching thirty machines up front would turn Stage 0 into a grammar course. A frame gets a machine **or** a pattern moment, never both.

**Active dismissal (generalization rep):** the exit is the §4c.1 active-dismissal pattern applied as a generalization — the frame run on a **never-drilled** filler ("¿Tiene menú? means:" → "Do you have a menu?" / "Where is the menu?"). The aha (understanding a phrase never explicitly learned) IS the exit; ungraded, wrong → gold-ring the correct option, correct → green + advance. No Continue button; the arriving member's real rep still comes from the weave. **Generalization-filler authoring rule:** the filler must be a **cognate or already-known noun** (answerable by generalization, not vocabulary); the distractor varies the **frame's** meaning, never the noun's ("Where is the menu?" not "Do you have a table?").

Generated entirely from `frame` / `slot` / `frameGloss` data; shown once per frame per trip (track shown-frames in trip state). Design artifact: `design/pattern-moment.html` (also carries the §6.3 fast-path callout). Surfaces the engine's relational structure — the learner should know they own a *generator*, not a phrase list.

### 4c.4 Scenario primer (Milestone 2, lesson-level `primer` field)
A ~20-second pre-lesson flow, **first pass only** (replays and reviews skip straight in):

1. **Set the scene (~8s, tap-through):** second-person, present-tense scene text placing the user in the moment ("You land in Oaxaca and hop in a taxi. The driver pops the trunk..."), plus a one-line mission ("In the next 6 minutes: tell him where to go, ask the price, handle your bags").
2. **One framed guess (ungraded, skippable):** "Take a guess — no penalty": the lesson's most guessable new keyword (cognates/near-cognates ideal) as a 3-option MC. Never graded, never recorded, affects no counters; right, wrong, and skip all lead to the identical next screen.
3. **Reveal → start lesson:** correct answer with audio and `anchor`. The reveal doubles as that item's presentation card (counts as exposure 1 — the item enters the lesson at the recognition rung).

```js
// Lesson-level, pure data:
primer: {
  scene: "You land in Oaxaca and hop in a taxi...",
  mission: "Tell him where to go, ask the price, handle your bags.",
  guessItem: "mx.taxi.maletero"   // must be a keyworded item in this lesson
}
```

**Design principle (record in code comments):** the primer's job is as much emotional as cognitive — it connects the next 6 minutes of effort to the trip the user is excited about, by putting them in their future self's shoes. This is the motivation model the no-streak philosophy endorses: anticipation of something real, never fear of losing a counter. Scene copy must stay concrete and second-person; it is not a lesson description, it's a moment they're about to live.

Step-2 exception note: the framed guess does not violate the introduce-first rule (§4.1) — the screen explicitly announces the user isn't expected to know it, nothing is graded or stored beyond the reveal's exposure count, and pretesting followed by immediate reveal is a known encoding aid.

### 4c.5 Effort framing + rung-aware free practice (Milestone 2)
- One-time line when a user first reaches a cold-production exercise: "Typing it cold is what makes it stick — this is the rep that counts." Shown once per trip; passes the §8b.1 guardrail (true statement, no threat). Counteracts misinterpreted-effort ("this is hard, so the app is broken") on the deliberately hard modes.
- **Free Practice composes with the same ladder logic** as normal sessions — users pick the *content* (tag/scenario), never the difficulty. Prevents camping in all-easy modes.

---

## 5. Mistake handling — three loops

### 5.1 Immediate (same session) — Milestone 1
- Missed item → push back into the session queue 3–5 slots later.
- Re-serve it **one ladder rung down** from the mode it failed.
- Session isn't complete until the miss queue is empty (cap re-asks at 2 per item per session to prevent death spirals; after that, mark for next-session warm-up and move on).

### 5.2 Next session warm-up — Milestone 2
- Items missed in the previous 48h open the next session (max ~4), before new content.

### 5.3 Long-term (SRS lapse) — Milestone 3
- On miss: `interval = 1`, `ease = max(1.3, ease - 0.2)`, `lapses++`.

### 5.4 Axes updates (all milestones as modes exist)
- `production = 1` after a correct cold-production answer (type-answer / speak-it).
- `cold = 1` after correct production with no hint/word-bank.
- `native = 1` after correct listen-and-type at 1.0× rate (offer 0.75× as the scaffolded speed).
- `chained = 1` after a correct turn inside a chained exchange (Milestone 4).
- **Graduation** = all four axes set → item surfaces only at long SRS intervals.

### UX mercies (Milestone 1, cheap, mandatory)
- Typo tolerance on typed answers: edit distance ≤ 1 accepted; missing/incorrect accents accepted but show the corrected form ("Almost — note the accent: *está*").
- Progress bar never moves backward mid-lesson. Misses extend the queue instead.

---

## 6. Session composer (Milestone 2)

New function in `srs.js` (or `session.js`): `composeSession(lessonId)` returns an ordered exercise queue. `lesson.js` consumes it instead of iterating the lesson's items directly.

### 6.1 Composition (target ≈ 6 min ≈ 14–18 exercise slots)
1. **Warm-up (0–4 slots):** recent misses (§5.2).
2. **Due reviews (~⅓ of session):** items across the *whole trip* with `due <= today` (Milestone 3; before SRS exists, substitute "items with exposures ≥1 not seen in ≥3 days," oldest first).
3. **New items (cap 5–7):** from the tapped lesson, in authored order, introduced via the **micro-batch weave** (§6.1b) — never as a consecutive card stack.
4. **Interleave:** don't block reviews then news; due reviews fill the gaps the weave creates. Hard constraint: a new item's presentation card precedes any test of it.
5. **Chunk pre-seed ordering:** when a queued new item triggers meet-the-piece (§4b.5), its chunk micro-intro is scheduled in an earlier weave slot than the host phrase's presentation card. Hard constraint, same standing as "presentation precedes test."

### 6.1b Micro-batch weave (anti-massed-presentation rule)

**Never present more than 2–3 new items before retrieving one.** Ten presentation cards in a row is massed presentation — experientially a slideshow the user skims ("Got it" goes reflexive), cognitively the worst encoding pattern available (each card overwrites the last with zero retrieval between). The weave:

- **Micro-batches:** new items enter 2–3 at a time. Max 2 presentation cards may ever appear consecutively.
- **Immediate retrieval:** each new item gets a rung-1 retrieval within 2–3 slots of its presentation card.
- **Expanding within-session gaps** (Pimsleur-style graduated recall, lite): after the immediate rep, re-test at ~5 slots, then ~10 slots if the session is long enough. Gaps are approximate — the composer fills between-slots with due reviews and other batch members.
- Example rhythm for 6 new items (P=present, T=test, R=due review): `P₁ P₂ T₁ P₃ T₂ R T₁' P₄ T₃ R T₂' P₅ P₆ T₄ T₅ R T₆ T₃'` — a rally, not a lecture followed by a quiz block.
- **Minimum-weave guard:** if <3 new items exist (end of a pass), pad the weave with due reviews rather than shrinking to present-test-present-test-done.
- A miss inside the weave follows §5.1 (re-queue, rung-down) — the re-queue slot counts as that item's next gap rep.

**Presentation cards are typographic, not photographic.** The scene-setting job belongs to the primer (§4c.4) — once per lesson, and that's where a single strong lesson photo lives, if anywhere. Cards woven into a live session are beats in the flow: large `es`, `en`, `note`, `anchor`, audio, context sentence for short items. No per-card imagery — repeating one lesson photo across 10 cards reads as filler, and per-item photography doesn't scale. (Asset implication: destination imagery needs ~1 image per lesson for primers, not ~1 per card.)

### 6.2 Review-thread pull
When a due item has `related` links, shares a `frame`, or **shares a `keyword`** with another due-ish item, pull siblings into the same session (max 2 extra) so the concept is met in multiple contexts. Keyword threads are the automatic case — no authoring beyond `keywords` needed. Meeting the same word twice in one session, inside two different sentences, is the strongest encoding event the app can produce; prefer keyword siblings from *different* lessons when choosing which to pull.

### 6.3 Frame families
- If a session introduces a new item whose `frame` is already known (any family member has `exposures ≥ 3`), it may skip the presentation card and enter at the recognition rung — the learner already owns the sentence shell. Show a one-line callout instead: *"New word, same pattern: sin ___."*
- Phrasebook: group/filter by frame as a secondary view (nice-to-have).

### 6.4 Pure-review sessions
If all lessons in reach are complete or the user taps a "Review" entry point on Home, compose a session of due items only. If nothing is due, offer a **speed round** (timed match on graduated items — advances nothing, pure retention + fun).

### 6.5 Cram mode
When trip date < 14 days away: raise due-review share to ~½, prioritize `dietary` and `emergency` tags, and prefer production modes for anything with `production === 0`.

---

## 7. New exercise types

Priority order:

1. **Presentation card** (Milestone 1) — described in §4. Counts as an exposure, never graded.
2. **Choose the appropriate response** (Milestone 2) — English situation prompt → pick the right *learned* phrase from 4 options drawn from the trip's seen items. Zero new content needed. Auto-generate the prompt from the item's `en` ("You want to ask: *Is it very spicy?*") and use tag-matched distractors.
3. **Understand the reply** (Milestone 2, needs `reply` fields authored) — play TTS of `reply.es` → multiple-choice its meaning. This trains comprehension of what locals say back; treat as recognition-rung.
4. **Speak it** (Milestone 4) — Web Speech API (`SpeechRecognition`, lang from pack TTS locale). Lenient normalized match (strip accents/punctuation, ≥70% token overlap = pass). Feature-detect; hide entirely where unsupported (Firefox/iOS quirks). Never block progression on it.
5. **Chained exchange** (Milestone 4) — hand-authored dialogue skeletons at the **lesson level**, referencing item IDs:

```js
// In a pack, on a lesson object — pure data:
chain: {
  title: "Dinner, start to finish",
  turns: [
    { npc: { es: "¡Buenas noches! ¿Mesa para cuántos?", en: "Good evening! Table for how many?" } },
    { user: "mx.order.mesa2" },      // learner must produce this item (tap-to-build first pass, typed on replay)
    { npc: { es: "¿Qué les traigo?", en: "What can I get you?" } },
    { user: "mx.order.tacos" },
    { user: "mx.order.cuenta" }
  ]
}
```
   Rendered as a chat-style screen. Used as stage-end "boss" lessons. Correct user turns set `chained = 1` on those items. This is the single sanctioned exception to fully auto-generated exercises.
6. **Speed round** (Milestone 4) — 60s timed match over graduated items.

---

## 8. SRS scheduler (Milestone 3) — SM-2-lite in `srs.js`

```
onAnswer(item, correct):
  s = learnState(item)
  s.exposures++; s.lastSeen = today
  if correct:
    s.streak++
    if s.interval == 0: s.interval = seedInterval(item.difficulty)   // d1:4, d2:3, d3:2, d4:1, d5:1 days
    else: s.interval = round(s.interval * s.ease)
    s.interval = min(s.interval, daysUntilTrip)     // never schedule past the trip
    s.ease = min(2.8, s.ease + 0.05)
  else:
    s.streak = 0; s.lapses++
    s.interval = 1
    s.ease = max(1.3, s.ease - 0.2)
  s.due = today + s.interval
```

- Defaults: `ease = 2.3`, `interval = 0` (new).
- Presentation cards increment `exposures` only — no scheduling effect.
- Graduated items (all axes = 1): multiply computed interval ×2.
- **Do not implement FSRS or per-axis intervals.** SM-2-lite + axes checklist is the ceiling of complexity.

---

### 8t. `[tune]` — the retention dials (named, anchored, instrumented)

Nobody knows the optimal numbers, including the literature (population- and content-specific); these are DIALS with evidence, not guesses with tenure. Each is anchored to its constant so post-launch tuning is a one-line change. Per-item outcomes by exercise mode are already recorded (`recordAnswer` opts.mode); evidence needs an export only.

| Dial | Current | Anchor |
|---|---|---|
| Same-session retrieval gap | 2–3 slots | composer weave (§6.1b) |
| Re-queue position after a miss | 3–5 slots later | `requeueMiss` in lesson.js |
| Re-ask cap per item per session | 2 | `requeueMiss` |
| Ease seed | 2.3 | `recordAnswer` in srs.js |
| Interval growth | × ease | `recordAnswer` |
| First interval | by item difficulty | `seedInterval` |
| Recognition-graduation threshold | 4 exposures | rung thresholds (§4.1) |
| Mature-rep auto-advance | OFF (self-paced Continue) | `resolveCorrect` in lesson.js; enable only per the expertise-reversal pencil (scores §8.5) |

## 8b. Home screen: action tile, review row, standing line

*Sits directly below the three score dials (Readiness / Momentum / Retention — see `tripfluent-scores-mvp-spec.md`). The dials answer "what's my state"; this region answers "what do I do right now." Same aesthetic rules as the scores spec: data-forward, Whoop/Oura tone, no mascots, no confetti.*

### 8b.1 Copy guardrail (governs everything in this section)

**The hero tile recommends; it never threatens.** Every state's copy must pass this test: *"Is this a true statement about the user's scores and trip, phrased as an available action?"* — never *"Is this a loss I'm being warned about?"*

Concretely banned, now and in future copy: streak language ("don't break," "save your streak"), midnight/daily deadlines, loss-framing of any artificial counter, urgency theater. Momentum decays smoothly by design; there is no cliff, so no copy may imply one. Allowed time pressure comes from exactly one real deadline: the trip date.

### 8b.2 Hero action tile (smart priority launcher)

One large tappable tile. On app open and after each session, evaluate this priority function and render the **first** matching state:

```
function heroState():
  1. CRAM        if daysUntilTrip <= 14
                 → "12 days out — drill your essentials"
                 → launches cram session (§6.5)
  2. REVIEW      if (dueCount + recentMistakes) >= 15        // tunable threshold
                 → "Review 12 due items — quickest way to lift Retention"
                 → launches pure-review session (§6.4)
  3. MOMENTUM    if momentumTrend7 < 0 AND daysSinceLastSession >= 2
                 → "Momentum's dipping — 3 min brings it back"
                 → launches shortest viable session (warm-up + due only, ~8 slots)
  4. NEW LESSON  if an unlocked, incomplete lesson exists
                 → "Start: {lesson.title}"
                 → launches composeSession(lessonId) (§6)
  5. CAUGHT UP   otherwise
                 → "You're ahead — speed round?"
                 → launches speed round (§7.6); purely optional, advances nothing
```

Design intent behind the ordering (do not reorder without product sign-off):
- Retention before acquisition: REVIEW outranks NEW LESSON. Protecting learned material beats covering new scenarios — except inside the cram window, where CRAM's own composition handles the balance.
- MOMENTUM below REVIEW: activity is a means; retention is the point.
- MOMENTUM triggers on a multi-day *trend*, never a daily deadline. If skipped, nothing "breaks."
- The threshold in state 2 (`>= 15`) is the one tunable number; log enough to revisit it with real usage.

Whatever the hero is not showing must remain reachable via the review row below — the hero prioritizes, it never gates.

### 8b.3 Persistent review row

Directly under the hero: three always-present chips, fixed position, visible in every state. This is what makes review available "all the time" — a permanent shelf, not a mode.

- **Mistakes (n)** — items missed in the last 7 days, most recent first; launches a mistakes-only session. A count of 0 shows the chip disabled-quiet, not removed (spatial stability).
- **Due (n)** — SRS due items (pre-M3: the recency heuristic from §6.1); launches pure review.
- **Practice** — free practice: user picks a scenario/tag or "everything"; composes a session with no new items. The escape hatch for "nothing is due but I want to drill."

### 8b.4 Standing line

One compact row under the review chips. Exactly three slots — this region is at its clutter ceiling; anything new must displace something and must answer either "what do I do" or "am I winning the race to the trip," else it belongs on the progress tab:

1. **Phrases ready (integer):** count of items at exposures ≥ 5 with streak ≥ 2 (pre-M3), later count of graduated-or-strong items. The tangible growth number; concrete and rising.
2. **Focus area:** weakest category from `topicStats` (min 10 attempts before showing); tappable → tag-filtered practice session.
3. **Trip pace:** the pace-check projection from the scores spec ("On pace" / "A bit behind — N lessons, D days"). Suppress when no trip date is set or during "establishing baseline."

### 8b.5 Explicitly excluded from this region

Streak counters, daily-goal rings, XP, gems, badges (globally banned per scores spec §5); score history graphs; social features. Momentum's dial label is its number + trend arrow — no evaluative labels ("Hot," "On fire").

### 8b.6 Build notes

- The hero function is a pure read over existing state (trip date, learn map, session log, momentum cache) — no new storage.
- Ships incrementally: chips + Mistakes count and hero states 4/5 work at M1; states 2/3 activate at M2 (heuristic due counts) and sharpen at M3 (true SRS due); state 1 lands with cram mode at M3.
- Recompute alongside the scores cache (app open + session end), render from cache instantly, update in place — same pattern as `tf_scores_cache`.

---

## 9. Milestones (implement in order; each is shippable)

**M1 — Exposure ladder + mistake re-queue** *(no schema migration beyond lazy `learn` entries)*
Normalize pass with auto-IDs and `ITEM_INDEX`; `learn` state with `exposures/streak/lapses`; presentation card (with context-sentence and `anchor` support, §1b.3, §4c.1; **segmented tappable card with known-chunk highlighting for chunked items, §4b.5**); **correction moment (§4c.2)**; difficulty-scaled ladder (§4.1) driving `chooseType()`; **first-pass cap**; **token-count mode gates (§1b.3)**; **whole-phrase-MC eligibility rule + chunk-granularity modes for chunked items (§4b.5)**; **micro-batch weave within the lesson queue (§6.1b — the simple version: present ≤2, retrieve, continue; full expanding gaps arrive with the M2 composer)**; blank rotation + blank-count progression (§4b.1–4b.2) for items with `keywords`; in-session re-queue with rung-down; typo tolerance; forward-only progress bar. Home: review row chips (§8b.3) with Mistakes count live; hero tile with states 4/5 only (§8b.2). **Chunk-author ~15 of the longest current Mexico phrases as seed data.**
*Acceptance:* no item is ever tested at 0 exposures; **no lesson ever shows 3+ consecutive presentation cards**; a lesson's first pass never serves type-answer or listen-and-type; a difficulty-4 item stays in recognition longer than a difficulty-1 item; a 2-token item never appears as tap-to-build; **a chunked item never appears as whole-phrase MC below graduation, its card renders segmented with known chunks marked, and its first builds use chunk tiles**; consecutive blank reps of a keyworded item blank different words; a missed type-answer returns as tap-to-build; **every miss shows the correction screen and requires a tap to continue**; existing packs run unmodified; Mistakes chip launches a mistakes-only session.

**M2 — Session composer + cumulative review**
`composeSession()`; next-session warm-up; recency-based review injection (pre-SRS heuristic); choose-the-appropriate-response; understand-the-reply (author `reply` on ~20 high-value Mexico items as seed data); frame-family fast-path if `frame` data exists; **variant grading + variant presentation (§4b.3); distractor ladder (§4b.4); tile-granularity descent + tappable hint layer with the cold-axis rule and hint-rate logging (§4b.5); keyword threads in review pull (§6.2); scaffolded builds + production-credit weighting (§1b.4); pattern moments (§4c.3); scenario primers (§4c.4 — author `primer` for pass-1 lessons first); effort-framing line + rung-aware Free Practice (§4c.5)**. Home: hero states 2/3 on heuristic counts; standing line (§8b.4) with pre-M3 "phrases ready" definition.
*Acceptance:* a session for a new lesson includes items from previously completed lessons; review share ≈ ⅓; **no session ever contains 3+ consecutive presentation cards; every new item is retrieved within 3 slots of its card and re-tested at an expanding gap later in the session**; a typed answer matching a `variant` is graded correct; a rung-1 item's MC options span categories while a rung-3 number item draws all distractors from other numbers; a tap-to-build of a phrase that is mostly mastered chunks pre-places those chunks and does not set the `production` axis; **a lesson with a `primer` shows it on first pass only, the guess affects no counters, and the reveal registers exposure 1 for the guess item; a frame's pattern moment appears exactly once per trip**; hero shows REVIEW when backlog ≥ threshold; all hero copy passes the §8b.1 guardrail test.

**M3 — SM-2-lite SRS**
Scheduler per §8 replacing the recency heuristic; due-based composition; cram mode; graduation behavior; axes fully wired for existing modes. Home: hero state 1 (CRAM); Due chip and hero state 2 driven by true SRS due counts; trip-pace slot in the standing line.
*Acceptance:* miss → item due tomorrow; correct streak → intervals grow; state survives backup/restore round-trip; hero switches to CRAM inside 14 days.

**M4 — Production depth**
Speak-it (feature-detected); chained exchanges (author one `chain` for the Mexico "Eat & Pay" stage as reference); **"Your last night" capstone lesson for Mexico (§9b.5)**; speed rounds; listen-and-type speed toggle wiring `native` axis; **`cultureNote` display on lesson completion (§9b.4)**.
*Acceptance:* completing the chain sets `chained` on its items; speak-it absent gracefully where unsupported; the capstone references cast characters established in earlier passes.

**Content pass (parallel, human/authoring task — flag but don't block):** **write the Mexico cast sheet first (§9b.2)** — it constrains everything after; **restructure the Mexico pack into tiers (§1b)** — assign `tier` to every item, split lessons into tier-homogeneous lessons, reorder unlocks into passes (expect ~10 tier-1 + ~8 tier-2 + ~5 tier-3 lessons from the existing 10 scenarios, mostly reflowed rather than newly written); **size categories to their demand weights (§1b.5)** — for restaurant/food this means breadth of moments, not thicker ordering drills: `reply` coverage, `variants`, table-scoped recovery phrases, and sub-scenario lessons (comedor breakfast, street stands, reservations, splitting the bill), with the audit's weight-vs-share report as the gap tracker; add `tags`, `frame/slot`, `keywords`, `variants`, **`chunks` for all tier-2/3 phrases over 6 tokens (§4b.5 — composed so chunks map to known items/frames)**, `contextEs/En` (mandatory for <3-token items), `anchor` (cognates first, §11.1 rule 7), `reply`, lesson-level `primer` objects sequenced as arcs (§9b.3, pass-1 lessons first), and `cultureNote` where a genuinely good one exists (§9b.4); rewrite prompt/context text to narrative specifics (§9b.1); apply the authoring rules (§11.1). Run the audit script BEFORE authoring — its report is the checklist.

---

## 9b. Narrative pillar (product identity — governs authoring voice)

**Identity statement:** Duolingo teaches you a language and invents situations to practice it; **Tripfluent simulates your trip, and the language comes along.** Countdown pacing, scenario units, primers, and trip-anchored readiness all already point here. Narrative is the organizing principle, expressed *inside* the existing mechanics — never as a new mechanic competing with them.

### 9b.1 Concrete cultural specifics (authoring rule 8, applies to all prompt/context text)
Exercise prompts, `contextEs/En` sentences, primers, and chained-exchange NPC lines use real cultural specifics, never generic placeholders:
- Real dishes and drinks: *tlayudas, memelas, tejate, mezcal derecho, agua de jamaica* — not "food"/"a drink."
- Real place anchors: *el Zócalo, Mercado 20 de Noviembre* — not "the market."
- A recurring named cast (§9b.2): *"Doña Lupe brings you a plate of ___"* — not "the waitress."

Generic is a smell the audit script flags (§11.2). "The waiter" is a flashcard; "Doña Lupe" is a person you'll miss when the trip's over.

### 9b.2 Destination cast
Each destination pack gets a **cast sheet** (half-page authoring artifact, lives as a comment block or sidecar in the pack file): 4–6 fictional-but-plausible recurring characters (e.g. Andrés the taxi driver, Doña Lupe at the comedor, the mezcalero at the market). Rules:
- Characters recur across lessons AND passes — pass 1's primer taxi driver is the same Andrés whose directions you decode in pass 2; pass 3 is talking to the same people, deeper. Chained exchanges are conversations with people the learner knows.
- **Cast is fictional; food/places are real.** Never reference real named businesses (staleness + implied endorsement); real dishes, drinks, markets, and landmarks are pure upside.

### 9b.3 Primer arcs
Sequence each pass's primers as one loose day: land → taxi → check-in → first meal → evening (the anxiety-descending lesson order already roughly tracks an arrival day). Primers acknowledge each other ("Andrés drops you at the hotel — now the front desk"). Pass 2's primers = day two. Pure copywriting; zero engine work. A pass should read as "your first days in Oaxaca, rehearsed," not "12 lessons." Each pass's primer sequence carries one light through-line (a running motif or small continuing beat — Andrés's recommendation pays off two lessons later), so the pass reads as a story with memory, not adjacent scenes. Still pure copywriting; §9b.6 hard lines unchanged.

### 9b.4 Culture notes (lesson-level field, M2-adjacent)
Optional `cultureNote` per lesson, shown once on lesson completion alongside the reward line: 1–2 sentences of genuinely useful insider texture ("Mezcal is sipped, never shot — kissing the glass is the local tell"). Completion rewards *trip value*, consistent with the no-streak motivation model (§4c.4's design principle). Screenshot-worthy is the quality bar.

### 9b.5 Capstone: "Your last night" (M4, one per destination)
Each destination's final lesson is a hand-authored chained exchange (§7.5) that is explicitly narrative: a full evening woven from the whole pack — greet the host, order, handle a mix-up, small talk, pay, say goodbye to the cast. All four difficulty axes in one story; this is the graduation *moment* the mastery system otherwise lacks a feeling for.

### 9b.6 Hard lines (narrative loses to learning, always)
1. **Token/complexity rules win:** a story-sentence that violates token gates (§1b.3), n+1, or tier targets is wrong, however charming. Rewrite the story, not the rules.
2. **Names and dishes live in prompt/context text the learner reads — never in graded answer tokens.** Drilling "Doña Lupe" as vocabulary teaches a fictional name instead of Spanish. Tested tokens stay the tested tokens.
3. **Weave/ladder/SRS pacing never bends for story flow.** The composer's rhythm rules (§6.1b) outrank narrative sequencing within a session.

Deferred (flag only, do not build): reframing the progress view as an itinerary ("moments you can now handle") — touches the scores spec; own follow-up.

---

## 10. Out of scope (explicitly do NOT build now)

- Peru pack, CMS/spreadsheet import, runtime-fetched content, FSRS, per-axis intervals, native audio recording pipeline, multi-language schema changes beyond keeping fields language-neutral.
- **A lexical database.** No lemmatization, conjugation tables, per-word SRS state, or word-level progress UI. `keywords` are plain surface-form tags on items — that ceiling is deliberate. Per-word scheduling ends in rebuilding Anki plus grammar-first Duolingo and breaks the pure-data content invariant.
- **Graded reader passages** (penciled, do not build): short readings composed only from the learner's known items, unlockable per pass — the long-term narrative payoff. Own spec when its time comes.
- **Mix it practice mode** (penciled, do not build): frames × cross-machine taught fillers compose novel gradeable sentences ("Necesito un café" from necesito + quiero's filler) — the machines paying rent between lessons, manufacturing the transfer moment the pattern-moment dismissal only samples. Slots into Practice's chooser. Exclusions per build review: ¿A qué hora ___? excluded (closed verb set, not swappable); fillers graded exactly as taught; article/gender variants are an explicit accept/reject decision at build time.
- **Session-end summary** (penciled, do not build): the home for session-scale Readiness delta (before → after count-up, top-center interstitial tint, scale-ladder rule). Design after the primer wave.

---

## 11. Authoring rules + pack audit script

### 11.1 Authoring rules (constrain all future content, including the Mexico content pass)

1. **Keyword coverage rule:** every keyword must appear in **≥3 phrases** across the pack, ideally in different frames/syntactic positions and different scenarios (e.g. *cambio* in "¿Me puede dar cambio?" / "¿Tiene cambio de quinientos?" / "Quédese con el cambio"). One-off appearances don't encode; if a word matters enough to be a keyword, it earns three sentences.
2. **n+1 rule:** a phrase should introduce **at most 2 never-before-seen keywords** (given lesson unlock order). Elaborate phrases feel manageable when they're mostly known words plus one or two new ones. Violations: simplify the phrase, or add an earlier phrase that pre-introduces one of its words.
3. **Spiral rule (existing):** later stages' sentences should be ~80% previously-introduced chunks.
4. **Variant rule:** any phrase whose real-world usage varies a lot (payments, greetings, quantities) should carry 1–2 `variants`. Prioritize phrases where a native's likely wording differs from ours.
5. **Tier rules (§1b):** tier-1 items target ≤6 tokens; every scenario needs a tier-1 lesson before any tier-2/3 lesson; short items (<3 tokens) must carry `contextEs/contextEn`; tier-2/3 sentences should compose earlier-tier chunks rather than introduce novel structure wholesale.
6. **Tag granularity rule:** tags must be specific enough to define "same category" for the distractor ladder (§4b.4) — `numbers`, `food`, `time`, `directions` as distinct tags, not one broad bucket. A tag covering >40% of the pack's items is too broad to power distractor selection.
7. **Anchor rule (§4c.1):** prefer real cognates/loanwords; write an imagery mnemonic only when it's genuinely good; leave `anchor` empty otherwise — a forced pun is worse than no hook. Primer `guessItem` should be the lesson's most guessable new keyword (cognates ideal).
8. **Narrative specifics rule (§9b):** prompt/context text uses real dishes, drinks, and place anchors plus the destination cast — never generic placeholders. Cast is fictional, food/places are real, no real named businesses. Narrative never enters graded answer tokens and never overrides rules 1–5.
9. **Chunking rule (§4b.5):** one communicative function per chunk — if you can't name the chunk's job, resegment. **Gloss test:** each chunk's English must read naturally *and* compose into the full translation; a gloss that needs an asterisk means the cut is too fine. Never split inside a dependency that demands grammar explanation: subjunctive clauses stay whole (*cuando tenga un momento*), clitic pronouns stay attached (*¿Me puede traer*). Chunks must be plausibly reusable units a traveler meets again wholesale. Target **2–4 chunks per phrase**. Segmentations are content, not code: per-chunk hint-tap telemetry flags confusing cuts for revision. (Word-level granularity is the keywords / blank-rotation / word-tiles layer's job, not the chunks'.)
10. **Canonical-frequency rule:** an item's `es` is the highest-frequency natural form a traveler says (and a local hears); ties break toward the form instantiating an already-taught `frame` (generative beats idiomatic — "quiero/me trae el bistec" over "para mí, el bistec"). Alternates go in `variants`. Within a tier, author/order items by frequency-of-use judgment (phrasebook consensus; no corpus infra).
11. **Frame-prerequisite rule:** any phrase instantiating a `frame` must unlock after that frame's pattern machine (§1b.0) — or after ≥1 family member, for frames without machines. Late-path phrases with new nouns in old frames are free ("¿Dónde está la comisaría?" costs one noun); late phrases in never-built frames are violations — add the machine or an earlier family member.

### 11.2 Audit script (local dev tool — NOT shipped, NOT a build step)

A standalone Node script, `tools/audit-pack.mjs`, run manually against a pack file. It imports the pack (or parses it), and prints:

1. **Keyword coverage report:** every keyword with <3 appearances, with counts and the lessons involved → this list is the authoring to-do.
2. **n+1 violations:** phrases introducing ≥3 new keywords given lesson order.
3. **Missing metadata:** items lacking `keywords` (informational — optional field, but coverage analysis is blind without it); duplicate auto-derived IDs.
4. **Keyword-not-in-phrase errors:** any `keywords` entry not found verbatim in `es` (hard error — breaks blank rotation).
5. **Tier smells (§1b):** tier-1 items over 6 tokens; short items (<3 tokens) missing `contextEs`; scenarios whose first lesson in unlock order isn't tier-1; tier-2/3 phrases composed of <60% previously-seen tokens (weak spiral).
6. **Tag health:** tags covering >40% of the pack's items (too broad for distractor selection); tags with <6 items (too small to supply same-category distractors without repetition — informational).
7. **Narrative smells (§9b, informational):** generic placeholders in prompt/context/primer text (a configurable wordlist per language: "the restaurant," "the waiter," "a drink," "the market"...); cast names appearing inside `es` answer text (hard error — violates §9b.6 rule 2).
8. **Weight-vs-share report (§1b.5):** each category's item share vs its base demand weight (read from the weights config); flag heavy categories outside the ±40% tolerance band as content-thin (**Readiness inflation risk**) and light categories as bloated. Exempt emergencies and airport (floor/closed-set categories).
9. **Depth checklist for top-weight categories:** for each category above ~0.10 weight — has tier-2 presence? tier-3 presence? `reply` on a meaningful fraction of items (target ≥25%)? at least a few `variants`? Print as a per-category scorecard.
10. **Chunk checks (§4b.5):** tier-2/3 items over 6 tokens missing `chunks` (informational — pipeline falls back to word-level, but the segmented card is the point); chunk text not found verbatim/in-order in `es`, or chunks that don't concatenate to the full phrase (hard error); phrases whose chunks map to >1 genuinely-new piece of material given unlock order (weak spiral at chunk level); phrases with **>4 chunks or any single-word chunk** (informational — review against the chunking rule, §11.1 rule 9: too-fine segmentation or a granularity that belongs to the word/keyword layer).
11. **Frame-prerequisite violations (§11.1 r11, refined 2026-07-19):** a frame's **second and later** instances lacking an earlier machine or family member in unlock order. A frame's debut instance is just a phrase; frames exist once they have two members. (The original form flagged debuts, which mis-fired on demoted-to-tail frames.)
12. **Stage-0 coverage (informational):** frames used by ≥3 pack items with no pattern machine — candidates for one. `core` category exempt from check 8's band.

Exit code 0 unless hard errors (item 4 / duplicate IDs), so it can later gate a pre-commit hook if desired. Keep it dependency-free (plain Node, no npm installs) consistent with the stack philosophy.
