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

  const cats = Object.entries(state.topicStats || {}).filter(([, v]) => v && v.total >= 4)
    .sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total);
  if (cats.length) {
    wrap.appendChild(el(`<div class="q-head">Your strengths</div>`));
    cats.forEach(([k, v]) => {
      const pct = Math.round(v.correct / v.total * 100);
      wrap.appendChild(el(`<div class="prog-row"><span>${k}</span><span class="prog-pct">${pct}%</span></div>`));
    });
  }

  wrap.appendChild(el(`<div class="q-head">Trip group</div>`));
  const grp = el(`<div id="prog-group"></div>`);
  wrap.appendChild(grp);
  app.appendChild(wrap);
  (state.cloud && state.cloud.group) ? renderGroupView(grp, renderProgress) : renderGroupJoin(grp, renderProgress);
}
