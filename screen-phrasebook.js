/* ============================== PHRASEBOOK (saved + dictionary + keyword threads) ============================== */
let _pbFilter = "";
let _pbSavedOnly = false;
let _pbThread = null;        // active keyword "thread" — show every phrase that uses this word (§6.2)
let _pbOpen = new Set();     // expanded section ids (a search expands everything temporarily)
function isSaved(es) { return (state.saved || []).includes(es); }
function toggleSave(es) {
  state.saved = state.saved || [];
  const i = state.saved.indexOf(es);
  i >= 0 ? state.saved.splice(i, 1) : state.saved.push(es);
  save();
}
// keyword -> [items] across the active deck. A "thread" is a keyword shared by ≥2 phrases.
function buildKwIndex() {
  const idx = new Map();
  DECK.stages.forEach(st => st.lessons.forEach(les => les.items.forEach(it =>
    (it.keywords || []).forEach(k => { if (!idx.has(k)) idx.set(k, []); idx.get(k).push(it); }))));
  return idx;
}
// §3.1: the phrase reference is no longer a tab — it renders as a view inside Learn. This appends
// the search + All/Saved toggle + list into a given container and wires everything.
function phrasebookBody(wrap) {
  const search = el(`<input class="text-input" placeholder="Search phrases…" autocapitalize="off" value="${_pbFilter}">`);
  wrap.appendChild(search);
  const seg = el(`<div class="pb-seg">
    <button class="pill ${_pbSavedOnly ? "" : "on"}" data-s="all">All</button>
    <button class="pill ${_pbSavedOnly ? "on" : ""}" data-s="saved">${icon('bookmark', 15)} Saved (${(state.saved || []).length})</button>
  </div>`);
  wrap.appendChild(seg);
  const list = el(`<div id="pb-list"></div>`);
  wrap.appendChild(list);

  const kwIndex = buildKwIndex();
  const threadCount = k => (kwIndex.get(k) || []).length;

  // one phrase row, with its recurring-keyword chips (tap a chip to open that word's thread)
  function phraseRow(it) {
    const kws = (it.keywords || []).filter(k => threadCount(k) >= 2);
    const chips = kws.map(k => `<button class="pb-kw ${k === _pbThread ? "on" : ""}" data-kw="${k}">${k}<span class="pb-kw-n">${threadCount(k)}</span></button>`).join("");
    const row = el(`<div class="pb-row">
      <span class="pb-speak-mount"></span>
      <div class="pb-text"><div class="pb-es">${it.es}</div><div class="pb-en">${it.en}</div>${chips ? `<div class="pb-kws">${chips}</div>` : ""}</div>
      <button class="pb-save ${isSaved(it.es) ? "on" : ""}" aria-label="Save">${icon("bookmark", 20)}</button>
    </div>`);
    row.querySelector(".pb-speak-mount").replaceWith(audioControl(() => speak(it.es)));
    row.querySelector(".pb-save").addEventListener("click", () => { toggleSave(it.es); draw(); refreshSeg(); });
    row.querySelectorAll(".pb-kw").forEach(c => c.addEventListener("click", () => {
      _pbThread = c.dataset.kw; _pbFilter = ""; search.value = ""; draw();
    }));
    return row;
  }

  function draw() {
    list.innerHTML = "";

    // ---- thread view: every phrase that uses the tapped keyword, flat ----
    if (_pbThread) {
      const fam = kwIndex.get(_pbThread) || [];
      const banner = el(`<div class="pb-thread">
        <button class="pb-thread-back" aria-label="Back">${icon("caret-left", 18)}</button>
        <span class="pb-thread-t">Phrases with <b>${_pbThread}</b></span>
        <span class="pb-count">${fam.length}</span></div>`);
      banner.querySelector(".pb-thread-back").addEventListener("click", () => { _pbThread = null; draw(); });
      list.appendChild(banner);
      fam.forEach(it => list.appendChild(phraseRow(it)));
      return;
    }

    // ---- normal grouped view ----
    const q = norm(_pbFilter);
    let count = 0;
    DECK.stages.forEach(st => st.lessons.forEach(les => {
      const items = les.items.filter(it => {
        if (_pbSavedOnly && !isSaved(it.es)) return false;
        if (!q) return true;
        return norm(it.es).includes(q) || norm(it.en).includes(q);
      });
      if (!items.length) return;
      count += items.length;
      const open = q ? true : _pbOpen.has(les.id);                 // a search expands every matching section
      const header = el(`<button class="pb-group ${open ? "open" : ""}">
        <span class="pb-caret">${icon("caret-right", 16)}</span>
        <span class="pb-gtitle">${les.title}</span>
        <span class="pb-count">${items.length}</span></button>`);
      const rows = el(`<div class="pb-rows ${open ? "" : "collapsed"}"></div>`);
      items.forEach(it => rows.appendChild(phraseRow(it)));
      header.addEventListener("click", () => { _pbOpen.has(les.id) ? _pbOpen.delete(les.id) : _pbOpen.add(les.id); draw(); });
      list.appendChild(header); list.appendChild(rows);
    }));
    if (!count) list.appendChild(el(`<p class="onb-dim" style="margin-top:20px">${_pbSavedOnly ? "No saved phrases yet, tap the bookmark on any phrase to keep it here." : "No matches."}</p>`));
  }
  function refreshSeg() { const b = seg.querySelector('[data-s="saved"]'); if (b) b.innerHTML = `${icon('bookmark', 15)} Saved (${(state.saved || []).length})`; }

  search.addEventListener("input", () => { _pbFilter = search.value; _pbThread = null; draw(); });
  seg.querySelectorAll(".pill").forEach(b => b.addEventListener("click", () => {
    _pbSavedOnly = b.dataset.s === "saved"; _pbThread = null;
    seg.querySelectorAll(".pill").forEach(x => x.classList.toggle("on", x === b));
    draw();
  }));
  draw();
}
