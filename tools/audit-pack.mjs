#!/usr/bin/env node
// =============================================================================
// tools/audit-pack.mjs — Tripfluent content-pack audit (learning-engine spec §11.2)
//
// A local dev tool. NOT shipped, NOT a build step, NO dependencies.
// Reads a pack file (content_mx.js / curriculum.js) and prints the authoring
// to-do list: keyword coverage, n+1 violations, missing metadata, tier smells,
// tag health, and hard errors (keyword-not-in-phrase, duplicate ids).
//
//   node tools/audit-pack.mjs                 # audits content_mx.js
//   node tools/audit-pack.mjs curriculum.js   # audits another pack
//
// Exit code 1 if there are HARD errors (keyword-not-in-phrase / duplicate ids),
// so it can gate a pre-commit hook later. Otherwise 0.
// =============================================================================
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const file = process.argv[2] || "content_mx.js";

// ---- load the pack (packs use CommonJS module.exports) ----------------------
let mod;
try { mod = require(resolve(root, file)); }
catch (e) { console.error(`Could not load ${file}: ${e.message}`); process.exit(2); }
const pack = mod && mod.stages ? mod
  : (mod && mod.CURRICULUM) ? mod.CURRICULUM
  : (mod && Object.values(mod).find(v => v && v.stages)) || null;
if (!pack || !pack.stages) { console.error(`No { stages } found in ${file}`); process.exit(2); }
const packKey = pack.key || file.replace(/\W+/g, "");

// ---- helpers (mirror the engine's normalize/slug) ---------------------------
const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim();
const slug = s => (norm(s).replace(/[^a-z0-9 ]/g, "").trim().replace(/\s+/g, "-").slice(0, 40) || "item");
const tokens = es => es.trim().split(/\s+/);
const tokenSet = es => tokens(es).map(t => norm(t)).filter(Boolean);

// ---- flatten to items in unlock (authored) order ----------------------------
const lessons = [];
pack.stages.forEach(st => (st.lessons || []).forEach(l => lessons.push(l)));
const items = [];
lessons.forEach(l => (l.items || []).forEach(it => items.push({ it, lesson: l })));
const tierOf = it => it.tier || 2;

let hardErrors = 0, warnings = 0;
const H = t => console.log(`\n\x1b[1m${t}\x1b[0m`);
const warn = m => { warnings++; console.log("  • " + m); };
const err = m => { hardErrors++; console.log("  \x1b[31m✗ " + m + "\x1b[0m"); };
const ok = m => console.log("  \x1b[32m✓\x1b[0m " + m);

console.log(`\n\x1b[1mAudit — ${file}\x1b[0m  (${lessons.length} lessons, ${items.length} items, key="${packKey}")`);

// ---- 1. keyword coverage (§11.1.1): every keyword in ≥3 phrases -------------
H("1. Keyword coverage (each keyword should appear in ≥3 phrases)");
const kwHits = new Map();       // keyword -> [lesson ids]
items.forEach(({ it, lesson }) => (it.keywords || []).forEach(k => {
  if (!kwHits.has(k)) kwHits.set(k, []);
  kwHits.get(k).push(lesson.id);
}));
if (!kwHits.size) console.log("  (no keywords authored yet — coverage analysis is blind; see check 3)");
else {
  const thin = [...kwHits].filter(([, ls]) => ls.length < 3).sort((a, b) => a[1].length - b[1].length);
  if (!thin.length) ok("every keyword appears in ≥3 phrases");
  else thin.forEach(([k, ls]) => warn(`"${k}" appears in ${ls.length} phrase${ls.length === 1 ? "" : "s"} (${[...new Set(ls)].join(", ")}) — needs ${3 - ls.length} more`));
}

// ---- 2. n+1 violations (§11.1.2): ≤2 new keywords per phrase ----------------
H("2. n+1 rule (a phrase should introduce ≤2 never-seen keywords)");
if (!kwHits.size) console.log("  (needs keywords)");
else {
  const seen = new Set(); let bad = 0;
  items.forEach(({ it, lesson }) => {
    const fresh = (it.keywords || []).filter(k => !seen.has(k));
    (it.keywords || []).forEach(k => seen.add(k));
    if (fresh.length >= 3) { bad++; warn(`${lesson.id}: "${it.es}" introduces ${fresh.length} new keywords [${fresh.join(", ")}]`); }
  });
  if (!bad) ok("no phrase introduces ≥3 new keywords");
}

// ---- 3. missing metadata: keywords, tier, context; + duplicate ids ---------
H("3. Missing metadata");
const noKw = items.filter(({ it }) => !(it.keywords && it.keywords.length)).length;
const noTier = items.filter(({ it }) => it.tier == null).length;
console.log(`  ${noKw}/${items.length} items missing \x1b[1mkeywords\x1b[0m; ${noTier}/${items.length} missing \x1b[1mtier\x1b[0m (optional, but the analysis above/below is blind without them)`);
const idMap = new Map();
items.forEach(({ it, lesson }) => {
  const id = it.id || `${packKey}:${lesson.id}:${slug(it.es)}`;
  if (idMap.has(id)) err(`duplicate id "${id}" — "${idMap.get(id)}" and "${it.es}" (${lesson.id})`);
  else idMap.set(id, it.es);
});
if (![...idMap].some(() => false)) ok(`${idMap.size} unique ids`);

// ---- 4. keyword-not-in-phrase (HARD ERROR) ---------------------------------
H("4. Keyword-not-in-phrase (a keyword must appear verbatim in its es)");
let kwErr = 0;
items.forEach(({ it, lesson }) => (it.keywords || []).forEach(k => {
  if (!norm(it.es).includes(norm(k))) { kwErr++; err(`${lesson.id}: keyword "${k}" not found in "${it.es}"`); }
}));
if (!kwErr) ok(kwHits.size ? "every keyword is present in its phrase" : "no keywords to check");

// ---- 5. tier smells (§1b) --------------------------------------------------
H("5. Tier smells");
// 5a: tier-1 phrases over 6 tokens
items.filter(({ it }) => tierOf(it) === 1 && tokens(it.es).length > 6)
  .forEach(({ it, lesson }) => warn(`tier-1 too long (${tokens(it.es).length} tokens): "${it.es}" (${lesson.id})`));
// 5b: short items (<3 tokens) missing contextEs
const shortNoCtx = items.filter(({ it }) => tokens(it.es).length < 3 && !it.contextEs);
shortNoCtx.slice(0, 40).forEach(({ it, lesson }) => warn(`short item needs contextEs: "${it.es}" — "${it.en}" (${lesson.id})`));
if (shortNoCtx.length > 40) console.log(`  … and ${shortNoCtx.length - 40} more short items missing contextEs`);
// 5c: a scenario's first lesson (by unlock order) should be tier 1
const lessonTier = l => { const ts = (l.items || []).map(tierOf); return ts.length ? ts.sort((a, b) => a - b)[Math.floor(ts.length / 2)] : 2; };
const firstByTopic = new Map();
lessons.forEach(l => { const t = l.topic || l.id; if (!firstByTopic.has(t)) firstByTopic.set(t, l); });
if (noTier < items.length) {   // only meaningful once tiers exist
  [...firstByTopic].filter(([, l]) => lessonTier(l) !== 1)
    .forEach(([t, l]) => warn(`scenario "${t}" opens with a tier-${lessonTier(l)} lesson (${l.id}) — should open tier-1`));
}
// 5d: tier-2/3 phrases built from <60% previously-seen tokens (weak spiral)
{
  const seenTok = new Set(); let weak = 0;
  items.forEach(({ it, lesson }) => {
    const toks = tokenSet(it.es);
    if (tierOf(it) >= 2 && toks.length) {
      const known = toks.filter(t => seenTok.has(t)).length / toks.length;
      if (known < 0.6) { weak++; if (weak <= 20) warn(`weak spiral (${Math.round(known * 100)}% known tokens): tier-${tierOf(it)} "${it.es}" (${lesson.id})`); }
    }
    toks.forEach(t => seenTok.add(t));
  });
  if (weak > 20) console.log(`  … and ${weak - 20} more weak-spiral phrases`);
  if (!items.some(({ it }) => tierOf(it) >= 2)) console.log("  (no tier-2/3 items yet — spiral check idle)");
}

// ---- 6. tag health (§4b.4 distractor ladder needs specific tags) ------------
H("6. Tag health (tags power same-category distractors)");
const tagCount = new Map();
items.forEach(({ it }) => (it.tags || []).forEach(t => tagCount.set(t, (tagCount.get(t) || 0) + 1)));
const tagged = items.filter(({ it }) => it.tags && it.tags.length).length;
console.log(`  ${tagged}/${items.length} items have tags; ${tagCount.size} distinct tags`);
if (tagCount.size) {
  [...tagCount].sort((a, b) => b[1] - a[1]).forEach(([t, n]) => {
    const pct = Math.round(n / items.length * 100);
    if (pct > 40) warn(`tag "${t}" covers ${pct}% of the pack — too broad for distractor selection`);
    else if (n < 6) console.log(`  · tag "${t}": ${n} item${n === 1 ? "" : "s"} (small — may repeat distractors)`);
  });
}

// ---- 7. narrative smells (§9b / §11.2.7) -----------------------------------
H("7. Narrative smells (§9b — real specifics + cast, not generic placeholders)");
const PLACEHOLDERS = ["the waiter", "the waitress", "the restaurant", "the market", "the driver", "the hotel", "the shop", "the store", "a drink", "the food", "the bartender", "the clerk", "the host"];
const CAST = ["andres", "lupe", "marisol", "beto", "elena", "jordi", "montse", "toni", "nuria"];   // MX + ES cast tokens (accent-stripped); tune per pack
let narrWarn0 = warnings;
const scanText = (txt, where) => { if (!txt) return; const low = txt.toLowerCase(); PLACEHOLDERS.forEach(p => { if (low.includes(p)) warn(`generic "${p}" in ${where}: "${txt.slice(0, 60)}…"`); }); };
items.forEach(({ it, lesson }) => { scanText(it.en, `${lesson.id} en`); scanText(it.contextEn, `${lesson.id} contextEn`); });
lessons.forEach(l => { scanText(l.reward, `${l.id} reward`); scanText(l.cultureNote, `${l.id} cultureNote`); if (l.primer) { scanText(l.primer.scene, `${l.id} primer.scene`); scanText(l.primer.mission, `${l.id} primer.mission`); } });
let castErr = 0;
items.forEach(({ it, lesson }) => { const nes = norm(it.es); CAST.forEach(c => { if (new RegExp(`\\b${c}\\b`).test(nes)) { err(`cast name "${c}" in graded es "${it.es}" (${lesson.id}) — §9b.6 rule 2`); castErr++; } }); });
if (warnings === narrWarn0 && !castErr) ok("no generic placeholders; no cast names in graded answers");

// ---- 10. chunk checks (§4b.5): verbatim + in-order + concatenation ----------
H("10. Chunk pipeline (§4b.5 — tier-2/3 long phrases)");
let chunkErr = 0, chunked = 0;
const granularity = [];   // §11.1 rule 9: >4 chunks or single-word chunks — too-fine / word-layer granularity
items.forEach(({ it, lesson }) => {
  if (!Array.isArray(it.chunks) || !it.chunks.length) return;
  chunked++;
  // each chunk's es must appear verbatim, in order, left-to-right in the phrase
  let cursor = 0, orderOk = true;
  it.chunks.forEach(c => { const frag = (c && c[0]) || ""; const at = it.es.indexOf(frag, cursor); if (at < 0) orderOk = false; else cursor = at + frag.length; });
  if (!orderOk) { err(`${lesson.id}: chunks not found verbatim/in-order in "${it.es}"`); chunkErr++; }
  // concatenation must equal the phrase (normalized — punctuation/spacing don't count)
  const joined = norm(it.chunks.map(c => (c && c[0]) || "").join(" "));
  if (joined !== norm(it.es)) { err(`${lesson.id}: chunks don't concatenate to "${it.es}" (got "${joined}")`); chunkErr++; }
  // §11.1 rule 9 granularity smells (informational): coarse chunks are the point — word-level is a different layer
  const single = it.chunks.filter(c => tokens((c && c[0]) || "").length === 1).map(c => c[0]);
  if (it.chunks.length > 4) granularity.push(`${lesson.id}: "${it.es}" has ${it.chunks.length} chunks (>4 — likely too fine)`);
  if (single.length) granularity.push(`${lesson.id}: single-word chunk(s) [${single.join(", ")}] in "${it.es}" (word-layer granularity — see rule 9)`);
});
// informational: long tier-2/3 items with no chunks (pipeline falls back to word-level; card is the point)
const longNoChunks = items.filter(({ it }) => tierOf(it) >= 2 && tokens(it.es).length > 6 && !(it.chunks && it.chunks.length));
if (longNoChunks.length) console.log(`  · ${longNoChunks.length} tier-2/3 phrase(s) over 6 tokens have no \x1b[1mchunks\x1b[0m yet (segmented card unavailable)`);
if (granularity.length) { console.log(`  · ${granularity.length} chunk granularity smell(s) (§11.1 rule 9, informational):`); granularity.forEach(g => console.log(`      ${g}`)); }
if (!chunkErr) ok(chunked ? `${chunked} chunked item(s), all verbatim + concatenating` : "no chunked items yet");

// ---- summary ---------------------------------------------------------------
console.log(`\n\x1b[1mSummary:\x1b[0m ${hardErrors} hard error${hardErrors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"}.`);
console.log(hardErrors ? "\x1b[31mFix hard errors before shipping.\x1b[0m\n" : "\x1b[32mNo hard errors.\x1b[0m\n");
process.exit(hardErrors ? 1 : 0);
