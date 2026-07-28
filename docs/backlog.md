# Backlog (managed; sequenced 2026-07-27)

Owner key: CODE = build directly, no design needed · CHAT = design/pedagogy session · VERIFY = may
already be fixed, Tom re-checks on current build. Sourced from Tom's 7/24–7/27 notes.

## Already done (no action)

- ~~7/25-1 Fix the header design~~ — SHIPPED v204 (the rail) + v205/v206 safe-area knock-ons.
- ~~7/25-7 Line above the lighthouse~~ — SHIPPED v190–v192 (aura layer + closest-side; device-confirmed).
- ~~7/25-2 Progress wiped on reinstall~~ — the vault saga, closed v203 (see postmortem). The
  "retention 38 after wipe" was the K=20 shrinkage prior: with almost no data, Retention reads
  from the prior, which PULLS UP day-one scores — working as designed, reads odd on an empty account.

## VERIFY on current build (Tom, 2 minutes)

- 7/25-9 Home materialization on launch — the Arrival's formation (photo → dials → tile → lines →
  nav → whisper) shipped AFTER this note and may already be the wish. Re-watch a cold open on v206;
  if the wish is narrower (dials static, only trended numbers materialize), it's a CHAT delta on
  the arrival's formation.
- 7/26-6c Pace marker timing — believed correct-by-design (the tick renders once a pace projection
  exists, which needs a few days of history). CODE will confirm the exact condition and report;
  if the empty state looks broken rather than absent, it becomes a CHAT delta.

## SPRINT 1 — CODE quick-fix batch (one ship, no design dependencies)

1. 7/26-2 Hide the streak flame during onboarding (a new user has no streak to show).
2. 7/26-3 Tap guard after advancing: ignore input for ~300ms [tune] when a new exercise renders
   (fast Continue taps are mis-selecting into the next exercise).
3. 7/26-6a/b Scores-intro screen: top text under the camera (safe-area inset, same class as the
   v205 runner fix) + pace-tick circle clipped (overflow). Mechanical.
4. 7/24-5 "By scenario" sheet traps the user — no way out except picking. Add the standard
   backdrop/cancel exits (bug: every sheet must be dismissible).
5. 7/26-7 Insights whisper window: 2 weeks → 1 week (logic). New-user empty copy = CHAT flag
   (what should it say before there's a trend?).
6. 7/25-6 The correct-answer ding should play even while the phrase is being spoken (audio
   layering; today one suppresses the other).
7. 7/24-8 Sound audit: sweep every exercise type for missing/incorrect resolve audio; fix
   mechanical gaps, flag design questions.
8. 7/24-2 "Where is a table for two" — investigate: likely the close-swap composer welding a
   grammatical-but-silly composition. CODE diagnoses + guards; the rule (what compositions are
   legal) goes back to CHAT with the evidence.

## SPRINT 2 — CHAT: the lesson-feel session (the big one; highest daily-felt payoff)

One session, one theme: **how a lesson breathes**. Tom's items are one complaint wearing seven
coats — pace, scaffolding, and the 4-choice grind:

- 7/27-1 Duolingo first-lessons inspiration: broken-up new words · bolded new word · in-lesson
  transitions that slow it down · slow build (word → word → +with → +please) · variations
  (coffee with sugar / milk with sugar) · round-robin ending.
- 7/26-4 Lessons feel too fast; many exercises auto-advance with no Continue (scrambles the brain).
- 7/25-5 New-phrase intro needs a Continue; exercises should SLIDE between, not blink.
- 7/25-8 The listen-choice reveal is too fast/jumpy (same pacing family).
- 7/26-5 The 4-choice select-one: hated, especially single words — too fast, reads as trick-
  reading, not production. Candidate: retire/demote mc for words, replace with pairs/small-
  sentence contexts.
- 7/26-9 Switch phrase-intro to cold production (or similar).
- 7/24-1 "I for taxi": direct-translation exercises that test glue words feel silly.

Note for chat: this IS §8.5 (sequencing/rhythm), which has been pending since the lesson-
experience spec — Tom's notes are the missing brief for it.

## SPRINT 3 — CHAT: the primer session (small, self-contained)

- 7/27-2 + 7/25-4 Primer design/story presentation improvements.
- 7/25-3 The transition after the first readiness-dials reveal (the scores-intro moment; pairs
  with the 7/26-6 fixes and the new-user insights copy).

## SPRINT 4 — CHAT: practice at scale (merges with the parked practice-chooser session)

- 7/24-6 A 140-item due pile became one monster review: cap session length, chunk into
  manageable sections, most-fading/most-important first, grouped so it doesn't bounce topics.
- The parked practice-chooser design (load-bearing since the home stack) is the same surface;
  run as one session.

## SPRINT 5 — CHAT: exercise chrome + fit (absorbs the small deltas; mostly parked already)

- 7/24-3 Second-chance design no longer fits the current language.
- 7/24-4 Is complete-the-phrase too busy now?
- 7/24-7 Complete-the-phrase: show the translation ABOVE the Spanish (know what you're building).
- 7/24-10 Exercise designs flex to content: screen fit, space, where the eye is.
- 7/24-9 Should every word be tappable-to-speak? (§3.4 tappable-text exists as prior art.)
- 7/24-11 Action tile: try uneven spacing, middle line closer to the top (home-stack delta).

## CONTENT (folds into the Mexico session or a small Spain touch)

- 7/26-8 Teach the REPLIES to questions we teach (¿Cómo está? → "Bien, ¿y usted?" etc.).
  Rule candidate: no taught question without its answerable reply. The `reply:` item field
  exists; this is authoring + possibly a reply-exercise emphasis.

## Standing board (unchanged, slots between sprints at Tom's call)

Mexico pack session · Progress tab depth · session-end stamp cut · Progress/Profile tabtitle
deltas · optional Supabase server-merge hardening.
