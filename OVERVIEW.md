# Tripfluent — Current Structure Overview

*A snapshot of how the app is built today, to reason about how content should be structured and authored going forward.*

## What it is
A travel-Spanish PWA ("Tripfluent"). You pick a **destination + trip date**; it builds a countdown-paced, scenario-based plan (order food, taxis, hotel, dietary/allergy phrases, emergencies). Each destination is its own **trip** with separate progress. Deployed as a web PWA (installable to home screen), on track to be wrapped natively (Capacitor) later.

## Tech stack (deliberate constraints)
- **Vanilla JavaScript (ES2020+)**, **no framework**, **no build step**. Plain `<script>` files loaded in order; state is one object in `localStorage`.
- **Plain CSS** with design tokens (custom properties); light/cream theme; Plus Jakarta + Playfair (wordmark) + Inter.
- **Backend: Supabase** via plain `fetch` (no SDK) — Postgres + RPC functions, email/password auth (account = recovery vault), web-push reminders via an edge function + cron.
- **Zero client-side runtime dependencies.** Network-first service worker (offline support).

### Code is split into focused modules
`state.js`, `engine.js` (deck builder + content registry), `audio.js` (TTS), `ui.js` (helpers, icons, wordmark, splash), `lesson.js` (exercise engine), `cloud.js`, `accounts.js`, `push.js`, `trips.js`, `nav.js`, `screen-*.js` (home, onboarding, quests, phrasebook, progress, settings), `app.js` (boot). Plus `srs.js` = **empty placeholder** for the spaced-repetition engine.

---

## THE CONTENT ARCHITECTURE (the important part)

### 1. Content lives in per-country "packs" — plain data, zero logic
- `curriculum.js` → **Spain** pack (Castilian) + shared option lists (allergens, lodging, transport)
- `content_mx.js` → **Mexico** pack (`MEXICO_PACK`, 10 foodie scenarios)
- A registry in `engine.js` maps country → pack:
  ```js
  const CONTENT = {
    spain:  { dialect:"Castilian Spanish", tts:"es-ES", stages: CURRICULUM.stages },
    mexico: { dialect:"Mexican Spanish",   tts:"es-MX", stages: MEXICO_PACK.stages }
  };
  function activePack(){ return CONTENT[state.active] || CONTENT.spain; }
  ```

### 2. The data shape (this is the entire authoring surface)
```
pack → stages[] → lessons[] → items[]
```
```js
// Stage = a scenario group
{ id:"mx-s2", title:"Eat & Pay", blurb:"Order, stay safe at the table, and pay.", lessons:[ ... ] }

// Lesson = one ~6-min scenario
{ id:"mx-order", topic:"Ordering food & drink", title:"Ordering Tacos",
  reward:"You can order tacos and dodge the spicy salsa.",   // tongue-in-cheek unlock line
  requires:{ transport:"ferry" },                            // OPTIONAL: only show if profile matches
  items:[ ... ] }

// Item = one phrase pair (THE core unit)
{ es:"¿Está muy picante?", en:"Is it very spicy?",
  note:"Colloquially: '¿pica mucho?'",   // optional usage tip
  latam:"...",  cat:"..." }              // optional dialect/regional notes
```
**Authoring content = writing phrase pairs.** You do NOT author exercises.

### 3. The engine turns phrases into everything automatically
- `rebuildDeck()` takes `activePack().stages`, **filters by the user's trip profile** (conditional `requires` lessons), **injects a generated allergy lesson** from onboarding answers, and flattens into `ALL_ITEMS` (distractor pool).
- `lesson.js` `chooseType()` **auto-generates 6 exercise types** per item — match, multiple-choice (both directions), tap-to-build, type-answer, listen-and-type, fill-in-the-blank — weighted by the user's inferred level. One phrase list → all exercises + wrong-answer distractors.
- **TTS** speaks each phrase in the pack's dialect (`es-MX`/`es-ES`) with no per-item work.
- The **Phrases tab** reads the same deck as a searchable dictionary. No separate authoring.

### 4. Adding/scaling content today
- Edit a phrase → change `es/en` in the pack file.
- Add a scenario → add a lesson object.
- **Add a country (e.g. Peru)** → new `content_pe.js` + one `CONTENT.peru` entry (`tts:"es-PE"`) + a `DESTINATIONS` entry. **Engine never changes** — content/engine separation is a protected invariant.

### 5. Progress model
Per-destination: each trip stores its own `lessons` (completion + stars), `xp`, and `topicStats` (per-category accuracy → powers the group "best/worst at" view). Streak/gems/history/account are global. Backed up to the account and restorable on any device.

---

## Current state & gaps (what to design around)
- **Two packs:** Spain (full ~5 stages) and Mexico (the 10 foodie scenarios). Peru scaffolded-for, not written.
- **Authoring is hand-edited JS.** No CMS/admin, no spreadsheet import. Fine for a dev; not for scale or non-devs.
- **No spaced-repetition scheduler.** Items only resurface *within* a lesson. `srs.js` is empty. The spec wants: items "graduate" only when produced correctly cold/at speed; missed items resurface sooner; difficulty ramps on 4 independent axes (recognition→production, scaffolded→cold, slow→native audio, single→chained).
- **Items have no stable IDs or metadata.** Today an item is just `{es,en,note}`. There's nothing to hang SRS state, difficulty, audio files, categories, or cross-lesson "spaced-review threads" on.
- **Exercises are generated, not curated.** Great for coverage, but no control over which exact exercise a given phrase gets, or hand-built multi-turn/"chained" exchanges.

## Key questions for "how to move forward"
1. **Authoring format:** keep hand-written JS packs, or move content to **JSON/CSV/spreadsheet** (dev-friendly + non-dev-friendly) with a converter to packs? Does content need to update **without a redeploy** (fetched at runtime)?
2. **Item schema:** what metadata should every item carry to enable SRS + scaling? Candidates: stable `id`, `category/tags`, `difficulty`, `audio`, `related`/spaced-review links, `partOfSpeech`, `register` (formal/slang), `dialectVariants`.
3. **SRS design:** per-item mastery state stored where (device vs account/cloud)? Scheduling algorithm (Leitner/SM-2-lite)? How do the 4 difficulty axes map onto item state and exercise selection?
4. **Shared-core vs fully-bespoke packs:** we chose **fully bespoke per country** (each pack is its own scenarios). As countries multiply, do we want a **shared universal core** (hola/gracias/numbers) + country overrides to cut duplication — without breaking the content/engine separation?
5. **Curated vs generated exercises:** stay fully auto-generated, or allow **hand-authored exercises** (e.g. the spec's "chained exchange" / bartender multi-turn) alongside generated ones?
6. **Multi-language future:** structure assumes Spanish. If other languages come, packs get a `lang` too — worth designing the schema for it now?

---

## Content direction the product owner has set (intent + rules)
These are the standing content principles I've been directed to follow — they should constrain any new structure:
- **Travel-phrases-first, not grammar-first.** Teach the most-used trip phrases early ("I'll have the steak", "still water"); breadth across many real situations before any grammar/verb-conjugation depth.
- **Scenario/moment-based units**, never grammar-topic units. (Organize around "At the Restaurant", not "Past Tense".)
- **Destination-specific & dialect-correct.** Each country's pack is *bespoke* Spanish for that place — vocabulary, grammar, and pronunciation must match the destination (Mexican *jugo/ustedes/cacahuate* vs Castilian *zumo/vosotros/cacahuete*). TTS accent is per-country. New countries/languages get added over time; the structure must make each one fully bespoke without touching the engine.
- **Dietary/allergy is a flagship feature**, personalized from onboarding (safety + word-of-mouth driver), not a content afterthought.
- **Anxiety-descending sequencing:** easy confidence-building wins first, emergencies last.
- **Recovery-oriented:** teach repair phrases ("slower please", "how do you say…") so a traveler can stay in a conversation.
- **Audio-first:** understanding the *reply* matters as much as producing speech.
- **Spaced repetition + mastery-based progression** are required: items should resurface on a decaying schedule and "graduate" only when produced correctly cold and at speed; difficulty ramps on 4 independent axes (recognition→production, scaffolded→cold, slow→native-speed audio, single phrase→chained exchange).
- **Countdown-paced** to the user's trip date; **tongue-in-cheek** unlock/reward lines per lesson.
- **Reference persona:** foodie heading to Oaxaca / Mexico ~4–6 weeks out.
- **Peru is scaffolded-for but explicitly not to be built yet.**

## Example: one lesson exactly as authored today
```js
{
  id: "mx-order", topic: "Ordering food & drink", title: "Ordering Tacos",
  reward: "You can order tacos and dodge the spicy salsa. Night one: handled.",
  items: [
    { es: "Una mesa para dos, por favor", en: "A table for two, please" },
    { es: "El menú, por favor", en: "The menu, please" },
    { es: "¿Qué me recomienda?", en: "What do you recommend?" },
    { es: "Me gustaría los tacos", en: "I'd like the tacos" },
    { es: "Un agua, por favor", en: "A water, please" },
    { es: "Un jugo de naranja", en: "An orange juice", note: "Mexico: 'jugo'. (Spain says 'zumo'.)" },
    { es: "Una cerveza, por favor", en: "A beer, please", note: "Casually: 'una chela'." },
    { es: "¿Está muy picante?", en: "Is it very spicy?", note: "Colloquially: '¿pica mucho?'" },
    { es: "Sin chile, por favor", en: "Without chili, please" },
    { es: "La cuenta, por favor", en: "The check, please" }
  ]
}
```
Note what's **missing** for the roadmap: no item IDs, no tags/difficulty, no cross-lesson links, no place to store per-item mastery. That's the gap the strawman below addresses.

## STRAWMAN to react to: enriched item schema + spaced-repetition scheduler
*A concrete starting proposal — not final. Designed to preserve the invariants (pure-data content, no build step, per-trip progress synced to the account).*

### A. Enriched item (content side — still pure data; new fields all OPTIONAL)
```js
{
  id: "mx.order.picante",          // stable, globally-unique (pack.lesson.slug). Auto-derivable if omitted.
  es: "¿Está muy picante?",
  en: "Is it very spicy?",
  note: "Colloquially '¿pica mucho?'",
  tags: ["restaurant", "dietary", "spice"],   // powers phrasebook filters, topic stats, SRS grouping
  difficulty: 2,                   // 1–5 authoring hint → seeds the initial interval
  register: "neutral",             // formal | neutral | slang
  audio: "mx/order/picante.mp3",   // optional native recording; falls back to TTS if absent
  related: ["mx.market.picante"]   // same concept elsewhere → forms a cross-lesson "spaced-review thread"
}
```
Keeping everything except `id/es/en` optional means **all existing content keeps working**; a one-time normalize pass can auto-generate `id` from pack+lesson+slug.

### B. Per-item SRS state (NOT in content — lives in per-trip progress, syncs to the account)
```js
state.trips["mexico"].srs["mx.order.picante"] = {
  ease: 2.3,          // SM-2-style ease factor
  interval: 3,        // days until next due
  due: "2026-07-05",  // next review date
  reps: 4,            // successful reps in a row
  lapses: 1,          // times forgotten
  axes: { production: 1, cold: 0, native: 0, chained: 0 },  // mastery per difficulty axis (0/1)
  lastSeen: "2026-07-02"
}
```
Storing SRS state per **trip** keeps Mexico vs Spain mastery separate, and it rides along in the account backup we already have.

### C. Scheduler behavior (SM-2-lite / Leitner hybrid — lives in `srs.js`)
1. **New item** enters with an interval seeded by its `difficulty`.
2. **Correct →** interval grows (`× ease`); **wrong →** interval resets to ~1 day, ease drops, `lapses++` (missed items resurface sooner — the spec's error-into-SRS rule).
3. An item **"graduates"** (stops surfacing often) only when **all four `axes` = 1** — i.e. produced cold, at native speed, inside a chained exchange. This is how "mastery-based, not lesson-count-based" is enforced.
4. **Exercise selection** reads the item's `axes` to pick the *next hardest appropriate* mode (recognition→production, scaffolded→cold, slow→native audio) — so difficulty ramps **per item**, not globally. This is where the current auto-generator (`chooseType`) gets replaced/steered by SRS.
5. A **session** = due reviews pulled from *all* lessons + a few new items, sized to ~6 min; `related` links drag a concept's siblings into the same window (spaced-review threads). This is the shift from "practice within one lesson" to "review across the whole trip."
6. **Error patterns** (e.g. repeated ser/estar) can trigger a one-line explanation on the 2nd+ miss.

### Open sub-decisions inside the strawman
- Algorithm: full SM-2, a simpler Leitner box system, or FSRS? (SM-2-lite is probably enough at this scale.)
- Do the 4 axes each get their own interval, or one interval + a mastery checklist (shown above)?
- Session sizing & new-vs-review ratio, especially in "cram mode" (<2 weeks to trip).
- Where the normalize/ID-generation step runs given the no-build constraint (tiny runtime pass at load vs an optional local script).

---

*Stack rule of thumb we've been holding: content stays pure data, decoupled from the engine; no build step; no heavy dependencies; keep the Capacitor path open. Any new content structure should preserve these.*
