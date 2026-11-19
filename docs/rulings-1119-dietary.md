# Tripfluent — The dietary lines, answer by answer (chat, 2026-11-19)

*Answers the 11/19 brief (seven rulings) and asks 1 to 7 of the 11/18 follow-ups. Supersedes the carrier rules of 10/28 and the trazas line and "No puedo comer" for allergies from 11/18. Rides `trip-celiac`. Safety content: straight talk; every factual note below is sourced or it is not on a card. Chat did not receive tripfluent-dietary-lines-review.md; this is ruled from the brief and the ledger.*

## THE APPROACH: four moves, and one rule for the sweep

Tom's diagnosis is right: every answer was riding sentences written for gluten. The fix is not a tier per allergy. It is one rule that derives who gets a sweeping line, and four moves everyone with a medical answer makes.

**The four moves:** say it (the declaring line) · ask about this dish (¿Lleva ___?) · ask for the document (the allergen menu) · ask about the kitchen (cross-contamination, and the fryer where frying is the risk).

**The rule for the sweep:** *a "sin ___" line exists only where Spain itself labels food that way.* Sin gluten, sin lactosa, and vegetariano are printed on menus and shelves. "Sin marisco" and "sin cacahuetes" are printed nowhere, which is why "tapas without peanuts" was never a question. So there are two groups, not three: Code's middle tier (one sweeping line for shellfish, fish, dairy) folds into the allergies, whose sweep is the allergen menu.

## WHO GETS WHAT

| Answer | Declares | Asks the dish | Sweep | Kitchen | Everyday line |
|---|---|---|---|---|---|
| Celiac | Soy celíaco. ¿Tiene carta sin gluten? | ¿Lleva gluten? | the sin gluten carriers | ¿Hay contaminación cruzada? · ¿Tiene freidora aparte? | ¿Tiene cerveza sin gluten? |
| Gluten-free, not celiac | No puedo comer gluten. | ¿Lleva gluten? | the sin gluten carriers | none | ¿Tiene cerveza sin gluten? |
| Lactose intolerant | none | none | the sin lactosa carriers | none | ¿Tiene leche sin lactosa? |
| Vegetarian | Soy vegetariano. No como carne ni pescado. | ¿Lleva carne? | the vegetariano carriers | none | none |
| Each allergy (shellfish, fish, milk, egg, nuts, peanuts, soy) | Tengo alergia a ___ (names every allergy) | ¿Lleva ___? (one per allergy) | **¿Tiene carta de alérgenos?** | ¿Hay contaminación cruzada? · the fryer for fish and shellfish | none |

**Changes from what is built:** "No puedo comer ___" leaves the allergies and celiac (the declaring line does its job; it stays as gluten-free's declaring line). The trazas sentence retires (below). Allergy learners lose every "sin ___" carrier and gain the allergen menu. The fryer line is new.

## THE CARRIERS, PRUNED (brief rulings 1 and 3; follow-ups 6 and 7)

| Session | Carrier | Offered to | Replies (true for every answer it is offered to) |
|---|---|---|---|
| Counter | ¿Tiene algo sin gluten? / sin lactosa / ¿Tiene algo vegetariano? | celiac, gluten-free, lactose, vegetarian | Sí, varias cosas / Yes, several things · Poca cosa / Not much · Le enseño la carta / I'll show you the menu |
| Counter | ¿Hay tapas vegetarianas? | vegetarian | Sí, estas tres / Yes, these three · Solo una / Only one · **No hay** |
| Table | ¿Hay algo sin gluten en la carta? / sin lactosa / ¿Hay algo vegetariano en la carta? | celiac, gluten-free, lactose, vegetarian | Sí, dos platos / Yes, two dishes · Sí, está marcado / Yes, it's marked · **No hay** |
| Table | ¿Tiene pan sin gluten? | celiac, gluten-free only | as shipped (No, solo normal · Sí, ¿uno o dos? · Sí, claro) |
| Shop | ¿Tiene galletas sin gluten? / sin lactosa | celiac, gluten-free, lactose | Sí, al fondo / Yes, at the back · Solo estas / Only these · No nos quedan / We're out |

- **No reply names a dish.** "Sí, la ensalada" is gone everywhere (a Spanish mixed salad usually has tuna).
- **Vegetarian's word is vegetariano** (follow-up 7): the four "sin carne" sentences become the three above; ¿Tiene tapas sin carne? is dropped as a duplicate. **Agreement warning for Code:** algo vegetariano never changes; tapas vegetarianas agrees with tapas. Neither follows the learner's adjective answer, so `agreementForms` must not touch them.
- **Chocolate retires; the Shop's product is galletas** (follow-up 6a), glossed "cookies": a free-from shelf staple in Spain and a real question in both forms. Hint [["Do you have", "tiene"], ["cookies", "galletas"], ["gluten-free?", "sin gluten"]]; near misses "Do you have gluten-free bread?" / "How much are the cookies?".
- **The dessert carrier** (6b) is written with the end-of-the-meal batch, for celiac, gluten-free, and lactose only.

## THE NEW AND CHANGED LINES

```js
          // every allergy learner: the sweep
          { frame: "tiene", es: "¿Tiene carta de alérgenos?", en: "Do you have an allergen menu?", hint: [["Do you have", "tiene"], ["an allergen", "de alérgenos"], ["menu?", "carta"]], near: ["Do you have a gluten-free menu?", "Could you bring me the menu?"], replies: [["Sí, aquí tiene", "Yes, here you go"], ["Está en el código QR", "It's on the QR code"], ["No, pero le digo", "No, but I'll tell you"]], note: "By law a Spanish restaurant has to be able to tell you which listed allergens are in each dish. Some print it, some just tell you." },
          // every allergy learner and celiac: the kitchen (one shared sentence, no slot)
          { frame: "hay", es: "¿Hay contaminación cruzada?", en: "Is there cross-contamination?", hint: [["Is there", "hay"], ["cross-contamination?", "contaminación cruzada"]], near: ["Is there an allergen menu?", "Is there a separate kitchen?"], replies: [["No, lo hacemos aparte", "No, we make it separately"], ["No lo puedo garantizar", "I can't guarantee it"], ["Lo pregunto en cocina", "I'll ask the kitchen"]], note: "Contaminación cruzada is the kitchen's own term for your food touching what you cannot eat. If you hear No lo puedo garantizar, they cannot promise the dish is safe." },
          // celiac, fish, shellfish: the fryer
          { frame: "tiene", es: "¿Tiene freidora aparte?", en: "Do you have a separate fryer?", hint: [["Do you have", "tiene"], ["a separate", "aparte"], ["fryer?", "freidora"]], near: ["Do you have a separate table?", "Is there cross-contamination?"], replies: [["Sí, tenemos dos", "Yes, we have two"], ["No, es la misma", "No, it's the same one"], ["Lo pregunto en cocina", "I'll ask the kitchen"]], note: "Freidora is the fryer and aparte is separate. Food fried in shared oil picks up what was fried before it." },
          // lactose intolerant, Counter
          { frame: "tiene", es: "¿Tiene leche sin lactosa?", en: "Do you have lactose-free milk?", hint: [["Do you have", "tiene"], ["milk", "leche"], ["lactose-free?", "sin lactosa"]], near: ["Do you have coffee with milk?", "Do you have lactose-free bread?"], replies: [["Sí, claro", "Yes, of course"], ["Solo de avena", "Only oat"], ["No, solo normal", "No, only regular"]] },
          // celiac and gluten-free, Counter
          { frame: "tiene", es: "¿Tiene cerveza sin gluten?", en: "Do you have gluten-free beer?", hint: [["Do you have", "tiene"], ["beer", "cerveza"], ["gluten-free?", "sin gluten"]], near: ["Do you have gluten-free bread?", "Could you get me a beer?"], replies: [["Sí, en botella", "Yes, in a bottle"], ["No, solo normal", "No, only regular"], ["Un momento", "One moment"]], note: "Caña is a draft beer. Gluten-free beer comes in a bottle, so here the word is cerveza." },
```

- **The fryer's form** (follow-up 2): it uses the learner's own ask, ¿Tiene ___?, and aparte, which they already hear in "lo hacemos aparte." Spain's celiac associations name the fryer as a piece of kitchen that must be exclusive, or replaced by a pan with clean oil. It goes to the answers whose food is itself commonly deep-fried in a Spanish bar: batter (celiac), fried fish, fried squid and prawns.
- **Why the trazas sentence retires** (brief ruling 5, follow-up 9): chat could verify both words as real, but not that a diner says trazas to a waiter. Trazas is the packaging and technical word; contaminación cruzada is what kitchens and patient groups call it at the table, for allergies as much as for gluten. One shared question, unslotted, said after the declaring line has already named the allergen. Code's cluster instinct survives as the fryer line.
- **Trazas becomes a thing you read, in a later batch** (brief ruling 6): a keyed packaging plate with small words, "PUEDE CONTENER TRAZAS DE ___", with this note: **"The line printed on Spanish food packaging: may contain traces of ___. It is the maker's own warning, not a legal requirement, so a packet without it is not a promise."** Nut learners also need to know that on packaging nuts are *frutos de cáscara*. Not built now.

## THE NOTES (follow-ups 1 and 3; brief ruling 4)

**The ¿Lleva ___? card, every answer** (replaces "a dish lleva what is in it"; the example follows the learner's word): **"Llevar means to carry, as in para llevar. A dish carries its ingredients, so ¿Lleva gluten? asks whether gluten is in it."**

**The Tengo alergia card: confirmed.** Words as built. Note: **"Word for word, I have allergy to ___. Everyone says it the same way, whoever is speaking."**

**Where it hides: yes, as menu words, on the ¿Lleva ___? sentence** (its note, shown once under the first build; the card keeps the llevar note). The test that keeps this inside Tom's 10/27 rule: each note teaches a word the learner will read on a menu, two at most, and only where chat is certain. No note is better than a weak one, so peanuts, soy, and lactose get none.

| Answer | The note |
|---|---|
| Celiac, gluten-free | Rebozado is battered and empanado is breaded. Both mean flour. |
| Vegetarian | Carne often means red meat here. Jamón and atún, ham and tuna, turn up in dishes with no carne, so ask for them by name. |
| Shellfish | In rice dishes the stock, caldo or fumet, is often made with shellfish. |
| Fish | Anchoa is anchovy and atún is tuna. Both turn up in olives and salads. |
| Milk | Sin lactosa on a label means the milk sugar is out. The milk is still in it. |
| Egg | Mayonesa is made with egg, and alioli often is. Ensaladilla is bound with mayonesa. |
| Nuts | Romesco and picada are sauces made with nuts. |

## THE INTAKE (follow-up 4, and the brief's question on the list)

Name the condition, not the product, and make the pairs exclusive (choosing one clears the other):
- **Celiac** · **Gluten-free, not celiac**
- **Milk allergy** · **Lactose intolerant**
- **The allergy list stays at seven.** Marisco already covers crustaceans and molluscs in speech. Sesame was proposed here and withdrawn the same day (Tom's challenge): no traveler asked for it and nothing about it was verified for Spain. It is a one-row add when a learner needs it. Mustard, celery, lupin, and sulphites stay out.

## THE TOPICS ROW (follow-up 5)

**"Your dietary lines"** stands. Sub line: "11 lines · 6 met" / "11 lines · none met yet".

## AFTER READING THE GENERATED LIST (v630), four fixes

Chat has now read tripfluent-dietary-lines-review.md. The rulings above stand; the list shows four things they did not name:

1. **A bug in the -a form:** the vegetarian's reply reads "Tenemos platos vegetarianas." Platos is masculine whoever is listening: **Tenemos platos vegetarianos**, always. The agreement table should touch only words that describe the learner (celíaco, vegetariano after Soy, and the ¿Es celíaco? reply), never a word that describes food.
2. **A learner with a sweep answer and an allergy** (celiac with shellfish in the list) gets the carriers in the allergy's word today. Under this ruling allergies have no carriers, so the carriers follow the sweep answer: that learner asks for sin gluten, and gets the galletas line.
3. **The Tengo alergia card shows one allergy, the first chosen.** With three it reads as a sentence, not a card. The sentence under it still names all of them.
4. **Lactose's English** is "lactose-free" wherever gluten's is "gluten-free" (anything lactose-free, lactose-free cookies), not "without lactose."

Also confirmed from the list: the Table words lines (Sin marisco, por favor. and the rest) stay as they are. "No shellfish, please" about a dish in front of you is a real line; it was only the sweeping questions that were not.

**Surfaces touched:** the carriers' `applies` lists and reply sets (Counter, Table, Shop); Table sentences (the allergen menu, the shared kitchen question, the fryer; "No puedo comer" and trazas out for allergies); the Counter (two everyday lines); the Shop (galletas for chocolate); the vegetarian's four sentences (now three, in vegetariano); the ¿Lleva? and Tengo alergia card notes; one sentence note per answer on the slot table; the intake labels and the two exclusive pairs. Untouched: Table words' keyed items, the declaring lines' reply sets, every non-dietary sentence.

## → decisions.md

- 2026-11-19 — Dietary lines are built from four moves (declare, ask the dish, ask for the document, ask the kitchen). A "sin ___" carrier exists only where Spain labels food that way: celiac, gluten-free, lactose intolerant (sin), vegetarian (vegetariano). Allergies get no carriers; their sweep is ¿Tiene carta de alérgenos?.
- 2026-11-19 — One kitchen question for every allergy and celiac, unslotted: ¿Hay contaminación cruzada?. ¿Tiene freidora aparte? for celiac, fish, and shellfish. The trazas sentence retires (unverified as table speech); trazas returns later as a packaging plate to read. "No puedo comer ___" stays only as gluten-free's declaring line.
- 2026-11-19 — Carrier replies never name a dish. The Shop's dietary product is galletas. Vegetarian's sentences use vegetariano, agreeing with the noun, never the learner.
- 2026-11-19 — Hiding places are taught as menu words in the ¿Lleva ___? sentence's note, two at most, only where certain.
- 2026-11-19 — Intake: Celiac / Gluten-free, not celiac and Milk allergy / Lactose intolerant as exclusive pairs. The allergy list stays at seven.

## → STATUS.md (prepend)

2026-11-19 — Chat: the dietary lines re-ruled answer by answer (docs/rulings-1119-dietary.md): two groups by one rule, the who-gets-what table, pruned carriers with slot-proof replies, five new or changed sentence blocks (allergen menu, shared kitchen question, fryer, lactose-free milk, gluten-free beer), galletas, vegetariano, the card notes, seven menu-word notes, intake labels. Trazas plate and dessert carrier parked for later batches. Next: Code rebuilds under `trip-celiac`; Tom reviews the regenerated list.

## Sources

- [Asociación de Celíacos de Madrid: what to do at the restaurant](https://www.celiacosmadrid.org/documents/353/14-15_SEGURIDAD_DW9j8ER.PDF) · [kitchen requirements, the fryer](https://www.celiacosmadrid.org/documents/647/Requisitos_de_una_cocina.pdf)
- [Celíacs de Catalunya: 20 practical tips](https://www.celiacscatalunya.org/pdfs/20_consejos_practicos.pdf)
- [Madrid tourism guide for visitors with food allergies](https://w3.esmadrid.com/sites/default/files/guia_visita_madrid_con_alergias_alimentarias.pdf)
- [HOSBEC allergen guide for hospitality](https://seguridadycalidadalimentaria.fundacionusal.es/wp-content/uploads/guias/alergenos/Guia_para_gestion_alergenos_establecimientos_hosteleria_HOSBEC.pdf)
- [Comunidad de Madrid: milk allergy vs lactose intolerance](https://www.comunidad.madrid/node/73290)
