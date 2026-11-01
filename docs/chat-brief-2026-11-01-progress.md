# BRIEF FOR CHAT, 2026-11-01: the Progress tab, designed from zero

Tom and Code settled the tab's role today. This brief asks chat to rule the page: its shape, its words, and the definitions the data needs. Nothing is built; Code mocks after the ruling and Tom reviews the mocks before anything ships.

## 1. The role (Tom, 11/1, in force)
- **Progress answers one question neither Home nor Learn answers: "What can I do in Spain today, and what is still in my way?"** Home is today (state and the next action); Learn is the map; Progress is the long view, in trip terms, never in app terms.
- **Two halves: what is built, and what is in the way and closable.** Wins are true and earned things named in Spain's terms (the places you can handle, the sessions that are solid or Known, the replies you can hear, trips completed). Gaps are closable things with a door into what closes them (a slipping word into its review, an unmet place into its session). A gap with no door is a bad feeling, not a gap.
- **Consistency is in the role.** The arc toward the date is both what you built and whether you kept showing up. The 14-day strip is the candidate picture of that promise.
- **The coach that congratulates and pushes forward, data-wise.** The tab holds the flags that let a learner improve and says where. No cheering verbiage yet: numbers and names do the work, the voice law applies to every label.
- **The test every block must pass:** does it tell the learner something about Spain they can act on or be proud of, that Home and Learn do not already say?
- **Already decided:** the trip group moves to Profile (a later design); the readiness arc moves under the Trip Readiness dial's own sheet (staged `readiness-arc`), so Progress never repeats Home's number.

## 2. What the tab holds today (every block predates the places), with Code's verdict against the test
| Block | What it is | Verdict |
|---|---|---|
| Day streak | A number with a flame | Redundant with the strip below it |
| Readiness % | Home's number again | Fails; the arc moves under the dial |
| Lessons done / total | An app count | Fails; "Counter, Table: handled" is the Spain version |
| Last 2 weeks | 14 dots, one filled per practice day | The consistency picture; passes if the role keeps it (Tom: yes, if it proves itself) |
| Status | The tier and what earns the next | Fails today; nobody sees it but you and it measures nothing about Spain |
| Trends | Three 30-day charts, hidden until history exists | Readiness moves under its dial; Momentum and Retention are Home's levers, their arcs can live under their dials too |
| Your strengths | Accuracy by old topic category | Fails; accuracy is not capability and the categories predate the places |
| Trips | Past trips with readiness at departure | Passes: earned, permanent, proud |
| Trip group | Join or view the group | Moves to Profile |

## 3. What the engine can already say (data in hand, no build needed)
- **Per session:** played or not, stars, Known (declared), strength (the ring: the average of its words), the Learn tab's "next" pointer.
- **Per word and sentence:** strength and its band (top at 80), due date, lapses, "fading" (seen at least once and under the notify line), last correct, the place it belongs to (sentences), the replies heard through it (new 11/1).
- **Per place:** which of its sessions are played, the strength of its sentences, which asks and frames it has met.
- **Consistency:** practice days (history), the session log with times, daily snapshots of the three scores, the trip date and the days left.
- **The learner:** intake needs (dietary variants in play), the destination, past trips.

**Sized, not built (chat's 11/1 rulings):** replies as counted things (a record and strength per reply, "replies you can hear") and SOLID (every word in the top band and held through the next review). Both want a home on this page; the page can be designed with them as named slots that read correctly while empty.

## 4. What chat rules
1. **The shape of the page.** Wins first or gaps first? One scroll or sections? Where the consistency picture sits. The zero state matters most: a new learner's page must read as a promise, not an empty room (Tom: design from zero).
2. **The words.** What a win is called, what a gap is called, how a door is labelled (THE VOICE law: order, plain, no cheering). Whether "solid", "Known", "handled", "slipping" are the vocabulary.
3. **"A place you can handle."** When is the Counter handled: its session played? Its sentences solid? Its replies heard? This definition is the tab's spine and Code cannot invent it.
4. **Which flags earn a door, and where each door leads.** Candidates: words slipping (a review of those words), a sentence you keep missing (its review), a place not met (its session), a dietary line never met (its session), nothing practiced in N days (today's session). Each flag needs its sentence and its door.
5. **The 14-day strip.** Keep as the one consistency element? The day-streak number beside it is redundant; does anything replace it (a count of sessions this week, the days left to the trip)?
6. **Past trips.** Stay as trophies on this page, or move with the group to Profile.
7. **Momentum and Retention arcs.** Under their dials like readiness, or gone.

## 5. Constraints
- The constitution's laws apply (THE VOICE, no em dashes, Oxford comma, no emoji, the dress of GOOD TO KNOW and the whisper). Home stays state plus action; Progress never repeats a Home number.
- Every data-gated block needs a zero state that still reads. Tom will review the mocks at zero, at one week, and at four weeks of play.
- A web PWA, vanilla, one screen file (screen-progress.js); the engine already computes everything in section 3.

## 6. Process
Chat rules sections 4.1 to 4.7 → Code mocks the page in two or three looks (the real stylesheet, three data states) → Tom reviews → Code builds, staged, one surface per ship → Tom plays → ship.
