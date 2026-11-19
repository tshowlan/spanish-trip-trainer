// Generate the dietary lines review from the REAL engine: one section per dietary answer, exactly what that learner's deck holds.
const vm = require("vm"), fs = require("fs"), path = require("path");
const REPO = path.join(__dirname, "..");   // run: node tools/dietary-lines-review.js docs/<name>.md
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
  const out = { words: [], cards: [], sentences: [], elsewhere: [] };
  DECK.stages.forEach(st => st.lessons.forEach(l => (l.items || []).forEach(it => {
    if (!it.diet) return;
    const row = { where: l.title, es: it.es, en: it.en, ctxEs: it.contextEs || "", ctxEn: it.contextEn || "", note: it.note || "", words: it.words || null, replies: it.replies || [], keyed: !!(it.staged === "trip-celiac" || it.tid) };
    if (!l.sentences) out.words.push(row); else if (it.card) out.cards.push(row); else if (row.keyed) out.sentences.push(row); else out.elsewhere.push(row);
  })));
  return JSON.stringify(out);
})()`));
const build = run("APP_BUILD");
const esc = s => String(s || "").replace(/\|/g, "\\|");
const section = (title, who, d, extra) => {
  let m = `## ${title}\n\n*${who}*\n\n`;
  if (!d.words.length && !d.cards.length && !d.sentences.length && !d.elsewhere.length) return m + "Nothing dietary in this learner's deck.\n\n";
  if (d.words.length) { m += `**The word (chapter 1, ${d.words[0].where}):**\n\n| Spanish | English | Example | Good to know |\n|---|---|---|---|\n`; d.words.forEach(w => { m += `| ${esc(w.es)} | ${esc(w.en)} | ${esc(w.ctxEs)} / ${esc(w.ctxEn)} | ${esc(w.note) || "(none)"} |\n`; }); m += "\n"; }
  if (d.cards.length) { m += `**The cards (met once, at the Table):**\n\n| Card | English | Word by word | Example | Good to know |\n|---|---|---|---|---|\n`; d.cards.forEach(c => { m += `| ${esc(c.es)} | ${esc(c.en)} | ${(c.words || []).map(w => `${esc(w[0])} = ${esc(w[1])}`).join("; ")} | ${esc(c.ctxEs)} / ${esc(c.ctxEn)} | ${esc(c.note) || "(none)"} |\n`; }); m += "\n"; }
  if (d.sentences.length) { m += `**The sentences (Table sentences):**\n\n| You say | English | You hear back | Good to know |\n|---|---|---|---|\n`; d.sentences.forEach(s => { m += `| ${esc(s.es)} | ${esc(s.en)} | ${s.replies.map(r => `${esc(r[0])} (${esc(r[1])})`).join("<br>")} | ${esc(s.note) || "(none)"} |\n`; }); m += "\n"; }
  if (d.elsewhere.length) { m += `**The "sin" lines in the place sessions:**\n\n| Where | You say | English | You hear back |\n|---|---|---|---|\n`; d.elsewhere.forEach(s => { m += `| ${esc(s.where)} | ${esc(s.es)} | ${esc(s.en)} | ${s.replies.map(r => `${esc(r[0])} (${esc(r[1])})`).join("<br>")} |\n`; }); m += "\n"; }
  if (extra) m += extra + "\n\n";
  return m;
};
let md = `# Tripfluent: every dietary line, by answer (for Tom's review)\n\n*Generated from the app's own engine at ${build}, with the celiac switch on. Each section is exactly what a learner with that one answer is served: the word in chapter 1, the cards, the sentences with every reply they can hear, and the Good to know notes. Nothing here is retold from memory. Mark it up and send it back; the copy is chat's, so wording changes go through chat.*\n\n*A learner with no dietary answer gets none of this.*\n\n`;
md += `**How to read it:** "You hear back" lists all three replies a sentence can draw. "(none)" means the line has no Good to know. The "sin" lines are older sentences in the Counter, Table, and Shop sessions that take your own word in the slot.\n\n---\n\n`;
md += section("Gluten-free", "The Gluten-free chip. Written for the -o adjective answer.", read(["gluten_free"], [], "o"));
const cel = read(["celiac"], [], "o"), celA = read(["celiac"], [], "a"), celN = read(["celiac"], [], "neutral");
const diff = (a, b) => { const o = []; ["words", "cards", "sentences"].forEach(k => a[k].forEach((x, i) => { const y = b[k][i]; if (!y) return; const heard = y.replies.filter((r, j) => r[0] !== (x.replies[j] || [])[0]).map(r => `**${r[0]}** (${r[1]})`).join(", "); if (x.es !== y.es) o.push(`- ${x.es} becomes **${y.es}**${x.en !== y.en ? ` (${y.en})` : ""}${heard ? `; you hear back ${heard}` : ""}`); else if (heard) o.push(`- ${x.es} stays, and you hear back ${heard}`); })); return o.join("\n") || "- No change."; };
md += section("Celiac", "The Celiac chip. Everything Gluten-free gets, plus its own word, sentence, and the kitchen question. Shown in the -o form.", cel, `**In the -a form:**\n${diff(cel, celA)}\n\n**Neutral or unset:**\n${diff(cel, celN)}`);
md += section("Lactose-free", "The Lactose-free chip (intolerance, not allergy).", read(["lactose_free"], [], "o"));
const veg = read(["vegetarian"], [], "o"), vegA = read(["vegetarian"], [], "a"), vegN = read(["vegetarian"], [], "neutral");
md += section("Vegetarian", "The Vegetarian chip. Shown in the -o form.", veg, `**In the -a form:**\n${diff(veg, vegA)}\n\n**Neutral or unset:**\n${diff(veg, vegN)}`);
[["shellfish", "Shellfish"], ["nuts", "Nuts"], ["dairy", "Dairy"], ["peanuts", "Peanuts"], ["eggs", "Eggs"], ["fish", "Fish"], ["soy", "Soy"]].forEach(([k, label]) => { md += section(`${label} allergy`, `Food allergies, then ${label.split(" ")[0]}.`, read(["allergies"], [k], "o")); });
md += section("Several allergies: shellfish, nuts, and eggs", "Three chosen in that order. The declaring line names all three; ¿Lleva ___? exists for each; the other two lines use the first.", read(["allergies"], ["shellfish", "nuts", "eggs"], "o"));
md += section("Celiac with a shellfish allergy", "Both answers. One ¿Lleva ___? card (gluten, the first answer); the \"sin\" lines take the allergy's word.", read(["celiac", "allergies"], ["shellfish"], "o"));
fs.writeFileSync(process.argv[2], md);
origLog("written", md.length, "chars,", md.split("\n").length, "lines");
