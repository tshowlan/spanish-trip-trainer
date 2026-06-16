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
            { es: "Hola", en: "Hello" },
            { es: "Buenos días", en: "Good morning" },
            { es: "Buenas tardes", en: "Good afternoon" },
            { es: "Buenas noches", en: "Good evening / night" },
            { es: "Por favor", en: "Please" },
            { es: "Gracias", en: "Thank you" },
            { es: "De nada", en: "You're welcome" },
            { es: "Perdón", en: "Excuse me / Sorry" },
            { es: "Sí", en: "Yes" },
            { es: "No", en: "No" }
          ]
        },
        {
          id: "s1-rescue",
          topic: "How do you say",
          title: "I Only Speak a Little",
          reward: "Now you can confess your Spanish is bad — in Spanish. Meta. Keep going so you don't have to.",
          items: [
            { es: "Hablo solo un poco de español", en: "I only speak a little Spanish" },
            { es: "No entiendo", en: "I don't understand" },
            { es: "¿Habla inglés?", en: "Do you speak English?", note: "Formal (usted). Polite default with strangers." },
            { es: "¿Cómo se dice...?", en: "How do you say...?" },
            { es: "¿Puede repetir, por favor?", en: "Can you repeat that, please?" },
            { es: "Más despacio, por favor", en: "Slower, please" },
            { es: "¿Qué significa?", en: "What does it mean?" },
            { es: "No lo sé", en: "I don't know" }
          ]
        },
        {
          id: "s1-numbers1",
          topic: "Numbers",
          title: "Numbers 1–10",
          reward: "You can count to ten. That's enough fingers to order tapas for the whole table.",
          items: [
            { es: "uno", en: "one" },
            { es: "dos", en: "two" },
            { es: "tres", en: "three" },
            { es: "cuatro", en: "four" },
            { es: "cinco", en: "five" },
            { es: "seis", en: "six" },
            { es: "siete", en: "seven" },
            { es: "ocho", en: "eight" },
            { es: "nueve", en: "nine" },
            { es: "diez", en: "ten" },
            { es: "¿Cuánto cuesta?", en: "How much is it?" }
          ]
        },
        {
          id: "s1-order",
          topic: "Restaurant · Ordering",
          title: "Yes, Chef",
          reward: "You can now say 'I'll have the steak' and 'still water.' Maybe after 50 more you'll order it at the right temperature.",
          items: [
            { es: "Una mesa para dos, por favor", en: "A table for two, please" },
            { es: "La carta, por favor", en: "The menu, please", note: "In Spain 'la carta' = the menu. 'El menú' usually means the fixed menú del día." },
            { es: "Para mí, el filete", en: "For me, the steak", latam: "Latin America: 'el bife' or 'la carne'." },
            { es: "Agua sin gas", en: "Still water (no bubbles)" },
            { es: "Agua con gas", en: "Sparkling water" },
            { es: "Una caña, por favor", en: "A small draft beer, please", note: "Very Spain. A 'caña' is a small draft beer." },
            { es: "La cuenta, por favor", en: "The check, please" },
            { es: "Está muy rico", en: "It's delicious" }
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

if (typeof module !== "undefined") module.exports = CURRICULUM;
