/* ---------- floating bottom tab bar ---------- */
const TABS = [
  { id: "home",     label: "Learn",    icon: "house",         render: () => renderHome() },
  { id: "quests",   label: "Quests",   icon: "trophy",        render: () => renderQuests() },
  { id: "phrases",  label: "Phrases",  icon: "book-open",     render: () => renderPhrasebook() },
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
