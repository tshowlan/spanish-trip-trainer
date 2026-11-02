# Tripfluent, brief for chat: the Progress tab becomes Insights (2026-11-01, evening)

*Tom's reframing after reviewing the mock of chat's 11/01 Progress rulings. This supersedes about half of those rulings; Tom is the decider, and chat is asked to re-rule from here rather than from the morning's brief. Code's data inventory and sizing follow Tom's points.*

## 1. What Tom saw in the mock, in his words (condensed)

- The mock's place rows are the Learn tab's rows with a different label. The rings are the rings Learn already shows. Nothing on the page is new information.
- The last 14 days is not a hero. It is a calendar.
- The tab should not look like Learn so that things can be clicked. Its job is data you cannot gather from Learn, and that is not obvious on first look.
- Places still belong here, presented as strength: icons with a score under each, maybe in squares. Tapping a place shows where its score comes from (which words, which sentences are low).
- In your way is shallow. A door to review three words is not why anyone opens a tab. The strength scores already say where the gap is.
- What brings people back: speed stats (quickest session, quickest exercise), best-session stats, the places' scores, exercise-type stats (listening versus typing versus build the sentence), and totals people could compare like a rating (total exercises, success rate).
- The hero is the exercise success rate. What sits beside it is open.
- The tab may not be called Progress. Progress is already obvious from Home. Insights?

## 2. The shape Tom approved (mocked: dev/insights-options.html, three frames)

1. **Hero:** the success rate over the last 14 days, large, with the all-time rate and the counts under it ("90% all time, 458 exercises in 22 sessions."). Look B adds the best session beside it.
2. **Places:** six icons in the chapter's order with a score each, Not yet when unplayed, plain or in squares (both mocked). The score is the strength of the place's sentences. Tapping opens the place's words and sentences, low first.
3. **By exercise, last 14 days:** one row per exercise type: the rate and the change against your usual ("up 4", "down 3", "steady").
4. **In your way:** only the flag nothing else in the app shows: a sentence missed three times running, with Run it again. The slipping-words door stays Home's.
5. **The strip as one line** at the bottom: the dots and "8 of the last 14 days."
6. **Totals:** "Since July: 48 sessions, 774 exercises, 696 right."
7. Trips stay as trophies when one exists. No charts (chat's ruling 7 stands; arcs live under Home's dials).

Zero state: the hero waits ("Your first session sets this."), six places Not yet, the strip empty with "Your first 14 days start today." Nothing else renders.

## 3. What the engine records today (so chat rules on what is real)

- **Recorded:** days practiced; every finished session with its date, exercise count, and right count (since July); per word: times seen, misses, last seen, last missed, strength; right and wrong per chapter-1 topic.
- **Not recorded:** session duration; which exercise type each answer was; time per answer. There is one rolling mean time per exercise type, all time, unsynced, Test Lab only.

So today, for free: all-time and 14-day success rate, totals, the places' strengths, the strip, perfect sessions. Needs a new record: best session, quickest exercise, exercise-type rates and their change, "versus your usual".

**The record (Code's sizing, about one session):** per day, per exercise type: answers, right, time spent, best time; plus a duration on each session record. Synced per trip (DEST_FIELDS), merged by union on day keys, like the word records. It starts empty the day it ships; the Insights page says so until it has a week ("Recording since Nov 3.").

**Test Lab guard (Tom's worry):** Tom plays with staging on and clicks around to check things, which would pollute his own numbers. Options: (a) the record ignores answers while staging is on (clean, but Tom's own page stays empty since all his play is staged); (b) the record ignores sessions launched from Test Lab buttons and fabricated progress (simMode), keeps staged play, and the lab gets a "Clear my insights record" button for after a checking spree. Code recommends (b). Tom to choose.

## 4. Tom's own numbers, as evidence (last 14 days to 11/1)

- 22 sessions, 458 exercises, 91% right. All time since July: 48 sessions, 774 exercises, 90%. Flat, as expected: the exercises are built to be passed.
- By kind: Help 97%, Street 91%, Counter 88%, Table 85%, review 96%. New sentences are where misses live; review is easy.
- 8 of 14 days played; 8 of 22 sessions perfect; median session 23 exercises.

The flat rate is the design risk: a hero that reads 90% all year stops moving. The change against your usual and the bests move; the places fill. Chat should weigh whether the rate is the hero or the frame.

## 5. Questions for chat

1. **The name.** Insights, or something in the voice. Progress is Home's word now.
2. **The index.** Tom floated an index (120 = 20% better than your usual). Code recommends the plain rate plus the change ("Listening 91%, up 6"). Chat's call on the words.
3. **"Your usual."** All time, or the previous 14 days? Code suggests all time until a learner has 8 weeks, then the previous 8 weeks.
4. **Speed in the voice.** Is "quickest session" a Tripfluent sentence? Speed is a fluency proxy, but the constitution has never praised fast. If it stays, the line for it.
5. **The section labels and the hero caption** ("Right, last 14 days" is Code's draft).
6. **Which of the morning's rulings survive:** the place states (Not yet, Handled, Solid) can live inside a tapped place rather than on the grid; the flags table shrinks to the missed-sentence flag; the strip drops to the bottom. Chat to confirm or push back.
7. **The place icons.** Six Phosphor icons, chat to name them (the mock's are stand-ins).

## → decisions.md (proposed, after chat)
- 2026-11-01 — The Progress tab reframed as Insights (Tom): data you cannot see on Learn or Home. Hero = success rate over 14 days; places as icons with scores; exercise types against your usual; one flag (a missed sentence); the strip as a line; totals; trips as trophies. Needs the answer record. Name and words with chat.

## 6. Round two (Tom's notes after the first mock, same evening; mocked as dev/insights-options.html round two)

- **The hero stays a single big number.** Look B (two numbers up top) is retired.
- **Best sessions as its own section:** a top five, all time. Code's draft rule: every answer right, then the quickest; a session shows its name, date, "23 of 23", and its time. Needs the duration on the session record.
- **Time spent each day:** a block of minutes per day for the last week, with a door to a month view (a calendar of minutes, paged back to the first day). This block takes over the 14-dot strip's job, since it shows the same days with more truth; at zero, the empty strip and its line stay until there is a minute to show. Chat's ruling 7 (no charts on this page) meets its first exception here: bars of minutes are a chart. Tom asked for them; chat to say if the voice allows it or wants the month grid only.
- **Say what the numbers are.** One line under each section head: "How well each place's sentences are holding, out of 100." · "Minutes each day. Tap for the month, back to your first day." · "The share you got right, against your usual." · "All time. Every answer right, then the quickest." Code's drafts; chat writes the real ones. The hero's caption carries its own ("Right, last 14 days").

Added questions for chat: 8. the best-session rule (right first, then quick; or quick alone); 9. whether minutes per day may be bars; 10. the four explaining lines.
