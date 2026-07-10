/* ============================== CLOUD (group + sync) ============================== */
function categoryOf(topic) {
  const t = topic.toLowerCase();
  if (t.includes("restaurant") || t.includes("coffee") || t.includes("allerg")) return "Food & Drink";
  if (t.includes("transport") || t.includes("airport") || t.includes("taxi") || t.includes("plane")) return "Transport";
  if (t.includes("walking") || t.includes("direction")) return "Directions";
  if (t.includes("hotel") || t.includes("airbnb")) return "Lodging";
  if (t.includes("landmark") || t.includes("sight")) return "Sights";
  if (t.includes("number") || t.includes("time")) return "Numbers & Time";
  if (t.includes("advanced")) return "Advanced";
  return "Basics";
}
const cloudHeaders = () => ({ apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" });
async function rpc(fn, body, opts) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST", headers: cloudHeaders(), body: JSON.stringify(body),
    keepalive: !!(opts && opts.keepalive)     // let a background/close flush outlive the page
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error((data && data.message) || ("HTTP " + res.status));
  return data;
}
function ensureIdentity() {
  if (!state.cloud) state.cloud = {};
  if (!state.cloud.playerId) {
    state.cloud.playerId = crypto.randomUUID();
    state.cloud.secret = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
    save();
  }
}
async function cloudSync(opts) {
  if (!state.cloud || !state.cloud.optedIn) return;          // nothing leaves the device until you join a group
  ensureIdentity();
  snapshotActive();                                          // make sure the active trip is current in state.trips
  await rpc("sync_player", {
    p_id: state.cloud.playerId, p_secret: state.cloud.secret,
    p_name: state.cloud.name || "Traveler", p_group: state.cloud.group || null,
    p_xp: state.xp, p_streak: state.streak, p_stats: state.topicStats || {},
    // notif = the honest score snapshot the (server-side) notification engine cites; stored in the
    // existing progress JSON so no backend schema change is needed to start collecting it.
    p_progress: { history: state.history, trips: state.trips, active: state.active, notif: notifSnapshot() }
  }, opts);
}
function genCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}
function strengths(stats) {
  const cats = Object.entries(stats || {}).filter(([, v]) => v && v.total >= 4)
    .map(([k, v]) => ({ k, acc: v.correct / v.total }));
  if (!cats.length) return null;
  cats.sort((a, b) => b.acc - a.acc);
  return { best: cats[0], worst: cats[cats.length - 1] };
}

function renderGroup() {
  hideTabbar();
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="settings"></div>`);
  wrap.appendChild(el(`<div class="set-head"><button class="close-btn" id="back">${icon('caret-left',26)}</button><h2>Group</h2></div>`));
  app.appendChild(wrap);
  $("#back").addEventListener("click", renderHome);
  (state.cloud && state.cloud.group) ? renderGroupView(wrap, renderGroup) : renderGroupJoin(wrap, renderGroup);
}

function renderGroupJoin(wrap, rerender = renderGroup) {
  wrap.appendChild(el(`<p class="onb-dim" style="margin-top:0">Learn together. Create a group, share the code with your travel buddies, and see who's best — and worst — at what.</p>`));
  wrap.appendChild(el(`<div class="set-t" style="margin:10px 0 6px">Your name</div>`));
  const name = el(`<input class="text-input" placeholder="Your name" value="${(state.cloud && state.cloud.name) || ""}">`);
  wrap.appendChild(name);
  const createBtn = el(`<button class="btn" style="margin-top:16px">Create a new group</button>`);
  wrap.appendChild(createBtn);
  wrap.appendChild(el(`<div class="set-t" style="margin:22px 0 6px">Have a code?</div>`));
  const codeInput = el(`<input class="text-input" placeholder="Enter group code" style="text-transform:uppercase">`);
  const joinBtn = el(`<button class="btn grey" style="margin-top:10px">Join group</button>`);
  wrap.appendChild(codeInput); wrap.appendChild(joinBtn);

  async function enter(code) {
    ensureIdentity();
    state.cloud.name = name.value.trim() || "Traveler";
    state.cloud.group = code; state.cloud.optedIn = true; save();
    try { await cloudSync(); toast("You're in! Code: " + code); rerender(); }
    catch (e) { state.cloud.group = null; save(); toast("Couldn't connect: " + e.message); }
  }
  createBtn.addEventListener("click", () => enter(genCode()));
  joinBtn.addEventListener("click", () => {
    const c = codeInput.value.trim().toUpperCase();
    c ? enter(c) : toast("Enter a code first");
  });
}

function renderGroupView(wrap, rerender = renderGroup) {
  const code = state.cloud.group;
  wrap.appendChild(el(`<div class="group-code">Group code <b>${code}</b><button class="copy" id="copy">Copy</button></div>`));
  const list = el(`<div id="members"><p class="onb-dim">Loading…</p></div>`);
  wrap.appendChild(list);
  const refresh = el(`<button class="btn grey" style="margin-top:14px">Refresh</button>`);
  const leave = el(`<button class="btn" style="margin-top:10px;background:var(--bg-elevated);color:var(--text-dim)">Leave group</button>`);
  wrap.appendChild(refresh); wrap.appendChild(leave);

  wrap.appendChild(el(`<div class="set-t" style="margin-top:28px">Use on another device</div>`));
  wrap.appendChild(el(`<p class="onb-dim" style="margin-top:4px">Paste this into the app on another phone to carry over your progress. Keep it private.</p>`));
  const sync = `${state.cloud.playerId}.${state.cloud.secret}`;
  const copySync = el(`<button class="btn grey" style="margin-top:6px">Copy my sync code</button>`);
  const restore = el(`<input class="text-input" placeholder="Paste a sync code to restore" style="margin-top:14px;font-size:12px">`);
  const restoreBtn = el(`<button class="btn grey" style="margin-top:8px">Restore from code</button>`);
  wrap.appendChild(copySync); wrap.appendChild(restore); wrap.appendChild(restoreBtn);

  $("#copy").addEventListener("click", () => { navigator.clipboard && navigator.clipboard.writeText(code); toast("Code copied"); });
  copySync.addEventListener("click", () => { navigator.clipboard && navigator.clipboard.writeText(sync); toast("Sync code copied"); });
  refresh.addEventListener("click", () => loadMembers(list, code));
  leave.addEventListener("click", () => {
    if (confirm("Leave this group?")) { state.cloud.group = null; save(); cloudSync().catch(() => {}); rerender(); }
  });
  restoreBtn.addEventListener("click", () => doRestore(restore.value.trim()));
  loadMembers(list, code);
}

async function loadMembers(list, code) {
  list.innerHTML = `<p class="onb-dim">Loading…</p>`;
  try {
    const rows = await rpc("get_group", { p_group: code });
    if (!rows || !rows.length) { list.innerHTML = `<p class="onb-dim">No members yet — share the code!</p>`; return; }
    list.innerHTML = "";
    rows.forEach((m, i) => {
      const s = strengths(m.stats);
      const medal = ["🥇", "🥈", "🥉"][i] || `${i + 1}.`;
      const best = s ? `<span class="skill good">💪 ${s.best.k}</span>` : `<span class="skill">just getting started</span>`;
      const worst = s && s.worst.k !== s.best.k ? `<span class="skill bad">😬 ${s.worst.k}</span>` : "";
      const you = m.name === (state.cloud.name || "") ? ` <span class="you">you</span>` : "";
      list.appendChild(el(`
        <div class="member">
          <div class="m-rank">${medal}</div>
          <div class="m-main">
            <div class="m-name">${m.name}${you}</div>
            <div class="m-stats">🔥 ${m.streak} · ⚡ ${m.xp} XP</div>
            <div class="m-skills">${best} ${worst}</div>
          </div>
        </div>`));
    });
  } catch (e) { list.innerHTML = `<p class="onb-dim">Couldn't load: ${e.message}</p>`; }
}

/* ---- non-destructive merge helpers ----
   A login/restore pulls the server copy DOWN onto whatever is on this device. It must never
   roll progress back: for every lesson and phrase we keep the *more-advanced* of the two sides,
   and we union anything that exists on only one side. (Fixes the reinstall-then-login rollback.) */
function _laterISO(a, b) { return (a || "") >= (b || "") ? (a || b || "") : (b || ""); }
function _mergeLessons(a, b) {
  a = a || {}; b = b || {}; const out = {};
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach(id => {
    const x = a[id], y = b[id];
    out[id] = !x ? y : !y ? x : { stars: Math.max(x.stars || 0, y.stars || 0), at: _laterISO(x.at, y.at) };
  });
  return out;
}
function _mergeLearn(a, b) {
  a = a || {}; b = b || {}; const out = {};
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach(id => {
    const x = a[id], y = b[id];
    if (!x || !y) { out[id] = x || y; return; }
    const xr = x.exposures || 0, yr = y.exposures || 0;        // more work done wins; tie → most recently seen
    out[id] = xr !== yr ? (xr > yr ? x : y) : (_laterISO(x.lastSeen, y.lastSeen) === (x.lastSeen || "") ? x : y);
  });
  return out;
}
function _mergeStats(a, b) {
  a = a || {}; b = b || {}; const out = {};
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => {
    const x = a[k], y = b[k];
    out[k] = !x ? y : !y ? x : ((x.total || 0) >= (y.total || 0) ? x : y);   // fuller record; don't double-count
  });
  return out;
}
function _mergeSessions(a, b) {
  const seen = new Set(), out = [];
  [...(a || []), ...(b || [])].forEach(s => {
    const k = (s.at || "") + "|" + (s.lessonId || "");
    if (!seen.has(k)) { seen.add(k); out.push(s); }
  });
  return out.sort((p, q) => (p.at || "") < (q.at || "") ? -1 : 1);
}
function mergeTrip(local, server) {
  local = local || {}; server = server || {};
  return {
    profile: local.profile || server.profile || null,
    lessons: _mergeLessons(local.lessons, server.lessons),
    topicStats: _mergeStats(local.topicStats, server.topicStats),
    xp: Math.max(local.xp || 0, server.xp || 0),
    sessions: _mergeSessions(local.sessions, server.sessions),
    learn: _mergeLearn(local.learn, server.learn)
  };
}

// Merge a remote player record down onto this device (never overwrites newer local progress).
function applyPlayer(r) {
  if (!r) return;
  state.streak = Math.max(state.streak, r.streak || 0);      // streak is global
  if (state.cloud) { if (r.name) state.cloud.name = r.name; state.cloud.group = r.group_code || state.cloud.group; }
  if (r.progress) {
    if (r.progress.history) state.history = [...new Set([...(state.history || []), ...r.progress.history])];
    if (r.progress.trips) {                                  // per-destination restore
      snapshotActive();                                     // fold live top-level progress into its trip first
      Object.keys(r.progress.trips).forEach(k => {
        state.trips[k] = mergeTrip(state.trips[k], r.progress.trips[k]);   // keep the better of local vs server
      });
      if (r.progress.active && !state.active) state.active = r.progress.active;   // respect this device's active trip
      if (state.active) applyTrip(state.active);             // re-mirror the merged active trip to top level
    } else {                                                 // legacy single-trip backup
      if (r.progress.lessons) state.lessons = _mergeLessons(state.lessons, r.progress.lessons);
      if (r.progress.profile && !state.profile) state.profile = r.progress.profile;
      state.xp = Math.max(state.xp, r.xp || 0);
      state.topicStats = _mergeStats(state.topicStats, r.stats);
    }
  }
}

async function doRestore(codeStr) {
  const dot = (codeStr || "").indexOf(".");
  const id = dot > 0 ? codeStr.slice(0, dot) : "", secret = dot > 0 ? codeStr.slice(dot + 1) : "";
  if (!id || !secret) { toast("That doesn't look like a sync code"); return; }
  try {
    const r = await rpc("get_player", { p_id: id, p_secret: secret });
    if (!r) { toast("No match for that sync code"); return; }
    state.cloud = Object.assign({}, state.cloud, { playerId: id, secret, optedIn: true });
    applyPlayer(r);
    save(); rebuildDeck(); toast("Synced! Welcome back."); renderGroup();
  } catch (e) { toast("Restore failed: " + e.message); }
}
