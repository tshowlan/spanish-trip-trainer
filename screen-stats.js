/* ============================== STATS (the tab that was Progress; chat's 11/2 rulings, Tom's calls) ==============================
   Data you cannot see on Learn or Home. Order: the hero (the rate over the last 14 days, in a card) · PLACES (six squares, a
   score each: the mean strength of every item the place carries; Not yet / Known / the Solid light) · TIME (minutes per day,
   seven bars, the month behind) · BY EXERCISE (rate plus the change in points against your average) · BEST SESSIONS (perfect
   sessions ranked by time under your usual) · TOTALS · TRIPS. No doors, no flags, no strip. STAGED "stats". */
const STATS_PLACES = [
  { key: "counter", name: "Counter", icon: "coffee", lessons: ["w-counter", "sent-counter"] },
  { key: "table", name: "Table", icon: "fork-knife", lessons: ["w-table", "w-bathroom", "sent-table"] },
  { key: "street", name: "Street", icon: "signpost", lessons: ["w-street", "w-signs", "sent-street"] },
  { key: "shop", name: "Shop", icon: "shopping-bag", lessons: ["sent-shop"] },
  { key: "help", name: "Help", icon: "first-aid-kit", lessons: ["w-help", "sent-help"] },
  { key: "paying", name: "Paying", icon: "credit-card", lessons: ["w-paying", "sent-paying"] },
];
const STATS_LINES = {
  places: "Your score at each place, out of 100. Tap a place to see what is holding it down.",
  time: "Minutes you spent in sessions, each day this week. Tap to see the month, back to your first day.",
  ex: "What you got right in the last 14 days, and how that compares with your average.",
  best: "Every one of these you got all right. The quickest against your average comes first.",
  counting: d => `Counting from ${d}. Give it a week.`,
  zero: "This page fills in as you play.",
};
// the hero card's ground over the photo: a percent Tom tunes in the Test Lab (100 shipped, Tom 11/2: solid, like the squares); applied at load
(function () { try { const v = localStorage.getItem("sts_hero_ground"); if (v != null) document.documentElement.style.setProperty("--st-hero-ground", v + "%"); } catch (e) {} })();
function setHeroGround(pct) { try { localStorage.setItem("sts_hero_ground", String(pct)); } catch (e) {} document.documentElement.style.setProperty("--st-hero-ground", pct + "%"); }
const STAT_KIND_ORDER = ["listen", "pick", "build", "type"];

/* ---- helpers ---- */
function _stShortDate(iso) { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function _stDur(ms) { const s = Math.round(ms / 1000); if (s < 60) return `${s} s`; const m = Math.floor(s / 60), r = s % 60; return r ? `${m} min ${r} s` : `${m} min`; }
function _stHours(ms) { const m = Math.round(ms / 60000); if (m < 60) return `${m} min`; const h = Math.floor(m / 60), r = m % 60; return r ? `${h} h ${r} min` : `${h} h`; }
function _stLessons(base) {   // the deck's lessons for a base id: the id itself or its parts (w-counter-1, w-counter-2)
  const out = [];
  (DECK ? DECK.stages : []).forEach(st => st.lessons.forEach(l => { if (l.id === base || l.id.startsWith(base + "-")) out.push(l); }));
  return out;
}
function _stPlaceItems(p) {
  const lessons = p.lessons.flatMap(_stLessons), items = [], seen = new Set();
  lessons.forEach(l => { if (l.sounds) return; (l.items || []).forEach(it => { if (it.card || !it.id || seen.has(it.id)) return; seen.add(it.id); items.push(it); }); });
  return { lessons, items };
}
// a place's state: { score, known, solid, items, lessons } or { notYet: true }
function statsPlace(p) {
  const { lessons, items } = _stPlaceItems(p);
  const met = items.map(it => { const st = learnPeek(it); return st && st.exposures >= 1 ? { it, st, strength: Math.round(itemStrength(st)) } : null; }).filter(Boolean);
  const known = lessons.length > 0 && lessons.every(l => state.lessons[l.id] && state.lessons[l.id].known);
  if (!met.length && !known) return { notYet: true, items, lessons, met };
  const score = met.length ? Math.round(met.reduce((a, m) => a + m.strength, 0) / met.length) : 100;
  const solid = lessons.length > 0 && lessons.every(l => state.lessons[l.id] && state.lessons[l.id].solid);   // the earned state, when it exists
  return { score, known, solid, items, lessons, met };
}

/* ---- the data bundle (everything the page draws; the Test Lab fabricates one per state) ---- */
function statsData() {
  const sessions = (state.sessions || []).slice().sort((a, b) => (a.at || "") < (b.at || "") ? -1 : 1);
  const since14 = daysAgoStr(13), since56 = daysAgoStr(13 + 56);
  const sum = arr => arr.reduce((a, s) => ({ n: a.n + 1, ph: a.ph + (s.phrases || 0), ok: a.ok + (s.correct || 0) }), { n: 0, ph: 0, ok: 0 });
  const recent = sessions.filter(s => (s.at || "").slice(0, 10) >= since14);
  const all = sum(sessions), win = sum(recent);
  const rate = a => a.ph ? Math.round(100 * a.ok / a.ph) : null;
  // places
  const places = STATS_PLACES.map(p => Object.assign({ key: p.key, name: p.name, icon: p.icon }, statsPlace(p)));
  // time: minutes per day from the sessions' durations
  const byDay = {}; let firstTimed = null;
  sessions.forEach(s => { if (!s.ms) return; const d = (s.at || "").slice(0, 10); byDay[d] = (byDay[d] || 0) + s.ms; if (!firstTimed || d < firstTimed) firstTimed = d; });
  const week = []; for (let i = 6; i >= 0; i--) { const d = daysAgoStr(i); week.push({ day: d, ms: byDay[d] || 0, label: new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }) }); }
  // by exercise: the window against the eight weeks before it
  const S = state.stats || {}; const kinds = {};
  Object.keys(S).forEach(d => Object.entries(S[d] || {}).forEach(([k, e]) => {
    const t = kinds[k] = kinds[k] || { win: { n: 0, ok: 0 }, usual: { n: 0, ok: 0 } };
    const slot = d >= since14 ? t.win : d >= since56 ? t.usual : null; if (!slot) return;
    slot.n += e.n || 0; slot.ok += e.ok || 0;
  }));
  const recordDays = Object.keys(S).sort(), firstRecord = recordDays[0] || null;
  const rows = STAT_KIND_ORDER.filter(k => kinds[k] && kinds[k].win.n > 0).map(k => {
    const w = kinds[k].win, u = kinds[k].usual, r = Math.round(100 * w.ok / w.n);
    let change = null;
    if (w.n >= 20 && u.n >= 50) { const d = r - Math.round(100 * u.ok / u.n); change = Math.abs(d) <= 2 ? "steady" : d > 0 ? `up ${d}` : `down ${-d}`; }
    return { kind: k, name: STAT_KINDS[k], rate: r, change };
  });
  // best sessions: perfect, timed, with an expected time; ranked by time under the usual
  const best = sessions.filter(s => s.ms && s.exp && s.phrases > 0 && s.correct >= s.phrases)
    .map(s => ({ name: _stSessionName(s.lessonId), delta: s.exp - s.ms, ms: s.ms, right: `${s.correct} of ${s.phrases}`, date: _stShortDate(s.at) }))
    .sort((a, b) => b.delta - a.delta).slice(0, 5);
  const firstAt = sessions.length ? sessions[0].at : null;
  return {
    hero: { rate: rate(win), all: rate(all), n: win.n, ph: win.ph },
    places, week, byDay, firstTimed, rows, best,
    counting: firstRecord ? _stShortDate(firstRecord + "T12:00:00") : _stShortDate(todayStr() + "T12:00:00"),
    recordEmpty: !recordDays.length,
    totals: sessions.length ? { since: new Date(firstAt).toLocaleDateString("en-US", { month: "long" }), n: all.n, ph: all.ph, ok: all.ok } : null,
    trips: (typeof completedTrips === "function") ? completedTrips() : [],
    zero: !sessions.length,
  };
}
function _stSessionName(id) {
  if (!id || id === "__review__") return "Review";
  for (const st of (DECK ? DECK.stages : [])) for (const l of st.lessons) if (l.id === id) return l.title || id;
  return id === "__shop__" ? "Machine shop" : id === "__lap__" ? "The lap" : id === "__scene__" ? "Scene" : id;
}

/* ---- the page ---- */
function renderStats(opts) {
  showTabbar("progress");
  clearFooter();
  if (typeof setHomeAtmo === "function") setHomeAtmo();   // Spain's photo behind the top of the page, as on Home (Tom 11/2, colour B); nav.js tears it down off-tab
  const preview = opts && opts.preview;
  const d = preview ? statsPreviewData(preview) : statsData();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen tab-screen stats-screen"></div>`);
  wrap.appendChild(el(`<div class="screen-head"><h2>Stats</h2></div>`));
  // the hero
  const h = d.hero;
  let ground = 100; try { const v = localStorage.getItem("sts_hero_ground"); if (v != null) ground = +v; } catch (e) {}
  wrap.appendChild(el(`<div class="st-hero${ground >= 100 ? " solid-card" : ""}">
    <div class="st-n${h.rate == null ? " dim" : ""}">${h.rate == null ? "&ndash;" : `${h.rate}<span class="pct">%</span>`}</div>
    <div class="st-cap">Right in the last 14 days</div>
    <div class="st-sub">${h.rate == null ? "Your first session sets this." : `${h.ph} exercise${h.ph === 1 ? "" : "s"} in ${h.n} session${h.n === 1 ? "" : "s"}. ${h.all}% all time.`}</div>
  </div>`));
  // places
  wrap.appendChild(_stHead("Places", STATS_LINES.places));
  const grid = el(`<div class="st-grid"></div>`);
  d.places.forEach(p => {
    const sq = el(`<button class="st-pl${p.notYet ? " ny" : ""}${p.solid ? " solid" : ""}" aria-label="${p.name}">
      ${p.solid ? `<span class="st-lantern"></span>` : ""}<span class="st-ic">${icon(p.icon, 30)}</span><span class="st-nm">${p.name}</span>
      <span class="st-sc${p.known ? " kn" : ""}">${p.known ? "Known" : p.notYet ? "Not yet" : p.score}</span></button>`);
    sq.addEventListener("click", () => preview ? toast("A preview: the real squares open the place") : statsPlaceSheet(p));
    grid.appendChild(sq);
  });
  wrap.appendChild(grid);
  // time
  wrap.appendChild(_stHead("Time", STATS_LINES.time));
  const weekMs = d.week.reduce((a, w) => a + w.ms, 0), any = d.week.some(w => w.ms > 0), max = Math.max(1, ...d.week.map(w => w.ms));
  const tw = el(`<button class="st-tw" aria-label="See the month">
    <div class="st-bars">${d.week.map((w, i) => { const m = Math.round(w.ms / 60000); return `<div class="st-col"><span class="st-m">${m || ""}</span><i style="height:${w.ms ? Math.max(6, Math.round(64 * w.ms / max)) : 3}px" class="${w.ms ? "on" : ""}"></i><span class="st-d${i === 6 ? " today" : ""}">${w.label}</span></div>`; }).join("")}</div>
    <div class="st-line"><span>${any ? `${_stHours(weekMs)} this week.` : "Your first minutes show here."}</span><span class="st-more">The month ${icon("caret-right", 15)}</span></div>
  </button>`);
  tw.addEventListener("click", () => preview ? toast("A preview: the real block opens the month") : statsMonthSheet(d));
  wrap.appendChild(tw);
  // by exercise
  wrap.appendChild(_stHead("By exercise", d.rows.length ? STATS_LINES.ex : null));
  if (d.rows.length) wrap.appendChild(el(`<div class="st-list">${d.rows.map(r => `<div class="st-row"><span class="st-rnm">${r.name}</span><span class="st-rt">${r.rate}%</span><span class="st-dl ${r.change == null ? "none" : r.change === "steady" ? "" : r.change.startsWith("up") ? "up" : "down"}">${r.change || ""}</span></div>`).join("")}</div>`));
  else wrap.appendChild(el(`<div class="st-wait">${d.recordEmpty ? STATS_LINES.counting(d.counting) : "Nothing in the last 14 days."}</div>`));
  // best sessions
  wrap.appendChild(_stHead("Best sessions", d.best.length ? STATS_LINES.best : null));
  if (d.best.length) wrap.appendChild(el(`<div class="st-list best">${d.best.map((b, i) => `<div class="st-row"><span class="st-rk">${i + 1}</span><span class="st-rnm"><span>${b.name}</span><small><b>${b.right}</b><span>${_stDur(b.ms)}</span><span>${b.date}</span></small></span><span class="st-rt${b.delta < 0 ? " over" : ""}">${_stDur(Math.abs(b.delta))} ${b.delta < 0 ? "over" : "under"}</span></div>`).join("")}</div>`));
  else wrap.appendChild(el(`<div class="st-wait">${STATS_LINES.counting(d.counting)}</div>`));
  // totals
  if (d.totals) { wrap.appendChild(_stHead("Totals")); wrap.appendChild(el(`<div class="st-totals">Since ${d.totals.since}: ${d.totals.n} session${d.totals.n === 1 ? "" : "s"}, ${d.totals.ph} exercises, ${d.totals.ok} right.</div>`)); }
  // trips: the trophies, last
  if (d.trips.length) {
    wrap.appendChild(_stHead("Trips"));
    d.trips.slice().reverse().forEach(t => {
      const di = destInfo(t.destination), band = readinessBand(t.readinessAtDeparture);
      wrap.appendChild(el(`<div class="archive-row"><div class="arch-dest">${di.flag} ${di.label}</div><div class="arch-meta">${t.tripDate}</div><div class="arch-score ${band.cls}">${t.readinessAtDeparture}%</div></div>`));
    });
  }
  if (d.zero) wrap.appendChild(el(`<div class="st-fills">${STATS_LINES.zero}</div>`));
  app.appendChild(wrap);
}
function _stHead(t, sub) { return el(`<div class="st-headwrap"><div class="st-head">${t}</div>${sub ? `<div class="st-subline">${sub}</div>` : ""}</div>`); }

/* ---- closing a Stats sheet: the scrim closes on a tap or a touch; the drag down is every sheet's now (ui.js sheetDrag, Tom 11/2) ---- */
function _stSheetClose(wrap) {
  const scrim = wrap.querySelector(".sheet-backdrop");
  let closing = false;
  const close = () => { if (closing) return; closing = true; wrap.classList.remove("show"); setTimeout(() => wrap.remove(), 260); };
  scrim.addEventListener("click", close);
  scrim.addEventListener("touchend", e => { e.preventDefault(); close(); }, { passive: false });
  return close;
}

/* ---- the place sheet: sentences low first, words low first, What you hear ---- */
function statsPlaceSheet(p) {
  document.querySelectorAll(".sheet-wrap").forEach(n => n.remove());
  const rows = (list, kind) => list.map(m => `<div class="st-shrow${m.strength < RETENTION_FADE ? " low" : ""}"><span>${m.it.es}</span><b>${m.strength}</b></div>`).join("");
  const sentences = p.met.filter(m => m.it.sentence).sort((a, b) => a.strength - b.strength);
  const words = p.met.filter(m => !m.it.sentence).sort((a, b) => a.strength - b.strength);
  const sItems = p.items.filter(it => it.sentence), heard = (typeof _placeHeard === "function") ? _placeHeard(sItems) : new Set();
  const replies = []; const seenR = new Set();
  sItems.forEach(it => (it.replies || []).forEach(r => { const k = (typeof _replyKey === "function") ? _replyKey(r[0]) : r[0]; if (seenR.has(k)) return; seenR.add(k); replies.push({ es: r[0], en: r[1], heard: heard.has(k) }); }));
  replies.sort((a, b) => (a.heard === b.heard ? 0 : a.heard ? 1 : -1));
  const wrap = el(`<div class="sheet-wrap"><div class="sheet-backdrop"></div><div class="sheet st-sheet"><div class="sheet-grab"></div>
    <div class="sheet-title st-shtitle"><span class="st-ic">${icon(p.icon, 22)}</span>${p.name}${p.solid ? `<span class="st-solid-tag">Solid</span>` : ""}</div>
    ${p.notYet && !p.known ? `<div class="st-shempty">Not yet. Its first session opens it.</div>` : ""}
    ${p.known ? `<div class="st-shempty">Marked Known. It is not taught or reviewed.</div>` : ""}
    ${sentences.length ? `<div class="st-shhead">Sentences</div>${rows(sentences)}` : ""}
    ${words.length ? `<div class="st-shhead">Words</div>${rows(words)}` : ""}
    ${replies.length ? `<div class="st-shhead">What you hear</div>${replies.map(r => `<div class="st-shrow${r.heard ? "" : " dim"}"><span>${r.es}<small>${r.en}</small></span><b>${r.heard ? "Heard" : "Not yet"}</b></div>`).join("")}` : ""}
  </div></div>`);
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("show"));
  _stSheetClose(wrap);
}

/* ---- the month sheet: a grid, a cell per day with its minutes, paged back to the first day ---- */
function statsMonthSheet(d) {
  document.querySelectorAll(".sheet-wrap").forEach(n => n.remove());
  const today = todayStr(), first = d.firstTimed || today;
  let y = +today.slice(0, 4), m = +today.slice(5, 7) - 1;
  const firstY = +first.slice(0, 4), firstM = +first.slice(5, 7) - 1;
  const wrap = el(`<div class="sheet-wrap"><div class="sheet-backdrop"></div><div class="sheet st-sheet"><div class="sheet-grab"></div><div class="sheet-title">Time</div><div class="st-subline">Minutes you spent in sessions, back to your first day.</div><div class="st-month"></div></div></div>`);
  const draw = () => {
    const box = wrap.querySelector(".st-month"), label = new Date(y, m, 1).toLocaleDateString("en-US", { month: "long", year: y === +today.slice(0, 4) ? undefined : "numeric" });
    const days = new Date(y, m + 1, 0).getDate(), lead = (new Date(y, m, 1).getDay() + 6) % 7;   // Monday first
    let total = 0, cells = "";
    for (let i = 1; i <= days; i++) {
      const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`, ms = d.byDay[iso] || 0, mins = Math.round(ms / 60000);
      total += ms;
      cells += `<span class="st-day${ms ? " on" : ""}${iso < first ? " blank" : ""}${iso === today ? " today" : ""}${iso > today ? " future" : ""}">${i}<small>${mins || ""}</small></span>`;
    }
    const atStart = y === firstY && m === firstM, atEnd = y === +today.slice(0, 4) && m === +today.slice(5, 7) - 1;
    const sinceLine = atStart && first !== today && first.slice(0, 7) === `${y}-${String(m + 1).padStart(2, "0")}` ? `, since the ${+first.slice(8, 10)}${["th", "st", "nd", "rd"][(+first.slice(8, 10) % 10 > 3 || [11, 12, 13].includes(+first.slice(8, 10) % 100)) ? 0 : +first.slice(8, 10) % 10]}` : "";
    box.innerHTML = `<div class="st-mhead"><button class="st-nav${atStart ? " off" : ""}" aria-label="Earlier">${icon("caret-left", 16)}</button><span class="st-mtitle">${label}</span><button class="st-nav${atEnd ? " off" : ""}" aria-label="Later">${icon("caret-right", 16)}</button></div>
      <div class="st-mgrid">${["M", "T", "W", "T", "F", "S", "S"].map(x => `<span class="st-md">${x}</span>`).join("")}${"<span></span>".repeat(lead)}${cells}</div>
      <div class="st-line"><span>${total ? `${_stHours(total)} in ${label}${sinceLine}.` : `Nothing in ${label}.`}</span></div>`;
    box.querySelectorAll(".st-nav").forEach((b, i) => b.addEventListener("click", () => { if (b.classList.contains("off")) return; m += i ? 1 : -1; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } draw(); }));
  };
  draw();
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("show"));
  _stSheetClose(wrap);
}

/* ---- the Test Lab's three states (chat's script; nothing touches state) ---- */
function statsPreviewData(which) {
  const base = statsData();
  const P = (over) => STATS_PLACES.map(p => Object.assign({ key: p.key, name: p.name, icon: p.icon, items: [], lessons: [], met: [] }, over[p.key] || { notYet: true }));
  const week = (mins) => base.week.map((w, i) => Object.assign({}, w, { ms: (mins[i] || 0) * 60000 }));
  if (which === "zero") return { hero: { rate: null }, places: P({}), week: week([]), byDay: {}, firstTimed: null, rows: [], best: [], counting: base.counting, recordEmpty: true, totals: null, trips: [], zero: true };
  if (which === "week1") return { hero: { rate: 88, all: 88, n: 4, ph: 61 }, places: P({ counter: { score: 54 }, table: { score: 41 } }), week: week([0, 12, 0, 18, 9, 0, 22]), byDay: {}, firstTimed: daysAgoStr(5),
    rows: [{ name: "Listening", rate: 94, change: null }, { name: "Picking", rate: 91, change: null }, { name: "Building", rate: 82, change: null }], best: [], counting: base.counting, recordEmpty: false,
    totals: { since: "November", n: 4, ph: 61, ok: 54 }, trips: [], zero: false };
  return { hero: { rate: 91, all: 90, n: 22, ph: 458 }, places: P({ counter: { score: 88, solid: true }, table: { score: 85 }, street: { score: 91 }, shop: { score: 79 }, paying: { score: 83 } }), week: week([14, 22, 0, 31, 9, 18, 27]), byDay: {}, firstTimed: daysAgoStr(27),
    rows: [{ name: "Listening", rate: 96, change: "steady" }, { name: "Picking", rate: 93, change: "up 4" }, { name: "Building", rate: 85, change: "down 3" }, { name: "Typing", rate: 88, change: "steady" }],
    best: [{ name: "Help", delta: 35000, ms: 161000, right: "23 of 23", date: "Oct 30" }, { name: "Counter", delta: 29000, ms: 252000, right: "30 of 30", date: "Oct 25" }, { name: "Street", delta: 20000, ms: 185000, right: "23 of 23", date: "Oct 28" }, { name: "Review", delta: 12000, ms: 80000, right: "12 of 12", date: "Oct 29" }, { name: "Counter words · Part 2", delta: -8000, ms: 122000, right: "14 of 14", date: "Oct 22" }],
    counting: base.counting, recordEmpty: false, totals: { since: "July", n: 48, ph: 774, ok: 696 }, trips: [], zero: false };
}
