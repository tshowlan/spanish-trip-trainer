/* ============================== LESSON RUNNER ============================== */
// chooseType() + the exposure ladder live in srs.js; review pools (dueForReview,
// recentMisses, cramActive) too. composeSession() weaves them into one queue.

// a graded review rep for a seen item — mostly its ladder rung, sometimes a
// situational "which do you say?" for texture. cram pushes production.
function reviewQuestion(item, pool) {
  if (cramActive() && item.es.trim().split(/\s+/).length >= 2) return { type: "build", item, pool };
  if (Math.random() < 0.25) return { type: "respond", item, pool };
  return { type: chooseType(item), item, pool };
}
// first practice after teaching: order the sentence if we can (production), else recognise it
// among its just-taught siblings. Never a bare "match the word you just saw".
function introRep(item) {
  const n = item.es.trim().split(/\s+/).length;
  return (n >= 2 && n <= 8) ? "build" : "mc_es2en";
}

/* ---- session composer (M2): warm-up misses + new items + trip-wide review ---- */
function composeSession(lesson) {
  const lessonItems = lesson.items || [];
  const newItems = lessonItems.filter(it => exposuresOf(it) === 0);   // teach ALL new (coverage before unlock)
  const newIds = new Set(newItems.map(itemId));
  const warm = recentMisses().filter(it => !newIds.has(itemId(it))).slice(0, 3);
  const warmIds = new Set(warm.map(itemId));

  const qs = [];
  // 1) warm-up: recent misses reopen the next session
  warm.forEach(it => qs.push(reviewQuestion(it)));
  // 2) teach new items in bulk chunks (cards precede any test of them)
  const CHUNK = 4;
  for (let i = 0; i < newItems.length; i += CHUNK) newItems.slice(i, i + CHUNK).forEach(it => qs.push({ type: "present", item: it }));
  // 3) practice pool: new-item reps + trip-wide review, shuffled together (cards already placed)
  const practice = [];
  newItems.forEach(it => practice.push({ type: introRep(it), item: it, pool: newItems }));
  let reviewPool;
  if (newItems.length) {
    // review share ~⅓ (up to ½ in cram) of the whole trip, so a new lesson revisits older ones
    const cap = cramActive() ? Math.min(8, Math.max(3, newItems.length)) : Math.min(6, Math.max(3, Math.round(newItems.length * 0.6)));
    reviewPool = dueForReview().filter(it => !newIds.has(itemId(it)) && !warmIds.has(itemId(it))).slice(0, cap);
  } else {
    // redo of a completed lesson: drill its own items, plus a few trip-wide due
    const own = lessonItems.filter(it => !warmIds.has(itemId(it)));
    const extra = dueForReview().filter(it => !lessonItems.includes(it) && !warmIds.has(itemId(it))).slice(0, 4);
    reviewPool = [...own, ...extra];
  }
  reviewPool.forEach(it => practice.push(reviewQuestion(it, reviewPool)));
  shuffle(practice).forEach(q => qs.push(q));
  return qs.length ? qs : lessonItems.map(it => ({ type: chooseType(it), item: it }));  // safety net
}
// pure-review session (Home "Review" entry / all lessons complete)
function composeReview() {
  const due = dueForReview(0).slice(0, 14);                 // everything seen, oldest first
  const pool = due.slice();
  return due.map(it => reviewQuestion(it, pool));
}

let run = null;
function startLesson(lesson) {
  run = { lesson, qs: composeSession(lesson), idx: 0, hearts: 5, wrong: 0, answered: false, reasks: {}, pct: 0, review: false };
  renderQuestion();
}
function startReview() {
  const qs = composeReview();
  if (!qs.length) { toast("Nothing to review yet — finish a lesson first 📚"); return; }
  run = { lesson: { id: "__review__", topic: "Review", items: [] }, qs, idx: 0, hearts: 5, wrong: 0, answered: false, reasks: {}, pct: 0, review: true };
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
  ({ present: renderPresent, match: renderMatch, build: renderBuild, mc_es2en: renderMC, mc_en2es: renderMC,
     type_translation: renderType, listen_type: renderListen, fill_blank: renderFill,
     respond: renderRespond, listen_choice: renderListenChoice }[q.type])(q);
}

/* ----- presentation card (first sight of an item — teach, never grade) ----- */
function renderPresent(q) {
  const item = q.item;
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">New phrase</div>`));
  const card = el(`<div class="present-card">
      <div class="present-es">${item.es}</div>
      <div class="present-en">${item.en}</div>
      ${item.note ? `<div class="present-note">${item.note}</div>` : ""}
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

/* distractors must be the same KIND as the answer: siblings you were just taught, matched on
   length "shape", so a one-word answer never sits beside full sentences. */
function mcOptions(item, es2en, siblings) {
  const answer = es2en ? item.en : item.es;
  const val = x => es2en ? x.en : x.es;
  const wc = s => s.trim().split(/\s+/).length;
  const shape = n => n <= 1 ? 0 : n <= 3 ? 1 : 2;      // word / short phrase / sentence
  const tb = shape(wc(answer));
  const cand = [];
  const add = arr => { for (const x of arr) if (val(x) !== answer && !cand.includes(x)) cand.push(x); };
  const sibs = (siblings && siblings.length ? siblings : []);
  add(sibs.filter(x => shape(wc(val(x))) === tb));                   // same lesson, same shape
  if (cand.length < 3) add(ALL_ITEMS.filter(x => shape(wc(val(x))) === tb)); // any lesson, same shape
  if (cand.length < 3) add(sibs);                                    // same lesson, any shape
  if (cand.length < 3) add(ALL_ITEMS);                               // last resort
  const distract = [...new Set(sample(cand, 8).map(val))].filter(v => v !== answer).slice(0, 3);
  return { answer, options: shuffle([answer, ...distract]) };
}

/* ----- multiple choice ----- */
function renderMC(q) {
  const es2en = q.type === "mc_es2en";
  const item = q.item;
  const { answer, options } = mcOptions(item, es2en, q.pool && q.pool.length ? q.pool : run.lesson.items);
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">${es2en ? "What does this mean?" : "Say it in Spanish"}</div>`));
  body.appendChild(el(`<div class="prompt">${es2en ? item.es : item.en}</div>`));
  if (es2en) { const sb = el(`<button class="speak-btn">🔊 Hear it</button>`); sb.addEventListener("click", () => speak(item.es)); body.appendChild(sb); }
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

/* ----- listen & choose (M2): hear it → pick the meaning (great for numbers) ----- */
function renderListenChoice(q) {
  const item = q.item;
  const { answer, options } = mcOptions(item, true, q.pool && q.pool.length ? q.pool : run.lesson.items);   // English options
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">What did you hear?</div>`));
  const play = el(`<button class="big-speak">🔊</button>`);
  play.addEventListener("click", () => speak(item.es));
  body.appendChild(play);
  setTimeout(() => speak(item.es), 300);
  body.appendChild(mcChoices(options, answer, item));
}

/* ----- type the translation (English → Spanish) ----- */
function renderType(q) {
  const item = q.item;
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Type it in Spanish</div>`));
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
  const play = el(`<button class="big-speak">🔊</button>`);
  play.addEventListener("click", () => speak(item.es));
  body.appendChild(play);
  setTimeout(() => speak(item.es), 350);
  const input = el(`<input class="text-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribe en español…">`);
  body.appendChild(input);
  setTimeout(() => input.focus(), 50);
  const f = footer(`<button class="btn grey" id="skip">Can't tell — skip</button><div style="height:10px"></div><button class="btn" id="check" disabled>Check</button>`);
  input.addEventListener("input", () => { $("#check").disabled = !input.value.trim(); });
  input.addEventListener("keydown", e => { if (e.key === "Enter" && input.value.trim() && !run.answered) gradeTyped(input.value, item); });
  f.querySelector("#check").addEventListener("click", () => { if (!run.answered && input.value.trim()) gradeTyped(input.value, item); });
  f.querySelector("#skip").addEventListener("click", () => { if (!run.answered) grade(false, item); });
}

/* ----- fill in the blank ----- */
function renderFill(q) {
  const item = q.item;
  const clean = w => w.replace(/^[¿¡("«]+|[?!).,;:"»]+$/g, "");
  const words = item.es.split(" ");
  // pick a meaningful word to blank (prefer cleaned length >= 4)
  let idxs = words.map((w, i) => i).filter(i => clean(words[i]).length >= 4);
  const idx = idxs.length ? idxs[Math.floor(Math.random() * idxs.length)] : Math.floor(Math.random() * words.length);
  const raw = words[idx];
  const lead = (raw.match(/^[¿¡("«]+/) || [""])[0];
  const trail = (raw.match(/[?!).,;:"»]+$/) || [""])[0];
  const answer = raw.slice(lead.length, raw.length - trail.length);
  const shown = words.map((w, i) => i === idx ? `${lead}<span class="blank">_____</span>${trail}` : w).join(" ");
  const wordsFrom = arr => [...new Set(arr.flatMap(x => x.es.split(" ").map(clean)))]
    .filter(w => norm(w) !== norm(answer) && w.length >= 3);
  // prefer distractor words from this lesson, close in length to the answer
  const lessonWords = wordsFrom(run.lesson.items);
  let otherWords = lessonWords.filter(w => Math.abs(w.length - answer.length) <= 3);
  if (otherWords.length < 3) otherWords = lessonWords;
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

/* ----- tap to build ----- */
function renderBuild(q) {
  const item = q.item;
  const correctWords = item.es.split(" ");
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Build the sentence</div>`));
  body.appendChild(el(`<div class="prompt">${item.en}</div>`));
  body.appendChild(el(`<div class="prompt-sub">Tap the words in order.</div>`));
  const ans = el(`<div class="build-answer"></div>`);
  const bank = el(`<div class="bank"></div>`);
  body.appendChild(ans); body.appendChild(bank);
  const chosen = [];
  shuffle(correctWords.map((w, i) => ({ w, i }))).forEach(({ w, i }) => {
    const tile = el(`<button class="word" data-i="${i}">${w}</button>`);
    tile.addEventListener("click", () => {
      if (run.answered || tile.classList.contains("used")) return;
      tile.classList.add("used"); chosen.push(w);
      const slot = el(`<button class="word">${w}</button>`);
      slot.addEventListener("click", () => {
        if (run.answered) return;
        tile.classList.remove("used"); slot.remove();
        chosen.splice(chosen.indexOf(w), 1); refreshCheck();
      });
      ans.appendChild(slot); refreshCheck();
    });
    bank.appendChild(tile);
  });
  const f = footer(`<button class="btn" id="check" disabled>Check</button>`);
  function refreshCheck() { $("#check").disabled = chosen.length !== correctWords.length; }
  f.querySelector("#check").addEventListener("click", () => {
    if (run.answered) return;
    grade(chosen.join(" ") === item.es, item);
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
  const j = judgeTyped(raw, item.es);
  const extra = j.accent ? "Almost — watch the accent." : (j.typo ? "Close — mind the spelling." : null);
  finishGrade(j.ok, item, extra);
}
function finishGrade(ok, item, extra) {
  run.answered = true;
  const q = run.qs[run.idx];
  if (!ok) { run.wrong++; if (run.hearts > 0) run.hearts--; }
  recordAnswer(itemId(item), ok);
  playSound(ok ? "correct" : "wrong");
  const notes = [];
  if (extra) notes.push(`<span class="note-chip"><b>note</b> ${extra}</span>`);
  if (item.note) notes.push(`<span class="note-chip"><b>tip</b> ${item.note}</span>`);
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
  if (ok) speak(item.es);
  if (!ok && q && q.item) requeueMiss(item, q.type);
  $("#cont").addEventListener("click", () => next());
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
      <button class="btn" id="home">Continue</button>
    </div>`));
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
