/* ============================== LESSON RUNNER ============================== */
// chooseType() + the exposure ladder live in srs.js; review pools (dueForReview,
// recentMisses, cramActive) too. composeSession() weaves them into one queue.

// §8.4 a phrase is "fading" below this strength — the retention-notification threshold (§6.1)
const RETENTION_FADE = 40;
// §8.3 correct-answer check that draws itself in (stroke animated in CSS); §8.4 restored strength arc
const CHECK_SVG = `<svg class="draw-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>`;
const ARC_SVG = `<svg class="restored-ring" viewBox="0 0 36 36" aria-hidden="true"><circle class="rr-bg" cx="18" cy="18" r="15"/><circle class="rr-fg" cx="18" cy="18" r="15"/></svg>`;

// a graded review rep for a seen item — mostly its ladder rung, sometimes reply
// comprehension for texture. cram pushes production. ("respond" retired 2026-07-20:
// its es-phrase options were phrase-MC, §7.0.)
function reviewQuestion(item, pool, cap) {
  if (cramActive() && item.es.trim().split(/\s+/).length >= 2) return { type: "build", item, pool };  // build = rung 2, ok under cap
  // §5.2b: logged confusion pairs preferentially spawn sound-choice reps — the mistake
  // loop's targeted remediation, at the axis where the confusion lives (the ear)
  const st = learnPeek(item);
  if (st && st.conf && st.conf.length && item.es.trim().split(/\s+/).length >= 2 && Math.random() < 0.5)
    return { type: "sound_choice", item, pool };
  if (item.reply && Math.random() < 0.3) return { type: "reply_listen", item, pool };  // comprehend the answer back
  return { type: chooseType(item, { cap }), item, pool };
}
/* §7.1 pairs: fold four short seen items out of a review pool into one board — the
   review workhorse. Items ARE the pairs (audio + en are item fields); best for kit
   items, machine fillers, short forms. Mutates the pool (the four leave their solo slots). */
function extractPairsBoard(pool) {
  const shorts = pool.filter(it => it.es.trim().split(/\s+/).length <= 4 && exposuresOf(it) >= 1);
  if (shorts.length < 4) return null;
  const four = sample(shorts, 4);
  four.forEach(it => { const i = pool.indexOf(it); if (i >= 0) pool.splice(i, 1); });
  return { type: "pairs", items: four };
}
/* §7.1 the close: every lesson ends on 2 cold typed reps — (1) the lesson's anchor item,
   (2) a frame-swap variation composed from this frame × a cross-machine taught filler
   (Mix-it mechanics debuting; exclusions: no a-qué-hora in either direction — closed verb
   set; fillers graded exactly as taught). Swap prompt composes from the machine's beat-hint
   name + the filler. Zero per-lesson authoring; sanctioned exception to the first-pass cap. */
function closeReps(lesson) {
  const items = lesson.items || [];
  if (!items.length) return [];
  const anchor = items[0];
  const out = [{ type: "close", item: anchor }];
  const swap = composeSwap(lesson, anchor);
  if (swap) out.push(swap);
  return out;
}
function _machineLessonOf(frame) {
  const pk = (typeof activePack === "function") ? activePack() : null;
  for (const st of (pk && pk.stages) || []) for (const l of st.lessons || []) if (l.machine && l.frame === frame) return l;
  return null;
}
function composeSwap(lesson, anchor) {
  const frame = lesson.machine ? lesson.frame : anchor.frame;
  if (!frame || /a qué hora/i.test(frame)) return null;
  const mates = (ALL_ITEMS || []).filter(x => x.frame === frame);
  const parts = _frameParts(frame, anchor.es) || (mates[0] && _frameParts(frame, mates[0].es));
  if (!parts) return null;
  const homeShell = _enShell(mates);
  if (!homeShell) return null;
  const taughtEs = new Set((ALL_ITEMS || []).map(x => norm(x.es)));
  // cross-machine taught fillers, novel compositions first (the transfer moment)
  const cands = shuffle((ALL_ITEMS || []).filter(x =>
    x.frame && x.frame !== frame && !/a qué hora/i.test(x.frame) && exposuresOf(x) >= 1));
  let fallback = null;
  for (const c of cands) {
    const p = _frameParts(c.frame, c.es); if (!p) continue;
    const fen = _fillerEn(_enShell((ALL_ITEMS || []).filter(x => x.frame === c.frame)), c.en);
    if (!fen) continue;
    const composedEs = parts.pre + p.filler + parts.post;
    const fenCased = homeShell.pre ? fen.charAt(0).toLowerCase() + fen.slice(1) : fen;   // mid-sentence position
    const composedEn = homeShell.pre + fenCased + homeShell.post;
    const rep = {
      type: "close_swap",
      item: { id: itemId(c), es: composedEs, en: composedEn, tags: c.tags },
      prompt: _machineName(lesson.machine ? lesson : _machineLessonOf(frame), frame),
      swapHtml: `Now ask for: <b>${fen}</b>`
    };
    if (!taughtEs.has(norm(composedEs))) {
      rep.resNote = "You were never taught this sentence. You built it anyway.";
      return rep;
    }
    fallback = fallback || rep;                    // taught composition: still a valid cold rep, no novelty note
  }
  return fallback;
}
// "The bring-me machine. Your table workhorse." → "Your bring-me machine again."
function _machineName(mlesson, frame) {
  const beat = (mlesson && mlesson.beat) || "";
  const m = beat.match(/^The (.+?) machine\b/i);
  if (m) return `Your ${m[1]} machine again.`;
  return `Your ${(mlesson && mlesson.title) || frame} machine again.`;
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
  state.sessionSeq = (state.sessionSeq || 0) + 1; save();             // §6 variety rule clock (srs.js reads it)
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

  // redo of a completed lesson → no new items to weave, just drill.
  // §4.1 replay rule holds by construction: presentation cards key on exposures === 0,
  // so replayed items enter at their current rung, never back at the card.
  if (!newItems.length) {
    const board = extractPairsBoard(reviewPool);                      // §7.1 pairs: the review workhorse
    shuffle(reviewPool.map(it => reviewQuestion(it, reviewPool, rungCap))).forEach(q => qs.push(q));
    if (board) qs.splice(Math.min(1, qs.length), 0, board);
    const out = applyRhythm(qs.length ? qs : lessonItems.map(it => ({ type: chooseType(it), item: it })));
    out.push(...closeReps(lesson));                                   // §7.1 the close: the last reps, always
    return out;
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
  const out = applyRhythm(qs.length ? qs : lessonItems.map(it => ({ type: chooseType(it), item: it })));  // safety net
  out.push(...closeReps(lesson));                                     // §7.1 the close: the last reps, always
  return out;
}
// §8.5 exercise-variety rhythm: shape the *type* of graded slots by position — open on
// recognition warm-ups, lean production through the middle, close on an audio item — without
// reordering (the §6.1b weave stays intact) and without ever exceeding an item's earned tier.
// Only retypes; a slot whose item/pool can't honor the preference keeps its natural type.
function applyRhythm(qs) {
  const needsPool = t => t === "mc_es2en" || t === "listen_choice";
  const idx = [];
  qs.forEach((q, i) => { if (q && q.item && q.type !== "present" && q.type !== "intro") idx.push(i); });
  if (idx.length < 3) return qs;                          // too short to have a rhythm
  const steer = (i, prefer) => {
    const q = qs[i], t = chooseType(q.item, { prefer });
    if (t === q.type) return;
    if (needsPool(t) && !(Array.isArray(q.pool) && q.pool.length >= 3)) return;   // no distractors → leave as-is
    q.type = t;
  };
  steer(idx[0], "recognition");                           // ease in
  if (idx.length >= 6) steer(idx[1], "recognition");
  const midFrom = Math.floor(idx.length / 3), midTo = Math.ceil(idx.length * 2 / 3);
  for (let k = midFrom; k < midTo; k += 2) steer(idx[k], "production");   // production through the middle
  steer(idx[idx.length - 1], "audio");                    // close on audio
  return qs;
}
// pure-review session (Home "Review" entry / all lessons complete): mistakes first, then due
function composeReview() {
  state.sessionSeq = (state.sessionSeq || 0) + 1; save();             // §6 variety rule clock
  const mistakes = mistakesPool();
  const due = dueForReview();
  const seen = [...new Set([...mistakes, ...due])];
  const pool = (seen.length ? seen : dueForReview(0)).slice(0, 14);
  const board = extractPairsBoard(pool);                              // §7.1 pairs: the review workhorse
  const qs = applyRhythm(pool.map(it => reviewQuestion(it, pool)));
  if (board) qs.splice(Math.min(1, qs.length), 0, board);
  return qs;
}

let run = null;
function startLesson(lesson) {
  if (lesson.chain) return renderChain(lesson);   // M4 boss lesson — a chat-style dialogue (§7.5)
  // Compose FIRST (so the primer's guess item is still "new" here and stays in the session),
  // then run the primer on a first pass before the lesson proper. Replays/reviews skip straight in.
  run = { lesson, qs: composeSession(lesson), idx: 0, wrong: 0, restored: 0, answered: false, reasks: {}, pct: 0, review: false, missed: new Map() };
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
  $("#quit").addEventListener("click", () => confirmSheet({ title: "Leave the conversation?", body: "Your progress in it is lost.", confirmLabel: "Leave", cancelLabel: "Keep going", onConfirm: renderHome }));
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
  const f = footer(`<div class="chain-you">Your turn, say: "${item.en}"</div>
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
  computeScores(); applyTierUpdate(); save(); renderTopbar(); playSound("win");
  cloudSync().catch(() => {});
  const app = $("#app"); app.innerHTML = "";
  app.appendChild(el(`<div class="complete">
    <h2>¡Conversación completa!</h2>
    <div class="reward">${lesson.reward || "You held a whole conversation in Spanish, start to finish."}</div>
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
        <div class="primer-label">Take a guess, no penalty</div>
        <div class="primer-guess-es">${guess.es}</div>
        <div class="qtype">What do you think it means?</div>
        <div class="choices" id="pchoices"></div>
      </div></div>`));
    const cc = $("#pchoices");
    opts.forEach(o => { const b = el(`<button class="choice">${o}</button>`); b.addEventListener("click", reveal); cc.appendChild(b); });
    footer(`<button class="btn grey" id="pskip">Skip, just show me</button>`);
    $("#pskip").addEventListener("click", reveal);
  };
  const reveal = () => {
    recordExposure(itemId(guess));                 // reveal doubles as the guess item's presentation card → exposure 1
    app.innerHTML = "";
    app.appendChild(el(`<div class="runner primer">
      <div class="primer-body reveal">
        <div class="primer-label ok">Here it is</div>
        <div class="primer-guess-es big">${guess.es}</div>
        <span id="psp" class="ac-mount"></span>
        <div class="primer-en">${guess.en}</div>
        ${guess.anchor ? `<div class="primer-anchor">${icon('bulb', 16)} ${guess.anchor}</div>` : ""}
      </div></div>`));
    const pspAc = audioControl(() => speak(guess.es));
    $("#psp").replaceWith(pspAc);
    setTimeout(() => pspAc._fire(), 200);
    footer(`<button class="btn accent" id="pstart">Start the lesson →</button>`);
    $("#pstart").addEventListener("click", onDone);
  };
  scene();
}
// startReview() → due-item session; startReview(items) → focused review of those items (e.g. mistakes)
function startReview(items) {
  const qs = items && items.length ? items.map(it => reviewQuestion(it, items)) : composeReview();
  if (!qs.length) { toast("Nothing to review yet. Finish a lesson first."); return; }
  run = { lesson: { id: "__review__", topic: "Review", items: items || [] }, qs, idx: 0, wrong: 0, restored: 0, answered: false, reasks: {}, pct: 0, review: true, missed: new Map() };
  renderQuestion();
}

/* ----- speed round (M4, §6.4/§7.6): 60s timed match over phrases you already own. Advances nothing —
   pure retention + fun. The "you're ahead" payoff, and the fallback when nothing's due. ----- */
function speedPool() {
  const all = ALL_ITEMS || [];
  const grad = all.filter(it => { const s = learnPeek(it); return s && s.axes && s.axes.production && s.axes.cold && s.axes.native && s.axes.chained; });
  if (grad.length >= 4) return grad;
  const strong = all.filter(it => { const s = learnPeek(it); return s && s.exposures >= 5 && s.streak >= 2; });
  if (strong.length >= 4) return strong;
  return all.filter(it => exposuresOf(it) >= 1);                 // any seen phrase
}
function startSpeedRound() {
  const pool = speedPool();
  if (pool.length < 4) { toast("Speed rounds need phrases you know. Finish a few lessons first."); return; }
  renderSpeedRound(pool);
}
function renderSpeedRound(pool) {
  const app = $("#app"); clearFooter(); hideTabbar(); app.innerHTML = "";
  let timeLeft = 60, matched = 0, sel = null, timer = null;
  app.appendChild(el(`<div class="runner speed">
    <div class="progress-row"><button class="close-btn" id="quit">${icon('x', 24)}</button>
      <div class="speed-timer" id="stime">0:60</div><div class="speed-score" id="sscore">0</div></div>
    <div class="qtype" style="text-align:center;margin:6px 0 12px">Match them, fast!</div>
    <div class="match" id="sgrid"></div></div>`));
  const grid = $("#sgrid");
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  $("#quit").addEventListener("click", () => { stop(); renderHome(); });
  function loadBatch() {
    grid.innerHTML = "";
    const batch = shuffle(pool.slice()).slice(0, 5);
    const left = shuffle(batch.map(it => ({ key: it.es, label: it.es })));
    const right = shuffle(batch.map(it => ({ key: it.es, label: it.en })));
    for (let r = 0; r < batch.length; r++) [[left[r], "L"], [right[r], "R"]].forEach(([d, side]) => {
      const tile = el(`<button class="tile" data-key="${encodeURIComponent(d.key)}" data-side="${side}">${d.label}</button>`);
      tile.addEventListener("click", () => tap(tile));
      grid.appendChild(tile);
    });
    grid._left = batch.length;
  }
  function tap(tile) {
    if (tile.classList.contains("gone") || !timer) return;
    if (!sel) { [...grid.children].forEach(c => c.classList.remove("sel")); tile.classList.add("sel"); sel = tile; return; }
    if (sel === tile) { tile.classList.remove("sel"); sel = null; return; }
    if (sel.dataset.key === tile.dataset.key && sel.dataset.side !== tile.dataset.side) {
      [sel, tile].forEach(c => { c.classList.remove("sel"); c.classList.add("gone"); }); sel = null;
      matched++; $("#sscore").textContent = matched; playSound("correct");
      if (--grid._left === 0) loadBatch();
    } else {
      const a = sel, b = tile; [a, b].forEach(c => c.classList.add("bad")); sel = null;
      setTimeout(() => [a, b].forEach(c => c.classList.remove("sel", "bad")), 300);
    }
  }
  function tick() { timeLeft--; $("#stime").textContent = `0:${String(Math.max(0, timeLeft)).padStart(2, "0")}`; if (timeLeft <= 0) { stop(); results(); } }
  function results() {
    app.innerHTML = "";
    app.appendChild(el(`<div class="complete">
      <h2>Speed round</h2>
      <div class="scorebar"><div class="score"><div class="n">${matched}</div><div class="l">pairs matched</div></div></div>
      <div class="reward">Pure practice, nothing on the line, just reps that keep your phrases sharp.</div>
      <button class="btn accent" id="again">Go again</button><div style="height:10px"></div>
      <button class="btn grey" id="done">Done</button></div>`));
    $("#again").addEventListener("click", startSpeedRound);
    $("#done").addEventListener("click", renderHome);
  }
  loadBatch();
  timer = setInterval(tick, 1000);
}
// §8.3 ambient scenario tint — map a lesson's category to a barely-there background class
function sceneClass(topic) {
  return "scene-" + ({
    "Food & Drink": "food", "Transport": "transit", "Directions": "directions",
    "Lodging": "lodging", "Sights": "sights", "Numbers & Time": "numbers", "Advanced": "advanced"
  }[categoryOf(topic || "")] || "basics");
}
function renderQuestion() {
  const app = $("#app");
  const q = run.qs[run.idx];
  // progress only moves forward — re-queued misses extend the lesson, never rewind the bar
  const prevPct = run.pct || 0;
  run.pct = Math.max(prevPct, Math.round(run.idx / run.qs.length * 100));
  // §8.2 progress-milestone haptic: a slightly richer notch as the bar passes 25/50/75%
  if ([25, 50, 75].some(m => prevPct < m && run.pct >= m)) haptic("milestone");
  clearFooter();
  hideTabbar();
  app.innerHTML = "";
  const wrap = el(`<div class="runner ${sceneClass(run.lesson && run.lesson.topic)}"></div>`);   // §8.3 ambient scenario tint
  wrap.appendChild(el(`
    <div class="progress-row">
      <button class="close-btn" id="quit">${icon('x',24)}</button>
      <div class="pbar"><i style="width:${run.pct}%"></i></div>
      <span class="q-sring" id="q-sring"></span>
      <div class="stick" id="q-stick">Stronger</div>
    </div>`));
  wrap.appendChild(el(`<div id="qbody" class="qenter"></div>`));   // §8.3 each question springs in
  app.appendChild(wrap);
  // §8.2 card-press haptic — one delegated listener covers every interactive card in the runner
  wrap.addEventListener("pointerdown", e => { if (e.target.closest(".choice,.word,.tile")) haptic("press"); });
  $("#quit").addEventListener("click", () => confirmSheet({ title: "Quit lesson?", body: "Your progress in it is lost.", confirmLabel: "Quit lesson", cancelLabel: "Keep going", onConfirm: renderHome }));
  run.answered = false;
  // strength ring only when exactly one item is on stage (§3.7); multi-item boards
  // (pairs, match) use a collective whisper instead
  const sring = document.getElementById("q-sring");
  if (sring) sring.style.display = q.item ? "" : "none";
  const qs = q.item && state.learn ? state.learn[itemId(q.item)] : null;
  _setQStrength(qs ? Math.round(itemStrength(qs)) : 0, false);
  // make the mistake re-queue visible: label a phrase you missed coming back around
  if (q.requeued) $("#qbody").appendChild(el(`<div class="retry-chip">${icon('arrows-clockwise', 15)} Second chance, you missed this one</div>`));
  ({ intro: renderIntro, present: renderPresent, match: renderMatch, build: renderBuild, mc_es2en: renderMC,
     type_translation: renderType, listen_type: renderListen, fill_blank: renderFill, speak_it: renderSpeak,
     listen_choice: renderListenChoice, reply_listen: renderReply,
     pairs: renderPairs, close: renderClose, close_swap: renderClose,
     sound_choice: renderSoundChoice, audio_cloze: renderAudioCloze, ear_build: renderEarBuild,
     reply: renderReplyChat }[q.type])(q);
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
  // Spain photos we actually have (img/es/, CC0 placeholders); other categories fall back to the
  // img/mx set until Spain versions are chosen. Add a name to ES_PHOTOS when its img/es/<name>.jpg lands.
  const region = (state.active === "spain" && ES_PHOTOS.has(pick)) ? "es" : "mx";
  return `./img/${region}/${pick}.jpg`;
}
const ES_PHOTOS = new Set(["cafe", "market", "default"]);
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
          <span class="intro-hear ac-mount"></span>
        </div>
      </div>`));
      const introAc = audioControl(() => speak(it.es));
      body.querySelector(".intro-hear").replaceWith(introAc);
      if (!seen.has(it.id)) { seen.add(it.id); setTimeout(() => introAc._fire(), 250); }
      const f = footer(`<div class="intro-nav">${i > 0 ? `<button class="btn grey" id="iback">← Back</button>` : `<span class="nav-gap"></span>`}<button class="btn" id="inext">${i === items.length - 1 ? "See all →" : "Next →"}</button></div>`);
      if (i > 0) f.querySelector("#iback").addEventListener("click", () => { i--; draw(); });
      f.querySelector("#inext").addEventListener("click", () => { i++; draw(); });
    } else {
      body.appendChild(el(`<div class="qtype">All ${items.length} new phrases · tap to hear</div>`));
      const list = el(`<div class="intro-list"></div>`);
      items.forEach(it => {
        // whole row is the trigger (variant C): a gold speaker visual that animates while it plays
        const row = el(`<div class="intro-row" role="button" tabindex="0">
          <div class="intro-txt"><div class="intro-es">${it.es}</div><div class="intro-en">${it.en}</div>${it.note ? `<div class="intro-note">${it.note}</div>` : ""}</div>
          <span class="ac-speaker" aria-hidden="true">${acSpeakerGlyph()}<span class="ac-bars"><span></span><span></span><span></span><span></span></span></span></div>`);
        const spk = row.querySelector(".ac-speaker");
        row.addEventListener("click", () => {
          haptic("press"); speak(it.es);
          spk.classList.add("playing"); clearTimeout(spk._t); spk._t = setTimeout(() => spk.classList.remove("playing"), 1600);
        });
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
// §4c.1 v2.1 dismissal check targets the NEW material — the new chunk for chunked phrases, else the item.
// Distractor is an auto-picked plausible near-meaning (content pass will author better ones).
function _itemDistractor(item) {
  const m = mcOptions(item, true, run.lesson && run.lesson.items);
  return m.options.find(o => norm(o) !== norm(m.answer)) || null;
}
function _glossDistractor(correctEn) {
  const wc = s => s.trim().split(/\s+/).length, tgt = wc(correctEn);
  const pool = [];
  (ALL_ITEMS || []).forEach(it => { if (Array.isArray(it.chunks)) it.chunks.forEach(c => { if (c[1]) pool.push(c[1]); }); });
  const uniq = [...new Set(pool)].filter(g => norm(g) !== norm(correctEn));
  const near = uniq.filter(g => Math.abs(wc(g) - tgt) <= 1);
  const pick = near.length ? near : uniq;
  return pick.length ? sample(pick, 1)[0] : null;
}
function _presentCheck(item, chunked) {
  const nc = chunked ? (item.chunks.find(c => c[2] === "new") || null) : null;
  if (nc) return { es: nc[0], correct: nc[1], distract: _glossDistractor(nc[1]) || _itemDistractor(item) };
  return { es: null, correct: item.en, distract: _itemDistractor(item) };
}
function renderPresent(q) {
  const item = q.item;
  const body = $("#qbody");
  const chunked = Array.isArray(item.chunks) && item.chunks.length;
  const short = item.es.trim().split(/\s+/).length < 3;
  // Attention semantics (decisions 2026-07-15, per design/presentation-card.html): GOLD + a NEW tag mark
  // the one new piece; everything already-known is unmarked (green "known" outline retired app-wide). The
  // new piece is content-flagged (chunks[i][2] === "new"). Tap any pill → meaning popover + chunk audio.
  // no "New phrase" label on a re-teach — the "Second chance" chip already frames it
  if (!q.requeued) {
    const newCount = chunked ? item.chunks.filter(c => c[2] === "new").length : 0;
    const label = short && !chunked ? "NEW WORD"
      : "NEW PHRASE" + (newCount === 1 ? " · ONE NEW PIECE" : "");
    body.appendChild(el(`<div class="present-label">${label}</div>`));
  }
  let card, pop = null;
  if (chunked) {
    const pills = item.chunks.map((c, i) =>
      `<button class="chunk-pill ${c[2] === "new" ? "new" : ""}" data-i="${i}">${c[0]}${c[2] === "new" ? `<span class="cp-tag">NEW</span>` : ""}</button>`).join("");
    card = el(`<div class="present-card chunked">
        <div class="chunk-row">${pills}</div>
        <div class="present-en">${item.en}</div>
        <div class="present-pop" id="present-pop"></div>
      </div>`);
    pop = card.querySelector("#present-pop"); let hideT;
    card.querySelectorAll(".chunk-pill").forEach(p => p.addEventListener("click", e => {
      e.stopPropagation(); clearTimeout(hideT);
      const i = +p.dataset.i;
      pop.textContent = item.chunks[i][1]; pop.classList.add("show");
      const s = card.getBoundingClientRect(), r = p.getBoundingClientRect();
      pop.style.left = Math.max(8, r.left - s.left) + "px"; pop.style.top = (r.top - s.top - 38) + "px";
      speak(item.chunks[i][0]);
      p.classList.add("playing"); clearTimeout(p._t); p._t = setTimeout(() => p.classList.remove("playing"), 1200);
      hideT = setTimeout(() => pop.classList.remove("show"), 1800);
    }));
    document.addEventListener("click", () => pop && pop.classList.remove("show"));
  } else {
    const ctx = short && item.contextEs
      ? `<div class="present-ctx"><span class="es" data-es="${item.contextEs.replace(/"/g, "&quot;")}">${item.contextEs}</span>${item.contextEn ? ` <span class="ctx-en">(${item.contextEn})</span>` : ""}</div>`
      : "";
    card = el(`<div class="present-card">
      <div class="present-es">${item.es}</div>
      <div class="present-en">${item.en}</div>
      ${ctx}
      ${item.note ? `<div class="present-note">${item.note}</div>` : ""}
      ${item.anchor ? `<div class="present-anchor"><span class="lead">Think:</span> ${item.anchor}</div>` : ""}
    </div>`);
    const ctxEs = card.querySelector(".present-ctx .es");
    if (ctxEs) ctxEs.addEventListener("click", () => {
      speak(ctxEs.dataset.es);
      ctxEs.classList.add("playing"); clearTimeout(ctxEs._t); ctxEs._t = setTimeout(() => ctxEs.classList.remove("playing"), 1200);
    });
  }
  body.appendChild(card);
  // audio row: 44px speaker + inline hint, matching the artifact's AudioControl composition
  const replay = audioControl(() => speak(item.es));
  const hint = chunked ? "Tap any part to hear it alone" : "Tap the sentence to hear it in context";
  const audioRow = el(`<div class="present-audio"></div>`);
  audioRow.appendChild(replay);
  audioRow.appendChild(el(`<span class="audio-hint">${hint}</span>`));
  body.appendChild(audioRow);
  // the chunked card's "Think:" anchor sits below the audio row (its meta block); plain card carries it inline
  if (chunked && item.anchor) body.appendChild(el(`<div class="present-anchor"><span class="lead">Think:</span> ${item.anchor}</div>`));
  setTimeout(() => replay._fire(), 250);
  // §4c.1 v2.1 active dismissal: a two-soft-option meaning check on the NEW material replaces "Got it".
  // Ungraded — correct → green + auto-advance; wrong → gold-ring the correct option (card can't be failed).
  run.exposed = run.exposed || new Set();
  const advance = () => {
    const id = itemId(item);
    if (!run.exposed.has(id)) { run.exposed.add(id); recordExposure(id); }   // idempotent — Back can't inflate exposures
    next();
  };
  const check = _presentCheck(item, chunked);
  let distract = check.distract;
  if (!distract || norm(distract) === norm(check.correct)) distract = "not sure";
  const prompt = check.es ? `<span class="q">${check.es}</span> means:` : "Tap the meaning";
  body.appendChild(el(`<div class="microrep">${prompt}</div>`));
  const two = shuffle([{ t: check.correct, ok: 1 }, { t: distract, ok: 0 }]);
  const opts = el(`<div class="opts">${two.map(o => `<button class="opt" data-ok="${o.ok}">${o.t}</button>`).join("")}</div>`);
  let odone = false;
  opts.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.ok === "1") { if (odone) return; odone = true; haptic("correct"); b.classList.add("got"); setTimeout(advance, 650); }
    else { haptic("press"); opts.querySelectorAll(".opt").forEach(o => { if (o.dataset.ok === "1") o.classList.add("hinted"); }); }
  }));
  body.appendChild(opts);
  // §feedback #1: Back — step back to the previous present card (never rewind into a graded question)
  const canBack = run.idx > 0 && run.qs[run.idx - 1] && run.qs[run.idx - 1].type === "present";
  if (canBack) {
    const f = footer(`<button class="btn grey" id="pback">${icon('caret-left', 18)} Back</button>`);
    f.querySelector("#pback").addEventListener("click", () => { run.idx--; renderQuestion(); });
  } else clearFooter();
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
  body.appendChild(el(`<div class="effort-line">${icon('pencil', 16)} Typing it cold is what makes it stick. This is the rep that counts.</div>`));
}
// meaning-pick only (§7.0, 2026-07-20): the shown/heard phrase is es, the options are ENGLISH.
// The en→es direction (es-phrase options) was phrase-MC and is retired.
function renderMC(q) {
  const item = q.item;
  const { answer, options } = mcOptions(item, true, q.pool && q.pool.length ? q.pool : run.lesson.items);
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">What does this mean?</div>`));
  const pe = presentEs(item);
  body.appendChild(el(`<div class="prompt es-phrase">${pe.text}</div>`));
  if (pe.variant) body.appendChild(el(`<div class="prompt-sub">Another common way to say it</div>`));
  body.appendChild(audioControl(() => speak(pe.text)));
  body.appendChild(mcChoices(options, answer, item));
}
// shared choice grid → grades opt===answer.
// §feedback #2: strip leading/trailing punctuation (¿ ¡ ? ! . , : ; " «») from the DISPLAYED
// options so a lone question mark / inverted mark can't hand away which one is right. Grading works
// in the same stripped space; the fully-punctuated form is revealed in the feedback afterward.
// strips only the telltale marks (¿ ¡ ? ! . , : ; and wrapping quotes) — NOT parentheses, which are
// content (e.g. "Rare (steak)" must keep its closing bracket).
const choiceLabel = s => String(s).replace(/^[¿¡"«“‘\s]+|[?!.,;:"»”’\s]+$/g, "");
function mcChoices(options, answer, item) {
  const ans = choiceLabel(answer);
  const choices = el(`<div class="choices"></div>`);
  options.forEach(opt => {
    const c = el(`<button class="choice">${choiceLabel(opt)}</button>`);
    c.addEventListener("click", () => {
      if (run.answered) return;
      [...choices.children].forEach(ch => ch.classList.add(ch.textContent === ans ? "correct" : (ch === c ? "wrong" : "dim")));
      const ok = choiceLabel(opt) === ans;
      // §5.2b: log the chosen wrong option (single words only) so confusion pairs can
      // spawn targeted sound-choice reps later; capped at the last 3
      if (!ok && /^\S+$/.test(choiceLabel(opt))) {
        const st = learnState(itemId(item));
        if (st) { st.conf = (st.conf || []).slice(-2); st.conf.push(choiceLabel(opt)); }
      }
      grade(ok, item);
    });
    choices.appendChild(c);
  });
  return choices;
}

/* ("respond" renderer retired 2026-07-20 — es-phrase options were phrase-MC, spec §7.0.
   Its job splits into the reply (English options) and the close (cold production). */

/* ----- understand the reply (M2): hear what a local says back → pick its meaning ----- */
function renderReply(q) {
  const item = q.item, r = item.reply;
  if (!r) return renderMC({ type: "mc_es2en", item });                 // safety: no reply data
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Understand the reply</div>`));
  body.appendChild(el(`<div class="prompt-sub" style="margin-bottom:8px">You said: “${item.es}”</div>`));
  const play = audioControl(slow => { if (slow) q.slow = true; slow ? speak(r.es, 0.55) : speak(r.es); }, { speed: true });
  body.appendChild(play);
  body.appendChild(el(`<div class="prompt-sub">They answer. What did they say?</div>`));
  setTimeout(() => play._fire(), 300);
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
  const play = audioControl(slow => { if (slow) q.slow = true; slow ? speak(pe.text, 0.55) : speak(pe.text); }, { speed: true });
  body.appendChild(play);
  setTimeout(() => play._fire(), 300);
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
  // §5.4: 0.75× slower replay is scaffolding — using it (slow=true) means this rep doesn't earn the `native` axis
  const play = audioControl(slow => { if (slow) q.slow = true; slow ? speak(pe.text, 0.55) : speak(pe.text); }, { speed: true });
  body.appendChild(play);
  setTimeout(() => play._fire(), 350);
  const input = el(`<input class="text-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribe en español…">`);
  body.appendChild(input);
  setTimeout(() => input.focus(), 50);
  const f = footer(`<button class="btn grey" id="skip">Can't tell, skip</button><div style="height:10px"></div><button class="btn" id="check" disabled>Check</button>`);
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
    rec.onerror = () => { mic.classList.remove("live"); status.textContent = "Didn't catch that, tap to try again."; };
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
  body.appendChild(el(`<div class="prompt es-stage-line">${shown}</div>`));
  body.appendChild(el(`<div class="prompt-sub">${item.en}</div>`));
  const choices = el(`<div class="choices"></div>`);
  options.forEach(opt => {
    const c = el(`<button class="choice">${opt}</button>`);
    c.addEventListener("click", () => {
      if (run.answered) return;
      [...choices.children].forEach(ch => ch.classList.add(ch.textContent === answer ? "correct" : (ch === c ? "wrong" : "dim")));
      const ok = opt === answer;
      if (!ok) {                                   // §5.2b: word-level confusion log → sound-choice remediation
        const st = learnState(itemId(item));
        if (st) { st.conf = (st.conf || []).slice(-2); st.conf.push(opt); }
      }
      grade(ok, item);
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
  const prompt = el(`<div class="prompt es-stage-line">${shown}</div>`); body.appendChild(prompt);
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
    body.appendChild(el(`<div class="prompt-sub">The words you know are placed, add the rest.</div>`));
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
    if (grid._left === 0) { playSound("correct"); haptic("correct"); setTimeout(() => next(), 350); }
  } else {
    tile.classList.add("bad"); sel.classList.add("bad");
    run.wrong++;
    playSound("wrong"); haptic("wrong");
    setTimeout(() => { tile.classList.remove("bad", "sel"); sel.classList.remove("bad", "sel"); grid._sel = null; }, 350);
  }
}

/* ===== §7.1 exercise batch (2026-07-20): pairs, the close, sound choice, audio cloze,
   ear build, the reply. All content-agnostic templates; artifact captions are the canonical
   spec (design/pairs-exercise.html, design/the-close.html, design/exercise-variants.html). ===== */

// split a machine frame around its ___ slot; pull the filler out of a full phrase.
// Case-insensitive match, original casing preserved (frames are authored lowercase).
function _frameParts(frame, es) {
  const cut = frame.indexOf("___"); if (cut < 0) return null;
  const pre = frame.slice(0, cut), post = frame.slice(cut + 3);
  const le = es.toLowerCase();
  if (!le.startsWith(pre.toLowerCase()) || !le.endsWith(post.toLowerCase())) return null;
  if (es.length <= pre.length + post.length) return null;
  return {
    pre: es.slice(0, pre.length),
    post: post.length ? es.slice(es.length - post.length) : "",
    filler: es.slice(pre.length, es.length - post.length)
  };
}
// the shared en shell of a frame family ("Where is " ___ "?") — computed from the
// members' en strings (longest common prefix + suffix), never authored.
function _enShell(items) {
  const ens = items.map(it => it.en).filter(Boolean);
  if (ens.length < 2) return null;
  let p = ens[0], s = ens[0];
  for (const e of ens) {
    let i = 0; while (i < p.length && i < e.length && p[i] === e[i]) i++; p = p.slice(0, i);
    let j = 0; while (j < s.length && j < e.length && s[s.length - 1 - j] === e[e.length - 1 - j]) j++; s = s.slice(s.length - j);
  }
  return (p.length + s.length) ? { pre: p, post: s } : null;
}
function _fillerEn(shell, en) {
  if (!shell || !en) return null;
  if (!en.startsWith(shell.pre) || !en.endsWith(shell.post) || en.length <= shell.pre.length + shell.post.length) return null;
  return en.slice(shell.pre.length, en.length - shell.post.length);
}
// small gold speaker glyph + animated bars for FLAT cards (glyph color law §3.7:
// flat cards carry the gold glyph; raised gold buttons carry the dark one).
function _cardAudioHtml() {
  return `<span class="pc-glyph">${icon('speaker', 16)}</span><span class="pbars" aria-hidden="true"><span></span><span></span><span></span></span>`;
}
function _cardPlay(card, es) {
  speak(es);
  card.classList.add("playing");
  clearTimeout(card._pt); card._pt = setTimeout(() => card.classList.remove("playing"), 1100);
}

/* ----- pairs (§7.1): 4 audio × 4 en, the review-block workhorse. Matched pairs settle
   PRESSED-IN (discrete objects reaching done — never fusion); on the 4th match THE REUNION
   composes the board into paired rows (FLIP, one pair at a time); collective "4 stronger"
   whisper (multi-item board: no per-item ring). Mismatch dims briefly: no red, no shake. ----- */
function renderPairs(q) {
  const items = q.items;
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Match the sound to its meaning</div>`));
  const grid = el(`<div class="pairs"></div>`);
  const audioOrder = shuffle(items.map((_, i) => i));
  const enOrder = shuffle(items.map((_, i) => i));
  for (let r = 0; r < items.length; r++) {
    const a = el(`<button class="pcard audio" data-idx="${audioOrder[r]}" data-side="audio">${_cardAudioHtml()}</button>`);
    const e = el(`<button class="pcard en" data-idx="${enOrder[r]}" data-side="en">${items[enOrder[r]].en}</button>`);
    [a, e].forEach(c => c.addEventListener("click", () => tapCard(c)));
    grid.appendChild(a); grid.appendChild(e);
  }
  body.appendChild(grid);
  let sel = null, matched = 0;
  const missed = new Set();                       // audio items involved in a mismatch → low-weight outcome
  function tapCard(c) {
    const it = items[+c.dataset.idx];
    if (c.classList.contains("matched")) { if (c.dataset.side === "audio") _cardPlay(c, it.es); return; }
    if (run.answered) return;
    if (c.dataset.side === "audio") _cardPlay(c, it.es);
    if (!sel) { sel = c; c.classList.add("sel"); return; }
    if (sel === c) return;                        // re-tap: replay handled above, stay selected
    if (sel.dataset.side === c.dataset.side) { sel.classList.remove("sel"); sel = c; c.classList.add("sel"); return; }
    const a = sel.dataset.side === "audio" ? sel : c;
    const e = sel.dataset.side === "en" ? sel : c;
    if (a.dataset.idx === e.dataset.idx) {
      [a, e].forEach(x => { x.classList.remove("sel"); x.classList.add("matched"); });
      const mi = items[+a.dataset.idx];
      a.innerHTML = `<span class="pc-glyph">${icon('speaker', 16)}</span><span class="es-word">${mi.es}</span><span class="pbars" aria-hidden="true"><span></span><span></span><span></span></span>`;
      _cardPlay(a, mi.es);                        // sound, meet spelling
      haptic("correct");
      // a clean pair is a real review rep; a missed one records at low weight [tune]:
      // exposure only, so the slip neither advances nor resets the item (§5, artifact caption)
      const id = itemId(mi);
      if (missed.has(id)) recordExposure(id); else recordAnswer(id, true, { mode: "pairs" });
      matched++;
      if (matched === items.length) { run.answered = true; setTimeout(() => reunite(), 420); }
    } else {
      missed.add(itemId(items[+a.dataset.idx]));
      run.wrong++;
      const s1 = sel, s2 = c;
      [s1, s2].forEach(x => { x.classList.remove("sel"); x.classList.add("miss"); });
      setTimeout(() => { s1.classList.remove("miss"); s2.classList.remove("miss"); }, 450);
    }
    sel = null;
  }
  // THE REUNION: the board composes itself into paired rows, one pair at a time,
  // top row first (FLIP, 420ms travel, 200ms stagger) — the scattered game becomes
  // the tidy study sheet. Sequential composes, simultaneous shuffles (§4.9).
  function reunite() {
    const cards = [...grid.children];
    const rects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));
    items.forEach((_, i) => {
      const a = cards.find(x => x.dataset.side === "audio" && +x.dataset.idx === i);
      const e = cards.find(x => x.dataset.side === "en" && +x.dataset.idx === i);
      grid.appendChild(a); grid.appendChild(e);
    });
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      [...grid.children].forEach(c => {
        const first = rects.get(c), last = c.getBoundingClientRect();
        const dx = first.left - last.left, dy = first.top - last.top;
        if (dx || dy) { c.style.transform = `translate(${dx}px, ${dy}px)`; c.style.transition = "none"; }
      });
      void grid.offsetHeight;
      [...grid.children].forEach((c, i) => {
        c.style.transition = `transform 420ms cubic-bezier(.2,.7,.3,1) ${Math.floor(i / 2) * 200}ms`;
        c.style.transform = "";
      });
      setTimeout(() => [...grid.children].forEach(c => { c.style.transition = ""; }), 1100);
    }
    playSound("correct");
    const clean = items.filter(it => !missed.has(itemId(it))).length;
    const barEl = document.querySelector(".pbar > i");
    if (barEl) { run.pct = Math.max(run.pct || 0, Math.round((run.idx + 1) / run.qs.length * 100)); barEl.style.width = run.pct + "%"; }
    const grown = el(`<div class="res-grown pairs-grown">
      ${clean ? `<div class="pairs-tick">${clean} stronger</div>` : ""}
      <div class="pairs-allset">Four sounds, four meanings, four spellings. All yours.</div>
      <button class="btn res-cont">Continue</button>
    </div>`);
    grown.querySelector(".res-cont").addEventListener("click", () => { $("#qbody").classList.add("leaving"); setTimeout(next, 200); });
    body.appendChild(grown);
    setTimeout(() => grown.classList.add("show"), reduced ? 0 : 1050);
  }
}

/* ----- the close (§7.1): end-of-lesson ritual, cold typed, scaffold-free. Announced in
   flow by the gold THE CLOSE kicker; no interstitial. The machine is RUN here, never built.
   type "close" = the lesson's anchor item; type "close_swap" = a frame-swap variation the
   composer built (q.item is synthetic: the filler's id carrying the composed es/en). ----- */
function renderClose(q) {
  const item = q.item;
  const body = $("#qbody");
  body.appendChild(el(`<div class="close-kicker">THE CLOSE</div>`));
  body.appendChild(el(`<div class="close-prompt">${q.type === "close" ? `Say it in Spanish: “${item.en}”` : q.prompt}</div>`));
  if (q.swapHtml) body.appendChild(el(`<div class="swap-line">${q.swapHtml}</div>`));
  const wrap = el(`<div class="tiwrap es-stage"><span class="sweep3"></span></div>`);
  const input = el(`<input class="text-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribe aquí…">`);
  wrap.insertBefore(input, wrap.firstChild);
  body.appendChild(wrap);
  setTimeout(() => input.focus(), 50);
  q.esOnStage = true;                              // the typed sentence is the es on stage (no-repeat §3.7)
  // the answer matures in place to the canonical form: accepted slips are corrected
  // silently by the reveal itself (es-always-reveals + silent forgiveness, both hold)
  q.onResolve = () => { input.value = item.es; input.readOnly = true; input.blur(); wrap.classList.add("swept"); };
  const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
  input.addEventListener("input", () => { $("#check").disabled = !input.value.trim(); });
  const submit = () => {
    if (run.answered || !input.value.trim()) return;
    if (q.type === "close") return gradeTyped(input.value, item);
    const j = judgeTyped(input.value, item.es);        // composed sentence: graded as taught, no variants
    const extra = j.accent ? "Almost: watch the accent." : (j.typo ? "Close: mind the spelling." : null);
    finishGrade(j.ok, item, extra, input.value);
  };
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  f.querySelector("#check").addEventListener("click", submit);
}

/* ----- sound choice (§7.1): a sentence with a blank + two audio options — which sound
   belongs? Wired to logged confusion pairs first (§5.2b, the mistake loop's targeted
   remediation), phonetic near-forms otherwise. The completed sentence IS the es reveal. ----- */
// candidate confusable words for a blanked word: logged confusions → close edit-distance
// keywords from the deck. Principled, never random (§7.1); null = infeasible this rep.
function _soundDistractor(item, answer) {
  const st = learnPeek(item);
  const na = norm(answer);
  const logged = ((st && st.conf) || []).filter(w => /^\S+$/.test(w) && norm(w) !== na);
  if (logged.length) return pick(logged);
  // phonetic near-forms need substance to be near anything: short function words are
  // infeasible (edit distance is meaningless at 2 letters), and a near-form must be
  // close in BOTH distance and length (cuenta/cuento, not no/baño)
  if (na.length < 4) return null;
  const clean = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "");
  const pool = [...new Set((ALL_ITEMS || []).flatMap(x => (x.keywords || []).map(clean)))]
    .filter(w => /^\S+$/.test(w) && norm(w) !== na && w.length >= 4 && Math.abs(w.length - answer.length) <= 2);
  const scored = pool.map(w => ({ w, d: levenshtein(norm(w), na) })).filter(x => x.d >= 1 && x.d <= 2);
  if (!scored.length) return null;
  scored.sort((a, b) => a.d - b.d);
  return scored[0].w;
}
function renderSoundChoice(q) {
  const item = q.item;
  const clean = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "");
  const words = item.es.split(" ");
  const kws = (item.keywords || []).map(k => norm(k));
  let idxs = words.map((w, i) => i).filter(i => kws.includes(norm(clean(words[i]))));
  if (!idxs.length) idxs = words.map((w, i) => i).filter(i => clean(words[i]).length >= 4);
  if (!idxs.length) { q.type = "mc_es2en"; return renderMC(q); }    // only function words → nothing worth blanking
  const idx = idxs[(exposuresOf(item) || 0) % idxs.length];        // §4b.1 blank rotation
  const raw = words[idx];
  const lead = (raw.match(/^[¿¡("«]+/) || [""])[0];
  const trail = (raw.match(/[?!).,;:"»]+$/) || [""])[0];
  const answer = raw.slice(lead.length, raw.length - trail.length);
  const distractor = _soundDistractor(item, answer);
  if (!distractor) { q.type = "mc_es2en"; return renderMC(q); }     // safety: no principled distractor
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Which sound completes it?</div>`));
  const shown = words.map((w, i) => i === idx ? `${lead}<span class="blank sc-blank" id="sc-blank">---</span>${trail}` : w).join(" ");
  body.appendChild(el(`<div class="prompt es-stage-line">${shown}</div>`));
  const opts = el(`<div class="audio-opts"></div>`);
  const pairAB = shuffle([{ w: answer, right: true }, { w: distractor, right: false }]);
  let sel = null;
  pairAB.forEach(o => {
    const c = el(`<button class="pcard sc-card">${_cardAudioHtml()}</button>`);
    c.addEventListener("click", () => {
      if (run.answered) return;
      _cardPlay(c, o.w);
      if (sel) sel.classList.remove("sel");
      sel = c; c.classList.add("sel");
      $("#check").disabled = false;
    });
    c._opt = o;
    opts.appendChild(c);
  });
  body.appendChild(opts);
  body.appendChild(el(`<div class="sc-hint">Tap to hear each. Pick the one that belongs.</div>`));
  q.esOnStage = true;                              // the filled sentence is the es reveal (no-repeat §3.7)
  q.onResolve = () => {
    [...opts.children].forEach(c => {
      if (c._opt.right) {
        c.classList.remove("sel"); c.classList.add("settled");
        c.insertBefore(el(`<span class="es-word">${c._opt.w}</span>`), c.querySelector(".pbars"));
      } else c.classList.add("fade");
    });
    const b = document.getElementById("sc-blank");
    if (b) { b.textContent = answer; b.classList.add("filled"); }
  };
  const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
  f.querySelector("#check").addEventListener("click", () => {
    if (run.answered || !sel) return;
    const ok = sel._opt.right;
    if (!ok) { const st = learnState(itemId(item)); if (st) { st.conf = (st.conf || []).slice(-2); st.conf.push(sel._opt.w); } }
    grade(ok, item);
  });
}

/* ----- audio cloze (§7.1): hear the whole phrase, type the missing word. Blank rotation
   picks the gap; silent forgiveness applies; the word fills the blank at resolution. ----- */
function renderAudioCloze(q) {
  const item = q.item;
  const clean = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "");
  const words = item.es.split(" ");
  const kws = (item.keywords || []).map(k => norm(k));
  let idxs = words.map((w, i) => i).filter(i => kws.includes(norm(clean(words[i]))));
  if (!idxs.length) idxs = words.map((w, i) => i).filter(i => clean(words[i]).length >= 4);
  if (!idxs.length) idxs = words.map((w, i) => i);
  const idx = idxs[(exposuresOf(item) || 0) % idxs.length];        // §4b.1 blank rotation
  const raw = words[idx];
  const lead = (raw.match(/^[¿¡("«]+/) || [""])[0];
  const trail = (raw.match(/[?!).,;:"»]+$/) || [""])[0];
  const answer = raw.slice(lead.length, raw.length - trail.length);
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Listen, then type the missing word</div>`));
  const row = el(`<div class="bigspk"><span class="ac-mount"></span><span class="audio-hint">Hear the whole phrase</span></div>`);
  const play = audioControl(() => speak(item.es));
  row.querySelector(".ac-mount").replaceWith(play);
  body.appendChild(row);
  setTimeout(() => play._fire(), 350);
  const shown = words.map((w, i) => i === idx ? `${lead}<span class="blank sc-blank" id="sc-blank">---</span>${trail}` : w).join(" ");
  body.appendChild(el(`<div class="prompt es-stage-line">${shown}</div>`));
  const input = el(`<input class="text-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="La palabra que falta…">`);
  body.appendChild(input);
  setTimeout(() => input.focus(), 50);
  q.esOnStage = true;                              // the completed sentence is the es reveal (no-repeat §3.7)
  q.onResolve = () => {
    input.readOnly = true; input.blur();
    const b = document.getElementById("sc-blank");
    if (b) { b.textContent = answer; b.classList.add("filled"); }
  };
  const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
  input.addEventListener("input", () => { $("#check").disabled = !input.value.trim(); });
  const submit = () => {
    if (run.answered || !input.value.trim()) return;
    const j = judgeTyped(input.value, answer);
    const extra = j.accent ? "Almost: watch the accent." : (j.typo ? "Close: mind the spelling." : null);
    finishGrade(j.ok, item, extra, input.value);
  };
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  f.querySelector("#check").addEventListener("click", submit);
}

/* ----- ear build (§7.1): audio only, NO English shown — assemble from tiles. Resolution
   fuses the assembly (becoming a sentence) and the MEANING arrives in the materialization.
   Distractor tiles are a difficulty dial on the scaffolded→cold axis: 1–2 early, 3–4 at
   strength [tune]; selected from confusion near-forms → same-frame fillers → structural
   twins — never random. Distractors must test the EAR, not process of elimination. ----- */
function _earDistractors(item, count) {
  const strip = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "");
  const own = new Set(item.es.toLowerCase().split(/\s+/).map(strip).map(norm));
  const out = [];
  const push = w => { if (w && /^\S+$/.test(w) && !own.has(norm(w)) && !out.some(x => norm(x) === norm(w))) out.push(w); };
  const st = learnPeek(item);
  ((st && st.conf) || []).forEach(push);                                 // 1) logged confusion near-forms
  if (out.length < count && item.frame) {
    (ALL_ITEMS || []).filter(x => x !== item && x.frame === item.frame)  // 2) same-frame fillers
      .forEach(x => { const p = _frameParts(item.frame, x.es); if (p) p.filler.split(/\s+/).forEach(w => push(strip(w))); });
  }
  if (out.length < count) {
    const tags = item.tags || [];                                        // 3) structural twins: same-category
    const pool = [...new Set((ALL_ITEMS || [])                           //    keywords nearest in shape
      .filter(x => x !== item && tags.length && (x.tags || []).some(t => tags.includes(t)))
      .flatMap(x => (x.keywords || []).map(strip)))]
      .filter(w => /^\S+$/.test(w) && !own.has(norm(w)));
    sample(pool, count).forEach(push);
  }
  return out.slice(0, count);
}
function renderEarBuild(q) {
  const item = q.item;
  const strip = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "") || w;
  const original = item.es.split(" ");
  const bankWords = original.map(strip);
  const display = i => (i === 0 ? bankWords[i].charAt(0).toLowerCase() + bankWords[i].slice(1) : bankWords[i]);
  // distractor count keys on the item's rung: scaffolded gets 1–2, cold gets 3–4 [tune §8t]
  const s = learnPeek(item);
  const cold = s && s.exposures >= 5 + (item.difficulty || 2);
  const dCount = cold ? 3 + Math.round(Math.random()) : 1 + Math.round(Math.random());
  const distractors = _earDistractors(item, dCount);
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Build what you hear</div>`));
  const row = el(`<div class="bigspk"><span class="ac-mount"></span><span class="audio-hint">No text. Just your ear.</span></div>`);
  const play = audioControl(() => speak(item.es));
  row.querySelector(".ac-mount").replaceWith(play);
  body.appendChild(row);
  setTimeout(() => play._fire(), 350);
  const ans = el(`<div class="build-answer"></div>`);
  const bank = el(`<div class="bank"></div>`);
  body.appendChild(ans); body.appendChild(bank);
  const chosen = [];                               // indices into tiles[]
  const tiles = shuffle([
    ...original.map((_, i) => ({ w: bankWords[i], label: display(i), real: i })),
    ...distractors.map(w => ({ w, label: w.toLowerCase(), real: -1 }))
  ]);
  tiles.forEach((t, ti) => {
    const tile = el(`<button class="word">${t.label}</button>`);
    tile.addEventListener("click", () => {
      if (run.answered || tile.classList.contains("used")) return;
      tile.classList.add("used"); chosen.push(ti);
      const slot = el(`<button class="word">${t.real >= 0 ? original[t.real] : t.label}</button>`);
      slot.addEventListener("click", () => {
        if (run.answered) return;
        tile.classList.remove("used"); slot.remove();
        chosen.splice(chosen.indexOf(ti), 1); refresh();
      });
      ans.appendChild(slot); refresh();
    });
    bank.appendChild(tile);
  });
  const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
  function refresh() { $("#check").disabled = !chosen.length; }
  f.querySelector("#check").addEventListener("click", () => {
    if (run.answered) return;
    const built = chosen.map(ti => tiles[ti].w).join(" ").toLowerCase();
    grade(built === bankWords.join(" ").toLowerCase(), item);
  });
}

/* ----- the reply (§7.1): a cast voice speaks a local's line (standard audio control, 44px);
   the learner picks their RESPONSE from English meaning options — never es phrases (§7.0).
   The chosen reply's es arrives at resolution; its en stays on screen in the settled option.
   DORMANT until replyTo is authored (Phase-3); K3 "What locals say" is the seed corpus. ----- */
function renderReplyChat(q) {
  const item = q.item;
  const local = (ALL_ITEMS || []).find(x => x.id === item.replyTo || x.es === item.replyTo);
  if (!local) { q.type = "mc_es2en"; return renderMC(q); }           // safety: dangling replyTo
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">${q.scene || "They ask you"}</div>`));
  // the gloss is the answer to the comprehension work — hidden until the learner has
  // answered, then it materializes with the sweep drawing under the understood es line
  const bub = el(`<div class="bubble">
    <div class="who">${(local.cast || "A local").toUpperCase()}</div>
    <div class="line"><span class="ac-mount"></span><span class="es-txt">${local.es}<span class="sweep4"></span></span></div>
    <div class="en-gloss">${local.en}</div>
  </div>`);
  const play = audioControl(() => speak(local.es));
  bub.querySelector(".ac-mount").replaceWith(play);
  body.appendChild(bub);
  setTimeout(() => play._fire(), 400);
  q.onResolve = () => bub.classList.add("resolved");
  const { options } = mcOptions(item, true, q.pool && q.pool.length ? q.pool : run.lesson.items);
  const opts = el(`<div class="choices"></div>`);
  options.forEach(opt => {
    const c = el(`<button class="choice">${choiceLabel(opt)}</button>`);
    c.addEventListener("click", () => {
      if (run.answered) return;
      const ok = choiceLabel(opt) === choiceLabel(item.en);
      if (ok) { c.classList.add("got"); [...opts.children].forEach(o => { if (o !== c) o.classList.add("fade"); }); }
      grade(ok, item);
    });
    opts.appendChild(c);
  });
  body.appendChild(opts);
  q.esFootnote = true;   // the settled English option IS the meaning; es arrives as the 13px footnote line (no-repeat + footnote zone, §3.7)
}

/* ----- grading + feedback ----- */
function grade(ok, item) { finishGrade(ok, item, null); }
// typed answers get typo/accent tolerance (edit distance ≤ 1, accent slips accepted)
function gradeTyped(raw, item) {
  // §4b.3: accept the canonical form OR any authored variant (same typo tolerance)
  let j = { ok: false };
  for (const t of [item.es].concat(item.variants || [])) { const r = judgeTyped(raw, t); if (r.ok) { j = r; break; } }
  const extra = j.accent ? "Almost: watch the accent." : (j.typo ? "Close: mind the spelling." : null);
  finishGrade(j.ok, item, extra, raw);                 // pass the raw attempt for the struck-through line
}
function finishGrade(ok, item, extra, wrong) {
  run.answered = true;
  const q = run.qs[run.idx];
  const id = itemId(item);
  // §8.4: was this phrase fading BEFORE we graded it? (seen ≥once + strength under the notify threshold)
  const pre = id && state.learn && state.learn[id];
  const wasFading = !!(pre && pre.exposures >= 1 && itemStrength(pre) < RETENTION_FADE);
  const coldBefore = !!(pre && pre.axes && pre.axes.cold);           // for the Yours-now milestone (§3.5)
  if (!ok) { run.wrong++; if (run.missed) run.missed.set(id, item); }
  recordAnswer(id, ok, { mode: q && q.type, scaffolded: q && q.slow });   // q.slow = used the 0.75× replay
  const restored = ok && wasFading;                    // correctly recalled a fading phrase → the sawtooth jump (§8.4)
  // Yours-now (§3.5): first cold production ever — typed/spoken only (tiles are scaffolding), once per item
  const post = id && state.learn && state.learn[id];
  const yoursNow = ok && !coldBefore && !!(post && post.axes && post.axes.cold)
    && (q && ["type_translation", "speak_it", "close", "close_swap"].includes(q.type)) && !(post && post.yoursShown);
  if (yoursNow) post.yoursShown = true;
  if (restored) run.restored = (run.restored || 0) + 1;
  // §4b.2: count correct one-blank fills so the item graduates to two-blank fills
  if (ok && q && q.type === "fill_blank" && (q.blanks || 1) === 1) { const st = state.learn && state.learn[id]; if (st) st.fill1 = (st.fill1 || 0) + 1; }
  playSound(ok ? "correct" : "wrong");
  haptic(restored ? "restored" : ok ? "correct" : "wrong");
  if (!ok && q && q.item) requeueMiss(item, q.type);

  // §3.3/§4c.2: a wrong answer opens the correction sheet (no footer, no shake — the sheet is the feedback)
  if (!ok) { clearFooter(); showCorrection(item, extra, wrong); return; }   // drop the exercise's Check footer so its shadow doesn't sit behind Continue

  // ---- correct: §3.5 resolution frame (built to design/resolution-frame.html r7) ----
  // Both mid-exercise toasts retired (decisions 2026-07-19): Restored folds into the frame's kicker;
  // accent/typo slips are forgiven SILENTLY (we grade for the trip, not the classroom; the es-reveal
  // teaches passively). Slip telemetry logs quietly; it never surfaces.
  if (extra && post) post.slips = (post.slips || 0) + 1;
  resolveCorrect(item, q, { yoursNow, restored, strengthAfter: post ? Math.round(itemStrength(post)) : 0 });
}

/* ---- §3.5 resolution frame: every correct answer matures the page IN PLACE. The learner's own
   assembly is the achievement object and never disappears: build tiles FUSE where they stand (chrome
   dissolves, gaps close), the green sweep draws under their sentence, es ALWAYS reveals (sound meets
   spelling, listening included), en + full-phrase native audio materialize, the item's strength ring
   ticks with a "Stronger" whisper, the unused tray recedes to 28%. Sheets stay reserved for the miss.
   Exit (§8.5, Pacing Rule): self-paced, always: Continue materializes with the frame. ---- */
function resolveCorrect(item, q, info) {
  const qb = $("#qbody"); if (!qb) return next();
  qb.classList.add("qcorrect");                                      // base layer: wash on input-style exercises
  clearFooter();                                                     // the resolution owns the exit
  if (q && q.onResolve) try { q.onResolve(); } catch (_) {}          // §7.1 exercise-specific settle (fill the blank, settle the card)
  const barEl = document.querySelector(".pbar > i");                 // progress advances
  if (barEl) { run.pct = Math.max(run.pct || 0, Math.round((run.idx + 1) / run.qs.length * 100)); barEl.style.width = run.pct + "%"; }

  // fusion: placed tiles dissolve their tile-ness in place; the unused bank recedes, nothing vanishes
  const ans = qb.querySelector(".build-answer");
  if (ans) {
    ans.appendChild(el(`<span class="sweep"></span>`));
    requestAnimationFrame(() => ans.classList.add("fused"));
    const bank = qb.querySelector(".bank"); if (bank) bank.classList.add("recede");
  }

  // materialization: es always reveals (the fused build row IS the es), then en + audio grow in
  // one kicker per resolution; milestone beats event (YOURS NOW > RESTORED)
  const kick = info.yoursNow ? "yours" : (info.restored ? "restored" : null);
  const kicker = kick === "yours" ? `<div class="res-yours">YOURS NOW</div>`
    : kick === "restored" ? `<div class="res-kick"><svg class="kring" width="17" height="17" viewBox="0 0 17 17" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6.5" fill="none" stroke="var(--ring-track, var(--bg-elevated))" stroke-width="2.5"/><circle class="kfg" cx="8.5" cy="8.5" r="6.5" fill="none" stroke-width="2.5" stroke-linecap="round" transform="rotate(-90 8.5 8.5)"/></svg><span class="res-yours res-restored">RESTORED</span></div>`
    : "";
  const note = (q && q.resNote) ? `<div class="res-note">${q.resNote}</div>`
    : kick === "yours" ? `<div class="res-note">Produced cold, no help. This one travels with you.</div>`
    : kick === "restored" ? `<div class="res-note">This one was fading. You brought it back.</div>` : "";
  // no-repeat (§3.7): the grown carries only what's MISSING from the screen. When the
  // exercise's own sentence completed in place (fused row, filled blank, typed close),
  // it IS the es reveal; the reply keeps es (appears nowhere else) but carries it as
  // the standard 13px footnote line — no language-based styling in the footnote zone.
  const esHeld = ans || (q && q.esOnStage);
  const grown = el(`<div class="res-grown">
    ${kicker}
    ${!esHeld ? (q && q.esFootnote
      ? `<div class="res-en">${item.es}</div>`
      : `<div class="es-reveal">${item.es}<span class="sweep2"></span></div>`) : ""}
    ${(q && (q.noEn || q.esFootnote)) ? "" : `<div class="res-en">${item.en}</div>`}
    <div class="res-audio"></div>
    ${note}
    <button class="btn res-cont">Continue</button>
  </div>`);
  let advanced = false;
  const goNext = () => { if (advanced) return; advanced = true; qb.classList.add("leaving"); setTimeout(next, 200); };
  const playWhole = () => speak(item.es);
  const arow = el(`<div class="res-audio-row"></div>`);
  arow.appendChild(audioControl(playWhole));
  arow.appendChild(el(`<span class="audio-hint">Hear it whole</span>`));
  grown.querySelector(".res-audio").appendChild(arow);
  grown.querySelector(".res-cont").addEventListener("click", goNext);
  qb.appendChild(grown);
  requestAnimationFrame(() => requestAnimationFrame(() => grown.classList.add("show")));

  // the item's strength ring ticks up, "Stronger" whispers
  _setQStrength(info.strengthAfter, true);

  // Pacing Rule (design system §1.2): the exit is the learner's tap, always. Audio autoplays;
  // no auto-advance, no timers, no dwell math. The resolution delivers NEW information (the es
  // reveal), and new information is never swept away.
  playWhole();
}

// per-item strength ring in the runner's top row (scale ladder: the rep shows ITEM strength, §3.5)
const _SRING_C = 2 * Math.PI * 10;
function _setQStrength(val, tick) {
  const host = document.getElementById("q-sring"); if (!host) return;
  const off = (_SRING_C * (1 - Math.max(0, Math.min(100, val || 0)) / 100)).toFixed(1);
  const fg = host.querySelector(".sr-fg");
  if (fg) fg.style.strokeDashoffset = off;
  else host.innerHTML = `<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">
    <circle class="sr-bg" cx="13" cy="13" r="10"/>
    <circle class="sr-fg" cx="13" cy="13" r="10" stroke-dasharray="${_SRING_C.toFixed(1)}" stroke-dashoffset="${off}" transform="rotate(-90 13 13)"/></svg>`;
  if (tick) { const st = document.getElementById("q-stick"); if (st) { st.classList.add("show"); setTimeout(() => st.classList.remove("show"), 1600); } }
}
// §3.3 correction sheet (built to design/correction-sheet.html): scrim over the dimmed exercise,
// the phrase as chunk pills (known ones outlined green, tappable for meaning), gold replay audio,
// the anchor line, one Continue exit. Not dismissible by scrim-tap — the tap-through is the pedagogy.
function showCorrection(item, extra, wrong) {
  document.querySelectorAll(".corr-wrap").forEach(n => n.remove());
  const chunked = Array.isArray(item.chunks) && item.chunks.length;
  // Attention semantics (decisions 2026-07-16): gold marks a POINT, never a region. Box the error chunk
  // ONLY when the error is localized to exactly one chunk (you know the phrase except this spot). A diffuse
  // miss (2+ chunks) has no single locus — the whole phrase is the correction, so no boxes: it renders as
  // the clean dotted-underline sentence. Green retired from chunk marking; "known" is the unmarked default.
  const errSet = new Set();
  if (chunked && wrong) {
    const w = norm(wrong);
    item.chunks.forEach((c, i) => { if (!w.includes(norm(c[0]))) errSet.add(i); });
    if (errSet.size !== 1) errSet.clear();   // singular error locus only; diffuse miss → plain phrase
  }
  const pills = chunked
    ? item.chunks.map((c, i) => `<span class="corr-chunk ${errSet.has(i) ? "error" : ""}" data-i="${i}">${c[0]}</span>`).join("")
    : `<span class="corr-chunk plain">${item.es}</span>`;
  const anchor = item.anchor ? `<div class="corr-anchor"><span class="lead">Think:</span> ${item.anchor}</div>`
    : (extra ? `<div class="corr-anchor">${extra}</div>` : "");
  const wrap = el(`<div class="corr-wrap">
    <div class="corr-scrim"></div>
    <div class="corr-sheet" role="dialog" aria-label="Correction">
      <div class="corr-grab"></div>
      ${wrong ? `<div class="corr-wrong">${wrong}</div>` : ""}
      <div class="corr-label">The phrase</div>
      <div class="corr-chunks">${pills}<button class="corr-audio" aria-label="Replay audio">${icon('speaker', 18)}</button></div>
      <div class="corr-trans">${item.en}</div>
      ${anchor}
      <button class="btn corr-continue" id="corr-cont">Continue</button>
      <div class="corr-pop" id="corr-pop"></div>
    </div>
  </div>`);
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("show"));
  wrap.querySelector(".corr-audio").addEventListener("click", () => speak(item.es));
  speak(item.es);                                      // §3.3 auto-play with a replay control
  // chunk meaning popover (§3.4 — a popover, not a sheet); tapping a pill also speaks that chunk
  const pop = wrap.querySelector("#corr-pop"); let hideT;
  wrap.querySelectorAll(".corr-chunk[data-i]").forEach(ch => ch.addEventListener("click", e => {
    e.stopPropagation(); clearTimeout(hideT);
    pop.textContent = item.chunks[+ch.dataset.i][1]; pop.classList.add("show");
    const s = ch.closest(".corr-sheet").getBoundingClientRect(), r = ch.getBoundingClientRect();
    pop.style.left = Math.max(8, r.left - s.left) + "px"; pop.style.top = (r.top - s.top - 38) + "px";
    speak(item.chunks[+ch.dataset.i][0]);
    ch.classList.add("playing"); clearTimeout(ch._t); ch._t = setTimeout(() => ch.classList.remove("playing"), 1200);
    hideT = setTimeout(() => pop.classList.remove("show"), 1800);
  }));
  wrap.addEventListener("click", () => pop.classList.remove("show"));
  // Continue is the only exit; a forced beat first so the correction can't be blown past (§4c.2)
  const cont = wrap.querySelector("#corr-cont"); cont.disabled = true;
  setTimeout(() => { cont.disabled = false; }, 1200);
  cont.addEventListener("click", () => {
    if (cont.disabled) return;
    wrap.classList.remove("show"); setTimeout(() => wrap.remove(), 300); next();
  });
}
// missed item → re-serve later in the session, one ladder rung easier (capped to avoid spirals)
function requeueMiss(item, failedType) {
  const id = itemId(item); if (!id) return;
  run.reasks[id] = run.reasks[id] || 0;
  if (run.reasks[id] >= 2) return;                       // cap at 2 re-asks/item; M2 warm-up catches the rest
  run.reasks[id]++;
  const type = rungDownType(failedType, item);
  const pos = Math.min(run.qs.length, run.idx + 3 + Math.floor(Math.random() * 3));   // 3-5 slots later
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
  const prev = state.lessons[lesson.id];
  const now = new Date().toISOString();
  state.lessons[lesson.id] = { stars: Math.max(stars, prev ? prev.stars : 0), at: now };
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
  applyTierUpdate();                                   // §2.2: session completion is a tier trigger
  save(); renderTopbar();
  cloudSync().catch(() => {});
  playSound("win"); haptic("complete");

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
      ${(delta > 0 || run.restored) ? `<div class="session-delta">${delta > 0 ? `+${delta} Readiness` : ""}${delta > 0 && run.restored ? " · " : ""}${run.restored ? `${run.restored} phrase${run.restored === 1 ? "" : "s"} restored` : ""}</div>` : ""}
      <div class="reward">${lesson.reward || "Locked in. That whole set travels with you."}</div>
      ${lesson.cultureNote ? `<div class="culture-note"><span class="cn-label">Local tip</span> ${lesson.cultureNote}</div>` : ""}
      ${missed.length ? `<button class="btn accent" id="reviewmiss">Review your ${missed.length} mistake${missed.length === 1 ? "" : "s"}</button><div style="height:10px"></div>` : ""}
      <button class="btn${missed.length ? " grey" : ""}" id="home">Continue</button>
    </div>`));
  if (missed.length) $("#reviewmiss").addEventListener("click", () => startReview(missed));
  $("#home").addEventListener("click", goHomeAfterSession);
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
  applyTierUpdate();                                   // §2.2: session completion is a tier trigger
  save(); renderTopbar();
  cloudSync().catch(() => {});
  playSound("win"); haptic("complete");
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
      ${(delta > 0 || run.restored) ? `<div class="session-delta">${delta > 0 ? `+${delta} Readiness` : ""}${delta > 0 && run.restored ? " · " : ""}${run.restored ? `${run.restored} phrase${run.restored === 1 ? "" : "s"} restored` : ""}</div>` : ""}
      <div class="reward">Nice, keeping older phrases warm is how they stick for the trip.</div>
      <button class="btn" id="home">Continue</button>
    </div>`));
  $("#home").addEventListener("click", goHomeAfterSession);
}
