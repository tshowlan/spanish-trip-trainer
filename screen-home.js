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

  const hero = el(`<div class="hero">
    <div class="brandline">${wordmark(26)}<span class="lang-flag">${d.flag}</span></div>
  </div>`);

  if (!started) {
    hero.appendChild(el(`<div class="empty-hero">Complete your first lesson to start your Trip Readiness score.</div>`));
  } else {
    const scores = el(`<div class="scores">
      <button class="ring-card big ${band.cls}" id="sc-readiness">
        <div class="ring-wrap">${ringSVG(s.readiness, band.cls)}
          <div class="ring-center"><div class="ring-num" data-to="${s.readiness}">0<span class="pct">%</span></div></div>
        </div>
        <div class="ring-band">${band.label}</div>
        ${days !== null ? `<div class="ring-days">${days} days out</div>` : `<div class="ring-days set-date">Set your trip date</div>`}
        ${s.lifetimeSessions < 5 ? `<div class="ring-sub">Establishing baseline</div>` : ``}
      </button>
      <div class="mini-rings">
        <button class="ring-card mini m-momentum" id="sc-momentum">
          <div class="ring-wrap">${ringSVG(s.momentum, "m-momentum")}
            <div class="ring-center"><div class="ring-num" data-to="${s.momentum}">0</div></div>
          </div>
          <div class="ring-label">Momentum</div>
        </button>
        <button class="ring-card mini m-retention" id="sc-retention">
          <div class="ring-wrap">${ringSVG(s.retention, "m-retention")}
            <div class="ring-center"><div class="ring-num" data-to="${s.retention}">0</div></div>
          </div>
          <div class="ring-label">Retention</div>
        </button>
      </div>
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
  let title, drivers, cta = null;
  if (which === "readiness") {
    title = "Trip Readiness";
    drivers = [`Coverage ${s.coverage}`, `Retention ${s.retention}`, `Last practiced ${_recencyText()}`];
  } else if (which === "momentum") {
    title = "Momentum";
    drivers = [`${s.activeDays7} of 5 active days`, `${s.sessions7} sessions this week`];
  } else {
    title = "Retention";
    const fade = fadingLessons().filter(x => x.strength < 60);
    drivers = fade.length ? [`${fade.length} scenario${fade.length === 1 ? "" : "s"} fading`] : ["Everything's holding strong"];
    if (fade.length) cta = { label: "Review the weakest scenario", fn: () => { const l = findLesson(fade[0].id); if (l) { closeSheet(); startLesson(l); } } };
  }
  const wrap = el(`<div class="sheet-wrap">
    <div class="sheet-backdrop"></div>
    <div class="sheet">
      <div class="sheet-grab"></div>
      <div class="sheet-title">${title}</div>
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
