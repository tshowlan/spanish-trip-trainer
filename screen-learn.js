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


/* §3.1 Learn = three views (design/learn-tab.html, decisions 2026-07-18):
   Journey (chaptered spine) | Topics (coverage AS the drill entry) | Phrases (reference). */
let _learnView = "journey";

// one-line narrative beat for a lesson row, sourced from primer data (first sentence of the scene)
function _lessonBeat(l) {
  if (l.beat) return l.beat;
  const sc = l.primer && l.primer.scene;
  if (!sc) return "";
  const first = (sc.split(". ")[0] || sc).trim();
  const s = /[.!?]$/.test(first) ? first : first + ".";
  return s.length > 74 ? s.slice(0, 71).trim() + "…" : s;
}
// pattern machines read by their NAME (frame-shaped title) — no glyph (decisions 2026-07-18)
function _isMachine(l) { return !!l.machine; }

function _lessonRow(l, isNext) {
  const str = lessonStrength(l);
  const fading = lessonDone(l.id) ? lessonFadingCount(l) : 0;
  const beat = _lessonBeat(l);
  const meta = _isMachine(l) ? `Pattern · ${(l.items || []).length} fillers`
    : l.chain ? "Conversation" : `${(l.items || []).length} phrases`;
  const row = el(`<div class="lesson${isNext ? " next" : ""}">
    ${str != null ? strengthRing(str) : `<span class="caret-new">${icon("caret-right", 13)}</span>`}
    <div class="lmain">
      <div class="lname-row"><span class="lname">${l.title}</span>${isNext ? `<span class="next-tag">NEXT</span>` : ""}${l.bonus ? `<span class="bonus-tag">BONUS</span>` : ""}</div>
      ${beat ? `<div class="lbeat">${beat}</div>` : ""}
      <div class="lmeta">${meta}${fading ? ` · <span class="fading">${fading} to review</span>` : ""}</div>
    </div>
    <span class="chev">${icon("caret-right", 15)}</span>
  </div>`);
  row.addEventListener("click", () => startLesson(l));
  return row;
}

// passes render as chapters (learning spec §1b.2); Stage 0 is Chapter 0 once content exists.
// Later chapters SOFT-gate: dimmed with invitation copy, browsable, never barred.
function _journeyView(scroll) {
  const recId = (typeof recommendedLessonId === "function") ? recommendedLessonId() : null;
  const stages = (typeof DECK !== "undefined" && DECK) ? DECK.stages : [];
  let cur = stages.findIndex(st => st.lessons.some(l => !l.bonus && !lessonDone(l.id)));
  if (cur < 0) cur = stages.length - 1;
  stages.forEach((st, i) => {
    const visible = st.lessons.filter(l => !l.bonus);
    const done = visible.filter(l => lessonDone(l.id)).length;
    // started chapters never dim (migration plan, ratification pending): the map never points an
    // active learner backward; machines reach existing users through the composer's weave instead.
    const started = st.lessons.some(l => lessonDone(l.id) || (l.items || []).some(it => { const s = state.learn && state.learn[it.id]; return s && s.exposures >= 1; }));
    const locked = i > cur && !started;
    const chap = el(`<div class="chapter${locked ? " locked" : ""}"></div>`);
    chap.appendChild(el(`<div class="chap-head">
      <div class="chap-kicker">CHAPTER ${st.pass != null ? st.pass : i}</div>
      <div class="chap-row"><span class="chap-title">${st.title}</span><span class="chap-whisper">${done} of ${visible.length}</span></div>
      ${st.blurb ? `<div class="chap-blurb">${st.blurb}</div>` : ""}
    </div>`));
    st.lessons.forEach(l => chap.appendChild(_lessonRow(l, l.id === recId)));
    if (locked && stages[cur]) {
      chap.appendChild(el(`<div class="lock-hint">${icon("lock-simple", 12)}<span>Best after ${stages[cur].title}. You can peek anytime.</span></div>`));
    }
    scroll.appendChild(chap);
  });
}

// coverage display and topic-drill action are ONE surface: a row names the topic, shows why,
// and IS the entry into Practice prefiltered to that scenario (decisions 2026-07-18).
function _topicsView(scroll) {
  const cats = (typeof coverageCats === "function") ? coverageCats() : {};
  const keys = Object.keys(cats).filter(c => cats[c].seen > 0)
    .sort((a, b) => (cats[b].credit / cats[b].total) - (cats[a].credit / cats[a].total));
  scroll.appendChild(el(`<div class="topics-intro">Your coverage by topic. Tap any topic to practice it.</div>`));
  if (!keys.length) { scroll.appendChild(el(`<p class="onb-dim">Finish a lesson and your topics show up here.</p>`)); return; }
  keys.forEach(c => {
    const e = cats[c], pct = Math.round((e.credit / e.total) * 100), fading = _catFading(c);
    const band = pct >= 65 ? "t-strong" : pct >= 40 ? "t-fair" : "t-low";
    const label = pct >= 65 ? "Strong" : pct >= 40 ? "Fair" : "Low";
    const row = el(`<div class="topic ${band}" role="button">
      <div class="tmain">
        <div class="trow"><span class="tname">${c}</span><span class="tpct">${pct}%</span></div>
        <div class="tbar"><i style="width:${pct}%"></i></div>
        <div class="tsub">${label}${fading ? ` · <span class="fading">${fading} fading</span>` : ""}</div>
      </div>
      <span class="chev">${icon("caret-right", 15)}</span>
    </div>`);
    row.addEventListener("click", () => { const its = itemsInCategory(c); if (its.length) startReview(its); });
    scroll.appendChild(row);
  });
}

function renderLearn() {
  showTabbar("learn");
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen tab-screen learn"></div>`);
  const head = el(`<div class="learn-head">
    <div class="learn-title">Learn</div>
    <div class="segs">
      <button class="seg${_learnView === "journey" ? " active" : ""}" data-v="journey">Journey</button>
      <button class="seg${_learnView === "topics" ? " active" : ""}" data-v="topics">Topics</button>
      <button class="seg${_learnView === "phrases" ? " active" : ""}" data-v="phrases">Phrases</button>
    </div>
  </div>`);
  head.querySelectorAll(".seg").forEach(b => b.addEventListener("click", () => { _learnView = b.dataset.v; renderLearn(); }));
  wrap.appendChild(head);
  const scroll = el(`<div class="learn-scroll"></div>`);
  if (_learnView === "phrases") phrasebookBody(scroll);
  else if (_learnView === "topics") _topicsView(scroll);
  else _journeyView(scroll);
  wrap.appendChild(scroll);
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
