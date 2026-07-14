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
            { es: "¿Qué recomienda?", en: "What do you recommend?", tier: 2, tags: ["restaurant", "food"], keywords: ["recomienda"], reply: { es: "La paella está muy buena", en: "The paella is very good" } },
            { es: "Poco hecho", en: "Rare (steak)", tier: 2, tags: ["restaurant", "food"], contextEs: "El filete, poco hecho", contextEn: "The steak, rare", keywords: ["hecho"] },
            { es: "Al punto", en: "Medium", tier: 2, tags: ["restaurant", "food"], contextEs: "Lo quiero al punto", contextEn: "I'd like it medium", keywords: ["punto"] },
            { es: "Muy hecho", en: "Well done", tier: 2, tags: ["restaurant", "food"], contextEs: "El filete muy hecho", contextEn: "The steak well done", keywords: ["hecho"] },
            { es: "Soy alérgico al marisco", en: "I'm allergic to shellfish", note: "Women: 'alérgica'.", tier: 2, tags: ["dietary", "health"], anchor: "'alérgico' = allergic.", keywords: ["alérgico", "marisco"] },
            { es: "Sin gluten", en: "Gluten-free", tier: 1, tags: ["dietary", "food"], contextEs: "¿Tienen algo sin gluten?", contextEn: "Do you have anything gluten-free?", keywords: ["gluten"] },
            { es: "Vino tinto", en: "Red wine", tier: 1, tags: ["drink"], contextEs: "Una copa de vino tinto", contextEn: "A glass of red wine", keywords: ["vino", "tinto"] },
            { es: "Para llevar", en: "To go / takeaway", latam: "Also 'para llevar'; Mexico: 'para llevar' too.", tier: 1, tags: ["restaurant", "food"], contextEs: "Es para llevar", contextEn: "It's to take away", keywords: ["llevar"] }
          ]
        },
        {
          id: "s2-bathroom",
          topic: "Restaurant · Bathrooms",
          title: "Where's the Loo",
          reward: "You can find a bathroom and read a door. Push vs. pull humiliation: avoided.",
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
          id: "s2-pay",
          topic: "Restaurant · Paying",
          title: "Paying Up",
          reward: "You can pay by card, in cash, and survive a broken card machine. The economy thanks you.",
          items: [
            { es: "¿Puedo pagar con tarjeta?", en: "Can I pay by card?", tier: 2, tags: ["money"], keywords: ["tarjeta"], variants: ["¿Aceptan tarjeta?"] },
            { es: "En efectivo", en: "In cash", tier: 1, tags: ["money"], contextEs: "Voy a pagar en efectivo", contextEn: "I'll pay in cash", keywords: ["efectivo"] },
            { es: "¿Aceptan tarjeta?", en: "Do you accept card?", tier: 2, tags: ["money"], keywords: ["tarjeta"], reply: { es: "Sí, sin problema", en: "Yes, no problem" } },
            { es: "El datáfono no funciona", en: "The card machine isn't working", note: "'Datáfono' is the card terminal in Spain.", tier: 2, tags: ["money"], keywords: ["datáfono"] },
            { es: "¿Está incluido el servicio?", en: "Is service included?", note: "Tipping in Spain is small/optional — rounding up is normal.", tier: 2, tags: ["money", "restaurant"], keywords: ["servicio"] },
            { es: "Quédese con el cambio", en: "Keep the change", tier: 2, tags: ["money", "restaurant"], keywords: ["cambio"] },
            { es: "¿Hay un cajero cerca?", en: "Is there an ATM nearby?", note: "Spain: 'cajero' = ATM.", tier: 2, tags: ["money", "directions"], keywords: ["cajero", "cerca"] },
            { es: "una propina", en: "a tip", tier: 1, tags: ["money", "restaurant"], contextEs: "Dejar una propina", contextEn: "To leave a tip", keywords: ["propina"] }
          ]
        },
        {
          id: "s2-time",
          topic: "Time & Numbers",
          title: "Numbers & Time",
          reward: "You can ask what time the thing opens AND understand the answer. Punctuality unlocked (optional in Spain).",
          items: [
            { es: "veinte", en: "twenty", tier: 1, tags: ["numbers", "money"], contextEs: "Veinte euros", contextEn: "Twenty euros" },
            { es: "treinta", en: "thirty", tier: 1, tags: ["numbers", "time"], contextEs: "Treinta minutos", contextEn: "Thirty minutes" },
            { es: "cincuenta", en: "fifty", tier: 1, tags: ["numbers", "money"], contextEs: "Cincuenta euros", contextEn: "Fifty euros" },
            { es: "cien", en: "one hundred", tier: 1, tags: ["numbers", "money"], contextEs: "Cien euros", contextEn: "One hundred euros", anchor: "Think: 'century / percent' — 100." },
            { es: "¿Qué hora es?", en: "What time is it?", tier: 2, tags: ["time"], keywords: ["hora"], reply: { es: "Son las dos", en: "It's two o'clock" } },
            { es: "Son las dos", en: "It's two o'clock", tier: 1, tags: ["time"], contextEs: "Son las dos de la tarde", contextEn: "It's two in the afternoon", keywords: ["dos"] },
            { es: "a las ocho", en: "at eight", tier: 1, tags: ["time"], contextEs: "Quedamos a las ocho", contextEn: "Let's meet at eight", keywords: ["ocho"] },
            { es: "¿A qué hora abre?", en: "What time does it open?", tier: 2, tags: ["time"], keywords: ["hora", "abre"], reply: { es: "A las nueve de la mañana", en: "At nine in the morning" } }
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
          id: "s3-airport",
          topic: "Transport · Airport signs",
          title: "Reading the Airport",
          reward: "Arrivals, departures, your gate — all decoded. You will not miss the flight because of a sign.",
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
          id: "s3-directions",
          topic: "Walking directions",
          title: "How Do I Get To…",
          reward: "Left, right, straight ahead — you can now get lost on purpose. Gaudí's buildings await.",
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
      { es: "Un café con leche, por favor", en: "A coffee with milk, please", tier: 2, tags: ["coffee", "drink"], keywords: ["café", "leche"] },
      { es: "Un cortado, por favor", en: "An espresso with a dash of milk, please", note: "A 'cortado' is espresso 'cut' with a little warm milk — a Spain classic.", tier: 2, tags: ["coffee", "drink"], keywords: ["cortado"] },
      { es: "Un café solo", en: "A black espresso", latam: "Latin America: 'un espresso' / 'un café negro'.", tier: 2, tags: ["coffee", "drink"], keywords: ["café", "solo"] },
      { es: "Un croissant, por favor", en: "A croissant, please", note: "Also spelled 'un cruasán'.", tier: 2, tags: ["coffee", "food"], keywords: ["croissant"] },
      { es: "¿Qué pasteles tienen?", en: "What pastries do you have?", tier: 2, tags: ["coffee", "food"], keywords: ["pasteles"] },
      { es: "¿Para tomar aquí o para llevar?", en: "For here or to take away?", note: "What the barista asks you.", tier: 2, tags: ["coffee"], keywords: ["llevar"], reply: { es: "Para llevar, por favor", en: "To take away, please" } },
      { es: "¿Me puede dar cambio?", en: "Can you give me change?", tier: 2, tags: ["money"], keywords: ["cambio"] },
      { es: "Solo efectivo, el datáfono no funciona", en: "Cash only, the card machine's down", note: "You might hear this — 'datáfono' is the card terminal.", tier: 1, tags: ["money"], keywords: ["efectivo", "datáfono"] }
    ]
  });

  /* ---- On the plane / flight attendant (core) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-plane",
    topic: "Transport · On the plane",
    title: "On the Plane",
    reward: "Chicken or pasta, juice or wine — you can now run the whole drinks cart in Spanish.",
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
  });

  /* ---- Conditional: Metro (transport: metro) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-metro", requires: { transport: "metro" },
    topic: "Transport · Metro",
    title: "Metro",
    reward: "You can buy a T-casual and not ride the wrong line. Barcelona underground: conquered.",
    items: [
      { es: "¿Dónde está la estación de metro?", en: "Where's the metro station?", tier: 1, tags: ["metro", "transport", "directions"], keywords: ["dónde", "metro"] },
      { es: "una T-casual", en: "a 10-trip travel card", note: "Barcelona's pay-per-ride metro/bus card.", tier: 1, tags: ["metro", "transport"], contextEs: "Una T-casual, por favor", contextEn: "A T-casual, please", keywords: ["casual"] },
      { es: "¿Qué línea va a...?", en: "Which line goes to...?", tier: 2, tags: ["metro", "transport"], keywords: ["línea"] },
      { es: "¿Tengo que hacer transbordo?", en: "Do I have to change lines?", note: "'Transbordo' = changing lines.", tier: 2, tags: ["metro", "transport"], keywords: ["transbordo"] },
      { es: "¿Cuántas paradas faltan?", en: "How many stops are left?", tier: 2, tags: ["metro", "transport"], keywords: ["paradas"] },
      { es: "el andén", en: "the platform", tier: 1, tags: ["metro", "transport"], contextEs: "El tren llega al andén", contextEn: "The train arrives at the platform", keywords: ["andén"] },
      { es: "la salida", en: "the exit", cat: "Catalan sign: 'Sortida'.", tier: 1, tags: ["metro", "signs"], contextEs: "¿Dónde está la salida?", contextEn: "Where's the exit?", keywords: ["salida"] }
    ]
  });

  /* ---- Conditional: Train (transport: train) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-train", requires: { transport: "train" },
    topic: "Transport · Train",
    title: "Trains",
    reward: "Platforms, seats, delays — you can ride the AVE like a commuter.",
    items: [
      { es: "¿De qué andén sale el tren?", en: "Which platform does the train leave from?", tier: 2, tags: ["train", "transport"], keywords: ["andén", "tren"] },
      { es: "un billete a Madrid", en: "a ticket to Madrid", latam: "Latin America: 'un boleto'.", tier: 1, tags: ["train", "transport"], contextEs: "Un billete a Madrid, por favor", contextEn: "A ticket to Madrid, please", keywords: ["billete"] },
      { es: "¿Este asiento está libre?", en: "Is this seat free?", tier: 2, tags: ["train"], keywords: ["asiento"] },
      { es: "el AVE", en: "the high-speed train", note: "Spain's high-speed rail.", tier: 1, tags: ["train", "transport"], contextEs: "El AVE a Madrid", contextEn: "The high-speed train to Madrid", keywords: ["ave"] },
      { es: "¿El tren va con retraso?", en: "Is the train delayed?", tier: 2, tags: ["train"], keywords: ["retraso", "tren"] },
      { es: "ida y vuelta", en: "round trip", tier: 2, tags: ["train", "transport"], contextEs: "Un billete de ida y vuelta", contextEn: "A round-trip ticket", keywords: ["vuelta"] },
      { es: "¿Dónde valido el billete?", en: "Where do I validate the ticket?", tier: 2, tags: ["train"], keywords: ["valido", "billete"] }
    ]
  });

  /* ---- Conditional: Bus (transport: bus) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-bus", requires: { transport: "bus" },
    topic: "Transport · Bus",
    title: "Buses",
    reward: "You can flag the right bus and get off at the right stop. No more mystery tours.",
    items: [
      { es: "¿Este autobús va al centro?", en: "Does this bus go downtown?", note: "Spain: 'autobús' / 'el bus'.", tier: 2, tags: ["bus", "transport"], keywords: ["autobús", "centro"] },
      { es: "¿Dónde está la parada?", en: "Where's the bus stop?", tier: 2, tags: ["bus", "directions"], keywords: ["parada"] },
      { es: "¿Cuánto cuesta el billete?", en: "How much is the ticket?", tier: 2, tags: ["bus", "money"], keywords: ["billete"], reply: { es: "Son dos euros con veinte", en: "It's two euros twenty" } },
      { es: "¿Me avisa cuando lleguemos?", en: "Will you let me know when we arrive?", tier: 2, tags: ["bus"], keywords: ["avisa"] },
      { es: "¿Para en...?", en: "Does it stop at...?", tier: 2, tags: ["bus"], contextEs: "¿Para en la playa?", contextEn: "Does it stop at the beach?" },
      { es: "el conductor", en: "the driver", tier: 1, tags: ["bus", "transport"], contextEs: "Pregúntele al conductor", contextEn: "Ask the driver", keywords: ["conductor"] }
    ]
  });

  /* ---- Conditional: Ferry (transport: ferry) → On the Move ---- */
  byId("s3").lessons.push({
    id: "s3-ferry", requires: { transport: "ferry" },
    topic: "Transport · Ferry",
    title: "Ferries & Boats",
    reward: "Docks, crossings, round-trips — you can board a boat without getting on the wrong one.",
    items: [
      { es: "¿Dónde se compran los billetes del ferry?", en: "Where do you buy ferry tickets?", tier: 2, tags: ["ferry", "transport"], keywords: ["billetes", "ferry"] },
      { es: "¿A qué hora sale el próximo ferry?", en: "What time does the next ferry leave?", tier: 2, tags: ["ferry", "time"], keywords: ["ferry", "hora"] },
      { es: "¿Cuánto dura la travesía?", en: "How long is the crossing?", tier: 2, tags: ["ferry", "transport"], keywords: ["travesía"] },
      { es: "¿Desde qué muelle sale?", en: "Which dock does it leave from?", tier: 2, tags: ["ferry"], keywords: ["muelle"] },
      { es: "un billete de ida y vuelta", en: "a return (round-trip) ticket", tier: 2, tags: ["ferry", "transport"], keywords: ["billete"] },
      { es: "¿Está incluido el equipaje?", en: "Is luggage included?", tier: 2, tags: ["ferry"], keywords: ["equipaje"] },
      { es: "Se mueve mucho", en: "It's rough / it moves a lot", tier: 2, tags: ["ferry"], keywords: ["mueve"] }
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
