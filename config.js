/* Supabase connection. The publishable key is meant to be public (it only
   allows the locked-down RPC functions in supabase_setup.sql), so it's safe
   to ship in the client. */
const SUPABASE_URL = "https://ijrpogqxbcacvcasdzco.supabase.co";
const SUPABASE_KEY = "sb_publishable_Xtb9sY3qDBCYJVlRZ90G7Q_RWlst5ZS";
// VAPID public key for web push (public by design; private key lives only in the edge function secret)
const VAPID_PUBLIC = "BEYdbCF7Fr9aPAWN4qIuPxYYI7QYJZ_-zjBjtSt9XtQJmkkmk-1x68SjXmOiXlnozhLcs6BxgvbJxklUtGgywAQ";

// build stamp: printed beside the SW version — a MISMATCH means the device is executing
// stale JavaScript regardless of what the worker claims (the 2026-07-26 vault saga).
const APP_BUILD = "v440";

/* STAGING BEFORE LIVE (Tom's process change, 2026-09-08): increments deploy GATED behind a
   staging switch (Profile > Test Lab > Staging). Tom flips it, plays the increment, and "ship"
   is his word - only then does the feature leave this list and reach the live app. */
const STAGED = {
  "mic-check": "Say it: the microphone check (auto-listen after the word, the ring, the match). PARKED: on iPhone it leaves playback on the quiet earpiece; off until the native app can own the audio route (Tom 10/8)",
  "sounds-1": "Chapter 1: Sounds you'll say, after First words \u00b7 Part 2 (nine key sounds on cards, the wall with decoys, the run of nine said out loud)",
  "asks-1": "Chapter 2 opens with The asks \u00b7 Part 1: Quiero, \u00bfMe puede traer?, \u00bfD\u00f3nde est\u00e1?, \u00bfCu\u00e1nto cuesta? (cards, the board, Which one do you say?, build the sentence, the listening board)",
  "ch1-three-words": "Chapter 1, three words (chat 10/3): \u00bfQu\u00e9 tal? takes Pase's seat in Words you'll hear; Muy bien takes Adi\u00f3s's seat and No entiendo joins as the eighth in First words \u00b7 Part 2",
};
// SHIPPED (Tom, 2026-10-03, v403): "chapter-1-adds" (Days you'll read as chapter 1's fourteenth session, after Signs; zumo and te in Counter
// words), "sign-plates" (the read sessions show signs as plates: door plate on dark, enamel on light; read the sign then act, which sign, the
// timetable stories, the sign wall and the week in order), "ear-sessions" (Best with sound on the tile and the Learn row; the escape's way
// back, returning next new day; hear sessions listen first, read sessions read only).
// SHIPPED (Tom, 2026-09-25, v359): "door-swash", the upleveled chapter door (centered, the count under Chapter 1, the lighthouse with its
// lantern's glow, Source Serif 4 title and line).
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
const STAGED_OPT_IN = ["mic-check"];   // (the two tile looks of 10/3 retired: Tom kept the ring)   // compare switches: off by default, on only when Tom flips them
function stagedOn() { try { return JSON.parse(localStorage.getItem("sts_staging_on") || "[]"); } catch (e) { return []; } }
function setStagedOn(feature, on) { const list = stagedOn().filter(f => f !== feature); if (on) list.push(feature); try { localStorage.setItem("sts_staging_on", JSON.stringify(list)); } catch (e) {} }
function isStaged(feature) {
  if (!(feature in STAGED)) return true;
  if (!stagingOn()) return false;
  return STAGED_OPT_IN.includes(feature) ? stagedOn().includes(feature) : !stagedOff().includes(feature);
}
