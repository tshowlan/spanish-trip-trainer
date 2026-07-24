#!/usr/bin/env node
/* Pack-state export for chat writing sessions (standing context-pack artifact).
   Emits design/context-pack/<pack>-pack-state.md in the pass-1 manifest format:
   per lesson, the CURRENT phrase list (repo truth — the taught-once law's ground),
   primers/rewards/cultureNotes, plus per-lesson atlas numbers merged from
   tools/atlas-snapshot.json when present (band shortfall, flags — the sweep's
   aiming inputs). Run via tools/refresh-context-pack.sh; refresh the snapshot
   from dev/atlas.html after content ships. */
import { createRequire } from "module";
import { writeFileSync, readFileSync, existsSync } from "fs";
const require = createRequire(import.meta.url);

const { CURRICULUM } = require("../curriculum.js");
const MEXICO = require("../content_mx.js");
const SNAP_PATH = new URL("./atlas-snapshot.json", import.meta.url).pathname;
const snap = existsSync(SNAP_PATH) ? JSON.parse(readFileSync(SNAP_PATH, "utf8")) : null;

const tokens = es => es.trim().split(/\s+/).length;

function shapeOf(lesson, passIdx) {
  if (lesson.chain) return "chain";
  if (lesson.machine) return "machine";
  return passIdx === 0 ? "kit" : "scenario";
}

function lessonBlock(lesson, passIdx, snapPack) {
  const out = [];
  const shape = shapeOf(lesson, passIdx);
  out.push(`### ${lesson.title}  \`${lesson.id}\``);
  out.push(`- topic/setting: ${lesson.topic || "(none)"} · shape: ${shape}${lesson.requires ? " · gated: " + JSON.stringify(lesson.requires) : ""}`);
  const p = lesson.primer;
  if (p && (p.scene || p.guessItem)) {
    const scene = (p.scene || "").slice(0, 90);
    out.push(`- primer: EXISTS (scene: "${scene}${(p.scene || "").length > 90 ? "..." : ""}")${p.guessItem ? ` · guessItem: "${p.guessItem}"` : ""}${p.mission ? ` · mission: "${p.mission}"` : ""}`);
  } else out.push("- primer: NONE (needs authoring)");
  if (lesson.reward) out.push(`- reward (invert to promise): "${lesson.reward}"`);
  if (lesson.cultureNote) out.push(`- cultureNote (cast dialogue stream): "${lesson.cultureNote}"`);

  const s = snapPack && snapPack[lesson.id];
  if (s) {
    const aim = s.shortfallMin ? `SHORT by ~${s.shortfallMin} min (band ${s.band.join("-")})` :
                s.overMin ? `OVER by ~${s.overMin} min (band ${s.band.join("-")})` : `in band ${s.band.join("-")}`;
    out.push(`- atlas (${snap.date}): ${s.estMin} min · ${aim} · difficulty ${s.difficulty} · ramp ${s.ramp}${s.flags.length ? " · flags: " + s.flags.join(" · ") : ""}`);
  }

  if (lesson.chain) {
    const turns = lesson.chain.turns || [];
    out.push(`- chain (${turns.length} turns; user lines are the graded items):`);
    turns.forEach((t, i) => {
      if (t.npc) out.push(`  ${i + 1}. NPC: ${t.npc.es} — ${t.npc.en}`);
      else if (t.narr) out.push(`  ${i + 1}. NARR: ${t.narr}`);
      else out.push(`  ${i + 1}. USER: ${t.user}`);
    });
  } else {
    const items = lesson.items || [];
    out.push(`- phrases (${items.length}; first = anchor):`);
    items.forEach((it, i) => {
      const tk = tokens(it.es);
      const extra = [];
      if (it.note) extra.push(`note: ${it.note}`);
      if (it.keywords && it.keywords.length) extra.push(`kw: ${it.keywords.join(", ")}`);
      if (it.chunks) extra.push("chunked");
      out.push(`  ${i + 1}. ${it.es} — ${it.en}  (${tk} tok)${extra.length ? "  [" + extra.join(" · ") + "]" : ""}`);
    });
    const eligible = items.filter(it => { const t = tokens(it.es); return t >= 4 && t <= 8; }).length;
    out.push(`- build-eligible (4-8 tok): ${eligible}/${items.length}${eligible === 0 ? "  ← sweep adds get first claim here" : ""}`);
  }
  out.push("");
  return out.join("\n");
}

function exportPack(pack, key, label) {
  const snapPack = snap && snap[key];
  const lines = [
    `# ${label} pack state (repo truth, ${new Date(process.env.STAMP || Date.now()).toISOString().slice(0, 10)})`,
    "",
    "Auto-exported by tools/export-pack-state.mjs (context-pack ritual). Phrase lists are the",
    "taught-once law's ground truth: author against THIS, never memory. Atlas numbers merged from",
    `tools/atlas-snapshot.json${snapPack ? ` (${snap.date})` : " (no snapshot for this pack yet)"}.`,
    "",
  ];
  (pack.stages || []).forEach((stage, passIdx) => {
    lines.push(`## Stage: ${stage.title || stage.id || "pass " + passIdx} (pass ${stage.pass != null ? stage.pass : passIdx})`);
    lines.push("");
    (stage.lessons || []).forEach(l => lines.push(lessonBlock(l, stage.pass != null ? stage.pass : passIdx, snapPack)));
  });
  return lines.join("\n");
}

writeFileSync("design/context-pack/spain-pack-state.md", exportPack(CURRICULUM, "spain", "Spain"));
writeFileSync("design/context-pack/mexico-pack-state.md", exportPack(MEXICO, "mexico", "Mexico"));
console.log("pack-state exported: design/context-pack/{spain,mexico}-pack-state.md");
