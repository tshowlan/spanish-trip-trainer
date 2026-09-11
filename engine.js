/* ---------- content packs (one per country; each fully bespoke) ----------
   Register a new destination = add a content_<cc>.js pack + an entry here +
   a DESTINATIONS entry. Each pack owns its scenarios, vocab, and TTS accent. */
const CONTENT = {
  spain:  { key: "spain",  dialect: "Castilian Spanish", tts: "es-ES", stages: CURRICULUM.stages, scenes: CURRICULUM.scenes || [], glueGloss: CURRICULUM.glueGloss || {} },
  mexico: { key: "mexico", dialect: "Mexican Spanish",   tts: "es-MX", stages: (typeof MEXICO_PACK !== "undefined" ? MEXICO_PACK.stages : CURRICULUM.stages), scenes: (typeof MEXICO_PACK !== "undefined" && MEXICO_PACK.scenes) || [] }
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
/* THE CHOSEN AGREEMENT (ruling 2026-09-06): variants that carry -o / -a agreement surface only
   in the form the learner chose at intake; neutral drops both. v1 keys off the pack's known
   gendered stems; new stems join this list as they are authored. */
const AGREEMENT_FORMS = { o: /\b(alérgico|vegetariano|celíaco|cansado|listo|seguro)\b/i, a: /\b(alérgica|vegetariana|celíaca|cansada|lista|segura)\b/i };
function chosenVariants(item) {
  const vs = item.variants || [];
  const g = (state.profile || {}).grammar || "neutral";
  return vs.filter(v => {
    const isO = AGREEMENT_FORMS.o.test(v), isA = AGREEMENT_FORMS.a.test(v);
    if (!isO && !isA) return true;                                 // not a gendered form: always fine
    return g === "o" ? isO : g === "a" ? isA : false;
  });
}
function buildAllergyLesson(keys) {
  const items = [{ es: "Tengo una alergia", en: "I have an allergy" }];
  keys.forEach(k => {
    const a = ALLERGENS.find(x => x.key === k);
    // NEUTRAL PRIMARY, CHOSEN VARIANT (2026-09-06): one automatic form under stress, safety-grade;
    // the agreement forms ride as variants (the intake grammar field will pick which shows)
    if (a) {
      const g = (state.profile || {}).grammar;
      const note = g === "o" ? `Also: Soy alérgico ${a.frag}.` : g === "a" ? `Also: Soy alérgica ${a.frag}.` : "Also: soy alérgico or alérgica, whichever matches you.";
      items.push({ es: `Tengo alergia ${a.frag}`, en: `I have an allergy to ${a.en}`, variants: [`Soy alérgico ${a.frag}`, `Soy alérgica ${a.frag}`], note });
    }
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
    { es: "No como carne", en: "I don't eat meat", variants: ["Soy vegetariano", "Soy vegetariana"], note: "Also: soy vegetariano or vegetariana. No como carne works for everyone." },
    { es: "¿Esto lleva carne?", en: "Does this have meat?" },
    { es: "¿Tienen algo sin carne?", en: "Do you have anything without meat?" });
  if (needs.includes("gluten_free")) items.push(
    { es: "No puedo comer gluten", en: "I can't eat gluten", variants: ["Soy celíaco", "Soy celíaca"], note: "Also: soy celíaco or celíaca. No puedo comer gluten works for everyone." },
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
  const stageCount = level === "confident" ? 3 : 2;   // Stage 0 (kit) always seeds with pass 1: some → kit+pass1; confident → +pass2
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
/* THE BEGINNING OF THE JOURNEY (rulings 2026-09-11, STAGED "journey-1"):
   - RULING 1: seven machine lessons become four room lessons - Asking for things · 1 (Want +
     Bring), Asking for things · 2 (Need, solo, full arc), Finding out · 1 (Find + There),
     Finding out · 2 (Price + When).
   - RULING 4: any kit over 8 phrases splits into halves of 6-7 by authored order ("· 1" / "· 2").
   - THE FIRST TEN: kit halves and rooms alternate so no two consecutive sessions share a shape. */
function _journeyOneDeck(deck) {
  const byFrame = re => s0.lessons.find(l => l.machine && l.frame && re.test(l.frame));
  const s0 = deck.stages[0]; if (!s0) return;
  const room = (id, title, roomName, label, mls) => ({
    id, title, room: roomName, label, machines: mls, topic: mls[0].topic, machineRoom: true,
    items: mls.flatMap(l => l.items || []), beat: mls.map(l => l.beat).filter(Boolean).join(" "), replies: []
  });
  const want = byFrame(/^quiero/), bring = byFrame(/traer/), need = byFrame(/^necesito/);
  const find = byFrame(/d[o\u00f3]nde/), there = byFrame(/^\u00bfhay/), price = byFrame(/cuesta/), when = byFrame(/hora/);
  const rooms = [];
  if (want && bring) rooms.push(room("room-asking-1", "Asking for things \u00b7 1", "Asking for things", "MACHINES: WANT \u00b7 BRING", [want, bring]));
  if (find && there) rooms.push(room("room-finding-1", "Finding out \u00b7 1", "Finding out", "MACHINES: FIND \u00b7 THERE", [find, there]));
  if (need) rooms.push(Object.assign({}, need, { id: "room-asking-2", title: "Asking for things \u00b7 2", room: "Asking for things", label: "MACHINES: NEED" }));
  if (price && when) rooms.push(room("room-finding-2", "Finding out \u00b7 2", "Finding out", "MACHINES: PRICE \u00b7 WHEN", [price, when]));
  // kit halves, every stage
  const split = l => {
    if (l.chain || l.machine || !(l.items || []).length || l.items.length <= 8) return [l];
    const h = Math.ceil(l.items.length / 2);
    return [Object.assign({}, l, { id: l.id + "-1", title: l.title + " \u00b7 1", items: l.items.slice(0, h) }),
            Object.assign({}, l, { id: l.id + "-2", title: l.title + " \u00b7 2", items: l.items.slice(h), primer: null })];
  };
  deck.stages.forEach(st => { st.lessons = st.lessons.flatMap(split); });
  // stage 0: interleave kit halves with rooms
  const kits = s0.lessons.filter(l => !l.machine);
  const out = []; let ri = 0;
  kits.forEach((k, i) => { out.push(k); if (rooms[ri] && i % 1 === 0) out.push(rooms[ri++]); });
  while (ri < rooms.length) out.push(rooms[ri++]);
  s0.lessons = out;
}
function rebuildDeck() {
  const p = state.profile;
  DECK = { stages: [] };
  activePack().stages.forEach(st => {
    DECK.stages.push(Object.assign({}, st, { lessons: st.lessons.filter(l => meetsReq(l, p)) }));
  });
  if (typeof isStaged === "function" && isStaged("journey-1")) _journeyOneDeck(DECK);   // STAGED: rooms + kit halves
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
