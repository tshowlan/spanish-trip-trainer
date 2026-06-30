/* ============================== HOME / MAP ============================== */
function streakStrip() {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    days.push(`<i class="${state.history.includes(d) ? "hit" : ""}" title="${d}"></i>`);
  }
  return `<div class="streak-strip"><span>Last 2 weeks</span><div class="dots">${days.join("")}</div></div>`;
}
function renderHome() {
  renderTopbar();
  clearFooter();
  const app = $("#app");
  app.innerHTML = "";
  const home = el(`<div class="home"></div>`);
  const p = state.profile || {};
  const d = destInfo(p.destination);
  const days = p.tripDate ? Math.max(0, daysUntil(p.tripDate)) : null;
  const countdown = days === null ? ""
    : days <= 0 ? `<div class="countdown here">${d.flag} You're trip-ready — ¡buen viaje!</div>`
    : `<div class="countdown"><span class="cd-num">${days}</span> day${days === 1 ? "" : "s"} until ${d.flag} ${d.label}</div>`;
  home.appendChild(el(`
    <div class="hero">
      <div class="hero-mark">${wordmark(32)}</div>
      ${countdown}
      <p>Trip-ready ${d.dialect}, one scenario at a time. Finish a lesson to unlock the next.</p>
      ${streakStrip()}
    </div>`));
  const tripsBtn = el(`<button class="trips-btn">⇄ Your trips</button>`);
  tripsBtn.addEventListener("click", renderTrips);
  home.querySelector(".hero").appendChild(tripsBtn);
  if (!state.account) {
    const banner = el(`<div class="backup-banner"><span>🔒 Back up your progress — create an account so a reinstall never wipes your streak.</span><button class="btn" style="margin-top:10px">Create account</button></div>`);
    banner.querySelector("button").addEventListener("click", () => renderAuth("signup"));
    home.appendChild(banner);
  }

  DECK.stages.forEach(st => {
    const total = st.lessons.length || 1;
    const done = st.lessons.filter(l => lessonDone(l.id)).length;
    const stage = el(`<div class="stage"></div>`);
    stage.appendChild(el(`
      <div class="stage-head"><h2>${st.title}</h2><span class="blurb">${st.blurb}</span></div>
      <div class="stage-bar"><i style="width:${Math.round(done / total * 100)}%"></i></div>`));
    const list = el(`<div class="lessons"></div>`);
    st.lessons.forEach(l => {
      const isDone = lessonDone(l.id), unlocked = lessonUnlocked(l.id);
      const stars = isDone ? state.lessons[l.id].stars : 0;
      const card = el(`
        <div class="lesson ${isDone ? "done" : ""} ${unlocked ? "" : "locked"}">
          <div class="badge">${isDone ? "✓" : unlocked ? "▶" : "🔒"}</div>
          <div class="meta">
            <div class="t">${l.title}</div>
            <div class="s">${l.topic} · ${l.items.length} phrases</div>
            ${isDone ? `<div class="stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>` : ""}
          </div>
          <div class="chev">${unlocked ? icon('caret-right',18) : ""}</div>`);
      if (unlocked) card.addEventListener("click", () => startLesson(l));
      else card.addEventListener("click", () => toast("Finish the lesson before it to unlock 🔒"));
      list.appendChild(card);
    });
    stage.appendChild(list);
    home.appendChild(stage);
  });
  app.appendChild(home);
}
