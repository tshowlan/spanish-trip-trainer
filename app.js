/* app.js — entry point: boots the app and wires top-level routing.
   Engine, screens, content, and cloud live in their own files (see index.html load order). */

/* ============================== boot ============================== */
migrateTrips();
rebuildDeck();
$("#gear").addEventListener("click", renderSettings);
$("#group").addEventListener("click", renderGroup);
handleAuthRedirect().then(handled => {
  if (handled) return;
  if (!state.profile) renderOnboarding(); else renderHome();
});
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
