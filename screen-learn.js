/* ============================== LEARN (content library) ==============================
   Scores spec §3.1: the content library, relocated off Home. Scenario-category coverage
   at the top, then the lesson map (Survival/Comfort/Fluent). Per-lesson three-star ratings
   are replaced by a strength ring that decays and restores like everything else (§3.3). */

// mean current strength across a lesson's seen phrases; null = not started yet
function lessonStrength(l) {
  const ss = (l.items || []).map(it => { const s = state.learn && state.learn[it.id]; return (s && s.exposures >= 1) ? itemStrength(s) : null; }).filter(x => x != null);
  return ss.length ? Math.round(ss.reduce((a, b) => a + b, 0) / ss.length) : null;
}
// compact strength ring (native vocabulary for "how solid is this", replaces arcade stars)
function strengthRing(pct) {
  const r = 15, C = 2 * Math.PI * r, off = C * (1 - Math.max(0, Math.min(100, pct)) / 100);
  const band = pct >= 80 ? "band-top" : pct >= 55 ? "band-good" : pct >= 30 ? "band-mid" : "band-low";
  return `<svg class="ls-ring ${band}" viewBox="0 0 36 36" width="30" height="30" aria-hidden="true">
    <circle class="ls-bg" cx="18" cy="18" r="${r}"/>
    <circle class="ls-fg" cx="18" cy="18" r="${r}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 18 18)"/>
  </svg>`;
}

let _learnView = "library";   // §3.1: Learn hosts two views — the lesson library and the phrase reference
function renderLearn() {
  showTabbar("learn");
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen tab-screen"></div>`);
  wrap.appendChild(el(`<div class="screen-head"><h2>Learn</h2></div>`));

  const seg = el(`<div class="pb-seg" style="margin-top:0">
    <button class="pill ${_learnView === "library" ? "on" : ""}" data-v="library">Library</button>
    <button class="pill ${_learnView === "phrases" ? "on" : ""}" data-v="phrases">Phrases</button>
  </div>`);
  seg.querySelectorAll(".pill").forEach(b => b.addEventListener("click", () => { _learnView = b.dataset.v; renderLearn(); }));
  wrap.appendChild(seg);

  if (_learnView === "phrases") { phrasebookBody(wrap); app.appendChild(wrap); return; }

  // §3.1 per-category strength-aware coverage ("Restaurant · 82% strong · 3 fading")
  const cats = (typeof coverageCats === "function") ? coverageCats() : {};
  const catKeys = Object.keys(cats).filter(c => cats[c].seen > 0).sort((a, b) => (cats[b].credit / cats[b].total) - (cats[a].credit / cats[a].total));
  if (catKeys.length) {
    const strip = el(`<div class="cat-cover"></div>`);
    catKeys.forEach(c => {
      const e = cats[c], strong = Math.round((e.credit / e.total) * 100);
      const fading = _catFading(c);
      const band = strong >= 80 ? "band-top" : strong >= 55 ? "band-good" : strong >= 30 ? "band-mid" : "band-low";
      strip.appendChild(el(`<div class="cat-row">
        <div class="cat-name">${c}</div>
        <div class="cat-bar"><i class="${band}" style="width:${strong}%"></i></div>
        <div class="cat-meta"><span class="${band}">${strong}%</span>${fading ? ` · ${fading} fading` : ""}</div>
      </div>`));
    });
    wrap.appendChild(el(`<div class="q-head">Your coverage</div>`));
    wrap.appendChild(strip);
  }

  // the lesson map (relocated from Home)
  const recId = (typeof recommendedLessonId === "function") ? recommendedLessonId() : null;
  const passName = { 1: "Survival", 2: "Comfort", 3: "Fluent" };
  (DECK ? DECK.stages : []).forEach(st => {
    const visible = st.lessons.filter(l => !l.bonus);
    const total = visible.length || 1;
    const done = visible.filter(l => lessonDone(l.id)).length;
    const stage = el(`<div class="stage"></div>`);
    stage.appendChild(el(`
      <div class="stage-head"><h2>${st.title}</h2><span class="blurb">${st.blurb}</span></div>
      <div class="stage-bar"><i style="width:${Math.round(done / total * 100)}%"></i></div>`));
    const list = el(`<div class="lessons"></div>`);
    st.lessons.forEach(l => {
      const isDone = lessonDone(l.id);
      const isRec = l.id === recId;
      const fading = isDone ? lessonFadingCount(l) : 0;
      const str = lessonStrength(l);
      const chip = l.bonus ? `<span class="tier-chip bonus">Bonus</span>`
        : (st.pass ? `<span class="tier-chip p${st.pass}">${passName[st.pass]}</span>` : "");
      const card = el(`
        <div class="lesson ${isDone ? "done" : ""} ${isRec ? "rec" : ""}">
          <div class="badge">${str != null ? strengthRing(str) : `<span class="badge-new">${icon('caret-right', 18)}</span>`}</div>
          <div class="meta">
            <div class="t">${l.title}${isRec ? ` <span class="rec-tag">Next</span>` : ""}</div>
            <div class="s">${chip ? chip + " · " : ""}${l.chain ? "Conversation" : `${l.items.length} phrases`}${fading ? ` · <span class="fade-badge">${fading} to review</span>` : ""}</div>
          </div>
          <div class="chev">${icon('caret-right', 18)}</div>`);
      card.addEventListener("click", () => startLesson(l));
      list.appendChild(card);
    });
    stage.appendChild(list);
    wrap.appendChild(stage);
  });
  app.appendChild(wrap);
}
// phrases fading in a category (seen but below the review threshold)
function _catFading(cat) {
  let n = 0;
  (DECK ? DECK.stages : []).forEach(st => st.lessons.forEach(l => {
    if (categoryOf(l.topic) !== cat) return;
    l.items.forEach(it => { const s = state.learn && state.learn[it.id]; if (s && s.exposures >= 1 && itemStrength(s) < 55) n++; });
  }));
  return n;
}
