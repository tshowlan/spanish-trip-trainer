# Backlog (managed; sequenced 2026-07-27)

INTAKE PROCESS (Tom's rule, 2026-08-02): Tom sends observations the moment he notices them, raw
and unsorted, any time - mid-sprint included. Code triages every item into exactly one of:
ALREADY DONE (named, with version) · ALREADY QUEUED (named, where) · QUICK FIX (shipped now or
slotted into the current increment) · NEEDS CHAT (parked here with owner label) · NEW (logged
here, dated). Code answers each item's disposition in one line. Deduplication is CODE's job,
never Tom's - sending a duplicate costs nothing and loses nothing.

Owner key: CODE = build directly, no design needed · CHAT = design/pedagogy session · VERIFY = may
already be fixed, Tom re-checks on current build. Sourced from Tom's 7/24–7/27 notes.

## Already done (no action)

- ~~7/25-1 Fix the header design~~ — SHIPPED v204 (the rail) + v205/v206 safe-area knock-ons.
- ~~7/25-7 Line above the lighthouse~~ — SHIPPED v190–v192 (aura layer + closest-side; device-confirmed).
- ~~7/25-2 Progress wiped on reinstall~~ — the vault saga, closed v203 (see postmortem). The
  "retention 38 after wipe" was the K=20 shrinkage prior: with almost no data, Retention reads
  from the prior, which PULLS UP day-one scores — working as designed, reads odd on an empty account.

## VERIFY on current build (Tom, 2 minutes)

- ~~7/25-9 Home materialization on launch~~ — CLOSED 2026-07-28: Tom re-watched a cold open and
  ruled the Arrival's formation good as-is.
- 7/26-6c Pace marker timing — CONFIRMED correct-by-design: the home tick renders once the glide
  path is honest = trip date set + 5 lifetime sessions + score history (the first-reveal screen
  always shows one via a fallback offset). Absent-not-broken; CHAT delta only if the absence
  should say something.

## SPRINT 1 — CODE quick-fix batch — SHIPPED v207, follow-ups through v214 (closed 2026-07-28)

Follow-on fixes Tom's device testing surfaced after the v207 batch:
- ~~Ding missing on device~~ v209: dings are now pre-baked media clips on the same audio lane as
  the voice (v208's WebAudio rescue was insufficient; v210's latency keeper broke TTS, reverted v211).
- ~~New-phrase meaning check silent~~ v212: correct tap dings (wrong tap soft on purpose, ungraded card).
- ~~Meaning check wrong tap~~ v213: tapped wrong option greys out beside the gold-ring hint.
- ~~Topbar + veil scrolled away on Learn/Progress/Profile~~ v214: iOS sticky bug (root overflow-x
  clip from v169) - clip moved to main#app, rail now pins on device.


1. ~~[CODE] 7/26-2~~ DONE: Hide the streak flame during onboarding (a new user has no streak to show).
2. ~~[CODE] 7/26-3~~ DONE (300ms [tune]): Tap guard after advancing: ignore input for ~300ms [tune] when a new exercise renders
   (fast Continue taps are mis-selecting into the next exercise).
3. ~~[CODE] 7/26-6a/b~~ DONE (safe-area + overflow:visible): Scores-intro screen: top text under the camera (safe-area inset, same class as the
   v205 runner fix) + pace-tick circle clipped (overflow). Mechanical.
4. ~~[CODE] 7/24-5~~ DONE (sheet max-height 78vh, backdrop always reachable): "By scenario" sheet traps the user — no way out except picking. Add the standard
   backdrop/cancel exits (bug: every sheet must be dismissible).
5. ~~[CODE]~~ DONE (7d window v207; empty-state copy v217: "Insights arrive after a week of practice.") · was: 7/26-7 Insights whisper window: 2 weeks → 1 week (logic). New-user empty copy = CHAT flag
   (what should it say before there's a trend?).
6. ~~[CODE] 7/25-6~~ DONE v207 ordering + v209 real fix (dings are now media clips on the TTS lane; v208's WebAudio rescue was not enough on device): The correct-answer ding should play even while the phrase is being spoken (audio
   layering; today one suppresses the other).
7. ~~[CODE]~~ DONE (fills now speak at resolve; row/speak flags decoupled) · flags→CHAT: 7/24-8 Sound audit: sweep every exercise type for missing/incorrect resolve audio; fix
   mechanical gaps, flag design questions.
8. ~~[CODE investigated + CHAT ruled + CODE executed v215]~~ semantic tags default-closed, 121 -> 49 welds (composer-welds-after-guard.md) · was: 7/24-2 "Where is a table for two" — investigate: likely the close-swap composer welding a
   grammatical-but-silly composition. CODE diagnoses + guards; the rule (what compositions are
   legal) goes back to CHAT with the evidence.

## SPRINT 2 — CHAT: the lesson-feel session (the big one; highest daily-felt payoff)

One session, one theme: **how a lesson breathes**. Tom's items are one complaint wearing seven
coats — pace, scaffolding, and the 4-choice grind:

- [CHAT] 7/27-1 Duolingo first-lessons inspiration: broken-up new words · bolded new word · in-lesson
  transitions that slow it down · slow build (word → word → +with → +please) · variations
  (coffee with sugar / milk with sugar) · round-robin ending.
- ~~[CHAT ruled + CODE shipped v216]~~ 7/26-4 auto-advance dead (universal Continue).
- [CHAT] 7/25-5 New-phrase intro needs a Continue; exercises should SLIDE between, not blink.
- [CHAT, maybe just a CODE tune] 7/25-8 The listen-choice reveal is too fast/jumpy (same pacing family).
- ~~[CHAT ruled + CODE shipped v221]~~ 7/26-5 MC word-scale-3 only; was: The 4-choice select-one: hated, especially single words — too fast, reads as trick-
  reading, not production. Candidate: retire/demote mc for words, replace with pairs/small-
  sentence contexts.
- [CHAT] 7/26-9 Switch phrase-intro to cold production (or similar).
- [CHAT] 7/24-1 "I for taxi": direct-translation exercises that test glue words feel silly.

Note for chat: this IS §8.5 (sequencing/rhythm), which has been pending since the lesson-
experience spec — Tom's notes are the missing brief for it.

## SPRINT 3 — CHAT: the primer session (small, self-contained)

- [CHAT] 7/27-2 + 7/25-4 Primer design/story presentation improvements.
- [CHAT] 7/25-3 The transition after the first readiness-dials reveal (the scores-intro moment; pairs
  with the 7/26-6 fixes and the new-user insights copy).

## SPRINT 4 — CHAT: practice at scale (merges with the parked practice-chooser session)

- [CHAT designs, CODE has the engine data] 7/24-6 A 140-item due pile became one monster review: cap session length, chunk into
  manageable sections, most-fading/most-important first, grouped so it doesn't bounce topics.
- The parked practice-chooser design (load-bearing since the home stack) is the same surface;
  run as one session.

## SPRINT 5 — CHAT: exercise chrome + fit (absorbs the small deltas; mostly parked already)

- [CHAT] 7/24-3 Second-chance design no longer fits the current language.
- [CHAT] 7/24-4 Is complete-the-phrase too busy now?
- [CHAT] 7/24-7 Complete-the-phrase: show the translation ABOVE the Spanish (know what you're building).
- [CHAT] 7/24-10 Exercise designs flex to content: screen fit, space, where the eye is.
- [CHAT] 7/24-9 Should every word be tappable-to-speak? (§3.4 tappable-text exists as prior art.)
- [CHAT] 7/24-11 Action tile: try uneven spacing, middle line closer to the top (home-stack delta).

## CONTENT (folds into the Mexico session or a small Spain touch)

- [CHAT authors, CODE ships] 7/26-8 Teach the REPLIES to questions we teach (¿Cómo está? → "Bien, ¿y usted?" etc.).
  Rule candidate: no taught question without its answerable reply. The `reply:` item field
  exists; this is authoring + possibly a reply-exercise emphasis.

## Tom's notes 2026-08-02 (with 7/28-7/29 carryovers) — triaged

Quick fixes SHIPPED v223: flame swell on open · pairs caps (<=3 words / 18 chars) + varied seat ·
sound-off escape re-bites at render (regression since the ladder fixed types at compose) · dial
numbers NaN-proofed + the insights promise-line restricted to genuinely new users (veterans with
a sparse week stay silent - the line was reading as a broken dial).

- [CHAT · Sprint 3 brief, enriched] Primer as WORLD-ENTRY: pulled into a scenario, visual language
  not rigid story ("a bag left on a park bench", "my glasses on a bench in Cusco"); words TOP,
  photo BOTTOM (7/29-3); plus: smoother entry when jumping into lessons from Learn (no primer on
  replays = thrown in cold).
- ~~[CHAT solved: machine-family r6 D5, built v225]~~ The flying-speaker reveal (hero glides + scales into the
  played-line seat, words after landing): Tom wants it but the composite reflows mid-flight
  (choices pull up, icon clips) and speed never read right blind - needs the artifact, with the
  layout frozen during flight. Chat already blessed the motion as lawful; the fade ships interim.
- ~~[CHAT ruled via D4]~~ sound_choice miss pattern: wrong-then-release (900ms -> dim), THEN the
  correct washes - never instant auto-select. Applied to the exchange (v225); [CODE queued]
  apply the same sequencing to sound_choice's own renderer.
- [CHAT · letter rungs delta] word_fill quality: single-letter fills feel trivial ("taxi" + i,
  8/2-15) - reserve word_fill for complicated words, and always show the word inside its sentence.
- [CHAT · rhythm tune] Post-arc diet: fewer bare word-picks after intro, more in-sentence types
  (8/2-7; partially served by v221 MC retirement - the residue is review-session composition).
- [CHAT · increment-4 flag] Machine drills should FIRST drill the frame itself (assemble/type
  "hay" from Spanish words) before filler drills; more production than selection (7/29-4). Flag
  rides to chat with the conveyor build.
- [CODE · investigate] Correct ding still intermittently absent (8/2-10) - instrument the miss
  (counter or visible tick) rather than iterate theories; ask Tom to name the exercise next time.
- [CODE · repro needed] Audio icon clips into selections on some exercises (8/2-12) - need which
  exercise; harness sweep otherwise.
- [CODE] Home hero photo paints later than the rest after quitting a lesson (8/2-13) - profile,
  then warm/decode-hint the image.
- [CODE · queued into increment 4] Fill-family EN cue at content scale per the cue grammar
  (8/2-3: "I had to search for the English") - same law as MAKE IT.
- [CHAT · Sprint 4 additions] Review sessions: 40 items is far too many (8/2-16, the 140-pile item
  already queued); basics (Si/No/gracias/por favor) need a review-exemption rule (8/2-17); paced
  review sessions (7/29-7).
- [CHAT · onboarding] Intake ending: a screen showing HOW the plan flexed to the user's choices
  (8/2-18).
- [CHAT · content] Numbers lesson finale: a sentence build composed from the lesson's earlier
  builds, never bare "translate One" (7/28-2).
- [CHAT blessing + CODE] The sound map, next pass: tile-tap sounds on builds; correct-streak dings
  walk up the scale (7/28-1.3/1.4).

Answered inline (no action): "Me trae el menu" AND "Me puede traer" are both correct (taught note
covers it - poder is the polite jacket) · "bring me this one" grammar fixed v220 (gloss-forms) ·
confirm-button pattern already matches Duolingo's (picks grade on tap, builds have Check) ·
1-of-4 phrase selection already dead (v221) · one-cold-at-the-end already addressed by the encore
+ input climb (increment 5, queued) · dedicated second-chance screen already queued (Sprint 5).

## Tom's notes 2026-08-03 — triaged

Quick fixes SHIPPED v226: fill_blank was the last 4-option exercise (now 3, ruling 4 complete) ·
pairs matches now DING and climb a chord as the board completes [tune] (the sound map's first
landing; chat blessing rides with the sound-map session) · idle waveform bars hidden on
matched/settled cards (read as stray dots; shown only while playing - artifact delta flagged) ·
slide speed variants back in the harness (400 shipped / 350 / 300) for Tom's re-pick.

- [CHAT · entry experience] Lesson RE-ENTRY screen (8/3-1): returning to a completed lesson
  should greet - previous stats? congratulations? Joins the parked jump-in-from-Learn item.
- [CHAT · ear family] sound_choice: show the English translation - what you're solving for is
  unclear (8/3-2). Joins the sound_choice miss-pattern item (D4 sequencing queued for CODE).
- [CHAT · brand] Tint on the app logo - Tom wants to try it (8/3-5).
- [CHAT · letter rungs] Long-phrase trays: a sea of 10+ letters confuses - explore progressive
  letter supply (fewer at start, more appear as you fill) with its cons (8/3-9).
- [CHAT · the close] Cold production, especially the close, feels bare - more on screen, maybe
  ceremony (8/3-10). Candidate for the close's artifact session; touches increment 5's encore.
- [Tom re-pick · CODE ships] Slide speed (8/3-8): variants live in the harness.

Answered inline: sound-completes-it "three dots" and pairs "three dots" were the same idle
waveform bars - hidden at rest now (v226) · 4-option residue found and killed (fill_blank).

## Standing board (unchanged, slots between sprints at Tom's call)

Mexico pack session · Progress tab depth · session-end stamp cut · Progress/Profile tabtitle
deltas · optional Supabase server-merge hardening.
