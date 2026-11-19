# Tripfluent — Trip notes, batch 2b: allergies and vegetarian in chapter 2's shape (chat, 2026-11-18)

*Answers tripfluent-chat-handoff-1118-allergies.md, five asks. Rides `trip-celiac`. Safety content: straight talk. Blocks are written for shellfish; Code generates the rest from the slot table.*

## THE RULING IN ONE LINE

The proposal is right: the generated session retires for everyone, and the lines sit in Table sentences, profile-keyed, in the sentence shape. Tom's three calls (no "Tengo una alergia," the learner's own allergen, gluten out of the picker) stand.

## A CORRECTION FIRST: DAIRY (ask 3)

**One word for the allergy: lácteos. lactosa leaves the allergy path.** Chat's 10/28 slot table gave dairy as lactosa, and that was wrong for an allergy. "Sin lactosa" on a Spanish label means the milk sugar is removed; the milk proteins are still there, and Spanish health authorities say plainly those products are not safe for a milk allergy. A dairy-allergic learner taught to ask for sin lactosa would be handed lactose-free milk.

- Dairy (allergy): **lácteos** everywhere. The ask (a los lácteos), the Table word, the dietary variants (sin lácteos), the lines below.
- **Good to know on the dairy learner's ¿Lleva lácteos? card:** **"Sin lactosa on a label means the milk sugar is out. The milk is still in it."**
- **Tom's call: a Lactose-free chip in the intake's needs,** beside Gluten-free, Celiac, and Vegetarian. Same logic as celiac: two truths, two words. It costs little, because the lactosa variants already built (sin lactosa in the place sentences) re-key to it unchanged, and "¿Tiene leche sin lactosa?" is a real café question. If declined, lactosa simply retires. Existing learners with Dairy selected stay Dairy and get lácteos (the safe reading).

Sources: [Comunidad de Madrid, milk allergy vs lactose intolerance](https://www.comunidad.madrid/node/73290) · [Spanish consumer ministry leaflet on lactose intolerance](https://dsca.gob.es/sites/default/files/publicaciones/La-intolerancia-a-la-lactosa-Informacion-alimentaria.pdf).

## 1. THE LINES (allergy learners)

**The slot table** (replaces 10/28's for allergies):

| Intake | Slot word | After alergia | English |
|---|---|---|---|
| shellfish | marisco | al marisco | shellfish |
| nuts | frutos secos | a los frutos secos | nuts |
| dairy | lácteos | a los lácteos | dairy |
| peanuts | cacahuetes | a los cacahuetes | peanuts |
| eggs | huevo | al huevo | egg |
| fish | pescado | al pescado | fish |
| soy | soja | a la soja | soy |

**One card, four sentences, in Table sentences after the Table's own frame:**

```js
          { card: true, es: "¿Lleva marisco?", en: "Does it have shellfish?", words: [["Lleva", "does it have"], ["marisco", "shellfish"]], contextEs: "Perdón, ¿lleva marisco?", contextEn: "Excuse me, does it have shellfish?", note: "Llevar is to carry. Para llevar is to carry out, and a dish lleva what is in it." },
          { frame: "lleva", es: "¿Lleva marisco?", en: "Does it have shellfish?", hint: [["Does it have", "lleva"], ["shellfish?", "marisco"]], near: ["Does it have fish?", "Do you have anything without shellfish?"], replies: [["No, no lleva", "No, it doesn't"], ["Sí, lleva", "Yes, it does"], ["Lo pregunto en cocina", "I'll ask the kitchen"]] },
          { frame: "tengo alergia", es: "Tengo alergia al marisco.", en: "I'm allergic to shellfish.", hint: [["I'm allergic", "tengo alergia"], ["to shellfish.", "al marisco"]], near: ["I'm allergic to fish.", "I want the shellfish."], replies: [["Gracias por avisar", "Thanks for telling me"], ["¿Alguna alergia más?", "Any other allergies?"], ["Le traigo la carta de alérgenos", "I'll bring you the allergen menu"]] },
          { frame: "puedo", es: "No puedo comer marisco.", en: "I can't eat shellfish.", hint: [["I can't", "no puedo"], ["eat", "comer"], ["shellfish.", "marisco"]], near: ["I can't eat fish.", "Can I eat the shellfish?"], replies: [["Vale, sin marisco", "Okay, no shellfish"], ["¿Es alergia?", "Is it an allergy?"], ["Vale, lo digo en cocina", "Okay, I'll tell the kitchen"]] },
          { frame: "puede", es: "¿Puede llevar trazas de marisco?", en: "Can it have traces of shellfish?", hint: [["Can it", "puede"], ["have", "llevar"], ["traces", "trazas"], ["of shellfish?", "de marisco"]], near: ["Does it have shellfish?", "Could you bring me the shellfish?"], replies: [["No, lo hacemos aparte", "No, we make it separately"], ["No lo puedo garantizar", "I can't guarantee it"], ["Lo pregunto en cocina", "I'll ask the kitchen"]], note: "Trazas is the label's word for traces. If you hear No lo puedo garantizar, they cannot promise the dish is safe." },
```

- **What carries over from celiac, word for word:** the ¿Lleva ___? set, and the contamination set (on the trazas line). **What is the allergy's own:** the Tengo alergia set and the No puedo comer set above ("Tenemos carta sin gluten" and "¿Es celíaco?" stay celiac's).
- **Why a traces line:** kitchens in Spain must tell you which of the fourteen listed allergens are ingredients, but not about unintended traces, so the question has to be asked and "No lo puedo garantizar" is a likely, honest answer. Contaminación cruzada stays celiac's term; trazas de ___ is the allergy's, because it names the allergen. Sources: [Comunidad de Madrid, the fourteen allergens](https://www.comunidad.madrid/servicios/salud/alergias-e-intolerancias-alimentarias) · [HOSBEC allergen guide for hospitality](https://seguridadycalidadalimentaria.fundacionusal.es/wp-content/uploads/guias/alergenos/Guia_para_gestion_alergenos_establecimientos_hosteleria_HOSBEC.pdf).
- **Near misses:** the first names another allergen (fish for a shellfish learner, shellfish for everyone else); the second is as written with the slot swapped.
- The frame tags `lleva` and `tengo alergia` are for the composer. New said words: lleva (this sense), comer, trazas. Heard only: avisar, alguna, carta de alérgenos, pregunto, cocina, digo, aparte, garantizar.
- "Sin marisco, por favor." is not a fourth line: the dietary variants already carry the sin lines in three places.

## 2. THE CARD

**No card for Tengo alergia a ___ at the Table.** The asks, Part 2 teaches it with the learner's own allergen, and the Table sentence builds straight from it (if the ask's shipped English differs from "I'm allergic to," keep the ask's). **The card at the Table is ¿Lleva ___?**, one per learner, the slot filled by their first dietary answer in the intake's order. A celiac learner with a shellfish allergy gets one ¿Lleva? card, not two.

## 3. SEVERAL ALLERGIES

**All of them, said. Never heard-only: an allergy you cannot say is the gap.**
- **The declaring line names every one:** "Tengo alergia al marisco y a los frutos secos." / "I'm allergic to shellfish and nuts." Three or more: commas, then y ("al marisco, al huevo y a la soja" / "shellfish, egg, and soy"). One item, one record.
- **¿Lleva ___? exists once per allergen** (it is the short one, said while pointing; each is its own item).
- **No puedo comer ___ and the trazas line use the first allergen only.** Review rotates nothing; the declaring line and the ¿Lleva? lines are the coverage.

## 4. VEGETARIAN: the same treatment, now

The generated session retires for vegetarian too, so no learner keeps the old shape. One card, two sentences; the sin carne variants it already has make the rest.

```js
          { card: true, es: "¿Lleva carne?", en: "Does it have meat?", words: [["Lleva", "does it have"], ["carne", "meat"]], contextEs: "Perdón, ¿lleva carne?", contextEn: "Excuse me, does it have meat?", note: "Carne often means red meat here. Ham and tuna turn up in dishes called sin carne, so name them: ¿Lleva jamón?" },
          { frame: "lleva", es: "¿Lleva carne?", en: "Does it have meat?", hint: [["Does it have", "lleva"], ["meat?", "carne"]], near: ["Does it have fish?", "Do you have anything without meat?"], replies: [["No, no lleva", "No, it doesn't"], ["Sí, lleva jamón", "Yes, it has ham"], ["Lo pregunto en cocina", "I'll ask the kitchen"]] },
          { frame: "no como", es: "Soy vegetariano. No como carne ni pescado.", en: "I'm vegetarian. I don't eat meat or fish.", hint: [["I'm vegetarian.", "soy vegetariano"], ["I don't eat", "no como"], ["meat", "carne"], ["or fish.", "ni pescado"]], near: ["I'm vegetarian. I don't eat meat or egg.", "I'm celiac. I can't eat gluten."], replies: [["Tenemos platos vegetarianos", "We have vegetarian dishes"], ["¿Y huevo?", "And egg?"], ["Vale, lo digo en cocina", "Okay, I'll tell the kitchen"]] },
```

- Forms by the adjective answer: -o vegetariano, -a vegetariana; neutral or unset drops the first sentence: "No como carne ni pescado." / "I don't eat meat or fish."
- New said words: como, ni. Heard only: platos, jamón in a reply.
- Tom's thin test: nothing gets thinner. The Table gains a card and two to four keyed sentences per learner; the last row of chapter 2 disappears.

**Surfaces touched:** the generated dietary session (retired for all); Table sentences (the keyed cards and sentences above); the slot table (dairy's word; the "after alergia" column); the ask's and the Table word's dairy form (lácteos); the dietary variants (sin lácteos for Dairy; sin lactosa re-keyed to Lactose-free if Tom takes the chip); the intake (the chip, Tom's call). Untouched: celiac's lines, the place sessions' base sentences.

## → decisions.md

- 2026-11-18 — The generated dietary session retires for every learner. Allergy learners get, in Table sentences: a ¿Lleva ___? card and four keyed sentences (¿Lleva ___?, Tengo alergia a ___ naming every allergy, No puedo comer ___, ¿Puede llevar trazas de ___?); no card for Tengo alergia at the Table (the ask teaches it). Vegetarian gets a ¿Lleva carne? card and two sentences.
- 2026-11-18 — Dairy as an allergy is lácteos everywhere; lactosa leaves the allergy path because sin lactosa products still contain milk protein (corrects chat's 10/28 slot table). A Lactose-free need chip is Tom's call.
- 2026-11-18 — Several allergies: the declaring line names all; ¿Lleva ___? exists per allergen; the other two lines use the first.

## → STATUS.md (prepend)

2026-11-18 — Chat: batch 2b ruled and written (docs/rulings-1118-allergies.md): allergy and vegetarian lines in the sentence shape, slot table with the alergia forms, dairy corrected to lácteos, several-allergies rule, reply sets (what carries over from celiac and what does not). Open for Tom: the Lactose-free chip. Next: Code builds under `trip-celiac`; then the Table ordering handoff.
