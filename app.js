/* app.js — entry point: boots the app and wires top-level routing.
   Engine, screens, content, and cloud live in their own files (see index.html load order). */

/* ============================== boot ============================== */
initSplash();
migrateTrips();
rebuildDeck();
initTabbar();
$("#gear").addEventListener("click", renderSettings);
handleAuthRedirect().then(handled => {
  if (!handled) { if (!state.profile) renderOnboarding(); else renderHome(); }
  runSplash();                       // play the intro once the first screen is rendered
});
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
