/* ============================== ONBOARDING ============================== */
/* ---- Tripfluent onboarding config ---- */
const DESTINATIONS = [
  { key: "mexico", label: "Mexico", flag: "🇲🇽", dialect: "Mexican Spanish", blurb: "Oaxaca, CDMX & beyond" },
  { key: "spain", label: "Spain", flag: "🇪🇸", dialect: "Castilian Spanish", blurb: "Barcelona, Madrid & beyond" }
];
const destInfo = k => DESTINATIONS.find(d => d.key === k) || DESTINATIONS[0];
const TRIP_TYPES = [
  ["foodie", "🍮 Foodie / culture", "Eat well, talk to locals"],
  ["beach", "🏖️ Beach + relax", ""],
  ["adventure", "🥾 Adventure + outdoors", ""],
  ["business", "💼 Business", ""],
  ["family", "👪 Visiting family", ""],
  ["sightseeing", "📸 General sightseeing", ""]
];
// every option must do something (personalization spec §2): dietary → its own lesson, chat → smalltalk
// weight. The old solo / off-beaten / cities options informed nothing and were cut.
const NEEDS = [
  ["gluten_free", "Gluten-free"], ["vegetarian", "Vegetarian / vegan"],
  ["allergies", "Food allergies"], ["chat", "Want to chat with locals"]
];
const PLACEMENT = [
  { es: "Gracias", answer: "Thank you", opts: ["Thank you", "Goodbye", "Please", "Sorry"] },
  { es: "¿Cuánto cuesta?", answer: "How much is it?", opts: ["How much is it?", "Where is it?", "What time is it?", "What's your name?"] },
  { es: "La cuenta, por favor", answer: "The check, please", opts: ["The check, please", "A table for two", "The menu, please", "Water, please"] },
  { es: "¿Dónde está el baño?", answer: "Where is the bathroom?", opts: ["Where is the bathroom?", "How do I get there?", "Is it far?", "What is this?"] }
];
const daysUntil = d => Math.ceil((new Date(d + "T00:00:00") - new Date(todayStr() + "T00:00:00")) / 864e5);
// §2.1: pull the account-scoped answers (skill level, dietary/allergies) from any prior trip profile,
// so a returning user creating a new trip doesn't retake the quiz or re-declare their diet.
function priorAccountAnswers() {
  const profs = [];
  if (state.profile) profs.push(state.profile);
  Object.values(state.trips || {}).forEach(t => { if (t && t.profile) profs.push(t.profile); });
  const p = profs.find(x => x && x.level);
  return p ? { level: p.level, allergies: p.allergies || [], needs: p.needs || [] } : null;
}
// §5.3 seam: the most recent completed trip + the current (decayed) mean phrase strength, for the
// "record vs faded state" line a returning user sees. Language-scoped, DECK-independent.
function _priorArchived() { const a = (state.archive || []); return a.length ? a[a.length - 1] : null; }
function _currentLangStrength() {
  const vals = Object.values(state.learn || {}).filter(s => s && s.exposures >= 1).map(s => itemStrength(s));
  return vals.length ? Math.round(vals.reduce((x, y) => x + y, 0) / vals.length) : null;
}

function renderOnboarding() {
  const app = $("#app");
  const draft = { destination: null, date: "", tripType: null, lodging: [], transport: [], needs: [], allergies: [], pIdx: 0, pScore: 0, level: null };
  // §2.1: level and dietary/allergies are ACCOUNT-scoped — a returning user making a new trip
  // carries them forward and only answers the trip-scoped questions (type, lodging, transport).
  const prior = priorAccountAnswers();
  const returning = !!prior;
  if (returning) { draft.level = prior.level; draft.allergies = prior.allergies.slice(); draft.needs = prior.needs.slice(); }
  let screen = "welcome";

  const go = s => { screen = s; render(); };
  const nextAfterNeeds = () => draft.needs.includes("allergies") ? "allergens" : "placement";

  function render() {
    clearFooter();
    hideTabbar();
    app.innerHTML = "";
    const wrap = el(`<div class="onb"></div>`);

    if (screen === "welcome") {
      wrap.appendChild(el(`
        <div class="onb-card">
          <div class="hero-mark" style="margin-bottom:16px">${wordmark(36)}${lighthouse(48)}</div>
          <p>Not a fluency app, a get-ready-for-<i>this trip</i> app. A few quick questions and I'll build a plan timed to your departure.</p>
        </div>`));
      const btn = el(`<button class="btn">Plan my trip</button>`);
      btn.addEventListener("click", () => go("where"));
      wrap.appendChild(btn);

    } else if (screen === "where") {
      wrap.appendChild(el(`<div class="onb-q">Where are you headed, and when?</div>`));
      wrap.appendChild(el(`<div class="onb-sub">This sets your regional Spanish and starts the countdown.</div>`));
      const chips = el(`<div class="chips"></div>`);
      DESTINATIONS.forEach(d => {
        const chip = el(`<button class="chip ${draft.destination === d.key ? "on" : ""}">
          <span class="chip-l">${d.flag} ${d.label}</span><span class="chip-d">${d.dialect} · ${d.blurb}</span></button>`);
        chip.addEventListener("click", () => { draft.destination = d.key; render(); });
        chips.appendChild(chip);
      });
      wrap.appendChild(chips);
      wrap.appendChild(el(`<div class="set-t" style="margin:18px 0 6px">Trip date</div>`));
      const date = el(`<input class="text-input" type="date" min="${todayStr()}" value="${draft.date}">`);
      date.addEventListener("change", () => { draft.date = date.value; refreshNext(); });
      wrap.appendChild(date);
      const next = el(`<button class="btn" id="onext" style="margin-top:18px" ${draft.destination && draft.date ? "" : "disabled"}>Continue</button>`);
      next.addEventListener("click", () => { if (draft.destination && draft.date) go("triptype"); });
      wrap.appendChild(next);
      function refreshNext() { const b = $("#onext"); if (b) b.disabled = !(draft.destination && draft.date); }

    } else if (screen === "triptype") {
      wrap.appendChild(el(`<div class="onb-q">What kind of trip is it?</div>`));
      const chips = el(`<div class="chips"></div>`);
      TRIP_TYPES.forEach(([key, label, desc]) => {
        const chip = el(`<button class="chip ${draft.tripType === key ? "on" : ""}">
          <span class="chip-l">${label}</span>${desc ? `<span class="chip-d">${desc}</span>` : ""}</button>`);
        chip.addEventListener("click", () => { draft.tripType = key; go("lodging"); });
        chips.appendChild(chip);
      });
      wrap.appendChild(chips);

    } else if (screen === "lodging") {
      wrap.appendChild(el(`<div class="onb-q">Where are you staying?</div>`));
      wrap.appendChild(el(`<div class="onb-sub">An apartment or Airbnb unlocks host and check-out phrases hotels don't need.</div>`));
      const chips = el(`<div class="chips"></div>`);
      LODGING_OPTIONS.forEach(o => {
        const on = draft.lodging.includes(o.key);
        const chip = el(`<button class="chip ${on ? "on" : ""}"><span class="chip-l">${o.label}</span></button>`);
        chip.addEventListener("click", () => {
          const i = draft.lodging.indexOf(o.key); i >= 0 ? draft.lodging.splice(i, 1) : draft.lodging.push(o.key); render();
        });
        chips.appendChild(chip);
      });
      wrap.appendChild(chips);
      const next = el(`<button class="btn" style="margin-top:18px">Continue</button>`);
      next.addEventListener("click", () => go("transport"));
      wrap.appendChild(next);

    } else if (screen === "transport") {
      wrap.appendChild(el(`<div class="onb-q">How will you get around?</div>`));
      wrap.appendChild(el(`<div class="onb-sub">Pick any. Each mode adds the phrases for tickets, stops, and reading the signs.</div>`));
      const chips = el(`<div class="chips"></div>`);
      TRANSPORT_OPTIONS.forEach(o => {
        const on = draft.transport.includes(o.key);
        const chip = el(`<button class="chip ${on ? "on" : ""}"><span class="chip-l">${o.label}</span></button>`);
        chip.addEventListener("click", () => {
          const i = draft.transport.indexOf(o.key); i >= 0 ? draft.transport.splice(i, 1) : draft.transport.push(o.key); render();
        });
        chips.appendChild(chip);
      });
      wrap.appendChild(chips);
      const next = el(`<button class="btn" style="margin-top:18px">Continue</button>`);
      // returning user already answered the account-scoped questions → straight to the plan
      next.addEventListener("click", () => go(returning ? "plan" : "needs"));
      wrap.appendChild(next);

    } else if (screen === "needs") {
      wrap.appendChild(el(`<div class="onb-q">Anything we should tailor for?</div>`));
      wrap.appendChild(el(`<div class="onb-sub">Pick any. Dietary needs get their own safety phrases, our specialty.</div>`));
      const chips = el(`<div class="chips"></div>`);
      NEEDS.forEach(([key, label]) => {
        const on = draft.needs.includes(key);
        const chip = el(`<button class="chip ${on ? "on" : ""}"><span class="chip-l">${label}</span></button>`);
        chip.addEventListener("click", () => {
          const i = draft.needs.indexOf(key); i >= 0 ? draft.needs.splice(i, 1) : draft.needs.push(key); render();
        });
        chips.appendChild(chip);
      });
      wrap.appendChild(chips);
      const next = el(`<button class="btn" style="margin-top:18px">Continue</button>`);
      next.addEventListener("click", () => go(nextAfterNeeds()));
      wrap.appendChild(next);

    } else if (screen === "allergens") {
      wrap.appendChild(el(`<div class="onb-q">Which allergies?</div>`));
      wrap.appendChild(el(`<div class="onb-sub">We'll drill the exact phrases to keep you safe at the table.</div>`));
      const chips = el(`<div class="chips"></div>`);
      ALLERGENS.forEach(a => {
        const on = draft.allergies.includes(a.key);
        const chip = el(`<button class="chip ${on ? "on" : ""}"><span class="chip-l">${a.en[0].toUpperCase() + a.en.slice(1)}</span></button>`);
        chip.addEventListener("click", () => {
          const i = draft.allergies.indexOf(a.key); i >= 0 ? draft.allergies.splice(i, 1) : draft.allergies.push(a.key); render();
        });
        chips.appendChild(chip);
      });
      wrap.appendChild(chips);
      const next = el(`<button class="btn" style="margin-top:18px">Continue</button>`);
      next.addEventListener("click", () => go("placement"));
      wrap.appendChild(next);

    } else if (screen === "placement") {
      const q = PLACEMENT[draft.pIdx];
      wrap.appendChild(el(`<div class="onb-sub">Quick check (${draft.pIdx + 1}/${PLACEMENT.length}), no studying, just tap.</div>`));
      wrap.appendChild(el(`<div class="onb-q">What does this mean?</div>`));
      wrap.appendChild(el(`<div class="prompt">${q.es}</div>`));
      const choices = el(`<div class="choices"></div>`);
      shuffle(q.opts.slice()).forEach(opt => {
        const c = el(`<button class="choice">${opt}</button>`);
        c.addEventListener("click", () => {
          if (opt === q.answer) draft.pScore++;
          if (draft.pIdx < PLACEMENT.length - 1) { draft.pIdx++; render(); }
          else { draft.level = draft.pScore <= 1 ? "new" : draft.pScore <= 3 ? "some" : "confident"; go("plan"); }
        });
        choices.appendChild(c);
      });
      wrap.appendChild(choices);

    } else if (screen === "plan") {
      const d = destInfo(draft.destination);
      const days = Math.max(0, daysUntil(draft.date));
      const weeks = Math.max(1, Math.round(days / 7));
      const cram = days > 0 && days < 14;
      const dietary = draft.needs.includes("gluten_free") || draft.needs.includes("vegetarian") || draft.needs.includes("allergies");
      const outcomes = [];
      if (dietary) outcomes.push("order food that's safe for your diet");
      outcomes.push("order food and drinks like a regular", "handle taxis and hotel check-in", "navigate markets and directions");
      if (draft.needs.includes("chat")) outcomes.push("chat with locals and bartenders");
      outcomes.push("recover when a conversation goes sideways");
      const sessions = cram ? Math.max(6, days) : 24;
      // §5.3 returning-user seam: acknowledge the record and the faded state together, once.
      const prior = _priorArchived(), cur = _currentLangStrength();
      if (returning && prior && cur != null && cur < prior.readinessAtDeparture - 5) {
        wrap.appendChild(el(`<div class="onb-seam">${destInfo(prior.destination).label}: ${prior.readinessAtDeparture}%. Your Spanish has faded to about ${cur}% since, but with that foundation you'll rebuild far faster than you built it.</div>`));
      }
      wrap.appendChild(el(`
        <div class="onb-card plan">
          <div class="onb-emoji">${d.flag}</div>
          <h2>${days <= 0 ? "Your trip is here!" : cram ? `${days} days until ${d.label}, cram mode on` : `${weeks} weeks until ${d.label}`}</h2>
          <p>Here's your trip-ready path: <b>~${sessions} sessions</b>, about <b>6 minutes a day</b>. By departure you'll be able to:</p>
          <ul class="plan-list">${outcomes.map(o => `<li>${o}</li>`).join("")}</ul>
          <p class="onb-dim">All in ${d.dialect}. Change anything later in Settings.</p>
        </div>`));
      const btn = el(`<button class="btn">Start my first lesson →</button>`);
      btn.addEventListener("click", finish);
      wrap.appendChild(btn);
    }
    app.appendChild(wrap);
  }

  function finish() {
    const d = destInfo(draft.destination);
    const newProfile = {
      destination: draft.destination, tripDate: draft.date,
      tripType: draft.tripType, needs: draft.needs, allergies: draft.allergies,
      level: draft.level || "new", lodging: draft.lodging, transport: draft.transport
    };
    snapshotActive();                          // stash the trip we're leaving
    state.active = draft.destination;
    applyTrip(draft.destination);              // load existing progress for this destination (if any)
    state.profile = newProfile;                // refresh the plan with the new answers
    save(); rebuildDeck();
    seedPlacement(draft.level); save();        // §4: skill level → entry depth (no-op for "new")
    toast(`¡Vamos! ${d.flag} ${Math.max(0, daysUntil(draft.date))} days to go`);
    const first = DECK.stages[0] && DECK.stages[0].lessons[0];
    const fresh = Object.keys(state.lessons).length === 0;
    (first && fresh) ? startLesson(first) : renderHome();   // new trip → straight into L1; returning → map
  }
  render();
}
