/* srs.js — per-item learning state + the exposure ladder (Learning Engine M1).
   Pure logic, no rendering. lesson.js consumes chooseType()/rungDownType() and
   records outcomes through recordExposure()/recordAnswer(). Interval/ease/SRS
   scheduling (SM-2-lite) land in M3; M1 only tracks exposures/streak/lapses. */

function itemId(item) { return item && item.id; }

function learnState(id) {
  if (!id) return null;
  state.learn = state.learn || {};
  return state.learn[id] || (state.learn[id] = { exposures: 0, streak: 0, lapses: 0 });
}
function learnPeek(item) {
  const id = itemId(item);
  return (id && state.learn) ? state.learn[id] : null;      // null = never seen
}
function exposuresOf(item) {
  const s = learnPeek(item);
  return s ? s.exposures : 0;
}
// presentation card / passive view: counts as exposure, no grading effect
function recordExposure(id) {
  const s = learnState(id); if (!s) return;
  s.exposures++; s.lastSeen = todayStr();
}
// graded answer: advance exposure + streak/lapse bookkeeping
function recordAnswer(id, ok) {
  const s = learnState(id); if (!s) return;
  s.exposures++; s.lastSeen = todayStr();
  if (ok) s.streak++; else { s.streak = 0; s.lapses++; s.lastMiss = todayStr(); }
}

/* ---------- review selection (M2 — pre-SRS recency heuristic; SM-2 arrives in M3) ---------- */
function _daysAgo(dateStr) {
  if (!dateStr) return Infinity;
  return Math.floor((Date.now() - new Date(dateStr + "T00:00:00").getTime()) / 864e5);
}
// items seen at least once but not practised in a while — the trip-wide review pool, oldest first
function dueForReview(minDays) {
  const cut = minDays == null ? 3 : minDays;
  return (ALL_ITEMS || [])
    .filter(it => { const s = learnPeek(it); return s && s.exposures >= 1 && _daysAgo(s.lastSeen) >= cut; })
    .sort((a, b) => _daysAgo(learnPeek(b).lastSeen) - _daysAgo(learnPeek(a).lastSeen));
}
// items missed in the last ~48h — these open the next session as warm-up
function recentMisses(withinDays) {
  const w = withinDays == null ? 2 : withinDays;
  return (ALL_ITEMS || [])
    .filter(it => { const s = learnPeek(it); return s && s.lastMiss && _daysAgo(s.lastMiss) <= w && s.streak === 0; })
    .sort((a, b) => _daysAgo(learnPeek(a).lastMiss) - _daysAgo(learnPeek(b).lastMiss));
}
// trip date proximity → cram mode raises the review share and pushes production
function cramActive() {
  const d = state.profile && state.profile.tripDate ? daysUntil(state.profile.tripDate) : null;
  return d != null && d >= 0 && d < 14;
}

/* ---------- exposure ladder ----------
   Rungs, easiest → hardest. 'match' is a warm-up composed separately, so it is
   not a single-item mode here. An item's rung is chosen from its exposure count. */
const LADDER = [
  ["present"],                                    // 0    first sight — teach, never test
  ["mc_es2en", "listen_choice"],                  // 1–2  recognition (incl. hear-and-pick)
  ["mc_en2es", "build", "fill_blank"],            // 3–4  scaffolded production
  ["type_translation", "listen_type"]             // 5+   cold production
];

function _wordCount(item) { return item.es.trim().split(/\s+/).length; }
function _modeFeasible(mode, item) {
  const n = _wordCount(item);
  if (mode === "build") return n >= 2 && n <= 8;   // tap-to-build needs a real sentence
  if (mode === "fill_blank") return n >= 3;
  return true;
}
function _tierOfType(type) {
  for (let i = 0; i < LADDER.length; i++) if (LADDER[i].includes(type)) return i;
  return 1;
}
function _pickModeForTier(tier, item) {
  for (let t = Math.max(0, Math.min(tier, LADDER.length - 1)); t >= 1; t--) {
    const feasible = LADDER[t].filter(m => _modeFeasible(m, item));
    if (feasible.length) return pick(feasible);
  }
  return "mc_es2en";                                // recognition always works
}
function _baseTier(exposures) { return exposures <= 2 ? 1 : exposures <= 4 ? 2 : 3; }

// pick the graded mode for an item this session, from its lifetime exposures
function chooseType(item) {
  const s = learnPeek(item);
  const exp = s ? s.exposures : 0;
  let tier = _baseTier(exp);
  if (s && s.streak === 0 && s.lapses > 0) tier = Math.max(1, tier - 1);  // rung-down after a recent miss
  return _pickModeForTier(tier, item);
}
// re-serve a missed item one rung easier than the mode it failed (0 → presentation card)
function rungDownType(failedType, item) {
  const tier = Math.max(0, _tierOfType(failedType) - 1);
  return tier === 0 ? "present" : _pickModeForTier(tier, item);
}

/* ---------- typed-answer judging: accept accent slips + single-char typos ---------- */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j), cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
// returns { ok, accent?, typo? }. accent = right letters, wrong/missing accents.
function judgeTyped(raw, target) {
  const a = norm(raw), b = norm(target);
  if (a === b) return { ok: true, accent: raw.trim().toLowerCase() !== target.toLowerCase() };
  if (levenshtein(a, b) <= 1) return { ok: true, typo: true };
  return { ok: false };
}
