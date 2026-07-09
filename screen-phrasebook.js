/* ============================== PHRASEBOOK (saved + dictionary) ============================== */
let _pbFilter = "";
let _pbSavedOnly = false;
let _pbOpen = new Set();     // expanded section ids (a search expands everything temporarily)
function isSaved(es) { return (state.saved || []).includes(es); }
function toggleSave(es) {
  state.saved = state.saved || [];
  const i = state.saved.indexOf(es);
  i >= 0 ? state.saved.splice(i, 1) : state.saved.push(es);
  save();
}
function renderPhrasebook() {
  showTabbar("phrases");
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen tab-screen"></div>`);
  wrap.appendChild(el(`<div class="screen-head"><h2>Phrasebook</h2></div>`));

  const search = el(`<input class="text-input" placeholder="Search phrases…" autocapitalize="off" value="${_pbFilter}">`);
  wrap.appendChild(search);
  const seg = el(`<div class="pb-seg">
    <button class="pill ${_pbSavedOnly ? "" : "on"}" data-s="all">All</button>
    <button class="pill ${_pbSavedOnly ? "on" : ""}" data-s="saved">★ Saved (${(state.saved || []).length})</button>
  </div>`);
  wrap.appendChild(seg);
  const list = el(`<div id="pb-list"></div>`);
  wrap.appendChild(list);
  app.appendChild(wrap);

  function draw() {
    const q = norm(_pbFilter);
    list.innerHTML = "";
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
      items.forEach(it => {
        const row = el(`<div class="pb-row">
          <button class="pb-speak" aria-label="Play">🔊</button>
          <div class="pb-text"><div class="pb-es">${it.es}</div><div class="pb-en">${it.en}</div></div>
          <button class="pb-save ${isSaved(it.es) ? "on" : ""}" aria-label="Save">${icon("bookmark", 20)}</button>
        </div>`);
        row.querySelector(".pb-speak").addEventListener("click", () => speak(it.es));
        row.querySelector(".pb-save").addEventListener("click", () => { toggleSave(it.es); draw(); refreshSeg(); });
        rows.appendChild(row);
      });
      header.addEventListener("click", () => { _pbOpen.has(les.id) ? _pbOpen.delete(les.id) : _pbOpen.add(les.id); draw(); });
      list.appendChild(header); list.appendChild(rows);
    }));
    if (!count) list.appendChild(el(`<p class="onb-dim" style="margin-top:20px">${_pbSavedOnly ? "No saved phrases yet — tap the bookmark on any phrase to keep it here." : "No matches."}</p>`));
  }
  function refreshSeg() { const b = seg.querySelector('[data-s="saved"]'); if (b) b.textContent = `★ Saved (${(state.saved || []).length})`; }

  search.addEventListener("input", () => { _pbFilter = search.value; draw(); });
  seg.querySelectorAll(".pill").forEach(b => b.addEventListener("click", () => {
    _pbSavedOnly = b.dataset.s === "saved";
    seg.querySelectorAll(".pill").forEach(x => x.classList.toggle("on", x === b));
    draw();
  }));
  draw();
}
