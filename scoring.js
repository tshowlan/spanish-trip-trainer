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

/* ---- Retention (0–100): V1 lesson-level forgetting curve (per-phrase hook left below) ---- */
function retentionScore() {
  const done = Object.entries(state.lessons || {}).map(([id, l]) => l).filter(l => l && l.at);
  if (!done.length) return 0;
  const S = 7;                                                 // fixed stability for the lesson-level fallback
  const mean = done.reduce((a, l) => a + 100 * Math.exp(-_daysSince(l.at) / S), 0) / done.length;
  return Math.round(mean);
}
// Completed lessons sorted weakest-first (for the "review" CTA); {id, strength}
function fadingLessons() {
  const S = 7;
  return Object.entries(state.lessons || {})
    .filter(([, l]) => l && l.at)
    .map(([id, l]) => ({ id, strength: Math.round(100 * Math.exp(-_daysSince(l.at) / S)) }))
    .sort((a, b) => a.strength - b.strength);
}
/* Per-phrase retention (future): when state.phrases exists, replace retentionScore with the mean of
   strength(phrase)=100·e^(−daysSinceLastCorrect/S), S=4·1.8^consecutiveCorrect, production 1.5× weight. */

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
