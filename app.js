/* ====================== Spanish Trip Trainer — engine ====================== */

const STORE_KEY = "sts_state_v1";
const todayStr = () => new Date().toISOString().slice(0, 10);

const DEFAULT_STATE = { xp: 0, gems: 0, streak: 0, lastActive: null, lessons: {} };
let state = load();

function load() {
  try { return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(STORE_KEY))); }
  catch { return Object.assign({}, DEFAULT_STATE); }
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

/* flat list of every phrase, for distractors + audio */
const ALL_ITEMS = [];
const LESSON_ORDER = [];
CURRICULUM.stages.forEach(st => st.lessons.forEach(l => {
  LESSON_ORDER.push(l.id);
  l.items.forEach(it => ALL_ITEMS.push(it));
}));

function lessonDone(id) { return !!state.lessons[id]; }
function lessonUnlocked(id) {
  const i = LESSON_ORDER.indexOf(id);
  return i === 0 || lessonDone(LESSON_ORDER[i - 1]);
}

/* ---------- streak ---------- */
function registerActivity() {
  const t = todayStr();
  if (state.lastActive === t) return;
  const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  state.streak = state.lastActive === yest ? state.streak + 1 : 1;
  state.lastActive = t;
}

/* ---------- audio ---------- */
let esVoice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  esVoice = vs.find(v => /es-ES/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null;
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES"; if (esVoice) u.voice = esVoice; u.rate = 0.9;
  speechSynthesis.speak(u);
}

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const sample = (arr, n) => shuffle(arr).slice(0, n);

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._tmo); t._tmo = setTimeout(() => t.classList.remove("show"), 2600);
}
function renderTopbar() {
  $("#stat-streak").textContent = state.streak;
  $("#stat-xp").textContent = state.xp;
  $("#stat-gems").textContent = state.gems;
}

/* ============================== HOME / MAP ============================== */
function renderHome() {
  renderTopbar();
  const app = $("#app");
  app.innerHTML = "";
  const home = el(`<div class="home"></div>`);
  home.appendChild(el(`
    <div class="hero">
      <h1>¡Hola! 🇪🇸</h1>
      <p>Barcelona-ready Spanish, one tapa at a time. Finish a lesson to unlock the next.</p>
    </div>`));

  CURRICULUM.stages.forEach(st => {
    const total = st.lessons.length;
    const done = st.lessons.filter(l => lessonDone(l.id)).length;
    const stage = el(`<div class="stage"></div>`);
    stage.appendChild(el(`
      <div class="stage-head"><h2>${st.title}</h2><span class="blurb">${st.blurb}</span></div>
      <div class="stage-bar"><i style="width:${Math.round(done/total*100)}%"></i></div>`));
    const list = el(`<div class="lessons"></div>`);
    st.lessons.forEach(l => {
      const done = lessonDone(l.id), unlocked = lessonUnlocked(l.id);
      const stars = done ? state.lessons[l.id].stars : 0;
      const card = el(`
        <div class="lesson ${done ? "done" : ""} ${unlocked ? "" : "locked"}">
          <div class="badge">${done ? "✓" : unlocked ? "▶" : "🔒"}</div>
          <div class="meta">
            <div class="t">${l.title}</div>
            <div class="s">${l.topic} · ${l.items.length} phrases</div>
            ${done ? `<div class="stars">${"★".repeat(stars)}${"☆".repeat(3-stars)}</div>` : ""}
          </div>
          <div class="chev">${unlocked ? "›" : ""}</div>
        </div>`);
      if (unlocked) card.addEventListener("click", () => startLesson(l));
      else card.addEventListener("click", () => toast("Finish the lesson before it to unlock 🔒"));
      list.appendChild(card);
    });
    stage.appendChild(list);
    home.appendChild(stage);
  });
  app.appendChild(home);
}

/* ============================== LESSON RUNNER ============================== */
function buildQuestions(lesson) {
  const items = shuffle(lesson.items.slice());
  const qs = [];
  // warm-up match round (5 pairs) when there's enough material
  if (items.length >= 4) qs.push({ type: "match", items: sample(items, Math.min(5, items.length)) });
  // one question per item, alternating styles
  items.forEach((it, i) => {
    const words = it.es.split(" ");
    const canBuild = words.length >= 2 && words.length <= 8;
    let type;
    if (canBuild && i % 3 === 2) type = "build";
    else type = i % 2 === 0 ? "mc_es2en" : "mc_en2es";
    qs.push({ type, item: it });
  });
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
  app.innerHTML = "";
  const wrap = el(`<div class="runner"></div>`);
  wrap.appendChild(el(`
    <div class="progress-row">
      <button class="close-btn" id="quit">✕</button>
      <div class="pbar"><i style="width:${pct}%"></i></div>
      <div class="hearts">♥ ${run.hearts}</div>
    </div>`));
  wrap.appendChild(el(`<div id="qbody"></div>`));
  app.appendChild(wrap);
  $("#quit").addEventListener("click", () => { if (confirm("Quit this lesson? Progress in it is lost.")) renderHome(); });

  run.answered = false;
  ({ match: renderMatch, build: renderBuild, mc_es2en: renderMC, mc_en2es: renderMC }[q.type])(q);
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
  const prompt = es2en ? item.es : item.en;
  const answer = es2en ? item.en : item.es;
  const pool = ALL_ITEMS.filter(x => (es2en ? x.en : x.es) !== answer);
  const distractors = sample(pool, 3).map(x => es2en ? x.en : x.es);
  const options = shuffle([answer, ...distractors]);

  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">${es2en ? "What does this mean?" : "Say it in Spanish"}</div>`));
  body.appendChild(el(`<div class="prompt">${prompt}</div>`));
  if (es2en) {
    const sb = el(`<button class="speak-btn">🔊 Hear it</button>`);
    sb.addEventListener("click", () => speak(item.es)); body.appendChild(sb);
  }
  const choices = el(`<div class="choices"></div>`);
  options.forEach(opt => {
    const c = el(`<button class="choice">${opt}</button>`);
    c.addEventListener("click", () => {
      if (run.answered) return;
      const ok = opt === answer;
      [...choices.children].forEach(ch => {
        ch.classList.add(ch.textContent === answer ? "correct" : (ch === c ? "wrong" : "dim"));
      });
      grade(ok, item);
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
    grade(chosen.join(" ") === item.es, item, /*keepFooter*/ true);
  });
}

/* ----- match pairs ----- */
function renderMatch(q) {
  const body = $("#qbody");
  body.appendChild(el(`<div class="qtype">Tap the matching pairs</div>`));
  const grid = el(`<div class="match"></div>`);
  const left = shuffle(q.items.map(it => ({ key: it.es, label: it.es, side: "L" })));
  const right = shuffle(q.items.map(it => ({ key: it.es, label: it.en, side: "R" })));
  // interleave columns row by row
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
  if (!sel) {
    [...grid.children].forEach(c => c.classList.remove("sel"));
    tile.classList.add("sel"); grid._sel = tile; return;
  }
  if (sel === tile) { tile.classList.remove("sel"); grid._sel = null; return; }
  const same = sel.dataset.key === tile.dataset.key;
  const diffSide = sel.dataset.side !== tile.dataset.side;
  if (same && diffSide) {
    [sel, tile].forEach(c => { c.classList.remove("sel"); c.classList.add("gone"); });
    grid._sel = null; grid._left--;
    const it = q.items.find(i => i.es === decodeURIComponent(tile.dataset.key));
    if (it) speak(it.es);
    if (grid._left === 0) { setTimeout(() => next(true), 350); }
  } else {
    tile.classList.add("bad"); sel.classList.add("bad");
    run.wrong++; if (run.hearts > 0) run.hearts--; $(".hearts") && ($(".hearts").textContent = "♥ " + run.hearts);
    setTimeout(() => { tile.classList.remove("bad", "sel"); sel.classList.remove("bad", "sel"); grid._sel = null; }, 350);
  }
}

/* ----- grading + feedback ----- */
function grade(ok, item, keepFooterCheck) {
  run.answered = true;
  if (!ok) { run.wrong++; if (run.hearts > 0) run.hearts--; }
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
  $("#cont").addEventListener("click", () => next(ok));
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
  const before = state.streak;
  registerActivity();
  save();
  renderTopbar();

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

/* ============================== boot ============================== */
renderHome();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
