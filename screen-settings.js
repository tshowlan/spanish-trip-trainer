/* ============================== PROFILE ============================== */
function renderProfile() {
  clearFooter();
  hideTabbar();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen"></div>`);
  wrap.appendChild(el(`<div class="set-head"><button class="close-btn" id="back">${icon("caret-left", 26)}</button><h2>Profile</h2></div>`));

  // status tier (permanent) — tier logic lands with the Status milestone; everyone starts Newcomer
  wrap.appendChild(el(`<div class="profile-status">
    <div class="tier-name">Newcomer</div>
    <div class="tier-sub">Build your Trip Readiness to earn your first status.</div>
  </div>`));

  // account
  if (state.account) {
    const acct = el(`<div class="set-row"><div><div class="set-t">Account</div><div class="set-d">${state.account.email} · backed up ☁️</div></div>
      <button class="btn grey" id="logout" style="width:auto;padding:8px 14px;box-shadow:none">Log out</button></div>`);
    wrap.appendChild(acct);
    acct.querySelector("#logout").addEventListener("click", () => { if (confirm("Log out? Your progress stays on this device and in your account.")) { doLogout(); renderProfile(); } });
  } else {
    const acct = el(`<div class="set-row" style="cursor:pointer;border-color:var(--accent-2)"><div><div class="set-t">Create an account</div><div class="set-d">Back up your progress & join trips</div></div>
      <span class="chev">${icon("caret-right", 20)}</span></div>`);
    acct.addEventListener("click", () => renderAuth("signup"));
    wrap.appendChild(acct);
  }

  // trips
  const nTrips = new Set([...Object.keys(state.trips || {}), state.active].filter(Boolean)).size;
  const tripsRow = el(`<div class="set-row" style="cursor:pointer"><div><div class="set-t">Your trips</div><div class="set-d">${nTrips} destination${nTrips === 1 ? "" : "s"}</div></div>
    <span class="chev">${icon("caret-right", 20)}</span></div>`);
  tripsRow.addEventListener("click", renderTrips);
  wrap.appendChild(tripsRow);

  app.appendChild(wrap);
  $("#back").addEventListener("click", renderHome);
}

/* ============================== SETTINGS ============================== */
function renderSettings() {
  clearFooter();
  hideTabbar();
  const app = $("#app");
  app.innerHTML = "";
  const wrap = el(`<div class="settings"></div>`);
  wrap.appendChild(el(`<div class="set-head"><button class="close-btn" id="back">${icon('caret-left',26)}</button><h2>Settings</h2></div>`));

  // account
  if (state.account) {
    const acct = el(`<div class="set-row"><div><div class="set-t">Account</div><div class="set-d">${state.account.email} · progress backed up ☁️</div></div>
      <button class="btn grey" id="logout" style="width:auto;padding:8px 14px;box-shadow:none">Log out</button></div>`);
    wrap.appendChild(acct);
    acct.querySelector("#logout").addEventListener("click", () => { if (confirm("Log out? Your progress stays on this device and in your account.")) { doLogout(); renderSettings(); } });
  } else {
    const acct = el(`<div class="set-row" style="border-color:var(--accent-2)"><div><div class="set-t">Back up your progress</div><div class="set-d">Create an account so you never lose your streak</div></div>
      <span class="chev">${icon('caret-right',20)}</span></div>`);
    acct.addEventListener("click", () => renderAuth("signup"));
    wrap.appendChild(acct);
  }

  const sound = el(`<div class="set-row"><div><div class="set-t">Success sounds</div><div class="set-d">Play a chime on correct answers</div></div>
    <button class="toggle ${state.sound ? "on" : ""}" id="snd"><i></i></button></div>`);
  wrap.appendChild(sound);

  const remRow = el(`<div class="set-row" style="cursor:pointer"><div><div class="set-t">Push reminders</div><div class="set-d">${state.reminders.enabled ? `On · ${minToHHMM(state.reminders.morning)} & ${minToHHMM(state.reminders.evening)}` : "Morning + bedtime nudges"}</div></div>
    <span class="chev">${icon('caret-right',20)}</span></div>`);
  remRow.addEventListener("click", renderReminders);
  wrap.appendChild(remRow);
  const d2 = destInfo(state.profile && state.profile.destination);
  const tripsRow = el(`<div class="set-row" style="cursor:pointer"><div><div class="set-t">Your trips</div><div class="set-d">Active: ${d2.flag} ${d2.label} · switch destinations</div></div>
    <span class="chev">${icon('caret-right',20)}</span></div>`);
  tripsRow.addEventListener("click", renderTrips);
  wrap.appendChild(tripsRow);

  const grpRow = el(`<div class="set-row" style="cursor:pointer"><div><div class="set-t">Group mode</div><div class="set-d">${state.cloud && state.cloud.group ? "In group " + state.cloud.group : "In the Progress tab — share a code, compare strengths"}</div></div>
    <span class="chev">${icon('caret-right',20)}</span></div>`);
  grpRow.addEventListener("click", () => navTo("progress"));
  wrap.appendChild(grpRow);

  const editP = el(`<button class="btn grey" style="margin-top:20px">Edit trip profile</button>`);
  editP.addEventListener("click", renderOnboarding);
  wrap.appendChild(editP);

  const reset = el(`<button class="btn btn--danger" style="margin-top:12px">Reset all progress</button>`);
  reset.addEventListener("click", () => {
    if (confirm("Erase all progress, streak, and profile? This can't be undone.")) {
      state = Object.assign({}, DEFAULT_STATE); save(); rebuildDeck(); renderOnboarding();
    }
  });
  wrap.appendChild(reset);

  app.appendChild(wrap);
  $("#back").addEventListener("click", renderHome);
  $("#snd").addEventListener("click", e => {
    state.sound = !state.sound; save();
    e.currentTarget.classList.toggle("on", state.sound);
    if (state.sound) playSound("correct");
  });
}
