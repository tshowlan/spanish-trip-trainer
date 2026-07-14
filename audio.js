/* ---------- audio: TTS (per-country accent) + synthesized success sounds ---------- */
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};
function voiceFor(lang) {
  const vs = speechSynthesis.getVoices();
  return vs.find(v => v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase())   // exact (es-MX)
      || vs.find(v => /^es/i.test(v.lang))                                             // any Spanish
      || null;
}
function speak(text, rate) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const lang = (typeof activePack === "function" ? activePack().tts : "es-ES");
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; const v = voiceFor(lang); if (v) u.voice = v; u.rate = rate || 0.9;
  speechSynthesis.speak(u);
}

let actx = null;
function note(freq, start, dur, type = "sine", gain = 0.18) {
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(actx.destination); o.start(start); o.stop(start + dur + 0.03);
}
function playSound(kind) {
  if (!state.sound) return;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === "suspended") actx.resume(); }
  catch { return; }
  const n = actx.currentTime;
  if (kind === "correct") { note(659.25, n, 0.12); note(987.77, n + 0.09, 0.16); }           // E5 + B5
  else if (kind === "win") { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, n + i * 0.11, 0.22)); }
  else if (kind === "wrong") { note(196, n, 0.22, "triangle", 0.12); }
}

/* §8.2 haptic map — one event, one haptic, always. Uses Capacitor Haptics when the app is
   packaged natively; falls back to navigator.vibrate on the web (iOS Safari ignores it, so it
   simply no-ops there). Haptics are an enhancement — never required for correctness. */
const _VIBE = {
  press: [8],                       // card press — light impact
  correct: [16],                    // crisp success tick
  wrong: [22, 45, 22],              // soft double-thud, never a buzzer
  milestone: [12, 26, 12],          // progress-bar 25/50/75% notch
  restored: [30],                   // fading phrase brought back (§8.4) — distinct medium tap
  complete: [20, 45, 20, 45, 35]    // session complete — one reserved pattern, used nowhere else
};
function haptic(evt) {
  if (state && state.haptics === false) return;
  const pat = _VIBE[evt]; if (!pat) return;
  try {
    const H = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
    if (H) {                                                    // native (Capacitor Haptics plugin)
      if (evt === "correct" || evt === "complete") H.notification({ type: "SUCCESS" });
      else if (evt === "wrong") H.notification({ type: "WARNING" });
      else if (evt === "press") H.impact({ style: "LIGHT" });
      else H.impact({ style: "MEDIUM" });                       // milestone / restored
      return;
    }
    if (navigator.vibrate) navigator.vibrate(pat);              // web fallback
  } catch (e) { /* haptics are best-effort */ }
}
