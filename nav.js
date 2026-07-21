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
/* The screen atmosphere is the nav light scaled up, blooming from the active tab's x at the bottom edge.
   Home keeps its own designed ground glow + photo for now; its anchor adopts this shared one at home's
   next revision (flagged 2026-07-17), so home is the one tab that opts out here. */
function _setBloom(active, anchorX) {
  let bloom = document.querySelector(".bloom");
  if (active === "home") { if (bloom) bloom.remove(); return; }
  if (!bloom) {
    bloom = document.createElement("div"); bloom.className = "bloom";
    document.body.insertBefore(bloom, document.body.firstChild);
    if (anchorX != null) bloom.style.transform = `translateX(${(anchorX - 620).toFixed(1)}px)`;   // no glide on first paint
    return;
  }
  if (anchorX != null) bloom.style.transform = `translateX(${(anchorX - 620).toFixed(1)}px)`;
}
function navTo(tabId) {
  const tab = TABS.find(t => t.id === tabId) || TABS[0];
  const app = document.getElementById("app");
  if (!app || _reduceMotion()) return tab.render();
  app.classList.add("tab-fade");                       // content crossfades while the light glides
  setTimeout(() => { tab.render(); app.classList.remove("tab-fade"); }, 180);
}
function showTabbar(active) {
  const bar = document.getElementById("tabbar");
  if (active !== "home" && typeof clearHomeAtmo === "function") clearHomeAtmo();   // tear down the home photo/glow off-home
  if (!bar) return;
  bar.classList.add("show");
  bar.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === active));
  // measure a frame later: rects taken in the same tick the bar becomes visible are stale,
  // which anchored the bloom to garbage x on first paint (light landing off-column)
  requestAnimationFrame(() => _setBloom(active, _positionNavLight(active)));
}
function hideTabbar() {
  if (typeof clearHomeAtmo === "function") clearHomeAtmo();
  const bloom = document.querySelector(".bloom"); if (bloom) bloom.remove();
  const bar = document.getElementById("tabbar"); if (bar) bar.classList.remove("show");
}
