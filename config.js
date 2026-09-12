/* Supabase connection. The publishable key is meant to be public (it only
   allows the locked-down RPC functions in supabase_setup.sql), so it's safe
   to ship in the client. */
const SUPABASE_URL = "https://ijrpogqxbcacvcasdzco.supabase.co";
const SUPABASE_KEY = "sb_publishable_Xtb9sY3qDBCYJVlRZ90G7Q_RWlst5ZS";
// VAPID public key for web push (public by design; private key lives only in the edge function secret)
const VAPID_PUBLIC = "BEYdbCF7Fr9aPAWN4qIuPxYYI7QYJZ_-zjBjtSt9XtQJmkkmk-1x68SjXmOiXlnozhLcs6BxgvbJxklUtGgywAQ";

// build stamp: printed beside the SW version — a MISMATCH means the device is executing
// stale JavaScript regardless of what the worker claims (the 2026-07-26 vault saga).
const APP_BUILD = "v272";

/* STAGING BEFORE LIVE (Tom's process change, 2026-09-08): increments deploy GATED behind a
   staging switch (Profile > Test Lab > Staging). Tom flips it, plays the increment, and "ship"
   is his word - only then does the feature leave this list and reach the live app. */
const STAGED = {
  "gloss-tap":   "The 'What did that mean?' tap under heard lines in scenes",
  "review-door": "The review room's door: scene-ready tile + Practice line, and the six-week tilt",
  "journey-1":   "The beginning of the journey: machine rooms, kit halves, no cold typing in chapter one, flat difficulty within a lesson, finish-the-sentence rungs"
};
function stagingOn() { try { return localStorage.getItem("sts_staging") === "1"; } catch (e) { return false; } }
// per-feature switches: with staging on, every staged feature is on unless Tom turned that one off
function stagedOff() { try { return JSON.parse(localStorage.getItem("sts_staging_off") || "[]"); } catch (e) { return []; } }
function setStagedOff(feature, off) { const list = stagedOff().filter(f => f !== feature); if (off) list.push(feature); try { localStorage.setItem("sts_staging_off", JSON.stringify(list)); } catch (e) {} }
// opt-in features (alternatives to compare) stay OFF until Tom turns them on; the rest are on with staging
const STAGED_OPT_IN = [];
function stagedOn() { try { return JSON.parse(localStorage.getItem("sts_staging_on") || "[]"); } catch (e) { return []; } }
function setStagedOn(feature, on) { const list = stagedOn().filter(f => f !== feature); if (on) list.push(feature); try { localStorage.setItem("sts_staging_on", JSON.stringify(list)); } catch (e) {} }
function isStaged(feature) {
  if (!(feature in STAGED)) return true;
  if (!stagingOn()) return false;
  return STAGED_OPT_IN.includes(feature) ? stagedOn().includes(feature) : !stagedOff().includes(feature);
}
