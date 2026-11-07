# Tripfluent, brief for chat: Readiness across the learner's journeys (Code, 2026-11-07)

*Tom's question, after the 11/06 repair: is Readiness telling each learner the right number all the way to their trip? Tom flies to Barcelona 2026-11-11. This brief gives chat the mechanics as they stand, three journeys to test them against, the gaps Tom named, and the rulings wanted. Numbers are from the engine (srs.js, scoring.js), checked on Tom's real state in a sandbox.*

## 1. The mechanics as they stand

**Readiness** = 0.4 Coverage + 0.4 Retention + 0.2 Recency (the 7/16 law). Retention is the mean strength of every word drilled, shrunk toward 50 while the count is small. Coverage is the share of the deck held, by category, demand-weighted. Recency fades over a week without a session.

**A word's strength** comes from two things: how many times it has been right in a row (its spacing) and how long since the last right answer. Each right answer multiplies the spacing by about 2.3. Strength is read off the spacing, then fades from the last right answer with a half-life of about 0.7 × the spacing.

| right answers in a row | spacing | strength the day you answer | half-life |
|---|---|---|---|
| 1 | 3 days | 38 | 2 days |
| 2 | 7 | 58 | 5 days |
| 3 | 16 | 76 | 11 days |
| 4 | 37 | 88 | 26 days |
| 5 or more | 85 and up | 94 | two months |

So the app already carries an expected-successes model: three clean answers is a word you can lean on, five is a word you own. Tom's instinct (three is fair, ten is fluent) matches the ladder.

**Two changes made 11/06, both staged:** (a) the trip now caps a word's review date, never its spacing. Before, five days out, a word answered perfectly maxed at 50 and the day before the trip at 17, every word at the same rate, and Readiness sank by design in the last week. (b) The old curriculum (chapters 3 and 4 on Learn, 183 items, nearly unmet) left the deck; Coverage went from 12 to 37 on Tom's data.

**What a miss does today:** any miss resets the spacing to one day. An 85-day word and a word met yesterday become the same thing on one slip.

## 2. Three journeys, on these mechanics

**A. The steady learner.** Plays on pace, reviews arrive on time, each visit doubles the spacing. By the trip the words sit in the 70s and 80s, Coverage climbs with the chapters, Recency stays high. Readiness tracks the truth. No change needed.

**B. Momentum, then a drop-off.** A strong first week leaves words at two or three right answers (spacing 7 to 16). Three silent weeks take them to the 20s; Recency takes the headline down another 20 points. Readiness falls, which is right. What is missing is the nudge: the push engine (§6, pending). The line Tom wants there: the state against the tier and the one action that changes it ("You were on pace for Tripfluent. Two sessions this week puts you back.").

**C. Lagging, then a cram.** In the final week a word can be asked about twice before the trip, so crammed words top out near 58. Readiness lands in the 50s: an honest half there. Before (a), the cram was punished twice; now it is counted once.

**A speedrun** (everything in two days, three weeks out, then nothing) reads like B: the words fade on the schedule two answers earned, and the dial says so.

## 3. The gaps Tom named

**3.1 The expected amount of content depends on how far out the trip is, and nothing says so.** Readiness measures what you hold, not where you stand against a plan. Tom wants the plan said in two places: at intake, when the date is set ("Six weeks out: chapters one and two at three sessions a week."; ten days out, a smaller goal: the words and the asks), and as a goal mark on the Learn tab's chapter list (the line you should be past by today, and the line the trip needs). Home's pace tick already computes a version of this number; it needs a surface and words.

**3.2 A miss on a well-known word should not reset it.** Code's rule, proposed: a miss divides the spacing by about five, two rungs of the ladder (85 to 16, 37 to 7, 16 to 3, 7 or less to 1). A slip on a mature word then reads as "check it again," not "start over." Chat's eye on the principle; Code stages it on Tom's word.

**3.3 The demand weights.** Coverage's category weights were built for the old curriculum: 28% Food & Drink and 16% Transport, categories that are almost entirely old content, while chapters 1 and 2 land in Core and Basics at 12% each. With the old chapters off, the weights should describe what exists: the words and the six places.

**3.4 A question, not a proposal: should Readiness be a projection?** The share of the goal content the learner will still hold on the trip day, computed from today's spacings, rather than today's snapshot. All three journeys read right on it too, and it separates "ready" from "busy." It would amend the 7/16 composite, so it is chat's call whether to open it.

## 4. Rulings wanted

1. The plan, said: the intake line when the date is set, and the goal mark on Learn (shape and words). What counts as the goal for a trip N days out.
2. The lapse rule (3.2): yes to the principle, or a different cost.
3. The demand weights (3.3): the re-map to the words and the six places.
4. Readiness as a projection (3.4): open it, or leave the composite as ruled.
