/* ============================== PROFILE TAB (settings + account, §3.1) ============================== */
function renderSettings() { return renderProfile(); }   // gear removed; settings folded into the Profile tab
function renderProfile() {
  showTabbar("profile");
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen tab-screen settings"></div>`);
  wrap.appendChild(el(`<div class="screen-head"><h2>Profile</h2></div>`));

  // status tier stamp (§2.3) — full tier + nearest condition + archive live in Progress (§3.1)
  const tier = (typeof currentTier === "function") ? currentTier() : "Newcomer";
  wrap.appendChild(el(`<div class="profile-status">
    <div class="tier-name">${tier}</div>
    <div class="tier-sub">Your trips and status detail live in the Progress tab.</div>
  </div>`));

  // account
  if (state.account) {
    const acct = el(`<div class="set-row"><div><div class="set-t">Account</div><div class="set-d">${state.account.email} · progress backed up</div></div>
      <button class="btn grey" id="logout" style="width:auto;padding:8px 14px;box-shadow:none">Log out</button></div>`);
    wrap.appendChild(acct);
    acct.querySelector("#logout").addEventListener("click", () => confirmSheet({ title: "Log out?", body: "Your progress stays on this device and in your account.", confirmLabel: "Log out", cancelLabel: "Stay signed in", onConfirm: () => { doLogout(); renderProfile(); } }));
  } else {
    const acct = el(`<div class="set-row" style="cursor:pointer;border-color:var(--accent-2)"><div><div class="set-t">Back up your progress</div><div class="set-d">Create an account so a reinstall never wipes your progress</div></div>
      <span class="chev">${icon('caret-right',20)}</span></div>`);
    acct.addEventListener("click", () => renderAuth("signup"));
    wrap.appendChild(acct);
  }

  const theme = state.theme || "system";
  const themeRow = el(`<div class="set-row"><div><div class="set-t">Appearance</div><div class="set-d">Theme</div></div>
    <div class="seg-toggle" id="theme-seg">
      ${["system", "light", "dark"].map(t => `<button class="seg ${theme === t ? "on" : ""}" data-t="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join("")}
    </div></div>`);
  wrap.appendChild(themeRow);
  themeRow.querySelectorAll(".seg").forEach(b => b.addEventListener("click", () => {
    state.theme = b.dataset.t; save(); applyTheme();
    themeRow.querySelectorAll(".seg").forEach(x => x.classList.toggle("on", x === b));
  }));

  const sound = el(`<div class="set-row"><div><div class="set-t">Success sounds</div><div class="set-d">Play a chime on correct answers</div></div>
    <button class="toggle ${state.sound ? "on" : ""}" id="snd"><i></i></button></div>`);
  wrap.appendChild(sound);

  const remRow = el(`<div class="set-row" style="cursor:pointer"><div><div class="set-t">Practice reminder</div><div class="set-d">${state.reminders.enabled ? `On · ${minToHHMM(state.reminders.morning)}` : "Honest nudges at a time you set"}</div></div>
    <span class="chev">${icon('caret-right',20)}</span></div>`);
  remRow.addEventListener("click", renderReminders);
  wrap.appendChild(remRow);
  const d2 = destInfo(state.profile && state.profile.destination);
  const tripsRow = el(`<div class="set-row" style="cursor:pointer"><div><div class="set-t">Your trips</div><div class="set-d">Active: ${d2.flag} ${d2.label} · switch destinations</div></div>
    <span class="chev">${icon('caret-right',20)}</span></div>`);
  tripsRow.addEventListener("click", renderTrips);
  wrap.appendChild(tripsRow);

  const grpRow = el(`<div class="set-row" style="cursor:pointer"><div><div class="set-t">Group mode</div><div class="set-d">${state.cloud && state.cloud.group ? "In group " + state.cloud.group : "In the Progress tab, share a code, compare strengths"}</div></div>
    <span class="chev">${icon('caret-right',20)}</span></div>`);
  grpRow.addEventListener("click", () => navTo("progress"));
  wrap.appendChild(grpRow);

  const editP = el(`<button class="btn grey" style="margin-top:20px">Edit trip profile</button>`);
  editP.addEventListener("click", renderOnboarding);
  wrap.appendChild(editP);

  const reset = el(`<button class="btn btn--danger" style="margin-top:12px">Reset all progress</button>`);
  reset.addEventListener("click", () => confirmSheet({
    title: "Erase everything?", body: "All progress and your profile will be deleted. This can't be undone.",
    confirmLabel: "Erase everything", cancelLabel: "Cancel", danger: true,
    onConfirm: () => { state = Object.assign({}, DEFAULT_STATE); save(); rebuildDeck(); renderOnboarding(); }
  }));
  wrap.appendChild(reset);

  const ver = el(`<div class="app-version" id="app-version">Tripfluent</div>`);
  wrap.appendChild(ver);
  // build version — the SW cache name (sts-vNN) is the single source of truth, read at runtime
  if (window.caches && caches.keys) {
    caches.keys().then(keys => {
      const c = keys.find(k => /^sts-v\d+/.test(k));
      if (c) ver.textContent = "Tripfluent " + c.replace(/^sts-/, "");
    }).catch(() => {});
  }

  app.appendChild(wrap);
  $("#snd").addEventListener("click", e => {
    state.sound = !state.sound; save();
    e.currentTarget.classList.toggle("on", state.sound);
    if (state.sound) playSound("correct");
  });
}
