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
// theme: "system" follows the OS (prefers-color-scheme); "light"/"dark" force it.
function applyTheme() {
  const root = document.documentElement;
  const t = state.theme || "system";
  if (t === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", t);
  const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && bg) meta.setAttribute("content", bg);
}
function renderTopbar() {
  $("#stat-streak").textContent = state.streak;
  const brand = $("#topbar-brand");
  if (brand) brand.innerHTML = wordmark(22);
  const flag = $("#lang-flag");
  if (flag) flag.textContent = destInfo(state.profile && state.profile.destination).flag;
  const xp = $("#stat-xp"); if (xp) xp.textContent = state.xp;
  const gems = $("#stat-gems"); if (gems) gems.textContent = state.gems;
}

/* ---------- Phosphor icons (inline SVG, one consistent family) ---------- */
const PH = {
  "gear": "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z",
  "users-three": "M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z",
  "x": "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z",
  "caret-left": "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z",
  "caret-right": "M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z",
  "house": "M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z",
  "arrows-clockwise": "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,0,1,16,0Z",
  "trophy": "M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z",
  "book-open": "M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z",
  "chart-line-up": "M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.69l50.34-50.35a8,8,0,0,1,11.32,0L128,132.69,180.69,80H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8v40a8,8,0,0,1-16,0V91.31l-58.34,58.35a8,8,0,0,1-11.32,0L96,123.31l-56,56V200H224A8,8,0,0,1,232,208Z",
  "bookmark": "M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"
};
function icon(name, size = 22) {
  return `<svg class="ph" viewBox="0 0 256 256" width="${size}" height="${size}" fill="currentColor" aria-hidden="true">${PH[name] ? `<path d="${PH[name]}"/>` : ""}</svg>`;
}

/* ---------- lighthouse mark (geometric, brand palette) ---------- */
let _lhId = 0;
function lighthouse(h = 40) {
  const id = "lh-" + (++_lhId);
  return `<svg class="lighthouse" viewBox="0 0 100 130" height="${h}" role="img" aria-label="lighthouse" style="display:block">
    <defs><clipPath id="${id}"><polygon points="35,102 65,102 60,44 40,44"/></clipPath></defs>
    <polygon points="43,23 43,33 6,26 11,10" fill="#d8b713" opacity="0.82"/>
    <polygon points="57,23 57,33 94,26 89,10" fill="#d8b713" opacity="0.82"/>
    <rect x="18" y="110" width="64" height="6" fill="#1c275e"/>
    <rect x="28" y="102" width="44" height="9" fill="#1c275e"/>
    <polygon points="35,102 65,102 60,44 40,44" fill="#1c275e"/>
    <rect x="0" y="60" width="100" height="9" fill="#4a7fc1" clip-path="url(#${id})"/>
    <rect x="0" y="79" width="100" height="9" fill="#4a7fc1" clip-path="url(#${id})"/>
    <rect x="37" y="39" width="26" height="6" fill="#1c275e"/>
    <rect x="37" y="44" width="26" height="2" fill="#4a7fc1"/>
    <rect x="43" y="22" width="14" height="18" fill="#1c275e"/>
    <rect x="44.5" y="23.5" width="11" height="15" fill="#d8b713"/>
    <polygon points="41,22 59,22 50,13" fill="#1c275e"/>
  </svg>`;
}

/* ---------- splash ----------
   SPLASH_STYLE: "beacon" = big lighthouse + wordmark below, light sweeps and reveals the app.
                 "zoom"   = wordmark+lighthouse lockup shrinks into its home-screen spot. */
const SPLASH_STYLE = "beacon";

function splashMarkup() {
  if (SPLASH_STYLE === "zoom")
    return `<div class="hero-mark">${wordmark(56)}${lighthouse(70)}</div>`;
  return `<div class="splash-flood"></div>
    <div class="splash-stack">
      <div class="splash-lh">${lighthouse(200)}</div>
      <div class="splash-wm">${wordmark(46)}</div>
    </div>`;
}
function initSplash() {
  const s = document.getElementById("splash");
  if (!s) return;
  s.classList.add(SPLASH_STYLE);
  s.innerHTML = splashMarkup();
}
function runSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  (SPLASH_STYLE === "zoom" ? runSplashZoom : runSplashBeacon)(splash, ready);
}
function runSplashBeacon(splash, ready) {
  ready.then(() => {                                    // hold on the lighthouse, then flood + reveal
    setTimeout(() => splash.classList.add("out"), 2900);
    setTimeout(() => splash.remove(), 3500);
  });
}
function runSplashZoom(splash, ready) {
  const sw = splash.querySelector(".hero-mark");
  ready.then(() => setTimeout(() => {
    const target = document.querySelector(".hero .hero-mark") || document.querySelector(".onb-card .hero-mark");
    if (target && sw) {
      const t = target.getBoundingClientRect(), s = sw.getBoundingClientRect();
      if (s.height && t.height) {
        const scale = t.height / s.height;
        const dx = (t.left + t.width / 2) - (s.left + s.width / 2);
        const dy = (t.top + t.height / 2) - (s.top + s.height / 2);
        sw.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      }
    }
    splash.classList.add("out");
    setTimeout(() => splash.remove(), 800);
  }, 550));
}

/* ---------- wordmark (Trip = Plus Jakarta 800 navy, fluent = Playfair italic blue) ---------- */
function wordmark(h = 30) {
  return `<svg class="wordmark" viewBox="0 0 476 150" height="${h}" role="img" aria-label="Tripfluent" style="display:block;overflow:visible">
    <text x="4" y="112" text-anchor="start"><tspan font-family="'Plus Jakarta Sans',sans-serif" font-weight="800" font-size="104" fill="var(--wordmark-1,#1c275e)" letter-spacing="-2">Trip</tspan><tspan font-family="'Playfair Display',Georgia,serif" font-style="italic" font-weight="500" font-size="104" fill="var(--wordmark-2,#4a7fc1)">fluent</tspan></text>
  </svg>`;
}
