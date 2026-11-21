/* ---------- content packs (one per country; each fully bespoke) ----------
   Register a new destination = add a content_<cc>.js pack + an entry here +
   a DESTINATIONS entry. Each pack owns its scenarios, vocab, and TTS accent. */
const CONTENT = {
  spain:  { key: "spain",  dialect: "Castilian Spanish", tts: "es-ES", stages: CURRICULUM.stages, scenes: CURRICULUM.scenes || [], glueGloss: CURRICULUM.glueGloss || {}, agreementForms: CURRICULUM.agreementForms || {}, allergySlots: CURRICULUM.allergySlots || {}, stockReplies: CURRICULUM.stockReplies || {}, flow: CURRICULUM.flow || null },
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
  // RETIRED FOR A PACK THAT WRITES ITS OWN (chat 11/18; shipped v634 as trip-celiac): Spain's allergy lines live in Table sentences, keyed and in the
  // sentence shape (the pack's allergy templates, filled from allergySlots). A pack with no allergySlots (Mexico, catch-up) keeps this generated
  // session exactly as it was, nuts lines and all, so shipping Spain's lines takes nothing from a Mexico learner.
  if (typeof isStaged === "function" && isStaged("trip-celiac") && activePack().allergySlots) return null;
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
  if (typeof isStaged === "function" && isStaged("trip-celiac") && activePack().allergySlots) return null;   // retired where the pack writes its own lines (Spain: chat 11/17 gluten, 11/18 vegetarian); Mexico keeps it
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
// The intake's auto-seeding (seedPlacement: level quiz → entry depth) was RETIRED 2026-10-31 (Tom): everyone starts
// at zero and marks sessions Known on the Learn tab; records seeded before that date keep their `seeded` flag.
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
  // THE CHAPTER FLOW (SHIPPED v344): the words become chapter one, the rooms chapter two
  if (typeof isStaged === "function" && isStaged("chapter-flow") && activePack().flow) { _chapterFlowDeck(deck, rooms); deck.stages.forEach(st => { st.lessons = st.lessons.flatMap(_splitKit); }); return; }
  // kit halves, every stage
  deck.stages.forEach(st => { st.lessons = st.lessons.flatMap(_splitKit); });
  // stage 0: interleave kit halves with rooms
  const kits = s0.lessons.filter(l => !l.machine);
  const out = []; let ri = 0;
  kits.forEach((k, i) => { out.push(k); if (rooms[ri] && i % 1 === 0) out.push(rooms[ri++]); });
  while (ri < rooms.length) out.push(rooms[ri++]);
  s0.lessons = out;
}
function _splitKit(l) {                                  // ruling 4: kits over 8 phrases run as halves
  if (l.noSplit || (l.numbers && typeof isStaged === "function" && isStaged("numbers-1"))) return [l];   // the pack may keep a session whole; numbers are met as a set
  if (l.chain || l.machine || l.machines || !(l.items || []).length || l.items.length <= 8) return [l];
  // WHOLE UP TO THE PACK'S NUMBER, THEN CUT WHERE IT MEANS SOMETHING (Tom 11/18, under trip-celiac): Table words with one dietary word was nine and
  // split 5 and 4 down the middle (two table words and two dietary ones in a four-word Part 2). A session marked `splitOver: N` stays one
  // session up to N words (Street words is whole at ten, Tom 9/20); past N, Part 1 is the session's own words and Part 2 the learner's
  // dietary ones, the words that keep you safe.
  const keyed = !!l.splitOver && typeof isStaged === "function" && isStaged("trip-celiac");
  if (keyed && l.items.length <= l.splitOver) return [l];
  let items = l.items, h = l.splitAt || Math.ceil(l.items.length / 2);      // the pack may name the cut, so a pair is never split
  if (keyed) { const own = l.items.filter(i => !i.diet), diet = l.items.filter(i => i.diet); if (own.length && diet.length) { items = own.concat(diet); h = own.length; } }
  const t = l.title.replace(/ [\u00b7·] (Part )?\d$/, "");   // a titled half never reads "· 1 · 1"
  const P = (typeof isStaged === "function" && isStaged("learn-peek")) ? "Part " : "";   // "First words · Part 1" (Tom 9/21: the bare digit said too little)
  const L = l.lines || [];
  return [Object.assign({}, l, { id: l.id + "-1", title: t + " \u00b7 " + P + "1", items: items.slice(0, h), line: L[0] || l.line }),
          Object.assign({}, l, { id: l.id + "-2", title: t + " \u00b7 " + P + "2", items: items.slice(h), primer: null, line: L[1] || l.line })];
}
/* THE CHAPTER FLOW (Tom 2026-09-16/17, chat's pass 9/17; STAGED "chapter-flow"). Arranges the pack's `flow`
   data: stage 0 = THE WORDS (the pack's word sessions; a word that already lives in the pack REUSES that
   item, so notes, variants and SRS history carry); stage 1 = YOUR FIRST SENTENCES (the four rooms);
   stage 2 = SENTENCES BY PLACE (today's chapters 1 and 2, in order; phrases the old kit held that are not
   words are re-homed there, none is lost); stage 3 = CONVERSATIONS. The engine arranges; the pack holds
   every word (content/engine separation). */
function _chapterFlowDeck(deck, rooms) {
  const flow = activePack().flow, p = state.profile || {};
  const bySlug = new Map();
  activePack().stages.forEach(st => st.lessons.forEach(l => (l.items || []).forEach(it => { const k = slug(it.es); if (!bySlug.has(k)) bySlug.set(k, it); })));
  const made = new Map();
  const mk = d => {
    const k = (d.card ? "card:" : "") + slug(d.es); if (made.has(k)) return made.get(k);   // a card is its own object, never the sentence that shares its phrase (Está bien así, 11/5)
    const base = Object.assign({}, bySlug.get(k) || {});
    delete base.note; delete base.anchor;                // margin notes were written for the phrase's OLD seat ("Pongo again..."); chapter one shows only what its own data says (Tom 9/20)
    const it = Object.assign({ tier: 1 }, base, d); made.set(k, it); return it;
  };
  // SIN GLUTEN IS FOR THOSE WHO NEED IT (Tom 11/17, under trip-celiac): the dietary carrier lines (marked `dietary`: the sentences the variants ride)
  // reach only a learner whose own answer they can be said in, and the word sin gluten (`keyed: "gluten"`) only a
  // gluten-free or celiac learner. Before, every learner got the word and five gluten sentences. Sin itself still reaches everyone through sin gas.
  const celiacOn = typeof isStaged === "function" && isStaged("trip-celiac");
  const needsEff = (p.needs || []).concat(celiacOn && (p.allergies || []).includes("gluten") ? ["gluten_free"] : []);   // gluten chosen under allergies, before the Celiac chip existed, counts as the gluten-free need
  const glutenAnswer = needsEff.some(n => n === "gluten_free" || n === "celiac");   // a learner who chose gluten under allergies before the Celiac chip existed is a gluten learner
  // THE SWEEP RULE (chat 11/19, supersedes the 10/28 carrier rules): a "sin ___" line exists only where Spain itself labels food that way. The old
  // carriers (marked `keyed: "gluten"`) are the gluten learner's own lines and nothing is slot-swapped: lactose and vegetarian have their own written
  // lines, and an allergy has none (its sweep is the allergen menu). The 10/28 slot variants ("dietary-variants") were DECLINED and removed at v634.
  const realAllergies = (p.allergies || []).filter(k => !(celiacOn && k === "gluten"));
  const lactoseNeed = celiacOn && (p.needs || []).includes("lactose_free");
  const keyedOut = d => celiacOn && d.keyed === "gluten" && !glutenAnswer;
  // who an item is for: any of its keys matching (`allergies` and `needs` take one key or a list; `anyAllergy` is any real allergy at all)
  const fitsProfile = pr => { const A = p.allergies || []; return (pr.allergies ? [].concat(pr.allergies).some(k => A.includes(k)) : false) || (pr.needs ? [].concat(pr.needs).some(n => needsEff.includes(n)) : false) || (pr.anyAllergy ? realAllergies.length > 0 : false); };
  const fits = d => !keyedOut(d) && (!d.profile || fitsProfile(d.profile));
  // THE AGREEMENT FORMS (chat 11/17, celiac): an item marked `forms: "<set>"` is rewritten for the learner's adjective answer from the pack's own
  // table (`agreementForms[set].a` / `.neutral`: pairs replaced across every string of the item; -o is the form the pack writes). Pure data in the pack.
  const formSets = activePack().agreementForms || {};
  const form = d => { const g = ({ o: null, a: "a" })[p.grammar] === undefined ? "neutral" : ({ o: null, a: "a" })[p.grammar]; const reps = d.forms && g && formSets[d.forms] && formSets[d.forms][g]; return reps ? JSON.parse(reps.reduce((t, [a, b]) => t.split(a).join(b), JSON.stringify(d))) : d; };
  // THE ALLERGY LINES (chat 11/18, batch 2b): the pack writes them once as templates in Table sentences (`allergy: "each" | "all" | "first"`) and
  // this fills them from the pack's allergySlots for the learner's own allergies, in the order they chose them (the first is the primary).
  // each: one item per allergen (¿Lleva ___?). all: one item naming every allergy (the declaring line: y for two, commas then y for more;
  // English with the Oxford comma). first: the primary only. A learner with no allergy gets none. Gluten is never an allergy here.
  const aSlots = activePack().allergySlots || {};
  const myAllergies = celiacOn ? realAllergies.filter(k => aSlots[k]) : [];
  const joinEs = xs => xs.length <= 1 ? (xs[0] || "") : xs.slice(0, -1).join(", ") + " y " + xs[xs.length - 1];
  const joinEn = xs => xs.length <= 2 ? xs.join(" and ") : xs.slice(0, -1).join(", ") + ", and " + xs[xs.length - 1];
  const fillAllergy = (d, k) => {
    const sl = aSlots[k], map = { "{es}": sl.es, "{a}": sl.a, "{en}": sl.en, "{other}": sl.other || "", "{allA}": joinEs(myAllergies.map(x => aSlots[x].a)), "{allEn}": joinEn(myAllergies.map(x => aSlots[x].en)) };
    const o = JSON.parse(Object.keys(map).reduce((t, ph) => t.split(ph).join(map[ph]), JSON.stringify(d)));
    if (d.slotNote) { if (sl.hide) o.note = sl.hide; else delete o.note; }   // where this allergen hides, when the pack is certain of it (chat 11/19)
    delete o.allergy; delete o.slotNote; o.diet = true; o.fresh = true; return o;   // fresh: its own item, never the old pack's line that shares the phrase (that one kept its old English)
  };
  const expand = d => !d.allergy ? [d] : !myAllergies.length ? [] : d.allergy === "each" ? myAllergies.map(k => fillAllergy(d, k)) : [fillAllergy(d, myAllergies[0])];
  // ONE ¿Lleva ___? CARD PER LEARNER (chat 11/18): the slot is their first dietary answer in the intake's order (the needs, then the allergies)
  const firstDiet = !celiacOn ? null : glutenAnswer ? "gluten" : (p.needs || []).includes("vegetarian") ? "vegetarian" : myAllergies.length ? "allergy" : null;
  const cardMine = d => !d.llevaCard || d.llevaCard === firstDiet;
  const dietMark = d => (d.keyed || d.profile || d.forms || d.diet) ? Object.assign({}, d, { diet: true }) : d;   // a learner's own dietary lines (Learn's Topics gathers them)
  const numbersOn = typeof isStaged === "function" && isStaged("numbers-1");
  const partWord = t => (typeof isStaged === "function" && isStaged("learn-peek")) ? t.replace(/ ([\u00b7·]) (\d)$/, " $1 Part $2") : t;
  const glutenNeed = celiacOn && glutenAnswer;
  const lineFor = w => (w.lineProfile && w.lineProfile.allergies && ((p.allergies || []).length || glutenNeed || lactoseNeed)) ? w.lineProfile.allergies : w.line;   // profile-keyed lines (Table words)
  const live = d => (!d.staged || (typeof isStaged === "function" && isStaged(d.staged))) && !(d.until && typeof isStaged === "function" && isStaged(d.until));   // "until": the seat it gives up when a staged swap is on   // a session or a word may wait behind a switch (chapter-1-adds)
  const words = flow.words.filter(w => (numbersOn || w.numbers !== "ear") && live(w)).map(w => Object.assign({}, w, { title: partWord(w.title), line: lineFor(w), primer: null })).map(w => Object.assign({ primer: null, replies: [] }, w, { wordsSession: !w.sounds, items: w.sounds ? w.items.slice() : w.items.filter(fits).filter(live).map(form).map(mk).map(it => { if (it.profile || it.keyed) it.diet = true; return it; }) }));   // a sounds session carries key sounds, not words
  const old = deck.stages;
  // no phrase is lost: what the old kit held that is not a word re-homes into a later lesson
  (old[0] ? old[0].lessons : []).filter(l => !l.machine).forEach(l => {
    const later = old.slice(1).flatMap(st => st.lessons);
    (l.items || []).filter(it => !made.has(slug(it.es))).forEach(o => {
      const target = later.find(x => x.id === ((flow.rehomeItems || {})[o.es] || (flow.rehome || {})[l.id]));
      if (target && !(target.items || []).some(t => slug(t.es) === slug(o.es))) target.items = (target.items || []).concat([o]);
    });
  });
  // a word met in chapter one IS the same item when a later lesson carries it (one identity, one history)
  old.slice(1).forEach(st => st.lessons.forEach(l => { l.items = (l.items || []).map(it => made.get(slug(it.es)) || it); }));
  const asks = (flow.asks || []).filter(live).map(w => Object.assign({ primer: null, replies: [] }, w, { wordsSession: true, asks: true, items: w.items.filter(live).map(d => (w.replySet && made.has(slug(d.es))) ? made.get(slug(d.es)) : Object.assign({ tier: 1 }, d)) }));
  const sentences = (flow.sentences || []).filter(live).map(w => Object.assign({ primer: null, replies: [] }, w, { line: (w.lineSwap && isStaged(w.lineSwap.staged)) ? w.lineSwap.line : w.line, examples: (w.lineSwap && isStaged(w.lineSwap.staged) && w.lineSwap.examples) || w.examples, items: w.items.filter(live).flatMap(expand).filter(cardMine).filter(fits).map(form).map(dietMark).map(d => {   /* a staged swap (the trip notes, 11/16): an item's `swap: { staged, replies, note, owe }` or a session's `lineSwap: { staged, line }` replaces those fields while its switch is on */ const k = (d.card ? "card:" : "") + slug(d.es), sw = (d.swap && isStaged(d.swap.staged)) ? d.swap : null, own = { replies: (sw && sw.replies) || (isStaged("reply-sets") && d.replies2) || d.replies, owe: (sw && sw.owe) || d.owe || null, diet: !!d.diet, tid: d.tid || null, ex: d.ex || null, exLead: !!d.exLead, hint: d.hint, near: d.near, frame: d.frame, note: (sw && sw.note) || d.note || null, place: w.place || null, sentence: !d.card }; if (made.has(k)) return Object.assign(made.get(k), own); const ex = !d.fresh && bySlug.get(k); if (ex) return Object.assign(ex, own); return Object.assign(mk(d), own, { tier: 1 }); }) }));   // a new sentence carries its place too   // the session's own fields (its frame, near misses, replies, hint) ride on the reused object   // sentences by place (Tom 10/24): a sentence the pack already holds IS that item (the object itself, one id, one history)
  // THE TABLE'S PART 2 (chat 11/20, under trip-celiac; the rule Tom set for Table words): a session marked `dietPart: { min, line }` whose learner
  // has `min` or more of their own keyed sentences in it runs as two rows: Part 1 is everyone's session, Part 2 the learner's own lines alone, with
  // their cards opening it. Fewer stay woven in. Part 1 keeps the session's id (its history and Stats place); Part 2 is id + "-2". The row's
  // examples come from the items' own `ex` words, the declaring line's first.
  const dietSplit = w => {
    if (!celiacOn || !w.dietPart) return [w];
    const own = w.items.filter(it => it.diet), rest = w.items.filter(it => !it.diet);
    if (own.filter(it => !it.card).length < w.dietPart.min || !rest.length) return [w];   // the pack's number (the Table: two or more, chat 11/20c)
    // the four moves' order inside Part 2: say it (the declaring line and its card), ask the dish (¿Lleva?), then the rest as the pack has them
    const leadFrames = new Set(own.filter(it => it.exLead).map(it => it.frame));
    const rank = it => (it.exLead || (it.card && leadFrames.has(it.frame))) ? 0 : it.frame === "lleva" ? 1 : 2;
    own.sort((a, b) => rank(a) - rank(b));   // stable: equal ranks keep the pack's order
    const exOf = list => list.flatMap(it => [].concat(it.ex || []));
    const examples = [...new Set(exOf(own.filter(it => it.exLead)).concat(exOf(own.filter(it => !it.exLead))))].slice(0, 6);
    const base = w.title.replace(/ [\u00b7·] (Part )?\d$/, "");
    // THE ROW'S NAME (chat 11/20, batch 3): the numbered parts are everyone's, so a pack may name the learner's own row (`dietPart.title`).
    // Named, the session keeps its own title and the row carries the name, after it.
    const named = w.dietPart.title || null;
    return [Object.assign({}, w, { title: named ? w.title : base + " \u00b7 Part 1", items: rest }),
            Object.assign({}, w, { id: w.id + "-2", title: named || base + " \u00b7 Part 2", items: own, line: w.dietPart.line, examples, primer: null })];
  };
  const order = flow.rooms || [];
  // THE ROOMS RETIRE WITH THE LAST PLACE (Tom 10/24 ruling; done 11/3 when Tom met a room's machine weld in review): once the Street,
  // Shop, Help, and Paying sessions exist (sentences-3), the four rooms leave chapter 2 and the deck; their phrases live on as place sentences
  const roomList = (typeof isStaged === "function" && isStaged("sentences-3")) ? [] : rooms.slice().sort((a, b) => (order.indexOf(a.id) + 1 || 99) - (order.indexOf(b.id) + 1 || 99));
  const t = flow.chapters || [], b = flow.blurbs || [];
  deck.stages = [
    Object.assign({}, old[0], { pass: 0, title: t[0] || "The words", blurb: b[0] || "", lessons: words }),
    { id: "sp-first-sentences", pass: 1, title: t[1] || "The sentences that get things done", blurb: b[1] || "", lessons: asks.concat(sentences.flatMap(dietSplit), roomList) },   // the asks open the chapter, the rooms practice them
    Object.assign({}, old[1] || {}, { pass: 2, title: t[2] || "Sentences by place", blurb: b[2] || "", lessons: (old[1] ? old[1].lessons : []).concat(old[2] ? old[2].lessons : []) }),
  ].concat(old.slice(3).map((st, i) => Object.assign({}, st, { pass: 3 + i, title: i === 0 ? (t[3] || st.title) : st.title, blurb: i === 0 ? (b[3] || "") : st.blurb })));
  // THE OLD CHAPTERS OFF (Tom 11/6, STAGED "old-chapters-off"): passes 2 and up are the old curriculum (Where's the loo, Taxi!, Dinner at
  // Rosa's), 183 items shown as chapters 3 and 4 and counted against Coverage with no credit. Until chapter 3 is written they leave the
  // deck: not on Learn, not in Coverage or Retention. A learner's history on their words keeps (state.learn is untouched).
  if (typeof isStaged === "function" && isStaged("old-chapters-off")) deck.stages = deck.stages.filter(st => st.pass <= 1);
}
function rebuildDeck() {
  const p = state.profile;
  DECK = { stages: [] };
  activePack().stages.forEach(st => {
    DECK.stages.push(Object.assign({}, st, { lessons: st.lessons.filter(l => meetsReq(l, p)).map(l => Object.assign({}, l)) }));
  });
  if (typeof isStaged === "function" && isStaged("journey-1")) _journeyOneDeck(DECK);   // STAGED: rooms + kit halves
  if (p && p.allergies && p.allergies.length && DECK.stages[0]) {
    const flowOn = DECK.stages[1] && DECK.stages[1].id === "sp-first-sentences";   // chapter flow: the safety lesson follows the rooms until The asks carries its frame
    const s0 = flowOn ? DECK.stages[1] : DECK.stages[0];                 // inject the personalized allergy lesson early
    const al = buildAllergyLesson(p.allergies); if (al) s0.lessons.splice(flowOn ? s0.lessons.length : Math.min(1, s0.lessons.length), 0, al);
  }
  if (p && p.needs && (p.needs.includes("vegetarian") || p.needs.includes("gluten_free")) && DECK.stages[0]) {
    const dl = buildDietaryLesson(p.needs);    // veg / gluten-free safety lesson, right after allergies
    const flowOn2 = DECK.stages[1] && DECK.stages[1].id === "sp-first-sentences";
    if (dl) { const tgt = flowOn2 ? DECK.stages[1] : DECK.stages[0]; tgt.lessons.splice(flowOn2 ? tgt.lessons.length : Math.min(2, tgt.lessons.length), 0, dl); }
  }
  LESSON_ORDER = []; ALL_ITEMS = []; ITEM_INDEX = {};
  const packKey = activePack().key;
  DECK.stages.forEach(st => st.lessons.forEach(l => {
    LESSON_ORDER.push(l.id);
    if (l.sounds) return;                                            // key sounds are not items: never indexed, never reviewed (Tom 10/6)
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
      if (ITEM_INDEX[it.id] !== it) ALL_ITEMS.push(it);               // one item may sit in two lessons (chapter flow): counted once
      ITEM_INDEX[it.id] = it;
    });
  }));
}

// A lesson is done if it was completed in the flow (stored) OR every phrase in it has been recalled
// correctly at least once. The derived half means the Phase-B reshuffle never shows a lesson whose
// phrases you've mastered as "incomplete" — no migration, nothing persisted, and it can't mark a
// lesson falsely complete (all items correct ⇒ genuinely done). Works per active trip via DECK.
function lessonDone(id) { return !!state.lessons[id] || lessonMastered(id); }
// the items of every session marked Known (chat 11/5): Coverage credit 1.0, out of Retention, never reviewed, out of a place's score
function knownItemIds() {
  const out = new Set();
  for (const st of (DECK ? DECK.stages : [])) for (const l of st.lessons) if (state.lessons && state.lessons[l.id] && state.lessons[l.id].known) (l.items || []).forEach(it => { if (it.id) out.add(it.id); });
  return out;
}
function lessonMastered(id) {
  for (const st of (DECK ? DECK.stages : [])) for (const l of st.lessons) {
    if (l.id !== id) continue;
    if (l.noDerivedDone) return false;                  // a practice session over words met elsewhere is done only by being played
    if (typeof isStaged === "function" && isStaged("replay") && st.id !== "sp-p1" && st.id !== "sp-p3") return false;   // the rebuilt chapters (Tom 11/4): a session is done only by being played; words met in sentences or review never mark it (Counter words 2 was skipped)
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

/* EAR SESSIONS (Tom 9/26): a few sessions are built for listening (Words you'll hear, Numbers · 2, later the Numbermachine and
   the rooms' replies). They wear "Best with sound" on the tile and the Learn row; their escape offers a way back; a read session
   (Signs, Days) runs reading forms only. Rides the "ear-sessions" switch. */
function isEarLesson(l) { return !!l && (l.emphasis === "hear" || l.numbers === "ear"); }
function isSpeakLesson(l) { return !!l && !!l.speaking; }   // "Best said out loud" (Tom 10/6)
function isReadLesson(l) { return !!l && l.emphasis === "read"; }
function earOn() { return typeof isStaged === "function" && isStaged("ear-sessions"); }
function dayKey() { return new Date().toDateString(); }
function parkedEarLesson() {   // the session saved for sound comes back first, next new day, once
  if (!earOn() || !state.parkedEar || state.parkedEar.day === dayKey()) return null;
  const l = (DECK.stages || []).flatMap(st => st.lessons).find(x => x.id === state.parkedEar.id);
  if (!l || lessonDone(l.id)) { delete state.parkedEar; save(); return null; }
  return l;
}

