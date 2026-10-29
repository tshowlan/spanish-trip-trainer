/* Supabase connection. The publishable key is meant to be public (it only
   allows the locked-down RPC functions in supabase_setup.sql), so it's safe
   to ship in the client. */
const SUPABASE_URL = "https://ijrpogqxbcacvcasdzco.supabase.co";
const SUPABASE_KEY = "sb_publishable_Xtb9sY3qDBCYJVlRZ90G7Q_RWlst5ZS";
// VAPID public key for web push (public by design; private key lives only in the edge function secret)
const VAPID_PUBLIC = "BEYdbCF7Fr9aPAWN4qIuPxYYI7QYJZ_-zjBjtSt9XtQJmkkmk-1x68SjXmOiXlnozhLcs6BxgvbJxklUtGgywAQ";

// build stamp: printed beside the SW version — a MISMATCH means the device is executing
// stale JavaScript regardless of what the worker claims (the 2026-07-26 vault saga).
const APP_BUILD = "v544";

/* STAGING BEFORE LIVE (Tom's process change, 2026-09-08): increments deploy GATED behind a
   staging switch (Profile > Test Lab > Staging). Tom flips it, plays the increment, and "ship"
   is his word - only then does the feature leave this list and reach the live app. */
const STAGED = {
  "mic-check": "Say it: the microphone check (auto-listen after the word, the ring, the match). PARKED: on iPhone it leaves playback on the quiet earpiece; off until the native app can own the audio route (Tom 10/8)",
  "learn-reset-swipe": "Learn tab: swipe a session row to the left and tap Reset to make it never seen (the lesson mark and its words' history cleared)",
  "sentences-2": "Chapter 2: Table sentences (fifteen sentences in seven frames; Para m\u00ed is the table's own frame) and the Counter amendment (\u00bfMe pone? \u00d72 in, the cortado Quiero and la cuenta out)",
  "sheet-rows": "The Review sheet's doors (Recommended, By scenario, The machine shop) in the Learn tab's row form; Recommended carries the down caret, opening the words due, when a review is picked",
};
// SHIPPED (Tom, 2026-10-28, v539): "splash-mark", the splash's lighthouse in the app icon's colours.
// SHIPPED (Tom, 2026-10-26, v524): "sentences-1", Counter sentences: fourteen sentences in five frames (Quiero, ¿Tiene?, ¿Hay?, ¿Me puede traer?, ¿Puedo?), built from the English with the Hint, heard and built, the exchange with near misses, typed; the summary line and six example words as its preview; GOOD TO KNOW notes under the built row; the silent forms (build from English, THEY SAY).
// SHIPPED (Tom, 2026-10-24, v490): "ask-review", a due ask comes back in Practice as a situation (Which one do you say? from its bank of six) and its sentence, never a translation.
// SHIPPED (Tom, 2026-10-23, v488): "ch1-three-words" (¿Qué tal?, Muy bien, No entiendo in chapter 1), "sounds-1" (Sounds you'll say, the honor-system Say it, its own ceremony ledger; the mic stays parked), "review-straight-in" (Practice with no Start or End card), "asks-2" (The asks · Part 2: Necesito, ¿Hay?, ¿Tiene?, ¿Puedo?), "tile-words" (the tile's kicker as the gold pill opening the words bubble).
// SHIPPED (Tom, 2026-10-23, v483): "photo-chips" (over the lit photo: the language chip as dark frosted glass, the streak a readout with a dark ring on the number and the flame, the dials' track a light white) and "splash-orange" (the arrival's aura in the icon's orange).
// SHIPPED (Tom, 2026-10-19, v459): "asks-1", The asks · Part 1 (Quiero, ¿Me puede traer?, ¿Dónde está?, ¿Cuánto cuesta?) with the B2 situations and the hairline hints.
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
