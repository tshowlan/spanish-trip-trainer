/* ====================== Spanish Trip Trainer — engine ====================== */

const STORE_KEY = "sts_state_v1";
const todayStr = () => new Date().toISOString().slice(0, 10);

const DEFAULT_STATE = { xp: 0, gems: 0, streak: 0, lastActive: null, lessons: {}, history: [], sound: true, profile: null };
let state = load();

function load() {
  try { return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(STORE_KEY))); }
  catch { return Object.assign({}, DEFAULT_STATE); }
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

/* ---------- deck (curriculum filtered/augmented by the user's profile) ---------- */
let DECK, LESSON_ORDER, ALL_ITEMS;

function meetsReq(lesson, p) {
  if (!lesson.requires) return true;
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
  CURRICULUM.stages.forEach(st => {
    DECK.stages.push(Object.assign({}, st, { lessons: st.lessons.filter(l => meetsReq(l, p)) }));
  });
  if (p && p.allergies && p.allergies.length) {
    const s1 = DECK.stages.find(s => s.id === "s1");
    if (s1) s1.lessons.splice(1, 0, buildAllergyLesson(p.allergies));
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

/* ---------- audio: TTS + synthesized success sounds ---------- */
let esVoice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  esVoice = vs.find(v => /es-ES/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null;
}
if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES"; if (esVoice) u.voice = esVoice; u.rate = 0.9;
  speechSynthesis.speak(u);
}

let actx = null;
function note(freq, start, dur, type = "sine", gain = 0.18) {
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(actx.destination); o.start(start); o.stop(start + dur + 0.03);
}
function playSound(kind) {
  if (!state.sound) return;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === "suspended") actx.resume(); }
  catch { return; }
  const n = actx.currentTime;
  if (kind === "correct") { note(659.25, n, 0.12); note(987.77, n + 0.09, 0.16); }           // E5 + B5
  else if (kind === "win") { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, n + i * 0.11, 0.22)); }
  else if (kind === "wrong") { note(196, n, 0.22, "triangle", 0.12); }
}

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const sample = (arr, n) => shuffle(arr).slice(0, n);
const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim();

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._tmo); t._tmo = setTimeout(() => t.classList.remove("show"), 2600);
}
function renderTopbar() {
  $("#stat-streak").textContent = state.streak;
  $("#stat-xp").textContent = state.xp;
  $("#stat-gems").textContent = state.gems;
}

/* ============================== ONBOARDING ============================== */
function renderOnboarding() {
  const app = $("#app");
  const draft = { level: null, lodging: [], transport: [], allergies: [] };
  let step = 0;

  const steps = [
    { kind: "intro" },
    { kind: "single", key: "level", q: "How's your Spanish right now?",
      opts: [["new", "Total beginner", "Start from hello."], ["some", "I know a little", "A few words & phrases."], ["confident", "Pretty comfortable", "Throw the hard stuff at me."]] },
    { kind: "multi", key: "lodging", q: "Where are you staying?", min: 0,
      opts: LODGING_OPTIONS.map(o => [o.key, o.label, ""]) },
    { kind: "multi", key: "transport", q: "Any special transport on the trip?", sub: "Taxis & walking are always included.",
      opts: TRANSPORT_OPTIONS.map(o => [o.key, o.label, ""]) },
    { kind: "multi", key: "allergies", q: "Any allergies in your group?", sub: "We'll add safety phrases for these.",
      opts: ALLERGENS.map(a => [a.key, a.en[0].toUpperCase() + a.en.slice(1), ""]) },
    { kind: "summary" }
  ];

  function render() {
    const s = steps[step];
    clearFooter();
    app.innerHTML = "";
    const wrap = el(`<div class="onb"></div>`);

    if (s.kind === "intro") {
      wrap.appendChild(el(`
        <div class="onb-card">
          <div class="onb-emoji">👋</div>
          <h2>¡Hola! Let's set up your trip.</h2>
          <p>Five quick taps and I'll tailor your lessons — your level, where you're staying, how you're getting around, and any allergies in the group.</p>
        </div>`));
      const btn = el(`<button class="btn">Let's go</button>`);
      btn.addEventListener("click", () => { step++; render(); });
      wrap.appendChild(btn);
    } else if (s.kind === "summary") {
      const t = draft.transport.length ? draft.transport.join(", ") : "taxi & walking";
      const lo = draft.lodging.length ? draft.lodging.join(", ") : "—";
      const al = draft.allergies.length ? draft.allergies.join(", ") : "none";
      wrap.appendChild(el(`
        <div class="onb-card">
          <div class="onb-emoji">🎒</div>
          <h2>You're all set!</h2>
          <p><b>Level:</b> ${draft.level || "beginner"}<br><b>Staying:</b> ${lo}<br><b>Transport:</b> ${t}<br><b>Allergies:</b> ${al}</p>
          <p class="onb-dim">I'll add the matching lessons to your map. You can change this anytime in ⚙️ Settings.</p>
        </div>`));
      const btn = el(`<button class="btn">Start learning</button>`);
      btn.addEventListener("click", finish);
      wrap.appendChild(btn);
    } else {
      wrap.appendChild(el(`<div class="onb-q">${s.q}</div>`));
      if (s.sub) wrap.appendChild(el(`<div class="onb-sub">${s.sub}</div>`));
      const chips = el(`<div class="chips"></div>`);
      s.opts.forEach(([key, label, desc]) => {
        const selected = s.kind === "single" ? draft[s.key] === key : draft[s.key].includes(key);
        const chip = el(`<button class="chip ${selected ? "on" : ""}">
          <span class="chip-l">${label}</span>${desc ? `<span class="chip-d">${desc}</span>` : ""}</button>`);
        chip.addEventListener("click", () => {
          if (s.kind === "single") { draft[s.key] = key; step++; render(); }
          else {
            const arr = draft[s.key], i = arr.indexOf(key);
            i >= 0 ? arr.splice(i, 1) : arr.push(key);
            render();
          }
        });
        chips.appendChild(chip);
      });
      wrap.appendChild(chips);
      if (s.kind === "multi") {
        const next = el(`<button class="btn" style="margin-top:18px">${draft[s.key].length ? "Continue" : "Skip"}</button>`);
        next.addEventListener("click", () => { step++; render(); });
        wrap.appendChild(next);
      }
    }
    app.appendChild(wrap);
  }

  function finish() {
    state.profile = { level: draft.level || "new", lodging: draft.lodging, transport: draft.transport, allergies: draft.allergies };
    save(); rebuildDeck(); renderHome();
    toast("¡Vamos! Your map is ready 🎒");
  }
  render();
}

/* ============================== HOME / MAP ============================== */
function streakStrip() {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    days.push(`<i class="${state.history.includes(d) ? "hit" : ""}" title="${d}"></i>`);
  }
  return `<div class="streak-strip"><span>Last 2 weeks</span><div class="dots">${days.join("")}</div></div>`;
}
function renderHome() {
  renderTopbar();
  clearFooter();
  const app = $("#app");
  app.innerHTML = "";
  const home = el(`<div class="home"></div>`);
  home.appendChild(el(`
    <div class="hero">
      <h1>¡Hola! 🇪🇸</h1>
      <p>Barcelona-ready Spanish, one tapa at a time. Finish a lesson to unlock the next.</p>
      ${streakStrip()}
    </div>`));

  DECK.stages.forEach(st => {
    const total = st.lessons.length || 1;
    const done = st.lessons.filter(l => lessonDone(l.id)).length;
    const stage = el(`<div class="stage"></div>`);
    stage.appendChild(el(`
      <div class="stage-head"><h2>${st.title}</h2><span class="blurb">${st.blurb}</span></div>
      <div class="stage-bar"><i style="width:${Math.round(done / total * 100)}%"></i></div>`));
    const list = el(`<div class="lessons"></div>`);
    st.lessons.forEach(l => {
      const isDone = lessonDone(l.id), unlocked = lessonUnlocked(l.id);
      const stars = isDone ? state.lessons[l.id].stars : 0;
      const card = el(`
        <div class="lesson ${isDone ? "done" : ""} ${unlocked ? "" : "locked"}">
          <div class="badge">${isDone ? "✓" : unlocked ? "▶" : "🔒"}</div>
          <div class="meta">
            <div class="t">${l.title}</div>
            <div class="s">${l.topic} · ${l.items.length} phrases</div>
            ${isDone ? `<div class="stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>` : ""}
          </div>
          <div class="chev">${unlocked ? "›" : ""}</div>`);
      if (unlocked) card.addEventListener("click", () => startLesson(l));
      else card.addEventListener("click", () => toast("Finish the lesson before it to unlock 🔒"));
      list.appendChild(card);
    });
    stage.appendChild(list);
    home.appendChild(stage);
  });
  app.appendChild(home);
}

/* ============================== SETTINGS ============================== */
function renderSettings() {
  clearFooter();
  const app = $("#app");
  app.innerHTML = "";
  const wrap = el(`<div class="settings"></div>`);
  wrap.appendChild(el(`<div class="set-head"><button class="close-btn" id="back">‹</button><h2>Settings</h2></div>`));

  const sound = el(`<div class="set-row"><div><div class="set-t">Success sounds</div><div class="set-d">Play a chime on correct answers</div></div>
    <button class="toggle ${state.sound ? "on" : ""}" id="snd"><i></i></button></div>`);
  wrap.appendChild(sound);

  wrap.appendChild(el(`<div class="set-row"><div><div class="set-t">Push reminders</div><div class="set-d">Morning + bedtime nudges</div></div>
    <span class="soon">next update</span></div>`));
  wrap.appendChild(el(`<div class="set-row"><div><div class="set-t">Group mode</div><div class="set-d">Share a code, compare strengths</div></div>
    <span class="soon">next update</span></div>`));

  const editP = el(`<button class="btn grey" style="margin-top:20px">Edit trip profile</button>`);
  editP.addEventListener("click", renderOnboarding);
  wrap.appendChild(editP);

  const reset = el(`<button class="btn" style="margin-top:12px;background:var(--red);color:#2a0406">Reset all progress</button>`);
  reset.addEventListener("click", () => {
    if (confirm("Erase all progress, streak, and profile? This can't be undone.")) {
      state = Object.assign({}, DEFAULT_STATE); save(); rebuildDeck(); renderOnboarding();
    }
  });
  wrap.appendChild(reset);

  app.appendChild(wrap);
  $("#back").addEventListener("click", renderHome);
  $("#snd").addEventListener("click", e => {
    state.sound = !state.sound; save();
    e.currentTarget.classList.toggle("on", state.sound);
    if (state.sound) playSound("correct");
  });
}

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
      <button class="close-btn" id="quit">✕</button>
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
  const before = state.streak;
  registerActivity();
  save(); renderTopbar();
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

/* ============================== boot ============================== */
rebuildDeck();
$("#gear").addEventListener("click", renderSettings);
if (!state.profile) renderOnboarding(); else renderHome();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
