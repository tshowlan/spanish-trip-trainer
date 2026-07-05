/* Network-first service worker.
   Online → always fetch the latest (so updates land without reinstalling).
   Offline → fall back to the cache (works on the plane / no signal).
   Cross-origin requests (e.g. Supabase) are left untouched. */
const CACHE = "sts-v40";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./fonts.css",
  "./fonts/plus-jakarta-sans.woff2", "./fonts/inter.woff2", "./fonts/playfair-italic-500.woff2",
  "./config.js", "./curriculum.js", "./content_mx.js", "./messages.js",
  "./state.js", "./engine.js", "./audio.js", "./ui.js", "./srs.js", "./scoring.js", "./nav.js",
  "./screen-onboarding.js", "./screen-home.js", "./screen-quests.js", "./screen-phrasebook.js",
  "./screen-progress.js", "./screen-settings.js",
  "./lesson.js", "./cloud.js", "./accounts.js", "./push.js", "./trips.js", "./app.js",
  "./manifest.webmanifest", "./icon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;          // don't intercept Supabase etc.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
  );
});

// ---- push reminders ----
self.addEventListener("push", e => {
  let d = { title: "Spanish Trip Trainer", body: "Time for a quick lesson 🇪🇸" };
  try { if (e.data) d = Object.assign(d, e.data.json()); } catch { if (e.data) d.body = e.data.text(); }
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body, icon: "./icon.svg", badge: "./icon.svg", tag: "stt-reminder", renotify: true
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow("./index.html");
  }));
});
