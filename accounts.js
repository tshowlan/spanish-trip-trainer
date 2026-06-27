/* ============================== ACCOUNTS (email + password) ============================== */
async function authFetch(path, body, token) {
  const headers = { apikey: SUPABASE_KEY, "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, { method: "POST", headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.error_description || data.error || data.message || ("HTTP " + res.status));
  return data;
}
async function vaultPush(token, userId) {
  ensureIdentity();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/vault?on_conflict=user_id`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: userId, player_id: state.cloud.playerId, secret: state.cloud.secret, updated_at: new Date().toISOString() })
  });
  if (!res.ok) throw new Error("Couldn't save account vault: " + (await res.text()));
}
async function vaultPull(token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/vault?select=player_id,secret`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } });
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function doSignup(email, pw) {
  const r = await authFetch("signup", { email, password: pw });
  if (!r.access_token) throw new Error("Account created — check your email to confirm, then log in.");
  ensureIdentity();
  await vaultPush(r.access_token, r.user.id);
  state.cloud.optedIn = true;
  state.account = { email, userId: r.user.id };
  save();
  await cloudSync();                         // back up whatever's already on this device
}
async function doLogin(email, pw) {
  const r = await authFetch("token?grant_type=password", { email, password: pw });
  const token = r.access_token, userId = r.user.id;
  const v = await vaultPull(token);
  if (v) {
    state.cloud = Object.assign({}, state.cloud || {}, { playerId: v.player_id, secret: v.secret, optedIn: true });
    const p = await rpc("get_player", { p_id: v.player_id, p_secret: v.secret });
    if (p) applyPlayer(p);
  } else {
    ensureIdentity();
    await vaultPush(token, userId);
    state.cloud.optedIn = true;
    await cloudSync();
  }
  state.account = { email, userId };
  save(); rebuildDeck();
}
async function doRecover(email) {
  await authFetch("recover", { email });
}
function doLogout() { state.account = null; save(); }

function renderAuth(mode) {
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="settings"></div>`);
  const title = mode === "signup" ? "Create account" : "Log in";
  wrap.appendChild(el(`<div class="set-head"><button class="close-btn" id="back">‹</button><h2>${title}</h2></div>`));
  wrap.appendChild(el(`<p class="onb-dim" style="margin-top:0">${mode === "signup"
    ? "Back up your progress so a reinstall or new phone never loses your streak."
    : "Welcome back — log in to restore your progress."}</p>`));
  wrap.appendChild(el(`<div class="set-t" style="margin:12px 0 6px">Email</div>`));
  const email = el(`<input class="text-input" type="email" autocomplete="email" autocapitalize="off" autocorrect="off" placeholder="you@example.com">`);
  wrap.appendChild(email);
  wrap.appendChild(el(`<div class="set-t" style="margin:14px 0 6px">Password</div>`));
  const pw = el(`<input class="text-input" type="password" autocomplete="${mode === "signup" ? "new-password" : "current-password"}" placeholder="${mode === "signup" ? "At least 6 characters" : "Your password"}">`);
  wrap.appendChild(pw);
  const submit = el(`<button class="btn" style="margin-top:18px">${title}</button>`);
  wrap.appendChild(submit);
  const switchBtn = el(`<button class="btn grey" style="margin-top:10px">${mode === "signup" ? "I already have an account" : "Create a new account"}</button>`);
  wrap.appendChild(switchBtn);
  if (mode !== "signup") {
    const forgot = el(`<button class="linkbtn" style="margin-top:14px">Forgot password?</button>`);
    wrap.appendChild(forgot);
    forgot.addEventListener("click", async () => {
      const e = email.value.trim() || prompt("Enter your account email:");
      if (!e) return;
      try { await doRecover(e); toast("Reset email sent — check your inbox."); }
      catch (err) { toast("Couldn't send reset: " + err.message); }
    });
  }
  app.appendChild(wrap);
  $("#back").addEventListener("click", renderSettings);
  switchBtn.addEventListener("click", () => renderAuth(mode === "signup" ? "login" : "signup"));
  submit.addEventListener("click", async () => {
    const e = email.value.trim(), p = pw.value;
    if (!e || !p) { toast("Enter your email and password"); return; }
    if (mode === "signup" && p.length < 6) { toast("Password needs at least 6 characters"); return; }
    submit.disabled = true; submit.textContent = "…";
    try {
      mode === "signup" ? await doSignup(e, p) : await doLogin(e, p);
      toast(mode === "signup" ? "Account created — progress backed up ☁️" : "Logged in — progress restored ☁️");
      renderHome();
    } catch (err) {
      submit.disabled = false; submit.textContent = title;
      toast(err.message);
    }
  });
}

// Handle the password-reset link that Supabase emails (opens app with #type=recovery).
async function handleAuthRedirect() {
  if (!location.hash || location.hash.indexOf("type=recovery") < 0) return false;
  const params = new URLSearchParams(location.hash.slice(1));
  const token = params.get("access_token");
  history.replaceState(null, "", location.pathname + location.search);
  if (!token) return false;
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="settings"></div>`);
  wrap.appendChild(el(`<div class="set-head"><h2>Set a new password</h2></div>`));
  const pw = el(`<input class="text-input" type="password" autocomplete="new-password" placeholder="New password (6+ chars)">`);
  const btn = el(`<button class="btn" style="margin-top:16px">Save new password</button>`);
  wrap.appendChild(pw); wrap.appendChild(btn); app.appendChild(wrap);
  btn.addEventListener("click", async () => {
    if (pw.value.length < 6) { toast("At least 6 characters"); return; }
    btn.disabled = true; btn.textContent = "…";
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, { method: "PUT", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ password: pw.value }) });
      const u = await res.json();
      if (!res.ok) throw new Error(u.msg || u.message || "Reset failed");
      const v = await vaultPull(token);
      if (v) { state.cloud = Object.assign({}, state.cloud || {}, { playerId: v.player_id, secret: v.secret, optedIn: true }); const p = await rpc("get_player", { p_id: v.player_id, p_secret: v.secret }); if (p) applyPlayer(p); }
      state.account = { email: u.email, userId: u.id }; save(); rebuildDeck();
      toast("Password updated ✓"); renderHome();
    } catch (e) { btn.disabled = false; btn.textContent = "Save new password"; toast(e.message); }
  });
  return true;
}
