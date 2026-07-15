/* app.js — entry point: boots the app and wires top-level routing.
   Engine, screens, content, and cloud live in their own files (see index.html load order). */

/* ============================== boot ============================== */
applyTheme();
initSplash();
migrateTrips();
migrateScoring();
migrateItemIds();     // remap SRS keys to lesson-independent ids (pack:slug) — before deck/scores read them
rebuildDeck();
migrateXpToFloor();   // one-time XP→legacy-tier-floor grandfather (§4.1); no-op once migrated
checkTripCompletion();// §5.1: archive a trip whose date has passed (also runs tier eval)
applyTierUpdate();    // evaluate status tier on app open (§2.2)
initTabbar();
const _lf = $("#lang-flag"); if (_lf) _lf.addEventListener("click", renderTrips);   // §3.2 header language switcher
// Robust boot: a render/auth error must NEVER strand the user on the splash. runSplash() always
// runs (even on throw), so worst case they still land on a usable screen. This defends against
// mid-deploy version skew (new index.html + a stale cached script) bricking startup.
function _bootRender(handled) {
  try { if (!handled) { if (!state.profile) renderOnboarding(); else renderHome(); } }
  catch (e) { console.error("Tripfluent: boot render failed", e); try { renderOnboarding(); } catch (_) {} }
}
handleAuthRedirect()
  .then(handled => { _bootRender(handled); })
  .catch(e => { console.error("Tripfluent: auth redirect failed", e); _bootRender(false); })
  .finally(() => { runSplash(); cloudSync().catch(() => {}); });
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});

// Flush progress to the cloud when the app is backgrounded or closed, so recent work is never
// stranded only on-device (e.g. before a reinstall). keepalive lets the request outlive the page.
// No-op unless opted in. visibilitychange fires on mobile app-switch; pagehide on tab/app close.
addEventListener("visibilitychange", () => { if (document.hidden) cloudSync({ keepalive: true }).catch(() => {}); });
addEventListener("pagehide", () => { cloudSync({ keepalive: true }).catch(() => {}); });
