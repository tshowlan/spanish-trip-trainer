/* ---------- floating bottom tab bar ---------- */
// §3.1 tab map: Home = state + action; Learn = content library + Phrases (folded in as a view);
// Progress = reflection (trends, archive, tier); Profile = settings/reminder/account. Quests and
// Phrases both dissolved as tabs (Phrases lives on inside Learn).
const TABS = [
  { id: "home",     label: "Home",     icon: "house",         render: () => renderHome() },
  { id: "learn",    label: "Learn",    icon: "book-open",     render: () => renderLearn() },
  { id: "progress", label: "Progress", icon: "chart-line-up", render: () => renderProgress() },
  { id: "profile",  label: "Profile",  icon: "user",          render: () => renderProfile() }
];
function initTabbar() {
  const bar = document.getElementById("tabbar");
  if (!bar) return;
  // the light is ONE element that travels (decisions 2026-07-17), never per-tab decoration that swaps
  bar.innerHTML = `<div class="navlight"><span class="nl-glow"></span><span class="nl-notch"></span></div>`
    + TABS.map(t => `<button class="tab" data-tab="${t.id}">${icon(t.icon, 23)}<span>${t.label}</span></button>`).join("");
  bar.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => navTo(b.dataset.tab)));
}
const _reduceMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
// slide the nav light onto the active tab; returns that tab's centre in VIEWPORT x (the bloom's anchor)
function _positionNavLight(active) {
  const bar = document.getElementById("tabbar"); if (!bar) return null;
  const light = bar.querySelector(".navlight"), btn = bar.querySelector(`.tab[data-tab="${active}"]`);
  if (!light || !btn) return null;
  const barR = bar.getBoundingClientRect(), btnR = btn.getBoundingClientRect(), cs = getComputedStyle(bar);
  // left:0 sits at the PADDING BOX edge, which is inset by the border only (the padding is inside it) —
  // adding paddingLeft here shifted the whole light one padding-width to the left.
  const originX = barR.left + (parseFloat(cs.borderLeftWidth) || 0);
  const centre = btnR.left + btnR.width / 2;
  light.style.transform = `translateX(${(centre - originX - light.offsetWidth / 2).toFixed(1)}px)`;
  return centre;
}
/* THE ONE LIGHT (Tom 2026-10-02): the app has a single candle. Its source sits in the bottom-left corner on Home and under the active
   tab everywhere else, and when the tab changes it GLIDES to its new place a beat behind the nav line, the flame following the candle
   as someone walks with it. It is two layers: a broad WASH that never moves on its own, and a small CORE at the source that breathes
   and flickers, so the flame lives at the source and the page's background holds still. (It replaces July's .bloom and the 9/29
   stationary corner candle.) */
function _setBloom(active, anchorX) {
  const old = document.querySelector(".bloom"); if (old) old.remove();
  ensureCandle();
  const c = document.querySelector(".tab-candle"), pos = c && c.querySelector(".candle-pos"); if (!pos) return;
  const r = c.getBoundingClientRect(); if (!r.width) return;
  const a = active === "home" ? -0.14 * r.width : (anchorX != null ? anchorX - r.left : r.width / 2);   // Home: the corner, as its ground always was
  const tx = (a - r.width / 2).toFixed(1) + "px";
  if (!c.dataset.placed) { pos.style.transition = "none"; pos.style.setProperty("--tx", tx); void pos.offsetWidth; pos.style.transition = ""; c.dataset.placed = "1"; }   // no glide on first paint
  else pos.style.setProperty("--tx", tx);
}
function navTo(tabId) {
  const tab = TABS.find(t => t.id === tabId) || TABS[0];
  const app = document.getElementById("app");
  if (!app || _reduceMotion()) return tab.render();
  app.classList.add("tab-fade");                       // content crossfades while the light glides
  setTimeout(() => { tab.render(); app.classList.remove("tab-fade"); }, 180);
}
function showTabbar(active) {
  document.body.classList.remove("in-runner");   // every tab surface restores the rail
  const bar = document.getElementById("tabbar");
  if (active !== "home" && typeof clearHomeAtmo === "function") clearHomeAtmo();   // tear down the home photo/glow off-home
  ensureCandle();                                                                  // ONE corner light under every tab, made once, never restarted (Tom 9/29)
  if (!bar) return;
  bar.classList.add("show");
  bar.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === active));
  // measure a frame later: rects taken in the same tick the bar becomes visible are stale,
  // which anchored the bloom to garbage x on first paint (light landing off-column)
  const place = () => _setBloom(active, _positionNavLight(active));   // the nav line and the one light take their places
  requestAnimationFrame(place); setTimeout(place, 80);                  // the timer is the fallback when frames are not running (a backgrounded tab); placing twice is harmless
}
function ensureCandle() {
  if (document.querySelector(".tab-candle")) return;
  const c = document.createElement("div"); c.className = "tab-candle"; c.setAttribute("aria-hidden", "true");
  c.innerHTML = '<div class="candle-pos"><div class="candle-wash"></div><div class="candle-core"></div></div>';
  document.body.insertBefore(c, document.body.firstChild);
}
function hideTabbar() {
  if (typeof clearHomeAtmo === "function") clearHomeAtmo();
  const bar = document.getElementById("tabbar"); if (bar) bar.classList.remove("show");
}
