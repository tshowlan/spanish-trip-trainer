/* ====================== Spanish Trip Trainer — engine ====================== */

const STORE_KEY = "sts_state_v1";
const todayStr = () => new Date().toISOString().slice(0, 10);

// Per-destination fields live in state.trips[<dest>]; the active trip's copy is
// mirrored at the top level. Global fields (streak, gems, history, account,
// cloud, sound, reminders) are shared across all destinations.
const DEFAULT_STATE = { xp: 0, gems: 0, streak: 0, lastActive: null, lessons: {}, history: [], sound: true, profile: null, topicStats: {}, cloud: null, account: null, reminders: { enabled: false, morning: 480, evening: 1290 }, trips: {}, active: null };
const DEST_FIELDS = ["profile", "lessons", "topicStats", "xp"];
let state = load();

function load() {
  try { return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(STORE_KEY))); }
  catch { return Object.assign({}, DEFAULT_STATE); }
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
