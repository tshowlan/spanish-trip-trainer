# Tripfluent — Trip notes, batch 3: ordering for the table (chat, 2026-11-20)

*Answers tripfluent-chat-handoff-1120-table-ordering.md, six asks. One switch, `trip-table-order`. P2 (11/16) stands and is not re-argued. Sourcing is marked per line: Tom's ear is the last check.*

## 1. THE CARD: a second card, not a new card shape

The Para mí card stays exactly as shipped. **Para compartir gets its own card**, the way Está bien así sits beside ¿Me cobra?. No two-fill card, so no engine work, and a learner who already played the Table meets it as a card gained since.

```js
          { card: true, es: "Para compartir", en: "To share", words: [["Para", "to"], ["compartir", "share"]], contextEs: "Para compartir, pan con tomate.", contextEn: "To share, bread with tomato.", note: "The same Para as Para mí, now for the whole table. It is also a heading on menus: the plates under Para compartir are the ones made for sharing." },
```

**Verified:** Para compartir as a menu heading, from Spanish restaurant menus themselves ("Entrantes para compartir", "Para compartir…").

## 2. THE PARA COMPARTIR SENTENCES: two

```js
          { frame: "para compartir", es: "Para compartir, pan con tomate.", en: "To share, bread with tomato.", hint: [["To share,", "para compartir"], ["bread", "pan"], ["with tomato.", "con tomate"]], near: ["For me, bread with tomato.", "To go, bread with tomato."], replies: [["Muy bien", "Very good"], ["¿Para cuántos?", "For how many?"], ["¿Algo más?", "Anything else?"]] },
          { frame: "para compartir", es: "Para compartir, las croquetas y una ensalada.", en: "To share, the croquettes and a salad.", hint: [["To share,", "para compartir"], ["the croquettes", "las croquetas"], ["and", "y"], ["a salad.", "una ensalada"]], near: ["For me, the croquettes and a salad.", "To share, the croquettes and bread."], replies: [["¿Una ración o dos?", "One portion or two?"], ["Vienen tres. ¿Les pongo cuatro?", "It comes with three. Shall I make it four?"], ["¿Media o entera?", "A half portion or a full one?"]], note: "A ración is one portion for the table, and a media ración is half of one. When it comes in pieces, the waiter may offer one each: Vienen tres. ¿Les pongo cuatro?" },
```

- **The near misses are the frame's other fills** (for me, to go), so the pick tests the one word that changes who the food is for. All are things a diner says.
- croquetas and ensalada are cognates, carried by the hint. Pan con tomate now appears under both Para mí and Para compartir on purpose: same dish, different fill.
- **The two replies worth the batch are Tom's, from the trip:** "one portion or two?" and "it comes with three, do you want four?" **¿Media o entera? (half or full) stays as the third** (Tom, 11/20): the ración is how Spain sells sharing plates, verified from menus and guides, even though Tom did not meet the question on this trip; the three-word form itself is unsourced verbatim. "Croquetas no quedan" gives up its seat, so all three replies are about how much. The Spanish of Tom's two is chat's rendering of what he heard: ración is the menu's word for a sharing portion, and poner is the serving verb the learner already knows from ¿Qué le pongo?. Les is "you" for the whole table.

## 3. QUEREMOS: the two Quiero lines convert

Code's read is right: the Table's two Quiero lines were already orders for the table said as "I." They convert, the word arrives with no growth, and Quiero keeps its single-diner uses at the Counter and in Paying.

```js
          { card: true, es: "Queremos", en: "We want", words: [["Queremos", "we want"]], contextEs: "Queremos agua para la mesa.", contextEn: "We want water for the table.", note: "Quiero is I want. Queremos is we want: the same ask, said for the table." },
          { frame: "queremos", es: "Queremos agua sin gas para la mesa, por favor.", en: "We want still water for the table, please.", hint: [["We want", "queremos"], ["still water", "agua sin gas"], ["for the table,", "para la mesa"], ["please.", "por favor"]], near: ["I want still water, please.", "We want sparkling water for the table, please."], replies: [["Ahora mismo", "Right away"], ["¿Grande o pequeña?", "Large or small?"], ["¿Fría o del tiempo?", "Cold or room temperature?"]] },
          { frame: "queremos", es: "Queremos dos copas de vino.", en: "We want two glasses of wine.", hint: [["We want", "queremos"], ["two glasses", "dos copas"], ["of wine.", "de vino"]], near: ["I want a glass of wine.", "We want two beers."], replies: [["¿Tinto o blanco?", "Red or white?"], ["Muy bien", "Very good"], ["¿De la casa?", "The house wine?"]] },
```

- The first line keeps its sentence and gains the plural; if its shipped reply set differs from the one above, keep the shipped set. "Quiero una tapa para dos." retires for the wine line (a tapa for two is what Para compartir now says).
- Queremos is correct and understood; whether a Spaniard reaches for it over "nos pone" is exactly the kind of thing Tom's ear should check on the play. Unsourced verbatim.

## 4. "CAN I ORDER FROM YOU?": Perdón, ¿puedo pedir?

```js
          { frame: "puedo", es: "Perdón, ¿puedo pedir?", en: "Excuse me, can I order?", hint: [["Excuse me,", "perdón"], ["can I", "puedo"], ["order?", "pedir"]], near: ["Excuse me, can I pay?", "Excuse me, could you bring me the menu?"], replies: [["Sí, dígame", "Yes, go ahead"], ["Ahora viene mi compañero", "My colleague is coming"], ["Un momento", "One moment"]], note: "Pedir is to order, and also to ask for. When a waiter is ready for you, you may hear ¿Les tomo nota?: shall I take your order?" },
```

- It uses the learner's own ask and is said to the person in front of you, which is what "from you" does in English. **Not sourced as a set phrase:** "puedo pedir" is attested for ordering, and ¿Le tomo nota? as the waiter's line; the bare question is built from them. The longer "¿Le puedo pedir a usted?" is more exact and too much mouth for the job.
- pedir rides the hint, no card: one sentence does not earn one. It will earn a card if the next Table batches use it again.
- Both outcomes are in the replies (go ahead; my colleague is coming).

## 5. THE TABLE'S SIZE, AND THE NAME

- **This batch lands at fifteen** (13, plus two Para compartir, plus ¿Puedo pedir?, less the taxi line; the Queremos lines are conversions). **A sentence session may reach sixteen; the seventeenth splits it.** So no split now.
- **"Necesito un taxi, por favor." is cut from the Table (Tom, 11/20).** Under the phone premise a traveler calls a ride from the app; the line returns with the hotel desk in chapter 3. The Table is fifteen.
- **The split comes with batch 4, along the meal:** Part 1 is arriving and ordering (the table, the menu, ¿Puedo pedir?, Para mí, Para compartir, Queremos); Part 2 is the meal and its end (another, the bread, the bathroom, dessert, done, the check). Lines are assigned when batch 4 is written.
- **The dietary row gives up the number now, so it is renamed once:** **"Your table lines"**, after the Table's parts. Numbered parts are everyone's; the named row is the learner's own. Its line and examples stand.

## 6. THE SESSION'S LINE AND EXAMPLES

- Line: **"How to get a table, order for yourself and for the table, and ask for what you need."**
- Examples: **¿Hay? · Para mí · Para compartir · ¿Puedo? · mesa · la carta** (¿Puedo? is now true for everyone).

**After the batch:** ¿Hay? ×2 · ¿Me puede traer? ×3 · Para mí ×2 · Para compartir ×2 · Queremos ×2 · ¿Tiene? ×2 · ¿Puedo? ×1 · ¿Dónde está? ×1 = 15. Three cards: Para mí, Para compartir, Queremos.

**Surfaces touched:** the Table session (two cards, three new sentences, two converted, the line, the examples, the taxi line cut); the dietary row's title. Untouched: Table words, the Counter, every other session.

## → decisions.md

- 2026-11-20 — Table, ordering for the table: Para compartir is a second card beside Para mí (also the menu heading), with two sentences whose near misses are the frame's other fills; the Table's two Quiero lines become Queremos lines with a card; "Perdón, ¿puedo pedir?" sits under ¿Puedo?, pedir riding the hint.
- 2026-11-20 — "Necesito un taxi, por favor." leaves the Table under the phone premise; it returns with chapter 3's hotel desk.
- 2026-11-20 — A sentence session may hold sixteen; the seventeenth splits it. The Table splits with batch 4 along the meal (arriving and ordering; the meal and its end). The dietary row is renamed "Your table lines" and sits after the numbered parts.

## → STATUS.md (prepend)

2026-11-20 — Chat: trip batch 3 ruled and written (docs/rulings-1120-table-ordering.md): the Para compartir card and two sentences, Queremos (card, two converted lines), ¿Puedo pedir?, the size rule (sixteen), the dietary row renamed "Your table lines", new line and examples. The Table's taxi line is cut. Next: Code stages `trip-table-order`; Tom plays; then batch 4 (asking for another) with the Table's split.

## Sources

- Menus using the heading: [Goleta](https://restaurante.covermanager.com/wp-content/uploads/2024/05/Carta-Goleta-Prim-Ver-2024-Landing.pdf) · [El Verdil](https://eurostarshotels.com/CLIENTES/www.eurostarshotels.com/images/_destinos/espana/madrid/eurostars-suite-mirasierra/restaurante/2024_Carta_ELVerdil.pdf)
- [Babbel: reading a Spanish menu (para compartir; tapa, media ración, ración)](https://www.babbel.com/learn-spanish/beginner/spanish-menu?bclid=177) · [Qamarero: tapa and ración](https://qamarero.com/blog/cual-es-la-diferencia-entre-tapa-y-racion/)
- [FluentU: ¿Le tomo nota?](https://www.fluentu.com/blog/english-esp/vocabulario-restaurante-en-ingles/) · [Berlitz: ¿Puedo pedir…?](https://www.berlitz.com/es-us/blog/como-pedir-comida-en-ingles)
