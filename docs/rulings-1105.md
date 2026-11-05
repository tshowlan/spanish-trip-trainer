# Tripfluent — Rulings, writing, and checks on the 11/05 handoff (chat, 2026-11-05)

*Answers the eighteen items in tripfluent-chat-handoff-1105.md, in its order. Everything named as built stays staged until Tom's word.*

## RULINGS

### 1. Known and the scores: Coverage yes, Retention no, and Known is a flag, not a history

- **Known counts for Coverage** (you can do the thing) **and sits out of Retention** (what the app has measured). Readiness therefore rises with Known through Coverage only. Recency and Momentum untouched, as now.
- **Known writes no history.** Today it pins the words at 100 by fabricating four seens and a streak of three. Replace that with a flag on the session that scoring and review read: Coverage credit 1.0, skipped by Retention, skipped by review. The word's own record stays whatever it was (usually nothing).
- **Remove Known clears the flag and nothing else.** The words are as they were: never seen if never seen, due today if they had a history. That settles Code's aside (no bumped seen count to reset, because none was written).
- The Stats square for an all-Known place shows **Known** (11/2 ruling), and the place's items are not in its score.

### 2. Retention after a session of new words: a word joins Retention at its first review

Code's proposal, confirmed and made precise: **a word enters Retention the first time it is reviewed**, whenever that is, and not before. Until then it counts for Coverage only. Retention measures what you kept; the app cannot know what you kept until it has asked once. Misses stay in: a miss is a measurement.

The Readiness dip after a session of new words goes away with this (Coverage rises, Retention is unmoved), and the dial stops punishing the one act the trip needs most, meeting new words.

### 3. Momentum at 100 most weeks: stands

It is the spec, and it is true: a daily player has done everything Momentum asks. A dial that can be full is a dial that moves when life happens, and sliding down gradually, not resetting, is the one mechanic the project constants say to preserve. **No tighter day target, no sessions term.** A sessions term is "do more" wearing a dial, which is the pressure we are not building. Tom is the daily player; most learners will see the dial move plenty.

### 4. Second chance retired: confirmed everywhere

One answer per beat. A miss is told, the right answer is shown, the beat moves on, and review serves the item a day sooner. This holds in sessions, review, the replay, the scenes, the Sounds check, and the keypad. (A build the learner keeps assembling until it is right is one answer, not a second chance.)

### 5. A chapter session is done only by being played: confirmed

A session is a thing you did, not a set of words you happened to meet elsewhere. The row's check means you played it. Known is the only other way a row settles, and it wears its own mark.

### 6. Listening's purpose: the one hearing. No falling blocks.

**Constitution line (add under the method):** *Listening is for the one hearing. In Spain the line comes once, at speed, and you will not ask for it again. The beat asks what was said. Its rung is the first hearing at natural speed; replays are allowed and cost.*

What that rules:
- **The beats stay identification** (Code's view, confirmed). The thing being trained is knowing what was said, not reacting in time.
- **The lever is hearings and speed, not arcade pressure.** Falling blocks test reaction and reward a guess; they are also not this app's aesthetic. Any clock on listening lives in the speed round, which already exists for that.
- **First-hear counts for more, when Code is ready:** a right answer on the first hearing earns the full stability step; a right answer after a replay earns half. Silent to the learner now; the speaker-tap count Code is recording is exactly the data. No line on the screen says "replays cost"; the ear just grows faster when it does not need them.
- **Natural speed later:** the listening beat's climbed rung plays at the voice's natural rate with the replay still allowed. Not now; after the first-hear weighting has a few weeks of data.

### 7. The still ceremony: one word, "Holding."

Under the facts, only when no dial moved: **Holding.** It is the app's own word (holding, slipping, faded), it is true, and it needs no sentence after it. Nothing else changes in the still case.

### 8. The ceremony's light: no objection

One light for the icon, the splash, and the session's end is the unity the design pack asks for. The candle staying hidden at the ceremony (the light from the top only) is right: the light is the icon's, the icon is not on stage. Log it.

Two looks Tom settled on 11/2 need no word from chat: the Solid mark (B7) and the best line as columns. Home and Stats sharing the photo reads as one family (the two tabs with dials and numbers; Learn and Profile are lists). Fine.

## WRITING

### 9. The grammar note (two GOOD TO KNOW lines, and the re-show)

Shown once, on the first build of each shape. Language only.

- **está + adverb** (first on ¿Está lejos la estación?): **"With está, the far or near comes right after it, and the place goes last: ¿Está lejos la estación?"**
- **hay + adverb** (first on ¿Hay una farmacia cerca?): **"With hay, the thing comes right after it, and the near goes last: ¿Hay una farmacia cerca?"**

The re-show, when a build's or a typed answer's only miss is the adverb's position (both rungs, per Tom's addendum): the same note, with one line above it:
- **"Only the order was off. With está, lejos comes first."**
- **"Only the order was off. With hay, cerca comes last."**
(Code substitutes the sentence's own adverb: lejos or cerca.)

### 10. ¿Me cobra?: the gloss is "Will you charge me?"

The card already says it (es "¿Me cobra?", en "Will you charge me?", gloss on cobra "will you charge"). Wherever the frame is named with "Can I pay?" (the composer's frame label, the Learn examples, the cue), it becomes **Will you charge me?** The card's note carries the meaning ("not the check, just will you charge me"). Nothing else changes.

### 11. The tip line: "El cambio, para la propina." retires. The line is "Está bien así."

**Verification.** "El cambio, para la propina." is not attested; it was my construction and Tom's ear was right. What Spaniards say when they leave the change: **Está bien así** (the everyday line, said while handing over the note) and **Quédese con la vuelta** (keep the change). In Spain the change that comes back is **la vuelta**; **cambio** is change you ask for, to break a note, which is how the session already uses it (¿Tiene cambio de cincuenta?). "Quédese con el cambio" is understood everywhere and is the Latin American form; the pack's later line should become **Quédese con la vuelta** in the Spain pack when that content is rewritten, and keep el cambio in Mexico's.

**The replacement** (Paying, same seat, `frame: "esta"` since está is already a frame in the session; the `para` tag retires):

```js
          { frame: "esta", es: "Está bien así.", en: "That's fine as it is.", hint: [["That's fine", "está bien"], ["as it is.", "así"]], near: ["Is that fine as it is?", "That's all, thanks."], replies: [["Muchas gracias", "Thanks a lot"], ["Muy amable", "Very kind of you"], ["Hasta luego", "See you"]], note: "This is how you leave the change as the tip in Spain: hand over the note, say Está bien así, and the change stays. You can also say Quédese con la vuelta, keep the change. The change that comes back is la vuelta; cambio is what you ask for to break a note." },
```

- New word: **así** (one; the hint carries it). Reply set: three meanings (thanks, kindness, goodbye), none stock; Muy amable is the barman's real answer to a tip.
- Paying's frame count: ¿Me cobra? ×3 · Quiero ×1 · ¿Puedo? ×2 · ¿Tiene? ×2 · ¿Cuánto cuesta? ×2 · ¿Está? ×2 = 12. The session's line and examples unchanged.
- Sources: [SpanishDict, "the change (speaking of money)": in Spain people say la vuelta](https://www.spanishdict.com/answers/264876/the-change-speaking-of-money) · [Radical Storage, Tipping in Spain: rounding up, coins, "quédese con el cambio"](https://radicalstorage.com/travel/tipping-in-spain/).

### 12. The Stats page's lines

| Item | Ruling |
|---|---|
| "average" for "usual" | **Average.** It is a mean, and Tom's reading is the learner's. The number stays "35 s under". |
| PLACES line | **"Your score at each place, out of 100. Tap a place to see what is pulling it down."** |
| BY EXERCISE line | **"What you got right in the last 14 days, and how that sits against your average."** |
| BEST SESSIONS line | **"Every one of these you got all right. The quickest against your average comes first."** |
| A window with no answers, record behind it | Hero: the dash. Small line: **"No sessions in the last 14 days. 90% all time."** (not "Nothing"; sessions is the literal thing missing). |
| The SOLID tag on the place sheet | The tag stays. Under the sheet title, only when solid: **"Solid: every word here reached the top band and was still there at its next review."** |
| "Counting from Nov 3. Give it a week." | Stands. |
| The month line "2 h 12 min in October, since the 24th." | Stands. |
| What you hear rows: Heard / Not yet until the reply record | Stands. |

### 13. Review by place, pause and resume, the exchange heard

| Where | Code's draft | Ruling |
|---|---|---|
| Review sheet row | By place · "Counter, Table, Street, Shop, Help, Paying" | **Stands.** |
| Place sheet rows | "88 out of 100 · 23 to draw from" / "Not yet" / "Marked Known" | **"88 out of 100 · 23 words and sentences"** · **Not yet** · **Known** (the state word; Marked is the verb on the swipe, not the state). |
| Learn's Topics intro | "Your six places. Tap one to review it." | **Stands.** |
| The X's sheet | "Leave the session?" / "Pause it and it waits on Home until the day ends. Quit and it starts fresh next time." / Keep going · Pause, come back later · Quit lesson | Title **stands.** Body: **"Pause it and it waits on Home until the day ends. Quit, and next time it starts over."** Buttons: **Keep going** · **Pause** · **Quit**. (A button is a verb, not a sentence; and the app's word is session, never lesson.) |
| The tile | "Continue: Counter sentences" · kicker "Paused" · "12 of 31 done. Picks up where you left it." | Title and kicker **stand.** Line: **"12 of 31 done. It picks up where you left off."** |
| The toast | "Paused. It waits on Home." | **Stands.** |
| The exchange's hint | "They answer. Tap to hear the exchange again." | **Stands.** |
| By scenario | retire when By place ships? | **Retire.** It is the rooms' last trace (retired 11/3). |

### 14. The keypad's direction: "Tap"

Confirmed. Nothing is spoken; the ear hears and the thumb taps. The cue stays what it was with the verb swapped.

### 15. Bathroom words, bulked up (five items to ten; the session stays)

Chapter-1 shape (word · context · English). Signs are READ items (the sign first, then the context). Caballeros and Señoras stay in Signs you'll read and are not repeated here. Code keeps whichever of the five existing items match and adds the rest; glue words (perdón, a la derecha, vale, no, por favor) are met by this session's place in chapter 1; **hay** is used once (No hay papel.), and if hay is unmet at this point the context becomes "Papel, por favor." / "Paper, please."

| word | context | English | kind |
|---|---|---|---|
| servicios | Perdón, ¿los servicios? | Excuse me, the bathrooms? | say |
| aseos | Aseos, a la derecha. | Bathrooms, to the right. | read |
| baño | ¿El baño? Al fondo. | The bathroom? At the back. | say |
| al fondo | Al fondo, a la derecha. | At the back, to the right. | hear |
| ocupado | ¿Libre? No, ocupado. | Free? No, taken. | read / hear |
| libre | ¿Ocupado? No, libre. | Taken? No, free. | read / hear |
| la llave | La llave, por favor. | The key, please. | say |
| papel | No hay papel. | There's no paper. | say |
| solo clientes | Solo clientes. Vale. | Customers only. Okay. | read |
| fuera de servicio | Fuera de servicio. Vale. | Out of order. Okay. | read |

- **Line:** "What the door says, and the five words you say there."
- **GOOD TO KNOW** (once, on servicios): **"Ask for los servicios or los aseos. Baño is understood, and it says where you are from. In Catalonia the door may say Lavabos."**
- The one line that matters most in a bar is the answer, **Al fondo, a la derecha**, which is why it is a hear item: you will say ¿El baño? and that is what comes back.

## CHECKS

### 16. The chapter-1 session-to-place mapping

**Bathroom words → Table: confirmed** (the bathroom you ask for is the café's or the restaurant's; the Table carries ¿Dónde está el baño?). **Days you'll read → no place: confirmed** (days are everywhere words, like numbers). The rest of Code's mapping stands as drafted in docs/handoff-stats-1102.md.

### 17. The exercise-kind mapping

**The kind is the skill the beat tests, not the control it uses.** That settles all three: the boards are **Picking** (you choose among shown things), the number keypads are **Listening** (the ear decides, the thumb reports), the ear build is **Listening** (same). The typed rung of a weld as **Typing** (v575) is the same principle. A weld is Listening after its audio, Typing when typed, Building otherwise: confirmed.

### 18. The hero's counts: a present is not an exercise

Presents are never tests (10/04 ruling), so a rate that counts them as right is not a success rate, and "exercises" would be the wrong word for the count. Ruling:
- **The hero's rate and its counts come from the stats record (answers only).** For existing learners the hero wears **"Counting from Nov 3. Give it a week."** like the two sections below it, and the number arrives as the window fills. Tom is the only existing learner; a week of a dash is honest.
- **TOTALS** keeps the sessions since July from the session records (true) and takes exercises and right from the stats record, dated: **"48 sessions since July. 120 exercises since Nov 3, 109 right."** When the record's first day is the first session's day (every new learner), one date: **"Since Nov 10: 4 sessions, 61 exercises, 54 right."**
- "Exercises" stays the word, because now it counts exercises.

## NOTES FOR THE RECORD

- The return door (return-door-r3, r5.5) retires with the no-door build; its three headlines go with it. The carrier rule (weakest carrier first) is the right reading of 10/28.
- Chapters 3 and 4 on Learn are still the old pack; chapter 3's re-envisioning is on chat's list and nothing here touches it.

**Surfaces touched:** scoring (Known as a flag; Retention's entry rule), the session composer (one answer per beat, done-by-play), the constitution (the listening line), the ceremony (Holding.), the GOOD TO KNOW notes (está/hay, the tip line, servicios), the Paying session (one sentence replaced), the Stats page lines and its hero and totals sources, the Review sheet and the X's sheet and the tile (words), the keypad cue, Bathroom words (ten items), the pack notes (vuelta vs cambio, Spain vs Mexico). Untouched: Home's dials' shapes, Learn's rows, the exercise renderers.

## → decisions.md

- 2026-11-05 — Known is a flag, not a history: it counts for Coverage, sits out of Retention and review, and Remove Known clears the flag alone.
- 2026-11-05 — A word enters Retention at its first review; until then it counts for Coverage only. Misses stay in.
- 2026-11-05 — Momentum's spec stands; no sessions term, no tighter day target. A full dial is a true dial.
- 2026-11-05 — One answer per beat, everywhere: a miss is told and review serves it a day sooner. A chapter session is done only by being played.
- 2026-11-05 — Listening is for the one hearing: beats stay identification, first-hear earns the full stability step and a replayed right answer half, speed lives in the speed round only. No arcade pressure.
- 2026-11-05 — The still ceremony says "Holding." The ceremony's light is the icon's.
- 2026-11-05 — "El cambio, para la propina." retired (unattested); the tip line is "Está bien así." with Quédese con la vuelta in the note; Spain pack says la vuelta for change returned, Mexico keeps el cambio.
- 2026-11-05 — Stats says "average", not "usual"; the hero and totals count answers from the stats record, never presents; By scenario retires with By place.
- 2026-11-05 — Bathroom words grows to ten items with the five you say (servicios, baño, la llave, papel, and the answer al fondo).

## → STATUS.md (prepend)

2026-11-05 — Chat: eighteen items from the 11/05 handoff ruled and written (docs/rulings-1105.md): Known as a flag out of Retention; Retention entry at first review; Momentum stands; one answer per beat and done-by-play confirmed; listening's purpose (no falling blocks, first-hear weighting later); "Holding."; the está/hay notes; ¿Me cobra? = Will you charge me?; the tip line replaced by Está bien así; Stats lines (average); review-by-place and pause words; Tap; Bathroom words to ten; mappings confirmed; the hero counts answers only. Next for Code: apply, then Tom plays the staged run.
