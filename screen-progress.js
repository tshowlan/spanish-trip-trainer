/* ============================== PROGRESS + GROUP ============================== */
function renderProgress() {
  showTabbar("progress");
  clearFooter();
  const app = $("#app"); app.innerHTML = "";
  const wrap = el(`<div class="screen tab-screen"></div>`);
  const d = destInfo(state.profile && state.profile.destination);
  const done = Object.keys(state.lessons).length;
  const total = (typeof LESSON_ORDER !== "undefined" && LESSON_ORDER.length) || 1;
  wrap.appendChild(el(`<div class="screen-head"><h2>Progress</h2></div>`));
  wrap.appendChild(el(`<div class="scorebar" style="margin-top:0">
    <div class="score"><div class="n">🔥 ${state.streak}</div><div class="l">day streak</div></div>
    <div class="score"><div class="n">⚡ ${state.xp}</div><div class="l">XP · ${d.label}</div></div>
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
