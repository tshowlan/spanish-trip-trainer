/* Supabase connection. The publishable key is meant to be public (it only
   allows the locked-down RPC functions in supabase_setup.sql), so it's safe
   to ship in the client. */
const SUPABASE_URL = "https://ijrpogqxbcacvcasdzco.supabase.co";
const SUPABASE_KEY = "sb_publishable_Xtb9sY3qDBCYJVlRZ90G7Q_RWlst5ZS";
// VAPID public key for web push (public by design; private key lives only in the edge function secret)
const VAPID_PUBLIC = "BEYdbCF7Fr9aPAWN4qIuPxYYI7QYJZ_-zjBjtSt9XtQJmkkmk-1x68SjXmOiXlnozhLcs6BxgvbJxklUtGgywAQ";

// build stamp: printed beside the SW version — a MISMATCH means the device is executing
// stale JavaScript regardless of what the worker claims (the 2026-07-26 vault saga).
const APP_BUILD = "v353";

/* STAGING BEFORE LIVE (Tom's process change, 2026-09-08): increments deploy GATED behind a
   staging switch (Profile > Test Lab > Staging). Tom flips it, plays the increment, and "ship"
   is his word - only then does the feature leave this list and reach the live app. */
const STAGED = {
  "door-swash": "The chapter door, upleveled: everything centered, 13 sessions under Chapter 1, the lighthouse with its lantern's glow between the title and the subtitle"
};
// SHIPPED (Tom, 2026-09-24, v344), chapter one and its surfaces: "chapter-flow" (chapter 1 = the words that get you by, thirteen
// sessions, chapter 2 = the four rooms, chapters render 1-4, the chapter door), "numbers-1" (numbers as an ear skill: the set card,
// the keypad, runs), "pairs-chain" (the listening board chain and the eight-note tune), "learn-peek" (the Learn drawer), "hero-start"
// (the action tile and Practice as buttons, the pulse, the strip), "enter-bloom" + "bloom-white" (the white bloom into a session),
// "gloss-tap" (the tap under heard lines in scenes), "review-door" (the scene door onto the path + the tilt).
// SHIPPED (Tom, 2026-09-13, v278): "journey-1" - the beginning of the journey (machine rooms, kit halves, no cold
// typing in chapter one, flat difficulty, rotating rungs, the anchored layout). isStaged("journey-1") now returns
// true for everyone: a feature not in the map is live.
function stagingOn() { try { return localStorage.getItem("sts_staging") === "1"; } catch (e) { return false; } }
// per-feature switches: with staging on, every staged feature is on unless Tom turned that one off
function stagedOff() { try { return JSON.parse(localStorage.getItem("sts_staging_off") || "[]"); } catch (e) { return []; } }
function setStagedOff(feature, off) { const list = stagedOff().filter(f => f !== feature); if (off) list.push(feature); try { localStorage.setItem("sts_staging_off", JSON.stringify(list)); } catch (e) {} }
// opt-in features (alternatives to compare) stay OFF until Tom turns them on; the rest are on with staging
const STAGED_OPT_IN = [];   // compare switches: off by default, on only when Tom flips them
function stagedOn() { try { return JSON.parse(localStorage.getItem("sts_staging_on") || "[]"); } catch (e) { return []; } }
function setStagedOn(feature, on) { const list = stagedOn().filter(f => f !== feature); if (on) list.push(feature); try { localStorage.setItem("sts_staging_on", JSON.stringify(list)); } catch (e) {} }
function isStaged(feature) {
  if (!(feature in STAGED)) return true;
  if (!stagingOn()) return false;
  return STAGED_OPT_IN.includes(feature) ? stagedOn().includes(feature) : !stagedOff().includes(feature);
}
