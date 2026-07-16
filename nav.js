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
  bar.innerHTML = TABS.map(t => `<button class="tab" data-tab="${t.id}">${icon(t.icon, 23)}<span>${t.label}</span></button>`).join("");
  bar.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => navTo(b.dataset.tab)));
}
function navTo(tabId) { (TABS.find(t => t.id === tabId) || TABS[0]).render(); }
function showTabbar(active) {
  const bar = document.getElementById("tabbar");
  if (active !== "home" && typeof clearHomeAtmo === "function") clearHomeAtmo();   // tear down the home photo/glow off-home
  if (!bar) return;
  bar.classList.add("show");
  bar.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === active));
}
function hideTabbar() {
  if (typeof clearHomeAtmo === "function") clearHomeAtmo();
  const bar = document.getElementById("tabbar"); if (bar) bar.classList.remove("show");
}
