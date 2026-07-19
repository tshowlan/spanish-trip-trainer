# Tripfluent — Stage-0 Migration & Journey Re-threading Plan

*How the existing content journey becomes the amended curriculum (Stage 0 + machines + re-threaded passes) without an engine change or a teardown. New file — commit to `docs/`. Sections marked TBD are gated on the Phase-1 inventory.*

## 0. Framing

The 2026-07-17 amendment batch (learning spec §1b.0, §4b.5 meet-the-piece, §11.1 r10–r11) changed CONTENT truths, not engine behavior. The migration is therefore an authoring project with four phases, run in order. Nothing ships mid-phase: the journey flips to the new shape in one deck update once the audit is green.

**What does NOT change:** engine, scheduler, SRS, session composer, exercise types, the Learn tab design (renders old and new shape identically), pass gates, scores.

**What changes:** deck data — lesson membership, unlock order, some item text (canonical forms), new items (machines, kit gaps), chunk annotations, primer copy.

## 1. Phase 1 — Inventory audit (Code, ~1 session)

Export + report, per pack (Spain first, it's live):

1. **Item inventory:** every item with `es`, tier, category, lesson membership, `frame` (if set), `chunks` (if set), `variants`.
2. **Run the new audit checks** (§11.2 checks 11–12, added 2026-07-17) plus three one-off migration queries:
   - **Kit candidates:** tier-1 items matching survival-kit shape (courtesy / yes-no-help / numbers / universal requests) currently living in pass-1 scenario lessons. These MIGRATE to Chapter 0.
   - **Frame census:** for each of the seven head frames (quiero / me trae / ¿dónde está? / ¿cuánto cuesta? / hay / necesito / ¿puedo?), every item instantiating it, by pass. Instances become machine fillers (first 3–4) or fast-path staging (the rest). Also: any frame with ≥3 instances NOT in the head list = machine-or-pattern-moment decision for Tom.
   - **Canonical-form review list:** items whose `es` is idiomatic where a frame-instantiating form exists (§11.1 r10) — judgment list, not auto-fix.
3. **Chunk + primer coverage:** which tier-2/3 items lack `chunks`; which lessons lack `primer` copy (the Learn tab's beat hints consume this).

Deliverable: the report pasted to chat. Everything below firms up from TBD when it lands.

## 2. Phase 2 — Stage-0 authoring (chat drafts, Tom approves)

- **Survival kit:** ~2–3 lessons, 15–20 items. Expected mix: majority MIGRATED from pass 1 (the audit's kit candidates), minority newly authored to fill gaps. Migration preserves item IDs and SRS history — a learner mid-journey keeps their strength; items just change address.
- **Pattern machines:** 8–12 mini-lessons, one head frame each, 3–4 fillers. Fillers REUSE existing frame instances where they exist (item reuse across lessons is the cheap path — confirm schema allows membership in two lessons, or machines reference the items and pass-1 lessons drop them). New authoring is mostly the machine's presentation framing + any missing fillers.
- **Chapter 0 metadata:** stage entry (`pass: 0`, title "Survival kit", blurb per approved artifact), unlock order ahead of Essentials, `core` category on all Stage-0 lessons.
- **Existing-learner grandfathering [Tom to ratify]:** learners past pass 1 get Chapter 0 marked by their existing item strengths (most kit items will already be strong — the chapter renders largely complete on arrival, which is both honest and a nice moment). Machines they never met render available, not owed: no debt mechanics.
- **The dimming wrinkle (flagged by Code, decide before flip):** adding Stage 0 makes it the current chapter, which soft-dims Essentials for users mid-way through it. RECOMMENDED: **chapters the user has started never dim** — un-gate started chapters at presentation level; the map never points an active learner backward. Existing users meet the machines through the session composer's weave (recommendations, not map redirection); new users get the designed gate. Pedagogically generators-first stays true for everyone who hasn't begun; for everyone who has, the engine delivers generators without the map scolding.
- **Authoring division [decided]:** chat + Tom draft Stage 0 content (the frames are the curriculum's spine — pedagogy ownership stays here, per Code's own read); Code wires it into `curriculum.js` and confirmed the build is data-ready: an injected pass-0 stage rendered Chapter 0 correctly with zero code changes.

## 3. Phase 3 — Re-thread passes 1–3 (chat + Tom, lesson by lesson)

1. **Pass 1 lessons re-centered:** with kit items migrated out and machines assumed known, each scenario lesson is re-read as a STAGING ground: frame fast-path items (known frame + new noun), scenario-specific vocabulary, and the scenario's conversational glue. Lessons that hollow out (mostly kit + frame-teaching) merge or gain staged content.
2. **Canonical-form fixes** from the Phase-1 review list; displaced forms move to `variants`.
3. **Chunk authoring** for every tier-2/3 item lacking it, per the §11.1 chunking rule; audit re-run until green.
4. **Frame-prerequisite compliance:** any remaining violations (check 11) resolve by reorder or by adding the machine.
5. **Primer serialization:** pass-level through-line per §9b.3 (one paragraph per lesson, recurring cast, one light continuing beat) — also unblocks the Learn tab's beat hints. Chapter renames land here too (Essentials / Getting comfortable / Like a local).

## 4. Phase 4 — Validate + flip

- Full audit green (all §11.2 checks incl. 11–12).
- Chat spot-review: 10-item sample against chunking + canonical rules (the human-ear pass agreed 2026-07-16).
- One deck update flips the journey; Chapter 0 rendering is PROVEN data-only (Code's in-memory injection test, 2026-07-18): the flip is purely a `curriculum.js` change plus the started-chapter gating decision above.
- STATUS + decisions updated; this doc's TBDs resolved or struck.

## 5. Sequencing note

Phase 1 is strictly first and cheap. Phases 2–3 interleave naturally (machine drafting surfaces canonical questions). The Landed-Tripfluent spec, Progress polish, and photo gathering are independent and can proceed in parallel — this migration blocks only the content-dependent Learn features (Chapter 0 population, beat hints).
