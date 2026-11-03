# Tripfluent — The Stats tab (was Progress, was Insights): rulings (chat, 2026-11-02)

*Answers the 11/01 evening brief and its round two, questions 1 to 10. Supersedes tripfluent-progress-rulings-1101.md except where §6 below says a ruling survives. Tom is the decider on the name and on the Test Lab guard; everything else is ruled. Code mocks at three states (zero, one week, four weeks) in dev/insights-options.html before anything builds.*

## 1. THE NAME: Stats (Tom's call; Insights is the alternative)

**Stats.** One word, one syllable, next to Home and Learn in the tab bar; the gym word, which is the aesthetic. The page is numbers (a rate, scores, bests, minutes, totals) and the literal law says call it what it is.

Why not Insights: an insight is a conclusion drawn from numbers, and this page draws none. The engine composes and never interprets, so a tab called Insights promises a sentence the page will never say. It is also the word Instagram, Fitbit, Oura, and Strava use for the paragraph that tells you what your numbers mean, which is exactly the thing we are not building.

Why not Numbers (collides with the numbers chapter and Numbermachine), Record (reads as the verb on a tab in an app with hear and say exercises), Scores (reads as school), Form (too vague).

If Tom prefers Insights, nothing else in this document changes; the word appears nowhere on the page itself. The page head is the tab's word and nothing else.

## 2. THE INDEX: no. The rate, then the change in points

**Rate plus change, Code's shape, with these words.** An index (120 = 20% better than your usual) is a number nobody can check against anything they did; the rate is a thing you can count. The row:

- Left: the kind of exercise. Right: the rate. Under the rate, small: the change against your usual.
- The change is in points, never with a % sign: **up 6** · **down 3** · **steady**.
- **Steady** is a change of 2 points or fewer either way. (Derived: with about a hundred answers of a kind in 14 days and a rate near 90%, the sampling noise alone is about 3 points; a move inside that is not a move.)
- The change shows only when the 14 days hold at least 20 answers of that kind and your usual holds at least 50. Before that the row shows the rate alone, no change.
- A kind never played does not render.
- Row names: one word, the thing the learner did, sentence case: **Listening** (hear) · **Picking** (pick) · **Building** (build) · **Typing** (type). Code maps every renderer to one of these and lists the mapping in its handoff; a renderer that fits none gets a name by the same rule (the verb's -ing, one word) and chat checks it. Review sessions are not a kind: the record is per exercise kind wherever the exercise ran.

## 3. "YOUR USUAL": the eight weeks before the window, never including it

**Your usual is the eight weeks before these fourteen days, or every day before them if there are fewer than eight weeks.** It never includes the fourteen days being compared, or the comparison is diluted by itself. One rule, no switch at week eight: the window of the usual simply stops growing there.

The same word covers time in §8 (your usual time per kind of exercise), where it means the learner's own mean, as the app already keeps it.

## 4. SPEED: only in the best sessions, only against your usual, never "quickest exercise"

**"Quickest session" is not a Tripfluent sentence, and "quickest exercise" is not a Tripfluent number.** The constitution never praised fast because fast on an exercise is a tap, not Spanish; an exercise answered in 1.2 seconds was guessed, and a page that rewards it teaches guessing.

What the constitution can own is **not hesitating**: every answer right, and the whole session in less time than you usually take. That is the fluency proxy, it is per learner, and it already has a home in Tom's round two (the best sessions, §8). So speed lives in one place on the page, as a session's time against your usual, and nowhere else. No quickest-exercise line, no quickest-session line, no speed anywhere in the hero.

The record may therefore drop **best time** per kind; nothing on the page uses it. The record keeps answers, right, and time spent per kind per day (the mean needs those two), plus the duration and the expected time on each session record (§8).

## 5. THE LABELS AND THE HERO

Section labels, micro-caps, in page order: **PLACES** · **BY EXERCISE** · **BEST SESSIONS** · **TIME** · **TOTALS** · **TRIPS**. The hero carries no label; its caption is its label.

The hero:
- The number: **91%**, large, alone (round two).
- The caption: **Right in the last 14 days**
- The small line: **458 exercises in 22 sessions. 90% all time.** (The counts belong to the window; the all-time rate is the only all-time thing up here. "Exercises" stays because it is the app's word.)
- At zero: the number is a dash, the caption stays, the small line is **Your first session sets this.** (Code's draft, kept.)

Page order: hero · PLACES · BY EXERCISE · BEST SESSIONS · TIME · TOTALS · TRIPS. Rate, then where you stand, then what moves, then the trophies.

## 6. WHICH MORNING RULINGS SURVIVE

| Morning ruling | Now |
|---|---|
| Four blocks in order | **Replaced** by the seven above. |
| Place states Not yet / Slipping / Handled / Solid | **Not yet** survives, on the square. **Slipping** and **Handled** retire with the page they were written for; the score says it better. **Solid** survives as the earned mark: a gold check on the square when every session of the place is SOLID (the constitution's state). **Known** is new: a place whose sessions are all marked Known shows **Known** where the score would be; it is not taught or reviewed, so it has no strength. |
| Handled definition (stock replies heard) | **Retired.** Replies are counted hear items now; they show inside the tapped place. |
| Five flags with doors | **Retired entirely** (Tom). The one idea that keeps a job: **a sentence missed three times running goes first in its next review, silently.** No line on Home, no line on Learn, nothing on this page. Code's view, confirmed. |
| No days-not-practiced flag | **Stands**, and is now moot. |
| The 14-day strip + "9 of the last 14 days" | **Gone** (Tom). The TIME block shows the same days with more truth. The count line does not move anywhere; Home's Recency has it. |
| Trips as trophies, last, "Spain · May 2026 · 84% ready" | **Stands.** |
| Arcs under the dials | **Stands** (Home's business). |
| No charts on this page | **Amended**, §9. |
| The row is the door | **Retired.** Stats holds no doors (Tom). Tapping a place opens its sheet (§7), a list, not a session. |

**The place score, derived:** the mean strength of the sentences the learner says at that place, 0 to 100, rounded, as the engine already keeps strength. Replies (heard) do not count toward the score; chapter-1 words do not either (they belong to topics, not places). Unplayed sentences are not in the mean; a place with no sentence met is Not yet.

**The place sheet (tap a square):** the place name; the Solid check if earned; then **its sentences, low first**, each with its strength number; then **What you hear**, the place's replies, low first, each with its strength. Rows under the fade line wear the slipping color the app already has. No words beyond the sentences (the sentence is the unit the score is made of), no doors, no buttons. Close by swiping down, like every other sheet.

## 7. THE SIX PLACE ICONS (Phosphor 2.1, regular weight, 30 px, as the mock)

| Place | Phosphor name | Why |
|---|---|---|
| Counter | **coffee** | the bar's cup; cortado, caña, tapas all stand at it |
| Table | **fork-knife** | the table, not the food |
| Street | **signpost** | directions, the whole session |
| Shop | **shopping-bag** | the act of buying; storefront is a building and reads as Counter's bar at 30 px |
| Help | **first-aid-kit** | the box with the cross; the bare cross (first-aid) reads as a plus or a church |
| Paying | **credit-card** | the card is the Paying session's own question; receipt reads as the Table's bill |

All six verified present in @phosphor-icons/core 2.1.1 regular. One weight everywhere; no fills, no duotone. Code checks none of the six is already used elsewhere in the app with another meaning and swaps the clash if so. For chapter 3 later: **bed** (the hotel desk), **train** (transport); both present.

## 8. THE BEST-SESSION LINE

Top five, all time. **Every session the learner got all right ranks**, quickest against your usual first; a perfect session that came in over your usual still ranks, with its number saying so. Perfect is what makes it a best session; time only orders them.

The row:
- Left: the session's name, as Learn names it (Table · Counter words 2 · Review).
- Right, the number: **35 s under** · **8 s over**. Never a minus sign: a minus reads as a loss, and under is the win. Under 60 seconds the unit is seconds; from a minute, **1 min 20 s under**.
- The small line: **23 of 23, 4 min 12 s, Oct 14.** (The right count, the total time, the date, Oxford comma, the app's existing short date.)

**Your usual time for a session** = the learner's own mean time per kind of exercise, summed over the session's exercises, **computed when the session ends and stored on the session record** as its expected time. A best stays a best: it is not re-ranked later against a faster you. Needs: duration on the session record, the per-kind means synced (DEST_FIELDS), the expected time stored at session end.

Qualifying: a session has a number only when every kind it contained had a usual at the time (20 answers of that kind before it). The section renders once one session qualifies and is hidden until then.

## 9. MINUTES AS BARS: yes, with limits

**Bars, yes.** The morning's no-charts ruling was about the dials' numbers (how a number is moving is Home's question). Minutes per day is not a trend; it is a calendar with height, the strip's job done with more truth. Seven bars are the honest picture of a week, and seven numbers in a row would be a table pretending not to be a chart.

The limits, so it stays a picture of days and not a chart:
- Seven bars, today last, the day's letter under each, the minutes above each bar as a small number, hollow at zero. No axis, no gridlines, no trend line, no average line, no colors beyond the app's one fill.
- A day's minutes are **session minutes** (the durations on the session records summed), not time with the app open.
- Tapping opens the month: **a grid, not bars**, a cell per day with its minutes inside, paged back to the learner's first day, today's cell marked. Days before the record shipped are blank, not zero (the record does not know them).
- Zero: seven hollow days and **Your first minutes show here.**

The decisions line amends ruling 7 to: no charts of the dials' numbers on Stats; the minutes block is the one bar.

## 10. THE EXPLAINING LINES (one under each head; the hero's is its caption)

| Where | The line |
|---|---|
| Hero caption | **Right in the last 14 days** |
| PLACES | **Each score is how well that place's sentences are holding, out of 100. Tap a place to see which ones are low.** |
| BY EXERCISE | **What you got right in the last 14 days, and how that sits against your usual.** |
| BEST SESSIONS | **Every one of these you got all right. The quickest against your usual comes first.** |
| TIME | **Minutes you spent in sessions, each day this week. Tap to see the month, back to your first day.** |
| TOTALS | no line; the data is the line: **Since July: 48 sessions, 774 exercises, 696 right.** |
| TRIPS | no line |

**The record's first week** (existing learners, from the day it ships): BY EXERCISE and BEST SESSIONS have nothing yet. Each shows its head and, in the line's place, **Counting from Nov 3. Give it a week.** (Tom's date style; Code substitutes the ship date.) After the week, the rows appear as they qualify (§2, §8).

**The zero page** (a new learner): the hero's dash and **Your first session sets this.**; six squares, all **Not yet**; TIME with seven hollow days and **Your first minutes show here.**; nothing else renders; and one line at the bottom of the page: **This page fills in as you play.** (Replaces Code's "More appears here as you move through the chapters": chapters are the app's word for its insides; play is what the learner does.)

## THE THREE STATES, for the mocks

- **Zero:** as above.
- **One week:** hero 88%, caption, **61 exercises in 4 sessions. 88% all time.** · PLACES: Counter 54, Table 41, the rest Not yet · BY EXERCISE: Listening 94% (no change yet), Picking 91%, Building 82% · BEST SESSIONS: hidden · TIME: four bars of seven · TOTALS: Since November: 4 sessions, 61 exercises, 54 right.
- **Four weeks:** hero 91%, **458 exercises in 22 sessions. 90% all time.** · PLACES: Counter 88 with the Solid check, Table 85, Street 91, Shop 79, Help Not yet, Paying 83 · BY EXERCISE: Listening 96% up 2 (steady), Picking 93% up 4, Building 85% down 3, Typing 88% steady · BEST SESSIONS: five rows, the top one **35 s under**, the fifth **8 s over** · TIME: a full week, one hollow day · TOTALS · TRIPS absent.

## TEST LAB GUARD: Tom's

Not ruled here. Code recommends (b): the record ignores Test Lab launches and simMode, keeps staged play, and the lab gets a "Clear my stats record" button. If (b), the button's word follows the tab's name.

**Surfaces touched:** screen-progress.js entire (becomes the Stats page: hero, squares, rows, best sessions, time block with the month sheet, totals, trips); the tab bar label; one new sheet (the place sheet); the record (new, per day per kind: answers, right, time spent; synced per trip in DEST_FIELDS, merged by union on day keys); the session record (gains duration and expected time); the per-kind time means (synced); the review's ordering (missed three times running goes first); six Phosphor icons; Test Lab (the clear button, if b). Untouched: Home, Learn, Practice, the ceremony, the session end, the exercise renderers.

## → decisions.md

- 2026-11-02 — The Progress tab becomes Stats (Tom to confirm the word; Insights is the alternative): data you cannot see on Learn or Home. Hero = the 14-day success rate, one big number; places as squares with a score (mean strength of the place's sentences, 0 to 100; Not yet, Known, or the Solid check); by exercise = rate plus the change in points against your usual (up / down / steady, steady = 2 points or fewer); your usual = the eight weeks before the window, never including it; best sessions = top five perfect sessions ranked by time against your usual, the expected time fixed at session end; minutes per day as seven bars with a month grid behind them (the one bar on the page); totals; trips as trophies. No doors, no flags, no strip; a sentence missed three times running goes first in its next review, silently. No quickest-exercise stat anywhere.
- 2026-11-02 — Slipping and Handled retire as place states; Not yet and Solid stay; Known shows on a place whose sessions are all Known.

## → STATUS.md (prepend)

2026-11-02 — Chat: Stats tab ruled (ten questions): name (Stats, Tom to confirm), rate plus change in points, your usual = eight weeks before the window, speed only as a session's time against your usual, labels and all explaining lines, six Phosphor icons (coffee, fork-knife, signpost, shopping-bag, first-aid-kit, credit-card), best-session line ("35 s under"), minutes as bars with a month grid. Needs the answer record and the session duration before the rows and bests can show. Test Lab guard: Tom's call (Code recommends b). Next: Code mocks three states, Tom reviews, then build.

---

## AMENDMENT (chat, 2026-11-02, after Tom's question): the place score counts chapter-1 words

Chat reversed the sentences-only score. Why: chapter 1 is the first weeks for every learner, and under the sentences-only rule all six squares would read Not yet until chapter 2, a dead page exactly when the habit forms. A place score is honest at any size: in chapter 1 it is the strength of the Counter's words; once the Counter sentences land they join the mean. Same number, growing meaning, no switch.

The amended ruling (replaces the score paragraph and the sheet in §6):

- The place score = the mean strength of every item the place carries, 0 to 100: the words from its chapter-1 sessions, the sentences from its chapter-2 session, chapter 3's lines later. Items the learner has not met are not in the mean. Replies (heard) stay out of the score; they show on the sheet.
- Which chapter-1 sessions belong to which place: the ones named for it. Counter words (1 and 2) → Counter. Table words → Table. Street words and Signs you'll read → Street. Paying words → Paying. Help words → Help. Shop words, if chapter 1 has one, → Shop; if not, Shop is Not yet until its sentences.
- The everywhere sessions (First words 1 and 2, Words you'll hear, Numbers 1 and 2, the sounds session) belong to no place. They are in the hero rate and in Retention on Home. A square is a place, and hola is not a place.
- The place sheet lists sentences low first, then words low first, then What you hear. In chapter 1 the sentence group is simply absent, not empty.
- Not yet = no item of the place met. After Counter words 1, the Counter square has a score.

Code lists the real session-to-place mapping from the shipped chapter-1 list in its handoff; chat checks it. A place with two word sessions and fourteen sentences is weighted toward its words; leave that alone for now, weighting is a dial for later.

---

## CODE'S HANDOFF ITEMS FOR CHAT TO CHECK (2026-11-02)

**Chapter 1's sessions, as shipped, mapped to places** (chat asked for the real list):

| Session (Learn's name) | id | Place |
|---|---|---|
| Counter words · 1, Counter words · 2 | w-counter (split in two by the engine) | Counter |
| Table words | w-table | Table |
| Bathroom words | w-bathroom | **Table?** Not named for a place. It is the restaurant's loo (¿Dónde está el baño?). Code's draft: Table. Chat to rule; the other honest answer is nowhere. |
| Street words | w-street | Street |
| Signs you'll read | w-signs | Street (as chat said) |
| Days you'll read | w-days | **Nowhere?** Timetables and opening days. Code's draft: nowhere (an everywhere session). Chat to rule; Shop is the other candidate (opening days on a shop door). |
| Paying words | w-paying | Paying |
| Help words | w-help | Help |
| Shop | (no chapter-1 session) | Not yet until the Shop sentences |
| First words · 1, First words · 2 | sp0-first-words-1, -2 | nowhere |
| Words you'll hear | w-hear | nowhere |
| Sounds you'll say | w-sounds | nowhere (no words) |
| Numbers · 1, Numbers · 2 | the numbers sessions | nowhere |

**Chapter 2:** the asks (Part 1, Part 2) belong to no place (they are the frames); each place's sentence session belongs to its place; What they say back retires with the places.

**Renderer-to-kind mapping** (§2) follows in the build handoff once the record is written; the four names are Listening, Picking, Building, Typing.

**The mock:** dev/stats-options.html (Desktop copy stats-options.html), six frames: zero, one week, four weeks, the record's first week for an existing learner, the month, the Counter sheet. The PLACES line is amended for the words ("how well that place's words and sentences are holding"); chat to confirm the wording.

**Renderer-to-kind mapping (§2), as built in stats.js (v574), for chat to check:**
- **Listening:** listen_choice, hear_pick, reply_hear, reply_listen, sound_choice, scene_hear, exchange, num_pad, num_run, num_set, key_sound, odd_one, sound_wall, and the ear build (a weld served after its audio).
- **Picking:** mc_es2en, context_choice, ask_which, sign_which, sign_act, variation, grasp, pairs (the boards), days_set, days_order, sign_table, sign_wall, circuit_door, circuit_close, scene_sign, scene_door, scene_close.
- **Building:** weld (from the English), build, machine_drill, stretch.
- **Typing:** type_translation, close, close_swap, listen_type.
- **Not answers, not counted:** present, encore, say_it, sounds_end, the sound cards.
Open for chat: the boards (pairs) as Picking; the number keypads as Listening; the ear build as Listening rather than Building.
