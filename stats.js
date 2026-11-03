/* ============================== THE STATS RECORD (chat 11/2; Tom's guard b) ==============================
   Per day, per kind of exercise: answers, right, time spent (ms). Lives in state.stats, synced per trip
   (DEST_FIELDS), merged by union on day keys (cloud.js _mergeStatRec). Each finished session also gains its
   duration (ms) and its expected time (exp): the learner's own mean time per kind, fixed as the session
   starts, summed over the session's answers. Feeds the Stats tab (By exercise, Best sessions, Time).
   Nothing here renders. STAGED "stats-record": off, nothing is written. */
const STAT_KINDS = { listen: "Listening", pick: "Picking", build: "Building", type: "Typing" };
// every graded exercise type → the thing the learner did (chat §2: one verb's -ing each). Unlisted types
// (present, encore, say_it, sounds_end, the sound cards) are not answers and are not counted.
const STAT_KIND_OF = {
  listen_choice: "listen", hear_pick: "listen", reply_hear: "listen", reply_listen: "listen", sound_choice: "listen", scene_hear: "listen",
  exchange: "listen", num_pad: "listen", num_run: "listen", num_set: "listen", key_sound: "listen", odd_one: "listen", sound_wall: "listen",
  mc_es2en: "pick", context_choice: "pick", ask_which: "pick", sign_which: "pick", sign_act: "pick", variation: "pick", grasp: "pick",
  pairs: "pick", days_set: "pick", sign_table: "pick", sign_wall: "pick", days_order: "pick", circuit_door: "pick", circuit_close: "pick",
  scene_sign: "pick", scene_door: "pick", scene_close: "pick",
  weld: "build", build: "build", machine_drill: "build", stretch: "build",
  type_translation: "type", close: "type", close_swap: "type", listen_type: "type"
};
function statKind(q) {
  if (!q || !q.type) return null;
  if (q.type === "weld") {
    if (q.listenBuild) return "listen";   // the ear build: heard, then built; hearing is the skill
    // the typed rung is a weld answered by typing (inputForm fixed at composition, or climbed at render as the renderer decides)
    const typed = q.inputForm ? q.inputForm === "typed" : (typeof _inputClimbed === "function" && q.item ? _inputClimbed(q.item) : false);
    return typed ? "type" : "build";
  }
  return STAT_KIND_OF[q.type] || null;
}
// the guard (Tom 11/2, b): fabricated progress and lab-launched sessions never touch the record; staged play does
function statsOn() {
  if (typeof isStaged === "function" && !isStaged("stats-record")) return false;
  if (state.simMode) return false;
  if (typeof run !== "undefined" && run && run.lab) return false;
  return true;
}
// mean ms per kind over the whole record, with the answer count behind each
function _statMeans() {
  const m = {};
  Object.values(state.stats || {}).forEach(d => Object.entries(d || {}).forEach(([k, e]) => { const t = m[k] = m[k] || { n: 0, ms: 0 }; t.n += e.n || 0; t.ms += e.ms || 0; }));
  return m;
}
function recordStat(q, ok, ms) {
  if (!statsOn()) return;
  const k = statKind(q); if (!k) return;
  if (typeof run !== "undefined" && run && !run.statMeans) run.statMeans = _statMeans();   // the usual, fixed as the session starts (chat §8)
  const day = todayStr(), S = state.stats = state.stats || {}, d = S[day] = S[day] || {}, e = d[k] = d[k] || { n: 0, ok: 0, ms: 0 };
  e.n++; if (ok) e.ok++; if (ms != null && ms <= 180000) e.ms += ms;
  if (typeof run !== "undefined" && run) { run.statN = run.statN || {}; run.statN[k] = (run.statN[k] || 0) + 1; }
}
// at session end: the duration, and the expected time when every kind played had a usual (20 answers before it)
function statSessionEnd(rec) {
  if (!statsOn() || typeof run === "undefined" || !run) return;
  if (run.t0) rec.ms = Date.now() - run.t0;
  const means = run.statMeans, n = run.statN; if (!means || !n) return;
  let exp = 0;
  for (const k in n) { const m = means[k]; if (!m || m.n < 20 || !m.ms) return; exp += n[k] * (m.ms / m.n); }
  rec.exp = Math.round(exp);
}
function clearStats() {
  state.stats = {};
  (state.sessions || []).forEach(s => { delete s.ms; delete s.exp; });
  save();
}
// the Test Lab's readout
function statLabLine() {
  const days = Object.keys(state.stats || {}).length, m = _statMeans(), ks = Object.keys(m);
  if (!days || !ks.length) return "Nothing recorded yet.";
  const ok = {}; Object.values(state.stats).forEach(d => Object.entries(d).forEach(([k, e]) => { ok[k] = (ok[k] || 0) + (e.ok || 0); }));
  return `${days} day${days === 1 ? "" : "s"}: ` + ks.map(k => `${STAT_KINDS[k] || k} ${m[k].n} (${Math.round(100 * (ok[k] || 0) / m[k].n)}%, ${(m[k].ms / m[k].n / 1000).toFixed(1)} s)`).join(" · ");
}
