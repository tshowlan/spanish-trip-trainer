# BRIEF FOR CHAT, 2026-10-26: write the Table sentences

Tom and Code (the repo session) have shipped a lot since chat last wrote, on 2026-09-25. This page is the catch-up and the job. Read it first, then the LAST section of the chat ledger (tripfluent-chat-ledger.md, "COUNTER SENTENCES SHIPPED (v524)"). Everything else in the ledger is history.

## 1. Where the app is (v524, live)
- **Chapter 1, fifteen sessions, live:** the words you say, hear, and read, met in context: First words 1 and 2, Sounds you'll say, Words you'll hear, Numbers 1 and 2, Paying, Counter, Table, Street, Bathroom, Signs, Days, Help.
- **Chapter 2 is now: THE ASKS, THEN SENTENCES BY PLACE** (Tom's redraw, 10/24). The asks · Part 1 (Quiero, ¿Me puede traer?, ¿Dónde está?, ¿Cuánto cuesta?) and Part 2 (Necesito, ¿Hay?, ¿Tiene?, ¿Puedo?) are live. The first place session, **Counter sentences, is live**: the asks filled with chapter 1's words at the counter. The places to come, in order: **Table, Paying, Street, Shop, Help**. What they say back retires as a session once the places exist. Prices and the hour wait for Numbermachine.
- **Chapter 2's line on Learn:** "Eight ways to ask. The words you already know go in them."

## 2. Rulings since you last wrote (Tom's, in force)
- The Oxford comma in every rendered line. No em dashes in rendered text, ever.
- A cognate is a met word and needs no chapter 1 card (croissant, chocolate). Use them when they are the real word.
- GOOD TO KNOW is the one dress for an aside: a small label, then one line in the whisper grey. A sentence can carry one (its `note`); it shows once a session, under the built sentence.
- The mouth keeps the polite form (¿Me puede traer?); the ear is told about the short one (¿Me trae?) on the ask's card.
- A reply set has three replies with three different meanings, each a real thing a counter or waiter says, and never the same reply twice in a row in a session. A reply must answer the question (not "Inside, yes" to a question about tapas).
- Sentences are not slim: two or three content words after the ask (¿Hay pan? was too thin; ¿Hay pan para la mesa? is right). Each frame is met through DIFFERENT words, three sentences per frame, so no sentence repeats more than twice in a session.
- Greetings open SOME sentences, by scenario, not all (Hola. Quiero un café con leche. / Buenos días. ¿Me puede traer un zumo?).
- ¿Qué? is not an ask yet: it enters only when its replies are learnable (¿A qué hora? in Numbermachine first).

## 3. The job: Table sentences
Write the session in the Counter's exact shape. Fourteen sentences or so, in the frames that matter at a table (Quiero, ¿Me puede traer?, ¿Hay?, ¿Tiene?, ¿Puedo?, and Necesito if it earns a seat; ¿Dónde está? only for el baño). One sentence is already written and waits here: **¿Hay pan para la mesa?** (Is there bread for the table? · hint: Is there / hay · bread / pan · for the table? / para la mesa · near: Do you have bread for the table? · Is there bread to go? · replies: Sí, hay / Yes, there is · No hay / There isn't · Un momento / One moment).

**Per sentence, Code needs:**
- `frame`: the ask it fills.
- `es` and `en`: the sentence and its English.
- `hint`: the English in pieces with the Spanish under each, in English order (the HINT pill shows this on the build). Three to five pieces.
- `near`: two near-miss English meanings, wrong but close (the learner picks the true meaning among them).
- `replies`: three heard answers, each `[Spanish, English]`, met words or easy cognates, three different meanings.
- `note` (optional): one GOOD TO KNOW line.

**Per session:** `line` (one sentence, the Counter's shape: "How to order, listen, and respond at the counter.") and `examples` (six words drawn from the sentences).

**The Counter, verbatim, as the template:**
```js
{ id: "sent-counter", staged: "sentences-1", sentences: true, noSplit: true, place: "At the counter", topic: "Sentences by place", title: "Counter sentences", line: "How to order, listen, and respond at the counter.", examples: ["Quiero", "¿Tiene?", "¿Puedo?", "café", "agua", "tapas"],
        items: [
          { frame: "quiero", es: "Hola. Quiero un café con leche.", en: "Hello. I want a coffee with milk.", hint: [["Hello.", "hola"], ["I want", "quiero"], ["a coffee", "un café"], ["with milk.", "con leche"]], near: ["Hello. Can you make a coffee with milk?", "Hello. I want a coffee, no milk."], replies: [["Marchando", "Coming right up"], ["¿Algo más?", "Anything else?"], ["Ahora mismo", "Right away"]] },
          { frame: "quiero", es: "Quiero dos cañas.", en: "I want two beers.", hint: [["I want", "quiero"], ["two", "dos"], ["beers.", "cañas"]], near: ["Can I have two beers?", "I want one beer."], replies: [["Marchando", "Coming right up"], ["¿Algo más?", "Anything else?"], ["Aquí tiene", "Here you go"]] },
          { frame: "quiero", es: "Quiero un cortado para llevar.", en: "I want a cortado to go.", hint: [["I want", "quiero"], ["a cortado", "un cortado"], ["to go.", "para llevar"]], near: ["Can you make a cortado?", "I want a cortado to drink here."], replies: [["Ahora mismo", "Right away"], ["Un momento", "One moment"], ["¿Algo más?", "Anything else?"]] },
          { frame: "tiene", es: "¿Tiene algo sin gluten?", en: "Do you have anything gluten-free?", hint: [["Do you have", "tiene"], ["anything", "algo"], ["gluten-free?", "sin gluten"]], near: ["Is there anything gluten-free?", "Do you have anything without milk?"], replies: [["Sí, claro", "Yes, of course"], ["No, lo siento", "No, sorry"], ["Un momento", "One moment"]] },
          { frame: "tiene", es: "¿Tiene té con leche?", en: "Do you have tea with milk?", hint: [["Do you have", "tiene"], ["tea", "té"], ["with milk?", "con leche"]], near: ["Do you have coffee with milk?", "Is there tea with milk?"], replies: [["Sí, claro", "Yes, of course"], ["No, lo siento", "No, sorry"], ["Un momento", "One moment"]] },
          { frame: "tiene", es: "¿Tiene agua sin gas?", en: "Do you have still water?", hint: [["Do you have", "tiene"], ["still water?", "agua sin gas"]], near: ["Is there still water?", "Do you have sparkling water?"], replies: [["Sí, claro", "Yes, of course"], ["No, lo siento", "No, sorry"], ["Aquí tiene", "Here you go"]] },
          { frame: "hay", es: "¿Hay mesa dentro?", en: "Is there a table inside?", hint: [["Is there", "hay"], ["a table", "mesa"], ["inside?", "dentro"]], near: ["Is there a table outside?", "Do you have a table inside?"], replies: [["Sí, hay", "Yes, there is"], ["No hay", "There isn't"], ["Dentro no, fuera sí", "Not inside. Outside, yes"]] },
          { frame: "hay", es: "¿Hay croissants de chocolate?", en: "Are there chocolate croissants?", note: "Also spelled cruasán, and said the French way.", hint: [["Are there", "hay"], ["chocolate", "de chocolate"], ["croissants?", "croissants"]], near: ["Do you have chocolate croissants?", "Are there plain croissants?"], replies: [["Sí, claro", "Yes, of course"], ["No, solo normales", "No, only plain ones"], ["Un momento", "One moment"]] },
          { frame: "hay", es: "¿Hay tapas sin carne?", en: "Are there tapas without meat?", hint: [["Are there", "hay"], ["tapas", "tapas"], ["without meat?", "sin carne"]], near: ["Do you have tapas without meat?", "Are there tapas with meat?"], replies: [["Sí, hay", "Yes, there are"], ["No hay", "There aren't"], ["Solo con carne", "Only with meat"]] },
          { frame: "me puede traer", es: "Buenos días. ¿Me puede traer un zumo?", note: "Shortened on the street to ¿Me trae...? Keep an ear out for it.", en: "Good morning. Could you bring me a juice?", hint: [["Good morning.", "buenos días"], ["Could you", "puede"], ["bring", "traer"], ["me", "me"], ["a juice?", "un zumo"]], near: ["Good morning. Can I have a juice?", "Good morning. Could you bring me water?"], replies: [["Claro", "Of course"], ["Ahora mismo", "Right away"], ["Un momento", "One moment"]] },
          { frame: "me puede traer", es: "¿Me puede traer la cuenta?", note: "Shortened on the street to ¿Me trae...? Keep an ear out for it.", en: "Could you bring me the check?", hint: [["Could you", "puede"], ["bring", "traer"], ["me", "me"], ["the check?", "la cuenta"]], near: ["Could you bring me the menu?", "Can I have the check?"], replies: [["Claro", "Of course"], ["Ahora mismo", "Right away"], ["Un momento", "One moment"]] },
          { frame: "me puede traer", es: "¿Me puede traer agua sin gas?", note: "Shortened on the street to ¿Me trae...? Keep an ear out for it.", en: "Could you bring me still water?", hint: [["Could you", "puede"], ["bring", "traer"], ["me", "me"], ["still water?", "agua sin gas"]], near: ["Could you bring me sparkling water?", "Is there still water?"], replies: [["Claro", "Of course"], ["Ahora mismo", "Right away"], ["Aquí tiene", "Here you go"]] },
          { frame: "puedo", es: "¿Puedo pagar con tarjeta?", en: "Can I pay by card?", hint: [["Can I", "puedo"], ["pay", "pagar"], ["by card?", "con tarjeta"]], near: ["Can I pay in cash?", "Do you take cards?"], replies: [["Sí, claro", "Yes, of course"], ["Solo efectivo", "Cash only"], ["Un momento", "One moment"]] },
          { frame: "puedo", es: "¿Puedo pagar en efectivo?", en: "Can I pay in cash?", hint: [["Can I", "puedo"], ["pay", "pagar"], ["in cash?", "en efectivo"]], near: ["Can I pay by card?", "Do you take cash?"], replies: [["Sí, claro", "Yes, of course"], ["Solo tarjeta", "Card only"], ["Un momento", "One moment"]] } ] }
```

## 4. The words you may use (met before the Table session)
Chapter 1's words, the eight asks, the replies already heard, plus cognates. Nothing else, or the learner meets a stranger in a sentence they are meant to own.
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
- **Replies already heard:** Ahora mismo · Marchando · ¿Con leche? · Claro · Sí, claro · Un momento · Aquí tiene · Dígame · ¿Algo más? · ¿Todo bien? · No hay · Sí, hay · Solo tarjeta · Solo con carne · Dentro no, fuera sí · A la derecha · Todo recto · Al final
- **Numbers met:** uno to diez, veinte, cincuenta, cien. (Son doce is NOT met; prices wait for Numbermachine.)
- **Not met, so not yet:** pero, hoy, otra, más (alone), queso, jamón, tostada, bocadillo, and any price or hour.

## 5. After Table, in order
Paying (prices wait for Numbermachine; the card, the cash, the change, the tip are met), Street, Shop, Help. Same shape each time: the list, the line, the six examples.

## 6. Questions for chat (answer in the same reply)
1. doble and jarra: do they join the pack (caña's note names them)?
2. Croissant's note reads "Also spelled cruasán, and said the French way." Keep the second half?
3. When the places exist, What they say back · Part 1 retires as a session. Confirm.
4. The constitution's chapter 2 wording becomes "the asks, then sentences by place". Confirm, and Code merges it.

## 7. What to send back
The Table block in the template's shape, or a plain list per sentence with the six fields; Code converts either. Then the line and the six words. Tom plays it staged before it ships.

*Files to drag in with this brief: tripfluent-chat-ledger.md (read the last section), and the design context pack if the session touches a surface (design/context-pack: the constitution, styles.css; its pack-state lists do not yet cover chapter 2, this brief does).*
