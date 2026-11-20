// Generate the dietary lines review from the REAL engine: one section per dietary answer, exactly what that learner's deck holds.
// run: node tools/dietary-lines-review.js docs/<name>.md
const vm = require("vm"), fs = require("fs"), path = require("path");
const REPO = path.join(__dirname, "..");
const mem = { sts_staging: "1" };
const ctx = { console, setTimeout, clearTimeout, Date, Math, JSON, Intl, Promise, Map, Set, Array, Object, Number, String, RegExp, Error,
  localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } },
  document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, body: { classList: { add() {}, remove() {}, contains: () => false }, appendChild() {} }, documentElement: { dataset: {}, setAttribute() {}, getAttribute: () => null, classList: { add() {}, remove() {} } }, createElement: () => ({ style: {}, classList: { add() {}, remove() {} }, setAttribute() {}, appendChild() {} }), head: { appendChild() {} } },
  navigator: { language: "en-US", onLine: true, userAgent: "node" }, fetch: () => new Promise(() => {}), location: { href: "", search: "", hash: "" }, matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }), requestAnimationFrame: f => setTimeout(f, 0), speechSynthesis: { getVoices: () => [], cancel() {} }, Audio: function () { return { play: () => Promise.resolve() }; } };
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx; vm.createContext(ctx);
const run = src => vm.runInContext(src, ctx);
const origLog = console.log; console.log = (...a) => { if (!/duplicate item id/.test(String(a[0]))) origLog(...a); };
console.warn = () => {};
for (const f of ["config.js", "state.js", "ui.js", "curriculum.js", "content_mx.js", "messages.js", "weights.js", "engine.js", "srs.js", "stats.js", "scoring.js", "tiers.js", "cloud.js"]) { try { run(fs.readFileSync(path.join(REPO, f), "utf8")); } catch (e) { origLog("LOAD FAIL", f, e.message.slice(0, 120)); } }
const read = (needs, allergies, grammar) => JSON.parse(run(`(() => {
  state.profile = Object.assign({}, state.profile || {}, { destination: "spain", needs: ${JSON.stringify(needs)}, allergies: ${JSON.stringify(allergies)}, grammar: ${JSON.stringify(grammar)} });
  state.lessons = {}; state.learn = {}; rebuildDeck();
  const out = { words: [], cards: [], lines: [] };
  DECK.stages.forEach(st => st.lessons.forEach(l => (l.items || []).forEach(it => {
    if (!it.diet) return;
    const row = { where: l.title, es: it.es, en: it.en, ctxEs: it.contextEs || "", ctxEn: it.contextEn || "", note: it.note || "", words: it.words || null, replies: it.replies || [], hint: it.hint || [], near: it.near || [], line: l.line || "", examples: l.examples || [] };
    if (!l.sentences) out.words.push(row); else if (it.card) out.cards.push(row); else out.lines.push(row);
  })));
  return JSON.stringify(out);
})()`));
const build = run("APP_BUILD");
const esc = s => String(s || "").replace(/\|/g, "\\|");
const section = (title, who, d, extra) => {
  let m = `## ${title}\n\n*${who}*\n\n`;
  if (!d.words.length && !d.cards.length && !d.lines.length) return m + "Nothing dietary in this learner's deck.\n\n";
  if (d.words.length) { m += `**The word (chapter 1, ${d.words[0].where}):**\n\n| Spanish | English | Example | Good to know |\n|---|---|---|---|\n`; d.words.forEach(w => { m += `| ${esc(w.es)} | ${esc(w.en)} | ${esc(w.ctxEs)} / ${esc(w.ctxEn)} | ${esc(w.note) || "(none)"} |\n`; }); m += "\n"; }
  if (d.cards.length) { m += `**The cards (met once, at the Table):**\n\n| Card | English | Word by word | Example | Good to know |\n|---|---|---|---|---|\n`; d.cards.forEach(c => { m += `| ${esc(c.es)} | ${esc(c.en)} | ${(c.words || []).map(w => `${esc(w[0])} = ${esc(w[1])}`).join("; ")} | ${esc(c.ctxEs)} / ${esc(c.ctxEn)} | ${esc(c.note) || "(none)"} |\n`; }); m += "\n"; }
  const places = []; d.lines.forEach(s => { if (!places.includes(s.where)) places.push(s.where); });
  places.forEach(pl => { const rows = d.lines.filter(s => s.where === pl); const own = / Part 2$/.test(pl) ? `\n\n*The row's line: "${rows[0].line}" Examples: ${rows[0].examples.join(" · ")}*` : ""; m += `**${pl}:**${own}\n\n| You say | English | Built from (the hint) | Near misses | You hear back | Good to know |\n|---|---|---|---|---|---|\n`; rows.forEach(s => { m += `| ${esc(s.es)} | ${esc(s.en)} | ${s.hint.map(h => `${esc(h[0])} = ${esc(h[1])}`).join("<br>")} | ${s.near.map(esc).join("<br>")} | ${s.replies.map(r => `${esc(r[0])} (${esc(r[1])})`).join("<br>")} | ${esc(s.note) || "(none)"} |\n`; }); m += "\n"; });
  if (extra) m += extra + "\n\n";
  return m;
};
const diff = (a, b) => { const o = []; ["words", "cards", "lines"].forEach(k => a[k].forEach((x, i) => { const y = b[k].find(z => z.where === x.where && (z.es === x.es || b[k].indexOf(z) === i)) || b[k][i]; if (!y) { o.push(`- ${x.es} is not served`); return; } const heard = y.replies.filter((r, j) => r[0] !== (x.replies[j] || [])[0]).map(r => `**${r[0]}** (${r[1]})`).join(", "); if (x.es !== y.es) o.push(`- ${x.es} becomes **${y.es}**${x.en !== y.en ? ` (${y.en})` : ""}${heard ? `; you hear back ${heard}` : ""}`); else if (heard) o.push(`- ${x.es} stays, and you hear back ${heard}`); })); return o.join("\n") || "- No change."; };
let md = `# Tripfluent: every dietary line, by answer (for Tom's review)\n\n*Generated from the app's own engine at ${build} (the dietary lines shipped at v634). Each section is exactly what a learner with that one answer is served: the word in chapter 1, the cards, and every sentence by session with all three replies and its Good to know. Nothing here is retold from memory. Mark it up and send it back; the copy is chat's, so wording changes go through chat.*\n\n*A learner with no dietary answer gets none of this.*\n\n**How to read it:** "Built from" is the hint the learner builds the sentence with, piece by piece. "Near misses" are the wrong meanings offered beside the right one. "You hear back" lists all three replies a sentence can draw. "(none)" means the line has no Good to know. A learner with four or more of their own Table sentences gets them as their own row, Table sentences · Part 2.\n\n---\n\n`;
const cel = read(["celiac"], [], "o"), celA = read(["celiac"], [], "a"), celN = read(["celiac"], [], "neutral");
md += section("Celiac", "The Celiac chip. Shown in the -o form.", cel, `**In the -a form:**\n${diff(cel, celA)}\n\n**Neutral or unset:**\n${diff(cel, celN)}`);
md += section("Gluten-free, not celiac", "The Gluten-free, not celiac chip.", read(["gluten_free"], [], "o"));
md += section("Lactose intolerant", "The Lactose intolerant chip (not the milk allergy).", read(["lactose_free"], [], "o"));
const veg = read(["vegetarian"], [], "o"), vegA = read(["vegetarian"], [], "a"), vegN = read(["vegetarian"], [], "neutral");
md += section("Vegetarian", "The Vegetarian chip. Shown in the -o form.", veg, `**In the -a form:**\n${diff(veg, vegA)}\n\n**Neutral or unset:**\n${diff(veg, vegN)}`);
[["shellfish", "Shellfish"], ["fish", "Fish"], ["dairy", "Milk"], ["eggs", "Egg"], ["nuts", "Nuts"], ["peanuts", "Peanuts"], ["soy", "Soy"]].forEach(([k, label]) => { md += section(`${label} allergy`, `Food allergies, then ${label}.`, read(["allergies"], [k], "o")); });
md += section("Several allergies: shellfish, nuts, and egg", "Three chosen in that order. The card shows the first; the declaring sentence names all three; ¿Lleva ___? exists for each.", read(["allergies"], ["shellfish", "nuts", "eggs"], "o"));
md += section("Celiac with a shellfish allergy", "Both answers. One ¿Lleva ___? card (gluten, the first answer). The sweeping lines follow the celiac answer; the allergy adds its own.", read(["celiac", "allergies"], ["shellfish"], "o"));
fs.writeFileSync(process.argv[2], md);
origLog("written", md.length, "chars,", md.split("\n").length, "lines");
