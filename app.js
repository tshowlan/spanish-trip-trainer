/* app.js — entry point: boots the app and wires top-level routing.
   Engine, screens, content, and cloud live in their own files (see index.html load order). */

/* ============================== boot ============================== */
applyTheme();
initSplash();
migrateTrips();
migrateScoring();
rebuildDeck();
initTabbar();
$("#gear").addEventListener("click", renderSettings);
$("#profile").addEventListener("click", renderProfile);
handleAuthRedirect().then(handled => {
  if (!handled) { if (!state.profile) renderOnboarding(); else renderHome(); }
  runSplash();                       // play the intro once the first screen is rendered
  cloudSync().catch(() => {});       // refresh the notification snapshot on app open (no-op unless opted in)
});
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
