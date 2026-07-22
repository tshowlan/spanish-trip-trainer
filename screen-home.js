/* ============================== HOME (scores + map) ============================== */
function ringSVG(val, cls, tick) {
  const r = 52, C = 2 * Math.PI * r, off = C * (1 - Math.max(0, Math.min(100, val)) / 100);
  // viewBox stays ring-sized; the pace index protrudes past it and shows via overflow:visible on
  // .ring.readiness — so the tick never widens the dial's LAYOUT box (keeps the 3 dials centered).
  const vb = "0 0 120 120";
  let tickEl = "";
  if (tick != null) {   // §3.2.1 pace tick — Submariner-style gold triangle index outside the track (readiness only)
    const t = Math.max(0, Math.min(100, tick));
    const a = (t / 100) * 2 * Math.PI - Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
    const tipR = 57.5, baseR = 66, hw = 4;   // apex just outside the track pointing inward; base further out
    const tx = 60 + tipR * ca, ty = 60 + tipR * sa;
    const b1x = 60 + baseR * ca - hw * sa, b1y = 60 + baseR * sa + hw * ca;
    const b2x = 60 + baseR * ca + hw * sa, b2y = 60 + baseR * sa - hw * ca;
    // the tick alone is the pace signal (decisions 2026-07-17): fill position relative to the tick
    // carries ahead/behind, words live in the detail sheet. No arc painting in either direction.
    tickEl = `<polygon class="ring-tick" points="${tx.toFixed(1)},${ty.toFixed(1)} ${b1x.toFixed(1)},${b1y.toFixed(1)} ${b2x.toFixed(1)},${b2y.toFixed(1)}"/>`;
  }
  return `<svg class="ring ${cls}" viewBox="${vb}">
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
// TODAY's movement for a dial (dial law 2026-07-21): nonzero-only, daily reset — the
// baseline is the last recorded day BEFORE today (7-day cumulative deltas retired as
// mis-scoped). Home = now + latest movement; longer windows live in Progress.
function _todayDelta(metric) {
  const s = state.scoresCache || {};
  if (s[metric] == null) return 0;
  const h = state.scoreHistory || [], today = todayStr();
  for (let i = h.length - 1; i >= 0; i--) if (h[i].date < today) return Math.round(s[metric] - (h[i][metric] || 0));
  return 0;                                            // no earlier day on record: nothing honest to show
}
function _dialDelta(metric) {
  const d = _todayDelta(metric);
  if (!d) return "";
  return `<div class="dial-delta ${d > 0 ? "up" : "down"}">${d > 0 ? "+" : "−"}${Math.abs(d)}</div>`;
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

// §3.2 home atmosphere: a destination photo crowns the top and masks into the ground; a warm
// destination ground-glow sweeps beneath it (mask-don't-paint, decisions 2026-07-16). Fixed layer
// behind the content, torn down when leaving home (nav.js). The wide destination hero photo.
function destHero() { return (state.active === "spain") ? "./img/es/hero.jpg" : "./img/mx/sights.jpg"; }
function setHomeAtmo() {
  clearHomeAtmo();
  const a = el(`<div class="home-atmo" aria-hidden="true"><div class="atmo-ground"></div><div class="atmo-photo"><img src="${destHero()}" alt=""></div></div>`);
  document.body.insertBefore(a, document.body.firstChild);
  document.body.classList.add("home-lit");                 // photo-on: transparent topbar, wordmark halo, white header text
}
function clearHomeAtmo() {
  document.querySelectorAll(".home-atmo").forEach(n => n.remove());
  document.body.classList.remove("home-lit");
}

function renderHome(opts) {
  const cer = opts && opts.ceremony;                    // §6b: ceremony overlays this render
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (cer) document.body.classList.add("in-ceremony");  // before anything paints: no first-frame flash
  renderTopbar();
  clearFooter();
  showTabbar("home");
  const app = $("#app");
  app.innerHTML = "";
  const home = el(`<div class="home"></div>`);
  const p = state.profile || {};
  const d = destInfo(p.destination);
  const s = computeScores();
  // during the ceremony the dials render at their BEFORE values and the ceremony ticks
  // them (reduced motion: render complete at the after values)
  const disp = (cer && !reduced) ? {
    ...s,
    readiness: cer.before.readiness != null ? cer.before.readiness : s.readiness,
    momentum: cer.before.momentum != null ? cer.before.momentum : s.momentum,
    retention: cer.before.retention != null ? cer.before.retention : s.retention
  } : s;
  const started = s.lifetimeSessions > 0 || Object.keys(state.lessons).length > 0;
  const days = p.tripDate ? Math.max(0, daysUntil(p.tripDate)) : null;
  const band = readinessBand(disp.readiness);
  setHomeAtmo();
  // §3.2 trip header: the destination name is the anchor over the photo; subline is pure countdown
  const tripEl = el(`<div class="trip"><div class="dest">${d.label}</div><div class="sub${days === null ? " set-date" : ""}">${days !== null ? days + " days out" : "Set your trip date"}</div></div>`);
  if (days === null) tripEl.querySelector(".set-date").addEventListener("click", renderOnboarding);
  home.appendChild(tripEl);

  const hero = el(`<div class="hero"></div>`);

  if (!started) {
    hero.appendChild(el(`<div class="empty-hero">Complete your first lesson to start your Trip Readiness score.</div>`));
  } else {
    const glide = _glideToday();
    // §3.2 crown: the Tripfluent chip's one-time sheen fires only when the user just CROSSED into
    // the top band (not on every render). Track the last top-band state; a genuine re-crossing re-fires.
    // Ceremony renders skip this bookkeeping — the mid-ceremony band morph owns the crossing (§6b).
    const isTop = disp.readiness >= 85;
    const crossed = !cer && isTop && !state.lastBandTop;
    if (!cer && (state.lastBandTop || false) !== isTop) { state.lastBandTop = isTop; save(); }
    const dwToday = _todayDelta("readiness");
    const scores = el(`<div class="scores">
      <button class="ring-card m-momentum${cer && !reduced ? " dial-pop" : ""}" id="sc-momentum">
        <div class="ring-wrap">${ringSVG(disp.momentum, "m-momentum")}
          <div class="ring-center"><div class="ring-num" data-to="${disp.momentum}">0</div></div>
        </div>
        <div class="ring-label">Momentum</div>
        ${_dialDelta("momentum")}
      </button>
      <button class="ring-card readiness ${band.cls}" id="sc-readiness">
        <div class="ring-wrap">${ringSVG(disp.readiness, "readiness", glide)}
          <div class="ring-center"><div class="ring-num" data-to="${disp.readiness}">0<span class="pct">%</span></div></div>
        </div>
        <div class="band-chip ${band.cls}${isTop ? " crown" : ""}${crossed ? " just-crossed" : ""}">${band.label}</div>
        ${dwToday > 0 ? `<div class="delta-whisper" id="dw-today">+${dwToday} today</div>` : ""}
      </button>
      <button class="ring-card m-retention${cer && !reduced ? " dial-pop" : ""}" id="sc-retention">
        <div class="ring-wrap">${ringSVG(disp.retention, "m-retention")}
          <div class="ring-center"><div class="ring-num" data-to="${disp.retention}">0</div></div>
        </div>
        <div class="ring-label">Retention</div>
        ${_dialDelta("retention")}
      </button>
    </div>`);
    hero.appendChild(scores);
  }
  home.appendChild(hero);

  if (started && cer) {
    // dial law (§6b): post-session arrival renders the dials settled and motionless — the
    // ceremony consumes the animation budget. Arcs + numbers land instantly, then tick.
    setTimeout(() => {
      home.querySelectorAll(".ring-fg").forEach(c => { if (c.dataset.fill != null) { c.style.transition = "none"; c.style.strokeDashoffset = c.dataset.fill; } });
      home.querySelectorAll(".ring-num").forEach(n => { n.firstChild.textContent = n.dataset.to; });
    }, 0);
  } else if (started) {
    // cold open keeps the load-in fill: arcs sweep + numbers count up
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
  }
  if (started) {
    hero.querySelector("#sc-readiness").addEventListener("click", () => scoreSheet("readiness"));
    hero.querySelector("#sc-momentum").addEventListener("click", () => scoreSheet("momentum"));
    hero.querySelector("#sc-retention").addEventListener("click", () => scoreSheet("retention"));
  }

  // §3.2 Home = state + action only: the smart action tile, a quiet Practice chooser, and
  // (optionally) one line of divergence narration. The content library lives in the Learn tab.
  if (started) {
    home.appendChild(heroTile());
    home.appendChild(practiceButton());
    const dv = divergenceLine(); if (dv) home.appendChild(dv);
    const ins = insightLine(); if (ins) home.appendChild(ins);   // §3.2 gold-spark insight, in rhythm under Practice
    const pr = presenceLine(); if (pr) home.appendChild(pr);     // §3.2 destination presence (local time; temp later)
  }

  if (!state.account) {
    const banner = el(`<div class="backup-banner"><span>${icon('lock', 16)} Back up your progress, create an account so a reinstall never wipes your progress.</span><button class="btn" style="margin-top:10px">Create account</button></div>`);
    banner.querySelector("button").addEventListener("click", () => renderAuth("signup"));
    home.appendChild(banner);
  }

  app.appendChild(home);
  if (cer) sessionEndCeremony(home, cer, reduced);      // §6b: ceremony layer on top; status moments wait
  else maybeStatusMoment();
}

/* ===== §6b session-end ceremony (design/session-end.html, Option D) =====
   Home is the base; this layer overlays its regions (kicker over the photo zone, facts
   over the tile zone, Continue above the nav zone) and animates HOME'S OWN dials — no
   duplicate rendering. Continue triggers the slow dissolve: the world empties, the dials
   hold alone, home refills around them piece by piece. The dials never re-render. */
function _sfactRows(facts) {
  const glyphs = {
    plus: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    restore: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M21 13a9 9 0 1 1-3-7.7L21 8"/></svg>`,
    star: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>`
  };
  // four past-tense events, nonzero-only; gold = what arrived, green = what you did
  const rows = [];
  if (facts.newN > 0) rows.push(`<div class="sfact"><span class="sf-glyph gold">${glyphs.plus}</span><span><span class="sf-n">${facts.newN}</span> new</span></div>`);
  if (facts.stronger > 0) rows.push(`<div class="sfact"><span class="sf-glyph">${glyphs.check}</span><span><span class="sf-n">${facts.stronger}</span> stronger</span></div>`);
  if (facts.restored > 0) rows.push(`<div class="sfact"><span class="sf-glyph">${glyphs.restore}</span><span><span class="sf-n">${facts.restored}</span> restored</span></div>`);
  if (facts.soloed > 0) rows.push(`<div class="sfact"><span class="sf-glyph">${glyphs.star}</span><span><span class="sf-n">${facts.soloed}</span> soloed</span></div>`);
  return rows.join("");
}
const _RING_C = 2 * Math.PI * 52;
// tick one of home's own dials in place: drives the existing ring-fg + ring-num, nothing re-renders
function _tickHomeDial(card, from, to, dur, done) {
  const fg = card.querySelector(".ring-fg"), num = card.querySelector(".ring-num");
  if (fg) fg.style.transition = "none";
  const t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    const v = from + (to - from) * e;
    if (fg) fg.style.strokeDashoffset = (_RING_C * (1 - Math.max(0, Math.min(100, v)) / 100)).toFixed(1);
    if (num) num.firstChild.textContent = Math.round(v);
    if (k < 1) requestAnimationFrame(step);
    else done && done();
  };
  requestAnimationFrame(step);
}
function sessionEndCeremony(home, data, reduced) {
  document.querySelectorAll(".cer-layer").forEach(n => n.remove());   // never stack ceremonies
  document.body.classList.add("in-ceremony");
  // hide the bar WITHOUT hideTabbar(): that helper also tears down the home atmo, which
  // must stay mounted (opacity-hidden) so the dissolve can refill it in place
  const bar = document.getElementById("tabbar"); if (bar) bar.classList.remove("show");
  const before = data.before, after = data.after, facts = data.facts || {};
  const moved = m => before[m] != null && after[m] != null && Math.round(before[m]) !== Math.round(after[m]);
  const anyMoved = ["readiness", "momentum", "retention"].some(moved);
  const emptyish = reduced || !anyMoved;               // no isolated-performance beat (§6b cases)
  const hero = home.querySelector(".hero");
  const cardR = home.querySelector("#sc-readiness"), cardM = home.querySelector("#sc-momentum"), cardT = home.querySelector("#sc-retention");
  const timers = [];
  const layer = el(`<div class="cer-layer">
    <div class="cer-tint"></div>
    <div class="cer-kicker">THAT'S THE SESSION</div>
    <div class="cer-panel">
      <div class="sfacts">${_sfactRows(facts)}</div>
      <button class="btn cer-cont quiet">Continue</button>
    </div>
  </div>`);
  // r17: Act 2 — the ledger writes itself after the dials finish; Continue promotes last.
  // r18/r19: Continue is LIVE from t=0 (secondary, outlined); early tap snaps to final.
  const factEls = [...layer.querySelectorAll(".sfact")];
  const contBtn = layer.querySelector(".cer-cont");
  if (!reduced) factEls.forEach(f => f.classList.add("pending"));
  // the ceremony reads its regions from home, never defines them: kicker fills the space
  // above the dials, the panel takes the space below them (the hidden tile/nav zone)
  const place = () => {
    const hr = hero ? hero.getBoundingClientRect() : { top: 180, bottom: 420 };
    layer.querySelector(".cer-kicker").style.height = Math.max(64, hr.top) + "px";
    layer.querySelector(".cer-panel").style.top = (hr.bottom + 6) + "px";
  };
  document.body.appendChild(layer);
  place();
  requestAnimationFrame(place);                         // re-measure once layout has settled
  timers.push(setTimeout(place, 350));                  // and again after fonts/atmo finish
  // band-crossing: the chip morphs mid-ceremony (also applied by snap-to-final)
  const applyBandFinal = () => {
    if (after.readiness == null) return;
    const b2 = readinessBand(after.readiness);
    const chip = cardR && cardR.querySelector(".band-chip");
    if (chip && chip.textContent !== b2.label) {
      const top = after.readiness >= 85;
      chip.className = `band-chip ${b2.cls}${top ? " crown just-crossed" : ""}`;
      chip.textContent = b2.label;
    }
    state.lastBandTop = after.readiness >= 85; save();
  };
  // Act 2: the ledger writes itself (quiet pop, 100ms steps), Continue's promotion last
  const act2 = start => {
    factEls.forEach((f, i) => timers.push(setTimeout(() => f.classList.add("in"), start + i * 100)));
    timers.push(setTimeout(() => contBtn.classList.add("in"), start + factEls.length * 100 + 150));
  };
  if (reduced) {                                        // ledger complete, Continue promoted, no stagger
    contBtn.classList.add("in");
  } else if (emptyish) {
    // no isolated-performance beat: dials settled, sides visible; deltas stay quiet (a
    // delta on a still dial reads as a contradiction — they arrive with home instead).
    // The ledger still writes itself, just without Act 1 to wait for.
    [cardM, cardT].forEach(c => { if (c) c.classList.remove("dial-pop"); });
    act2(350);
  } else {
    // Act 1, the performance: Readiness isolated ticking its delta, then the sides pop
    // into home's exact geometry and tick in turn (sequential composes)
    if (moved("readiness")) timers.push(setTimeout(() => _tickHomeDial(cardR, before.readiness, after.readiness, 900, applyBandFinal), 600));
    timers.push(setTimeout(() => cardM && cardM.classList.add("in"), 1700));
    timers.push(setTimeout(() => cardT && cardT.classList.add("in"), 1900));
    const sideTick = (card, metric, at, dur) => {
      if (!card) return;
      // a delta only appears under a dial that just performed; an unmoved dial keeps its
      // today-delta until home returns
      if (moved(metric)) timers.push(setTimeout(() => _tickHomeDial(card, before[metric], after[metric], dur, () => {
        const dd = card.querySelector(".dial-delta"); if (dd) dd.classList.add("show");
      }), at));
    };
    sideTick(cardM, "momentum", 2100, 700);
    sideTick(cardT, "retention", 2350, 500);
    act2(2950);
  }
  // r18: snap-to-final, idempotent — an early Continue skips the waiting, never the
  // information: dials render true final values, pop-ins/deltas complete, ledger shown
  let snapped = false;
  const setFinalDial = (card, metric) => {
    if (!card || after[metric] == null) return;
    const fg = card.querySelector(".ring-fg"), num = card.querySelector(".ring-num");
    if (fg) { fg.style.transition = "none"; fg.style.strokeDashoffset = (_RING_C * (1 - Math.max(0, Math.min(100, after[metric])) / 100)).toFixed(1); }
    if (num) num.firstChild.textContent = Math.round(after[metric]);
  };
  const snapFinal = () => {
    if (snapped) return; snapped = true;
    timers.forEach(clearTimeout);
    setFinalDial(cardR, "readiness"); setFinalDial(cardM, "momentum"); setFinalDial(cardT, "retention");
    [cardM, cardT].forEach(c => { if (c) c.classList.add("in"); });
    if (!emptyish) ["momentum", "retention"].forEach((m, i) => {
      const card = i === 0 ? cardM : cardT;
      if (moved(m) && card) { const dd = card.querySelector(".dial-delta"); if (dd) dd.classList.add("show"); }
    });
    applyBandFinal();
    factEls.forEach(f => f.classList.add("in"));
    contBtn.classList.add("in");
  };
  // Continue → Option D: snap to truth, then the world empties, the dials hold alone,
  // and home refills piece by piece
  layer.querySelector(".cer-cont").addEventListener("click", () => {
    if (layer.classList.contains("dissolving")) return;
    snapFinal();
    layer.classList.add("dissolving");                  // ceremony copy 600ms; tint drains 1200ms
    const speed = emptyish ? 0.5 : 1;                   // empty-ish sessions get the brisker dissolve
    const at = ms => Math.round(ms * speed);
    const back = sel => document.querySelectorAll(sel).forEach(n => n.classList.add("cer-back"));
    if (reduced) {                                      // single quick crossfade, no staged refill
      back(".home-atmo, .topbar, .home > :not(.hero)");
      showTabbar("home");
      const dw = document.getElementById("dw-today"); if (dw) dw.classList.add("show");
      setTimeout(() => { layer.remove(); document.body.classList.remove("in-ceremony"); maybeStatusMoment(); }, 250);
      return;
    }
    timers.push(setTimeout(() => back(".home-atmo, .topbar, .home .trip"), at(1000)));
    timers.push(setTimeout(() => back(".home .hero-tile"), at(1300)));
    timers.push(setTimeout(() => back(".home .practice"), at(1450)));
    timers.push(setTimeout(() => back(".home > *"), at(1600)));   // whisper lines, divergence, presence, banner
    timers.push(setTimeout(() => { back("#tabbar"); showTabbar("home"); }, at(1750)));
    timers.push(setTimeout(() => { const dw = document.getElementById("dw-today"); if (dw) dw.classList.add("show"); }, at(2150)));
    timers.push(setTimeout(() => { layer.remove(); document.body.classList.remove("in-ceremony"); maybeStatusMoment(); }, at(2750)));
  });
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
/* §education moment 1 — first score reveal (built to design/score-reveal.html). Fires ONCE, at session
   end before home, when Readiness first exists. Sequence: 600ms count-up + ring fill → band chip →
   forward-only journey preview (teaches the band colors wordlessly, never sweeps down through Low) →
   education copy → active dismissal: locating the pace mark IS the proof the model landed. */
const _revealBand = v => v >= 85 ? { c: "var(--green)", label: "Tripfluent", top: true }
  : v >= 65 ? { c: "var(--secondary)", label: "Strong", top: false }
  : v >= 40 ? { c: "var(--accent-2)", label: "Fair", top: false }
  : { c: "var(--text-dim)", label: "Low", top: false };
function _revealRing(fillVal, tickVal, showTick) {
  const C = 2 * Math.PI * 70, off = C * (1 - Math.max(0, Math.min(100, fillVal)) / 100);
  const a = (tickVal / 100) * 2 * Math.PI - Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
  const tx = 84 + 77.5 * ca, ty = 84 + 77.5 * sa;
  const b1x = 84 + 89 * ca - 5.5 * sa, b1y = 84 + 89 * sa + 5.5 * ca;
  const b2x = 84 + 89 * ca + 5.5 * sa, b2y = 84 + 89 * sa - 5.5 * ca;
  const hx = (84 + 84 * ca).toFixed(1), hy = (84 + 84 * sa).toFixed(1), n = Math.round(fillVal);
  return `<svg width="184" height="184" viewBox="-8 -8 184 184" id="rv-svg">
    <circle cx="84" cy="84" r="70" fill="none" stroke="var(--ring-track)" stroke-width="11"/>
    <circle cx="84" cy="84" r="70" fill="none" stroke="${_revealBand(fillVal).c}" stroke-width="11" stroke-linecap="round"
      stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 84 84)"/>
    ${showTick ? `<g id="rv-tick" style="cursor:pointer">
      <circle class="hintpulse" cx="${hx}" cy="${hy}" r="15" fill="none" stroke-width="2.5" style="transform-origin:${hx}px ${hy}px"/>
      <circle cx="${hx}" cy="${hy}" r="16" fill="transparent"/>
      <polygon points="${tx.toFixed(1)},${ty.toFixed(1)} ${b1x.toFixed(1)},${b1y.toFixed(1)} ${b2x.toFixed(1)},${b2y.toFixed(1)}" fill="var(--accent-2)" stroke-linejoin="round"/>
    </g>` : ""}
    <text x="84" y="84" text-anchor="middle" dominant-baseline="central" class="rv-num">${n}</text>
    <text x="${84 + String(n).length * 11.5}" y="72" text-anchor="start" class="rv-pct">%</text>
  </svg>`;
}
function scoreRevealCard() {
  const s = state.scoresCache || computeScores();
  const VAL = Math.max(0, Math.min(100, Math.round(s.readiness || 0)));
  const g = _glideToday();
  // at first reveal the glide path has only just begun, so its target sits at/below a fresh score;
  // fall back to a modest offset so the mark reads as a separate thing to find.
  const TICK = g != null ? g : Math.max(0, VAL - 9);
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  clearHomeAtmo(); hideTabbar(); if (typeof clearFooter === "function") clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const card = el(`<div class="reveal">
    <div class="reveal-kicker">YOUR TRIP READINESS</div>
    <div class="reveal-ring" id="rv-ring"></div>
    <span class="band-chip" id="rv-band"></span>
    <div class="reveal-edu" id="rv-edu">
      <p>Readiness measures your preparation for this trip. It reflects where you are <b>today</b>: it climbs with practice and fades with time.</p>
      <p>The <span class="rv-gold">gold mark</span> is your pace. Stay ahead of it and you'll land <b>Tripfluent</b>.</p>
    </div>
    <div class="reveal-rep" id="rv-rep">
      <div class="reveal-prompt">Tap your pace mark to continue</div>
      <div class="reveal-done" id="rv-done"></div>
    </div>
    <div class="hintring" id="rv-hint"></div>
  </div>`);
  app.appendChild(card);
  const ring = card.querySelector("#rv-ring");
  let answered = false;
  const setChip = v => {
    const b = _revealBand(v), chip = card.querySelector("#rv-band");
    chip.textContent = b.label; chip.style.color = b.c; chip.classList.toggle("crown", b.top);
  };
  const finishReveal = () => {
    ring.innerHTML = _revealRing(VAL, TICK, true); setChip(VAL); wireTick();
    card.querySelector("#rv-edu").classList.add("show");
    setTimeout(() => { card.querySelector("#rv-rep").classList.add("show"); card.classList.add("await"); }, 400);
  };
  const done = () => {
    state.scoreRevealSeen = true; save();
    renderHome();
  };
  function wireTick() {
    const svg = card.querySelector("#rv-svg"), target = card.querySelector("#rv-tick");
    if (!target) return;
    target.addEventListener("click", e => {
      e.stopPropagation(); if (answered) return; answered = true;
      card.classList.remove("await");                       // the pulse stops once its action is answered
      card.querySelector("#rv-hint").classList.remove("show");
      card.querySelector("#rv-done").textContent = "That's your pace.";
      haptic("correct");
      setTimeout(done, 900);
    });
    svg.addEventListener("click", () => {                   // wrong-area tap: halo the mark, never fail
      if (answered) return;
      const a = (TICK / 100) * 2 * Math.PI - Math.PI / 2;
      const rw = ring.getBoundingClientRect(), sc = card.getBoundingClientRect();
      const h = card.querySelector("#rv-hint");
      h.style.left = (rw.left - sc.left + (rw.width - 184) / 2 + 92 + 84 * Math.cos(a) - 17) + "px";
      h.style.top = (rw.top - sc.top + 92 + 84 * Math.sin(a) - 17) + "px";
      h.classList.add("show");
    });
  }
  if (reduce) {                                             // instant render, static halo, no journey
    ring.innerHTML = _revealRing(VAL, TICK, true); setChip(VAL); wireTick();
    ["#rv-edu", "#rv-rep"].forEach(sel => card.querySelector(sel).classList.add("show"));
    card.querySelector("#rv-band").classList.add("show");
    card.classList.add("await");
    return;
  }
  const tween = (from, to, dur, cb) => {
    const t0 = performance.now();
    const f = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3), v = from + (to - from) * e;
      ring.innerHTML = _revealRing(v, TICK, true); setChip(v);
      if (p < 1) requestAnimationFrame(f); else cb && cb();
    };
    requestAnimationFrame(f);
  };
  // journey preview: forward-only through the bands ahead, then settle home
  const journey = () => tween(VAL, 72, 380, () => setTimeout(() =>
    tween(72, 91, 380, () => setTimeout(() =>
      tween(91, VAL, 420, finishReveal), 750)), 550));
  const t0 = performance.now(), DUR = 600;                  // count-up + fill together
  const frame = t => {
    const p = Math.min(1, (t - t0) / DUR), e = 1 - Math.pow(1 - p, 3);
    ring.innerHTML = _revealRing(VAL * e, TICK, p === 1);
    if (p < 1) requestAnimationFrame(frame);
    else {
      setChip(VAL);
      setTimeout(() => card.querySelector("#rv-band").classList.add("show"), 150);
      setTimeout(journey, 850);
    }
  };
  requestAnimationFrame(frame);
}
// session end → home, unless the first-reveal card is still owed (fires once).
// A completed session carries its ceremony data (§6b); the reveal card outranks it once.
function goHomeAfterSession() {
  const s = state.scoresCache || computeScores();
  if (!state.scoreRevealSeen && s && (s.lifetimeSessions || 0) >= 1 && (s.readiness || 0) > 0) return scoreRevealCard();
  const se = (typeof run !== "undefined" && run && run.sessionEnd) ? run.sessionEnd : null;
  if (se) { run.sessionEnd = null; return renderHome({ ceremony: se }); }
  renderHome();
}
// §detail-view: the Readiness ring opens the rich instrument sheet (design/readiness-detail.html);
// Momentum/Retention keep the simpler generic sheet below until they get their own artifacts.
const _paceTriSVG = `<svg width="14" height="16" viewBox="0 0 14 16"><polygon points="13,8 1,1 1,15" fill="var(--accent-2)"/></svg>`;
const _sparkSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>`;
function readinessSheet() {
  const s = state.scoresCache || computeScores();
  document.querySelectorAll(".sheet-wrap").forEach(n => n.remove());
  const band = readinessBand(s.readiness);
  const held = s.readiness >= 85;
  const glide = _glideToday();
  // pace row: held (>=85) > ahead/behind vs the glide target > nothing (no honest pace yet)
  let pace = "";
  if (held) {
    pace = `<div class="rd-pace ahead"><span class="rd-tri">${_paceTriSVG}</span><span class="rd-ptxt"><b>Holding Tripfluent</b><span class="rd-psub">Light upkeep keeps you there through landing day.</span></span></div>`;
  } else if (glide != null) {
    const pts = Math.round(s.readiness - glide);
    pace = pts >= 0
      ? `<div class="rd-pace ahead"><span class="rd-tri">${_paceTriSVG}</span><span class="rd-ptxt"><b>${pts} pts ahead of pace</b><span class="rd-psub">The gold mark is where the glide path says you'd be today.</span></span></div>`
      : `<div class="rd-pace behind"><span class="rd-tri">${_paceTriSVG}</span><span class="rd-ptxt"><b>${Math.abs(pts)} pts behind pace. A session today closes most of it.</b></span></div>`;
  }
  const drivers = [
    { name: "Coverage", val: s.coverage, key: "coverage", color: "var(--secondary)", desc: "How much of your trip's moments you've learned." },
    { name: "Retention", val: s.retention, key: "retention", color: "var(--secondary)", desc: "How well it's sticking when we check." },
    { name: "Recency", val: s.recency, key: "recency", color: "var(--accent)", desc: "How fresh it all is right now. Fades fastest, recovers fastest." }
  ];
  const driverHtml = drivers.map(d => {
    const tr = scoreTrend(d.key, 7), delta = tr ? Math.round(tr.delta) : null;
    const dHtml = (delta != null && delta !== 0) ? ` <span class="rd-d ${delta > 0 ? "up" : "down"}">${delta > 0 ? "+" : ""}${delta}</span>` : "";
    const w = Math.max(0, Math.min(100, Math.round(d.val)));
    return `<div class="rd-driver">
      <div class="rd-drow"><span class="rd-dname">${d.name}</span><span class="rd-dval">${Math.round(d.val)}${dHtml}</span></div>
      <div class="rd-bar"><div style="background:${d.color}" data-w="${w}"></div></div>
      <div class="rd-desc">${d.desc}</div>
    </div>`;
  }).join("");
  const moves = held ? "Reviews alone hold this. New material is a bonus now." : `A session today moves <b>Recency</b> most.`;
  const wrap = el(`<div class="sheet-wrap">
    <div class="sheet-backdrop"></div>
    <div class="sheet rd-sheet">
      <div class="sheet-grab"></div>
      <div class="rd-head"><span class="rd-title">TRIP READINESS</span><span class="rd-asof">today</span></div>
      <div class="rd-scorerow"><span class="rd-num">${s.readiness}<span class="rd-pct">%</span></span><span class="band-chip ${band.cls}${held ? " crown" : ""}">${band.label}</span></div>
      ${pace}
      <div class="rd-dlabel">WHAT'S DRIVING IT</div>
      ${driverHtml}
      <div class="rd-moves"><span class="rd-spark">${_sparkSVG}</span><span>${moves}</span></div>
    </div>
  </div>`);
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("show"));
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.querySelectorAll(".rd-bar > div").forEach(b => b.style.width = b.dataset.w + "%")));
  wrap.querySelector(".sheet-backdrop").addEventListener("click", closeSheet);
}
function scoreSheet(which) {
  if (which === "readiness") return readinessSheet();
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
    return { kind: "lesson", lesson: next, title: `Start: ${next.title}`, sub: dv && dv.kind === "cover" ? `${destInfo(p.destination).label} needs more, ${dv.untouched} categories untouched` : next.topic, run: () => startLesson(next) };
  return { kind: "caught", title: "You're ahead, up for a speed round?", run: () => startSpeedRound() };   // §7.6 pure fun, advances nothing
}
function heroTile() {
  const h = heroState();
  // §3.2 fade tile: a navy block with the session photo bleeding in from the right (the lesson's primer
  // photo double-duty; other actions get a warm destination default). Kicker replaces the old color-coding.
  const kicker = { cram: "Countdown", review: "Review", momentum: "Keep it going", lesson: "Next session", caught: "You're ahead" }[h.kind] || "Next up";
  const photo = (typeof introPhoto === "function") ? introPhoto(h.lesson || {}) : "";
  const t = el(`<button class="hero-tile hero-${h.kind}">
    ${photo ? `<div class="hero-img" style="background-image:url('${photo}')" aria-hidden="true"></div>` : ""}
    <div class="hero-inner">
      <div class="hero-k">${kicker}</div>
      <div class="hero-title">${h.title}</div>
      ${h.sub ? `<div class="hero-sub">${h.sub}</div>` : ""}
    </div></button>`);
  t.addEventListener("click", h.run);
  return t;
}

/* §3.2.4 — quiet Practice chooser (replaces the Due/Mistakes tiles §3.3 kills). One secondary
   button → a sheet with Recommended / By scenario / Weakest phrases. */
// action-stack escalation thresholds (design/home-action-stack.html; all [tune])
const PRACTICE_BADGE_DUE = 3;    // [tune] due count where the quiet row gains its gold badge
const PRACTICE_URGENT_DUE = 12;  // [tune] due count where the row wears urgency outright
const PRACTICE_URGENT_SAG = 6;   // [tune] lower urgency bar when Retention sagged today
function practiceButton() {
  // §3.2 bordered-row pattern (design/home-action-stack.html): the row is a MENU and never
  // swaps contents with the tile (grammar rule); prominence escalates IN PLACE with the
  // due queue — quiet → count badge → urgent field (+ one-time arrival breath).
  const due = dueForReview().length;
  const fading = (typeof fadingItems === "function") ? fadingItems().filter(f => f.strength < RETENTION_FADE).length : 0;
  const sag = _todayDelta("retention") < 0;
  const urgent = due >= PRACTICE_URGENT_DUE || (sag && due >= PRACTICE_URGENT_SAG);
  const badge = urgent || due >= PRACTICE_BADGE_DUE;
  // artifact copy: the due badge counts the queue ("8 due"); the urgent badge names the
  // urgency ("12 fading") — falls back to the due count if nothing is technically fading
  const badgeText = urgent && fading > 0 ? fading + " fading" : due + " due";
  const b = el(`<button class="practice${urgent ? " urgent" : ""}" role="button">
    <span class="ic"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span>
    <span class="lbl">Practice</span>
    ${badge ? `<span class="pbadge">${badgeText}</span>` : ""}
    <span class="chev"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
  </button>`);
  // arrival breath: fires only when the threshold is NEWLY crossed (urgency announces
  // itself once, never loops); the crossing is persisted so re-renders stay still
  const prom = urgent ? "urgent" : badge ? "badge" : "quiet";
  if (urgent && state.practiceProm !== "urgent") b.classList.add("arrive");
  if (state.practiceProm !== prom) { state.practiceProm = prom; save(); }
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

/* §3.2 insight line: a gold spark + one short "how far you've come" delta (green num). Only the
   encouraging case — a positive 2-week Readiness move; silence otherwise (never a negative nudge). */
function insightLine() {
  const tr = (typeof scoreTrend === "function") ? scoreTrend("readiness", 14) : null;
  if (!tr || tr.delta <= 0) return null;
  return el(`<div class="whisper"><span class="spark"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg></span><span>Your last 2 weeks moved Readiness <span class="num">+${tr.delta}</span></span></div>`);
}

/* §3.2 destination presence: a quiet line with the destination's LOCAL time (tz math, free).
   Temperature is optional until the cached weather fetch lands (§3.2) — omitted for now, not faked. */
function presenceLine() {
  const di = destInfo((state.profile || {}).destination);
  if (!di || !di.tz) return null;
  let t;
  try { t = new Intl.DateTimeFormat("en-US", { timeZone: di.tz, hour: "numeric", minute: "2-digit" }).format(new Date()).replace(" ", "").toLowerCase(); }
  catch (e) { return null; }
  return el(`<div class="presence on"><span class="dot"></span><span>${t} in ${di.label}</span></div>`);
}
