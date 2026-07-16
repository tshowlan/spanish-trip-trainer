/* ============================== HOME (scores + map) ============================== */
function ringSVG(val, cls, tick) {
  const r = 52, C = 2 * Math.PI * r, off = C * (1 - Math.max(0, Math.min(100, val)) / 100);
  let tickEl = "";
  if (tick != null) {   // §3.2.2 pace tick: where the glide path says you should be today (zero words)
    const a = (Math.max(0, Math.min(100, tick)) / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = 60 + (r - 8) * Math.cos(a), y1 = 60 + (r - 8) * Math.sin(a);
    const x2 = 60 + (r + 8) * Math.cos(a), y2 = 60 + (r + 8) * Math.sin(a);
    tickEl = `<line class="ring-tick" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  return `<svg class="ring ${cls}" viewBox="0 0 120 120">
    <circle class="ring-bg" cx="60" cy="60" r="${r}"/>
    <circle class="ring-fg" cx="60" cy="60" r="${r}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-fill="${off.toFixed(1)}" transform="rotate(-90 60 60)"/>
    ${tickEl}
  </svg>`;
}
// §3.2.2 glide-path target for today (0-100), or null when there's no trip / too little data to be honest
function _glideToday() {
  const p = state.profile || {};
  const s = state.scoresCache || {};
  if (!p.tripDate || typeof daysUntil !== "function" || daysUntil(p.tripDate) <= 0) return null;
  if ((s.lifetimeSessions || 0) < 5) return null;                 // pace too noisy to draw (§4 cold start)
  const h = state.scoreHistory || []; if (!h.length) return null;
  const gap = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 864e5);
  const total = gap(h[0].date, p.tripDate); if (total <= 0) return null;
  const frac = Math.max(0, Math.min(1, gap(h[0].date, todayStr()) / total));
  return Math.max(0, Math.min(100, Math.round((h[0].readiness || 0) + (90 - (h[0].readiness || 0)) * frac)));
}
// tiny 7-day delta for a flanking dial ("+6" / "−2"), or "" when history is too short
function _dialDelta(metric) {
  const tr = (typeof scoreTrend === "function") ? scoreTrend(metric, 8) : null;
  if (!tr || tr.delta === 0) return tr ? `<div class="dial-delta flat">±0</div>` : "";
  const up = tr.delta > 0;
  return `<div class="dial-delta ${up ? "up" : "down"}">${up ? "+" : "−"}${Math.abs(tr.delta)}</div>`;
}
function sparkBars(arr) {
  const max = Math.max(1, ...arr);
  return arr.map(v => `<i style="height:${v ? Math.max(16, Math.round(v / max * 100)) : 6}%" class="${v ? "on" : ""}"></i>`).join("");
}
// §7.2 inline trend sparkline for a dial's detail sheet (area + line, x spaced by real date)
function trendSvg(tr, accent) {
  const W = 300, H = 60, pad = 6;
  const t0 = tr.pts[0].t, span = Math.max(1, tr.pts[tr.pts.length - 1].t - t0);
  const dmin = Math.max(0, tr.min - 8), dmax = Math.min(100, tr.max + 8), rng = Math.max(1, dmax - dmin);
  const X = t => (pad + (W - 2 * pad) * (t - t0) / span);
  const Y = v => (pad + (H - 2 * pad) * (1 - (v - dmin) / rng));
  const line = tr.pts.map((p, i) => `${i ? "L" : "M"}${X(p.t).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(" ");
  const last = tr.pts[tr.pts.length - 1];
  const area = `${line} L${X(last.t).toFixed(1)} ${(H - pad).toFixed(1)} L${X(t0).toFixed(1)} ${(H - pad).toFixed(1)} Z`;
  return `<svg class="trend-svg" viewBox="0 0 ${W} ${H}" style="--tc:${accent}">
    <path class="trend-area" d="${area}"/>
    <path class="trend-line" d="${line}"/>
    <circle class="trend-dot" cx="${X(last.t).toFixed(1)}" cy="${Y(last.v).toFixed(1)}" r="3.4"/>
  </svg>`;
}
// the whole trend block for a sheet — empty string until history accrues (data-gated)
function trendBlock(which) {
  const tr = scoreTrend(which, 30);
  if (!tr) return "";
  const accent = which === "momentum" ? "var(--secondary)" : which === "retention" ? "var(--green)" : "var(--accent-2)";
  const d = tr.delta, cls = d > 0 ? "up" : d < 0 ? "down" : "flat", arrow = d > 0 ? "↑" : d < 0 ? "↓" : "→";
  return `<div class="sheet-trend">
    <div class="trend-head">
      <span class="trend-title">Last ${tr.spanDays} day${tr.spanDays === 1 ? "" : "s"}</span>
      <span class="trend-delta ${cls}">${arrow} ${Math.abs(d)}</span>
    </div>
    ${trendSvg(tr, accent)}
  </div>`;
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

  const hero = el(`<div class="hero"></div>`);

  if (!started) {
    hero.appendChild(el(`<div class="empty-hero">Complete your first lesson to start your Trip Readiness score.</div>`));
  } else {
    const glide = _glideToday();
    // §3.2 crown: the Tripfluent chip's one-time sheen fires only when the user just CROSSED into
    // the top band (not on every render). Track the last top-band state; a genuine re-crossing re-fires.
    const isTop = s.readiness >= 85;
    const crossed = isTop && !state.lastBandTop;
    if ((state.lastBandTop || false) !== isTop) { state.lastBandTop = isTop; save(); }
    const scores = el(`<div class="scores">
      <button class="ring-card m-momentum" id="sc-momentum">
        <div class="ring-wrap">${ringSVG(s.momentum, "m-momentum")}
          <div class="ring-center"><div class="ring-num" data-to="${s.momentum}">0</div></div>
        </div>
        <div class="ring-label">Momentum</div>
        ${_dialDelta("momentum")}
      </button>
      <button class="ring-card readiness ${band.cls}" id="sc-readiness">
        <div class="ring-wrap">${ringSVG(s.readiness, "readiness", glide)}
          <div class="ring-center"><div class="ring-num" data-to="${s.readiness}">0<span class="pct">%</span></div></div>
        </div>
        <div class="band-chip ${band.cls}${isTop ? " crown" : ""}${crossed ? " just-crossed" : ""}">${band.label}</div>
        ${days !== null ? `<div class="ring-days">${days}d out</div>` : `<div class="ring-days set-date">Set date</div>`}
      </button>
      <button class="ring-card m-retention" id="sc-retention">
        <div class="ring-wrap">${ringSVG(s.retention, "m-retention")}
          <div class="ring-center"><div class="ring-num" data-to="${s.retention}">0</div></div>
        </div>
        <div class="ring-label">Retention</div>
        ${_dialDelta("retention")}
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

  // §3.2 Home = state + action only: the smart action tile, a quiet Practice chooser, and
  // (optionally) one line of divergence narration. The content library lives in the Learn tab.
  if (started) {
    home.appendChild(heroTile());
    home.appendChild(practiceButton());
    const dv = divergenceLine(); if (dv) home.appendChild(dv);
  }

  if (!state.account) {
    const banner = el(`<div class="backup-banner"><span>${icon('lock', 16)} Back up your progress, create an account so a reinstall never wipes your progress.</span><button class="btn" style="margin-top:10px">Create account</button></div>`);
    banner.querySelector("button").addEventListener("click", () => renderAuth("signup"));
    home.appendChild(banner);
  }

  app.appendChild(home);
  maybeStatusMoment();
}

/* XP→Status §4.4 migration card (one-time) + §2.3 tier-up moment. Both are quiet, typographic
   full-screen overlays — same restraint as the completion screens; no confetti, no badges. */
function maybeStatusMoment() {
  if (state.pendingTripSummary) {   // §5.1.2 one-time finish-line summary — the app's closest thing to a finish line
    const r = state.pendingTripSummary; state.pendingTripSummary = null; save();
    const di = destInfo(r.destination), band = readinessBand(r.readinessAtDeparture);
    return statusOverlay({
      kicker: `${di.flag} ${di.label} · trip complete`,
      title: `${r.readinessAtDeparture}%`, titleClass: band.cls,
      body: `${band.label}. You put in ${r.sessionsCompleted} session${r.sessionsCompleted === 1 ? "" : "s"} and carried ${r.phrasesLearned} phrases into the trip. It's on your profile now, for good.`,
      cta: "Continue"
    });
  }
  if (state.needsMigrationCard) { state.needsMigrationCard = false; save(); return statusOverlay({
    kicker: "A new way to track your trip",
    title: (typeof currentTier === "function" ? currentTier() : "Culturist"),
    body: "Tripfluent now tracks three live scores and five permanent status tiers instead of points. Your history carries over, and this is where it places you.",
    cta: "See my scores"
  }); }
  if (state.pendingTierUp) { const t = state.pendingTierUp; state.pendingTierUp = null; save(); return statusOverlay({
    kicker: "New status earned",
    title: t,
    body: (typeof nextTierCondition === "function" ? nextTierCondition() : ""),
    cta: "Continue"
  }); }
}
function statusOverlay({ kicker, title, body, cta, titleClass }) {
  document.querySelectorAll(".tierup-wrap").forEach(n => n.remove());
  const w = el(`<div class="tierup-wrap">
    <div class="tierup">
      <div class="tierup-kicker">${kicker}</div>
      <div class="tierup-name ${titleClass || ""}">${title}</div>
      <div class="tierup-body">${body}</div>
      <button class="btn" id="tuok" style="margin-top:22px">${cta}</button>
    </div>
  </div>`);
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add("show"));
  w.querySelector("#tuok").addEventListener("click", () => w.remove());
}

/* ---- score detail sheet (every score explains itself in one tap) ---- */
function scoreSheet(which) {
  const s = state.scoresCache || computeScores();
  document.querySelectorAll(".sheet-wrap").forEach(n => n.remove());
  const destL = (typeof destInfo === "function" ? destInfo((state.profile || {}).destination).label : "your trip");
  let title, drivers, cta = null, sub = null, role = "", diverge = null;
  if (which === "readiness") {
    const band = readinessBand(s.readiness);
    title = "Trip Readiness";
    sub = `${band.label}${s.lifetimeSessions < 5 ? " · establishing baseline" : ""}`;
    // §7.1: Readiness is the OUTPUT — never steered directly
    role = "Will you be ready? This score is the output: you move it through Momentum and Retention, never directly.";
    drivers = [`Coverage ${s.coverage}`, `Retention ${s.retention}`, `Last practiced ${_recencyText()}`];
    if (s.pace && !s.pace.onTrack && s.pace.reachable && s.pace.addSessions > 0)
      diverge = { line: `At this pace you'll be ~${s.pace.projected}% ready. About ${s.pace.addSessions} more session${s.pace.addSessions === 1 ? "" : "s"}/week gets you to 90%.` };
    const dv = scoreDivergence(s);   // §7.3 — a divergence overrides the generic pace line
    if (dv && dv.kind === "cover") diverge = { line: `What you've learned is solid, but ${destL} needs more. ${dv.untouched} scenario categories still untouched.`, cta: { label: "Start the next lesson", fn: () => { closeSheet(); const n = firstOpenLesson(); n ? startLesson(n) : startReview(seenItems()); } } };
    else if (dv && dv.kind === "review") diverge = { line: `You're putting in the work, but ${dv.fading} earlier phrases are fading. Point the next session at review.`, cta: { label: "Review fading phrases", fn: () => { closeSheet(); startReview(fadingItems().filter(x => x.strength < 55).slice(0, 12).map(x => ITEM_INDEX[x.id]).filter(Boolean)); } } };
  } else if (which === "momentum") {
    title = "Momentum";
    role = "Are you doing the work? This is your only same-day lever: one session and it moves today.";
    drivers = [`${s.activeDays7} of 5 active days`, `${s.sessions7} sessions this week`];
  } else {
    title = "Retention";
    role = "Is it sticking? Your lever: steer a session toward review instead of new content.";
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
      <div class="sheet-role">${role}</div>
      <div class="drivers">${drivers.map(x => `<div class="driver">${x}</div>`).join("")}</div>
      ${trendBlock(which)}
      ${diverge ? `<div class="sheet-diverge">${diverge.line}</div>` : ``}
    </div>
  </div>`);
  const theCta = (diverge && diverge.cta) || cta;
  if (theCta) {
    const b = el(`<button class="btn" style="margin-top:14px">${theCta.label}</button>`);
    b.addEventListener("click", theCta.fn);
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
    if (!l.bonus && !lessonDone(l.id)) return l;
  return null;
}
// how many of a lesson's phrases are due/fading — powers the review-due badge on completed tiles
function lessonFadingCount(l) {
  const today = todayStr();
  return l.items.filter(it => {
    const s = state.learn && state.learn[it.id];
    if (!s || !s.exposures) return false;
    return s.due ? s.due <= today : itemStrength(s) < 55;
  }).length;
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
  const dv = scoreDivergence();                        // §7.3: the divergence steers the recommendation, not just copy
  if (days !== null && days <= 14)
    return { kind: "cram", title: `${days} day${days === 1 ? "" : "s"} out, drill your essentials`, run: () => startReview(backlog.length ? backlog : seenItems()) };
  // §7.3 quality problem: doing the work but earlier phrases decaying → steer today to review
  if (dv && dv.kind === "review") {
    const fad = fadingItems().filter(x => x.strength < 55).slice(0, 12).map(x => ITEM_INDEX[x.id]).filter(Boolean);
    if (fad.length) return { kind: "review", title: `${dv.fading} phrases are fading, bring them back`, sub: "Point today at review, not new content", run: () => startReview(fad) };
  }
  if (backlog.length >= 15)
    return { kind: "review", title: `Review ${backlog.length} due items`, sub: "Quickest way to lift Retention", run: () => startReview(backlog) };
  if (lastDays !== null && lastDays >= 2 && backlog.length)
    return { kind: "momentum", title: "Momentum's dipping, 3 minutes brings it back", run: () => startReview(backlog.slice(0, 8)) };
  if (next)   // §7.3 coverage problem: retention solid but too little covered → new content, said plainly
    return { kind: "lesson", title: `Start: ${next.title}`, sub: dv && dv.kind === "cover" ? `${destInfo(p.destination).label} needs more, ${dv.untouched} categories untouched` : next.topic, run: () => startLesson(next) };
  return { kind: "caught", title: "You're ahead, up for a speed round?", run: () => startSpeedRound() };   // §7.6 pure fun, advances nothing
}
function heroTile() {
  const h = heroState();
  const t = el(`<button class="hero-tile hero-${h.kind}">
    <div class="hero-txt"><div class="hero-title">${h.title}</div>${h.sub ? `<div class="hero-sub">${h.sub}</div>` : ""}</div>
    <span class="hero-go">${icon("caret-right", 22)}</span></button>`);
  t.addEventListener("click", h.run);
  return t;
}

/* §3.2.4 — quiet Practice chooser (replaces the Due/Mistakes tiles §3.3 kills). One secondary
   button → a sheet with Recommended / By scenario / Weakest phrases. */
function practiceButton() {
  const b = el(`<button class="practice-btn">${icon('arrows-clockwise', 18)} Practice</button>`);
  b.addEventListener("click", practiceChooser);
  return b;
}
function practiceChooser() {
  document.querySelectorAll(".sheet-wrap").forEach(n => n.remove());
  const wrap = el(`<div class="sheet-wrap"><div class="sheet-backdrop"></div>
    <div class="sheet"><div class="sheet-grab"></div><div class="sheet-title">Practice</div>
      <div class="practice-opts"></div></div></div>`);
  const opts = wrap.querySelector(".practice-opts");
  const add = (title, sub, run, disabled) => {
    const b = el(`<button class="practice-opt" ${disabled ? "disabled" : ""}><div class="po-t">${title}</div><div class="po-s">${sub}</div></button>`);
    if (!disabled) b.addEventListener("click", () => { closeSheet(); run(); });
    opts.appendChild(b);
  };
  const h = heroState();
  const weak = fadingItems().slice(0, 15).map(x => ITEM_INDEX[x.id]).filter(Boolean);
  add("Recommended", h.title, h.run);
  add("By scenario", "Pick a category to drill", scenarioChooser);
  add("Weakest phrases", weak.length ? `${weak.length} phrases need the most work` : "Nothing weak right now", () => startReview(weak), !weak.length);
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("show"));
  wrap.querySelector(".sheet-backdrop").addEventListener("click", closeSheet);
}
function scenarioChooser() {
  document.querySelectorAll(".sheet-wrap").forEach(n => n.remove());
  const cats = (typeof coverageCats === "function") ? coverageCats() : {};
  const keys = Object.keys(cats).filter(c => cats[c].seen > 0);
  const wrap = el(`<div class="sheet-wrap"><div class="sheet-backdrop"></div>
    <div class="sheet"><div class="sheet-grab"></div><div class="sheet-title">By scenario</div>
      <div class="practice-opts"></div></div></div>`);
  const opts = wrap.querySelector(".practice-opts");
  keys.forEach(c => {
    const strong = Math.round((cats[c].credit / cats[c].total) * 100);
    const b = el(`<button class="practice-opt"><div class="po-t">${c}</div><div class="po-s">${strong}% strong</div></button>`);
    b.addEventListener("click", () => { closeSheet(); const its = itemsInCategory(c); if (its.length) startReview(its); });
    opts.appendChild(b);
  });
  if (!keys.length) opts.appendChild(el(`<p class="onb-dim">Finish a lesson first.</p>`));
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("show"));
  wrap.querySelector(".sheet-backdrop").addEventListener("click", closeSheet);
}
/* §3.2.5 — one line of divergence narration, only when §7.3 has something to say (else null) */
function divergenceLine() {
  const dv = (typeof scoreDivergence === "function") ? scoreDivergence() : null;
  if (!dv) return null;
  const destL = destInfo((state.profile || {}).destination).label;
  const txt = dv.kind === "review"
    ? `You're putting in the work, but ${dv.fading} earlier phrases are fading. Point today at review.`
    : `What you've learned is solid. ${destL} needs more, ${dv.untouched} categories still untouched.`;
  return el(`<div class="home-diverge">${txt}</div>`);
}
