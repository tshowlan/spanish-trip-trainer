# Tripfluent — The Progress tab: rulings (chat, 2026-11-01)

*Answers the 11/01 brief, sections 4.1 to 4.7. Code mocks at three states (zero, one week, four weeks); Tom reviews before anything builds. The role as Tom set it is the spine: "What can I do in Spain today, and what is still in my way?"*

## 1. THE SHAPE: one scroll, four blocks, in this order

1. **THE LAST 14 DAYS** (consistency; the promise).
2. **PLACES** (the wins, and the map of what is coming).
3. **IN YOUR WAY** (the gaps, each with a door).
4. **TRIPS** (the trophies).

Wins before gaps: the learner reads what they can do in Spain first, then what to do about the rest. The consistency strip leads because it is the one block that is true from day one. **A block with nothing true to say does not render** (quiet until useful): at zero the page is the strip and the places; IN YOUR WAY appears with the first gap, TRIPS with the first finished trip.

## 2. THE WORDS (the voice law throughout; micro-caps labels, sentence-case lines)

- Section labels: **THE LAST 14 DAYS** · **PLACES** · **IN YOUR WAY** · **TRIPS**.
- A place's state, one word on its row: **Not yet** · **Slipping** (with the count: "3 slipping") · **Handled** · the earned mark **Solid** (a gold check beside Handled, from the 11/01 ruling). Known sessions wear their K on the row's ring, as on Learn.
- A gap is a sentence that names the thing, in Spain's terms, then a door. Never "you haven't" or "don't forget".
- Doors are verbs, the app's existing ones: **Bring them back** (fading words) · **Run it again** (a sentence you keep missing) · **Start it** (an unmet place or line) · **Keep going** (a place that is met, with sessions left).
- The vocabulary is the one the app already speaks: holding, slipping, faded for words; Known and Solid for sessions; Handled for places. No new terms.

## 3. "A PLACE YOU CAN HANDLE" (the spine)

A place has three states, computed from what the engine already knows:
- **Not yet:** its first session is unplayed.
- **Slipping:** played, and one or more of its sentences is under the fade line (the count shows: "2 slipping"). This is the honest middle; most places live here most of the time.
- **Handled:** every session of the place is played, every sentence is holding (above the fade line), and every stock reply the place carries has been heard at least once. Handled is about being able to do the thing today, not about mastery.
- **Solid** (the gold check on a Handled row) when the place's sessions have earned the solid state: every word in the top band and held through the next review. It fades quietly back to Handled; Handled fades back to Slipping. Nothing on this page is permanent except Trips.

Places listed, in the chapter's order, always all of them: Counter · Table · Street · Shop · Help · Paying, with chapter 3's places (the hotel desk, transport) joining as rows marked **Not yet** when their sessions exist. The list is the map of the trip; an unplayed place is a promise, not a failure. Each row opens the place's session (Not yet, Slipping) or its review (Handled, Solid): the row is the door.

## 4. THE FLAGS THAT EARN A DOOR (and the ones that do not)

| Flag | The sentence | The door | Leads to |
|---|---|---|---|
| Words slipping | "7 words are slipping. Four of them are at the Counter." | Bring them back | the review of those words (the existing review, filtered) |
| A sentence missed three times running | "¿Me pone una caña? keeps getting away." | Run it again | that sentence's review rungs (pick, build, exchange) |
| A place not met, next in order | "The Street is next. Directions, and hearing them back." | Start it | its first session |
| A dietary line never met (learners with a selection only) | "Your shellfish line is waiting at the Table." | Start it | the session that carries it |
| A place met with sessions left (chapter 3 later) | "The hotel desk is half met." | Keep going | its next session |

**No flag for days not practiced.** "Nothing in N days" is about the app, not Spain, and it is the consecutive-days push wearing a frown; Home's Recency and the strip already say it without a sentence. **No flag for Momentum, Retention, or Readiness** (Home's numbers, never repeated here). A gap with no door does not render; a gap whose door is the same as another's merges into one line with one door.

Cap: **five flags shown**, most closable first (the words door, then the sentence door, then the place doors). The rest wait their turn.

## 5. THE 14-DAY STRIP

Keep it as the one consistency element, at the top. The day-streak number goes (redundant, and streak-shaped). Under the strip, one line, plain: **"9 of the last 14 days."** Nothing else: no sessions-this-week (Momentum's job), no days-to-trip (Home's). At zero: the fourteen dots empty and the line **"Your first 14 days start today."** At one week: seven dots filled or not, the count. The strip is a picture of showing up; it never scolds, and a missed day is an empty dot, not a broken anything.

## 6. PAST TRIPS

Stay on Progress, at the bottom, as the trophies: the destination, the dates, the readiness at departure, one line each ("Spain · May 2026 · 84% ready"). They are the only permanent thing on the page, which is why they sit last. The group moves to Profile as decided.

## 7. THE ARCS

Under their dials, all three, like readiness (staged). Progress holds no charts: a chart answers "how is the number moving," which is Home's question. The page is places, words, and days.

## THE THREE STATES, for the mocks

- **Zero:** the strip empty with "Your first 14 days start today." · PLACES: six rows, all **Not yet**, the first row carrying the only door on the page, **Start it** (the Counter). Nothing else renders. The page reads as the trip's map and one first step.
- **One week:** the strip with five or six dots · PLACES: Counter **2 slipping**, Table **Handled**, the rest Not yet · IN YOUR WAY: "2 words are slipping at the Counter." Bring them back · "The Street is next. Directions, and hearing them back." Start it.
- **Four weeks:** the strip mostly full · PLACES: Counter **Handled** with the Solid check, Table Handled, Street 3 slipping, Shop Handled, Help Not yet, Paying Handled · IN YOUR WAY: the words door, one sentence door, Help's Start it · TRIPS: absent until the first trip ends.

**Surfaces touched:** screen-progress.js entire (the nine blocks become four); the readiness/momentum/retention sheets gain their arcs (staged); the Learn row is unchanged (the places rows reuse its ring and K). Untouched: Home, the ceremony, the session end.

## → decisions.md
- 2026-11-01 — The Progress tab: four blocks in order (the last 14 days, places, in your way, trips); a place is Not yet / Slipping / Handled, Solid as the earned check; Handled = all sessions played, all sentences holding, stock replies heard; five flags with doors (slipping words, a missed sentence, the next place, a dietary line, a half-met place), never a days-not-practiced flag; the day-streak number retires; the strip keeps one line; trips stay as trophies; all three arcs live under their dials.
