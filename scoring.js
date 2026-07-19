/* scoring.js — Whoop-style scores for the ACTIVE trip.
   Pure functions over state (per-trip sessions/lessons) + DECK (for coverage totals).
   No XP/streak inputs. Recomputed on home render + after each session. */

const _DAY = 864e5;
const _daysSince = iso => (iso ? (Date.now() - new Date(iso).getTime()) / _DAY : Infinity);
function _sessions() { return state.sessions || []; }
function _sessions7() {
  const now = Date.now();
  return _sessions().filter(s => now - new Date(s.at).getTime() <= 7 * _DAY);
}

/* ---- Momentum (0-100): 7-day rolling activity, smooth decay (no streak resets) ---- */
function momentumScore() {
  const r = _sessions7();
  const days = new Set(r.map(sessionDay)).size;   // distinct active days (target 5)
  const sess = r.length;                                       // sessions (target 7)
  return Math.round(Math.min(100, 60 * Math.min(1, days / 5) + 40 * Math.min(1, sess / 7)));
}
// last-7-days session counts, oldest→newest, for the sparkline
function momentumSpark() {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const day = daysAgoStr(i);
    out.push(_sessions().filter(s => sessionDay(s) === day).length);
  }
  return out;
}

/* ---- Coverage (0-100): strength-aware, demand-weighted category credit across the active pack ----
   §1.1 (scores) each seen phrase contributes coverageCredit = max(0.3, strength/100), unseen = 0, so
   Coverage behaves as STATE (dormancy fades it, no separate decay timer). §1.2 (personalization) each
   category's credit is then weighted by real interaction demand, so Readiness means "ready for the
   interactions THIS trip contains," not "% of lessons ticked." Per category: {total phrases, done
   lessons, seen phrases, credit sum}. */
function coverageCats() {
  const cats = {};
  (typeof DECK !== "undefined" && DECK ? DECK.stages : []).forEach(st => st.lessons.forEach(l => {
    const c = categoryOf(l.topic);
    const e = cats[c] || (cats[c] = { total: 0, done: 0, seen: 0, credit: 0 });
    const ldone = lessonDone(l.id);
    if (ldone) e.done++;
    l.items.forEach(it => {
      e.total++;
      const s = (state.learn || {})[it.id];
      if (s && s.exposures >= 1) { e.seen++; e.credit += Math.max(0.3, itemStrength(s) / 100); }        // drilled phrase
      else if (ldone) { e.seen++; e.credit += Math.max(0.3, lessonBaselineStrength(l.id) / 100); }       // taught via a completed lesson
      // unseen phrase → 0 credit (counts against Coverage, never against Retention)
    });
  }));
  return cats;
}
function coverageScore() {
  const cats = coverageCats(), keys = Object.keys(cats);
  if (!keys.length) return 0;
  const credit = c => cats[c].total ? cats[c].credit / cats[c].total : 0;                 // §1.2 categoryCredit
  const w = (typeof effectiveWeights === "function") ? effectiveWeights(state.profile, keys) : null;
  if (w) {                                                                                  // demand-weighted
    const wsum = keys.reduce((a, c) => a + (w[c] || 0), 0) || 1;
    return Math.round(keys.reduce((a, c) => a + credit(c) * (w[c] || 0), 0) / wsum * 100);
  }
  return Math.round(keys.reduce((a, c) => a + credit(c), 0) / keys.length * 100);          // fallback: equal weight
}

/* ---- Recency (0-100): decays from last completed session ---- */
function recencyScore() {
  const last = _sessions().reduce((m, s) => Math.max(m, new Date(s.at).getTime()), 0);
  if (!last) return 0;
  return Math.round(100 * Math.exp(-((Date.now() - last) / _DAY) / 7));
}

/* ---- Retention (0-100): mean per-phrase strength across EVERYTHING you've been taught ---- */
function retentionScore() {
  const strengths = [];
  (typeof DECK !== "undefined" && DECK ? DECK.stages : []).forEach(st => st.lessons.forEach(l => {
    const doneLesson = lessonDone(l.id);
    l.items.forEach(it => {
      const s = (state.learn || {})[it.id];
      if (s && s.exposures >= 1) strengths.push(itemStrength(s));         // per-phrase SRS strength
      else if (doneLesson) strengths.push(lessonBaselineStrength(l.id));  // taught via a completed lesson
    });
  }));
  if (!strengths.length) return retentionScoreLegacy();
  return Math.round(strengths.reduce((a, b) => a + b, 0) / strengths.length);
}
// a phrase from a completed lesson you haven't drilled individually: moderate maturity,
// decaying from when the lesson was finished (so old un-reviewed material fades toward 0)
function lessonBaselineStrength(lessonId) {
  const lo = (state.lessons || {})[lessonId];
  if (!lo || !lo.at) return 0;
  return 100 * 0.42 * Math.exp(-Math.max(0, _daysSince(lo.at)) / 7);
}
// pre-M3 fallback: lesson-level forgetting curve (used until the learner has per-item data)
function retentionScoreLegacy() {
  const done = Object.values(state.lessons || {}).filter(l => l && l.at);
  if (!done.length) return 0;
  const mean = done.reduce((a, l) => a + 100 * Math.exp(-_daysSince(l.at) / 7), 0) / done.length;
  return Math.round(mean);
}
// individual phrases sorted weakest-first (for the retention "review" CTA); {id, strength}
function fadingItems() {
  return Object.entries(state.learn || {})
    .filter(([, s]) => s && s.exposures >= 1)
    .map(([id, s]) => ({ id, strength: Math.round(itemStrength(s)) }))
    .sort((a, b) => a.strength - b.strength);
}

/* ---- Trip Readiness (headline composite) ---- */
function readinessScore() {
  return Math.round(0.40 * coverageScore() + 0.40 * retentionScore() + 0.20 * recencyScore());
}
// Bands are stative + bidirectional (scores spec §1.1, decisions 2026-07-16): each completes
// "Readiness: ___", equally true arriving from above or below. Top band = the brand name.
function readinessBand(r) {
  if (r >= 85) return { label: "Tripfluent", cls: "band-top" };
  if (r >= 65) return { label: "Strong", cls: "band-good" };
  if (r >= 40) return { label: "Fair", cls: "band-mid" };
  return { label: "Low", cls: "band-low" };
}

/* ---- Pace check (scores spec §1.1): project Readiness at the trip date ---- */
// Heuristic gap-closing model: continued practice at the current weekly cadence
// closes a shrinking fraction of the gap to a practical ceiling. Returns null when
// there's no trip date, the trip has passed, or the account is still cold-starting.
function paceProjection(readinessArg) {
  const p = state.profile;
  if (!p || !p.tripDate) return null;
  const daysOut = daysUntil(p.tripDate);
  if (daysOut <= 0) return null;
  if (_sessions().length < 5) return null;                     // cold start — too noisy to project (§6.3)
  const current = readinessArg != null ? readinessArg : ((state.scoresCache || {}).readiness);
  if (current == null) return null;
  const weeks = Math.max(0.3, daysOut / 7);
  const spwNow = _sessions7().length;                          // sessions/week = sessions in the last 7 days
  const CEIL = 94, GAIN = 0.10, TARGET = 90;
  const project = spw => spw <= 0
    ? Math.round(current * Math.exp(-daysOut / 21))            // not practicing → slow drift down
    : Math.round(current + (CEIL - current) * (1 - Math.exp(-GAIN * spw * weeks)));
  const projected = project(spwNow);
  const need = (TARGET - current) / (CEIL - current);          // fraction of gap to close for TARGET
  let addSessions = 0, reachable = need < 1;
  if (need > 0 && reachable) {
    const spwNeed = -Math.log(1 - need) / (GAIN * weeks);
    addSessions = Math.max(0, Math.ceil(spwNeed - spwNow));
    if (spwNeed > 10) { reachable = false; addSessions = 0; }   // >10 sessions/wk isn't a realistic ask — drop the lever
  }
  return { projected, target: TARGET, daysOut, spwNow, addSessions, reachable, onTrack: projected >= 85 };
}

/* ---- fading phrases grouped by scenario category (for retention notifications) ---- */
function fadingByCategory(threshold) {
  const cut = threshold == null ? 40 : threshold;
  const out = {};
  (typeof DECK !== "undefined" && DECK ? DECK.stages : []).forEach(st => st.lessons.forEach(l => {
    const cat = categoryOf(l.topic);
    l.items.forEach(it => {
      const ls = (state.learn || {})[it.id];
      const strength = ls && ls.exposures >= 1 ? itemStrength(ls) : (lessonDone(l.id) ? lessonBaselineStrength(l.id) : null);
      if (strength != null && strength < cut) out[cat] = (out[cat] || 0) + 1;
    });
  }));
  return out;
}

/* ---- notification snapshot: the honest numbers the backend cites when it sends a push ---- */
function notifSnapshot() {
  const s = state.scoresCache || computeScores();
  const fading = fadingByCategory(40);
  const lastAt = _sessions().reduce((m, x) => Math.max(m, new Date(x.at).getTime()), 0);
  return {
    readiness: s.readiness, retention: s.retention, momentum: s.momentum,
    coverage: s.coverage, recency: s.recency,
    sessions7: s.sessions7, activeDays7: s.activeDays7, lifetimeSessions: s.lifetimeSessions,
    fadingByCategory: fading, fadingTotal: Object.values(fading).reduce((a, b) => a + b, 0),
    pace: s.pace ? { projected: s.pace.projected, target: s.pace.target, addSessions: s.pace.addSessions } : null,
    tripDate: (state.profile || {}).tripDate || null,
    destination: (state.profile || {}).destination || null,
    daysOut: (state.profile || {}).tripDate ? daysUntil(state.profile.tripDate) : null,
    language: state.active || null,
    lastSession: lastAt ? new Date(lastAt).toISOString() : null,
    computedAt: new Date().toISOString()
  };
}

/* ---- §7.3 divergence detection — where three dials earn their keep ----
   The dials co-move most weeks; the value is in the DIVERGENCES. This reads current state (a
   trend-free v1 until daily history accrues) and returns the one actionable pattern, as data —
   the detail sheet composes the copy + CTA. Each dial has a distinct lever (§7.1):
   Momentum = do a session today; Retention = steer a session toward review; Readiness = the output. */
function scoreDivergence(s) {
  s = s || state.scoresCache || computeScores();
  if (s.lifetimeSessions < 5) return null;                     // too early to diagnose honestly
  const fading = fadingItems().filter(x => x.strength < 55).length;
  const cats = coverageCats();
  const untouched = Object.values(cats).filter(c => c.seen === 0).length;   // no phrases seen in the category
  // (a) quality problem — putting in the work, but earlier phrases decay: steer next session to review
  if (s.momentum >= 50 && fading >= 12 && s.retention < s.coverage - 5) return { kind: "review", fading };
  // (b) coverage problem — what's learned is solid, but too little of the trip is covered: new content
  if (s.retention >= 60 && s.coverage <= 55 && untouched >= 2) return { kind: "cover", untouched };
  return null;
}

/* ---- §7.2 foundation: one score snapshot per day, for the trend charts (re-derivable from sessions) ---- */
function _recordDaily(s) {
  state.scoreHistory = state.scoreHistory || [];
  const today = todayStr();
  const rec = { date: today, readiness: s.readiness, momentum: s.momentum, retention: s.retention, coverage: s.coverage, recency: s.recency, sessions: s.sessions7 };
  const h = state.scoreHistory, last = h[h.length - 1];
  if (last && last.date === today) { h[h.length - 1] = rec; }   // same-day update, no persist churn
  else { h.push(rec); if (h.length > 120) h.splice(0, h.length - 120); save(); }  // new day → persist
}

/* ---- §7.2 trend series for one dial, from the daily history ----
   Returns null until at least two distinct days exist (data-gated — no fake trend
   from a single point). `pts` carry the real date so the sheet can space the x-axis
   honestly across gaps in practice. */
function scoreTrend(metric, days) {
  const win = days || 30;
  const cutoff = Date.now() - win * _DAY;
  const pts = (state.scoreHistory || [])
    .filter(r => r && r[metric] != null && new Date(r.date).getTime() >= cutoff)
    .map(r => ({ t: new Date(r.date).getTime(), v: r[metric] }));
  if (pts.length < 2) return null;
  const vals = pts.map(p => p.v);
  const first = pts[0].v, last = pts[pts.length - 1].v;
  return {
    pts, first, last, delta: last - first,
    min: Math.min(...vals), max: Math.max(...vals),
    spanDays: Math.max(1, Math.round((pts[pts.length - 1].t - pts[0].t) / _DAY))
  };
}

/* ---- bundle + cache (for instant render + count-up from previous value) ---- */
function computeScores() {
  const s = {
    readiness: readinessScore(), momentum: momentumScore(), retention: retentionScore(),
    coverage: coverageScore(), recency: recencyScore(),
    activeDays7: new Set(_sessions7().map(sessionDay)).size,
    sessions7: _sessions7().length,
    lifetimeSessions: _sessions().length,
    computedAt: Date.now()
  };
  state.scoresCache = s;
  s.pace = paceProjection(s.readiness);                        // attach pace once readiness is known
  _recordDaily(s);                                             // §7.2 daily history for trend charts
  return s;
}
