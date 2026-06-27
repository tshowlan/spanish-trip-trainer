/* ============================== PUSH REMINDERS ============================== */
const pushSupported = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
const minToHHMM = m => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const hhmmToMin = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
function urlB64ToUint8Array(b64) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const s = (b64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(s); return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

async function savePushRow(enabled) {
  ensureIdentity();
  state.cloud.optedIn = true;
  await cloudSync();                                        // make sure the players row exists (secret check)
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC) });
  const j = sub.toJSON();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Madrid";
  await rpc("save_push", {
    p_id: state.cloud.playerId, p_secret: state.cloud.secret,
    p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth,
    p_tz: tz, p_morning: state.reminders.morning, p_evening: state.reminders.evening, p_enabled: enabled
  });
}

async function enableReminders() {
  if (!pushSupported()) { toast("Push isn't supported here. On iPhone, add the app to your Home Screen first."); return false; }
  const perm = await Notification.requestPermission();
  if (perm !== "granted") { toast("Notifications are blocked. Enable them in your phone's settings for this app."); return false; }
  await savePushRow(true);
  state.reminders.enabled = true; save();
  return true;
}
async function disableReminders() {
  state.reminders.enabled = false; save();
  try { await savePushRow(false); } catch { /* keep local off regardless */ }
}

function renderReminders() {
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="settings"></div>`);
  wrap.appendChild(el(`<div class="set-head"><button class="close-btn" id="back">‹</button><h2>Reminders</h2></div>`));
  wrap.appendChild(el(`<p class="onb-dim" style="margin-top:0">A friendly nudge in the morning and before bed to keep your streak alive.</p>`));

  const r = state.reminders;
  const toggle = el(`<div class="set-row"><div><div class="set-t">Daily reminders</div><div class="set-d">${r.enabled ? "On" : "Off"}</div></div>
    <button class="toggle ${r.enabled ? "on" : ""}" id="rtog"><i></i></button></div>`);
  wrap.appendChild(toggle);

  const times = el(`<div id="times" class="${r.enabled ? "" : "hidden"}">
    <div class="set-row"><div class="set-t">Morning</div><input class="time-input" id="mt" type="time" value="${minToHHMM(r.morning)}"></div>
    <div class="set-row"><div class="set-t">Evening</div><input class="time-input" id="et" type="time" value="${minToHHMM(r.evening)}"></div>
  </div>`);
  wrap.appendChild(times);

  const test = el(`<button class="btn grey" style="margin-top:16px">Send a test notification</button>`);
  wrap.appendChild(test);
  wrap.appendChild(el(`<p class="onb-dim" style="margin-top:14px">📱 On iPhone, reminders only work after you <b>Add to Home Screen</b> and allow notifications. iOS may deliver them a little late.</p>`));
  app.appendChild(wrap);

  $("#back").addEventListener("click", renderSettings);
  $("#rtog").addEventListener("click", async (e) => {
    const btn = e.currentTarget; btn.style.opacity = ".5";
    if (!state.reminders.enabled) {
      const ok = await enableReminders();
      if (ok) toast("Reminders on ✓");
    } else { await disableReminders(); toast("Reminders off"); }
    renderReminders();
  });
  const onTime = async () => {
    state.reminders.morning = hhmmToMin($("#mt").value || "08:00");
    state.reminders.evening = hhmmToMin($("#et").value || "21:30");
    save();
    if (state.reminders.enabled) { try { await savePushRow(true); toast("Reminder times saved"); } catch (e) { toast("Couldn't save times: " + e.message); } }
  };
  times.querySelector("#mt").addEventListener("change", onTime);
  times.querySelector("#et").addEventListener("change", onTime);
  test.addEventListener("click", async () => {
    if (!pushSupported()) { toast("Notifications aren't supported here"); return; }
    const perm = await Notification.requestPermission();
    if (perm !== "granted") { toast("Allow notifications first"); return; }
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification("Spanish Trip Trainer", { body: "Look at you go — notifications work! 🎉", icon: "./icon.svg" });
  });
}
