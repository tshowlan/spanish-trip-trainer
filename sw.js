/* Network-first service worker.
   Online → always fetch the latest (so updates land without reinstalling).
   Offline → fall back to the cache (works on the plane / no signal).
   Cross-origin requests (e.g. Supabase) are left untouched. */
const CACHE = "sts-v255";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./fonts.css",
  "./fonts/plus-jakarta-sans.woff2", "./fonts/inter.woff2", "./fonts/playfair-italic-500.woff2", "./fonts/plus-jakarta-sans-italic.woff2",
  "./config.js", "./curriculum.js", "./content_mx.js", "./messages.js",
  "./state.js", "./engine.js", "./audio.js", "./ui.js", "./srs.js", "./weights.js", "./scoring.js", "./tiers.js", "./charts.js", "./nav.js",
  "./screen-onboarding.js", "./screen-home.js", "./screen-quests.js", "./screen-phrasebook.js",
  "./screen-progress.js", "./screen-settings.js", "./screen-learn.js",
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
    // cache:"no-cache" bypasses the HTTP cache's TTL (GitHub Pages serves max-age=600 —
    // for 10 minutes after a deploy a plain fetch returns STALE files; ETag revalidation
    // costs a 304 and always lands fresh). The recurring "version says new, code is old".
    fetch(e.request, { cache: "no-cache" })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
  );
});

// the splash version line asks the RUNNING worker (cache names lie during an update:
// the incoming SW pre-creates its cache while the old one still serves the page)
self.addEventListener("message", e => {
  if (e.data === "version" && e.source) e.source.postMessage({ version: CACHE });
});

// ---- push reminders ----
self.addEventListener("push", e => {
  // short title (fits one line) + full body (wraps); iOS appends "from Tripfluent" itself.
  let d = { title: "Phrases fading", body: "A short review brings them back." };
  try { if (e.data) d = Object.assign(d, e.data.json()); } catch { if (e.data) d.body = e.data.text(); }
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body || undefined, icon: "./icon.svg", badge: "./icon.svg", tag: "stt-reminder", renotify: true
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow("./index.html");
  }));
});
