/* Supabase connection. The publishable key is meant to be public (it only
   allows the locked-down RPC functions in supabase_setup.sql), so it's safe
   to ship in the client. */
const SUPABASE_URL = "https://ijrpogqxbcacvcasdzco.supabase.co";
const SUPABASE_KEY = "sb_publishable_Xtb9sY3qDBCYJVlRZ90G7Q_RWlst5ZS";
// VAPID public key for web push (public by design; private key lives only in the edge function secret)
const VAPID_PUBLIC = "BEYdbCF7Fr9aPAWN4qIuPxYYI7QYJZ_-zjBjtSt9XtQJmkkmk-1x68SjXmOiXlnozhLcs6BxgvbJxklUtGgywAQ";

// build stamp: printed beside the SW version — a MISMATCH means the device is executing
// stale JavaScript regardless of what the worker claims (the 2026-07-26 vault saga).
const APP_BUILD = "v334";

/* STAGING BEFORE LIVE (Tom's process change, 2026-09-08): increments deploy GATED behind a
   staging switch (Profile > Test Lab > Staging). Tom flips it, plays the increment, and "ship"
   is his word - only then does the feature leave this list and reach the live app. */
const STAGED = {
  "gloss-tap":   "The 'What did that mean?' tap under heard lines in scenes",
  "review-door": "The review room's door: scene-ready tile + Practice line, and the six-week tilt",
  "bloom-white": "Entering a session, compare: a WHITE light (the loading page's daybreak) instead of the gold one",
  "hero-start": "Home: the action tile reads as a button (a pressed edge, a gold arrow, the whole card sinks on press)",
  "enter-bloom": "Entering a session: the tapped tile or row lights up and the light expands to carry you in (Home tile, Practice options, Learn rows)",
  "learn-peek": "Learn tab: one tap starts a lesson, the arrow on the right opens what's inside; parts read 'Part 1'; quitting returns to Learn",
  "numbers-1": "Numbers as an ear skill: the set card, the keypad (hear it / say it / the bills), runs of three as the lap",
  "pairs-chain": "Matching boards: the sound that plays is already selected and chains to the next; eight-note tune from a tone lower; Continue in the bottom bar",
  "chapter-flow": "The chapter flow: chapter 1 = the words (eleven sessions), chapter 2 = the four rooms, chapters render 1-4"
};
// SHIPPED (Tom, 2026-09-13, v278): "journey-1" - the beginning of the journey (machine rooms, kit halves, no cold
// typing in chapter one, flat difficulty, rotating rungs, the anchored layout). isStaged("journey-1") now returns
// true for everyone: a feature not in the map is live.
function stagingOn() { try { return localStorage.getItem("sts_staging") === "1"; } catch (e) { return false; } }
// per-feature switches: with staging on, every staged feature is on unless Tom turned that one off
function stagedOff() { try { return JSON.parse(localStorage.getItem("sts_staging_off") || "[]"); } catch (e) { return []; } }
function setStagedOff(feature, off) { const list = stagedOff().filter(f => f !== feature); if (off) list.push(feature); try { localStorage.setItem("sts_staging_off", JSON.stringify(list)); } catch (e) {} }
// opt-in features (alternatives to compare) stay OFF until Tom turns them on; the rest are on with staging
const STAGED_OPT_IN = ["bloom-white"];   // compare switches: off by default, on only when Tom flips them
function stagedOn() { try { return JSON.parse(localStorage.getItem("sts_staging_on") || "[]"); } catch (e) { return []; } }
function setStagedOn(feature, on) { const list = stagedOn().filter(f => f !== feature); if (on) list.push(feature); try { localStorage.setItem("sts_staging_on", JSON.stringify(list)); } catch (e) {} }
function isStaged(feature) {
  if (!(feature in STAGED)) return true;
  if (!stagingOn()) return false;
  return STAGED_OPT_IN.includes(feature) ? stagedOn().includes(feature) : !stagedOff().includes(feature);
}
