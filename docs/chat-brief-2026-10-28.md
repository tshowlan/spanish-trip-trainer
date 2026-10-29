# BRIEF FOR CHAT, 2026-10-28: Street, Shop, Help, Paying, and the dietary variants

Chapter 2 is now four live sessions: The asks · 1 and 2, Counter sentences, Table sentences (shipped 10/28 from your 10/27 handoff, with Code's deviations below). This brief asks for the remaining place sessions in the same shape, plus the dietary variants. Read it first, then the LAST section of the ledger (tripfluent-chat-ledger.md).

## 1. What changed since your 10/27 handoff (Tom's rulings, in force)
- **A place frame opens its session with an intro card** (¿Me pone? at the Counter, Para mí at the Table): the frame, its English, a context line, one GOOD TO KNOW on why it matters there. The frame's sentences carry no note of their own. The tú form (pones) is no longer shown anywhere; the card says only what the frame is for.
- **A GOOD TO KNOW teaches the language or the register, never local colour.** The terrace, side-plate, and English-menu notes were cut. Quiero's por-favor note lives on the Quiero card in The asks (said once where the frame is met).
- **No ¿Puedo pagar…? at the Table**: in Spain the terminal comes to the table. The Table is fourteen sentences in six frames.
- **pescado is profile-keyed** (fish allergy), so "Quiero una tapa de pescado" became "Quiero una tapa para dos" and "Para mí, el pescado" became "Para mí, pan con tomate" (tomate a cognate). Allergen words (marisco, frutos secos, lactosa, cacahuetes, huevo, pescado, soja) and carne/vegetariano only exist for learners who selected them. sin gluten is universal.
- **Twin replies never sit back to back** (Sí, claro / Claro are one reply). Each sentence's three replies: three different meanings, each answering its own question.
- **The place is named on every sentence rung** ("BUILD THE SENTENCE · AT THE TABLE"), in the session and in review.
- Chapter 2 is "The sentences that get things done"; line "The primary ways to ask for what you need, built on the words you learned in chapter 1." Chapter 3 is re-envisioned later, not now.
- What they say back · Part 1 is retired (its replies are all heard in the Counter and Table exchanges, except ¿Con leche?).

## 2. The job, in order
**A. Street sentences.** Where is, is there one near, is it far, I need a taxi; the directions heard back (a la derecha, a la izquierda, todo recto, cerca, lejos). Place frame if the street has one (Code sees none; your call).
**B. Shop sentences.** Do you have, how much (met numbers only: uno-diez, veinte, cincuenta, cien), is it open, which day (Signs and Days from chapter 1: Abierto, Cerrado, the days). Place frame if the shop has one.
**C. Help sentences.** I need help, a doctor, the hospital, the police; No entiendo; ¿Inglés?; where is the pharmacy. Place frame if any.
**D. Paying sentences**, with **¿Me cobra?** as its place frame and card (the pack already has it). The check, the card, the cash, the change, the tip, ¿cuánto?. **Prices in replies wait for Numbermachine**: use only Son cinco / diez / veinte / cincuenta / cien if a price must be heard.
**E. The dietary variants.** For each dietary line (Counter: ¿Tiene algo sin gluten? · ¿Hay tapas sin carne? / Table: ¿Hay algo sin gluten en la carta? · ¿Tiene pan sin gluten?): the base line stays the default for a learner with nothing selected; write the same sentence with each allergen word in the slot (shellfish → marisco, nuts → frutos secos, dairy → lactosa, peanuts → cacahuetes, eggs → huevo, fish → pescado, soy → soja) and sin carne for vegetarian, each variant with its English, hint pieces, two near misses, three replies. Code serves one line per selection, the base line otherwise.

**Per session:** fourteen or so sentences, two to three per frame, met words only (list below) plus cognates; `line` in the Counter's shape; six `examples`; openers by scenario on some, not all; a card for the place frame if there is one.

## 3. The templates, verbatim from the live pack
The Table (with its Para mí card as the first item):
```js
{ id: "sent-table", sentences: true, noSplit: true, place: "At the table", topic: "Sentences by place", title: "Table sentences", line: "How to get a table, order, and ask for what you need at the table.", examples: ["¿Hay?", "¿Me puede traer?", "¿Puedo?", "mesa", "pan", "la carta"],
          items: [
          { frame: "hay", es: "Buenas noches. ¿Hay mesa fuera para cuatro?", en: "Good evening. Is there a table outside for four?", hint: [["Good evening.", "buenas noches"], ["Is there", "hay"], ["a table", "mesa"], ["outside", "fuera"], ["for four?", "para cuatro"]], near: ["Good evening. Is there a table inside for four?", "Good evening. Do you have a table outside for two?"], replies: [["Sí, pase", "Yes, come in"], ["Fuera no, dentro sí", "Not outside. Inside, yes"], ["Veinte minutos", "Twenty minutes"]] },
          { frame: "hay", es: "¿Hay pan para la mesa?", en: "Is there bread for the table?", hint: [["Is there", "hay"], ["bread", "pan"], ["for the table?", "para la mesa"]], near: ["Do you have bread for the table?", "Is there bread to go?"], replies: [["Sí, hay", "Yes, there is"], ["No hay", "There isn't"], ["Un momento", "One moment"]] },
          { frame: "hay", es: "¿Hay algo sin gluten en la carta?", en: "Is there anything gluten-free on the menu?", hint: [["Is there", "hay"], ["anything", "algo"], ["gluten-free", "sin gluten"], ["on the menu?", "en la carta"]], near: ["Do you have anything gluten-free?", "Is there anything without meat on the menu?"], replies: [["Sí, hay", "Yes, there is"], ["No hay", "There isn't"], ["Un momento", "One moment"]] },
          { frame: "me puede traer", es: "¿Me puede traer la carta, por favor?", en: "Could you bring me the menu, please?", hint: [["Could you", "puede"], ["bring", "traer"], ["me", "me"], ["the menu,", "la carta"], ["please?", "por favor"]], near: ["Could you bring me the check, please?", "Can I see the menu, please?"], replies: [["Claro", "Of course"], ["Ahora mismo", "Right away"], ["Aquí tiene", "Here you go"]] },
          { frame: "me puede traer", es: "¿Me puede traer un plato para el pan?", en: "Could you bring me a plate for the bread?", hint: [["Could you", "puede"], ["bring", "traer"], ["me", "me"], ["a plate", "un plato"], ["for the bread?", "para el pan"]], near: ["Could you bring me bread for the table?", "Do you have a plate for the bread?"], replies: [["Claro", "Of course"], ["Ahora mismo", "Right away"], ["Un momento", "One moment"]] },
          { frame: "me puede traer", es: "Perdón. ¿Me puede traer la cuenta?", en: "Excuse me. Could you bring me the check?", hint: [["Excuse me.", "perdón"], ["Could you", "puede"], ["bring", "traer"], ["me", "me"], ["the check?", "la cuenta"]], near: ["Excuse me. Could you bring me the menu?", "Excuse me. Can I pay the check?"], replies: [["Ahora mismo", "Right away"], ["Claro", "Of course"], ["Un momento", "One moment"]] },
          { card: true, es: "Para mí, ___", en: "For me, ___", words: [["Para", "for"], ["mí", "me"]], contextEs: "Para mí, una copa de vino.", contextEn: "For me, a glass of wine.", note: "The Spain way to order in a restaurant. When the waiter comes round, each person says Para mí and then the dish, no verb." },
          { frame: "para mi", es: "Para mí, pan con tomate.", en: "For me, bread with tomato.", hint: [["For me,", "para mí"], ["bread", "pan"], ["with tomato.", "con tomate"]], near: ["For me, bread with cheese.", "I want bread with tomato to go."], replies: [["Muy bien", "Very good"], ["¿Y de beber?", "And to drink?"], ["Marchando", "Coming right up"]] },
          { frame: "para mi", es: "Para mí, una copa de vino.", en: "For me, a glass of wine.", hint: [["For me,", "para mí"], ["a glass", "una copa"], ["of wine.", "de vino"]], near: ["For me, a beer.", "Could you bring me a glass of wine?"], replies: [["Muy bien", "Very good"], ["Ahora mismo", "Right away"], ["¿Algo más?", "Anything else?"]] },
          { frame: "quiero", es: "Quiero agua sin gas para la mesa, por favor.", en: "I want still water for the table, please.", hint: [["I want", "quiero"], ["still water", "agua sin gas"], ["for the table,", "para la mesa"], ["please.", "por favor"]], near: ["I want sparkling water for the table, please.", "Is there still water for the table?"], replies: [["Marchando", "Coming right up"], ["Ahora mismo", "Right away"], ["¿Algo más?", "Anything else?"]] },
          { frame: "quiero", es: "Quiero una tapa para dos.", en: "I want a tapa for two.", hint: [["I want", "quiero"], ["a tapa", "una tapa"], ["for two.", "para dos"]], near: ["I want a tapa to go.", "Do you have a tapa for two?"], replies: [["Marchando", "Coming right up"], ["¿Algo más?", "Anything else?"], ["No hay", "There's none"]] },
          { frame: "tiene", es: "¿Tiene la carta en inglés?", en: "Do you have the menu in English?", hint: [["Do you have", "tiene"], ["the menu", "la carta"], ["in English?", "en inglés"]], near: ["Is there a menu in English?", "Could you bring me the menu?"], replies: [["Sí, un momento", "Yes, one moment"], ["No, lo siento", "No, sorry"], ["Aquí tiene", "Here you go"]] },
          { frame: "tiene", es: "¿Tiene pan sin gluten?", en: "Do you have gluten-free bread?", hint: [["Do you have", "tiene"], ["bread", "pan"], ["gluten-free?", "sin gluten"]], near: ["Is there gluten-free bread?", "Do you have bread for the table?"], replies: [["Sí, claro", "Yes, of course"], ["No, lo siento", "No, sorry"], ["Un momento", "One moment"]] },
          { frame: "tiene", es: "¿Tiene agua con gas?", en: "Do you have sparkling water?", hint: [["Do you have", "tiene"], ["sparkling water?", "agua con gas"]], near: ["Do you have still water?", "Is there sparkling water?"], replies: [["Sí, claro", "Yes, of course"], ["Solo sin gas", "Only still"], ["Aquí tiene", "Here you go"]] },
          { frame: "donde esta", es: "Perdón. ¿Dónde está el baño?", en: "Excuse me. Where is the bathroom?", hint: [["Excuse me.", "perdón"], ["Where is", "dónde está"], ["the bathroom?", "el baño"]], near: ["Excuse me. Is there a bathroom?", "Excuse me. Where is the exit?"], replies: [["Al final, a la derecha", "At the end, on the right"], ["Todo recto", "Straight ahead"], ["Ocupado", "Occupied"]] } ] }
```
The Counter's ¿Me pone? card and its two lines:
```js
{ card: true, es: "¿Me pone ___?", en: "Could you get me ___?", words: [["Me", "me"], ["pone", "could you get"]], contextEs: "¿Me pone una caña?", contextEn: "Could you get me a beer?", note: "An ask built for the bar. The barman asks you ¿Qué le pongo?, and ¿Me pone? is your side of the same verb." },
          { frame: "me pone", es: "¿Me pone un cortado para llevar?", en: "Could you get me a cortado to go?", hint: [["Could you", "pone"], ["get me", "me"], ["a cortado", "un cortado"], ["to go?", "para llevar"]], near: ["Could you get me a cortado to drink here?", "Is there a cortado to go?"], replies: [["Marchando", "Coming right up"], ["Ahora mismo", "Right away"], ["¿Algo más?", "Anything else?"]] },
          { frame: "me pone", es: "¿Me pone una caña, por favor?", en: "Could you get me a beer, please?", hint: [["Could you", "pone"], ["get me", "me"], ["a beer,", "una caña"], ["please?", "por favor"]], near: ["Could you get me a glass of wine, please?", "I want a beer, please."], replies: [["Marchando", "Coming right up"], ["Aquí tiene", "Here you go"], ["¿Algo más?", "Anything else?"]] },
```

## 4. The words you may use
- **First words · 1:** Hola · Buenos días · Buenas tardes · Buenas noches · Por favor · Gracias · De nada
- **First words · 2:** Perdón · Sí · No · Vale · Adiós · Muy bien · Hasta luego · No entiendo · ¿Inglés?
- **Words you'll hear:** Dígame · Aquí tiene · Un momento · ¿Algo más? · ¿Todo bien? · Ahora mismo · Pase · ¿Qué tal?
- **Numbers · 1:** uno · dos · tres · cuatro · cinco · seis · siete · ocho · nueve · diez · veinte · cincuenta · cien
- **Paying words:** la cuenta · tarjeta · efectivo · el cambio · la propina · ¿cuánto?
- **Counter words:** café · cortado · con leche · zumo · té · caña · copa · vino · agua · tapa · para llevar · ¿qué le pongo? · que aproveche
- **Table words:** mesa · la carta · pan · plato · sin gas · sin gluten · dentro · fuera · marisco · frutos secos · lactosa · cacahuetes · huevo · pescado · soja · carne · vegetariano
- **Street words:** a la derecha · a la izquierda · todo recto · cerca · lejos · la farmacia · la estación · el metro · taxi · el hotel
- **Bathroom words:** El baño · Aseos · Servicios · Caballeros · Señoras
- **Signs you'll read:** Salida · Entrada · Empujar · Tirar · Abierto · Cerrado · Libre · Ocupado
- **Days you'll read:** Lunes · Martes · Miércoles · Jueves · Viernes · Sábado · Domingo
- **Help words:** ayuda · médico · hospital · policía · emergencia · urgente
- **The asks:** Quiero ___ · ¿Me puede traer ___? · ¿Dónde está ___? · ¿Cuánto cuesta ___? · Necesito ___ · ¿Hay ___? · ¿Tiene ___? · ¿Puedo ___?
- **Place frames met:** ¿Me pone ___? (Counter) · Para mí, ___ (Table)
- **Replies already heard in exchanges:** Ahora mismo · Marchando · Claro · Sí, claro · Un momento · Sí, un momento · Aquí tiene · ¿Algo más? · No hay · Sí, hay · Solo tarjeta · Solo efectivo · Solo con carne · Solo sin gas · Dentro no, fuera sí · Fuera no, dentro sí · Sí, pase · Veinte minutos · Muy bien · ¿Y de beber? · No, lo siento · No, solo normales · Ocupado · Todo recto · Al final, a la derecha
- **Numbers met:** uno to diez, veinte, cincuenta, cien.
- **Allergen and need words** exist only for learners who selected them (see §1); use them in variants, not in base lines.
- **Cognates** are met words (croissant, chocolate, tomate, taxi, hotel, hospital, policía, farmacia, metro…).

## 5. What to send back
Each session as a block in the Table's shape, or a plain list per sentence with the six fields; the variants as a list per base line. Tom plays each session staged before it ships.
