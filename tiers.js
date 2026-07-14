/* ============================== STATUS TIERS ==============================
   XP→Status migration spec §2. Five permanent, account-level tiers — airline-status
   mental model: earned through milestones, never lost, understated. Computed client-side
   (this is a PWA); the value rides the synced progress blob like everything else.
   NOTE: a proper server-side daily evaluation (spec §2.2) would let the sustained-days
   paths see days the app wasn't opened; here we evaluate over recorded scoreHistory, which
   is conservative (a gap breaks a run) but never dishonest. */
const TIERS = ["Newcomer", "Backpacker", "Culturist", "Ambassador", "World Citizen"];
const _tierIdx = t => Math.max(0, TIERS.indexOf(t || "Newcomer"));

function completedTrips() { return state.archive || []; }
function _dayGap(a, b) { return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 864e5); }

// Longest run of CONSECUTIVE calendar days in recorded history where pred(entry) holds,
// plus the average Momentum across that run. { days, avgMom }.
function _maxSustained(pred) {
  const h = (state.scoreHistory || []).slice().sort((x, y) => (x.date < y.date ? -1 : 1));
  let best = { days: 0, avgMom: 0 };
  let i = 0;
  while (i < h.length) {
    if (!pred(h[i])) { i++; continue; }
    let j = i, momSum = 0, prev = null;
    while (j < h.length && pred(h[j]) && (prev === null || _dayGap(prev, h[j].date) === 1)) {
      momSum += (h[j].momentum || 0); prev = h[j].date; j++;
    }
    const days = j - i;
    if (days > best.days) best = { days, avgMom: days ? momSum / days : 0 };
    i = Math.max(j, i + 1);
  }
  return best;
}

/* the highest tier any one qualifying condition is met for (spec §2.1). Pure read of state. */
function earnedTier() {
  const trips = completedTrips();
  const tripsAt = r => trips.filter(t => t.readinessAtDeparture >= r).length;
  const langsAt = r => new Set(trips.filter(t => t.readinessAtDeparture >= r).map(t => t.language)).size;
  let t = 0;
  // Backpacker: a trip finished ≥70, OR 21 consecutive days at ≥70 readiness with avg Momentum ≥50
  const bpSust = _maxSustained(e => e.readiness >= 70);
  if (tripsAt(70) >= 1 || (bpSust.days >= 21 && bpSust.avgMom >= 50)) t = Math.max(t, 1);
  // Culturist: a trip finished ≥85, OR (after any completed trip) 60 days at ≥75 retention, avg Momentum ≥40
  const cuSust = _maxSustained(e => e.retention >= 75);
  if (tripsAt(85) >= 1 || (trips.length >= 1 && cuSust.days >= 60 && cuSust.avgMom >= 40)) t = Math.max(t, 2);
  // Ambassador: Backpacker-level (≥70) in a second language, OR two trips finished ≥85
  if (langsAt(70) >= 2 || tripsAt(85) >= 2) t = Math.max(t, 3);
  // World Citizen: Culturist-level (≥85) in two+ languages AND two+ completed trips
  if (langsAt(85) >= 2 && trips.length >= 2) t = Math.max(t, 4);
  return t;
}

// Effective tier = max(stored, earned, legacy floor). Never decreases.
function currentTier() {
  return TIERS[Math.max(_tierIdx(state.tier), earnedTier(), _tierIdx(state.legacyTierFloor))];
}

/* one-time XP→legacy-floor grandfather (spec §4.1) so nobody is demoted to Newcomer.
   Small user base → eyeballed thresholds standing in for P40/P85 of nonzero XP. Runs while XP
   still exists (before its removal); the floor is frozen once and never recomputed. */
function migrateXpToFloor() {
  if (state.legacyTierFloor) return;
  const xp = state.xp || 0;
  state.legacyTierFloor = xp > 450 ? "Ambassador" : xp > 120 ? "Culturist" : xp > 0 ? "Backpacker" : "Newcomer";
  state.legacyXpAtMigration = xp;   // audit trail before XP is deleted
  if (!state.tier) { state.tier = state.legacyTierFloor; state.tierAchievedAt = new Date().toISOString(); }
  if (state.legacyTierFloor !== "Newcomer") state.needsMigrationCard = state.needsMigrationCard !== false;
  save();
}

/* Evaluate + persist. Returns the tier name if this call EARNED a new tier (for the tier-up moment),
   else null. Legacy-floor jumps are surfaced by the migration card, not the tier-up moment. */
function applyTierUpdate() {
  const before = _tierIdx(state.tier);
  const now = currentTier();
  const nowIdx = _tierIdx(now);
  if (nowIdx > before) {
    state.tier = now; state.tierAchievedAt = new Date().toISOString();
    const earnedByFloor = nowIdx <= _tierIdx(state.legacyTierFloor);
    if (!earnedByFloor) state.pendingTierUp = now;   // a genuinely earned jump → queue the full-screen moment
    save();
    return earnedByFloor ? null : now;
  }
  return null;
}

/* nearest unmet condition, as a single sentence for the profile (spec §2.3) — milestones, not meters */
function nextTierCondition() {
  const i = _tierIdx(currentTier());
  return [
    "Reach 70% Trip Readiness at your trip date, or hold 70%+ for three weeks, to reach Backpacker.",
    "Finish a trip at 85%+ Readiness to reach Culturist.",
    "Finish a second trip at 85%+ (or reach 70% in another language) to reach Ambassador.",
    "Reach 85%+ across two languages and two trips to reach World Citizen.",
    "World Citizen — the top tier. Every trip from here is a victory lap."
  ][i];
}
if (typeof module !== "undefined") module.exports = { TIERS, earnedTier, currentTier, migrateXpToFloor, applyTierUpdate, nextTierCondition };
