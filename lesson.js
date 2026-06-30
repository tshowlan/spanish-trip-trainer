/* ============================== LESSON RUNNER ============================== */
function chooseType(item) {
  const w = item.es.split(" ").length;
  const level = (state.profile && state.profile.level) || "new";
  const pool = ["mc_es2en", "mc_en2es", "listen_type", "type_translation"];
  if (w >= 2 && w <= 8) pool.push("build");
  if (w >= 3) pool.push("fill_blank");
  const hard = ["type_translation", "listen_type"];
  const weighted = [];
  pool.forEach(t => {
    let n = 1;
    if (level === "confident") n = hard.includes(t) ? 3 : t === "build" ? 2 : t.startsWith("mc") ? 1 : 2;
    else if (level === "some") n = hard.includes(t) ? 2 : 2;
    else n = t.startsWith("mc") ? 3 : t === "fill_blank" ? 2 : t === "build" ? 2 : 1; // beginner: type/listen rare
    for (let k = 0; k < n; k++) weighted.push(t);
  });
  return weighted[Math.floor(Math.random() * weighted.length)];
}
function buildQuestions(lesson) {
  const items = shuffle(lesson.items.slice());
  const qs = [];
  if (items.length >= 4) qs.push({ type: "match", items: sample(items, Math.min(5, items.length)) });
  items.forEach(it => qs.push({ type: chooseType(it), item: it }));
  return qs;
}

let run = null;
function startLesson(lesson) {
  run = { lesson, qs: buildQuestions(lesson), idx: 0, hearts: 5, wrong: 0, answered: false };
  renderQuestion();
}
function renderQuestion() {
  const app = $("#app");
  const q = run.qs[run.idx];
  const pct = Math.round(run.idx / run.qs.length * 100);
  clearFooter();
  app.innerHTML = "";
  const wrap = el(`<div class="runner"></div>`);
  wrap.appendChild(el(`
    <div class="progress-row">
      <button class="close-btn" id="quit">${icon('x',24)}</button>
      <div class="pbar"><i style="width:${pct}%"></i></div>
      <div class="hearts">♥ ${run.hearts}</div>
    </div>`));
  wrap.appendChild(el(`<div id="qbody"></div>`));
  app.appendChild(wrap);
  $("#quit").addEventListener("click", () => { if (confirm("Quit this lesson? Progress in it is lost.")) renderHome(); });
  run.answered = false;
  ({ match: renderMatch, build: renderBuild, mc_es2en: renderMC, mc_en2es: renderMC,
     type_translation: renderType, listen_type: renderListen, fill_blank: renderFill }[q.type])(q);
}
function footer(html) {
  const old = $("#footer"); if (old) old.remove();
  const f = el(`<div class="footer" id="footer">${html}</div>`);
  document.body.appendChild(f);
  return f;
}
function clearFooter() { const f = $("#footer"); if (f) f.remove(); }

/* ----- multiple choice ----- */
function renderMC(q) {
  const es2en = q.type === "mc_es2en";
  const item = q.item;
  const answer = es2en ? item.en : item.es;
  const pool = ALL_ITEMS.filter(x => (es2en ? x.en : x.es) !== answer);
  const options = shuffle([answer, ...sample(pool, 3).map(x => es2en ? x.en : x.es)]);
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">${es2en ? "What does this mean?" : "Say it in Spanish"}</div>`));
  body.appendChild(el(`<div class="prompt">${es2en ? item.es : item.en}</div>`));
  if (es2en) { const sb = el(`<button class="speak-btn">🔊 Hear it</button>`); sb.addEventListener("click", () => speak(item.es)); body.appendChild(sb); }
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
  const submit = () => { if (!run.answered && input.value.trim()) grade(norm(input.value) === norm(item.es), item, true); };
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
  const submit = ok => grade(ok, item, true);
  input.addEventListener("keydown", e => { if (e.key === "Enter" && input.value.trim() && !run.answered) submit(norm(input.value) === norm(item.es)); });
  f.querySelector("#check").addEventListener("click", () => { if (!run.answered && input.value.trim()) submit(norm(input.value) === norm(item.es)); });
  f.querySelector("#skip").addEventListener("click", () => { if (!run.answered) submit(false); });
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
  const otherWords = [...new Set(ALL_ITEMS.flatMap(x => x.es.split(" ").map(clean)))]
    .filter(w => norm(w) !== norm(answer) && w.length >= 3);
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
    grade(chosen.join(" ") === item.es, item, true);
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
    if (it) speak(it.es);
    if (grid._left === 0) { playSound("correct"); setTimeout(() => next(), 350); }
  } else {
    tile.classList.add("bad"); sel.classList.add("bad");
    run.wrong++; if (run.hearts > 0) run.hearts--; if ($(".hearts")) $(".hearts").textContent = "♥ " + run.hearts;
    playSound("wrong");
    setTimeout(() => { tile.classList.remove("bad", "sel"); sel.classList.remove("bad", "sel"); grid._sel = null; }, 350);
  }
}

/* ----- grading + feedback ----- */
function grade(ok, item) {
  run.answered = true;
  if (!ok) { run.wrong++; if (run.hearts > 0) run.hearts--; }
  playSound(ok ? "correct" : "wrong");
  const notes = [];
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
  $("#cont").addEventListener("click", () => next());
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
  const stars = run.wrong === 0 ? 3 : run.wrong <= 2 ? 2 : 1;
  const firstTime = !lessonDone(lesson.id);
  const prev = state.lessons[lesson.id];
  state.lessons[lesson.id] = { stars: Math.max(stars, prev ? prev.stars : 0) };
  const gained = firstTime ? 20 : 8;
  state.xp += gained;
  if (firstTime) state.gems += 1;
  // per-category accuracy → powers the group "best/worst at" view
  const cat = categoryOf(lesson.topic);
  const total = run.qs.length, correct = Math.max(0, total - run.wrong);
  state.topicStats = state.topicStats || {};
  const cs = state.topicStats[cat] = state.topicStats[cat] || { correct: 0, total: 0 };
  cs.correct += correct; cs.total += total;
  const before = state.streak;
  registerActivity();
  save(); renderTopbar();
  cloudSync().catch(() => {});
  playSound("win");

  const app = $("#app");
  app.innerHTML = "";
  app.appendChild(el(`
    <div class="complete">
      <div class="big">${stars === 3 ? "🏆" : "🎉"}</div>
      <h2>¡Lección completa!</h2>
      <div class="scorebar">
        <div class="score"><div class="n">${"★".repeat(stars)}</div><div class="l">stars</div></div>
        <div class="score"><div class="n">+${gained}</div><div class="l">XP</div></div>
        <div class="score"><div class="n">🔥 ${state.streak}</div><div class="l">day streak</div></div>
      </div>
      <div class="reward">${lesson.reward}</div>
      <button class="btn" id="home">Back to map</button>
    </div>`));
  $("#home").addEventListener("click", renderHome);
  if (state.streak > before) toast(pick(STREAK_LINES)(state.streak));
}
