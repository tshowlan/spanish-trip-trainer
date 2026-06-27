/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const sample = (arr, n) => shuffle(arr).slice(0, n);
const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim();

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._tmo); t._tmo = setTimeout(() => t.classList.remove("show"), 2600);
}
function renderTopbar() {
  $("#stat-streak").textContent = state.streak;
  $("#stat-xp").textContent = state.xp;
  $("#stat-gems").textContent = state.gems;
}
