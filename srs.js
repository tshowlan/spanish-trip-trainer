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
/* ---------- SM-2-lite scheduler (M3) ---------- */
function seedInterval(difficulty) { return ({ 1: 4, 2: 3, 3: 2, 4: 1, 5: 1 })[difficulty || 2] || 3; }
function _dateAdd(dateStr, days) {
  const dt = new Date((dateStr || todayStr()) + "T00:00:00");
  dt.setDate(dt.getDate() + Math.min(3650, Math.round(days)));
  return dayStr(dt);
}
// graded answer: advance exposure + streak/lapse + SM-2-lite interval/ease/due + mastery axes.
// opts.mode is the exercise type, used to set the production/cold/native axes.
function recordAnswer(id, ok, opts) {
  const s = learnState(id); if (!s) return;
  if (s.ease == null) s.ease = 2.3;
  if (s.interval == null) s.interval = 0;
  s.axes = s.axes || { production: 0, cold: 0, native: 0, chained: 0 };
  s.exposures++; s.lastSeen = todayStr();
  const daysLeft = (state.profile && state.profile.tripDate) ? Math.max(1, daysUntil(state.profile.tripDate)) : 3650;
  if (ok) {
    s.streak++; s.lastCorrect = todayStr();
    s.interval = s.interval === 0 ? seedInterval(s.difficulty) : Math.round(s.interval * s.ease);
    const m = opts && opts.mode;                                  // mastery axes (as modes exist)
    if (m === "type_translation") { s.axes.production = 1; s.axes.cold = 1; }
    else if (m === "speak_it") { s.axes.production = 1; s.axes.cold = 1; }   // speaking = cold production
    else if (m === "listen_type") { s.axes.production = 1; if (!(opts && opts.scaffolded)) s.axes.native = 1; }  // native only at full speed (§5.4)
    else if (m === "chained") { s.axes.chained = 1; }                        // produced a turn inside a dialogue (§5.4)
    else if (m === "audio_cloze" || m === "ear_build") { if (!(opts && opts.scaffolded)) s.axes.native = 1; }  // parsed full-speed native audio (§7.1)
    else if (m === "close" || m === "close_swap") { s.axes.production = 1; s.axes.cold = 1; }  // the close: cold typed reps (§7.1)
    else if (m === "reply") { s.axes.chained = 1; }                          // responded to a local's line (§7.1, lite)
    if (s.axes.production && s.axes.cold && s.axes.native && s.axes.chained) s.interval *= 2;  // graduated
    s.interval = Math.min(s.interval, daysLeft);                  // never schedule past the trip
    s.ease = Math.min(2.8, s.ease + 0.05);
  } else {
    s.streak = 0; s.lapses++; s.lastMiss = todayStr();
    s.interval = 1; s.ease = Math.max(1.3, s.ease - 0.2);
  }
  s.due = _dateAdd(todayStr(), s.interval);
}
// per-phrase strength (0-100) = maturity × recency.
//   recency  : retrievability decaying from the LAST CORRECT recall over the item's stability
//   maturity : how cemented the memory is (a phrase seen right once is fragile, not 100%)
//   production mastery lifts the ceiling — cold recall counts for more than recognition.
function itemStrength(s) {
  if (!s || s.exposures < 1) return 0;
  const iv = Math.max(1, s.interval || 1);
  const days = Math.max(0, _daysAgo(s.lastCorrect || s.lastSeen));
  const recency = Math.exp(-days / iv);
  let maturity = iv / (iv + 5);                                   // 0 reps→low, grows as interval builds
  if (s.axes && s.axes.production) maturity += (1 - maturity) * 0.3;
  return 100 * maturity * recency;
}

/* ---------- review selection (M2 — pre-SRS recency heuristic; SM-2 arrives in M3) ---------- */
function _daysAgo(dateStr) {
  if (!dateStr) return Infinity;
  return Math.floor((Date.now() - new Date(dateStr + "T00:00:00").getTime()) / 864e5);
}
// trip-wide review pool: items whose SRS due date has arrived (most overdue first).
// minDays=0 forces "everything seen" (pure-review fallback). Pre-SRS entries use recency.
function dueForReview(minDays) {
  const today = todayStr();
  return (ALL_ITEMS || [])
    .filter(it => {
      const s = learnPeek(it); if (!s || s.exposures < 1) return false;
      if (minDays === 0) return true;
      if (s.due) return s.due <= today;
      return _daysAgo(s.lastSeen) >= (minDays == null ? 3 : minDays);
    })
    .sort((a, b) => {
      const da = learnPeek(a).due || "9999-99-99", db = learnPeek(b).due || "9999-99-99";
      return da < db ? -1 : da > db ? 1 : 0;                     // most overdue first
    });
}
// persistent mistakes: phrases you've missed and not yet re-mastered (2 correct in a row clears it).
// Stays across days until fixed — this is the standing "practice your mistakes" collection.
function mistakesPool() {
  return (ALL_ITEMS || []).filter(it => {
    const s = learnPeek(it); return s && s.lapses > 0 && s.streak < 2;
  });
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
  ["present"],                                                  // 0    first sight — teach, never test
  ["mc_es2en", "listen_choice", "sound_choice"],                // 1-2  recognition (incl. hear-and-pick)
  ["build", "fill_blank", "audio_cloze", "ear_build", "reply"], // 3-4  scaffolded production (mc_en2es retired §7.0)
  ["type_translation", "listen_type", "speak_it", "ear_build"]  // 5+   cold production (ear_build: more distractors)
];

function _speechSupported() { return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
function _wordCount(item) { return item.es.trim().split(/\s+/).length; }
function _modeFeasible(mode, item) {
  const n = _wordCount(item);
  if (mode === "build") return n >= 4 && n <= 8;   // §1b.3: no tap-to-build under 4 tokens
  if (mode === "fill_blank") return n >= 3;        // §1b.3: no fill-in-the-blank under 3 tokens
  if (mode === "speak_it") return _speechSupported();  // M4: only where Web Speech exists (else the rung uses type/listen)
  if (mode === "audio_cloze") return n >= 3;       // hear the phrase, type one missing word — needs a sentence
  if (mode === "sound_choice") return n >= 2;      // needs a frame around the blanked word (renderer verifies a distractor exists)
  if (mode === "ear_build") return n >= 4 && n <= 8;   // same tile constraints as build
  if (mode === "reply") return !!item.replyTo;     // §7.1: dormant until replyTo is authored (Phase-3)
  return true;
}
function _tierOfType(type) {
  for (let i = 0; i < LADDER.length; i++) if (LADDER[i].includes(type)) return i;
  return 1;
}
/* §6 variety rule (2026-07-20): an item's consecutive sessions never repeat the same
   exercise type at the same rung. The learn record remembers the last graded mode
   served (lm), its tier (lmt) and the session counter it was served in (lms); a LATER
   session excludes that mode at that tier whenever an alternative exists. Within one
   session the requeue rules govern instead. state.sessionSeq ticks once per composed
   session (lesson.js). */
function _varietyDrop(list, s, tier) {
  if (!s || s.lm == null || s.lmt !== tier) return list;
  if (s.lms != null && s.lms === (state.sessionSeq || 0)) return list;
  const trimmed = list.filter(m => m !== s.lm);
  return trimmed.length ? trimmed : list;
}
function _pickModeForTier(tier, item, s) {
  for (let t = Math.max(0, Math.min(tier, LADDER.length - 1)); t >= 1; t--) {
    const feasible = _varietyDrop(LADDER[t].filter(m => _modeFeasible(m, item)), s, t);
    if (feasible.length) return pick(feasible);
  }
  return "mc_es2en";                                // recognition always works
}
// §4.1: rung thresholds scale with the item's own difficulty (1-5, default 2),
// so short easy phrases graduate quickly and elaborate ones get more runway.
function _baseTier(exposures, difficulty) {
  const d = difficulty || 2;
  if (exposures >= 5 + d) return 3;   // cold production
  if (exposures >= 2 + d) return 2;   // scaffolded production
  return 1;                           // recognition
}

// §8.5 exercise-type families, for shaping session rhythm (recognition → production → audio).
// A preference only ever picks among modes the item's own tier already allows — never over-tests.
const MODE_FAMILY = {
  recognition: ["mc_es2en", "listen_choice", "sound_choice", "reply"],
  production:  ["build", "fill_blank", "audio_cloze", "type_translation", "speak_it"],
  audio:       ["listen_choice", "listen_type", "sound_choice", "audio_cloze", "ear_build"]
};
function _pickPreferred(tier, item, prefer, s) {
  const want = MODE_FAMILY[prefer]; if (!want) return null;
  let cand = [];
  for (let t = 1; t <= Math.max(1, Math.min(tier, LADDER.length - 1)); t++)
    LADDER[t].forEach(m => { if (want.includes(m) && _modeFeasible(m, item)) cand.push(m); });
  if (s && s.lm != null && s.lms !== (state.sessionSeq || 0) && cand.filter(m => m !== s.lm).length)
    cand = cand.filter(m => m !== s.lm);    // variety rule, soft form for family steers
  return cand.length ? pick(cand) : null;   // null → caller falls back to the normal tier pick
}

// pick the graded mode for an item this session. opts.cap limits the max rung
// (first-pass cap, §4.1 — a lesson introducing new material never goes cold).
// opts.prefer (§8.5) softly steers toward a mode family when the tier allows one.
function chooseType(item, opts) {
  const s = learnPeek(item);
  const exp = s ? s.exposures : 0;
  let tier = _baseTier(exp, item.difficulty);
  if (s && s.streak === 0 && s.lapses > 0) tier = Math.max(1, tier - 1);  // rung-down after a recent miss
  const cap = opts && opts.cap;
  if (cap) tier = Math.min(tier, cap);
  let mode = null;
  if (opts && opts.prefer) mode = _pickPreferred(tier, item, opts.prefer, s);
  if (!mode) mode = _pickModeForTier(tier, item, s);
  if (s) { s.lm = mode; s.lmt = _tierOfType(mode); s.lms = state.sessionSeq || 0; }  // variety-rule memory
  return mode;
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
