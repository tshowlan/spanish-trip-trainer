/* ---------- audio: TTS (per-country accent) + synthesized success sounds ---------- */
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};
function voiceFor(lang) {
  const vs = speechSynthesis.getVoices();
  return vs.find(v => v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase())   // exact (es-MX)
      || vs.find(v => /^es/i.test(v.lang))                                             // any Spanish
      || null;
}
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const lang = (typeof activePack === "function" ? activePack().tts : "es-ES");
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; const v = voiceFor(lang); if (v) u.voice = v; u.rate = 0.9;
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
