# Tripfluent — Paying, before it ships: four revisions (chat, 2026-11-20)

*Answers tripfluent-chat-handoff-1120-paying.md. Amends batch 1 as written on 11/16; still one switch (`trip-paying`).*

## 1. YOU SAY CAJA; YOU HEAR BARRA

Chat had these the wrong way round on 11/16. Tom's "front" is la caja, the register, and "pagar en caja" is the set phrase in Spain for exactly what happened to him: getting up from the table and paying at the till. Spanish press covers it as a growing practice in bars and restaurants, under that name. La barra is the bar counter, right only where there is one and you pay at it, so it moves to a reply.

**Verified:** the vocabulary (en caja, en barra, en mesa) from Spanish reporting on the practice. **Not verified:** a source quoting a diner asking this exact question. The sentence below is built from the verified words on the card the learner already has.

```js
          { card: true, es: "¿Pago aquí?", en: "Do I pay here?", words: [["Pago", "do I pay"], ["aquí", "here"]], contextEs: "¿Pago aquí o en caja?", contextEn: "Do I pay here or at the register?", note: "Aquí is wherever you are when you ask: from your table, it means the table. The other answer is en caja, at the register." },
          { frame: "pago", es: "¿Pago aquí?", en: "Do I pay here?", hint: [["Do I pay", "pago"], ["here?", "aquí"]], near: ["Do I pay now?", "Do I pay at the register?"], replies: [["Sí, aquí", "Yes, here"], ["No, en caja", "No, at the register"], ["En la barra", "At the bar"]] },
          { frame: "pago", es: "¿Pago aquí o en caja?", en: "Do I pay here or at the register?", hint: [["Do I pay", "pago"], ["here", "aquí"], ["or", "o"], ["at the register?", "en caja"]], near: ["Do I pay here or at the bar?", "Can I pay by card at the register?"], replies: [["En caja, por favor", "At the register, please"], ["Aquí mismo", "Right here"], ["Donde quiera", "Wherever you like"]] },
```

- Said: pago, caja. Heard only: la barra, mismo, donde quiera.
- "En caja" takes no article in the set phrase.

## 2. AQUÍ CARRIES THE TABLE: yes, and the card now says so

Code's reading is right: aquí is wherever the speaker is. The old note ("…the question is in your voice") said nothing useful; the new one is in the block above. **"Over there" is not needed:** naming the place (en caja) does what pointing would. Allí waits for the Street batch.

## 3. THE NEARLY-RIGHT WRONG ANSWER

"Can I pay here?" is replaced by **"Do I pay now?"** (one word off, plausible, clearly different). Both sets of near misses are in the block.

## 4. THE PRICE LINES: both go; the total comes in

Tom's logic is right and it takes the wine line with it: a price printed on the menu is not a question. What a diner does ask at the till is the total, and **¿Cuánto es?** is a standard paying phrase in Spain, listed beside ¿Me cobra? and ¿Qué le debo? in phrase guides and tapas-bar lists.

Out: ¿Cuánto cuesta la tapa? · ¿Cuánto cuesta la copa de vino? In, same seats:

```js
          { frame: "cuanto es", es: "¿Cuánto es?", en: "How much is it?", hint: [["How much", "cuánto"], ["is it?", "es"]], near: ["How much is the coffee?", "Will you charge me?"], replies: [["Son diez", "That's ten"], ["Son veinte", "That's twenty"], ["Un momento, lo miro", "One moment, I'll check"]], note: "Cuesta asks the price of one thing. Es asks for your total." },
          { frame: "cuanto es", es: "¿Cuánto es todo, por favor?", en: "How much is everything, please?", hint: [["How much is", "cuánto es"], ["everything,", "todo"], ["please?", "por favor"]], near: ["How much is the coffee, please?", "Is everything okay?"], replies: [["Son cincuenta", "That's fifty"], ["¿Juntos o separados?", "Together or separate?"], ["Son veinte", "That's twenty"]] },
```

- No card: cuánto is met in the ask, todo in todo recto, and es rides the hint. The frame tag is composer-only.
- The ask ¿Cuánto cuesta ___? keeps its real uses elsewhere: the taxi on the Street, and the Shop, where the price is not in front of you.
- Paying stays at fourteen sentences: ¿Me cobra? ×3 · Quiero ×1 · ¿Puedo? ×2 · ¿Tiene? ×2 · ¿Cuánto es? ×2 · ¿Está? ×2 · ¿Pago? ×2. The receipt-copy reply and the session's line are untouched.

**Surfaces touched:** the Paying session only: the ¿Pago aquí? card's context and note, its two sentences' near misses and replies, the second sentence itself, and two sentences swapped. Untouched: everything else.

## → decisions.md

- 2026-11-20 — Paying: the learner says caja and hears barra (corrects 11/16); ¿Pago aquí o en caja? replaces the barra line; aquí means where you are, said on the card. The two menu-price lines (la tapa, la copa de vino) are cut for ¿Cuánto es? and ¿Cuánto es todo, por favor?. Rule: a price printed in front of the learner is not a question.

## → STATUS.md (prepend)

2026-11-20 — Chat: Paying revised before ship (docs/rulings-1120-paying.md): caja said and barra heard, the card's note and context, new near misses, the two ¿Cuánto cuesta? lines swapped for the total. Next: Code rebuilds under `trip-paying`; Tom plays and ships.

## Sources

- [Xataka: bars asking customers to pay en caja](https://www.xataka.com/magnet/cada-vez-bares-espanoles-se-niegan-a-que-pagues-mesa-su-objetivo-muy-sencillo-mayor-rotacion) · [Directo al Paladar: cobrar en caja](https://www.directoalpaladar.com/consumidores/tactica-cobrar-caja-hostelero-explica-que-algunos-restaurantes-no-te-quieren-cobrar-mesa-1) · [Trendencias: pagar en barra](https://www.trendencias.com/gourmet/jairo-sanchez-dueno-bar-restaurante-muchos-sitios-se-obliga-a-pagar-barra-cliente-se-levante-deje-mesa-libre-se-siente-otro-rapido/amp)
- [SpanishDict: tapas-bar phrase list](https://www.spanishdict.com/lists/4943746/bar-de-tapas-frases) · [Notes in Spanish: paying phrases](https://www.notesinspanish.com/?p=28704)
