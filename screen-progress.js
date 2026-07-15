/* ============================== PROGRESS + GROUP ============================== */
// 14-day activity strip (dot filled on days you practiced)
function streakStrip() {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    days.push(`<i class="${(state.history || []).includes(d) ? "hit" : ""}" title="${d}"></i>`);
  }
  return `<div class="streak-strip"><span>Last 2 weeks</span><div class="dots">${days.join("")}</div></div>`;
}
function renderProgress() {
  showTabbar("progress");
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen tab-screen"></div>`);
  const d = destInfo(state.profile && state.profile.destination);
  const done = Object.keys(state.lessons).length;
  const total = (typeof LESSON_ORDER !== "undefined" && LESSON_ORDER.length) || 1;
  wrap.appendChild(el(`<div class="screen-head"><h2>Progress</h2></div>`));
  const readiness = (state.scoresCache || {}).readiness;
  wrap.appendChild(el(`<div class="scorebar" style="margin-top:0">
    <div class="score"><div class="n">${icon('flame', 20)} ${state.streak}</div><div class="l">day streak</div></div>
    <div class="score"><div class="n">${readiness != null ? readiness + "<span class='pct'>%</span>" : "–"}</div><div class="l">readiness · ${d.label}</div></div>
    <div class="score"><div class="n">${done}/${total}</div><div class="l">lessons</div></div>
  </div>`));
  wrap.appendChild(el(streakStrip()));

  // §3.1 Progress = reflection: status tier, trends, divergence, and the trip archive live here.
  if (typeof currentTier === "function") {
    wrap.appendChild(el(`<div class="q-head">Status</div>`));
    wrap.appendChild(el(`<div class="prog-tier"><div class="pt-name">${currentTier()}</div><div class="pt-next">${nextTierCondition()}</div></div>`));
  }

  // §7.2 trend charts — each a different shape (data-gated: nothing until history accrues)
  const labels = { readiness: ["Readiness", "the climb"], momentum: ["Momentum", "the rhythm"], retention: ["Retention", "the sawtooth"] };
  const trends = Object.keys(labels).map(m => ({ m, svg: (typeof trendChart === "function") ? trendChart(m) : "" })).filter(t => t.svg);
  if (trends.length) {
    wrap.appendChild(el(`<div class="q-head">Trends</div>`));
    trends.forEach(t => wrap.appendChild(el(`<div class="prog-trend"><div class="pt-label">${labels[t.m][0]} <span class="pt-story">${labels[t.m][1]}</span></div>${t.svg}</div>`)));
  }
  const dv = (typeof divergenceLine === "function") ? divergenceLine() : null;
  if (dv) wrap.appendChild(dv);

  const cats = Object.entries(state.topicStats || {}).filter(([, v]) => v && v.total >= 4)
    .sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total);
  if (cats.length) {
    wrap.appendChild(el(`<div class="q-head">Your strengths</div>`));
    cats.forEach(([k, v]) => {
      const pct = Math.round(v.correct / v.total * 100);
      wrap.appendChild(el(`<div class="prog-row"><span>${k}</span><span class="prog-pct">${pct}%</span></div>`));
    });
  }

  // §5.2 trip archive — permanent trophies
  const arch = (typeof completedTrips === "function") ? completedTrips() : [];
  if (arch.length) {
    wrap.appendChild(el(`<div class="q-head">Trips</div>`));
    arch.slice().reverse().forEach(t => {
      const di = destInfo(t.destination), band = readinessBand(t.readinessAtDeparture);
      wrap.appendChild(el(`<div class="archive-row"><div class="arch-dest">${di.flag} ${di.label}</div><div class="arch-meta">${t.tripDate}</div><div class="arch-score ${band.cls}">${t.readinessAtDeparture}%</div></div>`));
    });
  }

  wrap.appendChild(el(`<div class="q-head">Trip group</div>`));
  const grp = el(`<div id="prog-group"></div>`);
  wrap.appendChild(grp);
  app.appendChild(wrap);
  (state.cloud && state.cloud.group) ? renderGroupView(grp, renderProgress) : renderGroupJoin(grp, renderProgress);
}
