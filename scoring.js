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

/* ---- Momentum (0–100): 7-day rolling activity, smooth decay (no streak resets) ---- */
function momentumScore() {
  const r = _sessions7();
  const days = new Set(r.map(s => s.at.slice(0, 10))).size;   // distinct active days (target 5)
  const sess = r.length;                                       // sessions (target 7)
  return Math.round(Math.min(100, 60 * Math.min(1, days / 5) + 40 * Math.min(1, sess / 7)));
}
// last-7-days session counts, oldest→newest, for the sparkline
function momentumSpark() {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * _DAY).toISOString().slice(0, 10);
    out.push(_sessions().filter(s => s.at.slice(0, 10) === day).length);
  }
  return out;
}

/* ---- Coverage (0–100): average per-category completion across the active pack ---- */
function coverageCats() {
  const cats = {};
  (typeof DECK !== "undefined" && DECK ? DECK.stages : []).forEach(st => st.lessons.forEach(l => {
    const c = categoryOf(l.topic);
    (cats[c] = cats[c] || { total: 0, done: 0 }).total++;
    if (lessonDone(l.id)) cats[c].done++;
  }));
  return cats;
}
function coverageScore() {
  const cats = coverageCats(), keys = Object.keys(cats);
  if (!keys.length) return 0;
  const avg = keys.reduce((a, c) => a + cats[c].done / cats[c].total, 0) / keys.length;
  return Math.round(avg * 100);
}

/* ---- Recency (0–100): decays from last completed session ---- */
function recencyScore() {
  const last = _sessions().reduce((m, s) => Math.max(m, new Date(s.at).getTime()), 0);
  if (!last) return 0;
  return Math.round(100 * Math.exp(-((Date.now() - last) / _DAY) / 7));
}

/* ---- Retention (0–100): mean per-phrase strength across EVERYTHING you've been taught ---- */
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
function readinessBand(r) {
  if (r >= 85) return { label: "Fluent for your trip", cls: "band-top" };
  if (r >= 65) return { label: "On track", cls: "band-good" };
  if (r >= 40) return { label: "Building", cls: "band-mid" };
  return { label: "Getting started", cls: "band-low" };
}

/* ---- bundle + cache (for instant render + count-up from previous value) ---- */
function computeScores() {
  const s = {
    readiness: readinessScore(), momentum: momentumScore(), retention: retentionScore(),
    coverage: coverageScore(), recency: recencyScore(),
    activeDays7: new Set(_sessions7().map(x => x.at.slice(0, 10))).size,
    sessions7: _sessions7().length,
    lifetimeSessions: _sessions().length,
    computedAt: Date.now()
  };
  state.scoresCache = s;
  return s;
}
