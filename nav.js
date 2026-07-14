/* ---------- floating bottom tab bar ---------- */
// §3.1 tab map: Home = state + action only; Learn = the content library; Phrases = reference;
// Progress = reflection (trends, archive, tier). Quests dissolved — its jobs are category
// coverage (Learn) + the tier system (Progress).
const TABS = [
  { id: "home",     label: "Home",     icon: "house",         render: () => renderHome() },
  { id: "learn",    label: "Learn",    icon: "book-open",     render: () => renderLearn() },
  { id: "phrases",  label: "Phrases",  icon: "bookmark",      render: () => renderPhrasebook() },
  { id: "progress", label: "Progress", icon: "chart-line-up", render: () => renderProgress() }
];
function initTabbar() {
  const bar = document.getElementById("tabbar");
  if (!bar) return;
  bar.innerHTML = TABS.map(t => `<button class="tab" data-tab="${t.id}">${icon(t.icon, 23)}<span>${t.label}</span></button>`).join("");
  bar.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => navTo(b.dataset.tab)));
}
function navTo(tabId) { (TABS.find(t => t.id === tabId) || TABS[0]).render(); }
function showTabbar(active) {
  const bar = document.getElementById("tabbar");
  if (!bar) return;
  bar.classList.add("show");
  bar.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === active));
}
function hideTabbar() { const bar = document.getElementById("tabbar"); if (bar) bar.classList.remove("show"); }
