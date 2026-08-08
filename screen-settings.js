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
    // truthful backup line: shows the LAST SUCCESSFUL push (or the error), never a promise
    const pushAgo = state.cloudLastPush ? (() => { const m = Math.round((Date.now() - state.cloudLastPush) / 60000);
      return m < 1 ? "just now" : m < 60 ? m + " min ago" : Math.round(m / 60) + " h ago"; })() : null;
    const pullAgo = state.cloudLastPull ? (() => { const m = Math.round((Date.now() - state.cloudLastPull) / 60000);
      return m < 1 ? "just now" : m < 60 ? m + " min ago" : Math.round(m / 60) + " h ago"; })() : null;
    const backupLine = (state.cloudLastPushError ? "backup FAILED: " + state.cloudLastPushError
      : pushAgo ? "backed up " + pushAgo : "no backup yet this session")
      + (pullAgo ? " · restored " + pullAgo : " · NOT RESTORED this session");
    const acct = el(`<div class="set-row"><div><div class="set-t">Account</div><div class="set-d">${state.account.email} · ${backupLine}</div></div>
      <button class="btn grey" id="logout" style="width:auto;padding:8px 14px;box-shadow:none">Log out</button></div>`);
    wrap.appendChild(acct);
    if (state.restoreDebug) {
      const rd = state.restoreDebug;
      const mins = Math.round((Date.now() - rd.at) / 60000);
      wrap.appendChild(el(`<div class="set-d" style="margin:2px 0 8px;font-size:11px">last restore ${mins < 1 ? "just now" : mins + " min ago"}: received ${rd.got} phrase records (${rd.gotKeys || "none"}), kept ${rd.kept}, ${rd.lessons} lessons</div>`));
    }
    // debugging + device-carry: the sync code was gated behind Groups; a signed-in user
    // can now copy it directly (it IS the vault address — keep private)
    if (state.cloud && state.cloud.playerId && state.cloud.secret) {
      const syncRow = el(`<div class="set-row" style="cursor:pointer"><div><div class="set-t">Sync code</div><div class="set-d">Copy to move or inspect your backup. Keep it private.</div></div><span class="chev">${icon('caret-right',20)}</span></div>`);
      syncRow.addEventListener("click", () => { const code = state.cloud.playerId + "." + state.cloud.secret;
        if (navigator.clipboard) navigator.clipboard.writeText(code); toast("Sync code copied"); });
      wrap.appendChild(syncRow);
    }
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

  _labCard(wrap);                                      // THE TEST LAB (Tom, 2026-08-05)
  app.appendChild(wrap);
  $("#snd").addEventListener("click", e => {
    state.sound = !state.sound; save();
    e.currentTarget.classList.toggle("on", state.sound);
    if (state.sound) playSound("correct");
  });
}

/* ===== THE TEST LAB (Tom, 2026-08-05): a parameterized journey simulator. Four static
   profiles don't scale - this fabricates ANY user: position in the pack, days to trip,
   streak, due pile, cadence. SAFETY RAILS: the first Apply snapshots the REAL state to a
   separate localStorage slot; every cloud sync path is sealed while simming (the vault
   never learns about fabricated progress); a fixed TEST LAB chip labels every screen;
   Restore brings the real state back wholesale and reboots clean (bootSync then re-pulls
   the untouched vault). ===== */
function _labCard(wrap) {
  const hasBackup = !!localStorage.getItem("sts_lab_backup");
  const lab = el(`<div class="lab-card">
    <div class="set-h">Test lab</div>
    <div class="set-d">Fabricate a user and walk the app as them. Your real progress is snapshotted on first apply, and cloud backup pauses until you restore.</div>
    ${state.simMode ? `<div class="lab-active">TEST LAB ACTIVE: this is fabricated progress</div>` : ""}
    <label class="lab-row">Journey through the pack<span class="lab-val" id="lab-pct-v">40%</span></label>
    <input type="range" id="lab-pct" min="0" max="100" step="5" value="40" class="lab-slider">
    <label class="lab-row">Days to trip<input type="number" id="lab-days" value="30" min="0" max="365"></label>
    <label class="lab-row">Streak<input type="number" id="lab-streak" value="6" min="0" max="365"></label>
    <label class="lab-row">Phrases due now<input type="number" id="lab-due" value="8" min="0" max="60"></label>
    <label class="lab-row">Sessions per week<input type="number" id="lab-wk" value="4" min="0" max="14"></label>
    <label class="lab-row">Weeks active<input type="number" id="lab-weeks" value="3" min="1" max="12"></label>
    <div class="lab-btns">
      <button class="btn" id="lab-apply">Apply</button>
      <button class="btn grey" id="lab-restore" ${hasBackup ? "" : "disabled"}>Restore my real progress</button>
    </div>
    <div class="set-d" style="margin-top:14px">Your measured exercise times (real medians from this device's play):</div>
    <div class="lab-telem">${Object.keys(state.telem || {}).length
      ? Object.entries(state.telem).sort((a, b) => b[1].n - a[1].n).map(([t, e]) => `${t}: ${(e.mean / 1000).toFixed(1)}s (x${e.n})`).join(" · ")
      : "none yet - play a lesson and they accrue"}</div>
    <div class="set-d" style="margin-top:14px">Make one lesson brand new again (primer + full first-pass arc on next entry):</div>
    <div class="lab-btns">
      <select id="lab-lesson" class="lab-select"></select>
      <button class="btn grey" id="lab-fresh">Reset to never-seen</button>
    </div>
  </div>`);
  wrap.appendChild(lab);
  lab.querySelector("#lab-pct").addEventListener("input", e => { lab.querySelector("#lab-pct-v").textContent = e.target.value + "%"; });
  lab.querySelector("#lab-apply").addEventListener("click", () => {
    labApply({
      pct: +lab.querySelector("#lab-pct").value,
      daysOut: +lab.querySelector("#lab-days").value,
      streak: +lab.querySelector("#lab-streak").value,
      dueN: +lab.querySelector("#lab-due").value,
      perWeek: +lab.querySelector("#lab-wk").value,
      weeks: +lab.querySelector("#lab-weeks").value
    });
    toast("Lab user applied");
    renderProfile();
  });
  lab.querySelector("#lab-restore").addEventListener("click", labRestore);
  // per-lesson freshness (Tom, 2026-08-05): experience any primer again without a full re-journey
  const lsel = lab.querySelector("#lab-lesson");
  DECK.stages.flatMap(st => st.lessons).filter(l => (l.items || []).length).forEach(l => {
    lsel.appendChild(el(`<option value="${l.id}">${l.title || l.id}</option>`));
  });
  lab.querySelector("#lab-fresh").addEventListener("click", () => {
    const l = DECK.stages.flatMap(st => st.lessons).find(x => x.id === lsel.value);
    if (!l) return;
    if (!localStorage.getItem("sts_lab_backup")) localStorage.setItem("sts_lab_backup", JSON.stringify(state));
    state.simMode = true;
    delete state.lessons[l.id];
    (l.items || []).forEach(it => { delete state.learn[it.id]; });
    state.scoresCache = computeScores();
    save(); renderTopbar();
    toast(`"${l.title || l.id}" is new again`);
  });
}
function labApply(p) {
  if (!localStorage.getItem("sts_lab_backup")) localStorage.setItem("sts_lab_backup", JSON.stringify(state));   // FIRST apply keeps the real snapshot; re-applies never overwrite it
  state.simMode = true;
  state.profile = state.profile || { destination: "spain", tripType: "leisure", needs: [], allergies: [], level: "some", lodging: ["hotel"], transport: ["walk"] };
  const d = new Date(); d.setDate(d.getDate() + p.daysOut);
  state.profile.tripDate = d.toISOString().slice(0, 10);
  state.streak = p.streak;
  state.lastActive = todayStr();
  const lessons = DECK.stages.flatMap(st => st.lessons).filter(l => (l.items || []).length && !l.chain);
  const K = Math.round(lessons.length * p.pct / 100);
  const span = Math.max(2, p.weeks * 7);
  state.lessons = {}; state.learn = {};
  lessons.slice(0, K).forEach((l, li) => {
    const age = Math.max(1, Math.round(span * (K - li) / Math.max(1, K)));   // earliest lessons furthest back
    state.lessons[l.id] = { stars: 2 + (Math.random() < 0.6 ? 1 : 0), at: new Date(Date.now() - age * 864e5).toISOString() };
    (l.items || []).forEach(it => {
      const seen = Math.max(1, Math.min(age, 1 + Math.floor(Math.random() * age)));
      state.learn[it.id] = {
        exposures: 3 + Math.floor(Math.random() * 5), streak: 1 + Math.floor(Math.random() * 3),
        lapses: Math.random() < 0.3 ? 1 : 0, interval: 3 + Math.floor(Math.random() * 9),
        ease: 2.2 + Math.random() * 0.4,
        lastSeen: daysAgoStr(seen), lastCorrect: daysAgoStr(seen), due: daysAgoStr(-(2 + Math.floor(Math.random() * 12))),   // future: the Due dial owns the count exactly
        axes: { production: Math.random() < 0.75, cold: Math.random() < 0.45, native: Math.random() < 0.35, chained: Math.random() < 0.2 }
      };
    });
  });
  const ids = Object.keys(state.learn);
  shuffle(ids.slice()).slice(0, Math.min(p.dueN, ids.length)).forEach(id => {
    const r = state.learn[id]; r.lastSeen = daysAgoStr(9); r.lastCorrect = daysAgoStr(9); r.due = daysAgoStr(1);
  });
  state.sessions = [];
  for (let w = p.weeks; w >= 1; w--) for (let sn = 0; sn < p.perWeek; sn++) {
    const ago = (w - 1) * 7 + Math.min(6, Math.floor(sn * 7 / Math.max(1, p.perWeek)));
    state.sessions.push({ at: new Date(Date.now() - ago * 864e5).toISOString(), lessonId: "__lab__", category: "Review", phrases: 12, correct: 10 });
  }
  const sc = computeScores();
  state.scoreHistory = [];
  for (let a = span; a >= 1; a -= 2) {
    const f = 1 - a / span;
    state.scoreHistory.push({ date: daysAgoStr(a),
      readiness: Math.max(2, Math.round(sc.readiness * (0.35 + 0.65 * f))),
      momentum: Math.max(2, Math.round(sc.momentum * (0.5 + 0.5 * f))),
      retention: Math.max(2, Math.round(sc.retention * (0.6 + 0.4 * f))) });
  }
  state.scoresCache = computeScores();
  save();
  renderTopbar();                                       // the TEST LAB chip appears immediately
}
function labRestore() {
  const b = localStorage.getItem("sts_lab_backup");
  if (!b) { toast("No snapshot to restore"); return; }
  localStorage.setItem(STORE_KEY, b);                  // real state back, wholesale
  localStorage.removeItem("sts_lab_backup");
  location.reload();                                    // clean boot; bootSync re-pulls the untouched vault
}
