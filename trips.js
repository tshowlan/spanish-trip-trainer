/* ============================== TRIPS (per-destination progress) ============================== */
function snapshotActive() {
  if (!state.active) return;
  const snap = {}; DEST_FIELDS.forEach(f => snap[f] = state[f]);
  state.trips[state.active] = snap;
}
function applyTrip(key) {
  const t = state.trips[key] || {};
  const defaults = { profile: null, lessons: {}, topicStats: {}, xp: 0, sessions: [], learn: {} };
  DEST_FIELDS.forEach(f => { state[f] = (t[f] !== undefined ? t[f] : defaults[f]); });
}
// One-time: give already-completed lessons a timestamp so Retention has data, and ensure
// every trip has a sessions log. (Scores build forward from here for existing users.)
function migrateScoring() {
  const now = new Date().toISOString();
  const fix = t => {
    if (!t) return;
    Object.values(t.lessons || {}).forEach(l => { if (l && !l.at) l.at = now; });
    if (!t.sessions) t.sessions = [];
    if (!t.learn) t.learn = {};
  };
  fix(state);                                   // active trip (mirrored at top level)
  Object.values(state.trips || {}).forEach(fix);
  save();
}
// One-time: item ids became lesson-independent (pack:slug, was pack:lesson:slug). Remap every
// learn map's keys old→new so SRS history survives; merge any collisions by keeping the more-
// progressed record. Also called on incoming cloud data (see cloud.js mergeTrip) so a pull from
// an un-migrated device/server can't strand progress under stale keys.
function _remapLearnKeys(learn) {
  if (!learn) return learn;
  const better = (a, b) => { if (!a || !b) return a || b; const x = a.exposures || 0, y = b.exposures || 0; return x !== y ? (x > y ? a : b) : ((a.lastSeen || "") >= (b.lastSeen || "") ? a : b); };
  const out = {};
  Object.keys(learn).forEach(k => {
    const p = k.split(":");
    const nk = p.length === 3 ? p[0] + ":" + p[2] : k;        // pack:lesson:slug -> pack:slug
    out[nk] = out[nk] ? better(out[nk], learn[k]) : learn[k];
  });
  return out;
}
function migrateItemIds() {
  if (state.idsV2) return;
  state.learn = _remapLearnKeys(state.learn);
  Object.values(state.trips || {}).forEach(t => { if (t && t.learn) t.learn = _remapLearnKeys(t.learn); });
  state.idsV2 = true;
  save();
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
  hideTabbar();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="settings"></div>`);
  wrap.appendChild(el(`<div class="set-head"><button class="close-btn" id="back">${icon('caret-left',26)}</button><h2>Your trips</h2></div>`));
  wrap.appendChild(el(`<p class="onb-dim" style="margin-top:0">Each destination keeps its own progress. Switch anytime, nothing is lost.</p>`));
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
      <span class="chev">${active ? "✓" : icon('caret-right',20)}</span></div>`);
    if (!active) row.addEventListener("click", () => switchDestination(d.key));
    wrap.appendChild(row);
  });
  const add = el(`<button class="btn grey" style="margin-top:16px">＋ Start a new destination</button>`);
  add.addEventListener("click", renderOnboarding);
  wrap.appendChild(add);
}
