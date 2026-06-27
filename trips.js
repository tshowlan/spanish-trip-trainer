/* ============================== TRIPS (per-destination progress) ============================== */
function snapshotActive() {
  if (!state.active) return;
  const snap = {}; DEST_FIELDS.forEach(f => snap[f] = state[f]);
  state.trips[state.active] = snap;
}
function applyTrip(key) {
  const t = state.trips[key] || {};
  state.profile = t.profile || null;
  state.lessons = t.lessons || {};
  state.topicStats = t.topicStats || {};
  state.xp = t.xp || 0;
}
function switchDestination(key) {
  if (key === state.active) { renderHome(); return; }
  snapshotActive();
  state.active = key;
  applyTrip(key);
  save(); rebuildDeck();
  state.profile ? renderHome() : renderOnboarding();   // existing trip → its map; brand-new → onboard
}
// One-time migration: existing flat progress is all Barcelona/Spain content → file it under 'spain'.
function migrateTrips() {
  if (state.active || Object.keys(state.trips).length) return;
  const hasData = Object.keys(state.lessons).length > 0 || state.profile;
  if (!hasData) return;
  const prof = state.profile
    ? Object.assign({}, state.profile, { destination: "spain", dialect: "Castilian Spanish" })
    : null;
  state.trips.spain = { profile: prof, lessons: state.lessons, topicStats: state.topicStats, xp: state.xp };
  state.active = "spain";
  applyTrip("spain");
  save();
}
function tripSummary(key) {
  const t = key === state.active
    ? { profile: state.profile, lessons: state.lessons, xp: state.xp }
    : (state.trips[key] || {});
  return { done: Object.keys(t.lessons || {}).length, xp: t.xp || 0, tripDate: (t.profile || {}).tripDate };
}
function renderTrips() {
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="settings"></div>`);
  wrap.appendChild(el(`<div class="set-head"><button class="close-btn" id="back">‹</button><h2>Your trips</h2></div>`));
  wrap.appendChild(el(`<p class="onb-dim" style="margin-top:0">Each destination keeps its own progress. Switch anytime — nothing is lost.</p>`));
  app.appendChild(wrap);
  $("#back").addEventListener("click", renderHome);
  const have = new Set([...Object.keys(state.trips), state.active].filter(Boolean));
  DESTINATIONS.forEach(d => {
    if (!have.has(d.key)) return;
    const s = tripSummary(d.key);
    const active = d.key === state.active;
    const days = s.tripDate ? Math.max(0, daysUntil(s.tripDate)) : null;
    const row = el(`<div class="set-row" style="cursor:pointer;${active ? "border-color:var(--green)" : ""}">
      <div><div class="set-t">${d.flag} ${d.label} ${active ? '<span class="you">active</span>' : ""}</div>
      <div class="set-d">${s.done} lesson${s.done === 1 ? "" : "s"} done · ${s.xp} XP${days !== null ? ` · ${days}d to go` : ""}</div></div>
      <span class="chev" style="font-size:22px">${active ? "✓" : "›"}</span></div>`);
    if (!active) row.addEventListener("click", () => switchDestination(d.key));
    wrap.appendChild(row);
  });
  const add = el(`<button class="btn grey" style="margin-top:16px">＋ Start a new destination</button>`);
  add.addEventListener("click", renderOnboarding);
  wrap.appendChild(add);
}
