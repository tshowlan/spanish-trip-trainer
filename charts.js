/* ============================== TREND CHARTS (scores spec §7.2) ==============================
   Each dial's trend must have a recognizably DIFFERENT shape — same wiggle three times would
   correctly read as one number dressed three ways. All render from state.scoreHistory
   ({date, readiness, momentum, retention, sessions}); daily session bars come from the session log.
   Return "" until there's enough history (data-gated), so callers can skip empty sections. */
function _histSorted() { return (state.scoreHistory || []).slice().sort((a, b) => (a.date < b.date ? -1 : 1)); }
function _ms(dateStr) { return new Date(dateStr + "T00:00:00").getTime(); }
function _dailySessionCounts() {
  const m = {};
  (state.sessions || []).forEach(s => { const d = s && s.at ? sessionDay(s) : ""; if (d) m[d] = (m[d] || 0) + 1; });
  return m;
}
const _CW = 300, _CH = 120, _CP = 10;

// Readiness — "the climb": the line vs a dotted glide path to 90-at-departure; archive marks.
function _readinessChart() {
  const H = _histSorted().filter(r => r.readiness != null);
  if (H.length < 2) return "";
  const p = state.profile || {};
  const t0 = _ms(H[0].date), lastT = _ms(H[H.length - 1].date);
  const dep = p.tripDate ? _ms(p.tripDate) : lastT;
  const t1 = Math.max(dep, lastT), span = Math.max(1, t1 - t0);
  const X = t => _CP + (_CW - 2 * _CP) * (t - t0) / span;
  const Y = v => _CP + (_CH - 2 * _CP) * (1 - Math.max(0, Math.min(100, v)) / 100);
  const line = H.map((r, i) => `${i ? "L" : "M"}${X(_ms(r.date)).toFixed(1)} ${Y(r.readiness).toFixed(1)}`).join(" ");
  let glide = "";
  if (p.tripDate && dep > t0) glide = `<line class="tc-glide" x1="${X(t0).toFixed(1)}" y1="${Y(H[0].readiness).toFixed(1)}" x2="${X(dep).toFixed(1)}" y2="${Y(90).toFixed(1)}"/>`;
  const marks = (state.archive || []).filter(a => a.tripDate >= H[0].date && _ms(a.tripDate) <= t1)
    .map(a => `<circle class="tc-mark" cx="${X(_ms(a.tripDate)).toFixed(1)}" cy="${Y(a.readinessAtDeparture).toFixed(1)}" r="3.5"/>`).join("");
  return `<svg class="trend-chart" viewBox="0 0 ${_CW} ${_CH}">${glide}<path class="tc-line rd" d="${line}"/>${marks}</svg>`;
}

// Momentum — "the rhythm": rolling 7-day line over faint daily session-count bars (4 weeks).
function _momentumChart() {
  const cutoff = Date.now() - 28 * 864e5;
  const pts = _histSorted().filter(r => r.momentum != null && _ms(r.date) >= cutoff);
  if (pts.length < 2) return "";
  const t0 = _ms(pts[0].date), t1 = _ms(pts[pts.length - 1].date), span = Math.max(1, t1 - t0);
  const base = _CH - _CP;
  const X = t => _CP + (_CW - 2 * _CP) * (t - t0) / span;
  const Y = v => _CP + (base - _CP) * (1 - Math.max(0, Math.min(100, v)) / 100);
  const ds = _dailySessionCounts(), maxS = Math.max(1, ...Object.values(ds));
  let bars = "";
  for (let d = 0; d <= 28; d++) {
    const date = daysAgoStr(28 - d), n = ds[date] || 0;
    if (!n || _ms(date) < t0) continue;
    const x = X(_ms(date)), h = (n / maxS) * 24;
    bars += `<rect class="tc-bar" x="${(x - 2).toFixed(1)}" y="${(base - h).toFixed(1)}" width="4" height="${h.toFixed(1)}" rx="1"/>`;
  }
  const line = pts.map((r, i) => `${i ? "L" : "M"}${X(_ms(r.date)).toFixed(1)} ${Y(r.momentum).toFixed(1)}`).join(" ");
  return `<svg class="trend-chart" viewBox="0 0 ${_CW} ${_CH}">${bars}<path class="tc-line mo" d="${line}"/></svg>`;
}

// Retention — "the sawtooth": UNsmoothed line (decays between sessions, jumps on review); dot each up-jump.
function _retentionChart() {
  const cutoff = Date.now() - 56 * 864e5;
  const pts = _histSorted().filter(r => r.retention != null && _ms(r.date) >= cutoff);
  if (pts.length < 2) return "";
  const t0 = _ms(pts[0].date), t1 = _ms(pts[pts.length - 1].date), span = Math.max(1, t1 - t0);
  const X = t => _CP + (_CW - 2 * _CP) * (t - t0) / span;
  const Y = v => _CP + (_CH - 2 * _CP) * (1 - Math.max(0, Math.min(100, v)) / 100);
  const line = pts.map((r, i) => `${i ? "L" : "M"}${X(_ms(r.date)).toFixed(1)} ${Y(r.retention).toFixed(1)}`).join(" ");
  let dots = "";
  for (let i = 1; i < pts.length; i++) if (pts[i].retention > pts[i - 1].retention + 1)   // a jump = a review
    dots += `<circle class="tc-dot" cx="${X(_ms(pts[i].date)).toFixed(1)}" cy="${Y(pts[i].retention).toFixed(1)}" r="2.6"/>`;
  return `<svg class="trend-chart" viewBox="0 0 ${_CW} ${_CH}">${line ? `<path class="tc-line re" d="${line}"/>` : ""}${dots}</svg>`;
}

function trendChart(which) {
  return which === "readiness" ? _readinessChart()
    : which === "momentum" ? _momentumChart()
    : which === "retention" ? _retentionChart() : "";
}
