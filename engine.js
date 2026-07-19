/* ---------- content packs (one per country; each fully bespoke) ----------
   Register a new destination = add a content_<cc>.js pack + an entry here +
   a DESTINATIONS entry. Each pack owns its scenarios, vocab, and TTS accent. */
const CONTENT = {
  spain:  { key: "spain",  dialect: "Castilian Spanish", tts: "es-ES", stages: CURRICULUM.stages },
  mexico: { key: "mexico", dialect: "Mexican Spanish",   tts: "es-MX", stages: (typeof MEXICO_PACK !== "undefined" ? MEXICO_PACK.stages : CURRICULUM.stages) }
};
function activePack() { return CONTENT[state.active] || CONTENT.spain; }

/* ---------- deck (active country's pack, filtered/augmented by the profile) ---------- */
let DECK, LESSON_ORDER, ALL_ITEMS, ITEM_INDEX;

// deterministic, url-safe slug of a Spanish string (for auto item IDs)
function slug(s) {
  return norm(s).replace(/[^a-z0-9 ]/g, "").trim().replace(/\s+/g, "-").slice(0, 40) || "item";
}

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
// §2/§5 personalization spec: veg / gluten-free get their own safety lesson, cloning the allergy pattern
function buildDietaryLesson(needs) {
  const items = [];
  if (needs.includes("vegetarian")) items.push(
    { es: "Soy vegetariano", en: "I'm vegetarian", note: 'Women say "vegetariana".' },
    { es: "¿Esto lleva carne?", en: "Does this have meat?" },
    { es: "¿Tienen algo sin carne?", en: "Do you have anything without meat?" });
  if (needs.includes("gluten_free")) items.push(
    { es: "Soy celíaco", en: "I'm celiac / gluten-free", note: 'Women say "celíaca".' },
    { es: "¿Esto lleva gluten?", en: "Does this contain gluten?" },
    { es: "¿Tienen algo sin gluten?", en: "Do you have anything gluten-free?" });
  if (!items.length) return null;
  return {
    id: "personal-dietary", topic: "Your group · Dietary", title: "Your Dietary Needs",
    reward: "You can keep every meal on-plan without a translation app mid-order.", items
  };
}
// §4 personalization spec: skill level → entry depth. Seed known stages as review-strength items
// (moderate strength, S≈7) so they count honestly toward scores and the map starts further in. A
// failed review resets an item's strength and reopens the tree below it — the SRS self-corrects.
function seedPlacement(level) {
  if (!level || level === "new") return;
  const stageCount = level === "confident" ? 2 : 1;   // some → stage 0; confident → stages 0-1
  const now = new Date().toISOString();
  state.learn = state.learn || {}; state.lessons = state.lessons || {};
  (DECK ? DECK.stages : []).slice(0, stageCount).forEach(st => st.lessons.forEach(l => {
    if (l.bonus || l.id.indexOf("personal-") === 0) return;   // never pre-seed safety (allergy/dietary) lessons
    if (!state.lessons[l.id]) state.lessons[l.id] = { stars: 2, at: now, seeded: true };   // start past this stage
    l.items.forEach(it => {
      const id = it.id; if (!id || state.learn[id]) return;                                  // never overwrite real history
      state.learn[id] = {
        // §1b.5: seed LADDER state, not just strength — exposures:4 = recognition-cleared, scaffold-ready
        // (never presentation-carded), with reduced S≈7 stability so the claim survives its first review.
        exposures: 4, streak: 1, lapses: 0, interval: 7, ease: 2.3,
        lastSeen: todayStr(), lastCorrect: todayStr(), due: _dateAdd(todayStr(), 7),
        axes: { production: 0, cold: 0, native: 0, chained: 0 }, seeded: true
      };
    });
  }));
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
  if (p && p.needs && (p.needs.includes("vegetarian") || p.needs.includes("gluten_free")) && DECK.stages[0]) {
    const dl = buildDietaryLesson(p.needs);    // veg / gluten-free safety lesson, right after allergies
    if (dl) DECK.stages[0].lessons.splice(Math.min(2, DECK.stages[0].lessons.length), 0, dl);
  }
  LESSON_ORDER = []; ALL_ITEMS = []; ITEM_INDEX = {};
  const packKey = activePack().key;
  DECK.stages.forEach(st => st.lessons.forEach(l => {
    LESSON_ORDER.push(l.id);
    l.items.forEach(it => {
      // normalize pass: give every item a stable, deterministic id (authored id wins).
      // Identity is the PHRASE (pack:slug), not its lesson — so a phrase keeps its SRS
      // history when it moves lessons (required for the tiered-spiral restructure).
      if (!it.id) {
        const base = `${packKey}:${slug(it.es)}`;
        let id = base, n = 2;
        while (ITEM_INDEX[id] && ITEM_INDEX[id] !== it) { id = `${base}-${n++}`; console.warn("Tripfluent: duplicate item id", base); }
        it.id = id;
      }
      ITEM_INDEX[it.id] = it;
      ALL_ITEMS.push(it);
    });
  }));
}

// A lesson is done if it was completed in the flow (stored) OR every phrase in it has been recalled
// correctly at least once. The derived half means the Phase-B reshuffle never shows a lesson whose
// phrases you've mastered as "incomplete" — no migration, nothing persisted, and it can't mark a
// lesson falsely complete (all items correct ⇒ genuinely done). Works per active trip via DECK.
function lessonDone(id) { return !!state.lessons[id] || lessonMastered(id); }
function lessonMastered(id) {
  for (const st of (DECK ? DECK.stages : [])) for (const l of st.lessons) {
    if (l.id !== id) continue;
    return l.items.length > 0 && l.items.every(it => { const s = state.learn && state.learn[it.id]; return s && s.lastCorrect; });
  }
  return false;
}
// §1.2: passes are pacing GUIDANCE, never locks — the exposure ladder + first-pass cap protect an
// eager learner who jumps ahead. Nothing is ever gated; the map nudges via recommendedLessonId().
function lessonUnlocked() { return true; }
function passLessonsVisible(passNum) {                 // conditionals are already filtered from DECK by profile
  const st = (DECK ? DECK.stages : []).find(s => s.pass === passNum);
  return st ? st.lessons.filter(l => !l.bonus) : [];
}
function passCompletion(passNum) {
  const ls = passLessonsVisible(passNum);
  return ls.length ? ls.filter(l => lessonDone(l.id)).length / ls.length : 1;
}
function recommendedLessonId() {                       // first not-done, non-bonus lesson in pass order
  for (const st of (DECK ? DECK.stages : [])) for (const l of st.lessons)
    if (!l.bonus && !lessonDone(l.id)) return l.id;
  return null;
}

/* ---------- streak ---------- */
function registerActivity() {
  const t = todayStr();
  if (!state.history.includes(t)) state.history.push(t);
  if (state.lastActive === t) return;
  const yest = daysAgoStr(1);
  state.streak = state.lastActive === yest ? state.streak + 1 : 1;
  state.lastActive = t;
}
