# Tripfluent — Content Spec

Authoring rules for pack content beyond the phrase-level rules in the learning-engine spec §11.
Packs stay pure data; everything here is copy discipline.

## Primers (adopted 2026-07-21, primer wave commit #1)

Three shapes, chosen by lesson type:

- **Machine primers** are one or two short sentences, machine-shaped: name the machine, say what
  it does, make the promise. No cast, no scene; the frame is the star. Derived from/replacing
  `frameGloss` where one exists (the `frameGloss` field remains in packs as dormant data — no
  renderer consumes it).
- **Kit primers** are two sentences with arrival scent. No cast; the cast belongs to the trip's
  story, which begins with the scenario lessons.
- **Scenario primers** are 2–4 sentence scenes: second person, present tense, a named local,
  concrete place, ending either mid-moment (cliffhanger into the lesson) or on the lesson's promise.
  Scenario primers carry `mission` + `guessItem` so the pre-lesson flow (learning spec §4c.4) fires;
  machine/kit primers are scene-only (beat-hint + future-surface data).
- **Cliffhanger-vs-promise rule:** promises close primers that lack a forward hook; primers that end
  mid-moment keep their cliffhanger. A promise appended to a cliffhanger defuses it. The scene decides.
  Reward-line content inverts into promises where used; told-reward surfaces stay retired.
- All primers: no em dashes, no capability claims about the learner's current state (decay test),
  ~180 characters target for machine/kit; scenes may run longer.

## Cast canon (Spain / Mexico)

- **Marina** runs the tasca on the corner (renamed from Montse 2026-07-21; the world stayed, the
  name changed). **Núria** weighs jamón at La Boquería. **Sra. Rosa** is the farmacéutica.
  **Andrés** (taxi driver) debuts in pass-2 transport.
- Mexico: **Doña Lupe**, **Xóchitl** (unaffected by the Spain rename).
- The cast is small and employed: new named locals are a design decision, never a copywriting
  convenience (closed-vocabulary principle applied to people).
- Stale demo copy note: the reply artifact's "Marina · The Harbor Café" label predates the canon
  (Marina runs a tasca, not a harbor café); penciled for relabel at that artifact's next re-issue.

## Single-source content rule (2026-07-21, minted in the Aquí tiene dedup)

A phrase is taught once, in one home; other lessons reference the ear, never re-own the item.
Item identity IS the phrase (id = pack:slug(es)), so a second copy is structurally illegal, not
merely redundant. When two lessons want the same phrase, the original home keeps it (richer
context/notes absorb the newcomer's pedagogy) and the other lesson's scene or exercises point
at it. Cross-lesson echo is a feature; cross-lesson ownership is a collision.

## Landed/in-trip overflow bin (content awaiting the Landed spec)

- Farmacia de guardia: "For minor things, look for the 'farmacia de guardia', the 24-hour pharmacy,
  marked with a flashing green cross." (overflowed from sp-help's retired cultureNote, 2026-07-21 —
  a tip at the destination has ten times the utility.)
