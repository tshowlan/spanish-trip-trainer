/* ====================== Spanish Trip Trainer — engine ====================== */

const STORE_KEY = "sts_state_v1";
/* A "day" is the USER'S local day, never UTC's. Building day strings from toISOString() rolled the day
   over mid-evening for negative UTC offsets (US evening practice logged as tomorrow), which collapsed and
   skipped days: streaks stuck near 1, and _dateAdd could land a day early. All day strings go through
   dayStr(); stored session `at` values stay full UTC timestamps and convert via sessionDay(). */
const dayStr = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayStr = () => dayStr(new Date());
const daysAgoStr = n => dayStr(new Date(Date.now() - n * 864e5));
const sessionDay = s => dayStr(new Date((s && s.at) || Date.now()));

// Per-destination fields live in state.trips[<dest>]; the active trip's copy is
// mirrored at the top level. Global fields (streak, gems, history, account,
// cloud, sound, reminders) are shared across all destinations.
const DEFAULT_STATE = { streak: 0, lastActive: null, lessons: {}, history: [], sound: true, profile: null, topicStats: {}, cloud: null, account: null, reminders: { enabled: false, morning: 480, evening: 1290 }, trips: {}, active: null, saved: [], goalsDone: {}, sessions: [], scoresCache: null, learn: {}, theme: "system", archive: [], tier: null, tierAchievedAt: null, legacyTierFloor: null, scoreRevealSeen: false };
const DEST_FIELDS = ["profile", "lessons", "topicStats", "sessions", "learn"];
let state = load();

function load() {
  try { return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(STORE_KEY))); }
  catch { return Object.assign({}, DEFAULT_STATE); }
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
