/* =========================================================================
   MEXICO content pack — Mexican Spanish, foodie/independent-traveler persona.
   Mirrors the Spain blueprint (curriculum.js): same stage arc and lesson
   coverage, localized to Mexico (tacos↔tapas, pesos↔euros, camión/cuadra/
   ahorita, es-MX vocab). Scenario-based, anxiety-descending (easy wins first,
   emergencies last), with deliberate spaced reuse across lessons.
   item = { es, en, note?, tags?, reply?, difficulty? }
     note       : usage tip / dialect difference
     tags       : power filters + cram prioritization ("dietary","emergency")
     reply      : a likely local response, for "understand the reply" exercises
   Conditional lessons (requires: transport/lodging) only appear if the
   traveler's profile matches — same keys as the shared onboarding options.
   ========================================================================= */

const MEXICO_PACK = {
  key: "mexico",
  dialect: "Mexican Spanish",
  tts: "es-MX",
  stages: [
    /* ---------------------------------------------------------------- */
    {
      id: "mx-s1", title: "Survival Kit", blurb: "The words that keep you alive on day one.",
      lessons: [
        {
          id: "mx-greet", topic: "Greetings & politeness", title: "Hola & Gracias",
          reward: "First words down — the taquero already likes you better.",
          items: [
            { es: "Hola", en: "Hi" },
            { es: "Buenos días", en: "Good morning" },
            { es: "Buenas tardes", en: "Good afternoon" },
            { es: "Buenas noches", en: "Good evening / night" },
            { es: "Por favor", en: "Please" },
            { es: "Gracias", en: "Thank you", reply: { es: "De nada", en: "You're welcome" } },
            { es: "De nada", en: "You're welcome" },
            { es: "Con permiso", en: "Excuse me (getting past)", note: "Very Mexican — say it squeezing by or leaving a table." },
            { es: "Disculpe", en: "Excuse me (to get attention)" },
            { es: "Sí", en: "Yes" },
            { es: "No", en: "No" }
          ]
        },
        {
          id: "mx-rescue", topic: "How do you say", title: "I Only Speak a Little",
          reward: "Now you can admit your Spanish is shaky — in Spanish. Locals will slow down for you.",
          items: [
            { es: "Hablo poquito español", en: "I speak a little Spanish", note: "'Poquito' is friendly and very Mexican." },
            { es: "Estoy aprendiendo español", en: "I'm learning Spanish", note: "Buys patience instantly." },
            { es: "No entiendo", en: "I don't understand" },
            { es: "¿Habla inglés?", en: "Do you speak English?", note: "Formal (usted) — polite default with strangers." },
            { es: "¿Cómo se dice...?", en: "How do you say...?" },
            { es: "¿Puede repetir, por favor?", en: "Can you repeat that, please?" },
            { es: "Más despacio, por favor", en: "Slower, please" },
            { es: "¿Qué significa?", en: "What does it mean?" }
          ]
        },
        {
          id: "mx-numbers1", topic: "Numbers", title: "Numbers 1–10",
          reward: "You can count to ten — enough to order tacos for the whole table.",
          items: [
            { es: "uno", en: "one", difficulty: 1 },
            { es: "dos", en: "two", difficulty: 1 },
            { es: "tres", en: "three", difficulty: 1 },
            { es: "cuatro", en: "four", difficulty: 1 },
            { es: "cinco", en: "five", difficulty: 1 },
            { es: "seis", en: "six", difficulty: 1 },
            { es: "siete", en: "seven", difficulty: 1 },
            { es: "ocho", en: "eight", difficulty: 1 },
            { es: "nueve", en: "nine", difficulty: 1 },
            { es: "diez", en: "ten", difficulty: 1 }
          ]
        },
        {
          id: "mx-order", topic: "Ordering food & drink", title: "Ordering Tacos",
          reward: "You can order tacos and dodge the spicy salsa. Night one: handled.",
          items: [
            { es: "Una mesa para dos, por favor", en: "A table for two, please" },
            { es: "El menú, por favor", en: "The menu, please" },
            { es: "¿Qué me recomienda?", en: "What do you recommend?", reply: { es: "Los tacos al pastor están buenísimos", en: "The al pastor tacos are amazing" } },
            { es: "Me gustaría los tacos", en: "I'd like the tacos" },
            { es: "Un agua, por favor", en: "A water, please" },
            { es: "Un jugo de naranja", en: "An orange juice", note: "Mexico: 'jugo'. (Spain says 'zumo'.)" },
            { es: "Una cerveza, por favor", en: "A beer, please", note: "Casually: 'una chela'." },
            { es: "¿Está muy picante?", en: "Is it very spicy?", note: "Colloquially: '¿pica mucho?'", reply: { es: "Un poquito, pero está rico", en: "A little, but it's tasty" } },
            { es: "Sin chile, por favor", en: "Without chili, please" },
            { es: "La cuenta, por favor", en: "The check, please" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mx-s2", title: "Out & About", blurb: "Eat, pay, find a bathroom, tell the time.",
      lessons: [
        {
          id: "mx-diet", topic: "Dietary needs & allergies", title: "Allergies & Diet",
          reward: "Crucial unlock — you can keep yourself safe at the table. Gluten, begone.",
          items: [
            { es: "Soy alérgico a...", en: "I'm allergic to...", note: "Women: 'alérgica'.", tags: ["dietary"] },
            { es: "¿Esto lleva...?", en: "Does this contain...?", tags: ["dietary"] },
            { es: "Soy celíaco", en: "I'm celiac", note: "Women: 'celíaca'.", tags: ["dietary"] },
            { es: "Sin gluten", en: "Gluten-free", tags: ["dietary"] },
            { es: "¿Tiene harina de trigo?", en: "Does it have wheat flour?", tags: ["dietary"] },
            { es: "Soy vegetariano", en: "I'm vegetarian", note: "Women: 'vegetariana'.", tags: ["dietary"] },
            { es: "Sin cacahuate", en: "Without peanut", note: "Mexico: 'cacahuate'. (Spain: 'cacahuete'.)", tags: ["dietary"] },
            { es: "Sin camarón", en: "Without shrimp", note: "Mexico: 'camarón'. (Spain: 'gamba'.)", tags: ["dietary"] },
            { es: "Es muy importante", en: "It's very important", tags: ["dietary"] },
            { es: "¿Me puede ayudar?", en: "Can you help me?" }
          ]
        },
        {
          id: "mx-bathroom", topic: "Bathrooms & signs", title: "Where's the Bathroom",
          reward: "You can find a bathroom and read the door. Push-vs-pull humiliation: avoided.",
          items: [
            { es: "¿Dónde está el baño?", en: "Where's the bathroom?", note: "Mexico: 'baño'.", reply: { es: "Al fondo a la derecha", en: "At the back on the right" } },
            { es: "¿Tienen baño?", en: "Do you have a bathroom?" },
            { es: "Hombres", en: "Men (sign)" },
            { es: "Mujeres", en: "Women (sign)" },
            { es: "Salida", en: "Exit (sign)" },
            { es: "Entrada", en: "Entrance (sign)" },
            { es: "Empuje", en: "Push (sign)" },
            { es: "Jale", en: "Pull (sign)", note: "Mexico: 'Jale' = pull. (Spain: 'Tirar'.)" }
          ]
        },
        {
          id: "mx-money", topic: "Numbers, money & paying", title: "Numbers & Pesos",
          reward: "You can pay, tip, and haggle. Your pesos go further now.",
          items: [
            { es: "veinte", en: "twenty" },
            { es: "cincuenta", en: "fifty" },
            { es: "cien", en: "one hundred" },
            { es: "¿Cuánto cuesta?", en: "How much does it cost?", reply: { es: "Cuestan cincuenta pesos", en: "They're fifty pesos" } },
            { es: "¿Cuánto es?", en: "How much is it (total)?" },
            { es: "¿Aceptan tarjeta?", en: "Do you accept card?", reply: { es: "Solo efectivo", en: "Cash only" } },
            { es: "En efectivo", en: "In cash" },
            { es: "Es muy caro", en: "It's too expensive" },
            { es: "¿Hay un cajero cerca?", en: "Is there an ATM nearby?", note: "Mexico: 'cajero' = ATM." },
            { es: "¿La propina está incluida?", en: "Is the tip included?", note: "Tip ~10–15% in Mexico." }
          ]
        },
        {
          id: "mx-time", topic: "Time & numbers", title: "Numbers & Time",
          reward: "You can ask what time it opens AND understand the answer. Punctuality: optional.",
          items: [
            { es: "treinta", en: "thirty" },
            { es: "cuarenta", en: "forty" },
            { es: "doscientos", en: "two hundred" },
            { es: "¿Qué hora es?", en: "What time is it?", reply: { es: "Son las dos", en: "It's two o'clock" } },
            { es: "Son las dos", en: "It's two o'clock" },
            { es: "a las ocho", en: "at eight" },
            { es: "¿A qué hora abre?", en: "What time does it open?", reply: { es: "A las nueve de la mañana", en: "At nine in the morning" } },
            { es: "¿A qué hora cierra?", en: "What time does it close?" }
          ]
        },
        {
          id: "mx-coffee", topic: "Coffee shop", title: "Coffee Shop",
          reward: "You can order a café de olla and survive a 'cash only' counter. Caffeine: secured.",
          items: [
            { es: "Un café con leche, por favor", en: "A coffee with milk, please" },
            { es: "Un café americano", en: "An americano (black coffee)", note: "The standard black coffee in Mexico." },
            { es: "Un café de olla", en: "A spiced pot coffee", note: "Traditional Mexican coffee with cinnamon and piloncillo." },
            { es: "Un pan dulce", en: "A sweet pastry", note: "Mexican bakery staple — like a 'concha'." },
            { es: "¿Qué pan tienen?", en: "What pastries do you have?" },
            { es: "¿Para aquí o para llevar?", en: "For here or to go?", note: "What the barista asks you.", reply: { es: "Para llevar, por favor", en: "To go, please" } },
            { es: "¿Me da un vaso de agua?", en: "Can I get a glass of water?" },
            { es: "Solo efectivo", en: "Cash only", note: "You might hear this at small spots." }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mx-s3", title: "On the Move", blurb: "Taxis, airport signs, and asking the way.",
      lessons: [
        {
          id: "mx-dir", topic: "Directions", title: "Which Way?",
          reward: "Left, right, derecho — you won't get lost in the mercado maze.",
          items: [
            { es: "¿Dónde está...?", en: "Where is...?", reply: { es: "Está a dos cuadras", en: "It's two blocks away" } },
            { es: "¿Cómo llego a...?", en: "How do I get to...?" },
            { es: "a la derecha", en: "to the right" },
            { es: "a la izquierda", en: "to the left" },
            { es: "derecho", en: "straight ahead", note: "Mexico: 'derecho'. (Spain: 'todo recto'.)" },
            { es: "cerca", en: "near" },
            { es: "lejos", en: "far" },
            { es: "a dos cuadras", en: "two blocks away", note: "Mexico: 'cuadra' = city block." },
            { es: "la esquina", en: "the corner" },
            { es: "¿Está lejos?", en: "Is it far?", reply: { es: "No, está aquí cerca", en: "No, it's close by" } }
          ]
        },
        {
          id: "mx-taxi", topic: "Taxis & rideshare", title: "Taxis & Uber",
          reward: "You can survive a taxi without overpaying. Backseat boss.",
          items: [
            { es: "Lléveme a esta dirección", en: "Take me to this address" },
            { es: "¿Cuánto al centro?", en: "How much to downtown?", reply: { es: "Como cien pesos", en: "About a hundred pesos" } },
            { es: "¿Usa taxímetro?", en: "Do you use the meter?" },
            { es: "Pare aquí, por favor", en: "Stop here, please" },
            { es: "al aeropuerto", en: "to the airport" },
            { es: "¿Acepta tarjeta?", en: "Do you take card?" },
            { es: "el sitio de taxis", en: "the taxi stand", note: "Mexico: 'sitio'. Uber/Didi are common too." },
            { es: "Voy con prisa", en: "I'm in a hurry" },
            { es: "la cajuela", en: "the trunk", note: "Mexico: 'cajuela'. (Spain: 'maletero'.)" }
          ]
        },
        {
          id: "mx-airport", topic: "Airport signs", title: "Reading the Airport",
          reward: "Arrivals, departures, your gate — all decoded. You won't miss the flight over a sign.",
          items: [
            { es: "Salidas", en: "Departures" },
            { es: "Llegadas", en: "Arrivals" },
            { es: "Puerta de embarque", en: "Boarding gate" },
            { es: "Documentación", en: "Check-in (bag drop)", note: "Mexico: 'documentación' / 'check-in'." },
            { es: "Reclamo de equipaje", en: "Baggage claim", note: "Mexico: 'reclamo de equipaje'." },
            { es: "Seguridad", en: "Security" },
            { es: "Aduana", en: "Customs" },
            { es: "el vuelo", en: "the flight" }
          ]
        },
        {
          id: "mx-plane", topic: "On the plane", title: "On the Plane",
          reward: "Chicken or pasta, juice or coffee — you can run the whole drinks cart in Spanish.",
          items: [
            { es: "¿Pollo o pasta?", en: "Chicken or pasta?", note: "What the flight attendant asks you." },
            { es: "Pollo, por favor", en: "Chicken, please" },
            { es: "¿Algo de tomar?", en: "Anything to drink?", note: "What they ask you.", reply: { es: "Un jugo, por favor", en: "A juice, please" } },
            { es: "Un jugo, por favor", en: "A juice, please" },
            { es: "Un café, por favor", en: "A coffee, please" },
            { es: "Agua, por favor", en: "Water, please" },
            { es: "¿Me da una cobija?", en: "Can I have a blanket?", note: "Mexico: 'cobija' = blanket. (Spain: 'manta'.)" },
            { es: "¿Puedo pasar?", en: "May I get by?", note: "To reach your seat." }
          ]
        },
        {
          id: "mx-metro", requires: { transport: "metro" },
          topic: "Metro", title: "Metro",
          reward: "You can buy a boleto and not ride the wrong line. CDMX underground: conquered.",
          items: [
            { es: "¿Dónde está el metro?", en: "Where's the metro?" },
            { es: "un boleto", en: "a ticket", note: "Mexico: 'boleto'. The CDMX metro costs just a few pesos." },
            { es: "¿Qué línea va a...?", en: "Which line goes to...?" },
            { es: "¿Tengo que hacer transbordo?", en: "Do I have to transfer?", note: "'Transbordo' = changing lines." },
            { es: "¿Cuántas estaciones faltan?", en: "How many stations are left?" },
            { es: "el andén", en: "the platform" },
            { es: "la salida", en: "the exit" }
          ]
        },
        {
          id: "mx-bus", requires: { transport: "bus" },
          topic: "Bus", title: "Buses",
          reward: "You can flag the right camión and get off at the right stop. No more mystery tours.",
          items: [
            { es: "¿Este camión va al centro?", en: "Does this bus go downtown?", note: "Mexico: 'camión' = city bus." },
            { es: "¿Dónde está la parada?", en: "Where's the bus stop?" },
            { es: "¿Cuánto es el pasaje?", en: "How much is the fare?", note: "Mexico: 'pasaje' = fare.", reply: { es: "Son diez pesos", en: "It's ten pesos" } },
            { es: "¿Me avisa cuando lleguemos?", en: "Will you let me know when we arrive?" },
            { es: "¿Aquí me bajo?", en: "Do I get off here?" },
            { es: "el chofer", en: "the driver", note: "Mexico: 'chofer'." }
          ]
        },
        {
          id: "mx-ferry", requires: { transport: "ferry" },
          topic: "Ferry", title: "Ferries & Boats",
          reward: "Docks, crossings, round-trips — you can board the ferry to Cozumel without boarding the wrong one.",
          items: [
            { es: "¿Dónde compro el boleto del ferry?", en: "Where do I buy the ferry ticket?" },
            { es: "¿A qué hora sale el próximo ferry?", en: "What time does the next ferry leave?" },
            { es: "¿Cuánto dura el viaje?", en: "How long is the trip?" },
            { es: "¿De qué muelle sale?", en: "Which dock does it leave from?" },
            { es: "un boleto de ida y vuelta", en: "a round-trip ticket" },
            { es: "¿Está incluido el equipaje?", en: "Is luggage included?" },
            { es: "Se mueve mucho", en: "It's rough / it moves a lot" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mx-s4", title: "Hotel & Connecting", blurb: "Check in, talk to locals, hit the market.",
      lessons: [
        {
          id: "mx-hotel", topic: "Hotel & check-in", title: "Checking In",
          reward: "Check-in conquered. The front desk respects you.",
          items: [
            { es: "Tengo una reservación", en: "I have a reservation", note: "Mexico: 'reservación'. (Spain: 'reserva'.)" },
            { es: "a nombre de...", en: "under the name of..." },
            { es: "un cuarto doble", en: "a double room", note: "Mexico: 'cuarto'. ('habitación' also fine.)" },
            { es: "¿A qué hora es la salida?", en: "What time is checkout?", reply: { es: "A las doce del día", en: "At noon" } },
            { es: "¿El desayuno está incluido?", en: "Is breakfast included?" },
            { es: "¿Hay wifi?", en: "Is there wifi?" },
            { es: "¿Cuál es la contraseña?", en: "What's the password?" },
            { es: "¿Puedo dejar mis maletas?", en: "Can I leave my bags?" }
          ]
        },
        {
          id: "mx-room", topic: "Hotel · Housekeeping", title: "Towels & Pillows",
          reward: "You can ask for a clean towel and a working shower. Baby steps.",
          items: [
            { es: "¿Puede limpiar el cuarto?", en: "Can you clean the room?" },
            { es: "Necesito más toallas", en: "I need more towels" },
            { es: "¿Me trae otra almohada?", en: "Can you bring another pillow?" },
            { es: "La regadera no sirve", en: "The shower isn't working", note: "Mexico: 'regadera' = shower; 'no sirve' = doesn't work." },
            { es: "No hay agua caliente", en: "There's no hot water" },
            { es: "papel de baño", en: "toilet paper", note: "Mexico: 'papel de baño'." },
            { es: "No molestar", en: "Do not disturb (sign)" },
            { es: "Muchas gracias por todo", en: "Thank you very much for everything", note: "Housekeeping appreciates it — and a small tip." }
          ]
        },
        {
          id: "mx-airbnb", requires: { lodging: "airbnb" },
          topic: "Airbnb / apartment", title: "Your Airbnb",
          reward: "Keys, wifi, the boiler, trash day — you can handle a host like a pro.",
          items: [
            { es: "¿Dónde recojo las llaves?", en: "Where do I pick up the keys?" },
            { es: "¿Cuál es la contraseña del wifi?", en: "What's the wifi password?" },
            { es: "¿Cómo funciona el bóiler?", en: "How does the water heater work?", note: "Mexico: 'bóiler' = water heater." },
            { es: "¿Dónde se tira la basura?", en: "Where do I take out the trash?" },
            { es: "La caja de seguridad no abre", en: "The lockbox won't open" },
            { es: "No hay agua caliente", en: "There's no hot water" },
            { es: "¿A qué hora tengo que salir?", en: "What time do I have to check out?" },
            { es: "¿Me da la dirección exacta?", en: "Can you give me the exact address?" }
          ]
        },
        {
          id: "mx-landmarks", topic: "Sights & ruins", title: "Sightseeing",
          reward: "Two tickets to the ruins, please — and you said it in Spanish. Teotihuacán awaits.",
          items: [
            { es: "¿A qué hora abren las ruinas?", en: "What time do the ruins open?" },
            { es: "dos boletos, por favor", en: "two tickets, please" },
            { es: "¿Hay que reservar?", en: "Do you have to book ahead?" },
            { es: "¿Dónde está la taquilla?", en: "Where's the ticket booth?", note: "'Taquilla' = ticket window." },
            { es: "¿Se pueden tomar fotos?", en: "Can you take photos?" },
            { es: "la fila", en: "the line / queue", note: "Mexico: 'fila' = line." },
            { es: "el centro histórico", en: "the historic center" },
            { es: "¿Abren los domingos?", en: "Are you open on Sundays?" }
          ]
        },
        {
          id: "mx-hear", topic: "Common phrases you'll hear", title: "Things They'll Say to You",
          reward: "You can understand what's said TO you. 'Ahorita' will still confuse you — that's normal.",
          items: [
            { es: "¿Algo más?", en: "Anything else?" },
            { es: "Mande", en: "Pardon? / Yes?", note: "Very Mexican polite way to say 'what?' or 'go ahead'." },
            { es: "Con gusto", en: "My pleasure", note: "Common Mexican reply to 'gracias'." },
            { es: "Ahorita", en: "Right now / in a bit", note: "Famously flexible Mexican timing." },
            { es: "¿Es todo?", en: "Is that all?" },
            { es: "Provecho", en: "Enjoy your meal", note: "Said when passing people who are eating." },
            { es: "Aquí tiene", en: "Here you go" },
            { es: "Que le vaya bien", en: "Take care / have a good one" }
          ]
        },
        {
          id: "mx-talk", topic: "Small talk & bartender", title: "Bar & Small Talk",
          reward: "You can actually talk to people now. Mezcal conversations await.",
          items: [
            { es: "¿De dónde eres?", en: "Where are you from?", reply: { es: "Soy de aquí, de la ciudad", en: "I'm from here, from the city" } },
            { es: "Soy de...", en: "I'm from..." },
            { es: "Mucho gusto", en: "Nice to meet you", reply: { es: "Igualmente", en: "Likewise" } },
            { es: "¿Qué me recomienda?", en: "What do you recommend?", note: "Callback from ordering — locals love being asked." },
            { es: "¿Cuál es tu mezcal favorito?", en: "What's your favorite mezcal?" },
            { es: "Está buenísimo", en: "It's really good" },
            { es: "Una más, por favor", en: "One more, please" },
            { es: "¿Cómo se llama esto?", en: "What's this called?" },
            { es: "¡Salud!", en: "Cheers!" }
          ]
        },
        {
          id: "mx-market", topic: "Markets & shopping", title: "At the Market",
          reward: "Markets decoded. ¿A cómo los aguacates? You got this.",
          items: [
            { es: "¿Tiene...?", en: "Do you have...?" },
            { es: "¿A cómo?", en: "How much (per unit)?", note: "Classic market phrase for prices.", reply: { es: "A treinta pesos el kilo", en: "Thirty pesos a kilo" } },
            { es: "un poco más", en: "a little more" },
            { es: "un poco menos", en: "a little less" },
            { es: "¿Me da medio kilo?", en: "Can you give me half a kilo?" },
            { es: "¿Está fresco?", en: "Is it fresh?" },
            { es: "Me llevo esto", en: "I'll take this" },
            { es: "¿Me da una bolsa?", en: "Can I get a bag?" },
            { es: "Demasiado caro", en: "Too expensive", note: "Callback from money." },
            { es: "¿Lleva chile?", en: "Does it have chili?", note: "Callback from dietary." }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mx-s5", title: "Level Up & Safety", blurb: "Full sentences, and covered if things go wrong.",
      lessons: [
        {
          id: "mx-real", topic: "Advanced · Real situations", title: "Real Conversations",
          reward: "Full sentences now. People might mistake you for someone who lives here.",
          items: [
            { es: "¿Me podría recomendar un platillo típico?", en: "Could you recommend a typical dish?", note: "Mexico: 'platillo' = dish." },
            { es: "Disculpe, creo que hay un error en la cuenta", en: "Excuse me, I think there's a mistake on the bill" },
            { es: "¿A qué hora cierra la cocina?", en: "What time does the kitchen close?" },
            { es: "Estamos buscando un lugar para cenar cerca de aquí", en: "We're looking for somewhere to have dinner near here" },
            { es: "Disculpe, ¿este camión va al centro?", en: "Excuse me, does this bus go downtown?" },
            { es: "¿Sería posible cambiar de cuarto?", en: "Would it be possible to change rooms?" }
          ]
        },
        {
          id: "mx-help", topic: "Problems & emergencies", title: "Help & Emergencies",
          reward: "The safety net is in place. Now go enjoy Oaxaca — you're covered.",
          items: [
            { es: "Ayuda", en: "Help", tags: ["emergency"] },
            { es: "Necesito un médico", en: "I need a doctor", tags: ["emergency"] },
            { es: "Llame a la policía", en: "Call the police", note: "Emergency number in Mexico is 911.", tags: ["emergency"] },
            { es: "Me robaron", en: "I was robbed", tags: ["emergency"] },
            { es: "No me siento bien", en: "I don't feel well", tags: ["emergency"] },
            { es: "¿Habla inglés?", en: "Do you speak English?" },
            { es: "Perdí mi pasaporte", en: "I lost my passport", tags: ["emergency"] },
            { es: "¿Dónde está la farmacia?", en: "Where's the pharmacy?", tags: ["emergency"] },
            { es: "Es una emergencia", en: "It's an emergency", tags: ["emergency"] },
            { es: "Me duele aquí", en: "It hurts here", tags: ["emergency"] }
          ]
        },
        {
          id: "mx-fix", topic: "Advanced · When things go wrong", title: "When It Goes Wrong",
          reward: "Lost, overcharged, double-booked — you can talk your way out of it. Travel boss mode.",
          items: [
            { es: "Hice una reservación pero no aparece", en: "I made a reservation but it's not showing up" },
            { es: "Creo que estoy perdido, ¿me puede ayudar?", en: "I think I'm lost, can you help me?" },
            { es: "Se me olvidó la cartera en el taxi", en: "I left my wallet in the taxi" },
            { es: "¿Puede llamar a un doctor, por favor?", en: "Can you call a doctor, please?", tags: ["emergency"] },
            { es: "Esto no es lo que pedí", en: "This isn't what I ordered" },
            { es: "¿Dónde está la delegación más cercana?", en: "Where's the nearest police station?", note: "Mexico: often 'delegación' or 'ministerio público'.", tags: ["emergency"] }
          ]
        }
      ]
    }
  ]
};

if (typeof module !== "undefined") module.exports = MEXICO_PACK;
