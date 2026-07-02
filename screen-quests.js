/* ============================== QUESTS ============================== */
function questRow(title, desc, done, clickable) {
  return el(`<div class="quest ${done ? "done" : ""}" ${clickable ? 'style="cursor:pointer"' : ""}>
    <div class="q-check">${done ? "✓" : ""}</div>
    <div class="q-meta"><div class="q-t">${title}</div><div class="q-d">${desc}</div></div>
  </div>`);
}
function renderQuests() {
  showTabbar("quests");
  clearFooter();
  state.goalsDone = state.goalsDone || {};
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen tab-screen"></div>`);
  wrap.appendChild(el(`<div class="screen-head"><h2>Quests</h2></div>`));
  wrap.appendChild(el(`<p class="onb-dim" style="margin-top:0">Rack up wins on the way to trip-ready.</p>`));

  // achievements — auto-tracked from progress
  const done = Object.keys(state.lessons).length;
  const total = (typeof LESSON_ORDER !== "undefined" && LESSON_ORDER.length) || 1;
  const saved = (state.saved || []).length;
  const ach = [
    ["First words", "Finish your first lesson", done >= 1],
    ["Finding your feet", "Finish 5 lessons", done >= 5],
    ["On a roll", "Reach a 3-day streak", state.streak >= 3],
    ["Committed", "Reach a 7-day streak", state.streak >= 7],
    ["Halfway there", "Complete half your plan", done >= Math.ceil(total / 2)],
    ["Word collector", "Save 5 phrases", saved >= 5],
    ["Trip-ready", "Complete every lesson", done >= total]
  ];
  wrap.appendChild(el(`<div class="q-head">Achievements</div>`));
  ach.forEach(([t, d, ok]) => wrap.appendChild(questRow(t, d, ok, false)));

  // personal trip goals — you check these off yourself
  const goals = [
    ["g-order", "Order a meal in Spanish", "No pointing at the menu"],
    ["g-dir", "Ask a local for directions", "…and understand the reply"],
    ["g-market", "Haggle at a market", "¿A cómo?"],
    ["g-convo", "Have a real conversation with a local", "The reason you came"],
    ["g-recover", "Fix a mix-up without switching to English", "Stay in it"]
  ];
  wrap.appendChild(el(`<div class="q-head">Trip goals</div>`));
  goals.forEach(([id, t, d]) => {
    const row = questRow(t, d, !!state.goalsDone[id], true);
    row.addEventListener("click", () => {
      state.goalsDone[id] = !state.goalsDone[id];
      save();
      if (state.goalsDone[id]) playSound("correct");
      renderQuests();
    });
    wrap.appendChild(row);
  });
  app.appendChild(wrap);
}
