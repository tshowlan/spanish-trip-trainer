/* ============================== LESSON RUNNER ============================== */
// chooseType() + the exposure ladder live in srs.js; review pools (dueForReview,
// recentMisses, cramActive) too. composeSession() weaves them into one queue.

// a graded review rep for a seen item — mostly its ladder rung, sometimes a
// situational "which do you say?" for texture. cram pushes production.
function reviewQuestion(item, pool, cap) {
  if (cramActive() && item.es.trim().split(/\s+/).length >= 2) return { type: "build", item, pool };  // build = rung 2, ok under cap
  if (item.reply && Math.random() < 0.3) return { type: "reply_listen", item, pool };  // comprehend the answer back
  if (Math.random() < 0.25) return { type: "respond", item, pool };
  return { type: chooseType(item, { cap }), item, pool };
}
// safety-critical phrases cram mode front-loads when the trip is near
function isCritical(item) { return (item.tags || []).some(t => t === "dietary" || t === "emergency"); }
// first practice after teaching: order the sentence if we can (production), else recognise it
// among its just-taught siblings. Never a bare "match the word you just saw".
function introRep(item) {
  const n = item.es.trim().split(/\s+/).length;
  return (n >= 4 && n <= 8) ? "build" : "mc_es2en";   // §1b.3: short items go to recognition, not a 2-tile "build"
}

/* ---- session composer (M2): warm-up misses + new items + trip-wide review ---- */
function composeSession(lesson) {
  const lessonItems = lesson.items || [];
  const newItems = lessonItems.filter(it => exposuresOf(it) === 0);   // teach ALL new (coverage before unlock)
  const newIds = new Set(newItems.map(itemId));
  const warm = recentMisses().filter(it => !newIds.has(itemId(it))).slice(0, 3);
  const warmIds = new Set(warm.map(itemId));
  const rungCap = lessonDone(lesson.id) ? null : 2;   // §4.1 first-pass cap: introducing → never cold

  // review pool: ~⅓ (up to ½ in cram) of the whole trip, so a new lesson revisits older ones
  let reviewPool;
  if (newItems.length) {
    const cap = cramActive() ? Math.min(8, Math.max(3, newItems.length)) : Math.min(6, Math.max(3, Math.round(newItems.length * 0.6)));
    const free = it => !newIds.has(itemId(it)) && !warmIds.has(itemId(it));
    let due = dueForReview().filter(free);
    if (cramActive()) {
      const crit = (ALL_ITEMS || []).filter(it => { const s = learnPeek(it); return s && s.exposures >= 1 && isCritical(it) && free(it) && !due.includes(it); });
      due = [...crit, ...due];
    }
    reviewPool = due.slice(0, cap);
  } else {
    const own = lessonItems.filter(it => !warmIds.has(itemId(it)));
    const extra = dueForReview().filter(it => !lessonItems.includes(it) && !warmIds.has(itemId(it))).slice(0, 4);
    reviewPool = [...own, ...extra];
  }

  const qs = [];
  warm.forEach(it => qs.push(reviewQuestion(it, null, rungCap)));       // 1) warm-up: recent misses

  // redo of a completed lesson → no new items to weave, just drill
  if (!newItems.length) {
    shuffle(reviewPool.map(it => reviewQuestion(it, reviewPool, rungCap))).forEach(q => qs.push(q));
    return qs.length ? qs : lessonItems.map(it => ({ type: chooseType(it), item: it }));
  }

  // §6.1b micro-batch weave: never >2 presentation cards in a row; each new item gets a rung-1
  // retrieval within ~3 slots of its card, then an expanding-gap re-test later; due reviews fill the
  // gaps. Replaces the old massed photo-intro (a 10-card slideshow the user reflexively skims). The
  // one scene photo lives in the primer (§4c.4), not on every card — cards are typographic beats.
  const reviews = shuffle(reviewPool.map(it => reviewQuestion(it, reviewPool, rungCap)));
  let ri = 0; const nextReview = () => (ri < reviews.length ? reviews[ri++] : null);
  const later = [];                                                    // expanding-gap re-tests
  for (let b = 0; b < newItems.length; b += 2) {
    const batch = newItems.slice(b, b + 2);                            // ≤2 new items → ≤2 cards in a row
    batch.forEach(it => qs.push({ type: "present", item: it }));       // present (card precedes any test)
    batch.forEach(it => qs.push({ type: "mc_es2en", item: it, pool: newItems }));  // immediate rung-1 retrieval
    const r = nextReview(); if (r) qs.push(r);                         // gap filler
    batch.forEach(it => later.push({ type: introRep(it), item: it, pool: newItems }));  // schedule expanding re-test
    if (later.length >= 4) { qs.push(later.shift()); const r2 = nextReview(); if (r2) qs.push(r2); }
  }
  while (later.length || ri < reviews.length) {                        // drain re-tests + leftover reviews
    if (later.length) qs.push(later.shift());
    const r = nextReview(); if (r) qs.push(r);
  }
  return qs.length ? qs : lessonItems.map(it => ({ type: chooseType(it), item: it }));  // safety net
}
// pure-review session (Home "Review" entry / all lessons complete): mistakes first, then due
function composeReview() {
  const mistakes = mistakesPool();
  const due = dueForReview();
  const seen = [...new Set([...mistakes, ...due])];
  const pool = (seen.length ? seen : dueForReview(0)).slice(0, 14);
  return pool.map(it => reviewQuestion(it, pool));
}

let run = null;
function startLesson(lesson) {
  if (lesson.chain) return renderChain(lesson);   // M4 boss lesson — a chat-style dialogue (§7.5)
  // Compose FIRST (so the primer's guess item is still "new" here and stays in the session),
  // then run the primer on a first pass before the lesson proper. Replays/reviews skip straight in.
  run = { lesson, qs: composeSession(lesson), idx: 0, hearts: 5, wrong: 0, answered: false, reasks: {}, pct: 0, review: false, missed: new Map() };
  if (!lessonDone(lesson.id) && lesson.primer && lesson.primer.guessItem) renderPrimer(lesson, renderQuestion);
  else renderQuestion();
}

/* ----- chained exchange (M4, §7.5): a chat-style dialogue used as a stage "boss." NPC lines are
   comprehension (shown + spoken, not tested); the learner PRODUCES each user turn via tap-to-build.
   Correct turns set the `chained` axis — the fourth mastery axis graduation otherwise can't feel. ----- */
function renderChain(lesson) {
  const turns = (lesson.chain && lesson.chain.turns) || [];
  const app = $("#app"); clearFooter(); hideTabbar(); app.innerHTML = "";
  app.appendChild(el(`<div class="runner chain">
    <div class="progress-row"><button class="close-btn" id="quit">${icon('x', 24)}</button><div class="chain-title">${(lesson.chain || {}).title || lesson.title}</div></div>
    <div class="chain-log" id="clog"></div>
  </div>`));
  $("#quit").addEventListener("click", () => { if (confirm("Leave the conversation? Your progress in it is lost.")) renderHome(); });
  const log = $("#clog");
  const bubble = (side, es, en) => { log.appendChild(el(`<div class="cbub ${side}"><div class="cbub-es">${es}</div><div class="cbub-en">${en}</div></div>`)); log.scrollTop = 1e6; };
  const resolve = ref => (ALL_ITEMS || []).find(x => x.es === ref || x.id === ref);
  let idx = 0;
  function step() {
    clearFooter();
    if (idx >= turns.length) return finishChain(lesson);
    const t = turns[idx];
    if (t.narr) {                                   // scene-setting beat (capstone opener, §9b.5)
      log.appendChild(el(`<div class="cnarr">${t.narr}</div>`)); log.scrollTop = 1e6;
      const f = footer(`<button class="btn" id="cnext">${idx === 0 ? "Begin →" : "Continue →"}</button>`);
      f.querySelector("#cnext").addEventListener("click", () => { idx++; step(); });
    } else if (t.npc) {
      bubble("npc", t.npc.es, t.npc.en); speak(t.npc.es);
      const nextIsUser = turns[idx + 1] && turns[idx + 1].user;
      const f = footer(`<button class="btn" id="cnext">${nextIsUser ? "Your turn →" : "Continue →"}</button>`);
      f.querySelector("#cnext").addEventListener("click", () => { idx++; step(); });
    } else {
      const item = resolve(t.user);
      if (!item) { idx++; return step(); }
      chainProduce(item, () => { bubble("user", item.es, item.en); recordAnswer(itemId(item), true, { mode: "chained" }); idx++; step(); });
    }
  }
  step();
}
// tap-to-build a single user turn inside the chain; retry-on-miss (a boss line, not a graded question)
function chainProduce(item, onDone) {
  const strip = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "") || w;
  const original = item.es.split(" ");
  const bankWords = original.map(strip);
  const display = i => (i === 0 ? bankWords[i].charAt(0).toLowerCase() + bankWords[i].slice(1) : bankWords[i]);
  const f = footer(`<div class="chain-you">Your turn — say: "${item.en}"</div>
    <div class="build-answer" id="cans"></div><div class="bank" id="cbank"></div>
    <button class="btn" id="ccheck" disabled>Say it</button>`);
  const ans = f.querySelector("#cans"), bank = f.querySelector("#cbank");
  const chosen = [];
  const refresh = () => { f.querySelector("#ccheck").disabled = chosen.length !== original.length; };
  shuffle(original.map((_, i) => i)).forEach(i => {
    const tile = el(`<button class="word" data-i="${i}">${display(i)}</button>`);
    tile.addEventListener("click", () => {
      if (tile.classList.contains("used")) return;
      tile.classList.add("used"); chosen.push(i);
      const slot = el(`<button class="word">${original[i]}</button>`);
      slot.addEventListener("click", () => { tile.classList.remove("used"); slot.remove(); chosen.splice(chosen.indexOf(i), 1); refresh(); });
      ans.appendChild(slot); refresh();
    });
    bank.appendChild(tile);
  });
  f.querySelector("#ccheck").addEventListener("click", () => {
    const built = chosen.map(i => bankWords[i]).join(" ").toLowerCase();
    if (built === bankWords.join(" ").toLowerCase()) { playSound("correct"); onDone(); }
    else { playSound("wrong"); [...ans.children].forEach(s => s.remove()); bank.querySelectorAll(".used").forEach(t => t.classList.remove("used")); chosen.length = 0; refresh(); }
  });
}
function finishChain(lesson) {
  clearFooter();
  const first = !lessonDone(lesson.id);
  const now = new Date().toISOString();
  state.lessons[lesson.id] = { stars: 3, at: now };
  const userTurns = (lesson.chain.turns || []).filter(t => t.user).length;
  state.sessions = state.sessions || [];
  state.sessions.push({ at: now, lessonId: lesson.id, category: "Conversation", phrases: userTurns, correct: userTurns });
  registerActivity();
  if (first) { state.xp += 20; state.gems = (state.gems || 0) + 1; }
  computeScores(); save(); renderTopbar(); playSound("win");
  cloudSync().catch(() => {});
  const app = $("#app"); app.innerHTML = "";
  app.appendChild(el(`<div class="complete">
    <h2>¡Conversación completa!</h2>
    <div class="reward">${lesson.reward || "You held a whole conversation in Spanish — start to finish."}</div>
    ${lesson.cultureNote ? `<div class="culture-note"><b>Local tip</b> ${lesson.cultureNote}</div>` : ""}
    <button class="btn" id="home">Continue</button></div>`));
  $("#home").addEventListener("click", renderHome);
}
/* §4c.4 scenario primer — a ~20s first-pass-only pre-lesson flow. Its job is as much emotional as
   cognitive: it connects the next 6 minutes of effort to the trip the user is excited about, by
   putting them in their future self's shoes. Anticipation of something real, never fear of a
   counter (the no-streak philosophy). Scene copy stays concrete + second-person — a moment they're
   about to live, not a lesson description. The step-2 guess is ungraded and records nothing beyond
   the reveal's exposure, so it doesn't violate the introduce-first rule (§4.1). */
function renderPrimer(lesson, onDone) {
  const p = lesson.primer || {};
  const items = lesson.items || [];
  const guess = items.find(it => it.es === p.guessItem || it.id === p.guessItem || (it.keywords || []).includes(p.guessItem)) || items[0];
  const app = $("#app"); clearFooter(); hideTabbar();
  const photo = introPhoto(lesson);

  const scene = () => {
    app.innerHTML = "";
    app.appendChild(el(`<div class="runner primer">
      <div class="primer-photo" style="background-image:url('${photo}')"></div>
      <div class="primer-fg">
        <div class="primer-label">The scene</div>
        <div class="primer-scene">${p.scene || ""}</div>
        <div class="primer-mission"><b>Your mission</b> ${p.mission || ""}</div>
      </div></div>`));
    footer(`<button class="btn" id="pnext">I'm in →</button>`);
    $("#pnext").addEventListener("click", guessStep);
  };
  const guessStep = () => {
    if (!guess) return onDone();
    app.innerHTML = "";
    const others = items.filter(it => it !== guess).map(it => it.en);
    const opts = shuffle([guess.en, ...[...new Set(others)].filter(Boolean).sort(() => Math.random() - .5).slice(0, 2)]);
    app.appendChild(el(`<div class="runner primer">
      <div class="primer-body">
        <div class="primer-label">Take a guess — no penalty</div>
        <div class="primer-guess-es">${guess.es}</div>
        <div class="qtype">What do you think it means?</div>
        <div class="choices" id="pchoices"></div>
      </div></div>`));
    const cc = $("#pchoices");
    opts.forEach(o => { const b = el(`<button class="choice">${o}</button>`); b.addEventListener("click", reveal); cc.appendChild(b); });
    footer(`<button class="btn grey" id="pskip">Skip — just show me</button>`);
    $("#pskip").addEventListener("click", reveal);
  };
  const reveal = () => {
    recordExposure(itemId(guess));                 // reveal doubles as the guess item's presentation card → exposure 1
    app.innerHTML = "";
    app.appendChild(el(`<div class="runner primer">
      <div class="primer-body reveal">
        <div class="primer-label ok">Here it is</div>
        <div class="primer-guess-es big">${guess.es}</div>
        <button class="speak-btn" id="psp">🔊 Hear it</button>
        <div class="primer-en">${guess.en}</div>
        ${guess.anchor ? `<div class="primer-anchor">💡 ${guess.anchor}</div>` : ""}
      </div></div>`));
    speak(guess.es);
    $("#psp").addEventListener("click", () => speak(guess.es));
    footer(`<button class="btn accent" id="pstart">Start the lesson →</button>`);
    $("#pstart").addEventListener("click", onDone);
  };
  scene();
}
// startReview() → due-item session; startReview(items) → focused review of those items (e.g. mistakes)
function startReview(items) {
  const qs = items && items.length ? items.map(it => reviewQuestion(it, items)) : composeReview();
  if (!qs.length) { toast("Nothing to review yet — finish a lesson first 📚"); return; }
  run = { lesson: { id: "__review__", topic: "Review", items: items || [] }, qs, idx: 0, hearts: 5, wrong: 0, answered: false, reasks: {}, pct: 0, review: true, missed: new Map() };
  renderQuestion();
}
function renderQuestion() {
  const app = $("#app");
  const q = run.qs[run.idx];
  // progress only moves forward — re-queued misses extend the lesson, never rewind the bar
  run.pct = Math.max(run.pct || 0, Math.round(run.idx / run.qs.length * 100));
  clearFooter();
  hideTabbar();
  app.innerHTML = "";
  const wrap = el(`<div class="runner"></div>`);
  wrap.appendChild(el(`
    <div class="progress-row">
      <button class="close-btn" id="quit">${icon('x',24)}</button>
      <div class="pbar"><i style="width:${run.pct}%"></i></div>
      <div class="hearts">♥ ${run.hearts}</div>
    </div>`));
  wrap.appendChild(el(`<div id="qbody"></div>`));
  app.appendChild(wrap);
  $("#quit").addEventListener("click", () => { if (confirm("Quit this lesson? Progress in it is lost.")) renderHome(); });
  run.answered = false;
  // make the mistake re-queue visible: label a phrase you missed coming back around
  if (q.requeued) $("#qbody").appendChild(el(`<div class="retry-chip">↩ Second chance — you missed this one</div>`));
  ({ intro: renderIntro, present: renderPresent, match: renderMatch, build: renderBuild, mc_es2en: renderMC, mc_en2es: renderMC,
     type_translation: renderType, listen_type: renderListen, fill_blank: renderFill, speak_it: renderSpeak,
     respond: renderRespond, listen_choice: renderListenChoice, reply_listen: renderReply }[q.type])(q);
}

/* ----- intro flow: new phrases one at a time over a regional photo, then a recap page ----- */
// pick a scenario photo from the active region for the lesson being introduced
function introPhoto(lesson) {
  const t = ((lesson && lesson.topic || "") + " " + (lesson && lesson.title || "")).toLowerCase();
  const pick =
    /coffee|caf|pastr|bakery|breakfast/.test(t) ? "cafe" :
    /market|shop|bargain/.test(t) ? "market" :
    /taxi|transport|airport|plane|metro|bus|ferry|direction|way|around/.test(t) ? "transport" :
    /sight|ruin|landmark|museum/.test(t) ? "sights" :
    /hotel|check|airbnb|room|towel|lodg/.test(t) ? "default" :
    /number|money|peso|time|pay/.test(t) ? "market" :
    /food|order|taco|eat|diet|allerg|bar|mezcal|table/.test(t) ? "food" :
    "cafe";                                   // greetings / small talk / rescue → a warm café
  const region = state.active === "spain" ? "mx" : "mx";   // TODO: add /img/es set for Spain
  return `./img/${region}/${pick}.jpg`;
}
function renderIntro(q) {
  const items = q.items || [];
  const photo = introPhoto(run.lesson);
  const seen = new Set();
  let i = 0;                                  // current card; items.length == recap page
  new Image().src = photo;                    // warm the cache so it's ready
  function draw() {
    const body = $("#qbody");
    body.innerHTML = "";
    if (i < items.length) {
      const it = items[i];
      body.appendChild(el(`<div class="intro-photo" style="background-image:url('${photo}')">
        <div class="intro-scrim"></div>
        <div class="intro-fg">
          <div class="intro-count">New phrase · ${i + 1} of ${items.length}</div>
          <div class="intro-es-big">${it.es}</div>
          <div class="intro-en-big">${it.en}</div>
          ${it.note ? `<div class="intro-note-big">${it.note}</div>` : ""}
          <button class="speak-btn intro-hear">🔊 Hear it</button>
        </div>
      </div>`));
      body.querySelector(".intro-hear").addEventListener("click", () => speak(it.es));
      if (!seen.has(it.id)) { seen.add(it.id); setTimeout(() => speak(it.es), 250); }
      const f = footer(`<div class="intro-nav">${i > 0 ? `<button class="btn grey" id="iback">← Back</button>` : `<span class="nav-gap"></span>`}<button class="btn" id="inext">${i === items.length - 1 ? "See all →" : "Next →"}</button></div>`);
      if (i > 0) f.querySelector("#iback").addEventListener("click", () => { i--; draw(); });
      f.querySelector("#inext").addEventListener("click", () => { i++; draw(); });
    } else {
      body.appendChild(el(`<div class="qtype">All ${items.length} new phrases · tap to hear</div>`));
      const list = el(`<div class="intro-list"></div>`);
      items.forEach(it => {
        const row = el(`<button class="intro-row">
          <div class="intro-txt"><div class="intro-es">${it.es}</div><div class="intro-en">${it.en}</div>${it.note ? `<div class="intro-note">${it.note}</div>` : ""}</div>
          <span class="intro-spk">🔊</span></button>`);
        row.addEventListener("click", () => speak(it.es));
        list.appendChild(row);
      });
      body.appendChild(list);
      const f = footer(`<div class="intro-nav"><button class="btn grey" id="iback">← Back</button><button class="btn" id="istart">Got it. Let's practice</button></div>`);
      f.querySelector("#iback").addEventListener("click", () => { i--; draw(); });
      f.querySelector("#istart").addEventListener("click", () => { items.forEach(it => recordExposure(itemId(it))); next(); });
    }
  }
  draw();
}

/* ----- presentation card (single-phrase re-teach after a miss — teach, never grade) ----- */
function renderPresent(q) {
  const item = q.item;
  const body = $("#qbody");
  // no "New phrase" label on a re-teach — the "Second chance" chip already frames it
  if (!q.requeued) body.appendChild(el(`<div class="qtype">New phrase</div>`));
  const short = item.es.trim().split(/\s+/).length < 3;
  const card = el(`<div class="present-card">
      <div class="present-es">${item.es}</div>
      <div class="present-en">${item.en}</div>
      ${short && item.contextEs ? `<div class="present-ctx">${item.contextEs}${item.contextEn ? ` <span>— ${item.contextEn}</span>` : ""}</div>` : ""}
      ${item.note ? `<div class="present-note">${item.note}</div>` : ""}
      ${item.anchor ? `<div class="present-anchor">💡 ${item.anchor}</div>` : ""}
    </div>`);
  body.appendChild(card);
  const replay = el(`<button class="speak-btn">🔊 Hear it</button>`);
  replay.addEventListener("click", () => speak(item.es));
  body.appendChild(replay);
  setTimeout(() => speak(item.es), 250);
  const f = footer(`<button class="btn" id="got">Got it</button>`);
  f.querySelector("#got").addEventListener("click", () => { recordExposure(itemId(item)); next(); });
}
function footer(html) {
  const old = $("#footer"); if (old) old.remove();
  const f = el(`<div class="footer" id="footer">${html}</div>`);
  document.body.appendChild(f);
  return f;
}
function clearFooter() { const f = $("#footer"); if (f) f.remove(); }

/* distractors must be the same KIND as the answer. §4b.4 distractor ladder: prefer siblings that
   share a CATEGORY (tags) — other numbers for a number, other dishes for a dish — tightened by
   length "shape" so a one-word answer never sits beside full sentences. Falls back to shape-only
   (legacy behaviour) so untagged packs, or answers with no same-tag siblings, never regress. */
function mcOptions(item, es2en, siblings) {
  const answer = es2en ? item.en : item.es;
  const val = x => es2en ? x.en : x.es;
  const wc = s => s.trim().split(/\s+/).length;
  const shape = n => n <= 1 ? 0 : n <= 3 ? 1 : 2;      // word / short phrase / sentence
  const tb = shape(wc(answer));
  const tags = item.tags || [];
  const sameTag = x => tags.length && (x.tags || []).some(t => tags.includes(t));
  const sameShape = x => shape(wc(val(x))) === tb;
  const cand = [];
  const add = arr => { for (const x of arr) if (val(x) !== answer && !cand.includes(x)) cand.push(x); };
  const sibs = (siblings && siblings.length ? siblings : []);
  const all = ALL_ITEMS || [];
  add(sibs.filter(x => sameTag(x) && sameShape(x)));                 // same lesson · same category · same shape
  if (cand.length < 3) add(all.filter(x => sameTag(x) && sameShape(x)));  // any lesson · same category · same shape
  if (cand.length < 3) add(all.filter(sameTag));                    // any lesson · same category · any shape
  if (cand.length < 3) add(sibs.filter(sameShape));                 // same lesson · same shape (legacy)
  if (cand.length < 3) add(all.filter(sameShape));                  // any lesson · same shape (legacy)
  if (cand.length < 3) add(sibs);                                   // same lesson · any shape
  if (cand.length < 3) add(all);                                    // last resort
  const distract = [...new Set(sample(cand, 8).map(val))].filter(v => v !== answer).slice(0, 3);
  return { answer, options: shuffle([answer, ...distract]) };
}

/* ----- multiple choice ----- */
// §4b.3 variant presentation: once an item is familiar (exposures ≥ 3), ~1 in 4 recognition/listening
// reps surface a natural `variant` instead of the canonical string — locals won't use our exact words.
// Never in the first 3 exposures (canonical form stabilizes first). Grading already accepts variants.
function presentEs(item) {
  const vs = item.variants || [];
  if (vs.length && exposuresOf(item) >= 3 && Math.random() < 0.25) return { text: pick(vs), variant: true };
  return { text: item.es, variant: false };
}
// §4c.5 effort framing: one-time line the first time a learner hits a cold-production exercise.
function coldEffortNote(body) {
  if (state.effortColdShown) return;
  state.effortColdShown = true; save();
  body.appendChild(el(`<div class="effort-line">✍️ Typing it cold is what makes it stick — this is the rep that counts.</div>`));
}
function renderMC(q) {
  const es2en = q.type === "mc_es2en";
  const item = q.item;
  const { answer, options } = mcOptions(item, es2en, q.pool && q.pool.length ? q.pool : run.lesson.items);
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">${es2en ? "What does this mean?" : "Say it in Spanish"}</div>`));
  if (es2en) {
    const pe = presentEs(item);
    body.appendChild(el(`<div class="prompt">${pe.text}</div>`));
    if (pe.variant) body.appendChild(el(`<div class="prompt-sub">Another common way to say it</div>`));
    const sb = el(`<button class="speak-btn">🔊 Hear it</button>`); sb.addEventListener("click", () => speak(pe.text)); body.appendChild(sb);
  } else {
    body.appendChild(el(`<div class="prompt">${item.en}</div>`));
  }
  body.appendChild(mcChoices(options, answer, item));
}
// shared choice grid → grades opt===answer
function mcChoices(options, answer, item) {
  const choices = el(`<div class="choices"></div>`);
  options.forEach(opt => {
    const c = el(`<button class="choice">${opt}</button>`);
    c.addEventListener("click", () => {
      if (run.answered) return;
      [...choices.children].forEach(ch => ch.classList.add(ch.textContent === answer ? "correct" : (ch === c ? "wrong" : "dim")));
      grade(opt === answer, item);
    });
    choices.appendChild(c);
  });
  return choices;
}

/* ----- choose the appropriate response (M2): a situation → pick the learned phrase ----- */
function renderRespond(q) {
  const item = q.item;
  const { answer, options } = mcOptions(item, false, q.pool && q.pool.length ? q.pool : run.lesson.items);  // Spanish options
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Which do you say?</div>`));
  body.appendChild(el(`<div class="prompt">You want to say: “${item.en}”</div>`));
  body.appendChild(mcChoices(options, answer, item));
}

/* ----- understand the reply (M2): hear what a local says back → pick its meaning ----- */
function renderReply(q) {
  const item = q.item, r = item.reply;
  if (!r) return renderMC({ type: "mc_es2en", item });                 // safety: no reply data
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Understand the reply</div>`));
  body.appendChild(el(`<div class="prompt-sub" style="margin-bottom:8px">You said: “${item.es}”</div>`));
  const play = el(`<button class="big-speak">🔊</button>`);
  play.addEventListener("click", () => speak(r.es));
  body.appendChild(play);
  body.appendChild(el(`<div class="prompt-sub">They answer — what did they say?</div>`));
  setTimeout(() => speak(r.es), 300);
  const answer = r.en;
  const pool = [...new Set((ALL_ITEMS || []).flatMap(x => x.reply && x.reply.en !== answer ? [x.reply.en] : []).concat((ALL_ITEMS || []).filter(x => x.en !== answer).map(x => x.en)))];
  const options = shuffle([answer, ...sample(pool, 3)]);
  body.appendChild(mcChoices(options, answer, item));
}

/* ----- listen & choose (M2): hear it → pick the meaning (great for numbers) ----- */
function renderListenChoice(q) {
  const item = q.item;
  const { answer, options } = mcOptions(item, true, q.pool && q.pool.length ? q.pool : run.lesson.items);   // English options
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">What did you hear?</div>`));
  const pe = presentEs(item);                          // §4b.3: listening may play a natural variant
  const play = el(`<button class="big-speak">🔊</button>`);
  play.addEventListener("click", () => speak(pe.text));
  body.appendChild(play);
  setTimeout(() => speak(pe.text), 300);
  body.appendChild(mcChoices(options, answer, item));
}

/* ----- type the translation (English → Spanish) ----- */
function renderType(q) {
  const item = q.item;
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Type it in Spanish</div>`));
  coldEffortNote(body);                                // §4c.5 one-time cold-production framing
  body.appendChild(el(`<div class="prompt">${item.en}</div>`));
  body.appendChild(el(`<div class="prompt-sub">Accents and capitals don't matter.</div>`));
  const input = el(`<input class="text-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribe aquí…">`);
  body.appendChild(input);
  setTimeout(() => input.focus(), 50);
  const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
  input.addEventListener("input", () => { $("#check").disabled = !input.value.trim(); });
  const submit = () => { if (!run.answered && input.value.trim()) gradeTyped(input.value, item); };
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  f.querySelector("#check").addEventListener("click", submit);
}

/* ----- listen & type ----- */
function renderListen(q) {
  const item = q.item;
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Type what you hear</div>`));
  coldEffortNote(body);                                // §4c.5 one-time cold-production framing
  const pe = presentEs(item);                          // §4b.3: may play a natural variant (grading accepts it)
  const play = el(`<button class="big-speak">🔊</button>`);
  play.addEventListener("click", () => speak(pe.text));
  body.appendChild(play);
  setTimeout(() => speak(pe.text), 350);
  const input = el(`<input class="text-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribe en español…">`);
  body.appendChild(input);
  setTimeout(() => input.focus(), 50);
  const f = footer(`<button class="btn grey" id="skip">Can't tell — skip</button><div style="height:10px"></div><button class="btn" id="check" disabled>Check</button>`);
  input.addEventListener("input", () => { $("#check").disabled = !input.value.trim(); });
  input.addEventListener("keydown", e => { if (e.key === "Enter" && input.value.trim() && !run.answered) gradeTyped(input.value, item); });
  f.querySelector("#check").addEventListener("click", () => { if (!run.answered && input.value.trim()) gradeTyped(input.value, item); });
  f.querySelector("#skip").addEventListener("click", () => { if (!run.answered) grade(false, item); });
}

/* ----- speak it (M4): say the phrase aloud; Web Speech recognition, lenient match (§7.4).
   "I can't speak now" swaps to type-the-translation — an equally-hard cold rep for the same item,
   so a user in a quiet room / on a bus is never blocked and still gets a real production credit. ----- */
function speechMatch(heard, item) {
  const h = norm(heard).split(/\s+/).filter(Boolean);
  return [item.es].concat(item.variants || []).some(t => {   // ≥70% token overlap with any accepted form
    const ts = norm(t).split(/\s+/).filter(Boolean);
    return ts.length && ts.filter(w => h.includes(w)).length / ts.length >= 0.7;
  });
}
function renderSpeak(q) {
  const Rec = (typeof window !== "undefined") && (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!Rec) { q.type = "type_translation"; return renderType(q); }        // unsupported → type instead
  const item = q.item;
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Say it in Spanish</div>`));
  body.appendChild(el(`<div class="prompt">${item.en}</div>`));
  const status = el(`<div class="prompt-sub" id="spk-status">Tap the mic and say it aloud.</div>`);
  body.appendChild(status);
  body.appendChild(el(`<button class="mic-btn" id="mic">${icon("microphone", 30)}</button>`));
  const f = footer(`<button class="btn grey" id="cant">I can't speak right now</button>`);
  // equally-hard substitute: retype the current slot as a cold typed rep (same production axis)
  f.querySelector("#cant").addEventListener("click", () => { q.type = "type_translation"; renderQuestion(); });

  const mic = $("#mic");
  let done = false;
  mic.addEventListener("click", () => {
    if (run.answered || done) return;
    const rec = new Rec();
    rec.lang = (typeof activePack === "function" ? activePack().tts : "es-MX");
    rec.interimResults = false; rec.maxAlternatives = 3;
    mic.classList.add("live"); status.textContent = "Listening…";
    rec.onresult = e => {
      done = true;
      const alts = [...e.results[0]].map(r => r.transcript);
      mic.classList.remove("live"); status.textContent = `Heard: “${alts[0]}”`;
      grade(alts.some(a => speechMatch(a, item)), item);
    };
    rec.onerror = () => { mic.classList.remove("live"); status.textContent = "Didn't catch that — tap to try again."; };
    rec.onend = () => { mic.classList.remove("live"); if (!done && !run.answered) status.textContent = "Tap the mic and say it aloud."; };
    try { rec.start(); } catch (_) { mic.classList.remove("live"); }
  });
}

/* ----- fill in the blank ----- */
function renderFill(q) {
  const item = q.item;
  const clean = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "");
  const words = item.es.split(" ");
  // §4b.1 blank rotation: blank a KEYWORD (the content word that carries meaning), rotating which
  // one across exposures so repeated encounters test different keywords. Multi-word keywords (e.g.
  // "por favor") don't match a single token, so we fall back to the longest-word heuristic — no regression.
  const kws = (item.keywords || []).map(k => norm(k));
  let idxs = words.map((w, i) => i).filter(i => kws.includes(norm(clean(words[i]))));
  // §4b.2 blank-count progression: one blank is the entry mode; after 2 correct one-blank passes,
  // blank TWO keywords (if the phrase has ≥2). One-blank stays the workhorse the learner meets most.
  const learn = state.learn && state.learn[itemId(item)];
  if (idxs.length >= 2 && ((learn && learn.fill1) || 0) >= 2) { q.blanks = 2; return renderFillTwo(q, item, words, clean, idxs.slice(0, 2)); }
  q.blanks = 1;
  if (!idxs.length) idxs = words.map((w, i) => i).filter(i => clean(words[i]).length >= 4);
  const idx = idxs.length ? idxs[(exposuresOf(item) || 0) % idxs.length] : Math.floor(Math.random() * words.length);
  const raw = words[idx];
  const lead = (raw.match(/^[¿¡("«]+/) || [""])[0];
  const trail = (raw.match(/[?!).,;:"»]+$/) || [""])[0];
  const answer = raw.slice(lead.length, raw.length - trail.length);
  const shown = words.map((w, i) => i === idx ? `${lead}<span class="blank">_____</span>${trail}` : w).join(" ");
  // distractors: prefer single-word content words (keywords) from same-CATEGORY items, then this
  // lesson's words near the answer's length, then anywhere (legacy) — so options are plausibly wrong.
  const tags = item.tags || [];
  const sameTag = x => tags.length && (x.tags || []).some(t => tags.includes(t));
  const wordsFrom = arr => [...new Set(arr.flatMap(x => x.es.split(" ").map(clean)))]
    .filter(w => norm(w) !== norm(answer) && w.length >= 3);
  const kwsFrom = arr => [...new Set(arr.flatMap(x => (x.keywords || []).map(clean)))]
    .filter(w => /^\S+$/.test(w) && norm(w) !== norm(answer) && w.length >= 3);
  let otherWords = kwsFrom((ALL_ITEMS || []).filter(sameTag));       // same-category content words
  if (otherWords.length < 3) { const lw = wordsFrom(run.lesson.items); otherWords = lw.filter(w => Math.abs(w.length - answer.length) <= 3); if (otherWords.length < 3) otherWords = lw; }
  if (otherWords.length < 3) otherWords = wordsFrom(ALL_ITEMS);
  const options = shuffle([answer, ...sample(otherWords, 3)]);

  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Fill in the blank</div>`));
  body.appendChild(el(`<div class="prompt">${shown}</div>`));
  body.appendChild(el(`<div class="prompt-sub">${item.en}</div>`));
  const choices = el(`<div class="choices"></div>`);
  options.forEach(opt => {
    const c = el(`<button class="choice">${opt}</button>`);
    c.addEventListener("click", () => {
      if (run.answered) return;
      [...choices.children].forEach(ch => ch.classList.add(ch.textContent === answer ? "correct" : (ch === c ? "wrong" : "dim")));
      grade(opt === answer, item);
    });
    choices.appendChild(c);
  });
  body.appendChild(choices);
}
// §4b.2 two-blank fill: two keyword slots filled from one word bank (2 answers + 2 distractors).
function renderFillTwo(q, item, words, clean, blankIdxs) {
  const body = $("#qbody");
  const part = raw => { const lead = (raw.match(/^[¿¡("«]+/) || [""])[0], trail = (raw.match(/[?!).,;:"»]+$/) || [""])[0]; return { lead, trail, core: raw.slice(lead.length, raw.length - trail.length) }; };
  const answers = blankIdxs.map(i => part(words[i]).core);
  const shown = words.map((w, i) => {
    const bi = blankIdxs.indexOf(i); if (bi < 0) return w;
    const p = part(w); return `${p.lead}<span class="fillslot" data-slot="${bi}"></span>${p.trail}`;
  }).join(" ");
  body.appendChild(el(`<div class="qtype">Fill in the blanks</div>`));
  const prompt = el(`<div class="prompt">${shown}</div>`); body.appendChild(prompt);
  body.appendChild(el(`<div class="prompt-sub">${item.en}</div>`));
  const tags = item.tags || [], na = answers.map(a => norm(a));
  const kwsFrom = arr => [...new Set(arr.flatMap(x => (x.keywords || []).map(clean)))].filter(w => /^\S+$/.test(w) && !na.includes(norm(w)) && w.length >= 3);
  let distract = kwsFrom((ALL_ITEMS || []).filter(x => (x.tags || []).some(t => tags.includes(t))));
  if (distract.length < 2) distract = [...new Set((ALL_ITEMS || []).flatMap(x => x.es.split(" ").map(clean)))].filter(w => !na.includes(norm(w)) && w.length >= 3);
  const bankWords = shuffle([...answers, ...sample(distract, 2)]);
  const bank = el(`<div class="bank"></div>`); body.appendChild(bank);
  const slotEls = [...prompt.querySelectorAll(".fillslot")];
  const fill = {};
  slotEls.forEach((se, bi) => se.addEventListener("click", () => {
    if (run.answered || fill[bi] == null) return;
    const w = fill[bi]; delete fill[bi]; se.textContent = ""; se.classList.remove("filled");
    const t = [...bank.children].find(b => b.textContent === w && b.classList.contains("used")); if (t) t.classList.remove("used"); refresh();
  }));
  const nextEmpty = () => slotEls.findIndex((_, bi) => fill[bi] == null);
  bankWords.forEach(w => {
    const tile = el(`<button class="word">${w}</button>`);
    tile.addEventListener("click", () => {
      if (run.answered || tile.classList.contains("used")) return;
      const bi = nextEmpty(); if (bi < 0) return;
      fill[bi] = w; tile.classList.add("used"); slotEls[bi].textContent = w; slotEls[bi].classList.add("filled"); refresh();
    });
    bank.appendChild(tile);
  });
  const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
  function refresh() { $("#check").disabled = slotEls.some((_, bi) => fill[bi] == null); }
  f.querySelector("#check").addEventListener("click", () => {
    if (run.answered) return;
    grade(slotEls.every((_, bi) => norm(fill[bi] || "") === norm(answers[bi])), item);
  });
}

/* ----- tap to build ----- */
// §1b.4: tokens the learner has mastered "everywhere" — a stripped token in ≥3 items at exposures ≥5
// (e.g. "por favor" after heavy use). Pre-placing these keeps a build's difficulty on its NEW words.
function _masteredTokens() {
  const strip = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "");
  const count = new Map();
  (ALL_ITEMS || []).forEach(it => {
    if (exposuresOf(it) < 5) return;
    [...new Set(it.es.toLowerCase().split(/\s+/).map(strip).filter(Boolean))].forEach(t => count.set(t, (count.get(t) || 0) + 1));
  });
  const set = new Set(); count.forEach((n, t) => { if (n >= 3) set.add(t); }); return set;
}
function renderBuild(q) {
  const item = q.item;
  const strip = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "") || w;
  const original = item.es.split(" ");            // with punctuation + caps → shown in the built line
  const bankWords = original.map(strip);          // stripped → tiles (no positional giveaway) + grading
  const display = i => (i === 0 ? bankWords[i].charAt(0).toLowerCase() + bankWords[i].slice(1) : bankWords[i]);  // hide "word 1" cap
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Build the sentence</div>`));
  body.appendChild(el(`<div class="prompt">${item.en}</div>`));
  const ans = el(`<div class="build-answer"></div>`);
  const bank = el(`<div class="bank"></div>`);
  const target = () => bankWords.join(" ").toLowerCase();

  // §1b.4 scaffolded build: pre-place mastered chunks in position; the learner assembles only the new
  // words. (Builds never set the `production` axis in recordAnswer, so an easy scaffolded build can't
  // fake cold production — graduation still needs a typed rep. §1b.4 credit-weighting is satisfied.)
  const mastered = _masteredTokens();
  const scaffold = new Set(original.map((_, i) => i).filter(i => mastered.has(bankWords[i].toLowerCase())));
  const novel = original.map((_, i) => i).filter(i => !scaffold.has(i));
  const useScaffold = scaffold.size > 0 && novel.length > 0 && novel.length < original.length;

  if (useScaffold) {
    body.appendChild(el(`<div class="prompt-sub">The words you know are placed — add the rest.</div>`));
    body.appendChild(ans); body.appendChild(bank);
    const slotOf = {};                            // novel position -> slot element
    const fill = {};                              // novel position -> placed bank index (tile's original idx)
    original.forEach((w, i) => {
      if (scaffold.has(i)) { ans.appendChild(el(`<span class="word locked">${w}</span>`)); return; }
      const s = el(`<span class="slot" data-i="${i}"></span>`);
      s.addEventListener("click", () => {                       // tap a filled slot → return the tile
        if (run.answered || fill[i] == null) return;
        const bi = fill[i]; delete fill[i]; s.textContent = ""; s.classList.remove("filled");
        bank.querySelector(`.word[data-i="${bi}"]`).classList.remove("used"); refresh();
      });
      slotOf[i] = s; ans.appendChild(s);
    });
    const nextEmpty = () => novel.find(i => fill[i] == null);
    shuffle(novel.slice()).forEach(bi => {
      const tile = el(`<button class="word" data-i="${bi}">${display(bi)}</button>`);
      tile.addEventListener("click", () => {
        if (run.answered || tile.classList.contains("used")) return;
        const sp = nextEmpty(); if (sp == null) return;
        fill[sp] = bi; tile.classList.add("used");
        slotOf[sp].textContent = original[bi]; slotOf[sp].classList.add("filled"); refresh();
      });
      bank.appendChild(tile);
    });
    const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
    function refresh() { $("#check").disabled = novel.some(i => fill[i] == null); }
    f.querySelector("#check").addEventListener("click", () => {
      if (run.answered) return;
      const built = original.map((w, i) => scaffold.has(i) ? bankWords[i] : bankWords[fill[i]]).join(" ").toLowerCase();
      grade(built === target(), item);
    });
    return;
  }

  // ---- standard build: all tiles in the bank, appended in order ----
  body.appendChild(el(`<div class="prompt-sub">Tap the words in order.</div>`));
  body.appendChild(ans); body.appendChild(bank);
  const chosen = [];
  shuffle(original.map((_, i) => i)).forEach(i => {
    const tile = el(`<button class="word" data-i="${i}">${display(i)}</button>`);
    tile.addEventListener("click", () => {
      if (run.answered || tile.classList.contains("used")) return;
      tile.classList.add("used"); chosen.push(i);
      const slot = el(`<button class="word">${original[i]}</button>`);
      slot.addEventListener("click", () => {
        if (run.answered) return;
        tile.classList.remove("used"); slot.remove();
        chosen.splice(chosen.indexOf(i), 1); refreshCheck();
      });
      ans.appendChild(slot); refreshCheck();
    });
    bank.appendChild(tile);
  });
  const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
  function refreshCheck() { $("#check").disabled = chosen.length !== original.length; }
  f.querySelector("#check").addEventListener("click", () => {
    if (run.answered) return;
    const built = chosen.map(i => bankWords[i]).join(" ").toLowerCase();
    grade(built === target(), item);
  });
}

/* ----- match pairs ----- */
function renderMatch(q) {
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Tap the matching pairs</div>`));
  const grid = el(`<div class="match"></div>`);
  const left = shuffle(q.items.map(it => ({ key: it.es, label: it.es, side: "L" })));
  const right = shuffle(q.items.map(it => ({ key: it.es, label: it.en, side: "R" })));
  const rows = Math.max(left.length, right.length);
  for (let r = 0; r < rows; r++) {
    [left[r], right[r]].forEach(d => {
      if (!d) return;
      const tile = el(`<button class="tile" data-key="${encodeURIComponent(d.key)}" data-side="${d.side}">${d.label}</button>`);
      tile.addEventListener("click", () => onMatchTap(tile, grid, q));
      grid.appendChild(tile);
    });
  }
  body.appendChild(grid);
  grid._sel = null; grid._left = q.items.length;
}
function onMatchTap(tile, grid, q) {
  if (tile.classList.contains("gone")) return;
  const sel = grid._sel;
  if (!sel) { [...grid.children].forEach(c => c.classList.remove("sel")); tile.classList.add("sel"); grid._sel = tile; return; }
  if (sel === tile) { tile.classList.remove("sel"); grid._sel = null; return; }
  const same = sel.dataset.key === tile.dataset.key, diffSide = sel.dataset.side !== tile.dataset.side;
  if (same && diffSide) {
    [sel, tile].forEach(c => { c.classList.remove("sel"); c.classList.add("gone"); });
    grid._sel = null; grid._left--;
    const it = q.items.find(i => i.es === decodeURIComponent(tile.dataset.key));
    if (it) { speak(it.es); recordExposure(itemId(it)); }   // warm-up match counts as an exposure
    if (grid._left === 0) { playSound("correct"); setTimeout(() => next(), 350); }
  } else {
    tile.classList.add("bad"); sel.classList.add("bad");
    run.wrong++; if (run.hearts > 0) run.hearts--; if ($(".hearts")) $(".hearts").textContent = "♥ " + run.hearts;
    playSound("wrong");
    setTimeout(() => { tile.classList.remove("bad", "sel"); sel.classList.remove("bad", "sel"); grid._sel = null; }, 350);
  }
}

/* ----- grading + feedback ----- */
function grade(ok, item) { finishGrade(ok, item, null); }
// typed answers get typo/accent tolerance (edit distance ≤ 1, accent slips accepted)
function gradeTyped(raw, item) {
  // §4b.3: accept the canonical form OR any authored variant (same typo tolerance)
  let j = { ok: false };
  for (const t of [item.es].concat(item.variants || [])) { const r = judgeTyped(raw, t); if (r.ok) { j = r; break; } }
  const extra = j.accent ? "Almost — watch the accent." : (j.typo ? "Close — mind the spelling." : null);
  finishGrade(j.ok, item, extra);
}
function finishGrade(ok, item, extra) {
  run.answered = true;
  const q = run.qs[run.idx];
  if (!ok) { run.wrong++; if (run.hearts > 0) run.hearts--; if (run.missed) run.missed.set(itemId(item), item); }
  recordAnswer(itemId(item), ok, { mode: q && q.type });
  // §4b.2: count correct one-blank fills so the item graduates to two-blank fills
  if (ok && q && q.type === "fill_blank" && (q.blanks || 1) === 1) { const st = state.learn && state.learn[itemId(item)]; if (st) st.fill1 = (st.fill1 || 0) + 1; }
  playSound(ok ? "correct" : "wrong");
  const notes = [];
  if (extra) notes.push(`<span class="note-chip"><b>note</b> ${extra}</span>`);
  if (item.note) notes.push(`<span class="note-chip"><b>tip</b> ${item.note}</span>`);
  if (item.anchor) notes.push(`<span class="note-chip"><b>💡</b> ${item.anchor}</span>`);   // §4c.2 memory hook at the moment of error
  if (item.latam) notes.push(`<span class="note-chip"><b>L. America</b> ${item.latam}</span>`);
  if (item.cat) notes.push(`<span class="note-chip"><b>Català</b> ${item.cat}</span>`);
  const f = footer(`
    <div class="fb-title ${ok ? "ok" : "no"}">${ok ? pick(PRAISE) : pick(NEAR_MISS)}</div>
    <div class="fb-sub"><b>${item.es}</b> — ${item.en}</div>
    <div>${notes.join("")}</div>
    <div style="height:10px"></div>
    <button class="btn ${ok ? "" : "accent"}" id="cont">Continue</button>`);
  f.classList.add(ok ? "correct" : "wrong");
  const sb = el(`<button class="speak-btn" style="margin:0 0 10px">🔊 ${item.es}</button>`);
  sb.addEventListener("click", () => speak(item.es));
  f.insertBefore(sb, f.querySelector("#cont"));
  speak(item.es);                                     // §4c.2: always replay the correct audio — the miss is the moment it matters
  if (!ok && q && q.item) requeueMiss(item, q.type);
  const cont = $("#cont");
  if (!ok) {                                          // §4c.2 forced processing beat: a miss can't be blown past — attend to the correction
    cont.disabled = true;
    setTimeout(() => { if (cont) cont.disabled = false; }, 1400);
  }
  cont.addEventListener("click", () => { if (!cont.disabled) next(); });
}
// missed item → re-serve later in the session, one ladder rung easier (capped to avoid spirals)
function requeueMiss(item, failedType) {
  const id = itemId(item); if (!id) return;
  run.reasks[id] = run.reasks[id] || 0;
  if (run.reasks[id] >= 2) return;                       // cap at 2 re-asks/item; M2 warm-up catches the rest
  run.reasks[id]++;
  const type = rungDownType(failedType, item);
  const pos = Math.min(run.qs.length, run.idx + 3 + Math.floor(Math.random() * 3));   // 3–5 slots later
  run.qs.splice(pos, 0, { type, item, requeued: true });
}
function next() {
  clearFooter();
  run.idx++;
  if (run.idx >= run.qs.length) return finishLesson();
  renderQuestion();
}

/* ----- completion ----- */
function finishLesson() {
  clearFooter();
  const lesson = run.lesson;
  if (run.review) return finishReview();               // pure-review session: no lesson to mark
  const stars = run.wrong === 0 ? 3 : run.wrong <= 2 ? 2 : 1;
  const firstTime = !lessonDone(lesson.id);
  const prev = state.lessons[lesson.id];
  const now = new Date().toISOString();
  state.lessons[lesson.id] = { stars: Math.max(stars, prev ? prev.stars : 0), at: now };
  if (firstTime) { state.xp += 20; state.gems += 1; } else state.xp += 8;   // kept in state for the group view
  // per-category accuracy → powers the group "best/worst at" view
  const cat = categoryOf(lesson.topic);
  const total = run.qs.length, correct = Math.max(0, total - run.wrong);
  state.topicStats = state.topicStats || {};
  const cs = state.topicStats[cat] = state.topicStats[cat] || { correct: 0, total: 0 };
  cs.correct += correct; cs.total += total;
  // session log → powers Momentum / Recency / Retention
  const prevReadiness = (state.scoresCache || {}).readiness;
  state.sessions = state.sessions || [];
  state.sessions.push({ at: now, lessonId: lesson.id, category: cat, phrases: total, correct });
  registerActivity();
  const scores = computeScores();
  save(); renderTopbar();
  cloudSync().catch(() => {});
  playSound("win");

  const delta = (prevReadiness != null) ? scores.readiness - prevReadiness : null;
  const missed = run.missed ? [...run.missed.values()] : [];
  const app = $("#app");
  app.innerHTML = "";
  app.appendChild(el(`
    <div class="complete">
      <h2>¡Lección completa!</h2>
      <div class="scorebar">
        <div class="score"><div class="n stars-n">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div><div class="l">accuracy</div></div>
        <div class="score"><div class="n">${scores.readiness}<span class="pct">%</span></div><div class="l">trip readiness${delta > 0 ? ` <span class="up">▲${delta}</span>` : ""}</div></div>
      </div>
      <div class="reward">${lesson.reward}</div>
      ${lesson.cultureNote ? `<div class="culture-note"><span class="cn-label">Local tip</span> ${lesson.cultureNote}</div>` : ""}
      ${missed.length ? `<button class="btn accent" id="reviewmiss">Review your ${missed.length} mistake${missed.length === 1 ? "" : "s"}</button><div style="height:10px"></div>` : ""}
      <button class="btn${missed.length ? " grey" : ""}" id="home">Continue</button>
    </div>`));
  if (missed.length) $("#reviewmiss").addEventListener("click", () => startReview(missed));
  $("#home").addEventListener("click", renderHome);
}

/* pure-review completion: log the session for Momentum/Recency, but mark no lesson */
function finishReview() {
  const now = new Date().toISOString();
  const total = run.qs.length, correct = Math.max(0, total - run.wrong);
  const prevReadiness = (state.scoresCache || {}).readiness;
  state.sessions = state.sessions || [];
  state.sessions.push({ at: now, lessonId: "__review__", category: "Review", phrases: total, correct });
  registerActivity();
  const scores = computeScores();
  save(); renderTopbar();
  cloudSync().catch(() => {});
  playSound("win");
  const delta = (prevReadiness != null) ? scores.readiness - prevReadiness : null;
  const app = $("#app");
  app.innerHTML = "";
  app.appendChild(el(`
    <div class="complete">
      <h2>Review complete</h2>
      <div class="scorebar">
        <div class="score"><div class="n">${correct}/${total}</div><div class="l">recalled</div></div>
        <div class="score"><div class="n">${scores.readiness}<span class="pct">%</span></div><div class="l">trip readiness${delta > 0 ? ` <span class="up">▲${delta}</span>` : ""}</div></div>
      </div>
      <div class="reward">Nice — keeping older phrases warm is how they stick for the trip.</div>
      <button class="btn" id="home">Continue</button>
    </div>`));
  $("#home").addEventListener("click", renderHome);
}
