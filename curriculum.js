/* =========================================================================
   CURRICULUM  —  Castilian Spanish (Barcelona), travel-phrases-first.
   Organized as a TIERED SPIRAL (spec §1b): three PASSES — Survival, Comfort,
   Fluent — mirroring the Mexico pack. Core scenarios (food, money, directions)
   recur across passes at rising difficulty. Passes are pacing GUIDANCE, never
   locks; the exposure ladder handles difficulty. Item identity is the phrase
   (spain:slug), so items keep SRS history across this reshuffle.
   item = { es, en, note?, latam?, cat?, tier?, tags?, difficulty?, keywords?,
            contextEs?, contextEn?, variants?, anchor?, reply? }
   ========================================================================= */

/* ---- BARCELONA CAST (§9b.2) — fictional recurring characters; food/places are real.
   Cast names live ONLY in English scene/primer text, never in a graded `es` answer.
   - Jordi   — the taxi driver who picks you up at El Prat; dry, knows every shortcut.
   - Marina  — runs a tiny tasca (comedor) off the Barri Gòtic; feeds you like family.
   - Toni    — the bartender at a vermutería; pours vermut and opinions in equal measure.
   - Núria   — a vendor at La Boqueria market; will let you taste before you buy.
   - Sra. Rosa — the farmacéutica on the corner; unflappable in an emergency.
   Real anchors: pa amb tomàquet / pan con tomate, vermut, jamón, patatas bravas, cava,
   La Boqueria, el Barri Gòtic, Plaça Reial, la Sagrada Família, Montjuïc. ---- */

const CURRICULUM = {
  stages: [
    /* ============================ PASS 0 · SURVIVAL KIT ============================
       Chapter 0 (docs/tripfluent-stage0-content-map.md): 3 kit lessons + 7 pattern machines.
       Kit items MIGRATED from pass 1 (ids derive from es, so SRS history rides along). */
    {
      id: "sp-p0", pass: 0, title: "Survival kit", blurb: "The words and patterns that work everywhere. Your generators.",
      lessons: [
                  {
                    id: "sp0-first-words", topic: "Core basics", title: "First words",
                    primer: { scene: "The words you'll use before you're out of the airport. Hello, please, thank you, and the one that rescues most conversations: more slowly, please." },
                    beat: "Please, thanks, help. The universal kit.",
                    items: [
                      { es: "Hola", en: "Hello", tier: 1, tags: ["greetings"], contextEs: "Hola, buenos días", contextEn: "Hi, good morning" },
                      { es: "Buenos días", en: "Good morning", tier: 1, tags: ["greetings"], contextEs: "Buenos días, ¿qué tal?", contextEn: "Good morning, how are you?", keywords: ["días"] },
                      { es: "Buenas tardes", en: "Good afternoon", tier: 1, tags: ["greetings"], contextEs: "Buenas tardes, señor", contextEn: "Good afternoon, sir", keywords: ["tardes"] },
                      { es: "Buenas noches", en: "Good evening / night", tier: 1, tags: ["greetings"], contextEs: "Buenas noches, hasta mañana", contextEn: "Good night, see you tomorrow", keywords: ["noches"] },
                      { es: "Por favor", en: "Please", tier: 1, tags: ["politeness"], contextEs: "Un café, por favor", contextEn: "A coffee, please", keywords: ["por favor"] },
                      { es: "Gracias", en: "Thank you", tier: 1, tags: ["politeness"], contextEs: "Muchas gracias por todo", contextEn: "Thank you very much for everything", anchor: "Think: 'gratitude.'", variants: ["Muchas gracias"], reply: { es: "De nada", en: "You're welcome" } },
                      { es: "De nada", en: "You're welcome", tier: 1, tags: ["politeness"], contextEs: "Gracias. De nada.", contextEn: "Thanks. You're welcome." },
                      { es: "Perdón", en: "Excuse me / Sorry", tier: 1, tags: ["politeness"], contextEs: "Perdón, ¿me ayuda?", contextEn: "Excuse me, can you help me?", keywords: ["perdón"] },
                      { es: "Sí", en: "Yes", tier: 1, tags: ["basics"], contextEs: "Sí, por favor", contextEn: "Yes, please" },
                      { es: "No", en: "No", tier: 1, tags: ["basics"], contextEs: "No, gracias", contextEn: "No, thanks" },
                      { es: "No entiendo", en: "I don't understand", tier: 1, tags: ["communication"], contextEs: "Perdón, no entiendo bien", contextEn: "Sorry, I don't understand well", keywords: ["entiendo"] },
                      { es: "¿Habla inglés?", en: "Do you speak English?", note: "Formal (usted). Polite default with strangers.", tier: 1, tags: ["communication"], contextEs: "Perdone, ¿habla inglés?", contextEn: "Excuse me, do you speak English?", anchor: "'inglés' = English.", keywords: ["inglés"] },
                      { es: "No lo sé", en: "I don't know", tier: 1, tags: ["communication"], contextEs: "No lo sé, lo siento", contextEn: "I don't know, sorry" },
                    ]
                  },
                  {
                    id: "sp0-quiero", topic: "Core patterns", title: "Quiero ___",
                    primer: { scene: "The wanting machine. Point it at a coffee, a table, a train ticket, anything you can name or point to." },
                    beat: "The wanting machine. Point it at anything.",
                    machine: true, frame: "quiero ___",
                    frameGloss: "Quiero = I want. Works at every counter in the Spanish-speaking world.",
                    items: [
                      { es: "Quiero esto", en: "I want this one", tier: 1, tags: ["core"], keywords: ["esto"], frame: "quiero ___", contextEs: "Quiero esto, por favor", contextEn: "I want this one, please", note: "Point at it. Esto plus a finger orders almost anything." },
                      { es: "Quiero un café", en: "I want a coffee", tier: 1, tags: ["core"], keywords: ["café"], frame: "quiero ___", anchor: "Shortcut: Un café, por favor is a complete order too. The machine is optional; the noun is not." },
                      { es: "Quiero una mesa para dos", en: "I want a table for two", tier: 1, tags: ["core"], keywords: ["mesa"], frame: "quiero ___" },
                      { es: "Quiero un taxi", en: "I want a taxi", tier: 1, tags: ["core"], keywords: ["taxi"], frame: "quiero ___" },
                    ]
                  },
                  {
                    id: "sp0-donde", topic: "Core patterns", title: "¿Dónde está ___?",
                    primer: { scene: "The finding machine. Ask where anything is, and know enough of the answer to start walking." },
                    beat: "The finding machine.",
                    machine: true, frame: "¿dónde está ___?",
                    frameGloss: "¿Dónde está...? = where is...? Point it at anything lost.",
                    items: [
                      { es: "¿Dónde está el baño?", en: "Where is the bathroom?", tier: 1, tags: ["core"], keywords: ["baño"], frame: "¿dónde está ___?", note: "In Spain you will also hear el servicio for a restaurant loo." },
                      { es: "¿Dónde está la estación?", en: "Where is the station?", tier: 1, tags: ["core"], keywords: ["estación"], frame: "¿dónde está ___?" },
                      { es: "¿Dónde está mi hotel?", en: "Where is my hotel?", tier: 1, tags: ["core"], keywords: ["hotel"], frame: "¿dónde está ___?" },
                      { es: "¿Dónde está la farmacia?", en: "Where's the pharmacy?", tier: 1, tags: ["emergency", "health", "directions"], keywords: ["dónde", "farmacia"], frame: "¿dónde está ___?" },
                    ]
                  },
                  {
                    id: "sp0-numbers", topic: "Core numbers", title: "Numbers that pay",
                    primer: { scene: "Numbers are money here. Prices, room numbers, platforms, tips. These pay for themselves on day one." },
                    beat: "Count it, pay it, check the change.",
                    items: [
                      { es: "uno", en: "one", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Uno, por favor", contextEn: "One, please" },
                      { es: "dos", en: "two", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Una mesa para dos", contextEn: "A table for two" },
                      { es: "tres", en: "three", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Tres cañas, por favor", contextEn: "Three beers, please" },
                      { es: "cuatro", en: "four", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Somos cuatro", contextEn: "There are four of us" },
                      { es: "cinco", en: "five", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Cinco euros", contextEn: "Five euros" },
                      { es: "seis", en: "six", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "A las seis", contextEn: "At six" },
                      { es: "siete", en: "seven", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Siete de la tarde", contextEn: "Seven in the evening" },
                      { es: "ocho", en: "eight", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "A las ocho", contextEn: "At eight" },
                      { es: "nueve", en: "nine", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Abre a las nueve", contextEn: "It opens at nine" },
                      { es: "diez", en: "ten", tier: 1, tags: ["numbers"], difficulty: 1, contextEs: "Diez euros", contextEn: "Ten euros" },
                      { es: "veinte", en: "twenty", tier: 1, tags: ["numbers", "money"], contextEs: "Veinte euros", contextEn: "Twenty euros" },
                      { es: "cincuenta", en: "fifty", tier: 1, tags: ["numbers", "money"], contextEs: "Cincuenta euros", contextEn: "Fifty euros" },
                      { es: "cien", en: "one hundred", tier: 1, tags: ["numbers", "money"], contextEs: "Cien euros", contextEn: "One hundred euros", anchor: "Think: 'century / percent', 100." },
                      { es: "En efectivo", en: "In cash", tier: 1, tags: ["money"], contextEs: "Voy a pagar en efectivo", contextEn: "I'll pay in cash", keywords: ["efectivo"] },
                    ]
                  },
                  {
                    id: "sp0-cuanto", topic: "Core patterns", title: "¿Cuánto cuesta ___?",
                    primer: { scene: "The price machine. Nothing in Spain will have a price you can't ask about." },
                    beat: "The price machine.",
                    machine: true, frame: "¿cuánto cuesta ___?",
                    frameGloss: "¿Cuánto cuesta...? = how much is...? Ask before you nod.",
                    items: [
                      { es: "¿Cuánto cuesta esto?", en: "How much is this?", tier: 1, tags: ["core"], keywords: ["cuesta"], frame: "¿cuánto cuesta ___?", note: "Esto again. Point, ask, decide." },
                      { es: "¿Cuánto cuesta la entrada?", en: "How much is the entrance ticket?", tier: 1, tags: ["core"], keywords: ["entrada"], frame: "¿cuánto cuesta ___?" },
                      { es: "¿Cuánto cuesta un billete?", en: "How much is a ticket?", tier: 1, tags: ["core"], keywords: ["billete"], frame: "¿cuánto cuesta ___?" },
                      { es: "¿Cuánto cuesta la habitación?", en: "How much is the room?", tier: 1, tags: ["core"], keywords: ["habitación"], frame: "¿cuánto cuesta ___?" },
                    ]
                  },
                  {
                    id: "sp0-metraer", topic: "Core patterns", title: "¿Me puede traer ___?",
                    primer: { scene: "The bring-me machine. Polite enough for anywhere, strong enough to get the check." },
                    beat: "The bring-me machine. Your table workhorse.",
                    machine: true, frame: "¿me puede traer ___?",
                    frameGloss: "¿Me puede traer...? = could you bring me...? The polite ask that works on anyone.",
                    items: [
                      { es: "¿Me puede traer la cuenta?", en: "Could you bring me the check?", tier: 1, tags: ["core"], keywords: ["cuenta"], frame: "¿me puede traer ___?", variants: ["¿Me trae la cuenta?"], note: "Me trae...? is the same machine with the jacket off. Both are right.", anchor: "Think: traer is to bring. You are asking them to bring it, not going to get it." },
                      { es: "¿Me puede traer agua?", en: "Could you bring me water?", tier: 1, tags: ["core"], keywords: ["agua"], frame: "¿me puede traer ___?", variants: ["¿Me trae agua?"] },
                      { es: "¿Me puede traer el menú?", en: "Could you bring me the menu?", tier: 1, tags: ["core"], keywords: ["menú"], frame: "¿me puede traer ___?", variants: ["¿Me trae el menú?"] },
                      { es: "¿Me puede traer otra caña?", en: "Could you bring me another beer?", tier: 1, tags: ["core"], keywords: ["caña"], frame: "¿me puede traer ___?", variants: ["¿Me trae otra caña?"], note: "A caña is the small draft beer Spain actually orders." },
                    ]
                  },
                  {
                    id: "sp0-hay", topic: "Core patterns", title: "¿Hay ___?",
                    primer: { scene: "The is-there machine. One little word opens every \"does this place have...\" question you'll ever need." },
                    beat: "The is-there machine.",
                    machine: true, frame: "¿hay ___?",
                    frameGloss: "¿Hay...? = is there...? Availability in one word.",
                    items: [
                      { es: "¿Hay wifi?", en: "Is there wifi?", tier: 1, tags: ["core"], keywords: ["wifi"], frame: "¿hay ___?", contextEs: "¿Hay wifi aquí?", contextEn: "Is there wifi here?" },
                      { es: "¿Hay una farmacia cerca?", en: "Is there a pharmacy nearby?", tier: 1, tags: ["core"], keywords: ["farmacia", "cerca"], frame: "¿hay ___?" },
                      { es: "¿Hay mesa?", en: "Is there a table?", tier: 1, tags: ["core"], keywords: ["mesa"], frame: "¿hay ___?", contextEs: "¿Hay mesa para dos?", contextEn: "Is there a table for two?" },
                      { es: "¿Hay algo sin gluten?", en: "Is there anything gluten-free?", tier: 1, tags: ["core"], keywords: ["gluten"], frame: "¿hay ___?" },
                    ]
                  },
                  {
                    id: "sp0-aquehora", topic: "Core patterns", title: "¿A qué hora ___?",
                    primer: { scene: "The when machine. Opening times, closing times, the last train back." },
                    beat: "The when machine.",
                    machine: true, frame: "¿a qué hora ___?",
                    frameGloss: "¿A qué hora...? = at what time...? Opens, closes, leaves: the schedule machine.",
                    items: [
                      { es: "¿A qué hora abre?", en: "What time does it open?", tier: 1, tags: ["time"], keywords: ["hora", "abre"], reply: { es: "A las nueve de la mañana", en: "At nine in the morning" }, frame: "¿a qué hora ___?" },
                      { es: "¿A qué hora cierra?", en: "What time does it close?", tier: 1, tags: ["core"], keywords: ["cierra"], frame: "¿a qué hora ___?" },
                      { es: "¿A qué hora sale el tren?", en: "What time does the train leave?", tier: 1, tags: ["core"], keywords: ["sale", "tren"], frame: "¿a qué hora ___?" },
                      { es: "¿A qué hora empieza?", en: "What time does it start?", tier: 1, tags: ["core"], keywords: ["empieza"], frame: "¿a qué hora ___?" },
                    ]
                  },
                  {
                    id: "sp0-necesito", topic: "Core patterns", title: "Necesito ___",
                    primer: { scene: "The need machine, for when wanting is too polite." },
                    beat: "The need machine.",
                    machine: true, frame: "necesito ___",
                    frameGloss: "Necesito = I need. For when wanting is too polite.",
                    items: [
                      { es: "Necesito ayuda", en: "I need help", tier: 1, tags: ["core"], keywords: ["ayuda"], frame: "necesito ___", contextEs: "Necesito ayuda, por favor", contextEn: "I need help, please" },
                      { es: "Necesito un médico", en: "I need a doctor", tier: 1, tags: ["emergency", "health"], keywords: ["médico"], variants: ["Necesito un doctor"], frame: "necesito ___" },
                      { es: "Necesito un taxi", en: "I need a taxi", tier: 1, tags: ["core"], keywords: ["taxi"], frame: "necesito ___" },
                      { es: "Necesito un cargador", en: "I need a charger", tier: 1, tags: ["core"], keywords: ["cargador"], frame: "necesito ___", note: "The dead-phone phrase. Learn it before you need it." },
                    ]
                  },
                  {
                    id: "sp0-wrong", topic: "Core phrases", title: "When it goes wrong",
                    primer: { scene: "Lost bag, wrong turn, missed train. A small kit for bad moments, so a bad moment stays small." },
                    beat: "What they'll say to you, and what to say back.",
                    items: [
                      { es: "¿Algo más?", en: "Anything else?", tier: 1, tags: ["social", "restaurant"], contextEs: "¿Algo más? No, gracias.", contextEn: "Anything else? No, thanks.", keywords: ["más"] },
                      { es: "Aquí tiene", en: "Here you go", tier: 1, tags: ["social", "restaurant"], contextEs: "Aquí tiene su cambio", contextEn: "Here's your change", keywords: ["tiene"] },
                      { es: "Un momento", en: "One moment", tier: 1, tags: ["social"], contextEs: "Un momento, por favor", contextEn: "One moment, please", keywords: ["momento"] },
                      { es: "¿Está todo bien?", en: "Is everything okay?", tier: 1, tags: ["social", "restaurant"], contextEs: "¿Está todo bien? Sí, gracias.", contextEn: "Is everything okay? Yes, thanks.", keywords: ["todo"] },
                      { es: "Que aproveche", en: "Enjoy your meal", note: "Spain's 'bon appétit'.", tier: 1, tags: ["social", "food"], keywords: ["aproveche"] },
                      { es: "Dígame", en: "Go ahead / Tell me", note: "Shopkeepers & phone calls say this to mean 'how can I help?'", tier: 1, tags: ["social", "politeness"], keywords: ["dígame"] },
                      { es: "Pase, pase", en: "Come in / Go ahead", tier: 1, tags: ["social", "politeness"], contextEs: "Pase, pase, siéntese", contextEn: "Come in, come in, sit down", keywords: ["pase"] },
                      { es: "Ayuda", en: "Help", tier: 1, tags: ["emergency"], contextEs: "¡Ayuda, por favor!", contextEn: "Help, please!", keywords: ["ayuda"] },
                      { es: "Llame a la policía", en: "Call the police", note: "Emergency number in Spain is 112.", tier: 1, tags: ["emergency"], keywords: ["policía"] },
                      { es: "Es una emergencia", en: "It's an emergency", tier: 1, tags: ["emergency"], contextEs: "Por favor, es una emergencia", contextEn: "Please, it's an emergency", keywords: ["emergencia"] },
                    ]
                  },
      ]
    },
    /* ============================ PASS 1 · SURVIVAL ============================ */
    {
      id: "sp-p1", pass: 1, title: "Essentials", blurb: "The words that keep you alive on day one.",
      lessons: [
        {
          id: "s1-rescue", topic: "How do you say", title: "I only speak a little",
          reward: "Now you can confess your Spanish is bad, in Spanish. Meta. Keep going so you don't have to.",
          primer: { scene: "Marina, who runs the little tasca on the corner, just reeled off today's specials, and you caught maybe one word. She waits, order pad in hand, patient.", mission: "Admit your Spanish is shaky, and ask her to slow down.", guessItem: "¿Habla inglés?" },
          items: [
            { es: "Hablo solo un poco de español", en: "I only speak a little Spanish", tier: 2, tags: ["communication"], keywords: ["español"] },
            { es: "¿Cómo se dice...?", en: "How do you say...?", tier: 2, tags: ["communication"], keywords: ["dice"] },
            { es: "¿Puede repetir, por favor?", en: "Can you repeat that, please?", tier: 2, tags: ["communication"], keywords: ["repetir"], variants: ["¿Me lo repite, por favor?"] },
            { es: "Más despacio, por favor", en: "Slower, please", tier: 2, tags: ["communication"], keywords: ["despacio"] },
            { es: "¿Qué significa?", en: "What does it mean?", tier: 2, tags: ["communication"], contextEs: "¿Qué significa esta palabra?", contextEn: "What does this word mean?", keywords: ["significa"] },
          ]
        },
        {
          id: "sp-table", topic: "Restaurant · Ordering", title: "First words at the table",
          reward: "You can get a table, order, ask for the check, and flag your shellfish allergy. Night one at the tapas bar: handled.",
          cultureNote: "Pa amb tomàquet, bread rubbed with ripe tomato, olive oil, and salt, comes with almost everything in Barcelona. You rub it on yourself; don't go asking for butter.",
          primer: { scene: "It's packed at Marina's tasca. She wipes down a table, waves you into a chair, and asks '¿para cuántos?'", mission: "Get a table, order, and warn her about the shellfish before the tapas land.", guessItem: "Soy alérgico al marisco" },
          items: [
            { es: "Una mesa para dos, por favor", en: "A table for two, please", tier: 2, tags: ["restaurant", "food"], keywords: ["mesa"], variants: ["Mesa para dos, por favor"] },
            { es: "La carta, por favor", en: "The menu, please", note: "In Spain 'la carta' = the menu. 'El menú' usually means the fixed menú del día.", tier: 2, tags: ["restaurant", "food"], keywords: ["carta"], variants: ["¿Me trae la carta?"] },
            { es: "Agua sin gas", en: "Still water (no bubbles)", tier: 1, tags: ["drink", "restaurant"], contextEs: "Una botella de agua sin gas", contextEn: "A bottle of still water", keywords: ["agua"] },
            { es: "La cuenta, por favor", en: "The check, please", tier: 2, tags: ["restaurant", "money"], keywords: ["cuenta"], variants: ["¿Me trae la cuenta?"] },
            { es: "Soy alérgico al marisco", en: "I'm allergic to shellfish", note: "Women: 'alérgica'.", tier: 2, tags: ["dietary", "health"], anchor: "'alérgico' = allergic.", keywords: ["alérgico", "marisco"] },
            { es: "Sin gluten", en: "Gluten-free", tier: 1, tags: ["dietary", "food"], contextEs: "¿Tienen algo sin gluten?", contextEn: "Do you have anything gluten-free?", keywords: ["gluten"] }
          ]
        },
        {
          id: "s2-bathroom", topic: "Restaurant · Bathrooms", title: "Where's the loo",
          reward: "You can find a bathroom and read a door. Push vs. pull humiliation: avoided.",
          cultureNote: "Ask for 'los servicios' or 'los aseos', 'baño' is understood but marks you as not-from-here. In Catalonia the door signs may be in Catalan too: 'Lavabos'.",
          primer: { scene: "Two unmarked doors at the back of Marina's place, and a waiter squeezing past with a tray of vermut. You need to pick the right one.", mission: "Ask where the loo is, and read the door before you push.", guessItem: "Entrada" },
          items: [
            { es: "¿Dónde está el servicio?", en: "Where is the bathroom?", note: "Spain says 'el servicio / los servicios'. Signs read 'Aseos'.", latam: "Latin America: '¿Dónde está el baño?'", tier: 1, tags: ["bathroom", "directions"], keywords: ["dónde", "servicio"], reply: { es: "Al fondo a la derecha", en: "At the back on the right" } },
            { es: "los aseos", en: "the restrooms (sign)", tier: 1, tags: ["bathroom", "signs"], contextEs: "Los aseos están al fondo", contextEn: "The restrooms are at the back", keywords: ["aseos"] },
            { es: "Caballeros", en: "Men (sign)", tier: 1, tags: ["bathroom", "signs"], contextEs: "El aseo de caballeros", contextEn: "The men's room", keywords: ["caballeros"] },
            { es: "Señoras", en: "Women (sign)", tier: 1, tags: ["bathroom", "signs"], contextEs: "El aseo de señoras", contextEn: "The women's room", keywords: ["señoras"] },
            { es: "Salida", en: "Exit", cat: "Catalan sign: 'Sortida'.", tier: 1, tags: ["signs"], contextEs: "La salida está por allí", contextEn: "The exit is over there", keywords: ["salida"] },
            { es: "Entrada", en: "Entrance", cat: "Catalan sign: 'Entrada'.", tier: 1, tags: ["signs"], contextEs: "La entrada principal", contextEn: "The main entrance", anchor: "'entrada' = entrance (to enter).", keywords: ["entrada"] },
            { es: "Empujar", en: "Push (sign)", tier: 1, tags: ["signs"], contextEs: "La puerta dice 'empujar'", contextEn: "The door says 'push'", keywords: ["empujar"] },
            { es: "Tirar", en: "Pull (sign)", note: "On doors 'Tirar' = pull. Confusingly it also means 'to throw'.", tier: 1, tags: ["signs"], contextEs: "La puerta dice 'tirar'", contextEn: "The door says 'pull'", keywords: ["tirar"] }
          ]
        },
        {
          id: "sp-cash", topic: "Numbers, money & paying", title: "Euros & paying cash",
          reward: "Euros, cash, and the total, you can pay without pointing at the till.",
          primer: { scene: "At La Boquería, Núria weighs out a paper cone of jamón and holds out her hand. Taped to her stall: a hand-lettered 'solo efectivo.'", mission: "Handle euros and pay Núria in cash without fumbling.", guessItem: "cien" },
          items: [
            { es: "¿Cuánto cuesta?", en: "How much is it?", tier: 2, tags: ["money", "shopping"], keywords: ["cuánto", "cuesta"], variants: ["¿Qué precio tiene?"], reply: { es: "Son cinco euros", en: "It's five euros" } }
          ]
        },
        {
          id: "s3-directions", topic: "Walking directions", title: "Which way?",
          primer: { scene: "You ask Marina how to find the Sagrada Família and she answers with her hands as much as her words: right at the corner, left at the plaza, straight on until the towers find you. Somewhere in the middle you'll get lost. That's the good part." },
          reward: "Left, right, straight ahead, you can now get lost on purpose. Gaudí's buildings await.",
          items: [
            { es: "¿Cómo llego a...?", en: "How do I get to...?", tier: 2, tags: ["directions"], keywords: ["llego"] },
            { es: "a la derecha", en: "to the right", tier: 1, tags: ["directions"], contextEs: "Gire a la derecha", contextEn: "Turn right", keywords: ["derecha"] },
            { es: "a la izquierda", en: "to the left", tier: 1, tags: ["directions"], contextEs: "Gire a la izquierda", contextEn: "Turn left", keywords: ["izquierda"] },
            { es: "todo recto", en: "straight ahead", latam: "Latin America: 'todo derecho' / 'derecho'.", tier: 1, tags: ["directions"], contextEs: "Siga todo recto", contextEn: "Go straight ahead", keywords: ["recto"] },
            { es: "¿Está lejos?", en: "Is it far?", tier: 1, tags: ["directions"], keywords: ["lejos"], reply: { es: "No, está aquí cerca", en: "No, it's close by" } },
            { es: "cerca", en: "near", tier: 1, tags: ["directions"], contextEs: "Está aquí cerca", contextEn: "It's close by", keywords: ["cerca"] },
            { es: "la esquina", en: "the corner", tier: 2, tags: ["directions"], contextEs: "En la esquina, a la derecha", contextEn: "At the corner, on the right", keywords: ["esquina"] },
            { es: "la plaza", en: "the square", tier: 1, tags: ["directions", "sights"], contextEs: "La plaza está cerca", contextEn: "The square is nearby", keywords: ["plaza"] }
          ]
        },
        {
          id: "s3-airport", topic: "Transport · Airport signs", title: "Reading the airport",
          reward: "Arrivals, departures, your gate, all decoded. You will not miss the flight because of a sign.",
          primer: { scene: "You step off the plane at El Prat into a wall of signage, half Spanish, half Catalan. Somewhere past security, Jordi is waiting with a cab.", mission: "Read the signs, departures, arrivals, security, customs.", guessItem: "Control de seguridad" },
          items: [
            { es: "Salidas", en: "Departures", cat: "Catalan: 'Sortides'.", tier: 1, tags: ["airport", "signs"], contextEs: "La sala de salidas", contextEn: "The departures hall", keywords: ["salidas"] },
            { es: "Llegadas", en: "Arrivals", cat: "Catalan: 'Arribades'.", tier: 1, tags: ["airport", "signs"], contextEs: "La zona de llegadas", contextEn: "The arrivals area", keywords: ["llegadas"] },
            { es: "Puerta de embarque", en: "Boarding gate", tier: 2, tags: ["airport", "signs"], keywords: ["puerta", "embarque"] },
            { es: "Facturación", en: "Check-in (bag drop)", latam: "Latin America: 'registro' / 'check-in'.", tier: 1, tags: ["airport", "signs"], contextEs: "El mostrador de facturación", contextEn: "The check-in counter", keywords: ["facturación"] },
            { es: "Recogida de equipajes", en: "Baggage claim", tier: 2, tags: ["airport", "signs"], keywords: ["equipajes"] },
            { es: "Control de seguridad", en: "Security control", tier: 1, tags: ["airport", "signs"], contextEs: "Pasar el control de seguridad", contextEn: "To go through security", anchor: "'seguridad' = security.", keywords: ["seguridad"] },
            { es: "Aduana", en: "Customs", tier: 1, tags: ["airport", "signs"], contextEs: "Pasar por aduana", contextEn: "To go through customs", keywords: ["aduana"] },
            { es: "el vuelo", en: "the flight", tier: 1, tags: ["airport"], contextEs: "¿A qué hora sale el vuelo?", contextEn: "What time does the flight leave?", keywords: ["vuelo"] }
          ]
        },
        {
          id: "s4-hear", topic: "Common phrases you'll hear", title: "What locals say to you",
          reward: "You can now understand what's being said TO you. Eavesdropping unlocked. Use responsibly.",
          primer: { scene: "It's not just you talking now. Marina rattles something off as she sets your plate down, the shopkeeper next door calls out as you pass, and you catch the tune but not the words. Time to tune your ear the other way.", mission: "Catch what locals say to you, and know what they mean.", guessItem: "Que aproveche" },
          items: [
            { es: "Que tenga un buen día", en: "Have a good day", tier: 2, tags: ["social", "politeness"], keywords: ["día"] }
          ]
        },
        {
          id: "sp-help", topic: "Problems & emergencies", title: "If something's wrong",
          reward: "The safety net's in place. Now go enjoy Barcelona, you're covered.",
          cultureNote: "The EU emergency number is 112, and they'll find you an English speaker. For minor things, look for the 'farmacia de guardia', the 24-hour pharmacy, marked with a flashing green cross.",
          primer: { scene: "You pat every pocket twice, your wallet's gone. Sra. Rosa, the farmacéutica on the corner, catches your face and asks if you're okay.", mission: "Get help fast, a doctor, the police, or her farmacia.", guessItem: "Es una emergencia" },
          items: [
            { es: "Me han robado", en: "I've been robbed", tier: 2, tags: ["emergency"], keywords: ["robado"] },
            { es: "No me siento bien", en: "I don't feel well", tier: 2, tags: ["emergency", "health"], keywords: ["siento"] },
          ]
        }
      ]
    },

    /* ============================ PASS 2 · COMFORT ============================ */
    {
      id: "sp-p2", pass: 2, title: "Getting comfortable", blurb: "Handle the day, order, pay, get around, check in.",
      lessons: [
        {
          id: "sp-order", topic: "Restaurant · Ordering", title: "Order like a regular",
          reward: "Steak temperature, a caña, 'what do you recommend', you order like a regular now.",
          cultureNote: "A 'caña' is a small draft; a 'doble' is bigger. Before lunch, do as locals do and order a 'vermut', house vermouth on tap, with an olive. Patatas bravas make it official.",
          items: [
            { es: "¿Qué recomienda?", en: "What do you recommend?", tier: 2, tags: ["restaurant", "food"], keywords: ["recomienda"], reply: { es: "La paella está muy buena", en: "The paella is very good" } },
            { es: "Para mí, el filete", en: "For me, the steak", latam: "Latin America: 'el bife' or 'la carne'.", tier: 2, tags: ["restaurant", "food"], keywords: ["filete"] },
            { es: "Poco hecho", en: "Rare (steak)", tier: 2, tags: ["restaurant", "food"], contextEs: "El filete, poco hecho", contextEn: "The steak, rare", keywords: ["hecho"] },
            { es: "Al punto", en: "Medium", tier: 2, tags: ["restaurant", "food"], contextEs: "Lo quiero al punto", contextEn: "I'd like it medium", keywords: ["punto"] },
            { es: "Muy hecho", en: "Well done", tier: 2, tags: ["restaurant", "food"], contextEs: "El filete muy hecho", contextEn: "The steak well done", keywords: ["hecho"] },
            { es: "Agua con gas", en: "Sparkling water", tier: 1, tags: ["drink", "restaurant"], contextEs: "Agua con gas, por favor", contextEn: "Sparkling water, please", keywords: ["agua"] },
            { es: "Una caña, por favor", en: "A small draft beer, please", note: "Very Spain. A 'caña' is a small draft beer.", tier: 2, tags: ["drink"], keywords: ["caña"], variants: ["Ponme una caña"] },
            { es: "Vino tinto", en: "Red wine", tier: 1, tags: ["drink"], contextEs: "Una copa de vino tinto", contextEn: "A glass of red wine", keywords: ["vino", "tinto"] },
            { es: "Para llevar", en: "To go / takeaway", latam: "Also 'para llevar'; Mexico: 'para llevar' too.", tier: 1, tags: ["restaurant", "food"], contextEs: "Es para llevar", contextEn: "It's to take away", keywords: ["llevar"] },
            { es: "Está muy rico", en: "It's delicious", tier: 2, tags: ["food"], keywords: ["rico"], variants: ["Está buenísimo"] }
          ]
        },
        {
          id: "s2-coffee", topic: "Coffee shop", title: "Coffee shop",
          reward: "You can order a cortado and survive a 'cash only' barista. Caffeine: secured.",
          cultureNote: "A 'cortado', espresso cut with a little warm milk, is the local default. Ordering a 'café con leche' after lunch is a tourist tell; locals switch to cortado or solo.",
          items: [
            { es: "Un café con leche, por favor", en: "A coffee with milk, please", tier: 2, tags: ["coffee", "drink"], keywords: ["café", "leche"] },
            { es: "Un cortado, por favor", en: "An espresso with a dash of milk, please", note: "A 'cortado' is espresso 'cut' with a little warm milk, a Spain classic.", tier: 2, tags: ["coffee", "drink"], keywords: ["cortado"] },
            { es: "Un café solo", en: "A black espresso", latam: "Latin America: 'un espresso' / 'un café negro'.", tier: 2, tags: ["coffee", "drink"], keywords: ["café", "solo"] },
            { es: "Un croissant, por favor", en: "A croissant, please", note: "Also spelled 'un cruasán'.", tier: 2, tags: ["coffee", "food"], keywords: ["croissant"] },
            { es: "¿Qué pasteles tienen?", en: "What pastries do you have?", tier: 2, tags: ["coffee", "food"], keywords: ["pasteles"] },
            { es: "¿Para tomar aquí o para llevar?", en: "For here or to take away?", note: "What the barista asks you.", tier: 2, tags: ["coffee"], keywords: ["llevar"], reply: { es: "Para llevar, por favor", en: "To take away, please" } },
            { es: "¿Me puede dar cambio?", en: "Can you give me change?", tier: 2, tags: ["money"], keywords: ["cambio"] },
            { es: "Solo efectivo, el datáfono no funciona", en: "Cash only, the card machine's down", note: "You might hear this, 'datáfono' is the card terminal.", tier: 1, tags: ["money"], keywords: ["efectivo", "datáfono"] }
          ]
        },
        {
          id: "sp-pay", topic: "Restaurant · Paying", title: "Paying & prices",
          reward: "Card, cash, tip, a broken datáfono, the nearest cajero, the bill holds no fear.",
          cultureNote: "Tipping is modest in Spain, round up or leave the coins, never the 15-20% from back home. And you almost always ask for the bill; it won't come until you do.",
          items: [
            { es: "¿Puedo pagar con tarjeta?", en: "Can I pay by card?", tier: 2, tags: ["money"], keywords: ["tarjeta"], variants: ["¿Aceptan tarjeta?"] },
            { es: "¿Aceptan tarjeta?", en: "Do you accept card?", tier: 2, tags: ["money"], keywords: ["tarjeta"], reply: { es: "Sí, sin problema", en: "Yes, no problem" } },
            { es: "El datáfono no funciona", en: "The card machine isn't working", note: "'Datáfono' is the card terminal in Spain.", tier: 2, tags: ["money"], keywords: ["datáfono"] },
            { es: "¿Está incluido el servicio?", en: "Is service included?", note: "Tipping in Spain is small/optional, rounding up is normal.", tier: 2, tags: ["money", "restaurant"], keywords: ["servicio"] },
            { es: "Quédese con el cambio", en: "Keep the change", tier: 2, tags: ["money", "restaurant"], keywords: ["cambio"] },
            { es: "¿Hay un cajero cerca?", en: "Is there an ATM nearby?", note: "Spain: 'cajero' = ATM.", tier: 2, tags: ["money", "directions"], keywords: ["cajero", "cerca"] },
            { es: "una propina", en: "a tip", tier: 1, tags: ["money", "restaurant"], contextEs: "Dejar una propina", contextEn: "To leave a tip", keywords: ["propina"] }
          ]
        },
        {
          id: "sp-time", topic: "Time & Numbers", title: "Telling time",
          reward: "You can ask what time it opens AND understand the answer. Punctuality: optional in Spain.",
          items: [
            { es: "treinta", en: "thirty", tier: 1, tags: ["numbers", "time"], contextEs: "Treinta minutos", contextEn: "Thirty minutes" },
            { es: "¿Qué hora es?", en: "What time is it?", tier: 2, tags: ["time"], keywords: ["hora"], reply: { es: "Son las dos", en: "It's two o'clock" } },
            { es: "Son las dos", en: "It's two o'clock", tier: 1, tags: ["time"], contextEs: "Son las dos de la tarde", contextEn: "It's two in the afternoon", keywords: ["dos"] },
            { es: "a las ocho", en: "at eight", tier: 1, tags: ["time"], contextEs: "Quedamos a las ocho", contextEn: "Let's meet at eight", keywords: ["ocho"] },
          ]
        },
        {
          id: "s3-taxi", topic: "Transport · Taxi", title: "Taxi!",
          reward: "You can tell a driver where to go and when to stop. Backseat fluency achieved.",
          cultureNote: "Barcelona taxis are black-and-yellow and metered, a green rooftop light means free. Apps like Free Now work too. There's a small surcharge from the airport and El Prat.",
          items: [
            { es: "Al aeropuerto, por favor", en: "To the airport, please", tier: 1, tags: ["taxi", "airport"], keywords: ["aeropuerto"] },
            { es: "A esta dirección, por favor", en: "To this address, please", tier: 2, tags: ["taxi", "transport"], keywords: ["dirección"], variants: ["Lléveme a esta dirección"] },
            { es: "¿Cuánto cuesta hasta el centro?", en: "How much to the center?", tier: 2, tags: ["taxi", "money"], keywords: ["cuánto", "centro"], reply: { es: "Unos veinte euros", en: "About twenty euros" } },
            { es: "Pare aquí, por favor", en: "Stop here, please", tier: 2, tags: ["taxi"], keywords: ["pare"], variants: ["Aquí está bien, gracias"] },
            { es: "¿Puede esperar un momento?", en: "Can you wait a moment?", tier: 2, tags: ["taxi"], keywords: ["esperar"] },
            { es: "¿A dónde va?", en: "Where are you going?", note: "What the DRIVER asks you.", tier: 1, tags: ["taxi"], keywords: ["dónde"] },
            { es: "Tengo prisa", en: "I'm in a hurry", tier: 2, tags: ["taxi"], keywords: ["prisa"] },
            { es: "el maletero", en: "the trunk (boot)", latam: "Latin America: 'la cajuela' (Mexico) / 'el baúl'.", tier: 1, tags: ["taxi"], contextEs: "¿Puede abrir el maletero?", contextEn: "Can you open the trunk?", keywords: ["maletero"] }
          ]
        },
        {
          id: "s3-metro", requires: { transport: "metro" },
          topic: "Transport · Metro", title: "Metro",
          reward: "You can buy a T-casual and not ride the wrong line. Barcelona underground: conquered.",
          cultureNote: "The T-casual is 10 rides for one person; the T-usual is unlimited for a set period. Validate on the way in and hold onto the ticket, inspectors do check.",
          items: [
            { es: "¿Dónde está la estación de metro?", en: "Where's the metro station?", tier: 1, tags: ["metro", "transport", "directions"], keywords: ["dónde", "metro"] },
            { es: "una T-casual", en: "a 10-trip travel card", note: "Barcelona's pay-per-ride metro/bus card.", tier: 1, tags: ["metro", "transport"], contextEs: "Una T-casual, por favor", contextEn: "A T-casual, please", keywords: ["casual"] },
            { es: "¿Qué línea va a...?", en: "Which line goes to...?", tier: 2, tags: ["metro", "transport"], keywords: ["línea"] },
            { es: "¿Tengo que hacer transbordo?", en: "Do I have to change lines?", note: "'Transbordo' = changing lines.", tier: 2, tags: ["metro", "transport"], keywords: ["transbordo"] },
            { es: "¿Cuántas paradas faltan?", en: "How many stops are left?", tier: 2, tags: ["metro", "transport"], keywords: ["paradas"] },
            { es: "el andén", en: "the platform", tier: 1, tags: ["metro", "transport"], contextEs: "El tren llega al andén", contextEn: "The train arrives at the platform", keywords: ["andén"] },
            { es: "la salida", en: "the exit", cat: "Catalan sign: 'Sortida'.", tier: 1, tags: ["metro", "signs"], contextEs: "¿Dónde está la salida?", contextEn: "Where's the exit?", keywords: ["salida"] }
          ]
        },
        {
          id: "s3-train", requires: { transport: "train" },
          topic: "Transport · Train", title: "Trains",
          reward: "Platforms, seats, delays, you can ride the AVE like a commuter.",
          items: [
            { es: "¿De qué andén sale el tren?", en: "Which platform does the train leave from?", tier: 2, tags: ["train", "transport"], keywords: ["andén", "tren"] },
            { es: "un billete a Madrid", en: "a ticket to Madrid", latam: "Latin America: 'un boleto'.", tier: 1, tags: ["train", "transport"], contextEs: "Un billete a Madrid, por favor", contextEn: "A ticket to Madrid, please", keywords: ["billete"] },
            { es: "¿Este asiento está libre?", en: "Is this seat free?", tier: 2, tags: ["train"], keywords: ["asiento"] },
            { es: "el AVE", en: "the high-speed train", note: "Spain's high-speed rail.", tier: 1, tags: ["train", "transport"], contextEs: "El AVE a Madrid", contextEn: "The high-speed train to Madrid", keywords: ["ave"] },
            { es: "¿El tren va con retraso?", en: "Is the train delayed?", tier: 2, tags: ["train"], keywords: ["retraso", "tren"] },
            { es: "ida y vuelta", en: "round trip", tier: 2, tags: ["train", "transport"], contextEs: "Un billete de ida y vuelta", contextEn: "A round-trip ticket", keywords: ["vuelta"] },
            { es: "¿Dónde valido el billete?", en: "Where do I validate the ticket?", tier: 2, tags: ["train"], keywords: ["valido", "billete"] }
          ]
        },
        {
          id: "s3-bus", requires: { transport: "bus" },
          topic: "Transport · Bus", title: "Buses",
          reward: "You can flag the right bus and get off at the right stop. No more mystery tours.",
          items: [
            { es: "¿Este autobús va al centro?", en: "Does this bus go downtown?", note: "Spain: 'autobús' / 'el bus'.", tier: 2, tags: ["bus", "transport"], keywords: ["autobús", "centro"] },
            { es: "¿Dónde está la parada?", en: "Where's the bus stop?", tier: 2, tags: ["bus", "directions"], keywords: ["parada"] },
            { es: "¿Cuánto cuesta el billete?", en: "How much is the ticket?", tier: 2, tags: ["bus", "money"], keywords: ["billete"], reply: { es: "Son dos euros con veinte", en: "It's two euros twenty" } },
            { es: "¿Me avisa cuando lleguemos?", en: "Will you let me know when we arrive?", tier: 2, tags: ["bus"], keywords: ["avisa"] },
            { es: "¿Para en...?", en: "Does it stop at...?", tier: 2, tags: ["bus"], contextEs: "¿Para en la playa?", contextEn: "Does it stop at the beach?" },
            { es: "el conductor", en: "the driver", tier: 1, tags: ["bus", "transport"], contextEs: "Pregúntele al conductor", contextEn: "Ask the driver", keywords: ["conductor"] }
          ]
        },
        {
          id: "s3-ferry", requires: { transport: "ferry" },
          topic: "Transport · Ferry", title: "Ferries & boats",
          reward: "Docks, crossings, round-trips, you can board a boat without getting on the wrong one.",
          items: [
            { es: "¿Dónde se compran los billetes del ferry?", en: "Where do you buy ferry tickets?", tier: 2, tags: ["ferry", "transport"], keywords: ["billetes", "ferry"] },
            { es: "¿A qué hora sale el próximo ferry?", en: "What time does the next ferry leave?", tier: 2, tags: ["ferry", "time"], keywords: ["ferry", "hora"] },
            { es: "¿Cuánto dura la travesía?", en: "How long is the crossing?", tier: 2, tags: ["ferry", "transport"], keywords: ["travesía"] },
            { es: "¿Desde qué muelle sale?", en: "Which dock does it leave from?", tier: 2, tags: ["ferry"], keywords: ["muelle"] },
            { es: "un billete de ida y vuelta", en: "a return (round-trip) ticket", tier: 2, tags: ["ferry", "transport"], keywords: ["billete"] },
            { es: "¿Está incluido el equipaje?", en: "Is luggage included?", tier: 2, tags: ["ferry"], keywords: ["equipaje"] },
            { es: "Se mueve mucho", en: "It's rough / it moves a lot", tier: 2, tags: ["ferry"], keywords: ["mueve"] }
          ]
        },
        {
          id: "s4-checkin", topic: "Hotel", title: "Checking in",
          reward: "Check-in, wifi, towels, a broken AC, you run the whole front desk and your room.",
          items: [
            { es: "Tengo una reserva", en: "I have a reservation", note: "Spain: 'reserva'. (Latin America: 'reservación'.)", tier: 2, tags: ["hotel", "lodging"], keywords: ["reserva"] },
            { es: "a nombre de...", en: "under the name of...", tier: 2, tags: ["hotel", "lodging"], contextEs: "A nombre de García", contextEn: "Under the name of García", keywords: ["nombre"] },
            { es: "una habitación doble", en: "a double room", tier: 2, tags: ["hotel", "lodging"], keywords: ["habitación"], variants: ["una doble"] },
            { es: "¿A qué hora es la salida?", en: "What time is checkout?", tier: 2, tags: ["hotel", "time"], keywords: ["hora", "salida"], reply: { es: "A las doce del mediodía", en: "At noon" } },
            { es: "¿El desayuno está incluido?", en: "Is breakfast included?", tier: 2, tags: ["hotel", "food"], keywords: ["desayuno"] },
            { es: "¿Tienen wifi?", en: "Do you have wifi?", tier: 1, tags: ["hotel", "lodging"], contextEs: "¿Tienen wifi en la habitación?", contextEn: "Is there wifi in the room?", keywords: ["wifi"] },
            { es: "¿Puedo dejar las maletas?", en: "Can I leave my bags?", tier: 2, tags: ["hotel", "lodging"], keywords: ["maletas"] },
            { es: "la llave", en: "the key", tier: 1, tags: ["hotel", "lodging"], contextEs: "¿Me da la llave?", contextEn: "Can I have the key?", keywords: ["llave"] },
            { es: "¿Puede limpiar la habitación?", en: "Can you clean the room?", tier: 2, tags: ["hotel", "lodging"], keywords: ["limpiar", "habitación"] },
            { es: "Necesito más toallas", en: "I need more towels", tier: 2, tags: ["hotel", "lodging"], keywords: ["toallas"] },
            { es: "¿Puede traer otra almohada?", en: "Can you bring another pillow?", tier: 2, tags: ["hotel", "lodging"], keywords: ["almohada"] },
            { es: "No molestar", en: "Do not disturb (sign)", tier: 1, tags: ["hotel", "signs"], contextEs: "El cartel de 'no molestar'", contextEn: "The 'do not disturb' sign", keywords: ["molestar"] },
            { es: "El aire acondicionado no funciona", en: "The AC isn't working", tier: 2, tags: ["hotel", "lodging"], keywords: ["aire"] },
            { es: "el papel higiénico", en: "toilet paper", note: "Spain: 'papel higiénico'.", tier: 1, tags: ["hotel", "bathroom"], contextEs: "No hay papel higiénico", contextEn: "There's no toilet paper", keywords: ["papel"] },
            { es: "jabón", en: "soap", tier: 1, tags: ["hotel", "bathroom"], contextEs: "No hay jabón", contextEn: "There's no soap", keywords: ["jabón"] },
            { es: "Muchas gracias por todo", en: "Thank you very much for everything", note: "Cleaning staff appreciate it, and a small tip.", tier: 2, tags: ["politeness"] }
          ]
        },
        {
          id: "s4-airbnb", requires: { lodging: "airbnb" },
          topic: "Airbnb / apartment", title: "Your Airbnb",
          reward: "Keys, wifi, trash day, the lockbox that won't open, you can handle a host like a pro.",
          items: [
            { es: "¿Dónde recojo las llaves?", en: "Where do I pick up the keys?", tier: 2, tags: ["lodging"], keywords: ["llaves"] },
            { es: "¿Cuál es la contraseña del wifi?", en: "What's the wifi password?", tier: 2, tags: ["lodging"], keywords: ["contraseña", "wifi"] },
            { es: "¿Cómo funciona la calefacción?", en: "How does the heating work?", tier: 2, tags: ["lodging"], keywords: ["calefacción"] },
            { es: "¿Dónde se tira la basura?", en: "Where do I take out the trash?", tier: 2, tags: ["lodging"], keywords: ["basura"] },
            { es: "La caja de seguridad no abre", en: "The lockbox won't open", tier: 3, tags: ["lodging"], keywords: ["caja", "abre"] },
            { es: "No hay agua caliente", en: "There's no hot water", tier: 2, tags: ["lodging"], keywords: ["agua", "caliente"] },
            { es: "¿A qué hora tengo que salir?", en: "What time do I have to check out?", tier: 2, tags: ["lodging", "time"], keywords: ["hora", "salir"] },
            { es: "¿Me puede dar la dirección exacta?", en: "Can you give me the exact address?", tier: 2, tags: ["lodging", "directions"], keywords: ["dirección"] }
          ]
        },
        {
          id: "s4-landmarks", topic: "Landmarks", title: "Sightseeing",
          reward: "Two tickets to the Sagrada Família, please, and you said it in Spanish. Gaudí is proud.",
          cultureNote: "Book the Sagrada Família online days ahead, the on-site queue can eat your afternoon. Same for Park Güell. Go early or near closing to dodge the crowds.",
          items: [
            { es: "¿A qué hora abre la Sagrada Família?", en: "What time does the Sagrada Família open?", tier: 2, tags: ["sights", "time"], keywords: ["hora", "abre"] },
            { es: "dos entradas, por favor", en: "two tickets, please", tier: 2, tags: ["sights"], keywords: ["entradas"] },
            { es: "¿Hay que reservar?", en: "Do you have to book in advance?", tier: 2, tags: ["sights"], keywords: ["reservar"] },
            { es: "¿Dónde está la taquilla?", en: "Where is the ticket office?", note: "'Taquilla' = ticket window.", tier: 2, tags: ["sights", "directions"], keywords: ["taquilla"] },
            { es: "¿Se pueden hacer fotos?", en: "Can you take photos?", tier: 2, tags: ["sights"], keywords: ["fotos"] },
            { es: "la cola", en: "the queue / line", note: "Spain: 'la cola' = the line/queue.", tier: 1, tags: ["sights"], contextEs: "Hay que hacer cola", contextEn: "You have to wait in line", keywords: ["cola"] },
            { es: "el casco antiguo", en: "the old town", tier: 2, tags: ["sights", "directions"], keywords: ["casco"] },
            { es: "¿Está abierto los domingos?", en: "Is it open on Sundays?", tier: 2, tags: ["sights", "time"], keywords: ["abierto", "domingos"] }
          ]
        },
        {
          id: "s3-plane", bonus: true, topic: "Transport · On the plane", title: "On the plane",
          reward: "Chicken or pasta, juice or wine, you can now run the whole drinks cart in Spanish.",
          items: [
            { es: "¿Pollo o pasta?", en: "Chicken or pasta?", note: "What the flight attendant asks you.", tier: 2, tags: ["plane", "food"], keywords: ["pollo", "pasta"] },
            { es: "Pollo, por favor", en: "Chicken, please", tier: 1, tags: ["plane", "food"], contextEs: "Pollo, por favor, gracias", contextEn: "Chicken, please, thank you", keywords: ["pollo"] },
            { es: "Pasta, por favor", en: "Pasta, please", tier: 1, tags: ["plane", "food"], contextEs: "Pasta, por favor", contextEn: "Pasta, please", keywords: ["pasta"] },
            { es: "¿Para beber?", en: "Anything to drink?", note: "What they ask you.", tier: 2, tags: ["plane", "drink"], keywords: ["beber"], reply: { es: "Un zumo, por favor", en: "A juice, please" } },
            { es: "Un zumo de naranja", en: "An orange juice", latam: "Latin America: 'un jugo de naranja'.", tier: 2, tags: ["drink"], keywords: ["zumo"] },
            { es: "Una copa de vino tinto", en: "A glass of red wine", tier: 2, tags: ["drink"], keywords: ["vino", "tinto"] },
            { es: "Un café, por favor", en: "A coffee, please", tier: 1, tags: ["plane", "drink"], contextEs: "Un café con leche, por favor", contextEn: "A coffee with milk, please", keywords: ["café"] },
            { es: "¿Me puede dar una manta?", en: "Can I have a blanket?", tier: 2, tags: ["plane"], keywords: ["manta"] }
          ]
        }
      ]
    },

    /* ============================ PASS 3 · FLUENT ============================ */
    {
      id: "sp-p3", pass: 3, title: "Like a local", blurb: "The trip you'd have if you spoke Spanish.",
      lessons: [
        {
          id: "s5-real", topic: "Advanced · Real situations", title: "Real conversations",
          reward: "Look at you, full sentences now. People might mistake you for someone who lives here.",
          items: [
            { es: "¿Podría recomendarme un plato típico de aquí?", en: "Could you recommend a typical local dish?", tier: 3, tags: ["restaurant", "food"], difficulty: 4, keywords: ["plato", "típico"] },
            { es: "Disculpe, creo que hay un error en la cuenta", en: "Excuse me, I think there's a mistake on the bill", tier: 3, tags: ["restaurant", "money"], difficulty: 4, keywords: ["error", "cuenta"], chunks: [["Disculpe", "excuse me"], ["creo que hay", "I think there's", "new"], ["un error", "a mistake"], ["en la cuenta", "on the bill"]] },
            { es: "¿A qué hora cierra la cocina?", en: "What time does the kitchen close?", tier: 3, tags: ["restaurant", "time"], difficulty: 3, keywords: ["hora", "cocina"] },
            { es: "Estamos buscando un sitio para cenar cerca de aquí", en: "We're looking for somewhere to have dinner near here", tier: 3, tags: ["restaurant", "directions"], difficulty: 4, keywords: ["buscando", "cenar", "cerca"], chunks: [["Estamos buscando", "we're looking for"], ["un sitio para cenar", "a place to have dinner", "new"], ["cerca de aquí", "near here"]] },
            { es: "Perdone, ¿este tren va al centro?", en: "Excuse me, does this train go to the center?", tier: 3, tags: ["train", "transport"], difficulty: 3, keywords: ["tren", "centro"] },
            { es: "¿Sería posible cambiar de habitación?", en: "Would it be possible to change rooms?", tier: 3, tags: ["hotel", "lodging"], difficulty: 4, keywords: ["cambiar", "habitación"] }
          ]
        },
        {
          id: "s5-fix", topic: "Advanced · When things go wrong", title: "Complaints & mix-ups",
          reward: "Lost, overcharged, double-booked, you can talk your way out of it. Travel boss mode.",
          items: [
            { es: "Reservé una habitación pero no aparece", en: "I booked a room but it's not showing up", tier: 3, tags: ["hotel", "lodging"], difficulty: 4, keywords: ["reservé", "aparece"] },
            { es: "Creo que me he perdido, ¿me puede ayudar?", en: "I think I'm lost, can you help me?", tier: 3, tags: ["directions", "emergency"], difficulty: 3, keywords: ["perdido", "ayudar"], chunks: [["Creo que me he perdido", "I think I'm lost", "new"], ["¿me puede ayudar?", "can you help me?"]] },
            { es: "Se me ha olvidado la cartera en el taxi", en: "I left my wallet in the taxi", tier: 3, tags: ["taxi", "emergency"], difficulty: 4, keywords: ["cartera", "taxi"], chunks: [["Se me ha olvidado", "I've left", "new"], ["la cartera", "my wallet"], ["en el taxi", "in the taxi"]] },
            { es: "¿Puede llamar a un médico, por favor?", en: "Can you call a doctor, please?", tier: 3, tags: ["emergency", "health"], difficulty: 3, keywords: ["llamar", "médico"] },
            { es: "Esto no es lo que he pedido", en: "This isn't what I ordered", tier: 2, tags: ["restaurant"], keywords: ["pedido"] },
            { es: "¿Dónde está la comisaría más cercana?", en: "Where's the nearest police station?", note: "Spain: 'comisaría' = police station.", tier: 3, tags: ["emergency", "directions"], difficulty: 4, keywords: ["comisaría", "cercana"] }
          ]
        },
        {
          id: "sp-chain-dinner", topic: "Advanced · Boss", title: "Dinner at Marina's",
          reward: "Greeting to bill, you ran a whole dinner at the tasca without switching to English. That's the trip, rehearsed.",
          cultureNote: "In a tasca you don't wait to be seated formally, you catch Marina's eye and she waves you to a table. And when your plate lands, 'que aproveche' is the local 'enjoy', say it back to the next table over.",
          items: [],
          chain: {
            title: "Dinner at Marina's",
            turns: [
              { npc: { es: "¡Buenas noches! ¿Mesa para cuántos?", en: "Good evening! Table for how many?" } },
              { user: "Una mesa para dos, por favor" },
              { npc: { es: "Perfecto, sentaos aquí. Enseguida os traigo la carta.", en: "Perfect, sit here. I'll bring the menu right over." } },
              { user: "La carta, por favor" },
              { npc: { es: "Aquí tenéis. Hoy el pulpo está espectacular.", en: "Here you go. The octopus is spectacular today." } },
              { user: "¿Qué recomienda?" },
              { npc: { es: "El filete a la brasa, sin duda.", en: "The grilled steak, no question." } },
              { user: "Para mí, el filete" },
              { npc: { es: "Muy bien. ¿Y para beber?", en: "Very good. And to drink?" } },
              { user: "Una caña, por favor" },
              { npc: { es: "Marchando. Que aproveche.", en: "Coming right up. Enjoy your meal." } },
              { user: "La cuenta, por favor" },
              { npc: { es: "Enseguida. Son treinta euros.", en: "Right away. That's thirty euros." } },
              { user: "¿Aceptan tarjeta?" },
              { npc: { es: "Claro que sí. ¡Buenas noches!", en: "Of course. Good night!" } }
            ]
          }
        },
        {
          id: "sp-chain-lastnight", topic: "Advanced · Capstone", title: "Your last night",
          reward: "That was the whole trip in one evening, greeting, ordering, an allergy, a mix-up, paying, goodbyes. You didn't switch to English once. You're ready for Barcelona.",
          cultureNote: "When someone says 'buen viaje,' the warm reply is 'gracias, hasta la próxima', 'until next time', even if you both know it may be a while. In Catalonia you'll also hear 'adéu' for goodbye; 'adéu-siau' is the fond, old-fashioned version.",
          items: [],
          chain: {
            title: "Your last night",
            turns: [
              { narr: "Your last night in Barcelona. Jordi dropped you near Plaça Reial, and your feet carried you back to Marina's tasca, one more time." },
              { npc: { es: "¡Buenas noches! Tu última noche, ¿verdad? Pasa, pasa.", en: "Good evening! Your last night, right? Come in, come in." } },
              { user: "Buenas noches" },
              { npc: { es: "Siéntate. ¿Qué te pongo esta vez?", en: "Sit down. What can I get you this time?" } },
              { user: "¿Qué recomienda?" },
              { npc: { es: "Las gambas al ajillo, para despedirte bien.", en: "The garlic prawns, a proper goodbye." } },
              { user: "Soy alérgico al marisco" },
              { npc: { es: "¡Ay, es verdad! Perdona. Entonces el filete. ¿Y de beber?", en: "Oh, that's right! Sorry. The steak, then. And to drink?" } },
              { user: "Una caña, por favor" },
              { npc: { es: "Marchando.", en: "Coming right up." } },
              { npc: { es: "…Aquí tienes tu plato.", en: "…Here's your dish." } },
              { user: "Esto no es lo que he pedido" },
              { npc: { es: "¡Uy! Perdona, ahora mismo te lo cambio.", en: "Oops! Sorry, I'll change it right now." } },
              { user: "La cuenta, por favor" },
              { npc: { es: "Claro. Son veinticinco euros.", en: "Of course. That's twenty-five euros." } },
              { user: "¿Aceptan tarjeta?" },
              { npc: { es: "Por supuesto. Gracias por venir todos estos días.", en: "Of course. Thank you for coming all these days." } },
              { user: "Muchas gracias por todo" },
              { npc: { es: "Que te vaya muy bien. ¡Buen viaje!", en: "Take good care. Have a good trip!" } },
              { narr: "On your way home, Toni waves you over to the vermutería, one last vermut, on the house." },
              { npc: { es: "¡Campeón! La última, invita la casa.", en: "Champ! The last one's on the house." } },
              { user: "Está muy rico" },
              { npc: { es: "¡Salud! Vuelve pronto a Barcelona.", en: "Cheers! Come back to Barcelona soon." } }
            ]
          }
        }
      ]
    }
  ]
};

/* =========================================================================
   EXPANSION DATA — allergens + lodging/transport options for onboarding.
   (Conditional transport/lodging lessons now live inline above with `requires`.)
   ========================================================================= */

/* Allergens — used to generate a personalized "Your Allergies" lesson.
   `frag` is the grammatically-correct bit after "Soy alérgico ___". */
const ALLERGENS = [
  { key: "gluten",    en: "gluten",    frag: "al gluten" },
  { key: "nuts",      en: "nuts",      frag: "a los frutos secos" },
  { key: "peanuts",   en: "peanuts",   frag: "a los cacahuetes" },
  { key: "shellfish", en: "shellfish", frag: "al marisco" },
  { key: "dairy",     en: "dairy",     frag: "a los lácteos" },
  { key: "eggs",      en: "eggs",      frag: "al huevo" },
  { key: "fish",      en: "fish",      frag: "al pescado" },
  { key: "soy",       en: "soy",       frag: "a la soja" }
];

const LODGING_OPTIONS = [
  { key: "hotel",  label: "Hotel" },
  { key: "airbnb", label: "Airbnb / apartment" }
];

const TRANSPORT_OPTIONS = [
  { key: "metro", label: "Metro" },
  { key: "train", label: "Train (Renfe / AVE)" },
  { key: "bus",   label: "Bus" },
  { key: "ferry", label: "Ferry / boat" }
];

if (typeof module !== "undefined") {
  module.exports = { CURRICULUM, ALLERGENS, LODGING_OPTIONS, TRANSPORT_OPTIONS };
}
