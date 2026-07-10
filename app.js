/* app.js — entry point: boots the app and wires top-level routing.
   Engine, screens, content, and cloud live in their own files (see index.html load order). */

/* ============================== boot ============================== */
applyTheme();
applyDevFont();   // DEV-FONT-FLAG (remove after decision, spec §6)
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

// Flush progress to the cloud when the app is backgrounded or closed, so recent work is never
// stranded only on-device (e.g. before a reinstall). keepalive lets the request outlive the page.
// No-op unless opted in. visibilitychange fires on mobile app-switch; pagehide on tab/app close.
addEventListener("visibilitychange", () => { if (document.hidden) cloudSync({ keepalive: true }).catch(() => {}); });
addEventListener("pagehide", () => { cloudSync({ keepalive: true }).catch(() => {}); });
