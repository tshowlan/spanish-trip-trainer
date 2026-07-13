/* =========================================================================
   MEXICO content pack — Mexican Spanish, foodie/independent-traveler persona.
   Organized as a TIERED SPIRAL (spec §1b): three PASSES — Survival, Comfort,
   Fluent — each a wave through the trip at rising difficulty. Core scenarios
   (food, money, directions, dietary, safety) recur across passes. Passes are
   pacing GUIDANCE, never locks (§1.2); the exposure ladder handles difficulty.
   Item identity is the phrase (pack:slug), so items keep SRS history across
   this reshuffle. Every item carries: tier (1 survival|2 comfort|3 fluent),
   tags, contextEs/En for short items, keywords, variants, reply — all optional.
   Run tools/audit-pack.mjs after edits.
   ========================================================================= */

const MEXICO_PACK = {
  key: "mexico",
  dialect: "Mexican Spanish",
  tts: "es-MX",
  stages: [
    /* ============================ PASS 1 · SURVIVAL ============================ */
    {
      id: "mx-p1", pass: 1, title: "Survival", blurb: "The words that keep you alive on day one.",
      lessons: [
        {
          id: "mx-greet", topic: "Greetings & politeness", title: "Hola & gracias",
          reward: "First words down — the taquero already likes you better.",
          primer: { scene: "It's your first morning in Mexico City. You duck into a café, and the woman behind the counter looks up with a warm 'buenos días.'", mission: "Greet her back — and say please and thank you like you mean it.", guessItem: "Gracias" },
          items: [
            { es: "Hola", en: "Hi", tier: 1, tags: ["greetings"], contextEs: "Hola, buenos días", contextEn: "Hi, good morning" },
            { es: "Buenos días", en: "Good morning", tier: 1, tags: ["greetings"], contextEs: "Buenos días, ¿cómo está?", contextEn: "Good morning, how are you?", keywords: ["días"] },
            { es: "Buenas tardes", en: "Good afternoon", tier: 1, tags: ["greetings"], contextEs: "Buenas tardes, señor", contextEn: "Good afternoon, sir", keywords: ["tardes"] },
            { es: "Buenas noches", en: "Good evening / night", tier: 1, tags: ["greetings"], contextEs: "Buenas noches, hasta mañana", contextEn: "Good night, see you tomorrow", keywords: ["noches"] },
            { es: "Por favor", en: "Please", tier: 1, tags: ["politeness"], contextEs: "Un café, por favor", contextEn: "A coffee, please", keywords: ["por favor"] },
            { es: "Gracias", en: "Thank you", tier: 1, tags: ["politeness"], contextEs: "Muchas gracias por todo", contextEn: "Thank you very much for everything", anchor: "Think: 'gratitude.'", variants: ["Muchas gracias"], reply: { es: "De nada", en: "You're welcome" } },
            { es: "De nada", en: "You're welcome", tier: 1, tags: ["politeness"], contextEs: "—Gracias. —De nada.", contextEn: "—Thanks. —You're welcome." },
            { es: "Con permiso", en: "Excuse me (getting past)", tier: 1, tags: ["politeness"], note: "Very Mexican — say it squeezing by or leaving a table.", contextEs: "Con permiso, voy a pasar", contextEn: "Excuse me, I'm coming through", keywords: ["permiso"] },
            { es: "Disculpe", en: "Excuse me (to get attention)", tier: 1, tags: ["politeness"], contextEs: "Disculpe, ¿me ayuda?", contextEn: "Excuse me, can you help me?", keywords: ["disculpe"] }
          ]
        },
        {
          id: "mx-numbers1", topic: "Numbers", title: "Numbers 1–10",
          reward: "You can count to ten — enough to order tacos for the whole table.",
          items: [
            { es: "uno", en: "one", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Uno, por favor", contextEn: "One, please" },
            { es: "dos", en: "two", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Una mesa para dos", contextEn: "A table for two" },
            { es: "tres", en: "three", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Tres tacos, por favor", contextEn: "Three tacos, please" },
            { es: "cuatro", en: "four", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Somos cuatro", contextEn: "There are four of us" },
            { es: "cinco", en: "five", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Cinco pesos", contextEn: "Five pesos" },
            { es: "seis", en: "six", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "A las seis", contextEn: "At six" },
            { es: "siete", en: "seven", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Siete de la tarde", contextEn: "Seven in the evening" },
            { es: "ocho", en: "eight", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "A las ocho", contextEn: "At eight" },
            { es: "nueve", en: "nine", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Abre a las nueve", contextEn: "It opens at nine" },
            { es: "diez", en: "ten", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Diez pesos", contextEn: "Ten pesos" }
          ]
        },
        {
          id: "mx-rescue", topic: "How do you say", title: "I only speak a little",
          reward: "Now you can admit your Spanish is shaky — in Spanish. Locals will slow down for you.",
          primer: { scene: "You've been smiling and nodding, but you didn't catch a word of what the shopkeeper just said. He's waiting for an answer.", mission: "Admit your Spanish is shaky — and ask him to slow down.", guessItem: "¿Habla inglés?" },
          items: [
            { es: "Hablo poquito español", en: "I speak a little Spanish", note: "'Poquito' is friendly and very Mexican.", tier: 2, tags: ["communication"], keywords: ["español"] },
            { es: "Estoy aprendiendo español", en: "I'm learning Spanish", note: "Buys patience instantly.", tier: 2, tags: ["communication"], keywords: ["aprendiendo", "español"] },
            { es: "No entiendo", en: "I don't understand", tier: 1, tags: ["communication"], contextEs: "Perdón, no entiendo bien", contextEn: "Sorry, I don't understand well", keywords: ["entiendo"] },
            { es: "¿Habla inglés?", en: "Do you speak English?", note: "Formal (usted) — polite default with strangers.", tier: 1, tags: ["communication"], contextEs: "Disculpe, ¿habla inglés?", contextEn: "Excuse me, do you speak English?", anchor: "'inglés' = English.", keywords: ["inglés"] },
            { es: "¿Cómo se dice...?", en: "How do you say...?", tier: 2, tags: ["communication"], keywords: ["dice"] },
            { es: "¿Puede repetir, por favor?", en: "Can you repeat that, please?", tier: 2, tags: ["communication"], keywords: ["repetir"], variants: ["¿Me lo repite, por favor?"] },
            { es: "Más despacio, por favor", en: "Slower, please", tier: 2, tags: ["communication"], keywords: ["despacio"] },
            { es: "¿Qué significa?", en: "What does it mean?", tier: 2, tags: ["communication"], contextEs: "¿Qué significa esta palabra?", contextEn: "What does this word mean?", keywords: ["significa"] }
          ]
        },
        {
          id: "mx-table", topic: "Ordering food & drink", title: "First words at the table",
          reward: "You can get a table, read the menu, order, and ask for the check. Night one: handled.",
          primer: { scene: "The taquería is loud and packed. A host grabs two menus and raises an eyebrow at you — '¿Para cuántos?'", mission: "Get a table, see the menu, order a dish, and settle the check.", guessItem: "El menú, por favor" },
          items: [
            { es: "Una mesa para dos, por favor", en: "A table for two, please", tier: 2, tags: ["restaurant", "food"], keywords: ["mesa"], variants: ["Mesa para dos, por favor"] },
            { es: "El menú, por favor", en: "The menu, please", tier: 2, tags: ["restaurant", "food"], anchor: "'menú' = menu.", keywords: ["menú"], variants: ["¿Me trae el menú?", "La carta, por favor"] },
            { es: "Me gustaría los tacos", en: "I'd like the tacos", tier: 2, tags: ["restaurant", "food"], keywords: ["tacos"], variants: ["Quisiera los tacos", "Para mí los tacos"] },
            { es: "Un agua, por favor", en: "A water, please", tier: 1, tags: ["drink", "restaurant"], keywords: ["agua"] },
            { es: "La cuenta, por favor", en: "The check, please", tier: 2, tags: ["restaurant", "money"], keywords: ["cuenta"], variants: ["¿Me trae la cuenta?"] }
          ]
        },
        {
          id: "mx-diet-safe", topic: "Dietary needs & allergies", title: "Allergy essentials",
          reward: "Crucial unlock — you can keep yourself safe at the table. Gluten, begone.",
          primer: { scene: "The waiter is lowering a plate toward your table — and you're pretty sure there's shrimp in it. You have about three seconds.", mission: "Tell them what you can't eat, and that it really matters.", guessItem: "Soy alérgico a..." },
          items: [
            { es: "Soy alérgico a...", en: "I'm allergic to...", note: "Women: 'alérgica'.", tier: 2, tags: ["dietary", "health"], anchor: "'alérgico' = allergic.", keywords: ["alérgico"] },
            { es: "Soy celíaco", en: "I'm celiac", note: "Women: 'celíaca'.", tier: 2, tags: ["dietary", "health"], contextEs: "Soy celíaco, sin gluten por favor", contextEn: "I'm celiac, gluten-free please", keywords: ["celíaco"] },
            { es: "Sin gluten", en: "Gluten-free", tier: 1, tags: ["dietary", "food"], contextEs: "¿Tienen algo sin gluten?", contextEn: "Do you have anything gluten-free?", keywords: ["gluten"] },
            { es: "Sin cacahuate", en: "Without peanut", note: "Mexico: 'cacahuate'. (Spain: 'cacahuete'.)", tier: 2, tags: ["dietary", "food"], contextEs: "Sin cacahuate, soy alérgico", contextEn: "Without peanut, I'm allergic", keywords: ["cacahuate"] },
            { es: "Sin camarón", en: "Without shrimp", note: "Mexico: 'camarón'. (Spain: 'gamba'.)", tier: 2, tags: ["dietary", "food"], contextEs: "Sin camarón, por favor", contextEn: "Without shrimp, please", keywords: ["camarón"] },
            { es: "Es muy importante", en: "It's very important", tier: 2, tags: ["dietary", "health"], contextEs: "Es muy importante, soy alérgico", contextEn: "It's very important, I'm allergic", keywords: ["importante"] }
          ]
        },
        {
          id: "mx-bathroom", topic: "Bathrooms & signs", title: "Where's the bathroom",
          reward: "You can find a bathroom and read the door. Push-vs-pull humiliation: avoided.",
          primer: { scene: "Two unmarked doors at the back of the restaurant, and a server rushing past with a tray. You really need to pick the right one.", mission: "Ask where the bathroom is — and read the door before you push.", guessItem: "Entrada" },
          items: [
            { es: "¿Dónde está el baño?", en: "Where's the bathroom?", note: "Mexico: 'baño'.", tier: 1, tags: ["bathroom", "directions"], keywords: ["dónde", "baño"], reply: { es: "Al fondo a la derecha", en: "At the back on the right" } },
            { es: "¿Tienen baño?", en: "Do you have a bathroom?", tier: 1, tags: ["bathroom"], contextEs: "Disculpe, ¿tienen baño?", contextEn: "Excuse me, do you have a bathroom?", keywords: ["baño"] },
            { es: "Hombres", en: "Men (sign)", tier: 1, tags: ["bathroom", "signs"], contextEs: "El baño de hombres", contextEn: "The men's bathroom", keywords: ["hombres"] },
            { es: "Mujeres", en: "Women (sign)", tier: 1, tags: ["bathroom", "signs"], contextEs: "El baño de mujeres", contextEn: "The women's bathroom", keywords: ["mujeres"] },
            { es: "Salida", en: "Exit (sign)", tier: 1, tags: ["signs"], contextEs: "La salida está por allá", contextEn: "The exit is over there", keywords: ["salida"] },
            { es: "Entrada", en: "Entrance (sign)", tier: 1, tags: ["signs"], contextEs: "La entrada principal", contextEn: "The main entrance", anchor: "'entrada' = entrance (to enter).", keywords: ["entrada"] },
            { es: "Empuje", en: "Push (sign)", tier: 1, tags: ["signs"], contextEs: "La puerta dice 'empuje'", contextEn: "The door says 'push'", keywords: ["empuje"] },
            { es: "Jale", en: "Pull (sign)", note: "Mexico: 'Jale' = pull. (Spain: 'Tirar'.)", tier: 1, tags: ["signs"], contextEs: "La puerta dice 'jale'", contextEn: "The door says 'pull'", keywords: ["jale"] }
          ]
        },
        {
          id: "mx-cash", topic: "Numbers, money & paying", title: "Pesos & paying cash",
          reward: "Pesos, cash, and the total — you can pay without pointing at the register.",
          primer: { scene: "The market vendor rattles off a price and holds out her hand. There's a hand-lettered sign taped to the stall: 'solo efectivo.'", mission: "Handle pesos and pay in cash without fumbling.", guessItem: "cien" },
          items: [
            { es: "veinte", en: "twenty", tier: 1, tags: ["numbers", "money"], contextEs: "Veinte pesos", contextEn: "Twenty pesos" },
            { es: "cincuenta", en: "fifty", tier: 1, tags: ["numbers", "money"], contextEs: "Cincuenta pesos", contextEn: "Fifty pesos" },
            { es: "cien", en: "one hundred", tier: 1, tags: ["numbers", "money"], contextEs: "Cien pesos", contextEn: "One hundred pesos", anchor: "Think: 'century / percent' — 100." },
            { es: "En efectivo", en: "In cash", tier: 1, tags: ["money"], contextEs: "Voy a pagar en efectivo", contextEn: "I'll pay in cash", keywords: ["efectivo"] },
            { es: "¿Cuánto es?", en: "How much is it (total)?", tier: 2, tags: ["money"], keywords: ["cuánto"] }
          ]
        },
        {
          id: "mx-dir", topic: "Directions", title: "Which way?",
          reward: "Left, right, derecho — you won't get lost in the mercado maze.",
          items: [
            { es: "¿Dónde está...?", en: "Where is...?", tier: 1, tags: ["directions"], contextEs: "¿Dónde está el metro?", contextEn: "Where is the metro?", keywords: ["dónde"], reply: { es: "Está a dos cuadras", en: "It's two blocks away" } },
            { es: "¿Cómo llego a...?", en: "How do I get to...?", tier: 2, tags: ["directions"], keywords: ["llego"] },
            { es: "a la derecha", en: "to the right", tier: 1, tags: ["directions"], contextEs: "Dé vuelta a la derecha", contextEn: "Turn right", keywords: ["derecha"] },
            { es: "a la izquierda", en: "to the left", tier: 1, tags: ["directions"], contextEs: "Dé vuelta a la izquierda", contextEn: "Turn left", keywords: ["izquierda"] },
            { es: "derecho", en: "straight ahead", note: "Mexico: 'derecho'. (Spain: 'todo recto'.)", tier: 1, tags: ["directions"], contextEs: "Siga derecho dos cuadras", contextEn: "Go straight two blocks", keywords: ["derecho"] },
            { es: "cerca", en: "near", tier: 1, tags: ["directions"], contextEs: "Está aquí cerca", contextEn: "It's close by", keywords: ["cerca"] },
            { es: "lejos", en: "far", tier: 1, tags: ["directions"], contextEs: "¿Está muy lejos?", contextEn: "Is it very far?", keywords: ["lejos"] },
            { es: "a dos cuadras", en: "two blocks away", note: "Mexico: 'cuadra' = city block.", tier: 2, tags: ["directions"], keywords: ["cuadras"] },
            { es: "la esquina", en: "the corner", tier: 2, tags: ["directions"], contextEs: "En la esquina, a la derecha", contextEn: "At the corner, on the right", keywords: ["esquina"] },
            { es: "¿Está lejos?", en: "Is it far?", tier: 1, tags: ["directions"], keywords: ["lejos"], reply: { es: "No, está aquí cerca", en: "No, it's close by" } }
          ]
        },
        {
          id: "mx-airport", topic: "Airport signs", title: "Reading the airport",
          reward: "Arrivals, departures, your gate — all decoded. You won't miss the flight over a sign.",
          primer: { scene: "You step off the jet bridge into a wall of Spanish signage. Your bag's on a carousel somewhere, and there's a line for customs ahead.", mission: "Read the signs — departures, arrivals, security, customs.", guessItem: "Seguridad" },
          items: [
            { es: "Salidas", en: "Departures", tier: 1, tags: ["airport", "signs"], contextEs: "La sala de salidas", contextEn: "The departures hall", keywords: ["salidas"] },
            { es: "Llegadas", en: "Arrivals", tier: 1, tags: ["airport", "signs"], contextEs: "La zona de llegadas", contextEn: "The arrivals area", keywords: ["llegadas"] },
            { es: "Puerta de embarque", en: "Boarding gate", tier: 2, tags: ["airport", "signs"], keywords: ["puerta", "embarque"] },
            { es: "Documentación", en: "Check-in (bag drop)", note: "Mexico: 'documentación' / 'check-in'.", tier: 1, tags: ["airport", "signs"], contextEs: "El mostrador de documentación", contextEn: "The check-in counter", keywords: ["documentación"] },
            { es: "Reclamo de equipaje", en: "Baggage claim", note: "Mexico: 'reclamo de equipaje'.", tier: 2, tags: ["airport", "signs"], keywords: ["equipaje"] },
            { es: "Seguridad", en: "Security", tier: 1, tags: ["airport", "signs"], contextEs: "El control de seguridad", contextEn: "The security checkpoint", anchor: "'seguridad' = security.", keywords: ["seguridad"] },
            { es: "Aduana", en: "Customs", tier: 1, tags: ["airport", "signs"], contextEs: "Pasar por aduana", contextEn: "To go through customs", keywords: ["aduana"] },
            { es: "el vuelo", en: "the flight", tier: 1, tags: ["airport"], contextEs: "¿A qué hora sale el vuelo?", contextEn: "What time does the flight leave?", keywords: ["vuelo"] },
            { es: "¿Dónde recojo mi equipaje?", en: "Where do I pick up my luggage?", tier: 2, tags: ["airport"], keywords: ["equipaje"] }
          ]
        },
        {
          id: "mx-hear", topic: "Common phrases you'll hear", title: "What locals say to you",
          reward: "You can understand what's said TO you. 'Ahorita' will still confuse you — that's normal.",
          items: [
            { es: "¿Algo más?", en: "Anything else?", tier: 1, tags: ["social", "restaurant"], contextEs: "—¿Algo más? —No, gracias.", contextEn: "—Anything else? —No, thanks.", keywords: ["más"] },
            { es: "Mande", en: "Pardon? / Yes?", note: "Very Mexican polite way to say 'what?' or 'go ahead'.", tier: 1, tags: ["social", "politeness"], contextEs: "—Disculpe. —¿Mande?", contextEn: "—Excuse me. —Yes?", keywords: ["mande"] },
            { es: "Con gusto", en: "My pleasure", note: "Common Mexican reply to 'gracias'.", tier: 1, tags: ["social", "politeness"], contextEs: "—Gracias. —Con gusto.", contextEn: "—Thanks. —My pleasure." },
            { es: "Ahorita", en: "Right now / in a bit", note: "Famously flexible Mexican timing.", tier: 1, tags: ["social", "time"], contextEs: "Ahorita se lo traigo", contextEn: "I'll bring it right away", keywords: ["ahorita"] },
            { es: "¿Es todo?", en: "Is that all?", tier: 1, tags: ["social", "restaurant"], contextEs: "—¿Es todo? —Sí, gracias.", contextEn: "—Is that all? —Yes, thanks.", keywords: ["todo"] },
            { es: "Provecho", en: "Enjoy your meal", note: "Said when passing people who are eating.", tier: 1, tags: ["social", "food"], contextEs: "Buen provecho", contextEn: "Enjoy your meal", keywords: ["provecho"] },
            { es: "Aquí tiene", en: "Here you go", tier: 1, tags: ["social", "restaurant"], contextEs: "Aquí tiene su cambio", contextEn: "Here's your change", keywords: ["tiene"] },
            { es: "Que le vaya bien", en: "Take care / have a good one", tier: 2, tags: ["social", "politeness"], keywords: ["vaya"] }
          ]
        },
        {
          id: "mx-help", topic: "Problems & emergencies", title: "If something's wrong",
          reward: "The safety net is in place. Now go enjoy Oaxaca — you're covered.",
          primer: { scene: "You pat your pocket and your stomach drops — your wallet's gone. A shopkeeper catches your face and asks if you're okay.", mission: "Get help fast — a doctor, the police, or a pharmacy.", guessItem: "Es una emergencia" },
          items: [
            { es: "Ayuda", en: "Help", tier: 1, tags: ["emergency"], contextEs: "¡Ayuda, por favor!", contextEn: "Help, please!", keywords: ["ayuda"] },
            { es: "Necesito un médico", en: "I need a doctor", tier: 1, tags: ["emergency", "health"], keywords: ["médico"], variants: ["Necesito un doctor"] },
            { es: "Llame a la policía", en: "Call the police", note: "Emergency number in Mexico is 911.", tier: 1, tags: ["emergency"], keywords: ["policía"] },
            { es: "Me robaron", en: "I was robbed", tier: 2, tags: ["emergency"], keywords: ["robaron"] },
            { es: "No me siento bien", en: "I don't feel well", tier: 2, tags: ["emergency", "health"], keywords: ["siento"] },
            { es: "¿Habla inglés?", en: "Do you speak English?", tier: 1, tags: ["emergency", "communication"], keywords: ["inglés"] },
            { es: "Perdí mi pasaporte", en: "I lost my passport", tier: 2, tags: ["emergency"], keywords: ["pasaporte"] },
            { es: "¿Dónde está la farmacia?", en: "Where's the pharmacy?", tier: 1, tags: ["emergency", "health", "directions"], keywords: ["dónde", "farmacia"] },
            { es: "Es una emergencia", en: "It's an emergency", tier: 1, tags: ["emergency"], contextEs: "Por favor, es una emergencia", contextEn: "Please, it's an emergency", anchor: "'emergencia' = emergency.", keywords: ["emergencia"] },
            { es: "Me duele aquí", en: "It hurts here", tier: 2, tags: ["emergency", "health"], keywords: ["duele"] }
          ]
        }
      ]
    },

    /* ============================ PASS 2 · COMFORT ============================ */
    {
      id: "mx-p2", pass: 2, title: "Comfort", blurb: "Handle the day — order, pay, get around, check in.",
      lessons: [
        {
          id: "mx-order", topic: "Ordering food & drink", title: "Order like a regular",
          reward: "Recommendations, spice level, a round of beers, splitting the check — you run the table.",
          items: [
            { es: "¿Qué me recomienda?", en: "What do you recommend?", tier: 2, tags: ["restaurant", "food"], keywords: ["recomienda"], reply: { es: "Los tacos al pastor están buenísimos", en: "The al pastor tacos are amazing" } },
            { es: "Un jugo de naranja", en: "An orange juice", note: "Mexico: 'jugo'. (Spain says 'zumo'.)", tier: 2, tags: ["drink"], keywords: ["jugo"] },
            { es: "Una cerveza, por favor", en: "A beer, please", note: "Casually: 'una chela'.", tier: 2, tags: ["drink"], keywords: ["cerveza"], variants: ["Una chela, por favor"] },
            { es: "¿Está muy picante?", en: "Is it very spicy?", note: "Colloquially: '¿pica mucho?'", tier: 2, tags: ["food", "dietary"], keywords: ["picante"], variants: ["¿Pica mucho?"], reply: { es: "Un poquito, pero está rico", en: "A little, but it's tasty" } },
            { es: "Sin chile, por favor", en: "Without chili, please", tier: 2, tags: ["food", "dietary"], keywords: ["chile"] },
            { es: "¿Me separa la cuenta?", en: "Can you split the check?", tier: 2, tags: ["restaurant", "money"], keywords: ["cuenta"], reply: { es: "Claro, ¿cómo la divido?", en: "Sure, how should I split it?" } }
          ]
        },
        {
          id: "mx-coffee", topic: "Coffee shop", title: "Coffee shop",
          reward: "You can order a café de olla and survive a 'cash only' counter. Caffeine: secured.",
          items: [
            { es: "Un café con leche, por favor", en: "A coffee with milk, please", tier: 2, tags: ["coffee", "drink"], keywords: ["café", "leche"] },
            { es: "Un café americano", en: "An americano (black coffee)", note: "The standard black coffee in Mexico.", tier: 2, tags: ["coffee", "drink"], keywords: ["café", "americano"] },
            { es: "Un café de olla", en: "A spiced pot coffee", note: "Traditional Mexican coffee with cinnamon and piloncillo.", tier: 2, tags: ["coffee", "drink"], keywords: ["café"] },
            { es: "Un pan dulce", en: "A sweet pastry", note: "Mexican bakery staple — like a 'concha'.", tier: 2, tags: ["coffee", "food"], keywords: ["pan"] },
            { es: "¿Qué pan tienen?", en: "What pastries do you have?", tier: 2, tags: ["coffee", "food"], keywords: ["pan"] },
            { es: "¿Para aquí o para llevar?", en: "For here or to go?", note: "What the barista asks you.", tier: 2, tags: ["coffee"], keywords: ["llevar"], reply: { es: "Para llevar, por favor", en: "To go, please" } },
            { es: "¿Me da un vaso de agua?", en: "Can I get a glass of water?", tier: 2, tags: ["drink"], keywords: ["agua", "vaso"] },
            { es: "Solo efectivo", en: "Cash only", note: "You might hear this at small spots.", tier: 1, tags: ["money"], contextEs: "Aquí es solo efectivo", contextEn: "Here it's cash only", keywords: ["efectivo"] },
            { es: "¿Cuál es la contraseña del wifi?", en: "What's the wifi password?", tier: 2, tags: ["coffee", "lodging"], keywords: ["contraseña", "wifi"] }
          ]
        },
        {
          id: "mx-diet", topic: "Dietary needs & allergies", title: "Ask about your food",
          reward: "You can quiz a waiter on what's in a dish — and stay safe while you do.",
          items: [
            { es: "¿Esto lleva...?", en: "Does this contain...?", tier: 2, tags: ["dietary", "food"], contextEs: "¿Esto lleva chile?", contextEn: "Does this contain chili?", keywords: ["lleva"] },
            { es: "¿Tiene harina de trigo?", en: "Does it have wheat flour?", tier: 2, tags: ["dietary", "food"], keywords: ["tiene", "harina", "trigo"] },
            { es: "Soy vegetariano", en: "I'm vegetarian", note: "Women: 'vegetariana'.", tier: 2, tags: ["dietary", "food"], contextEs: "Soy vegetariano, ¿qué me recomienda?", contextEn: "I'm vegetarian, what do you recommend?", keywords: ["vegetariano"] },
            { es: "¿Me puede ayudar?", en: "Can you help me?", tier: 2, tags: ["health"], keywords: ["ayudar"] }
          ]
        },
        {
          id: "mx-money", topic: "Numbers, money & paying", title: "Paying & prices",
          reward: "You can ask the price, pay by card, tip right, and find an ATM. Your pesos go further.",
          items: [
            { es: "¿Cuánto cuesta?", en: "How much does it cost?", tier: 2, tags: ["money", "shopping"], keywords: ["cuánto", "cuesta"], variants: ["¿Qué precio tiene?"], reply: { es: "Cuestan cincuenta pesos", en: "They're fifty pesos" } },
            { es: "¿Aceptan tarjeta?", en: "Do you accept card?", tier: 2, tags: ["money"], keywords: ["tarjeta"], variants: ["¿Puedo pagar con tarjeta?"], reply: { es: "Solo efectivo", en: "Cash only" } },
            { es: "Es muy caro", en: "It's too expensive", tier: 2, tags: ["money", "shopping"], keywords: ["caro"], variants: ["Está muy caro"] },
            { es: "¿Hay un cajero cerca?", en: "Is there an ATM nearby?", note: "Mexico: 'cajero' = ATM.", tier: 2, tags: ["money", "directions"], keywords: ["cajero", "cerca"] },
            { es: "¿La propina está incluida?", en: "Is the tip included?", note: "Tip ~10–15% in Mexico.", tier: 2, tags: ["money", "restaurant"], keywords: ["propina"] }
          ]
        },
        {
          id: "mx-time", topic: "Time & numbers", title: "Telling time",
          reward: "You can ask what time it opens AND understand the answer. Punctuality: optional.",
          items: [
            { es: "treinta", en: "thirty", tier: 1, tags: ["numbers", "time"], contextEs: "Treinta minutos", contextEn: "Thirty minutes" },
            { es: "cuarenta", en: "forty", tier: 1, tags: ["numbers"], contextEs: "Cuarenta pesos", contextEn: "Forty pesos" },
            { es: "doscientos", en: "two hundred", tier: 1, tags: ["numbers", "money"], contextEs: "Doscientos pesos", contextEn: "Two hundred pesos" },
            { es: "¿Qué hora es?", en: "What time is it?", tier: 2, tags: ["time"], keywords: ["hora"], reply: { es: "Son las dos", en: "It's two o'clock" } },
            { es: "Son las dos", en: "It's two o'clock", tier: 1, tags: ["time"], contextEs: "Son las dos de la tarde", contextEn: "It's two in the afternoon", keywords: ["dos"] },
            { es: "a las ocho", en: "at eight", tier: 1, tags: ["time"], contextEs: "Nos vemos a las ocho", contextEn: "See you at eight", keywords: ["ocho"] },
            { es: "¿A qué hora abre?", en: "What time does it open?", tier: 2, tags: ["time"], keywords: ["hora", "abre"], reply: { es: "A las nueve de la mañana", en: "At nine in the morning" } },
            { es: "¿A qué hora cierra?", en: "What time does it close?", tier: 2, tags: ["time"], keywords: ["hora", "cierra"] }
          ]
        },
        {
          id: "mx-taxi", topic: "Taxis & rideshare", title: "Taxis & Uber",
          reward: "You can survive a taxi without overpaying. Backseat boss.",
          items: [
            { es: "Lléveme a esta dirección", en: "Take me to this address", tier: 2, tags: ["taxi", "transport"], keywords: ["dirección"], variants: ["¿Me lleva a esta dirección?"] },
            { es: "¿Cuánto al centro?", en: "How much to downtown?", tier: 2, tags: ["taxi", "money"], keywords: ["cuánto", "centro"], reply: { es: "Como cien pesos", en: "About a hundred pesos" } },
            { es: "¿Usa taxímetro?", en: "Do you use the meter?", tier: 2, tags: ["taxi"], keywords: ["taxímetro"] },
            { es: "Pare aquí, por favor", en: "Stop here, please", tier: 2, tags: ["taxi"], keywords: ["pare"], variants: ["Aquí está bien, gracias"] },
            { es: "al aeropuerto", en: "to the airport", tier: 1, tags: ["taxi", "airport"], contextEs: "Al aeropuerto, por favor", contextEn: "To the airport, please", keywords: ["aeropuerto"] },
            { es: "¿Acepta tarjeta?", en: "Do you take card?", tier: 2, tags: ["taxi", "money"], keywords: ["tarjeta"] },
            { es: "el sitio de taxis", en: "the taxi stand", note: "Mexico: 'sitio'. Uber/Didi are common too.", tier: 2, tags: ["taxi"], keywords: ["sitio", "taxis"] },
            { es: "Voy con prisa", en: "I'm in a hurry", tier: 2, tags: ["taxi"], keywords: ["prisa"] },
            { es: "la cajuela", en: "the trunk", note: "Mexico: 'cajuela'. (Spain: 'maletero'.)", tier: 1, tags: ["taxi"], contextEs: "¿Puede abrir la cajuela?", contextEn: "Can you open the trunk?", keywords: ["cajuela"] }
          ]
        },
        {
          id: "mx-metro", requires: { transport: "metro" },
          topic: "Metro", title: "Metro",
          reward: "You can buy a boleto and not ride the wrong line. CDMX underground: conquered.",
          items: [
            { es: "¿Dónde está el metro?", en: "Where's the metro?", tier: 1, tags: ["metro", "transport", "directions"], keywords: ["dónde", "metro"] },
            { es: "un boleto", en: "a ticket", note: "Mexico: 'boleto'. The CDMX metro costs just a few pesos.", tier: 1, tags: ["metro", "transport"], contextEs: "Un boleto, por favor", contextEn: "A ticket, please", keywords: ["boleto"] },
            { es: "¿Qué línea va a...?", en: "Which line goes to...?", tier: 2, tags: ["metro", "transport"], keywords: ["línea"] },
            { es: "¿Tengo que hacer transbordo?", en: "Do I have to transfer?", note: "'Transbordo' = changing lines.", tier: 2, tags: ["metro", "transport"], keywords: ["transbordo"] },
            { es: "¿Cuántas estaciones faltan?", en: "How many stations are left?", tier: 2, tags: ["metro", "transport"], keywords: ["estaciones"] },
            { es: "el andén", en: "the platform", tier: 1, tags: ["metro", "transport"], contextEs: "El tren llega al andén", contextEn: "The train arrives at the platform", keywords: ["andén"] },
            { es: "la salida", en: "the exit", tier: 1, tags: ["metro", "signs"], contextEs: "¿Dónde está la salida?", contextEn: "Where's the exit?", keywords: ["salida"] }
          ]
        },
        {
          id: "mx-bus", requires: { transport: "bus" },
          topic: "Bus", title: "Buses",
          reward: "You can flag the right camión and get off at the right stop. No more mystery tours.",
          items: [
            { es: "¿Este camión va al centro?", en: "Does this bus go downtown?", note: "Mexico: 'camión' = city bus.", tier: 2, tags: ["bus", "transport"], keywords: ["camión", "centro"] },
            { es: "¿Dónde está la parada?", en: "Where's the bus stop?", tier: 2, tags: ["bus", "directions"], keywords: ["parada"] },
            { es: "¿Cuánto es el pasaje?", en: "How much is the fare?", note: "Mexico: 'pasaje' = fare.", tier: 2, tags: ["bus", "money"], keywords: ["pasaje"], reply: { es: "Son diez pesos", en: "It's ten pesos" } },
            { es: "¿Me avisa cuando lleguemos?", en: "Will you let me know when we arrive?", tier: 2, tags: ["bus"], keywords: ["avisa"] },
            { es: "¿Aquí me bajo?", en: "Do I get off here?", tier: 2, tags: ["bus"], keywords: ["bajo"] },
            { es: "el chofer", en: "the driver", note: "Mexico: 'chofer'.", tier: 1, tags: ["bus", "transport"], contextEs: "Pregúntele al chofer", contextEn: "Ask the driver", keywords: ["chofer"] }
          ]
        },
        {
          id: "mx-ferry", requires: { transport: "ferry" },
          topic: "Ferry", title: "Ferries & boats",
          reward: "Docks, crossings, round-trips — you can board the ferry to Cozumel without boarding the wrong one.",
          items: [
            { es: "¿Dónde compro el boleto del ferry?", en: "Where do I buy the ferry ticket?", tier: 2, tags: ["ferry", "transport"], keywords: ["boleto", "ferry"] },
            { es: "¿A qué hora sale el próximo ferry?", en: "What time does the next ferry leave?", tier: 2, tags: ["ferry", "time"], keywords: ["ferry", "hora"] },
            { es: "¿Cuánto dura el viaje?", en: "How long is the trip?", tier: 2, tags: ["ferry", "transport"], keywords: ["viaje"] },
            { es: "¿De qué muelle sale?", en: "Which dock does it leave from?", tier: 2, tags: ["ferry"], keywords: ["muelle"] },
            { es: "un boleto de ida y vuelta", en: "a round-trip ticket", tier: 2, tags: ["ferry", "transport"], keywords: ["boleto"] },
            { es: "¿Está incluido el equipaje?", en: "Is luggage included?", tier: 2, tags: ["ferry"], keywords: ["equipaje"] },
            { es: "Se mueve mucho", en: "It's rough / it moves a lot", tier: 2, tags: ["ferry"], keywords: ["mueve"] }
          ]
        },
        {
          id: "mx-hotel", topic: "Hotel & check-in", title: "Checking in",
          reward: "Check-in, wifi, towels, a working shower — you can run the whole front desk and your room.",
          items: [
            { es: "Tengo una reservación", en: "I have a reservation", note: "Mexico: 'reservación'. (Spain: 'reserva'.)", tier: 2, tags: ["hotel", "lodging"], keywords: ["reservación"] },
            { es: "a nombre de...", en: "under the name of...", tier: 2, tags: ["hotel", "lodging"], contextEs: "A nombre de García", contextEn: "Under the name of García", keywords: ["nombre"] },
            { es: "un cuarto doble", en: "a double room", note: "Mexico: 'cuarto'. ('habitación' also fine.)", tier: 2, tags: ["hotel", "lodging"], keywords: ["cuarto"], variants: ["una habitación doble"] },
            { es: "¿A qué hora es la salida?", en: "What time is checkout?", tier: 2, tags: ["hotel", "time"], keywords: ["hora", "salida"], reply: { es: "A las doce del día", en: "At noon" } },
            { es: "¿El desayuno está incluido?", en: "Is breakfast included?", tier: 2, tags: ["hotel", "food"], keywords: ["desayuno"] },
            { es: "¿Hay wifi?", en: "Is there wifi?", tier: 1, tags: ["hotel", "lodging"], contextEs: "¿Hay wifi en el cuarto?", contextEn: "Is there wifi in the room?", keywords: ["wifi"] },
            { es: "¿Cuál es la contraseña?", en: "What's the password?", tier: 2, tags: ["hotel", "lodging"], keywords: ["contraseña"] },
            { es: "¿Puedo dejar mis maletas?", en: "Can I leave my bags?", tier: 2, tags: ["hotel", "lodging"], keywords: ["maletas"] },
            { es: "¿Puede limpiar el cuarto?", en: "Can you clean the room?", tier: 2, tags: ["hotel", "lodging"], keywords: ["limpiar", "cuarto"] },
            { es: "Necesito más toallas", en: "I need more towels", tier: 2, tags: ["hotel", "lodging"], keywords: ["toallas"] },
            { es: "¿Me trae otra almohada?", en: "Can you bring another pillow?", tier: 2, tags: ["hotel", "lodging"], keywords: ["almohada"] },
            { es: "La regadera no sirve", en: "The shower isn't working", note: "Mexico: 'regadera' = shower; 'no sirve' = doesn't work.", tier: 2, tags: ["hotel", "lodging"], keywords: ["regadera", "sirve"] },
            { es: "No hay agua caliente", en: "There's no hot water", tier: 2, tags: ["hotel", "lodging"], keywords: ["agua", "caliente"] },
            { es: "papel de baño", en: "toilet paper", note: "Mexico: 'papel de baño'.", tier: 2, tags: ["hotel", "bathroom"], keywords: ["papel", "baño"] },
            { es: "No molestar", en: "Do not disturb (sign)", tier: 1, tags: ["hotel", "signs"], contextEs: "El letrero de 'no molestar'", contextEn: "The 'do not disturb' sign", keywords: ["molestar"] },
            { es: "Muchas gracias por todo", en: "Thank you very much for everything", note: "Housekeeping appreciates it — and a small tip.", tier: 2, tags: ["politeness"] }
          ]
        },
        {
          id: "mx-airbnb", requires: { lodging: "airbnb" },
          topic: "Airbnb / apartment", title: "Your Airbnb",
          reward: "Keys, wifi, the boiler, trash day — you can handle a host like a pro.",
          items: [
            { es: "¿Dónde recojo las llaves?", en: "Where do I pick up the keys?", tier: 2, tags: ["lodging"], keywords: ["llaves"] },
            { es: "¿Cuál es la contraseña del wifi?", en: "What's the wifi password?", tier: 2, tags: ["lodging"], keywords: ["contraseña", "wifi"] },
            { es: "¿Cómo funciona el bóiler?", en: "How does the water heater work?", note: "Mexico: 'bóiler' = water heater.", tier: 2, tags: ["lodging"], keywords: ["bóiler"] },
            { es: "¿Dónde se tira la basura?", en: "Where do I take out the trash?", tier: 2, tags: ["lodging"], keywords: ["basura"] },
            { es: "La caja de seguridad no abre", en: "The lockbox won't open", tier: 3, tags: ["lodging"], keywords: ["caja", "abre"] },
            { es: "No hay agua caliente", en: "There's no hot water", tier: 2, tags: ["lodging"], keywords: ["agua", "caliente"] },
            { es: "¿A qué hora tengo que salir?", en: "What time do I have to check out?", tier: 2, tags: ["lodging", "time"], keywords: ["hora", "salir"] },
            { es: "¿Me da la dirección exacta?", en: "Can you give me the exact address?", tier: 2, tags: ["lodging", "directions"], keywords: ["dirección"] }
          ]
        },
        {
          id: "mx-landmarks", topic: "Sights & ruins", title: "Sightseeing",
          reward: "Two tickets to the ruins, please — and you said it in Spanish. Teotihuacán awaits.",
          items: [
            { es: "¿A qué hora abren las ruinas?", en: "What time do the ruins open?", tier: 2, tags: ["sights", "time"], keywords: ["hora", "ruinas"] },
            { es: "dos boletos, por favor", en: "two tickets, please", tier: 2, tags: ["sights"], keywords: ["boletos"] },
            { es: "¿Hay que reservar?", en: "Do you have to book ahead?", tier: 2, tags: ["sights"], keywords: ["reservar"] },
            { es: "¿Dónde está la taquilla?", en: "Where's the ticket booth?", note: "'Taquilla' = ticket window.", tier: 2, tags: ["sights", "directions"], keywords: ["taquilla"] },
            { es: "¿Se pueden tomar fotos?", en: "Can you take photos?", tier: 2, tags: ["sights"], keywords: ["fotos"] },
            { es: "la fila", en: "the line / queue", note: "Mexico: 'fila' = line.", tier: 1, tags: ["sights"], contextEs: "Hay que hacer fila", contextEn: "You have to wait in line", keywords: ["fila"] },
            { es: "el centro histórico", en: "the historic center", tier: 2, tags: ["sights", "directions"], keywords: ["centro"] },
            { es: "¿Abren los domingos?", en: "Are you open on Sundays?", tier: 2, tags: ["sights", "time"], keywords: ["domingos"] }
          ]
        },
        {
          id: "mx-market", topic: "Markets & shopping", title: "At the market",
          reward: "Markets decoded. ¿A cómo los aguacates? You got this.",
          items: [
            { es: "¿Tiene...?", en: "Do you have...?", tier: 1, tags: ["market", "shopping"], contextEs: "¿Tiene aguacates?", contextEn: "Do you have avocados?", keywords: ["tiene"] },
            { es: "¿A cómo?", en: "How much (per unit)?", note: "Classic market phrase for prices.", tier: 2, tags: ["market", "money"], keywords: ["cómo"], reply: { es: "A treinta pesos el kilo", en: "Thirty pesos a kilo" } },
            { es: "un poco más", en: "a little more", tier: 1, tags: ["market", "shopping"], contextEs: "Deme un poco más", contextEn: "Give me a little more", keywords: ["más"] },
            { es: "un poco menos", en: "a little less", tier: 1, tags: ["market", "shopping"], contextEs: "Un poco menos, por favor", contextEn: "A little less, please", keywords: ["menos"] },
            { es: "¿Me da medio kilo?", en: "Can you give me half a kilo?", tier: 2, tags: ["market", "shopping"], keywords: ["kilo"] },
            { es: "¿Está fresco?", en: "Is it fresh?", tier: 2, tags: ["market", "food"], keywords: ["fresco"] },
            { es: "Me llevo esto", en: "I'll take this", tier: 2, tags: ["market", "shopping"], keywords: ["llevo"] },
            { es: "¿Me da una bolsa?", en: "Can I get a bag?", tier: 2, tags: ["market", "shopping"], keywords: ["bolsa"] },
            { es: "Demasiado caro", en: "Too expensive", note: "Callback from money.", tier: 2, tags: ["market", "money"], keywords: ["caro"] },
            { es: "¿Lleva chile?", en: "Does it have chili?", note: "Callback from dietary.", tier: 2, tags: ["market", "food", "dietary"], keywords: ["lleva", "chile"] }
          ]
        },
        {
          id: "mx-talk", topic: "Small talk & bartender", title: "Bar & small talk",
          reward: "You can actually talk to people now. Mezcal conversations await.",
          items: [
            { es: "¿De dónde eres?", en: "Where are you from?", tier: 2, tags: ["social"], keywords: ["dónde", "eres"], reply: { es: "Soy de aquí, de la ciudad", en: "I'm from here, from the city" } },
            { es: "Soy de...", en: "I'm from...", tier: 1, tags: ["social"], contextEs: "Soy de Estados Unidos", contextEn: "I'm from the United States", keywords: ["soy"] },
            { es: "Mucho gusto", en: "Nice to meet you", tier: 1, tags: ["social", "greetings"], contextEs: "Mucho gusto, me llamo Ana", contextEn: "Nice to meet you, I'm Ana", reply: { es: "Igualmente", en: "Likewise" } },
            { es: "¿Qué me recomienda?", en: "What do you recommend?", note: "Callback from ordering — locals love being asked.", tier: 2, tags: ["social", "food"], keywords: ["recomienda"] },
            { es: "¿Cuál es tu mezcal favorito?", en: "What's your favorite mezcal?", tier: 2, tags: ["social", "drink"], keywords: ["mezcal"] },
            { es: "Está buenísimo", en: "It's really good", tier: 2, tags: ["social", "food"], keywords: ["buenísimo"], variants: ["Está riquísimo"] },
            { es: "Una más, por favor", en: "One more, please", tier: 1, tags: ["social", "drink"], contextEs: "Otra cerveza, una más por favor", contextEn: "Another beer, one more please", keywords: ["más"] },
            { es: "¿Cómo se llama esto?", en: "What's this called?", tier: 2, tags: ["social"], keywords: ["llama"] },
            { es: "¡Salud!", en: "Cheers!", tier: 1, tags: ["social", "drink"], contextEs: "¡Salud, por el viaje!", contextEn: "Cheers, to the trip!", keywords: ["salud"] }
          ]
        },
        {
          id: "mx-plane", bonus: true, topic: "On the plane", title: "On the plane",
          reward: "Chicken or pasta, juice or coffee — you can run the whole drinks cart in Spanish.",
          items: [
            { es: "¿Pollo o pasta?", en: "Chicken or pasta?", note: "What the flight attendant asks you.", tier: 2, tags: ["plane", "food"], keywords: ["pollo", "pasta"] },
            { es: "Pollo, por favor", en: "Chicken, please", tier: 1, tags: ["plane", "food"], contextEs: "Pollo, por favor, gracias", contextEn: "Chicken, please, thank you", keywords: ["pollo"] },
            { es: "¿Algo de tomar?", en: "Anything to drink?", note: "What they ask you.", tier: 2, tags: ["plane", "drink"], keywords: ["tomar"], reply: { es: "Un jugo, por favor", en: "A juice, please" } },
            { es: "Un jugo, por favor", en: "A juice, please", tier: 1, tags: ["plane", "drink"], contextEs: "Un jugo de naranja, por favor", contextEn: "An orange juice, please", keywords: ["jugo"] },
            { es: "Un café, por favor", en: "A coffee, please", tier: 1, tags: ["plane", "drink"], contextEs: "Un café con leche, por favor", contextEn: "A coffee with milk, please", keywords: ["café"] },
            { es: "Agua, por favor", en: "Water, please", tier: 1, tags: ["plane", "drink"], contextEs: "Agua sin gas, por favor", contextEn: "Still water, please", keywords: ["agua"] },
            { es: "¿Me da una cobija?", en: "Can I have a blanket?", note: "Mexico: 'cobija' = blanket. (Spain: 'manta'.)", tier: 2, tags: ["plane"], keywords: ["cobija"] },
            { es: "¿Puedo pasar?", en: "May I get by?", note: "To reach your seat.", tier: 1, tags: ["plane", "politeness"], contextEs: "Disculpe, ¿puedo pasar?", contextEn: "Excuse me, may I get by?", keywords: ["pasar"] }
          ]
        }
      ]
    },

    /* ============================ PASS 3 · FLUENT ============================ */
    {
      id: "mx-p3", pass: 3, title: "Fluent", blurb: "The trip you'd have if you spoke Spanish.",
      lessons: [
        {
          id: "mx-chef", topic: "Advanced · At the restaurant", title: "Talk to the chef",
          reward: "Full sentences at the table now. People might mistake you for someone who lives here.",
          items: [
            { es: "¿Me podría recomendar un platillo típico?", en: "Could you recommend a typical dish?", note: "Mexico: 'platillo' = dish.", tier: 3, tags: ["restaurant", "food"], difficulty: 4, keywords: ["recomendar", "platillo"] },
            { es: "Disculpe, creo que hay un error en la cuenta", en: "Excuse me, I think there's a mistake on the bill", tier: 3, tags: ["restaurant", "money"], difficulty: 4, keywords: ["error", "cuenta"] },
            { es: "¿A qué hora cierra la cocina?", en: "What time does the kitchen close?", tier: 3, tags: ["restaurant", "time"], difficulty: 3, keywords: ["hora", "cocina"] },
            { es: "Estamos buscando un lugar para cenar cerca de aquí", en: "We're looking for somewhere to have dinner near here", tier: 3, tags: ["restaurant", "directions"], difficulty: 4, keywords: ["buscando", "cenar", "cerca"] }
          ]
        },
        {
          id: "mx-fix", topic: "Advanced · When things go wrong", title: "Complaints & mix-ups",
          reward: "Lost, overcharged, double-booked — you can talk your way out of it. Travel boss mode.",
          items: [
            { es: "Hice una reservación pero no aparece", en: "I made a reservation but it's not showing up", tier: 3, tags: ["hotel", "lodging"], difficulty: 4, keywords: ["reservación", "aparece"] },
            { es: "Creo que estoy perdido, ¿me puede ayudar?", en: "I think I'm lost, can you help me?", tier: 3, tags: ["directions", "emergency"], difficulty: 3, keywords: ["perdido", "ayudar"] },
            { es: "Se me olvidó la cartera en el taxi", en: "I left my wallet in the taxi", tier: 3, tags: ["taxi", "emergency"], difficulty: 4, keywords: ["cartera", "taxi"] },
            { es: "¿Puede llamar a un doctor, por favor?", en: "Can you call a doctor, please?", tier: 3, tags: ["emergency", "health"], difficulty: 3, keywords: ["llamar", "doctor"] },
            { es: "Esto no es lo que pedí", en: "This isn't what I ordered", tier: 2, tags: ["restaurant"], keywords: ["pedí"] },
            { es: "¿Dónde está la delegación más cercana?", en: "Where's the nearest police station?", note: "Mexico: often 'delegación' or 'ministerio público'.", tier: 3, tags: ["emergency", "directions"], difficulty: 4, keywords: ["delegación", "cercana"] },
            { es: "¿Sería posible cambiar de cuarto?", en: "Would it be possible to change rooms?", tier: 3, tags: ["hotel", "lodging"], difficulty: 4, keywords: ["cambiar", "cuarto"] },
            { es: "Disculpe, ¿este camión va al centro?", en: "Excuse me, does this bus go downtown?", tier: 3, tags: ["bus", "transport"], difficulty: 3, keywords: ["camión", "centro"] }
          ]
        },
        {
          id: "mx-haggle", topic: "Advanced · Markets", title: "Market haggling",
          reward: "You can talk a price down without switching to English. The vendor smiles — you won.",
          items: [
            { es: "¿Me hace un descuento?", en: "Can you give me a discount?", tier: 3, tags: ["market", "money", "shopping"], difficulty: 3, keywords: ["descuento"] },
            { es: "¿Es lo más barato que tiene?", en: "Is that the cheapest you have?", tier: 3, tags: ["market", "money", "shopping"], difficulty: 4, keywords: ["barato"] },
            { es: "¿No tiene algo más barato?", en: "Don't you have anything cheaper?", tier: 3, tags: ["market", "money", "shopping"], difficulty: 4, keywords: ["barato"] },
            { es: "Con descuento me lo llevo", en: "With a discount I'll take it", tier: 3, tags: ["market", "money", "shopping"], difficulty: 4, keywords: ["descuento"] },
            { es: "¿Me da un descuento si llevo dos?", en: "A discount if I take two?", tier: 3, tags: ["market", "money", "shopping"], difficulty: 4, keywords: ["descuento"] },
            { es: "¿Cuál es el más barato?", en: "Which is the cheapest?", tier: 3, tags: ["market", "money", "shopping"], difficulty: 3, keywords: ["barato"] }
          ]
        },
        {
          id: "mx-mezcal", topic: "Advanced · Bars", title: "Mezcal & cocktail bars",
          reward: "You can chat up a bartender and order like a local. Salud — the good stuff finds you now.",
          items: [
            { es: "¿Qué mezcal me recomienda?", en: "Which mezcal do you recommend?", tier: 3, tags: ["drink", "social"], difficulty: 3, keywords: ["mezcal", "recomienda"] },
            { es: "Un mezcal derecho, por favor", en: "A mezcal neat, please", note: "Mexico: 'derecho' = neat/straight up.", tier: 3, tags: ["drink", "social"], difficulty: 3, keywords: ["mezcal"] },
            { es: "¿Cuál es su mejor mezcal?", en: "What's your best mezcal?", tier: 3, tags: ["drink", "social"], difficulty: 3, keywords: ["mezcal"] },
            { es: "¿Me recomienda un cóctel?", en: "Can you recommend a cocktail?", tier: 3, tags: ["drink", "social"], difficulty: 3, keywords: ["cóctel", "recomienda"] },
            { es: "Un cóctel sin alcohol, por favor", en: "A mocktail (alcohol-free cocktail), please", tier: 3, tags: ["drink", "social"], difficulty: 4, keywords: ["cóctel"] },
            { es: "¿Cuál es el cóctel de la casa?", en: "What's the house cocktail?", tier: 3, tags: ["drink", "social"], difficulty: 4, keywords: ["cóctel"] }
          ]
        },
        {
          id: "mx-guide", topic: "Advanced · Tours", title: "Touring with a guide",
          reward: "Times, tickets, what's included — you can join a tour and actually follow along. Teotihuacán, decoded.",
          items: [
            { es: "¿Cuánto dura el recorrido?", en: "How long is the tour?", note: "Mexico: 'recorrido' = tour/route.", tier: 3, tags: ["sights", "tour"], difficulty: 3, keywords: ["cuánto", "recorrido"] },
            { es: "¿A qué hora empieza el recorrido?", en: "What time does the tour start?", tier: 3, tags: ["sights", "tour", "time"], difficulty: 3, keywords: ["hora", "recorrido"] },
            { es: "¿El recorrido incluye las ruinas?", en: "Does the tour include the ruins?", tier: 3, tags: ["sights", "tour"], difficulty: 4, keywords: ["recorrido"] },
            { es: "¿Podemos tomar fotos aquí?", en: "Can we take photos here?", tier: 3, tags: ["sights", "tour"], difficulty: 3 },
            { es: "¿Nos recomienda un buen lugar?", en: "Can you recommend a good spot?", tier: 3, tags: ["sights", "tour"], difficulty: 3, keywords: ["recomienda"] },
            { es: "¿Cuánto cuesta la entrada?", en: "How much is admission?", tier: 3, tags: ["sights", "tour", "money"], difficulty: 3, keywords: ["cuánto"] }
          ]
        }
      ]
    }
  ]
};

if (typeof module !== "undefined") module.exports = MEXICO_PACK;
