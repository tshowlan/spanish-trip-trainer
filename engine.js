/* ---------- content packs (one per country; each fully bespoke) ----------
   Register a new destination = add a content_<cc>.js pack + an entry here +
   a DESTINATIONS entry. Each pack owns its scenarios, vocab, and TTS accent. */
const CONTENT = {
  spain:  { key: "spain",  dialect: "Castilian Spanish", tts: "es-ES", stages: CURRICULUM.stages },
  mexico: { key: "mexico", dialect: "Mexican Spanish",   tts: "es-MX", stages: (typeof MEXICO_PACK !== "undefined" ? MEXICO_PACK.stages : CURRICULUM.stages) }
};
function activePack() { return CONTENT[state.active] || CONTENT.spain; }

/* ---------- deck (active country's pack, filtered/augmented by the profile) ---------- */
let DECK, LESSON_ORDER, ALL_ITEMS;

function meetsReq(lesson, p) {
  if (!lesson.requires) return true;
  if (lessonDone(lesson.id)) return true;     // never hide a lesson you've already finished
  if (!p) return false;                       // hide conditional lessons until onboarded
  if (lesson.requires.lodging)   return (p.lodging || []).includes(lesson.requires.lodging);
  if (lesson.requires.transport) return (p.transport || []).includes(lesson.requires.transport);
  return true;
}
function buildAllergyLesson(keys) {
  const items = [{ es: "Tengo una alergia", en: "I have an allergy" }];
  keys.forEach(k => {
    const a = ALLERGENS.find(x => x.key === k);
    if (a) items.push({ es: `Soy alérgico ${a.frag}`, en: `I'm allergic to ${a.en}`, note: 'Women say "alérgica".' });
  });
  items.push({ es: "¿Esto lleva frutos secos?", en: "Does this contain nuts?" });
  items.push({ es: "Sin frutos secos, por favor", en: "Without nuts, please" });
  return {
    id: "personal-allergies", topic: "Your group · Allergies", title: "Your Allergies",
    reward: "Crucial unlock: you can warn a waiter before disaster. Safety first, tapas second.",
    items
  };
}
function rebuildDeck() {
  const p = state.profile;
  DECK = { stages: [] };
  activePack().stages.forEach(st => {
    DECK.stages.push(Object.assign({}, st, { lessons: st.lessons.filter(l => meetsReq(l, p)) }));
  });
  if (p && p.allergies && p.allergies.length && DECK.stages[0]) {
    const s0 = DECK.stages[0];                 // inject the personalized allergy lesson early
    s0.lessons.splice(Math.min(1, s0.lessons.length), 0, buildAllergyLesson(p.allergies));
  }
  LESSON_ORDER = []; ALL_ITEMS = [];
  DECK.stages.forEach(st => st.lessons.forEach(l => {
    LESSON_ORDER.push(l.id); l.items.forEach(it => ALL_ITEMS.push(it));
  }));
}

function lessonDone(id) { return !!state.lessons[id]; }
function lessonUnlocked(id) {
  const i = LESSON_ORDER.indexOf(id);
  return i === 0 || lessonDone(LESSON_ORDER[i - 1]);
}

/* ---------- streak ---------- */
function registerActivity() {
  const t = todayStr();
  if (!state.history.includes(t)) state.history.push(t);
  if (state.lastActive === t) return;
  const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  state.streak = state.lastActive === yest ? state.streak + 1 : 1;
  state.lastActive = t;
}
