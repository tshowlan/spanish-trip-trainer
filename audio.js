/* ---------- audio: TTS (per-country accent) + synthesized success sounds ---------- */
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};
function voiceFor(lang) {
  const vs = speechSynthesis.getVoices();
  return vs.find(v => v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase())   // exact (es-MX)
      || vs.find(v => /^es/i.test(v.lang))                                             // any Spanish
      || null;
}
// NO onend hook, on purpose (Sprint 2 ruling 1): the voice finishing gates NOTHING —
// advance-on-TTS is the graveyarded auto-advance, and removing the socket keeps it dead.
function speak(text, rate, opts) {
  if (!("speechSynthesis" in window)) return;
  // opts.queue lets rapid-fire surfaces (the conveyor) FINISH each phrase instead of
  // beheading it (Tom: "agua wasn't finished before otra cana came in") - utterances
  // queue naturally when we skip the cancel; everything else keeps cancel-and-speak
  if (!(opts && opts.queue)) speechSynthesis.cancel();
  const lang = (typeof activePack === "function" ? activePack().tts : "es-ES");
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; const v = voiceFor(lang); if (v) u.voice = v; u.rate = rate || 0.9;
  speechSynthesis.speak(u);
}

/* The dings, as media clips. Live WebAudio on iOS is muted by the silent switch and its
   clock is interrupted by TTS/lock/calls — notes scheduled there vanish silently (the
   v207/v208 saga). TTS never fails because it rides the MEDIA lane. So each sound is
   synthesized ONCE (offline render → WAV blob) and played through an <audio> element:
   the same lane as the voice, by construction. */
function _renderClip(notes, seconds, normTo) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OAC(1, Math.ceil(44100 * seconds), 44100);
  for (const [freq, start, dur, type, gain] of notes) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain || 0.18, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g).connect(ctx.destination); o.start(start); o.stop(start + dur + 0.03);
  }
  return ctx.startRendering().then(buf => {
    const pcm = buf.getChannelData(0), n = pcm.length;
    // normTo: scale the finished waveform so its true peak lands at normTo of full scale -
    // the loudest this clip can be with zero clipping, independent of how partials sum
    if (normTo) {
      let peak = 0;
      for (let i = 0; i < n; i++) { const a = Math.abs(pcm[i]); if (a > peak) peak = a; }
      if (peak > 0.0001) { const k = normTo / peak; for (let i = 0; i < n; i++) pcm[i] *= k; }
    }
    const v = new DataView(new ArrayBuffer(44 + n * 2));
    const tag = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
    tag(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); tag(8, "WAVEfmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 44100, true); v.setUint32(28, 88200, true);
    v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    tag(36, "data"); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 32767, true);
    const el = new Audio(URL.createObjectURL(new Blob([v.buffer], { type: "audio/wav" })));
    el.setAttribute("playsinline", ""); el.preload = "auto";
    return el;
  });
}
const _clips = {};
try {
  if (navigator.audioSession) navigator.audioSession.type = "playback";
  // gains re-leveled 8/19 (Tom: the ding sat well under the voice): correct/win bake at
  // 0.45/0.4 peak (~+8dB over the old 0.18, still clip-safe with note overlap); wrong stays
  // deliberately soft - errors never blare.
  // Correct: E5+B5 with an octave-down partial under each for body (two short thin sines
  // kept reading quiet at any gain - Tom, 8/19), then normalized to 0.95 true peak.
  _renderClip([
    [659.25, 0, 0.16, "sine", 0.6], [329.63, 0, 0.16, "sine", 0.22],
    [987.77, 0.09, 0.2, "sine", 0.6], [493.88, 0.09, 0.2, "sine", 0.22]
  ], 0.4, 0.95).then(el => _clips.correct = el);
  _renderClip([523.25, 659.25, 783.99, 1046.5].map((f, i) => [f, i * 0.11, 0.22, "sine", 0.4]), 0.8).then(el => _clips.win = el);
  _renderClip([[196, 0, 0.22, "triangle", 0.18]], 0.4).then(el => _clips.wrong = el);
} catch (e) { /* no offline audio: dings degrade to silence, the app is unaffected */ }
// NO background keeper loop here, ever: a playing media element stomps on iOS
// speechSynthesis, and the voice outranks the ding (learned v210, reverted v211).
// iOS lets an <audio> element play programmatically only after it has once played inside a
// user gesture — prime each clip (muted play/pause) on taps until all three are unlocked.
document.addEventListener("pointerdown", () => {
  for (const k in _clips) {
    const el = _clips[k];
    if (el._primed) continue;
    el.muted = true;
    el.play().then(() => { el.pause(); el.currentTime = 0; el.muted = false; el._primed = true; })
      .catch(() => { el.muted = false; });
  }
}, { capture: true, passive: true });
function playSound(kind, opts) {
  if (!state.sound) return;
  const el = _clips[kind]; if (!el) return;
  // iOS swallows the clip when it lands too close to active/ending TTS (Tom, 8/18: ding
  // plays if he waits, dies if he answers near the voice's end). A GRADE ding always means
  // the exercise is answered, so the phrase has done its job: cancel speech first, freeing
  // the audio session. Grade dings only - the conveyor's queued speech must never be cut.
  if ((kind === "correct" || kind === "wrong") && "speechSynthesis" in window
      && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
  // opts.rate re-pitches the baked clip (preservesPitch off, so rate IS pitch) - the pairs
  // board climbs a chord as matches land [tune]; everything else plays at 1
  try { el.preservesPitch = false; el.webkitPreservesPitch = false; } catch (e) {}
  el.playbackRate = (opts && opts.rate) || 1;
  // one imperceptible retry: right at TTS teardown iOS can reject the first play()
  el.play().catch(() => { setTimeout(() => { try { el.play().catch(() => {}); } catch (_) {} }, 60); });
  // rewind AFTER (and on ended), not before: a pre-play seek adds latency to the next ding
  el.onended = () => { el.currentTime = 0; };
  if (!el.paused && el.currentTime > 0.03) { el.currentTime = 0; }   // rapid re-fire: restart mid-clip
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
