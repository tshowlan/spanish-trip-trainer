/* =========================================================================
   MEXICO content pack — Mexican Spanish, foodie/independent-traveler persona.
   Scenario-based, anxiety-descending (easy wins first, emergencies last),
   with deliberate spaced reuse across lessons. Distinct from the Spain pack.
   Add a new country = copy this shape into content_<cc>.js + register it.
   ========================================================================= */

const MEXICO_PACK = {
  key: "mexico",
  dialect: "Mexican Spanish",
  tts: "es-MX",
  stages: [
    {
      id: "mx-s1", title: "First Words", blurb: "Day-one wins that buy locals' patience.",
      lessons: [
        {
          id: "mx-greet", topic: "Greetings & politeness", title: "Hola & Gracias",
          reward: "First words down — the taquero already likes you better.",
          items: [
            { es: "Hola", en: "Hi" },
            { es: "Buenos días", en: "Good morning" },
            { es: "Buenas tardes", en: "Good afternoon" },
            { es: "Por favor", en: "Please" },
            { es: "Gracias", en: "Thank you" },
            { es: "De nada", en: "You're welcome" },
            { es: "Con permiso", en: "Excuse me (getting past)", note: "Very Mexican — say it squeezing by or leaving a table." },
            { es: "Disculpe", en: "Excuse me (to get attention)" },
            { es: "Estoy aprendiendo español", en: "I'm learning Spanish", note: "Buys patience instantly." },
            { es: "Más despacio, por favor", en: "Slower, please" }
          ]
        }
      ]
    },
    {
      id: "mx-s2", title: "Eat & Pay", blurb: "Order, stay safe at the table, and settle up.",
      lessons: [
        {
          id: "mx-order", topic: "Ordering food & drink", title: "Ordering Tacos",
          reward: "You can order tacos and dodge the spicy salsa. Night one: handled.",
          items: [
            { es: "Una mesa para dos, por favor", en: "A table for two, please" },
            { es: "El menú, por favor", en: "The menu, please" },
            { es: "¿Qué me recomienda?", en: "What do you recommend?" },
            { es: "Me gustaría los tacos", en: "I'd like the tacos" },
            { es: "Un agua, por favor", en: "A water, please" },
            { es: "Un jugo de naranja", en: "An orange juice", note: "Mexico: 'jugo'. (Spain says 'zumo'.)" },
            { es: "Una cerveza, por favor", en: "A beer, please", note: "Casually: 'una chela'." },
            { es: "¿Está muy picante?", en: "Is it very spicy?", note: "Colloquially: '¿pica mucho?'" },
            { es: "Sin chile, por favor", en: "Without chili, please" },
            { es: "La cuenta, por favor", en: "The check, please" }
          ]
        },
        {
          id: "mx-diet", topic: "Dietary needs & allergies", title: "Allergies & Diet",
          reward: "Crucial unlock — you can keep yourself safe at the table. Gluten, begone.",
          items: [
            { es: "Soy alérgico a...", en: "I'm allergic to...", note: "Women: 'alérgica'." },
            { es: "¿Esto lleva...?", en: "Does this contain...?" },
            { es: "Soy celíaco", en: "I'm celiac", note: "Women: 'celíaca'." },
            { es: "Sin gluten", en: "Gluten-free" },
            { es: "¿Tiene harina de trigo?", en: "Does it have wheat flour?" },
            { es: "Soy vegetariano", en: "I'm vegetarian" },
            { es: "Sin cacahuate", en: "Without peanut", note: "Mexico: 'cacahuate'. (Spain: 'cacahuete'.)" },
            { es: "Sin camarón", en: "Without shrimp", note: "Mexico: 'camarón'. (Spain: 'gamba'.)" },
            { es: "Es muy importante", en: "It's very important" },
            { es: "¿Me puede ayudar?", en: "Can you help me?" }
          ]
        },
        {
          id: "mx-money", topic: "Numbers, money & paying", title: "Numbers & Pesos",
          reward: "You can pay, tip, and haggle. Your pesos go further now.",
          items: [
            { es: "uno, dos, tres", en: "one, two, three" },
            { es: "diez", en: "ten" },
            { es: "cincuenta", en: "fifty" },
            { es: "cien", en: "one hundred" },
            { es: "¿Cuánto cuesta?", en: "How much does it cost?" },
            { es: "¿Cuánto es?", en: "How much is it (total)?" },
            { es: "¿Aceptan tarjeta?", en: "Do you accept card?" },
            { es: "En efectivo", en: "In cash" },
            { es: "Es muy caro", en: "It's too expensive" },
            { es: "¿La propina está incluida?", en: "Is the tip included?", note: "Tip ~10–15% in Mexico." }
          ]
        }
      ]
    },
    {
      id: "mx-s3", title: "Getting Around", blurb: "Find your way, take a taxi, check in.",
      lessons: [
        {
          id: "mx-dir", topic: "Directions", title: "Which Way?",
          reward: "Left, right, derecho — you won't get lost in the mercado maze.",
          items: [
            { es: "¿Dónde está...?", en: "Where is...?" },
            { es: "¿Cómo llego a...?", en: "How do I get to...?" },
            { es: "a la derecha", en: "to the right" },
            { es: "a la izquierda", en: "to the left" },
            { es: "derecho", en: "straight ahead", note: "Mexico: 'derecho'. (Spain: 'todo recto'.)" },
            { es: "cerca", en: "near" },
            { es: "lejos", en: "far" },
            { es: "el baño", en: "the bathroom" },
            { es: "la esquina", en: "the corner" },
            { es: "¿Está lejos?", en: "Is it far?" }
          ]
        },
        {
          id: "mx-taxi", topic: "Taxis & rideshare", title: "Taxis & Uber",
          reward: "You can survive a taxi without overpaying. Backseat boss.",
          items: [
            { es: "Lléveme a esta dirección", en: "Take me to this address" },
            { es: "¿Cuánto al centro?", en: "How much to downtown?" },
            { es: "¿Usa taxímetro?", en: "Do you use the meter?" },
            { es: "Pare aquí, por favor", en: "Stop here, please" },
            { es: "al aeropuerto", en: "to the airport" },
            { es: "¿Acepta tarjeta?", en: "Do you take card?" },
            { es: "el sitio de taxis", en: "the taxi stand", note: "Mexico: 'sitio'. Uber/Didi are common too." },
            { es: "Voy con prisa", en: "I'm in a hurry" },
            { es: "¿Está lejos?", en: "Is it far?" }
          ]
        },
        {
          id: "mx-hotel", topic: "Hotel & check-in", title: "Checking In",
          reward: "Check-in conquered. The front desk respects you.",
          items: [
            { es: "Tengo una reservación", en: "I have a reservation", note: "Mexico: 'reservación'. (Spain: 'reserva'.)" },
            { es: "a nombre de...", en: "under the name of..." },
            { es: "¿A qué hora es la salida?", en: "What time is checkout?" },
            { es: "¿Hay wifi?", en: "Is there wifi?" },
            { es: "¿Cuál es la contraseña?", en: "What's the password?" },
            { es: "un cuarto doble", en: "a double room", note: "Mexico: 'cuarto'. ('habitación' also fine.)" },
            { es: "El aire acondicionado no sirve", en: "The AC doesn't work", note: "Mexico: 'no sirve' = doesn't work." },
            { es: "Necesito más toallas", en: "I need more towels" }
          ]
        }
      ]
    },
    {
      id: "mx-s4", title: "Connecting", blurb: "Talk to locals — the reason you came.",
      lessons: [
        {
          id: "mx-talk", topic: "Small talk & bartender", title: "Bar & Small Talk",
          reward: "You can actually talk to people now. Mezcal conversations await.",
          items: [
            { es: "¿De dónde eres?", en: "Where are you from?" },
            { es: "Soy de...", en: "I'm from..." },
            { es: "Mucho gusto", en: "Nice to meet you" },
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
            { es: "¿A cómo?", en: "How much (per unit)?", note: "Classic market phrase for prices." },
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
    {
      id: "mx-s5", title: "Safety Net", blurb: "Covered if something goes wrong.",
      lessons: [
        {
          id: "mx-help", topic: "Problems & emergencies", title: "Help & Emergencies",
          reward: "The safety net is in place. Now go enjoy Oaxaca — you're covered.",
          items: [
            { es: "Ayuda", en: "Help" },
            { es: "Necesito un médico", en: "I need a doctor" },
            { es: "Llame a la policía", en: "Call the police", note: "Emergency number in Mexico is 911." },
            { es: "Me robaron", en: "I was robbed" },
            { es: "No me siento bien", en: "I don't feel well" },
            { es: "¿Habla inglés?", en: "Do you speak English?" },
            { es: "Perdí mi pasaporte", en: "I lost my passport" },
            { es: "¿Dónde está la farmacia?", en: "Where's the pharmacy?" },
            { es: "Es una emergencia", en: "It's an emergency" },
            { es: "Me duele aquí", en: "It hurts here" }
          ]
        }
      ]
    }
  ]
};

if (typeof module !== "undefined") module.exports = MEXICO_PACK;
