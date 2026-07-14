/* =========================================================================
   CURRICULUM  —  Castilian Spanish (Barcelona), travel-phrases-first.
   Each lesson is just a list of phrase "items"; app.js auto-generates the
   exercises (multiple-choice, tap-to-build, match) from these.
   item = { es, en, note?, latam?, cat? }
     note  : usage tip
     latam : how it differs in Latin America
     cat   : the Catalan you'll see on Barcelona signs/menus
   Stages get harder, but each stage spreads ACROSS topics on purpose.
   ========================================================================= */

const CURRICULUM = {
  stages: [
    /* ---------------------------------------------------------------- */
    {
      id: "s1",
      title: "Survival Kit",
      blurb: "The 30 words that keep you alive on day one.",
      lessons: [
        {
          id: "s1-hello",
          topic: "Basics",
          title: "Hello & Polite",
          reward: "Look at you go — you can now greet a waiter without pointing. Diplomatic immunity pending.",
          items: [
            { es: "Hola", en: "Hello", tier: 1, tags: ["greetings"], contextEs: "Hola, buenos días", contextEn: "Hi, good morning" },
            { es: "Buenos días", en: "Good morning", tier: 1, tags: ["greetings"], contextEs: "Buenos días, ¿qué tal?", contextEn: "Good morning, how are you?", keywords: ["días"] },
            { es: "Buenas tardes", en: "Good afternoon", tier: 1, tags: ["greetings"], contextEs: "Buenas tardes, señor", contextEn: "Good afternoon, sir", keywords: ["tardes"] },
            { es: "Buenas noches", en: "Good evening / night", tier: 1, tags: ["greetings"], contextEs: "Buenas noches, hasta mañana", contextEn: "Good night, see you tomorrow", keywords: ["noches"] },
            { es: "Por favor", en: "Please", tier: 1, tags: ["politeness"], contextEs: "Un café, por favor", contextEn: "A coffee, please", keywords: ["por favor"] },
            { es: "Gracias", en: "Thank you", tier: 1, tags: ["politeness"], contextEs: "Muchas gracias por todo", contextEn: "Thank you very much for everything", anchor: "Think: 'gratitude.'", variants: ["Muchas gracias"], reply: { es: "De nada", en: "You're welcome" } },
            { es: "De nada", en: "You're welcome", tier: 1, tags: ["politeness"], contextEs: "—Gracias. —De nada.", contextEn: "—Thanks. —You're welcome." },
            { es: "Perdón", en: "Excuse me / Sorry", tier: 1, tags: ["politeness"], contextEs: "Perdón, ¿me ayuda?", contextEn: "Excuse me, can you help me?", keywords: ["perdón"] },
            { es: "Sí", en: "Yes", tier: 1, tags: ["basics"], contextEs: "Sí, por favor", contextEn: "Yes, please" },
            { es: "No", en: "No", tier: 1, tags: ["basics"], contextEs: "No, gracias", contextEn: "No, thanks" }
          ]
        },
        {
          id: "s1-rescue",
          topic: "How do you say",
          title: "I Only Speak a Little",
          reward: "Now you can confess your Spanish is bad — in Spanish. Meta. Keep going so you don't have to.",
          items: [
            { es: "Hablo solo un poco de español", en: "I only speak a little Spanish", tier: 2, tags: ["communication"], keywords: ["español"] },
            { es: "No entiendo", en: "I don't understand", tier: 1, tags: ["communication"], contextEs: "Perdón, no entiendo bien", contextEn: "Sorry, I don't understand well", keywords: ["entiendo"] },
            { es: "¿Habla inglés?", en: "Do you speak English?", note: "Formal (usted). Polite default with strangers.", tier: 1, tags: ["communication"], contextEs: "Perdone, ¿habla inglés?", contextEn: "Excuse me, do you speak English?", anchor: "'inglés' = English.", keywords: ["inglés"] },
            { es: "¿Cómo se dice...?", en: "How do you say...?", tier: 2, tags: ["communication"], keywords: ["dice"] },
            { es: "¿Puede repetir, por favor?", en: "Can you repeat that, please?", tier: 2, tags: ["communication"], keywords: ["repetir"], variants: ["¿Me lo repite, por favor?"] },
            { es: "Más despacio, por favor", en: "Slower, please", tier: 2, tags: ["communication"], keywords: ["despacio"] },
            { es: "¿Qué significa?", en: "What does it mean?", tier: 2, tags: ["communication"], contextEs: "¿Qué significa esta palabra?", contextEn: "What does this word mean?", keywords: ["significa"] },
            { es: "No lo sé", en: "I don't know", tier: 1, tags: ["communication"], contextEs: "No lo sé, lo siento", contextEn: "I don't know, sorry" }
          ]
        },
        {
          id: "s1-numbers1",
          topic: "Numbers",
          title: "Numbers 1–10",
          reward: "You can count to ten. That's enough fingers to order tapas for the whole table.",
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
            { es: "¿Cuánto cuesta?", en: "How much is it?", tier: 2, tags: ["money", "shopping"], keywords: ["cuánto", "cuesta"], variants: ["¿Qué precio tiene?"], reply: { es: "Son cinco euros", en: "It's five euros" } }
          ]
        },
        {
          id: "s1-order",
          topic: "Restaurant · Ordering",
          title: "Yes, Chef",
          reward: "You can now say 'I'll have the steak' and 'still water.' Maybe after 50 more you'll order it at the right temperature.",
          items: [
            { es: "Una mesa para dos, por favor", en: "A table for two, please", tier: 2, tags: ["restaurant", "food"], keywords: ["mesa"], variants: ["Mesa para dos, por favor"] },
            { es: "La carta, por favor", en: "The menu, please", note: "In Spain 'la carta' = the menu. 'El menú' usually means the fixed menú del día.", tier: 2, tags: ["restaurant", "food"], keywords: ["carta"], variants: ["¿Me trae la carta?"] },
            { es: "Para mí, el filete", en: "For me, the steak", latam: "Latin America: 'el bife' or 'la carne'.", tier: 2, tags: ["restaurant", "food"], keywords: ["filete"] },
            { es: "Agua sin gas", en: "Still water (no bubbles)", tier: 1, tags: ["drink", "restaurant"], contextEs: "Una botella de agua sin gas", contextEn: "A bottle of still water", keywords: ["agua"] },
            { es: "Agua con gas", en: "Sparkling water", tier: 1, tags: ["drink", "restaurant"], contextEs: "Agua con gas, por favor", contextEn: "Sparkling water, please", keywords: ["agua"] },
            { es: "Una caña, por favor", en: "A small draft beer, please", note: "Very Spain. A 'caña' is a small draft beer.", tier: 2, tags: ["drink"], keywords: ["caña"], variants: ["Ponme una caña"] },
            { es: "La cuenta, por favor", en: "The check, please", tier: 2, tags: ["restaurant", "money"], keywords: ["cuenta"], variants: ["¿Me trae la cuenta?"] },
            { es: "Está muy rico", en: "It's delicious", tier: 2, tags: ["food"], keywords: ["rico"], variants: ["Está buenísimo"] }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "s2",
      title: "Out & About",
      blurb: "Eat, pee, pay, and tell the time. The four pillars of travel.",
      lessons: [
        {
          id: "s2-table",
          topic: "Restaurant · Ordering",
          title: "At the Table",
          reward: "Wow — now you can order your steak 'al punto' and warn them about your shellfish allergy. Survival level: rising.",
          items: [
            { es: "¿Qué recomienda?", en: "What do you recommend?" },
            { es: "Poco hecho", en: "Rare (steak)" },
            { es: "Al punto", en: "Medium" },
            { es: "Muy hecho", en: "Well done" },
            { es: "Soy alérgico al marisco", en: "I'm allergic to shellfish" },
            { es: "Sin gluten", en: "Gluten-free" },
            { es: "Vino tinto", en: "Red wine" },
            { es: "Para llevar", en: "To go / takeaway", latam: "Also 'para llevar'; Mexico: 'para llevar' too." }
          ]
        },
        {
          id: "s2-bathroom",
          topic: "Restaurant · Bathrooms",
          title: "Where's the Loo",
          reward: "You can find a bathroom and read a door. Push vs. pull humiliation: avoided.",
          items: [
            { es: "¿Dónde está el servicio?", en: "Where is the bathroom?", note: "Spain says 'el servicio / los servicios'. Signs read 'Aseos'." , latam: "Latin America: '¿Dónde está el baño?'" },
            { es: "los aseos", en: "the restrooms (sign)" },
            { es: "Caballeros", en: "Men (sign)" },
            { es: "Señoras", en: "Women (sign)" },
            { es: "Salida", en: "Exit", cat: "Catalan sign: 'Sortida'." },
            { es: "Entrada", en: "Entrance", cat: "Catalan sign: 'Entrada'." },
            { es: "Empujar", en: "Push (sign)" },
            { es: "Tirar", en: "Pull (sign)", note: "On doors 'Tirar' = pull. Confusingly it also means 'to throw'." }
          ]
        },
        {
          id: "s2-pay",
          topic: "Restaurant · Paying",
          title: "Paying Up",
          reward: "You can pay by card, in cash, and survive a broken card machine. The economy thanks you.",
          items: [
            { es: "¿Puedo pagar con tarjeta?", en: "Can I pay by card?" },
            { es: "En efectivo", en: "In cash" },
            { es: "¿Aceptan tarjeta?", en: "Do you accept card?" },
            { es: "El datáfono no funciona", en: "The card machine isn't working", note: "'Datáfono' is the card terminal in Spain." },
            { es: "¿Está incluido el servicio?", en: "Is service included?", note: "Tipping in Spain is small/optional — rounding up is normal." },
            { es: "Quédese con el cambio", en: "Keep the change" },
            { es: "¿Hay un cajero cerca?", en: "Is there an ATM nearby?" },
            { es: "una propina", en: "a tip" }
          ]
        },
        {
          id: "s2-time",
          topic: "Time & Numbers",
          title: "Numbers & Time",
          reward: "You can ask what time the thing opens AND understand the answer. Punctuality unlocked (optional in Spain).",
          items: [
            { es: "veinte", en: "twenty" },
            { es: "treinta", en: "thirty" },
            { es: "cincuenta", en: "fifty" },
            { es: "cien", en: "one hundred" },
            { es: "¿Qué hora es?", en: "What time is it?" },
            { es: "Son las dos", en: "It's two o'clock" },
            { es: "a las ocho", en: "at eight" },
            { es: "¿A qué hora abre?", en: "What time does it open?" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "s3",
      title: "On the Move",
      blurb: "Taxis, airport signs, and asking the way without a map.",
      lessons: [
        {
          id: "s3-taxi",
          topic: "Transport · Taxi",
          title: "Taxi!",
          reward: "You can tell a driver where to go and when to stop. Backseat fluency achieved.",
          items: [
            { es: "Al aeropuerto, por favor", en: "To the airport, please" },
            { es: "A esta dirección, por favor", en: "To this address, please" },
            { es: "¿Cuánto cuesta hasta el centro?", en: "How much to the center?" },
            { es: "Pare aquí, por favor", en: "Stop here, please" },
            { es: "¿Puede esperar un momento?", en: "Can you wait a moment?" },
            { es: "¿A dónde va?", en: "Where are you going?", note: "What the DRIVER asks you." },
            { es: "Tengo prisa", en: "I'm in a hurry" },
            { es: "el maletero", en: "the trunk (boot)", latam: "Latin America: 'la cajuela' (Mexico) / 'el baúl'." }
          ]
        },
        {
          id: "s3-airport",
          topic: "Transport · Airport signs",
          title: "Reading the Airport",
          reward: "Arrivals, departures, your gate — all decoded. You will not miss the flight because of a sign.",
          items: [
            { es: "Salidas", en: "Departures", cat: "Catalan: 'Sortides'." },
            { es: "Llegadas", en: "Arrivals", cat: "Catalan: 'Arribades'." },
            { es: "Puerta de embarque", en: "Boarding gate" },
            { es: "Facturación", en: "Check-in (bag drop)", latam: "Latin America: 'registro' / 'check-in'." },
            { es: "Recogida de equipajes", en: "Baggage claim" },
            { es: "Control de seguridad", en: "Security control" },
            { es: "Aduana", en: "Customs" },
            { es: "el vuelo", en: "the flight" }
          ]
        },
        {
          id: "s3-directions",
          topic: "Walking directions",
          title: "How Do I Get To…",
          reward: "Left, right, straight ahead — you can now get lost on purpose. Gaudí's buildings await.",
          items: [
            { es: "¿Cómo llego a...?", en: "How do I get to...?" },
            { es: "a la derecha", en: "to the right" },
            { es: "a la izquierda", en: "to the left" },
            { es: "todo recto", en: "straight ahead", latam: "Latin America: 'todo derecho' / 'derecho'." },
            { es: "¿Está lejos?", en: "Is it far?" },
            { es: "cerca", en: "near" },
            { es: "la esquina", en: "the corner" },
            { es: "la plaza", en: "the square" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "s4",
      title: "Hotel & Sights",
      blurb: "Check in, charm the cleaning staff, and conquer the landmarks.",
      lessons: [
        {
          id: "s4-checkin",
          topic: "Hotel",
          title: "Check In / Out",
          reward: "You can claim your reservation and ask about checkout. The front desk respects you now.",
          items: [
            { es: "Tengo una reserva", en: "I have a reservation" },
            { es: "a nombre de...", en: "under the name of..." },
            { es: "una habitación doble", en: "a double room" },
            { es: "¿A qué hora es la salida?", en: "What time is checkout?" },
            { es: "¿El desayuno está incluido?", en: "Is breakfast included?" },
            { es: "¿Tienen wifi?", en: "Do you have wifi?" },
            { es: "¿Puedo dejar las maletas?", en: "Can I leave my bags?" },
            { es: "la llave", en: "the key" }
          ]
        },
        {
          id: "s4-room",
          topic: "Hotel · Cleaning staff",
          title: "Towels & Pillows",
          reward: "Wow — now you can ask for another mint for your pillow. Or at least a clean towel. Baby steps.",
          items: [
            { es: "¿Puede limpiar la habitación?", en: "Can you clean the room?" },
            { es: "Necesito más toallas", en: "I need more towels" },
            { es: "¿Puede traer otra almohada?", en: "Can you bring another pillow?" },
            { es: "No molestar", en: "Do not disturb (sign)" },
            { es: "El aire acondicionado no funciona", en: "The AC isn't working" },
            { es: "el papel higiénico", en: "toilet paper" },
            { es: "jabón", en: "soap" },
            { es: "Muchas gracias por todo", en: "Thank you very much for everything", note: "Cleaning staff appreciate it — and a small tip." }
          ]
        },
        {
          id: "s4-landmarks",
          topic: "Landmarks",
          title: "Sightseeing",
          reward: "Two tickets to the Sagrada Família, please — and you said it in Spanish. Gaudí is proud.",
          items: [
            { es: "¿A qué hora abre la Sagrada Família?", en: "What time does the Sagrada Família open?" },
            { es: "dos entradas, por favor", en: "two tickets, please" },
            { es: "¿Hay que reservar?", en: "Do you have to book in advance?" },
            { es: "¿Dónde está la taquilla?", en: "Where is the ticket office?" },
            { es: "¿Se pueden hacer fotos?", en: "Can you take photos?" },
            { es: "la cola", en: "the queue / line" },
            { es: "el casco antiguo", en: "the old town" },
            { es: "¿Está abierto los domingos?", en: "Is it open on Sundays?" }
          ]
        },
        {
          id: "s4-hear",
          topic: "Common phrases you'll hear",
          title: "Things They'll Say to You",
          reward: "You can now understand what's being said TO you. Eavesdropping unlocked. Use responsibly.",
          items: [
            { es: "¿Algo más?", en: "Anything else?" },
            { es: "Aquí tiene", en: "Here you go" },
            { es: "Un momento", en: "One moment" },
            { es: "¿Está todo bien?", en: "Is everything okay?" },
            { es: "Que aproveche", en: "Enjoy your meal", note: "Spain's 'bon appétit'." },
            { es: "Dígame", en: "Go ahead / Tell me", note: "Shopkeepers & phone calls say this to mean 'how can I help?'" },
            { es: "Pase, pase", en: "Come in / Go ahead" },
            { es: "Que tenga un buen día", en: "Have a good day" }
          ]
        }
      ]
    }
  ]
};

/* =========================================================================
   EXPANSION  —  extra core lessons, conditional (profile-gated) lessons,
   a harder "Level Up" stage, and the data used by the intro onboarding.
   Lessons tagged with `requires` only appear if the user's profile matches.
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

(function expandCurriculum() {
  const byId = id => CURRICULUM.stages.find(s => s.id === id);

  /* ---- Coffee shop (core, everyone) → Out & About ---- */
  byId("s2").lessons.push({
    id: "s2-coffee",
    topic: "Coffee shop",
    title: "Coffee Shop",
    reward: "You can order a cortado and survive a 'cash only' barista. Caffeine: secured.",
    items: [
      { es: "Un café con leche, por favor", en: "A coffee with milk, please" },
      { es: "Un cortado, por favor", en: "An espresso with a dash of milk, please", note: "A 'cortado' is espresso 'cut' with a little warm milk — a Spain classic." },
      { es: "Un café solo", en: "A black espresso", latam: "Latin America: 'un espresso' / 'un café negro'." },
      { es: "Un croissant, por favor", en: "A croissant, please", note: "Also spelled 'un cruasán'." },
      { es: "¿Qué pasteles tienen?", en: "What pastries do you have?" },
      { es: "¿Para tomar aquí o para llevar?", en: "For here or to take away?", note: "What the barista asks you." },
      { es: "¿Me puede dar cambio?", en: "Can you give me change?" },
      { es: "Solo efectivo, el datáfono no funciona", en: "Cash only, the card machine's down", note: "You might hear this — 'datáfono' is the card terminal." }
    ]
  });

  /* ---- On the plane / flight attendant (core) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-plane",
    topic: "Transport · On the plane",
    title: "On the Plane",
    reward: "Chicken or pasta, juice or wine — you can now run the whole drinks cart in Spanish.",
    items: [
      { es: "¿Pollo o pasta?", en: "Chicken or pasta?", note: "What the flight attendant asks you." },
      { es: "Pollo, por favor", en: "Chicken, please" },
      { es: "Pasta, por favor", en: "Pasta, please" },
      { es: "¿Para beber?", en: "Anything to drink?", note: "What they ask you." },
      { es: "Un zumo de naranja", en: "An orange juice", latam: "Latin America: 'un jugo de naranja'." },
      { es: "Una copa de vino tinto", en: "A glass of red wine" },
      { es: "Un café, por favor", en: "A coffee, please" },
      { es: "¿Me puede dar una manta?", en: "Can I have a blanket?" }
    ]
  });

  /* ---- Conditional: Metro (transport: metro) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-metro", requires: { transport: "metro" },
    topic: "Transport · Metro",
    title: "Metro",
    reward: "You can buy a T-casual and not ride the wrong line. Barcelona underground: conquered.",
    items: [
      { es: "¿Dónde está la estación de metro?", en: "Where's the metro station?" },
      { es: "una T-casual", en: "a 10-trip travel card", note: "Barcelona's pay-per-ride metro/bus card." },
      { es: "¿Qué línea va a...?", en: "Which line goes to...?" },
      { es: "¿Tengo que hacer transbordo?", en: "Do I have to change lines?" },
      { es: "¿Cuántas paradas faltan?", en: "How many stops are left?" },
      { es: "el andén", en: "the platform" },
      { es: "la salida", en: "the exit", cat: "Catalan sign: 'Sortida'." }
    ]
  });

  /* ---- Conditional: Train (transport: train) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-train", requires: { transport: "train" },
    topic: "Transport · Train",
    title: "Trains",
    reward: "Platforms, seats, delays — you can ride the AVE like a commuter.",
    items: [
      { es: "¿De qué andén sale el tren?", en: "Which platform does the train leave from?" },
      { es: "un billete a Madrid", en: "a ticket to Madrid", latam: "Latin America: 'un boleto'." },
      { es: "¿Este asiento está libre?", en: "Is this seat free?" },
      { es: "el AVE", en: "the high-speed train", note: "Spain's high-speed rail." },
      { es: "¿El tren va con retraso?", en: "Is the train delayed?" },
      { es: "ida y vuelta", en: "round trip" },
      { es: "¿Dónde valido el billete?", en: "Where do I validate the ticket?" }
    ]
  });

  /* ---- Conditional: Bus (transport: bus) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-bus", requires: { transport: "bus" },
    topic: "Transport · Bus",
    title: "Buses",
    reward: "You can flag the right bus and get off at the right stop. No more mystery tours.",
    items: [
      { es: "¿Este autobús va al centro?", en: "Does this bus go downtown?" },
      { es: "¿Dónde está la parada?", en: "Where's the bus stop?" },
      { es: "¿Cuánto cuesta el billete?", en: "How much is the ticket?" },
      { es: "¿Me avisa cuando lleguemos?", en: "Will you let me know when we arrive?" },
      { es: "¿Para en...?", en: "Does it stop at...?" },
      { es: "el conductor", en: "the driver" }
    ]
  });

  /* ---- Conditional: Ferry (transport: ferry) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-ferry", requires: { transport: "ferry" },
    topic: "Transport · Ferry",
    title: "Ferries & Boats",
    reward: "Docks, crossings, round-trips — you can board a boat without getting on the wrong one.",
    items: [
      { es: "¿Dónde se compran los billetes del ferry?", en: "Where do you buy ferry tickets?" },
      { es: "¿A qué hora sale el próximo ferry?", en: "What time does the next ferry leave?" },
      { es: "¿Cuánto dura la travesía?", en: "How long is the crossing?" },
      { es: "¿Desde qué muelle sale?", en: "Which dock does it leave from?" },
      { es: "un billete de ida y vuelta", en: "a return (round-trip) ticket" },
      { es: "¿Está incluido el equipaje?", en: "Is luggage included?" },
      { es: "Se mueve mucho", en: "It's rough / it moves a lot" }
    ]
  });

  /* ---- Conditional: Airbnb (lodging: airbnb) → Hotel & Sights ---- */
  byId("s4").lessons.push({
    id: "s4-airbnb", requires: { lodging: "airbnb" },
    topic: "Airbnb / apartment",
    title: "Your Airbnb",
    reward: "Keys, wifi, trash day, the lockbox that won't open — you can handle a host like a pro.",
    items: [
      { es: "¿Dónde recojo las llaves?", en: "Where do I pick up the keys?" },
      { es: "¿Cuál es la contraseña del wifi?", en: "What's the wifi password?" },
      { es: "¿Cómo funciona la calefacción?", en: "How does the heating work?" },
      { es: "¿Dónde se tira la basura?", en: "Where do I take out the trash?" },
      { es: "La caja de seguridad no abre", en: "The lockbox won't open" },
      { es: "No hay agua caliente", en: "There's no hot water" },
      { es: "¿A qué hora tengo que salir?", en: "What time do I have to check out?" },
      { es: "¿Me puede dar la dirección exacta?", en: "Can you give me the exact address?" }
    ]
  });

  /* ---- New harder stage: Level Up (longer, combined sentences) ---- */
  CURRICULUM.stages.push({
    id: "s5",
    title: "Level Up",
    blurb: "Full sentences that string topics together. The big-kid stage.",
    lessons: [
      {
        id: "s5-real",
        topic: "Advanced · Real situations",
        title: "Real Conversations",
        reward: "Look at you — full sentences now. People might mistake you for someone who lives here.",
        items: [
          { es: "¿Podría recomendarme un plato típico de aquí?", en: "Could you recommend a typical local dish?" },
          { es: "Disculpe, creo que hay un error en la cuenta", en: "Excuse me, I think there's a mistake on the bill" },
          { es: "¿A qué hora cierra la cocina?", en: "What time does the kitchen close?" },
          { es: "Estamos buscando un sitio para cenar cerca de aquí", en: "We're looking for somewhere to have dinner near here" },
          { es: "Perdone, ¿este tren va al centro?", en: "Excuse me, does this train go to the center?" },
          { es: "¿Sería posible cambiar de habitación?", en: "Would it be possible to change rooms?" }
        ]
      },
      {
        id: "s5-fix",
        topic: "Advanced · When things go wrong",
        title: "When It Goes Wrong",
        reward: "Lost, overcharged, double-booked — you can talk your way out of it. Travel boss mode.",
        items: [
          { es: "Reservé una habitación pero no aparece", en: "I booked a room but it's not showing up" },
          { es: "Creo que me he perdido, ¿me puede ayudar?", en: "I think I'm lost, can you help me?" },
          { es: "Se me ha olvidado la cartera en el taxi", en: "I left my wallet in the taxi" },
          { es: "¿Puede llamar a un médico, por favor?", en: "Can you call a doctor, please?" },
          { es: "Esto no es lo que he pedido", en: "This isn't what I ordered" },
          { es: "¿Dónde está la comisaría más cercana?", en: "Where's the nearest police station?" }
        ]
      }
    ]
  });
})();

if (typeof module !== "undefined") {
  module.exports = { CURRICULUM, ALLERGENS, LODGING_OPTIONS, TRANSPORT_OPTIONS };
}
