/* ============================== HOME (scores + map) ============================== */
function ringSVG(val, cls) {
  const r = 52, C = 2 * Math.PI * r, off = C * (1 - Math.max(0, Math.min(100, val)) / 100);
  return `<svg class="ring ${cls}" viewBox="0 0 120 120">
    <circle class="ring-bg" cx="60" cy="60" r="${r}"/>
    <circle class="ring-fg" cx="60" cy="60" r="${r}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-fill="${off.toFixed(1)}" transform="rotate(-90 60 60)"/>
  </svg>`;
}
function sparkBars(arr) {
  const max = Math.max(1, ...arr);
  return arr.map(v => `<i style="height:${v ? Math.max(16, Math.round(v / max * 100)) : 6}%" class="${v ? "on" : ""}"></i>`).join("");
}
function _lastSessionDays() {
  const last = (state.sessions || []).reduce((m, s) => Math.max(m, new Date(s.at).getTime()), 0);
  return last ? Math.floor((Date.now() - last) / 864e5) : null;
}
function _recencyText() {
  const d = _lastSessionDays();
  return d === null ? "not yet" : d === 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`;
}
function findLesson(id) {
  for (const st of (DECK ? DECK.stages : [])) for (const l of st.lessons) if (l.id === id) return l;
  return null;
}

function renderHome() {
  renderTopbar();
  clearFooter();
  showTabbar("home");
  const app = $("#app");
  app.innerHTML = "";
  const home = el(`<div class="home"></div>`);
  const p = state.profile || {};
  const d = destInfo(p.destination);
  const s = computeScores();
  const started = s.lifetimeSessions > 0 || Object.keys(state.lessons).length > 0;
  const days = p.tripDate ? Math.max(0, daysUntil(p.tripDate)) : null;
  const band = readinessBand(s.readiness);
  const rClass = s.readiness < 40 ? "r-low" : s.readiness < 65 ? "r-mid" : "r-high";   // red / yellow / green

  const hero = el(`<div class="hero"></div>`);

  if (!started) {
    hero.appendChild(el(`<div class="empty-hero">Complete your first lesson to start your Trip Readiness score.</div>`));
  } else {
    const scores = el(`<div class="scores">
      <button class="ring-card m-momentum" id="sc-momentum">
        <div class="ring-wrap">${ringSVG(s.momentum, "m-momentum")}
          <div class="ring-center"><div class="ring-num" data-to="${s.momentum}">0</div></div>
        </div>
        <div class="ring-label">Momentum</div>
      </button>
      <button class="ring-card readiness ${rClass}" id="sc-readiness">
        <div class="ring-wrap">${ringSVG(s.readiness, "readiness")}
          <div class="ring-center"><div class="ring-num" data-to="${s.readiness}">0<span class="pct">%</span></div></div>
        </div>
        <div class="ring-label">Trip Readiness</div>
        ${days !== null ? `<div class="ring-days">${days}d out</div>` : `<div class="ring-days set-date">Set date</div>`}
      </button>
      <button class="ring-card m-retention" id="sc-retention">
        <div class="ring-wrap">${ringSVG(s.retention, "m-retention")}
          <div class="ring-center"><div class="ring-num" data-to="${s.retention}">0</div></div>
        </div>
        <div class="ring-label">Retention</div>
      </button>
    </div>`);
    hero.appendChild(scores);
  }
  home.appendChild(hero);

  if (started) {
    // fill the arcs + count the numbers up on open
    setTimeout(() => {
      home.querySelectorAll(".ring-fg").forEach(c => { if (c.dataset.fill != null) c.style.strokeDashoffset = c.dataset.fill; });
      home.querySelectorAll(".ring-num").forEach(n => {
        const to = +n.dataset.to; const t0 = performance.now();
        const step = now => {
          const k = Math.min(1, (now - t0) / 650), e = 1 - Math.pow(1 - k, 3);
          n.firstChild.textContent = Math.round(to * e);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, 40);
    hero.querySelector("#sc-readiness").addEventListener("click", () => scoreSheet("readiness"));
    hero.querySelector("#sc-momentum").addEventListener("click", () => scoreSheet("momentum"));
    hero.querySelector("#sc-retention").addEventListener("click", () => scoreSheet("retention"));
    const sd = hero.querySelector(".set-date"); if (sd) sd.addEventListener("click", renderOnboarding);
  }

  // Action region (learning-engine spec §8b): hero tile + review row + standing line
  if (started) {
    home.appendChild(heroTile());
    home.appendChild(reviewRow());
    const sl = standingLine(); if (sl) home.appendChild(sl);
  }

  if (!state.account) {
    const banner = el(`<div class="backup-banner"><span>🔒 Back up your progress — create an account so a reinstall never wipes your progress.</span><button class="btn" style="margin-top:10px">Create account</button></div>`);
    banner.querySelector("button").addEventListener("click", () => renderAuth("signup"));
    home.appendChild(banner);
  }

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
          <div class="chev">${unlocked ? icon('caret-right', 18) : ""}</div>`);
      if (unlocked) card.addEventListener("click", () => startLesson(l));
      else card.addEventListener("click", () => toast("Finish the lesson before it to unlock 🔒"));
      list.appendChild(card);
    });
    stage.appendChild(list);
    home.appendChild(stage);
  });
  app.appendChild(home);
}

/* ---- score detail sheet (every score explains itself in one tap) ---- */
function scoreSheet(which) {
  const s = state.scoresCache || computeScores();
  document.querySelectorAll(".sheet-wrap").forEach(n => n.remove());
  let title, drivers, cta = null, sub = null;
  if (which === "readiness") {
    const band = readinessBand(s.readiness);
    title = "Trip Readiness";
    sub = `${band.label}${s.lifetimeSessions < 5 ? " · establishing baseline" : ""}`;
    drivers = [`Coverage ${s.coverage}`, `Retention ${s.retention}`, `Last practiced ${_recencyText()}`];
  } else if (which === "momentum") {
    title = "Momentum";
    drivers = [`${s.activeDays7} of 5 active days`, `${s.sessions7} sessions this week`];
  } else {
    title = "Retention";
    const fade = fadingItems().filter(x => x.strength < 60);
    drivers = fade.length ? [`${fade.length} phrase${fade.length === 1 ? "" : "s"} fading`] : ["Everything's holding strong"];
    if (fade.length) {
      const weak = fade.slice(0, 12).map(x => ITEM_INDEX[x.id]).filter(Boolean);
      cta = { label: `Review ${weak.length} fading phrase${weak.length === 1 ? "" : "s"}`, fn: () => { closeSheet(); startReview(weak); } };
    }
  }
  const wrap = el(`<div class="sheet-wrap">
    <div class="sheet-backdrop"></div>
    <div class="sheet">
      <div class="sheet-grab"></div>
      <div class="sheet-title">${title}</div>
      ${sub ? `<div class="sheet-sub">${sub}</div>` : ``}
      <div class="drivers">${drivers.map(x => `<div class="driver">${x}</div>`).join("")}</div>
    </div>
  </div>`);
  if (cta) {
    const b = el(`<button class="btn" style="margin-top:14px">${cta.label}</button>`);
    b.addEventListener("click", cta.fn);
    wrap.querySelector(".sheet").appendChild(b);
  }
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("show"));
  wrap.querySelector(".sheet-backdrop").addEventListener("click", closeSheet);
}
function closeSheet() {
  const w = document.querySelector(".sheet-wrap");
  if (!w) return; w.classList.remove("show"); setTimeout(() => w.remove(), 260);
}

/* ============================== HOME ACTION REGION (§8b) ============================== */
function seenItems() { return (ALL_ITEMS || []).filter(it => exposuresOf(it) > 0); }
function firstOpenLesson() {
  for (const st of (DECK ? DECK.stages : [])) for (const l of st.lessons)
    if (lessonUnlocked(l.id) && !lessonDone(l.id)) return l;
  return null;
}
function itemsInCategory(cat) {
  const out = [];
  (DECK ? DECK.stages : []).forEach(st => st.lessons.forEach(l => {
    if (categoryOf(l.topic) === cat) l.items.forEach(it => { if (exposuresOf(it) > 0) out.push(it); });
  }));
  return out;
}

/* 8b.2 — hero action tile: evaluate the priority function, render the first matching state.
   Copy guardrail (§8b.1): recommends, never threatens; the only real deadline is the trip date. */
function heroState() {
  const p = state.profile || {};
  const days = p.tripDate ? Math.max(0, daysUntil(p.tripDate)) : null;
  const mistakes = mistakesPool(), due = dueForReview();
  const backlog = [...new Set([...mistakes, ...due])];
  const lastDays = _lastSessionDays();
  const next = firstOpenLesson();
  if (days !== null && days <= 14)
    return { kind: "cram", title: `${days} day${days === 1 ? "" : "s"} out — drill your essentials`, run: () => startReview(backlog.length ? backlog : seenItems()) };
  if (backlog.length >= 15)
    return { kind: "review", title: `Review ${backlog.length} due items`, sub: "Quickest way to lift Retention", run: () => startReview(backlog) };
  if (lastDays !== null && lastDays >= 2 && backlog.length)
    return { kind: "momentum", title: "Momentum's dipping — 3 minutes brings it back", run: () => startReview(backlog.slice(0, 8)) };
  if (next)
    return { kind: "lesson", title: `Start: ${next.title}`, sub: next.topic, run: () => startLesson(next) };
  return { kind: "caught", title: "You're ahead — a quick practice round?", run: () => startReview(seenItems()) };
}
function heroTile() {
  const h = heroState();
  const t = el(`<button class="hero-tile hero-${h.kind}">
    <div class="hero-txt"><div class="hero-title">${h.title}</div>${h.sub ? `<div class="hero-sub">${h.sub}</div>` : ""}</div>
    <span class="hero-go">${icon("caret-right", 22)}</span></button>`);
  t.addEventListener("click", h.run);
  return t;
}

/* 8b.3 — persistent review row: three always-present tiles (spatial stability; 0 = disabled-quiet) */
function reviewRow() {
  const mistakes = mistakesPool(), due = dueForReview();
  const row = el(`<div class="review-row"></div>`);
  const chip = (cls, ic, n, label, disabled, run) => {
    const c = el(`<button class="review-chip ${cls} ${disabled ? "off" : ""}">
      <span class="chip-top"><span class="chip-ic">${icon(ic, 16)}</span>${n != null ? `<b>${n}</b>` : ""}</span>
      <span class="chip-label">${label}</span></button>`);
    if (!disabled) c.addEventListener("click", run); else c.disabled = true;
    return c;
  };
  row.appendChild(chip("c-mistakes", "warning", mistakes.length, "Mistakes", !mistakes.length, () => startReview(mistakes)));
  row.appendChild(chip("c-due", "arrows-clockwise", due.length, "Due", !due.length, () => startReview(due)));
  row.appendChild(chip("c-practice", "lightning", null, "Practice", !seenItems().length, () => startReview(seenItems())));
  return row;
}

/* 8b.4 — standing line: exactly three slots (phrases ready · focus area · trip pace) */
function phrasesReadyCount() {
  // phrases you're producing reliably (2+ correct in a row after a few looks)
  return Object.values(state.learn || {}).filter(s => s && s.streak >= 2 && s.exposures >= 3).length;
}
function focusCategory() {
  const cats = Object.entries(state.topicStats || {}).filter(([, v]) => v && v.total >= 10)
    .map(([k, v]) => ({ k, acc: v.correct / v.total })).sort((a, b) => a.acc - b.acc);
  return cats.length ? cats[0].k : null;
}
function standingLine() {
  const slots = [];
  const pr = phrasesReadyCount();
  slots.push(`<div class="stand-slot"><b>${pr}</b> phrase${pr === 1 ? "" : "s"} ready</div>`);
  const focus = focusCategory();
  const s = state.scoresCache || computeScores();
  const pace = s.pace;
  const line = el(`<div class="standing-line"></div>`);
  line.appendChild(el(slots[0]));
  if (focus) {
    const f = el(`<button class="stand-slot stand-btn">Focus: <b>${focus}</b></button>`);
    f.addEventListener("click", () => { const its = itemsInCategory(focus); if (its.length) startReview(its); });
    line.appendChild(f);
  }
  const days = (state.profile || {}).tripDate ? daysUntil(state.profile.tripDate) : null;
  if (pace) line.appendChild(el(`<div class="stand-slot ${pace.onTrack ? "pace-ok" : "pace-behind"}">${pace.onTrack ? "On pace" : `Behind · ~${pace.projected}%`}</div>`));
  else if (days !== null && days >= 0) line.appendChild(el(`<div class="stand-slot">Pace: baseline building</div>`));  // <5 sessions → too noisy to project yet
  return line.children.length ? line : null;
}
