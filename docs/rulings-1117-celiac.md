# Tripfluent — Trip notes, batch 2: celiac (chat, 2026-11-17)

*Answers tripfluent-chat-handoff-1117-celiac.md, five asks. Safety content: straight talk, no colour. One switch (`trip-celiac`), with `dietary-variants` alongside.*

## THE RULING IN ONE LINE

Celiac and gluten-free are two different truths and get two different lines. The intake says which; the lines sit where the allergen words already sit (chapter 1's Table words) and in Table sentences; the generated last-row session retires for these learners.

## 1. THE LINES

**Verified.** Spain's celiac federation (FACE) advises always telling the waiter you are celiac, asking how the food is prepared, and agreeing which dishes are safe; cross-contamination, not the menu, is the main way celiac travelers get sick eating out. So the line that does the work is the word **celíaco**, and the question that matters after it is about the kitchen. Sources: [Consumer, FACE's advice for eating out](https://www.consumer.es/?p=103910) · [Consumer, interview with FACE's president](https://www.consumer.es/?p=140205) · [Ecoticias, FACE holiday survey](https://www.ecoticias.com/?p=271021).

**Tom's wording, "Tengo alergia al gluten":** understood everywhere and a waiter will act on it. But celiac disease is not an allergy, and celíaco is the word a Spanish kitchen has a routine for. It goes in the card's note as understood, not on the card.

**The intake: one more chip.** Beside **Gluten-free**, add **Celiac**. Celiac gets everything gluten-free gets, plus its own line and the kitchen question. No follow-up screen. (Derive, don't approximate: the app must not put "I'm celiac" in the mouth of someone who is not, or leave it out of the mouth of someone who is.)

**The forms** follow the intake's adjective answer:

| Adjective answer | Said | Heard back |
|---|---|---|
| -o | Soy celíaco. | ¿Es celíaco? |
| -a | Soy celíaca. | ¿Es celíaca? |
| neutral or unset | Tengo celiaquía. (I have celiac disease) | ¿Es alergia? |

Blocks below are written in the -o form; Code swaps by the table. The typed judge accepts celiaco without the accent (both spellings are standard).

### Chapter 1, Table words (profile-keyed, beside the allergen words)

| word | context | English | who |
|---|---|---|---|
| sin gluten | Pan sin gluten, por favor. | Gluten-free bread, please. | gluten-free and celiac |
| Soy celíaco | Soy celíaco. Sin gluten, por favor. | I'm celiac. Gluten-free, please. | celiac |

- Soy celíaco is a phrase item and carries its own glue (soy), like a la derecha. If pan is unmet at that point, the first context is "Sin gluten, por favor."
- The session's line changes to "the words that keep you safe" for these learners, as it does for allergies.
- **Good to know on Soy celíaco** (once): **"This is the word a Spanish kitchen acts on. Tengo alergia al gluten is understood too."**

### Chapter 2, Table sentences (profile-keyed; one card, then the builds)

```js
          // gluten-free and celiac
          { card: true, es: "¿Lleva gluten?", en: "Does it have gluten?", words: [["Lleva", "does it have"], ["gluten", "gluten"]], contextEs: "Perdón, ¿lleva gluten?", contextEn: "Excuse me, does it have gluten?", note: "Llevar is to carry. Para llevar is to carry out, and a dish lleva what is in it." },
          { frame: "lleva", es: "¿Lleva gluten?", en: "Does it have gluten?", hint: [["Does it have", "lleva"], ["gluten?", "gluten"]], near: ["Does it have meat?", "Do you have gluten-free bread?"], replies: [["No, no lleva", "No, it doesn't"], ["Sí, lleva", "Yes, it does"], ["Lo pregunto en cocina", "I'll ask the kitchen"]] },
          { frame: "puedo", es: "No puedo comer gluten.", en: "I can't eat gluten.", hint: [["I can't", "no puedo"], ["eat", "comer"], ["gluten.", "gluten"]], near: ["I can't eat meat.", "I want gluten-free bread."], replies: [["Tenemos carta sin gluten", "We have a gluten-free menu"], ["¿Es celíaco?", "Are you celiac?"], ["Vale, lo digo en cocina", "Okay, I'll tell the kitchen"]] },
          // celiac only
          { frame: "tiene", es: "Soy celíaco. ¿Tiene carta sin gluten?", en: "I'm celiac. Do you have a gluten-free menu?", hint: [["I'm celiac.", "soy celíaco"], ["Do you have", "tiene"], ["a menu", "carta"], ["gluten-free?", "sin gluten"]], near: ["I'm celiac. Do you have gluten-free bread?", "I'm vegetarian. Do you have a menu?"], replies: [["Sí, aquí tiene", "Yes, here you go"], ["No, pero le ayudo", "No, but I'll help you"], ["Lo pregunto en cocina", "I'll ask the kitchen"]] },
          { frame: "hay", es: "¿Hay contaminación cruzada?", en: "Is there cross-contamination?", hint: [["Is there", "hay"], ["cross-contamination?", "contaminación cruzada"]], near: ["Is there a gluten-free menu?", "Is there gluten in the bread?"], replies: [["No, lo hacemos aparte", "No, we make it separately"], ["No lo puedo garantizar", "I can't guarantee it"], ["Lo pregunto en cocina", "I'll ask the kitchen"]], note: "Contaminación cruzada is the kitchen's own term. If you hear No lo puedo garantizar, they cannot promise the dish is safe." },
```

- The frame tag `lleva` is for the composer; it is a fixed question, not a taught frame. New said words: lleva (in this sense), comer, celíaco, contaminación cruzada. Heard only: pregunto, cocina, digo, carta sin gluten as a thing, aparte, garantizar, ayudo.
- Reply sets: three meanings each, all the sentence's own. The ¿Es celíaco? reply follows the forms table.
- Seat: after the Table's own frame and its builds. The base sin gluten lines everyone already has (¿Tiene pan sin gluten?, ¿Hay algo sin gluten en la carta?) stay where they are.

## 2. WHERE IT SITS

Chapter 1's Table words for the word and the line (weeks before the trip, where the allergen words already live), then Table sentences for the questions. Never the last row. One home in chapter 2 (the Table); review by place serves it at the Counter's pace without a second copy.

## 3. THE SHAPE

**The generated "Your Dietary Needs" session retires for gluten-free and celiac learners.** Its three lines are replaced by the items above (¿Tienen algo sin gluten? is already covered by the place sentences; ¿Esto lleva gluten? becomes ¿Lleva gluten?, since esto is not met until the Shop). A learner who already played the generated session keeps the strength on No puedo comer gluten; the other two records retire with the session.

## 4. THE ENGINE RULE

**Gluten never fills the Tengo alergia a ___ slot.** It is not an allergy and the kitchen's word for it is a different word. Celiac and gluten-free keep their own lines. For the dietary variants nothing changes: the base lines are already the gluten lines.

## 5. VEGETARIAN

**Leave it.** No traveler has reported back, the stakes are preference, and `dietary-variants` (shipping with this batch) already puts sin carne in the place sentences. The generated session stays for vegetarian and for allergies until a batch of their own; a learner with gluten-free and vegetarian keeps the session with its vegetarian lines only.

**Surfaces touched:** the intake (one chip); Table words (two profile-keyed items, one note); Table sentences (one card, four profile-keyed sentences); the generated dietary session (gluten lines out); the allergy ask's slot filler (gluten excluded, as now, made a rule). Untouched: the allergy lines, vegetarian, every other session.

## → decisions.md

- 2026-11-17 — Celiac is its own intake answer beside Gluten-free. Celiac learners say Soy celíaco / celíaca (neutral or unset: Tengo celiaquía) and ask ¿Hay contaminación cruzada?; both groups get sin gluten, ¿Lleva gluten?, and No puedo comer gluten. The lines live in chapter 1's Table words and in Table sentences; the generated dietary session retires for these learners. Gluten never fills the Tengo alergia a ___ slot. Vegetarian and the allergies keep the generated session for now.

## → STATUS.md (prepend)

2026-11-17 — Chat: trip notes batch 2 (celiac) ruled and written (docs/rulings-1117-celiac.md): the Celiac chip, the forms by adjective answer, two Table words items, one card and four Table sentences, the generated session retired for gluten learners, the slot rule, vegetarian left. Next: Code stages `trip-celiac`; then the Table ordering handoff.
