#!/usr/bin/env node
/* Phase-1 Stage-0 migration inventory (docs/tripfluent-stage0-migration-plan.md §1).
   Read-only. Loads a pack by stubbing the browser globals it expects, then reports:
   item inventory, audit checks 11-12, and the three migration queries + coverage gaps.

   Usage:  node tools/stage0-inventory.mjs [spain|mexico]   (default: spain)   */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.dirname(new URL(import.meta.url).pathname).replace(/\/tools$/, "");
const which = (process.argv[2] || "spain").toLowerCase();
const PACK = which === "mexico"
  ? { file: "content_mx.js", varName: "MEXICO_PACK", key: "mexico" }
  : { file: "curriculum.js", varName: "CURRICULUM", key: "spain" };

// ---- load the pack in a sandbox (packs are pure data; just eval the file) ----
const sandbox = {};
vm.createContext(sandbox);
// top-level `const` in a classic script doesn't become a sandbox property, so append an explicit export
const code = fs.readFileSync(path.join(ROOT, PACK.file), "utf8") + `\n;globalThis.__PACK__ = ${PACK.varName};`;
vm.runInContext(code, sandbox);
const stages = sandbox.__PACK__.stages;

// ---- helpers mirroring engine.js ----
const slug = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function categoryOf(topic) {
  const t = (topic || "").toLowerCase();
  if (t.includes("restaurant") || t.includes("coffee") || t.includes("allerg")) return "Food & Drink";
  if (t.includes("transport") || t.includes("airport") || t.includes("taxi") || t.includes("plane")) return "Transport";
  if (t.includes("walking") || t.includes("direction")) return "Directions";
  if (t.includes("hotel") || t.includes("airbnb")) return "Lodging";
  if (t.includes("landmark") || t.includes("sight")) return "Sights";
  if (t.includes("number") || t.includes("time")) return "Numbers & Time";
  if (t.includes("advanced")) return "Advanced";
  return "Basics";
}
const tokens = es => (es || "").trim().split(/\s+/).length;
const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[¿?¡!.,;:"«»]/g, "").trim();

// ---- flatten to an item inventory with computed fields ----
const items = [];
stages.forEach((st, si) => (st.lessons || []).forEach((l, li) => {
  const cat = categoryOf(l.topic || st.title);
  (l.items || []).forEach((it, ii) => {
    items.push({
      id: it.id || `${PACK.key}:${slug(it.es)}`,
      es: it.es, en: it.en, pass: st.pass ?? null, stage: st.title, lesson: l.title, lessonId: l.id,
      topic: l.topic, category: cat, tier: it.tier ?? 2, tokens: tokens(it.es),
      frame: it.frame || null, chunks: Array.isArray(it.chunks) ? it.chunks.length : 0,
      variants: Array.isArray(it.variants) ? it.variants.length : 0,
      keywords: it.keywords || [], hasContext: !!it.contextEs, hasPrimer: !!l.primer, chain: !!l.chain,
    });
  });
}));

// ================= HEAD FRAMES (§1b.0) — detected by surface pattern in `es` =================
const HEAD = [
  { name: "quiero ___", re: /^quiero\b/i },
  { name: "me trae ___", re: /\bme (trae|puede traer|traes)\b/i },
  { name: "¿dónde está ___?", re: /d[oó]nde est[aá]\b/i },
  { name: "¿cuánto cuesta ___?", re: /cu[aá]nto (cuesta|cuestan|es|vale)\b/i },
  { name: "hay ___", re: /^\s*¿?\s*hay\b/i },
  { name: "necesito ___", re: /^necesito\b/i },
  { name: "¿puedo ___?", re: /\bpuedo\b/i },
];
const headOf = es => (HEAD.find(h => h.re.test(es || "")) || {}).name || null;

// broader frame fingerprint for the "≥3 outside the head list" tail-frame census: first 1-2 function
// words that plausibly open a reusable frame (heuristic — flags candidates for human review, not truth)
function frameFingerprint(es) {
  const explicit = headOf(es); if (explicit) return explicit;
  const w = norm(es).split(" ");
  if (!w.length) return null;
  const openers2 = ["me puede", "se puede", "esta muy", "tiene usted", "puede usted", "donde puedo", "a que", "que tal"];
  const two = w.slice(0, 2).join(" ");
  if (openers2.includes(two)) return two + " ___";
  const opener1 = ["tiene", "quiere", "puede", "hay", "necesito", "quiero", "donde", "cuanto", "cuando", "como", "que", "acepta", "esta"];
  if (opener1.includes(w[0]) && w.length >= 2) return w[0] + " ___";
  return null;
}

// ================= MIGRATION QUERY 1: kit candidates hiding in pass 1 =================
const KIT_TAGS = /politeness|greeting|basics|communication|number/i;
const kitCandidates = items.filter(it =>
  it.pass === 1 && it.tier === 1 && it.tokens <= 4 &&
  (KIT_TAGS.test(it.topic) || KIT_TAGS.test(it.category) || /^(s[ií]|no|hola|gracias|por favor|perd[oó]n|ayuda|adi[oó]s|vale)/i.test(it.es))
);

// ================= MIGRATION QUERY 2: head-frame census =================
const frameCensus = {};
HEAD.forEach(h => frameCensus[h.name] = []);
items.forEach(it => { const h = headOf(it.es); if (h) frameCensus[h].push(it); });

// tail frames: ≥3 instances sharing a fingerprint that is NOT a head frame
const tailBuckets = {};
items.forEach(it => {
  const f = frameFingerprint(it.es);
  if (f && !HEAD.some(h => h.name === f)) (tailBuckets[f] = tailBuckets[f] || []).push(it);
});
const tailFrames = Object.entries(tailBuckets).filter(([, arr]) => arr.length >= 3)
  .sort((a, b) => b[1].length - a[1].length);

// ================= MIGRATION QUERY 3: canonical-form review (§11.1 r10) =================
// idiomatic openers where a taught head-frame form would be more generative
const canonReview = items.filter(it => /^(para m[ií]|me pone|ponme|deme|me da|quisiera)\b/i.test(it.es));

// ================= AUDIT CHECK 11: frame-prerequisite violations =================
// a phrase instantiating a head frame that appears BEFORE that frame's earliest instance (its would-be machine)
const firstFrameAppearance = {};
HEAD.forEach(h => {
  const inst = frameCensus[h.name];
  firstFrameAppearance[h.name] = inst.length ? Math.min(...inst.map(x => x.pass ?? 99)) : null;
});
const framePrereqViolations = [];   // head frames whose earliest instance sits in pass >1 with no pass-0/1 machine
HEAD.forEach(h => {
  const inst = frameCensus[h.name];
  if (inst.length >= 2 && (firstFrameAppearance[h.name] ?? 99) > 1)
    framePrereqViolations.push({ frame: h.name, count: inst.length, earliestPass: firstFrameAppearance[h.name] });
});

// ================= AUDIT CHECK 12: Stage-0 coverage (frames w/ >=3 items, no machine) =================
const stage0Coverage = HEAD.map(h => ({ frame: h.name, instances: frameCensus[h.name].length }))
  .filter(x => x.instances >= 3);

// ================= COVERAGE GAPS: chunks + primers =================
const chunkGaps = items.filter(it => it.tier >= 2 && it.tokens > 6 && it.chunks === 0);
const lessonsSeen = new Set(), primerGaps = [];
stages.forEach(st => (st.lessons || []).forEach(l => {
  if (lessonsSeen.has(l.id)) return; lessonsSeen.add(l.id);
  if (!l.primer && !l.chain) primerGaps.push({ pass: st.pass, lesson: l.title, lessonId: l.id });
}));

// ================= REPORT =================
const line = "─".repeat(72);
const H = s => `\n${line}\n${s}\n${line}`;
const byPass = arr => { const m = {}; arr.forEach(x => (m[x.pass] = (m[x.pass] || 0) + 1)); return m; };
const list = (arr, f) => arr.map(f).join("\n");

console.log(H(`STAGE-0 MIGRATION INVENTORY — pack: ${PACK.key.toUpperCase()}  (${PACK.file})`));
console.log(`items: ${items.length}   lessons: ${lessonsSeen.size}   stages(passes): ${stages.map(s => s.pass).join(", ")}`);
console.log(`items by pass: ${JSON.stringify(byPass(items))}`);
console.log(`items by tier: ${JSON.stringify(items.reduce((m, x) => (m[x.tier] = (m[x.tier] || 0) + 1, m), {}))}`);
console.log(`items by category: ${JSON.stringify(items.reduce((m, x) => (m[x.category] = (m[x.category] || 0) + 1, m), {}))}`);

console.log(H(`Q1 · KIT CANDIDATES hiding in pass 1  (→ migrate to Chapter 0)   [${kitCandidates.length}]`));
console.log(list(kitCandidates, it => `  · ${it.es.padEnd(34)} tier${it.tier}  ${it.category}  «${it.lesson}»`));

console.log(H(`Q2 · HEAD-FRAME CENSUS  (first 3-4 → machine fillers; rest → fast-path staging)`));
HEAD.forEach(h => {
  const inst = frameCensus[h.name];
  console.log(`\n  ▸ ${h.name}   [${inst.length} instance${inst.length === 1 ? "" : "s"}, earliest pass ${firstFrameAppearance[h.name] ?? "—"}]`);
  console.log(list(inst, it => `      p${it.pass}  ${it.es.padEnd(40)} «${it.lesson}»`) || "      (none found)");
});
console.log(`\n  TAIL FRAMES (≥3 instances, NOT a head frame → machine-or-pattern-moment decision for Tom):`);
console.log(tailFrames.length ? list(tailFrames, ([f, arr]) =>
  `      "${f}"  [${arr.length}]  e.g. ${arr.slice(0, 3).map(x => x.es).join(" / ")}`) : "      (none)");

console.log(H(`Q3 · CANONICAL-FORM REVIEW  (§11.1 r10 — idiomatic where a frame form exists; taste call)   [${canonReview.length}]`));
console.log(list(canonReview, it => `  · ${it.es.padEnd(34)} p${it.pass}  «${it.lesson}»`) || "  (none flagged by heuristic)");

console.log(H(`AUDIT CHECK 11 · frame-prerequisite violations   [${framePrereqViolations.length}]`));
console.log(list(framePrereqViolations, v => `  · ${v.frame}  ${v.count} instances, earliest in pass ${v.earliestPass} (no pass-0/1 machine)`) || "  (none — heads either absent or already early)");

console.log(H(`AUDIT CHECK 12 · Stage-0 coverage (head frames with ≥3 items, candidates for a machine)   [${stage0Coverage.length}]`));
console.log(list(stage0Coverage, x => `  · ${x.frame.padEnd(24)} ${x.instances} instances`) || "  (none)");

console.log(H(`COVERAGE GAPS`));
console.log(`chunk gaps (tier≥2, >6 tokens, no chunks): ${chunkGaps.length}`);
console.log(list(chunkGaps.slice(0, 20), it => `  · ${it.es}`) + (chunkGaps.length > 20 ? `\n  … +${chunkGaps.length - 20} more` : ""));
console.log(`\nprimer gaps (non-chain lessons with no primer): ${primerGaps.length}`);
console.log(list(primerGaps, g => `  · p${g.pass}  «${g.lesson}»`) || "  (none)");

console.log(H(`END — ${PACK.key}`));
