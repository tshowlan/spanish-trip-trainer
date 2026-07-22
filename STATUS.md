# STATUS

Running handoff log. Most recent entry at top. Terse: dates, what changed, deviations, what's next.

## 2026-07-21 — LESSON PURITY SHIPPED (v174): lessons own their content; Practice owns review
- Chat's feasibility questions answered with data: cross-lesson share was 20% of fresh-lesson slots, 40% of replays, and a cross-lesson warm-up rep OPENED every fresh lesson before the first card (Tom's sighting, traced to the weave's warm-up lead). No SRS coupling (recordAnswer is location-agnostic) — the split was cheap.
- Built: composeSession carries only the lesson's own items (presentations, T₁, re-tests, own-item pairs on replays, the close — its frame-swap filler stays the one sanctioned cross-lesson touch, ritual not review). composeReview (Practice) absorbs warm-up misses (leads), due backlog, cram criticals, boards, confusions. Verified: 0 cross slots in lessons; fresh lessons open primer → present; Practice leads with the recent miss. Spec §6.1 rewritten; decision logged with the data.
- OWED BY CHAT (design): home's dynamic Practice prominence (badge/ordering/hero-swap threshold [tune]) — the dials carry the incentive meanwhile. Commit #4 (13 pass-2 scenes) HELD as draft awaiting Tom's line-by-line.

## 2026-07-21 — Primer wave commit #3 SHIPPED (v173): guessItems fixed, thin lessons padded
- Four silent-fallback guessItems reassigned to in-list hooks (all verified resolving: ¿Puede repetir por favor? / el cambio / ¿Todo bien? / Me han robado). sp-cash 1→4 phrases (cash set), s4-hear 1→4 (locals set = replyTo seed corpus). DEDUP DEVIATION: "Aquí tiene" already lives in K3 with the change context, and item identity IS the phrase, so neither new set could carry it without duplicating the id; K3's copy absorbed the both-directions note instead (chat's pedagogy preserved, sets land at 3 each). Pack audit 0 hard errors; no duplicate ids.
- Pass-2 manifest exported to Tom's folder for the from-scratch writing block.

## 2026-07-21 — Primer wave commit #2 SHIPPED (v172): coherence pass + the Jordi discovery
- Four scenes revised verbatim (pa amb tomàquet in Marina's hands; Catalonia signs beat + antecedent fix; the Andrés plant; Sra. Rosa carries 112). Three woven cultureNotes retired (sp-table, s2-bathroom, sp-help); farmacia-de-guardia overflowed to the content-spec's Landed bin. s3-directions completed (mission + guessItem "la plaza", resolves in-lesson). Pack audit 0 hard errors.
- DISCOVERY during the rename: the pack already HAD the taxi through-line under the name Jordi — cast-list comment ("picks you up at El Prat") AND the pass-3 finale payoff ("Jordi dropped you near Plaça Reial"). Chat's planned arc existed; keep-the-world-take-the-name applied at all three sites; decision recorded. Andrés's finale drop-off is already written.
- MECHANICS ANSWER (blocking four guessItems): guessItems MUST resolve in-lesson (matched by es, id, or keyword) — unresolved ones fall back SILENTLY to the anchor item, so s1-rescue (¿Habla inglés?), sp-cash (cien), s4-hear (Que aproveche), sp-help (Es una emergencia) have been guessing on the wrong phrase since the Stage-0 migration. Chat supplies in-list replacements.
- Still waiting on Tom: thin-lesson padding bless (sp-cash cash set; s4-hear locals-lines / replyTo seed corpus).

## 2026-07-21 — Primer wave commit #1 SHIPPED (v171): 11 primers, cast canon, content spec
- Ten Stage-0 primers (7 machine-shaped, 3 kit) + s3-directions scenario scene landed in curriculum.js; machine/kit primers are scene-only (no mission/guessItem, so no pre-lesson interstitial — beat-hint + future-surface data per the handoff). Montse renamed Marina everywhere (9 sites; world kept, name changed); Núria/Sra. Rosa unchanged. docs/tripfluent-content-spec.md created (primer format rules + cast canon); decision recorded. Pack audit: 0 hard errors. frameGloss left in packs as dormant data (no renderer consumes it).
- FLAGS for chat: (1) s3-directions has scene only — needs mission + guessItem to fire the §4c.4 pre-lesson flow like its siblings; send the mission line. (2) The reply artifact's "Marina · The Harbor Café" is now canon-colliding (Marina runs a tasca) — relabel at next re-issue, noted in content spec.

## 2026-07-21 — Dial specs built (chat): momentum second-week ceiling + retention shrinkage — v170
- MOMENTUM third-term design: 45·(days7/5) + 25·(sess7/7) + 30·(daysPrior/5). DEVIATION FLAGGED: chat's pasted third term (days-in-14/10) computes 91 for one maxed week, contradicting its own stated properties; built the property-true variant (third term = the PRIOR week, days 8-14, target 5) — one perfect week = exactly 70, 100 = sustained both weeks. One-line revert if 91 was intended. Verified: 70 / 100 / 38 across seeded cases.
- RETENTION shrinkage per spec: n_eff = drilled + 0.3·baseline, display = (n_eff·raw + 20·50)/(n_eff+20), K [tune]. Note back to chat: the imagined day-one fake-100 never occurred — itemStrength reads fresh items ~37 (fragile), so shrinkage pulls small accounts UP toward 50 (verified: 10 fresh items = 46, was 38). Honesty about uncertainty cuts both ways; still correct.
- Canvas re-issue committed: variants blanks now dash-over-underline per Tom's direction (surgical: dashes + caption).

## 2026-07-21 — Native feel: horizontal axis locked; prompt font unified — v169
- The app pans vertically only (Tom): html+body overflow-x clip, overscroll-behavior-x none, touch-action pan-y pinch-zoom — sideways drags used to park the page off-center with no rubber-band (real scroll, not overscroll). Vertical bounce untouched.
- The big exercise prompt (.prompt 24px) wears the display font for ALL prompts now, en included, weight 800→700 — build-the-sentence was the last Inter holdout among display-scale text. Small dim en lines stay Inter (text face) deliberately.

## 2026-07-21 — Tom's cleanup seven — v168
- (1) Option cards conform to the variants artifact: .choice 15/500 app-wide (was 17/600). (2) The reply's scene line is narrative sentence case (14px dim, 16px gap), not the uppercase type label. (3) Ligatures off body-wide: the fi ligature was eating the i's dot ("wifi") — learners need to see letters. (4) Build tiles conform to the artifact tile spec (17/500, 1px border, radius 10, 8x12 padding; tray tiles sit quieter: bg-elevated + dim). (5) Fold fix: the resolution frame scrolls its Continue into view (requeued chip + choices could push it past short viewports; correction sheet itself verified viewport-anchored and fine). (6) Nav-light spill: #tabbar was missing the artifact's overflow:hidden clip; also bloom anchor now measured a frame after the bar shows (stale rects anchored it off-column on first paint). Harness clean() now rebuilds tabbar chrome (it was wiping navlight+tabs, lying to review).
- (7) The home lighting outlier Tom remembered = the standing 2026-07-17 flag in nav.js: home keeps its own ground glow + photo; adopting the shared bloom anchor is penciled for home's next revision — CHAT'S BOARD, design decision, not a bug.

## 2026-07-21 — Loose ends closed (chat): reward/cultureNote rehomed; canvas annotated
- Reward lines RETIRED as a surface (told-rewards redundant now reward is mechanical; "you can now X" fails the decay test). Content INVERTS into primer promises during the primer wave; cultureNote tips become CAST DIALOGUE in primers, overflow pencils to the Landed/in-trip spec. Pack fields stay as writing-session inputs; zero runtime consumers remain (verified). Decision recorded.
- session-end.html re-issue committed: max-width:300px annotated demo-frame-relative (one comment, verified surgical).

## 2026-07-21 — T₁ ear-first (chat-blessed) + dead code removed — v167
- The immediate post-presentation retrieval is now listen_choice (audio, no es text, English options): tested channel ≠ taught channel at T₁; distractors = co-introduced items by design. Sound-off/no-speech fallback → read-and-pick. T₁ slots carry a t1 flag so the §8.5 rhythm steer cannot retype them. Spec §6.1b + decision recorded.
- DELETED: renderIntro (old photo intro flow, ~51 lines) and renderMatch/onMatchTap (old text-match board, ~39 lines) — both unreachable; pairs is the review board, the weave is the intro. introPhoto() lives on for the primer.

## 2026-07-21 — Session-end ceremony SHIPPED (v166) — harness review passed, branch merged
- Tom's review pass beyond the r17-r19 riders: dial labels/deltas display font (ring-card button inheritance, latent on home since the dials shipped); no deltas on still dials (empty-ish + unmoved sides); dissolve made authored (900ms atmosphere breath + 6px materialize rise — was a uniform 550ms fade reading as slow loading); Continue full container width + cer-layer aligned to the 480px app column (artifact's 300px cap was frame-relative). Canvas note: artifact .cont max-width:300px should be annotated frame-relative on next re-issue.

## 2026-07-21 — Session-end ceremony approved (design/session-end.html, Option D) — built on branch `session-end`, now merged
- THE SURFACE: fires on return home after any completed learning flow. Sequence: ceremony (top-center tint), Readiness ISOLATED ticking its delta (58→61, 900ms, 600ms lead-in) → Momentum and Retention POP IN flanking it in HOME'S EXACT GEOMETRY (320ms scale-fades, staggered 1.7s/1.9s) and tick (sequential-composes), green side-deltas (+8/+1) after each settles → facts ledger + Continue.
- CONTINUE = the slow dissolve (Option D): the world EMPTIES (ceremony copy fades 600ms, tint drains 1200ms), the dials hold the stage ALONE for a beat, then home REFILLS around them piece by piece (photo 1.0s → lesson tile → practice → whisper lines → nav at ~150ms steps; bloom rises with it), "+3 today" whisper last (~2.15s). The dials never move, never re-render: same objects, both worlds.
- FACTS LEDGER: "5 new · 12 stronger · 3 restored · 1 soloed" — four past-tense events, grammatically uniform, left-aligned rows centered as a block, numbers column-aligned. "new" (gold plus glyph) and "soloed" (star) render only when >0. "restored" consumes the §8.4 session aggregate; glyph = rotate-CW (clockwise: restore = the ring REFILLING; ccw reads as undo). No duration anywhere (grind-optimization bait).
- TERMINOLOGY (ratified): SESSION = any completed learning flow (a lesson + its woven reviews, or pure practice). LESSON = the content unit only. This surface and its engine event are session-scoped: rename "lesson complete" → session end. Practice-only sessions get the same ceremony.
- DIAL LAW (ratified): the ceremony CONSUMES THE ANIMATION BUDGET — post-session home arrival renders dials settled and motionless (overwrites the prior scale-up-on-arrival direction for the post-session case; cold opens keep the load-in fill). DELTA SCOPING: side-dial deltas show TODAY'S movement only, nonzero-only, daily reset — the current home's +88/+35 cumulative deltas are mis-scoped; fix alongside. Home = now + latest movement (the two-week whisper line is home's only longer window); day/week/month depth belongs to the Progress tab [penciled brief].
- BUILT same day on branch `session-end` (harness review pending). Deltas/deviations for chat: (1) the old completion screens carried `lesson.reward` narrative lines + `cultureNote` "Local tip" + a "Review your N mistakes" button — the ceremony has no slot for any of them (mistakes still flow through next-session warm-up + home's review row; reward/culture copy currently UNSHIPPED — needs a chat decision on whether they get a home elsewhere). (2) Ledger renders ALL four lines nonzero-only (spec conditions only new/soloed; a "0 restored" row felt like noise — flag if wrong). (3) Ceremony side-deltas reuse home's own .dial-delta elements at today-scope (the fixed-point principle taken literally: same element, same value, both worlds; artifact's 11px/600 sdelta yields to the built dial row per its own caption). (4) Chains get the ceremony too (their correct turns count as "stronger").
- Next: primer wave (writing session, chat+Tom), canonical ear pass behind it.

## 2026-07-20 — Exercise batch SHIPPED (v165) — harness review passed, branch merged
- Tom's review pass added five more catches beyond the three canvas deltas below, all folded in pre-merge: cloze/sound-choice blanks read as dashes over ONE underline (underscores drew a doubled line); exercise inputs, choice cards, and word tiles all render in the display font (buttons/inputs don't inherit font — .choice and .word had fallen to the UA form font since they were built, a latent app-wide bug the batch review surfaced); Spanish phrase surfaces now wear the display font everywhere (MC phrase = .es-phrase 24/700; sentence-with-blank surfaces incl. legacy fill = .es-stage-line, the variants artifact's 21/500/1.6 with 600 slot; English prompts stay Inter deliberately).
- INVENTORY RESULT: phrase-MC had two live instantiations — mc_en2es (renderMC's en→es direction) and "respond" (situation → pick the learned es phrase). Both retired outright; renderMC simplified to meaning-pick only. RETAINED as compliant: mc_es2en, listen_choice, reply_listen (all English options), match, fill_blank (single-word es options = slot-fill).
- BUILT all six §7.1 types: pairs (pressed-in settles, FLIP reunion 420ms/200ms stagger, collective "N stronger" with honest count — a missed pair records at LOW weight: exposure only, neither advances nor resets [tune]); the close (close + close_swap; swap composes live from frame × cross-machine taught filler, prompt from beat-hint name "Your bring-me machine again.", novel compositions preferred with the never-taught note; credit records on the filler item, modes close/close_swap set production+cold; Yours-now extended to both); sound choice (blank + two audio cards; distractor from logged confusions first (learn[id].conf, now logged from MC + fill wrong picks) then edit-distance near-forms with substance guards — answer ≥4 chars, length within ±2, d ≤2; infeasible → falls back to meaning-pick); audio cloze (blank-rotation gap, typed word, judgeTyped forgiveness, blank fills canonical); ear build (audio only, tile assembly reusing build fusion, distractors 1–2 scaffold → 3–4 cold [tune] from conf → same-frame fillers → same-tag keywords); the reply (dormant on replyTo, feasibility-gated in the ladder; bubble + standard 44px control + English options).
- Ladder remapped (srs.js): sound_choice rung 1; audio_cloze/ear_build/reply rung 2; ear_build also rung 3 with more tiles. MODE_FAMILY updated. Variety rule LIVE: learn[id].{lm,lmt,lms} + state.sessionSeq (ticks per composed session); consecutive sessions never repeat a type at the same rung when an alternative exists.
- Composer: closeReps() appended to EVERY lesson session (first pass + replay; the §4.1 cap exception); extractPairsBoard() folds 4 short seen items from the review pool into one board (lesson replays + pure reviews). §5.2b live: items with logged confusions serve sound_choice at 50%. Replay rule verified compliant by construction (presentation keys on exposures===0; meet-the-piece not yet built).
- No-repeat mechanics in resolveCorrect: q.esOnStage suppresses the duplicate es-reveal (close, sound choice, audio cloze — their sentence completes in place; the close's typed input MATURES to the canonical es at resolve, so always-reveals + silent forgiveness both hold); q.noEn drops the en-line (the reply); q.resNote overrides the kicker note (swap's "You were never taught this sentence."). One-item rule: strength ring hidden when q.item is absent (pairs, match).
- §5 diff run on all three artifacts (DESIGN_PAIRS.pairsExercise/theClose/exerciseVariants + preps). Fixes from the diff: dark-theme overrides doubled to the house convention (media + stamped forms); pairs grown at the artifact's 200ms delay (not the frame's 600ms, which would stack on the FLIP); .res-en 13.5→13px per the batch's shared-footnote rule — NOTE FOR CHAT: resolution-frame.html canvas carries 13.5, next re-issue should adopt 13, do not revert. Stand-in triage: artifact inputboxes = app .text-input (global wins); artifact gold speaker buttons = the built AudioControl (dark circle, gold glyph — not gold-on-gold, law holds); artifact 21px blank-sentence = app's shared 24px .prompt. Diff harness itself fixed: force-finish animations in the offscreen iframe (transitioned props froze at FROM values and false-diffed).
- Deviation for chat: sound choice's grown drops the artifact's "(Not el cuento: the story.)" parenthetical — we have no word-level glosses, and a wrong gloss is worse than none; the discrimination still teaches through the two audio cards. Revisit if word glosses ever exist.
- Harness: 7 new stories (pairs, close core, close swap w/ live-composed payload, sound choice on a cuesta/cuenta item, audio cloze, ear build, reply preview). launch.json fixed to tools/serve.py (was the banned caching server).
- ON BRANCH per the held-work rule; Tom reviews in the harness, then merge + SW bump + deploy.
- TOM'S HARNESS CATCHES (mid-review, all built + committed; CANVAS DELTAS for chat's next re-issues): (1) fused build/ear-build sentence now matures to the es-reveal scale, 22px display 600, riding the 450ms choreography — artifacts still draw tile-size fused lines; (2) the reply's es arrives as the 13px footnote line, not the big green reveal (the variants caption already said so; build miss); (3) the reply's bubble GLOSS is the comprehension answer, so it hides until the learner answers, then materializes while the green sweep draws under the understood es line — artifact shows the gloss always visible.
- RIDER APPLIED (chat, same day): the appendix glyph rule was written from artifact stand-ins, backwards — corrected to "high-contrast, never tone-on-tone; the built AudioControl is canonical, do not restyle." Design-system §3.2 + §3.7 amended; new §5 working rule 7: precedence applies to RULE-MAKING (check review-derived rules against the built canonical component before they enter the constitution). Canvas-fixed re-issues committed: resolution-frame r8 (en-line 13px, matches build; only delta vs r7) + exercise-variants (gloss-gated parenthetical caption note; deliberate artifact/app difference, not drift).

## 2026-07-20 — Exercise system expansion approved (3 artifacts, 6 new types, phrase-MC retired) — building ON BRANCH `exercise-batch`
- RETIRED: full-phrase multiple choice — options are NEVER complete phrases in the target language (discrimination-gaming, near-zero generation; the feels-productive archetype). Inventory needed: which live exercises instantiate it and what each becomes (Code working session if any are load-bearing).
- NEW TYPES: Pairs (4 audio × 4 en review workhorse; pressed-in settles; staggered reunion completion; "4 stronger" collective tick) · The close (end-of-lesson ritual: 2 cold typed reps — core phrase + frame-swap variation composed from beat-hint name + filler, zero per-lesson authoring; Yours-now's natural home; scaffold-free) · Sound choice (blank + two audio options; §5 confusion-pair wiring = the mistake loop's targeted remediation) · Audio cloze (hear phrase, type missing word; blank-rotation picks the gap) · Ear build (audio only, tile assembly, fusion resolve, meaning arrives at resolution; distractor scaling 1–2→3–4 on the scaffolded→cold axis [tune], selection from confusion near-forms / same-frame fillers / structural twins — never random) · The reply (cast-voice bubble + English response options; es arrives at resolution; higher rungs swap options for typed input).
- Replay rule: presentation cards + meet-the-piece are exposure-0 furniture, fire once per item EVER; lesson replays enter items at current rung (expertise reversal).
- Composer variety rule: an item's consecutive sessions never repeat the same exercise type at the same rung.
- Speech pencils recorded: "say this phrase" production; card-pile drill (wrong → back of pile). Imageless-exercise decision INHERITED by all new types (2026-07-19 exception stands; concrete-noun pencil unchanged).
- Code's "Accents and capitals don't matter" input helper: RATIFIED (expectation-setting before the answer is consistent with silent forgiveness, which governs after).
- All six types are content-agnostic templates; only the reply needs authoring (`replyTo` link, dormant until the Phase-3 list; Chapter 0 K3 "What locals say" is the seed corpus). The close composes from the lesson's anchor item + frame × cross-machine filler (Mix-it exclusions apply), swap prompt from beat-hint name + filler.

## 2026-07-19 — Toast rework built (resolution frame r7) — ON BRANCH `toast-rework`
- Both mid-exercise toasts RETIRED at the source. Restored -> the frame's kicker: green RESTORED + inline mini strength ring animating fading-gold low-arc to strong-blue (600ms off .res-grown.show, pure CSS) + "This one was fading. You brought it back." Precedence: one kicker per resolution, YOURS NOW > RESTORED; run.restored still counts for the session tally.
- Accent/typo nudge KILLED, no replacement: accepted answers are never qualified; the always-on es-reveal is the passive mechanism. Silent slip telemetry added (learn[id].slips); never surfaces.
- Note: scores 8.4 always specced "Restored label + a subtle strength arc filling" inline on the card — the toast was an implementation shortcut; r7 is the spec's original intent finally built.
- Docs: scores 8.4 delivery finalized; learning-spec silent-grading note + session-end pencil gains restored count; design-system toast rule + forgiveness rule; 3 decisions.
- r7 artifact re-committed by chat WITH Tom's timing intact (the canvas relay worked this round).

## 2026-07-19 — Pacing Rule adopted; resolution frame converts to a self-paced Continue exit (branch)
- CORRECTING DELTA on the resolution frame: auto-advance struck (audio-end detection, 250ms buffer, sound-off dwell, tap-to-advance-early, 8s failsafe all deleted, not kept as fallback). The standard Continue (reconciled .btn spec) materializes WITH the en/audio block; audio autoplays; exit is the learner's tap, always.
- Design system §1.2: THE PACING RULE — sequence is the app's, pace is the learner's; every moment's exit is a learner action; scaffolds fade by data (expertise reversal), never assumption. Plus the redundancy rule (audio and displayed text always match). 4 decisions (pacing, expertise reversal, imageless-exercises exception logged with rationale, redundancy).
- ARTIFACT REGRESSION CAUGHT AGAIN: chat's r4 re-issue reverted Tom's timing stretch (canvas predates the harness call). Timing RESTORED (450/350/600, value-change class) and merged with the Continue exit as r5; caption warns; chat's canvas needs the same or the next re-issue reverts it.
- Mature-rep auto-advance = post-launch [tune] under expertise reversal (floor-latency taps <~400ms on mature reviews); §8t table row updated.
- Still on branch `resolution-frame` for Tom's harness review.

## 2026-07-19 — Resolution frame approved + BUILT ON BRANCH `resolution-frame` (harness review pending)
- ONE resolution language (design/resolution-frame.html): every correct answer matures the page IN PLACE — build tiles fuse where they stand (chrome dissolves, 300ms), green sweep under the learner's own sentence, es ALWAYS reveals (listening included), en + full-phrase audio materialize, item strength ring ticks w/ "Stronger" whisper, tray recedes to 28%. Wash survives as base layer. correct-feedback.html superseded-in-place (do-not-build-against).
- Built: resolveCorrect() at the single grading funnel (all nine types); speak() gained an onend hook; per-item strength ring + whisper in the runner top row (answer-tick retired); Yours-now = cold-axis 0→1 on typed/spoken only, once ever (s.yoursShown).
- Timing per artifact (§8.5 blessed this batch): advance at audio-end + 250ms, tap-to-advance from es-settle (replay re-arms via utterance token), sound-off 1200ms dwell, 8s failsafe, reduced-motion instant fusion. Supersedes the 650ms flat hold.
- Spec edits: design-system §3.5 replaced (resolution language + only-a-miss-interrupts + scale ladder); scores §8.5 dwell; learning spec §8t [tune] dials table (anchored to constants) + §10 pencils (Mix it w/ exclusions, session-end summary). 3 decisions.
- ON BRANCH per the held-work rule; Tom reviews in the harness (local server serves the branch working tree), then merge + SW bump + deploy.
- Next chat blocks: primer wave (17 Spain + 22 Mexico), canonical ear pass.

## 2026-07-19 — Stage 0 SHIPPED to both packs (Chapter 0 real) — HELD LOCALLY, not pushed
- Executed the content map (docs/tripfluent-stage0-content-map.md): pass-0 stage in BOTH packs — 3 kit lessons (Spain 37 / Mexico 35 items migrated by es-derived ID, SRS history intact) + 7 machines (Spain 25 / Mexico 23 authored fillers; exact-match claims: Spain 3, Mexico 5 incl. ¿Hay wifi? + ¿Dónde está el baño?). Emptied s1-hello/s1-numbers1/mx-greet/mx-numbers1 removed.
- Machines carry machine:true, frame, frameGloss, beat; fillers carry frame + tags:["core"]. Learn tab renders "Pattern · N fillers" from live data now.
- Engine-adjacent: categoryOf gains "Core" (checked first); CONTENT_WEIGHTS "Core": 0.15 + NO_MODIFIER (weight value flagged for ratification); seedPlacement stageCount +1 (Stage 0 seeds with pass 1 — placement semantics preserved). K3 floor collision: MOOT (floors key on category "Advanced"; emergency items were "Basics" already).
- Started-chapters-never-dim implemented in _journeyView (any done lesson or exposed item un-gates a chapter). RATIFIED by Tom 2026-07-19; decisions line added.
- Audit GREEN both packs: checks 11+12 = 0, all 7 machines at pass 0, audit-pack 0 hard errors. Tool aligned to the ratified head list + fixed an ASCII-\b regex bug that had under-counted dónde está (the census "0 instances" was partly artifact; the tail bucket caught them, so the reconciliation stands).
- Primer gaps now 26/31 (10 new Stage-0 lessons have none) — Phase-3 wave. Near-form flags for the human ear: ¿Dónde está la estación? (vs ...de metro), ¿A qué hora cierra? (vs ...la cocina), ¿Cuánto cuesta esto? (vs bare), Necesito ayuda (vs bare Ayuda), ¿Hay una farmacia cerca? (vs ¿Hay un cajero cerca?), Spain ¿Hay wifi? (vs ¿Tiene wifi? if present).
- NOT deployed: committed locally only; deploy waits on Tom's harness review of Chapter 0 + Learn tab together.

## 2026-07-18 — Learn tab approved + BUILT TO HARNESS (design/learn-tab.html) — NOT DEPLOYED
- Structure: THREE segments (was two): Journey (default, chaptered spine) | Topics (coverage strip PROMOTED to full view; every row = drill entry routing to Practice prefiltered by scenario) | Phrases (built view unchanged).
- Chapter naming set DECIDED + DATA EDIT APPLIED: live deck stage titles changed in BOTH packs ("Survival"->"Essentials", "Comfort"->"Getting comfortable", "Fluent"->"Like a local"); resolves the Survival/Survival-kit collision.
- Build deltas vs the shipped tab, all applied: segmented control 2->3; coverage strip moved OUT of Library-top INTO Topics; stage progress bars -> "N of M" whispers (deliberate removal, verified 0 remaining); pass chips REMOVED from lesson rows (verified 0 remaining); lesson rows gained a one-line narrative beat sourced from primer data (first sentence of primer.scene, `l.beat` overrides); locked chapters at 55% opacity w/ soft-gate copy ("Best after Essentials. You can peek anytime.") — browsable, never barred.
- Pattern machines: naming only, no glyph; meta renders "Pattern · N fillers" when `l.machine` is set (no content uses it yet).
- Passed-state = strength ring (existing), decaying honestly; no checkmarks.
- Stage 0 renders as Chapter 0 automatically once a pass-0 stage exists in a pack; nothing to gate manually.
- Docs: scores §3.1 three-view row; learning §1b.2 chapter set + §1b.0 Chapter 0 copy/no-glyph; 4 decisions.
- HELD FOR REVIEW in the harness ("Learn tab" story) at Tom's request before deploy. SW not yet bumped.

## 2026-07-17 — Nav light system approved + built (design/nav-light.html)
- RULE: the app has ONE light source, the active tab's under-glow; each tab's screen atmosphere is that light scaled up, blooming from the active tab's x-position at the bottom edge. Home's bottom-left glow is now law, not coincidence (leftmost tab).
- BUILT (v157): nav light is ONE `.navlight` element that translates along the bar (260ms) with the notch + glow riding it; per-tab `.tab.active::before/::after` decoration removed. `.bloom` is ONE oversized radial moved by transform (300ms), anchored to the active tab's centre in viewport x. Content crossfades 180ms via `#app.tab-fade`. Reduced motion: both jump, no glide.
- Home OPTS OUT for now: it keeps its designed photo + ground glow; `_setBloom()` removes the bloom on home. Reconcile at home's next revision (anchor -14% -> Home tab centre x ~12%), then home joins the shared bloom.
- Interstitials keep the top-center tint (ceremony rule unchanged). Design-system §2.1 one-light rule + §4.8 glide motion rule; 2 decisions appended.
- Learn tab (next design) inherits its atmosphere from this system: bloom at tab position 2.

## 2026-07-17 — First-score-reveal card approved; ahead-gap wash removed app-wide
- NEW: design/score-reveal.html (stamped). Fires ONCE when Readiness first exists (session end, before home). Sequence: 600ms count-up + ring fill → band chip → JOURNEY PREVIEW (forward-only sweep 44→72 Strong→91 Tripfluent w/ 750ms crown beat→settle, ~2.5s; teaches band colors wordlessly; never sweeps down through Low) → education copy → active dismissal "Tap your pace mark" (wrong-area taps gold-halo the tick; correct = "That's your pace." then advance). Pace mark pulses only while awaiting the tap. Reduced motion: instant, static halo, no journey. **BUILT** (v156): `scoreRevealCard()` in screen-home.js, fired from `goHomeAfterSession()` on the finishLesson/finishReview home buttons; `state.scoreRevealSeen` makes it once-only. Journey values verified 44→72(Strong)→91(Tripfluent)→44; tap paths verified (wrong area halos the mark, tick tap advances and persists the flag); both themes. Note: the preview browser throttles rAF/timers, so the animated path was verified by value trace + the reduced-motion path, not by wall-clock timing.
- design/home.html re-issued: ahead-gap green wash REMOVED. **Built**: wash stripped from ringSVG + .ring-gap CSS deleted; tick alone is the pace signal (fill-vs-tick position carries ahead/behind, words live in the detail sheet). Scores-spec pace-tick section updated in both places.
- REGRESSION CAUGHT on re-issue: the re-issued home.html restored the tick keyline that Tom removed 2026-07-17. App left correct (no keyline); artifact re-fixed and caption now says "do not re-add on re-issue." Chat's canvas needs the same fix or it will revert again.
- Design-system: interstitial top-tint rule + pulse-lighter-than-element rule (§2.1). 3 decisions appended.
- Design queue: Learn tab (renders pass 0 as Survival kit chapter) is next and last big undesigned surface.

## 2026-07-17 — Readiness detail sheet approved + built (design/readiness-detail.html)
- Opens on ring tap (scoreSheet("readiness")); scrim-tap dismisses. Three states: ahead / behind / Tripfluent-held.
- Pace row: apex-right triangle glyph + copy (ahead leads with cushion; behind = statement + action; held = "Holding Tripfluent", never achieved). Pace pts = readiness - glide target (_glideToday); held when readiness >= 85.
- Drivers: soft bars (Coverage/Retention --secondary, Recency --accent) + value + 7-day delta + plain descriptor; weights stay internal. Recency + coverage now added to the daily snapshot (_recordDaily) so their deltas accrue; delta hides until data exists.
- "What moves it": Recency pre-trip; held → reviews-hold-it line. Momentum/Retention sheets keep the prior simpler layout (not in this artifact).
- Design system §3.3 sheet-dismissal rule + 3 decisions (pace-glyph orientation, weights internal, crown/Landed-Tripfluent scope). scores-spec detail-view section rewritten. SW bumped.
- Design queue: first-score-reveal education card → Learn tab.

## 2026-07-17 — Pattern moment approved (design/pattern-moment.html) + §4c.3 amendments
- NEW artifact stamped (both views + themes): §4c.3 interstitial ("A pattern is forming", blue-slot machine, dotted fillers, one-time fill sequence, active-dismissal generalization rep on a never-drilled cognate) + §6.3 fast-path callout ("New word, same pattern").
- Head/tail split settled: HEAD frames = Stage-0 machines (deliberate, §6.3 callout); TAIL frames = §4c.3 pattern moment (organic reveal); never both. Cross-refs added to §1b.0 + §4c.3.
- Spec: §4c.3 rewritten (scoping, active-dismissal generalization rep, generalization-filler authoring rule, `frameGloss` field, fixed the wrong "sin ___" head-frame example → tail "¿Tiene ___?"). Design system §3.6: "dismissals are active app-wide" principle. decisions synced.
- Doc/design only — §4c.3 is Milestone 2 (needs `frame`/`frameGloss` data + composer trigger); NO app build this round.
- Design queue: readiness detail sheet → Learn tab (renders pass 0 as Survival kit chapter).

## 2026-07-17 — Presentation card v2.1 approved + built (design/presentation-card.html)
- Active dismissal: 'Got it' removed; ONE pattern on every variant — a two-soft-option meaning check on the NEW material (chunked: the new chunk; short: the item). Options unmarked (gold NEW box doesn't trivialize); wrong → gold-ring the correct option, correct → green + 650ms advance. Card cannot be failed; nothing recorded beyond exposure 1.
- Chunk taps stay PURE exploration (popover + audio) — tap-the-part machinery from v2 never built (chat caught the non-sequitur first). §4c.1 + decisions corrected to the v2.1 rule.
- Meet-the-piece variant (§4b.5): render deferred with its composer trigger (future engine work); not built this round.
- Built to the v2.1 artifact + verified; SW bumped.
- Design queue: pattern-moment interstitial → readiness detail sheet → Learn tab (renders pass 0 as Survival kit chapter).

## 2026-07-17 — Learning-engine amendment batch (curriculum architecture)
- Spec edits 1–8 per handoff: Stage 0 (§1b.0), meet-the-piece (§4b.5/§6.1), active dismissal (§4c.1), authoring rules 10–11 + audit checks 11–12, primer through-line (§9b.3), graded-reader pencil (§10).
- Content-pass impact: Mexico map gains a pass-0 chunk (survival kit + ~8–12 pattern machines) BEFORE existing pass 1; existing pass 1 lessons should be re-audited for frame-prerequisite compliance once machines are named.
- Design queue (chat): presentation-card v2 → pattern-moment interstitial → readiness detail sheet → Learn tab (must render pass 0 as "Survival kit" chapter).
- Doc-only batch: no app code touched; presentation-card v2 active-dismissal build waits on the v2 artifact.

## 2026-07-16 — Button reconciliation + token precedence (from correction-sheet audit)
- DECIDED (B): global `.btn` reconciles to the design-system button spec — 15px / weight 600 / radius-md (14) / 48px min-height. One CSS change, sweeps all buttons; retires the last pre-constitution component dialect. Press physics (translateY 2px + shadow collapse) preserved (separate `:active` rule) and verified.
- Token-precedence rule added to design system §5: live styles.css tokens outrank artifact token blocks — ends the frosted-glass class of diff noise; artifacts refresh tokens opportunistically on revision only.
- text-transform diff: confirmed non-issue, no action.
- No artifact re-issues needed for the button change (approved artifacts already ARE the B spec — the app moves to them, not vice versa). Correction-sheet spacing also aligned (gap 3/9, chunk line-heights, sheet padding 24). SW → v148.

## 2026-07-16 — Pacing model specced + tick redesigned (design/home.html re-stamped)
- Pace tick is now a Submariner-style bezel index: solid gold inverted triangle pointing inward from OUTSIDE the ring track, thin `--bg` keyline (fixes gold-on-gold at the Fair band; marker beside the dial, not on it).
- Ahead-gap between tick and fill washes soft `--green` (opacity ~0.38) on the arc; behind = deliberately unpainted.
- State-vs-progression model clarified (see decisions): home = state/pacing, Learn = progression; Tripfluent = HELD title; "Landed Tripfluent" = permanent trip record (PENCILED, own spec, do not build).
- Scores-spec edits in this batch: north-star opener, tick definition [tune], gap-wash rule, two education moments, held-title copy rules.
- Built to the artifact (v146): triangle index + green wash in `ringSVG` (readiness only), verified both themes + ahead/behind/crown in the harness.
- Design queue next: (1) Readiness detail sheet, (2) first-score-reveal card, (3) Learn tab, (4) Landed-Tripfluent moment (after its spec). Carry-overs: presentation-card re-approved by Tom (2026-07-17) — shipped; correction-sheet chunk conversion done.

## 2026-07-16 — Home build STAGE 1: atmosphere everywhere (Claude Code)
- App-wide dark-theme atmosphere shipped (both dark blocks): `--bg` #05060d, `--bg-card`/`--bg-elevated`/`--bg-nav`/`--border` now translucent; new `--ground` token (navy linear + warm top radial) and `--card-blur`. `body` background = `var(--ground, var(--bg))` fixed — gradient ground in dark, cream fallback in light (token fallback = zero light-theme change, verified). Curated surface classes get `backdrop-filter: var(--card-blur)` (frosted only in dark).
- Nav: active tab now **gold** (`--accent-2`) with the Whoop under-glow (`::before` radial from the bottom edge) + notch (`::after`), replacing the blue pill. Applies in both themes ("gold is the app's light").
- Verified in browser: dark = gradient ground + frosted cards + gold nav; light = unchanged cream + opaque cards + gold nav; readable both; no console errors. SW → v122.
- **Next stages:** (2) home screen composition to `design/home.html` via the §5 gate; (3) photo plumbing + free-licensed placeholders (user chose Unsplash/Pexels). Photo licensing still a ship blocker for final images.

## 2026-07-16 — Home build STAGE 2a: dial cluster (bands + crown + pace tick) (Claude Code)
- `readinessBand` labels → **Low / Fair / Strong / Tripfluent** (scoring.js). Readiness ring arc now tracks the band color (green/blue/gold/dim) via `band.cls` (was red/yellow/green `r-*`, now unused).
- Readiness hero: "Trip Readiness" ring label removed; the band renders as a **chip** (`.band-chip`, band-colored 13% fill) beneath the arc. **Tripfluent = crown** (metallic gold gradient border) with a **one-time sheen that fires only on crossing into the top band** (`state.lastBandTop` tracks it; `.just-crossed` gates the animation; reduced-motion disables it).
- Pace tick now **gold** (`--accent-2`, was `--text`) = the sole ambient pace signal. Countdown subline is **pure countdown** ("121d out"), the "· on pace / · behind" text removed. Negative dial delta is **dim, not red**.
- Verified in browser (dial cluster for Strong 72 + Tripfluent 91): gold tick, band chip, metallic crown, dim delta all correct; new labels confirmed in the served file (browser showed stale labels = HTTP script cache only). SW → v123.
- **Stage 2 remaining:** fade action tile, insight line (gold spark + green delta), presence line + weather tile. Header/photo-crown deferred to Tom's design session + Stage 3 photos.

## 2026-07-16 — Home build STAGE 2b: insight line + presence line (Claude Code)
- **Insight line** (`insightLine()`): gold spark + "Your last 2 weeks moved Readiness +N" with N in green display weight. Real data via `scoreTrend("readiness", 14)`; shows only the encouraging positive case (silence otherwise — never a negative nudge).
- **Presence line** (`presenceLine()`): green dot + the destination's LOCAL time ("7:06pm in Spain") via `Intl.DateTimeFormat` + a new `tz` field on `DESTINATIONS` (Europe/Madrid, America/Mexico_City) — free, no fetch. **Temperature omitted** (optional until the cached weather fetch lands, per §3.2) rather than faked; the weather TILE (inside ~3 weeks) also waits on that fetch.
- Both wired into `renderHome` under Practice, in rhythm (not bottom-pinned). Verified in browser: styling + real tz math correct. SW → v124.
- **Fade action tile moved to Stage 3** — its payoff is the session photo bleeding in, so it bundles with the photo work rather than half-building a navy block now. **Stage 3** = photo plumbing + free-licensed placeholders + fade tile + (with Tom's design session) the photo-crown header + weather tile when the fetch exists.

## 2026-07-16 — Home build STAGE 3a: fade action tile (Claude Code)
- Photo plumbing already existed: `introPhoto(lesson)` → `./img/<region>/<name>.jpg`, with 6 real Mexico photos tracked in `img/mx/` (Spain currently reuses them — `img/es/` is a TODO, being filled next).
- `heroTile` rebuilt to the **fade composition** (`design/home.html`): navy block + gold kicker (kind → "Next lesson"/"Review"/"Countdown"/etc.) + title + sub, with the session photo bleeding in from the right under a navy→transparent gradient. `heroState` now returns the `lesson` so the tile shows that lesson's primer photo; other actions get a warm destination default. Kind-coded background colors retired (kicker carries the kind now).
- Verified in browser (lesson + review tiles with real photos): photo bleed + gradient + gold kicker + readable text all correct. SW → v125.
- **Stage 3 remaining:** free-licensed Spain placeholders into `img/es/` + region fix (so Spain stops reusing Mexico photos); then the photo-crown header + weather tile (both gated on Tom's design session / the weather fetch).

## 2026-07-16 — Home build STAGE 3b: Spain placeholder photos (Claude Code)
- Pulled CC0 (public-domain, no-attribution) Spain photos via Openverse, **verified by eye** (titles were unreliable — the first pass returned an exhibition banner, a museum reliquary, a football stadium, a UK street named "Seville", and one non-image SVG). Kept the 3 that are genuinely good Spain scenes: `img/es/cafe.jpg` (Café Moka, Barcelona), `market.jpg` (Mercado Central, Valencia), `default.jpg` (Plaza Mayor, Madrid). Resized to ~200-350KB. Provenance in `img/es/CREDITS.txt`.
- `introPhoto` now resolves Spain's café/market/default to `img/es/`; every other category **falls back to the good `img/mx` set** (`ES_PHOTOS` gates per-name, so no 404s and nothing off-topic). Add a name to `ES_PHOTOS` when its `img/es/<name>.jpg` is chosen.
- Verified path resolution (Spain vs Mexico) + all three are valid JPEGs viewed. SW → v126.
- **Deliberately did NOT chase all 6 via CC0** — the pool is noisy and curated placeholders want a human eye (Tom is choosing final photos anyway). Food/transport/sights use the on-topic mx photos until Spain versions land.
- **Home build remaining (all externally gated):** photo-crown header (Tom's design session on header↔gradient), weather tile + temperature (cached weather edge function). The data-driven home is complete.

## 2026-07-16 — Home build STAGE 3c: photo crown + trip header + atmosphere (Claude Code)
- **Correction:** I had wrongly deferred the whole photo crown — Tom clarified the design session is about how the header works on the OTHER pages, not the home itself. The home must match `design/home.html` fully, photo included. Built it.
- **Home atmosphere** (`setHomeAtmo`/`clearHomeAtmo` in screen-home.js): a fixed layer behind the content — a destination **photo crown** (`destHero()` → the wide es/mx scenic) that **masks into the ground** (mask-don't-paint) + a warm **destination ground-glow** sweeping from bottom-left. Torn down when leaving home (nav.js `showTabbar`/`hideTabbar`), verified restored on return.
- **Trip header block**: big destination name + countdown ("Spain · 128 days out") anchoring over the photo.
- **photo-on treatment** (`body.home-lit`): transparent topbar, wordmark **halo forcing standard brand colors** (halo rule), white header text with shadow — both themes.
- Verified in the real app (seeded returning-user state, fresh port to beat the HTTP cache) in **dark + light**: photo crown + masking, trip header, band chip, fade tile, presence line all present and matching the design; atmosphere correctly torn down off-home. SW → v127.
- **Home now matches design/home.html.** Genuinely remaining: the header treatment on **other pages** (Tom's design session) and the **weather tile + temperature** (cached weather edge function).

## 2026-07-17 — Home keeps native rubber-band (chat decision) (Claude Code)
- Reversed the earlier `overflow: hidden` on home. Root cause of "frozen" feel was `body { overscroll-behavior: none }` (killed the bounce entirely). Changed to `overscroll-behavior-y: contain` (bounce yes, pull-to-refresh no) + `-webkit-overflow-scrolling: touch`. Home forces a **1px overflow** (`min-height: calc(100vh + 1px)`) so iOS engages the rubber-band even though content fits — imperceptible, no real scroll, no persistent header clip.
- Decision (decisions.md, chat): surfaces keep native scroll physics even when content fits — user-driven physics is feedback, not ambient animation; suppress pull-to-refresh wherever bounce is enabled. Generalizes to all screens. Capacitor WKWebView bounce retires the CSS trick later.
- iOS-only physics — not observable in the desktop preview; device-check. SW → v138.

## 2026-07-16 — Fix: light-theme dial track + status-bar theme-color regression (Claude Code)
- **Light-theme dials** were still washing out (I'd only added `--ring-track` to the dark blocks). Added a light `--ring-track` (translucent dark) so the tracks read over the bright photo + cream. Both themes now legible.
- **Status bar "black in both themes"** root cause: `applyTheme()` (ui.js) already syncs the single `theme-color` meta to `--bg` for the ACTIVE app theme — but the two `media`-query `theme-color` metas I'd added overrode it with the SYSTEM scheme, so a dark *system* pinned #05060d regardless of the app's theme toggle. Reverted to the single meta; theme-color follows the app theme again (light app → cream, dark app → #05060d). `black-translucent` kept for the edge-to-edge atmosphere (needs a PWA re-add to take effect — iOS caches status-bar-style at install). SW → v136.

## 2026-07-16 — Home polish: no-scroll, status bar, dial legibility (Claude Code)
- **No scroll on home:** `body.home-lit { overflow: hidden }` — home is a fixed one-screen composition (design `.screen`), nothing to scroll to; kills the overscroll/clip against the transparent header. Other tabs still scroll. Verified: docScrollTopMax=0, content clears the tab bar, no clipping (signed-in). (Edge case: a signed-out user's backup banner can tuck behind the tab bar since it can't scroll — minor.)
- **iPhone top reflects home:** status-bar-style `default`→**`black-translucent`** so the atmosphere reaches the top edge under the status bar (safe-area padding keeps content off the notch); added `theme-color` media queries (cream light / #05060d dark). iOS-only, not visible in the browser preview.
- **Flanker labels ALL CAPS** (`text-transform: uppercase` + design's 10.5px/.06em) — MOMENTUM / RETENTION.
- **Dials no longer wash out over the photo:** ring track was translucent `--bg-elevated`; added a near-opaque neutral `--ring-track` (both dark blocks) + thicker strokes (8 hero / 11 flank) so the rings read over the atmosphere.
- **Readiness % raised** to a superscript (design treatment) via `.ring-num` inline-flex + `.pct` margin-top. SW → v135.

## 2026-07-16 — Reconcile app to the re-mocked 390px home artifact (Claude Code)
- Tom re-mocked `design/home.html` at **390px** (the new baseline). It scales the design up ~12% for the wider frame: hero ring 150→168 / number 34→38, flank rings 72→80 / number 19→21, photo crown 230→264, screen padding 18/20→20/24. **`.trip .dest` stayed 28px** — so my earlier 33px "prominence" bump was wrong (font px don't scale with frame width; the re-mock put the size increase in the dials, not the hero).
- Reconciled the app to match (ran the §5 diff): readiness ring `min(168px,45vw)` + num 38px; flank rings `min(80px,22vw)` + num 21px; dest back to **28px**; `.atmo-photo` 264px; header/home horizontal padding → 24px; wordmark 20→19px.
- **Bug fixed:** the insight spark was 32px tall (never truly inline) due to a **class-name collision** — a bar-chart `.spark { height:32px; gap:4px }` was also hitting `.whisper .spark`. Overrode height/gap; spark is now a true 12px. (This was the real cause behind two rounds of "spark isn't in line.")
- Diff clean vs the re-mock bar render-identical noise (uppercased kicker, inline-vs-flex chevron box). SW → v133.

## 2026-07-16 — Home fidelity round 3: header space, countdown, light tint (Claude Code)
- **Header top space:** topbar padding-top 6→16px (+ safe-area). More breathing room above the wordmark/flame/lang on every screen.
- **Countdown de-duplicated:** removed the `Nd out` subline from under the Readiness dial — the countdown now lives only in the top-left trip block ("Spain / 128 days out"), per design/home.html (which has no dial subline). Set-date affordance moved to the trip sub when no trip date.
- **Light-theme ground tint now visible:** `.atmo-ground` was too weak on cream. Matched the design's dark values (rgba warm) and pushed the LIGHT peak stronger than the artifact (40% terracotta → gold) so the warm bottom-left glow reads on cream. Both themes verified.
- **Artifact-width fix (the "reads small" pattern):** design-system §5 now says mock at a **390px** `.phone` (was 340px) so px transfer 1:1 and the diff stays exact — briefed to chat. SW → v132.

## 2026-07-16 — Home fidelity round 2: practice row, spark, hero size (Claude Code)
- **Practice button** rebuilt to the design's bordered-row pattern (`.practice`: gold icon-circle + `.lbl` + chevron) — was the old centered `.practice-btn`.
- **Insight spark** now truly inline: `.whisper .spark` → `display:flex; align-items:center` + `svg{display:block}` (the `inline-flex`/baseline gap dropped it below the text). Verified: spark center-y == text center-y.
- **Hero "Spain"** bumped 28px → **33px** (letter-spacing -.02em) and the dials pushed down (`.trip` margin 2/16 → 10/30). Deliberate deviation from the artifact's 28px: the artifact is drawn on a 340px phone, so exact-px reads small on the 375px+ real screen — scaled up for the same prominence. (Diff flags this as intentional; NOT synced to the artifact, which stays calibrated to 340px.)
- **Ran the §5 diff** (added `.practice*` to `DESIGN_PAIRS.home`): clean except the intentional dest bump + render-identical noise. SW → v131.

## 2026-07-16 — Home fidelity fixes + §5 diff gate enforced (Claude Code)
- **Root cause of the misses:** I screenshotted the home build instead of running the §5 acceptance diff — the exact gate built to prevent this. Tom caught: wrong wordmark sizing, old gradient flame (should be gold), spark not inline, flag instead of the lang chip, action-tile font.
- **Fixes to match `design/home.html`:** `wordmark()` → the design's **vectorized SVG** (was font-based text — the sizing bug); topbar **flame → gold** design flame (`--accent-2`, was the orange/red gradient); lang **flag emoji → "ES · ES" text chip** (renderTopbar + `.lang-flag-top` restyle); photo-on flame now light-gold (`#f0d060`) not white. Then registered `DESIGN_PAIRS.home` and **ran the diff** — fixed every real mismatch it found (band-chip font-size/letter-spacing/padding, lang-chip padding, trip/hero line-heights). Diff now clean bar two render-identical items (CSS-uppercased kicker vs literal caps; no-op gap on a single-child span). Verified in-browser dark; wordmark/flame/chip/spark/tile all correct.
- **Process fix (so it can't recur):** design-system §5 now states the diff is **MANDATORY** on every design build (no "done" without a `DESIGN_PAIRS` entry + clean run), and adds **step 0 — markup fidelity**: the computed-style diff does NOT catch a wrong SVG / flag-vs-chip / font-vs-vector wordmark, so copy the artifact's actual markup/SVG, don't approximate. SW → v129.

## 2026-07-16 — Header layout applied app-wide (Claude Code)
- Clarified: the header as designed in `design/home.html` (`.approw`) IS the app-wide header spec — not a separate design session. Restructured the shared `.topbar`: **wordmark LEFT** (`order:-1`, was absolute-centered), **flame + language grouped RIGHT** (`.stat.streak` gets `margin-left:auto`; lang-flag no longer `margin-left:auto`). Wordmark height 22→20 to match.
- Applies to every screen. Photo-on treatment (wordmark halo + standard colors + white text) stays **home-only** via `body.home-lit`; other pages show the wordmark in normal brand colors, no halo.
- Verified in the real app: home (halo over photo) + Progress (plain), both correct. SW → v128.
- **Home + header now complete.** Only genuinely remaining home item: **weather tile + temperature** (cached weather edge function).

## 2026-07-16 — Home screen designed + approved (design/home.html)
- Atmosphere: photo + tint. Photo crowns top, dissolves via SELF-MASK (mask-don't-paint rule, see decisions); destination ground-glow sweeps diagonally from bottom-left (26% peak, full height), stacked BENEATH the photo. Dark theme = gradient ground (navy linear + warm top radial), cards translucent + blur — this is a styles.css token change: dark --bg becomes the gradient treatment, --bg-card translucent; APPLY TO BOTH DARK BLOCKS.
- Wordmark: real SVG, fills → --wordmark-1/-2 tokens (update source SVG in repo); white letterform halo in photo contexts; halo forces standard navy/blue fills in both themes.
- Dials: Readiness hero + gold pace tick = SOLE pace signal (subline = pure countdown; pace words only on divergence in detail view/whisper). Bands: Low / Fair / Strong / Tripfluent — chip treatment (sentence case, band-colored 13% fill). Tripfluent chip: metallic gradient border + soft gold halo + ONE-TIME sheen sweep, fired only on band-crossing events, disabled under prefers-reduced-motion. No ring label. Flankers: bare indices + 7-day delta whispers (negative = dim, never red).
- Action tile: fade style (navy block → session image bleeding in right; image = lesson's primer photo double-duty; review sessions = destination texture/icon).
- Practice: bordered-row pattern (icon + label + chevron). Insight line: gold spark + delta in --green display-weight, sits in rhythm under Practice (never margin-auto'd to bottom).
- Presence: quiet line by default ("6:12pm in Mallorca · 74°"); upgrades to the dynamic weather TILE inside ~3 weeks to trip (sky gradient keyed to destination-local time; conditions as STATIC texture — no ambient animation). Local time = tz math, free. Temperature = needs cached weather fetch (edge function) — build the line + tile with temp OPTIONAL until that lands.
- Nav: active tab gold with Whoop-style under-glow rising from the bar's bottom edge + bright notch. This changes the current blue active state — see decisions ("gold is the app's light").
- BEFORE SHIP: license or replace the Port de Sóller photo (watermarked stock preview); destination photo sourcing now scoped to ~1/destination for home + 1/lesson for primers.
- PENCILED (do not build): tint intensity as live variable (candidates: days-to-trip, momentum, destination-local time of day — the weather tile is the proof-of-concept for the last one); ±2pt display hysteresis at band boundaries.
- APPLIED (Claude Code): committed design/home.html; threaded all doc edits — scores-spec §1.1 bands (Low/Fair/Strong/Tripfluent, "Fluent for your trip" swept) + §3.2 (pace tick sole signal, band chip + crown, no ring label, countdown-only subline, insight line, presence/weather-tile); design-system §2.1 (gold-is-the-light, mask-don't-paint, halo rule, dark gradient-ground token note), §1.1 (don't-caption-the-obvious), §4 (one-time explanatory motion); decisions ×8. **BUILD is a separate pass, not started** — this is the design + docs stamp. The dark-theme token change is app-wide (affects every screen) and the photo licensing is a ship blocker; both to weigh when the build starts.

## 2026-07-15 — Hint popover approved + chunking authoring rule ratified
- NEW: design/hint-popover.html. Exercise hint affordance = dotted underline (no pill fill in exercises); tap = gold + chunk audio + canonical navy popover. Hints free on first pass; in review a used hint silently blocks the cold axis (no UI acknowledgment). Blank never hintable. No hint button — ambient layer; one-time discoverability tooltip only if needed. STAND-INS: progress bar, option buttons.
- Chunking authoring rule (5 criteria) added to learning-engine spec §11.1 + audit check — governs the ~150-phrase chunking pass. Chunk segmentations are content: revisable when hint-tap telemetry flags confusing cuts.
- Remediation queue remaining: home hero tile + chips re-cut in real tokens.
  - DONE (Claude Code): committed design/hint-popover.html; threaded §11.1 rule 9 + §11.2 check-10 extension + design-system §3.4 context rule + decisions. **Audit check implemented** in `tools/audit-pack.mjs` (>4 chunks / any single-word chunk → informational). The hint-layer *build* (dotted-underline affordance in exercises + hint-tap logging + cold-axis gate in review) is unbuilt — that's chunk-pipeline Phase 3, still pending.

## 2026-07-15 — Presentation card designed + approved
- NEW: design/presentation-card.html (§4c.1 / §4b.5), both layouts: chunked long phrase + short item w/ tappable context sentence. Composes built components (chunk pills, popover, AudioControl); STAND-IN: progress bar.
- New attention-semantics system ratified (see decisions): gold marks the NEW chunk (soft --accent fill + NEW tag, ≤-half rule); known chunks unmarked, popover carries provenance ("from Ordering Tacos").
- FOLLOW-UP on built correction sheet: replace the known-chunk green outline with gold on the ERROR chunk (cuenta/cuento chunk in the reference example). Small edit; same semantics.
  - DONE (Claude Code): `showCorrection` now marks the error chunk gold (`.corr-chunk.error`) instead of the green known-outline+check (both retired). Error locus = chunk whose normalized text is absent from the typed attempt (`wrong`), capped at ≤ half (a mostly-wrong attempt gets no marks; the struck-through line carries it). No `wrong` text (e.g. MC misses) → no marks. Updated `design/correction-sheet.html` to match (la cuenta = gold error). Diff gate clean; error detection verified (only "la cuenta" marked for the cuento attempt). SW v121.
- Build order: presentation card ships with M1's ladder work (it's the exposure-0 slot type).

## 2026-07-15 — AudioControl built (§3.2), first run through the diff gate (Claude Code)

Built the unified `AudioControl` to `design/audio-control.html`; retired every ad-hoc audio button.

- NEW `audioControl(play, {speed})` in `ui.js` — variant A (44px gold inline speaker, glyph → animated
  gold bars only while playing, tap restarts) and A2 (+ speed pill 1x/0.75x, gold when slowed, resets per
  item). `.ac-*` CSS in `styles.css` matches the artifact.
- **Replaced:** all `speak-btn`/`soundIcon` "Hear it" buttons (present card, intro card, primer reveal,
  es→en MC) → variant A plain speaker; `waveButton`+`slow-btn` in the three listening exercises
  (renderReply/renderListenChoice/renderListen) → variant A2; `pb-speak` (phrasebook) → variant A; intro
  list rows → row-as-trigger with the gold speaker visual (variant C). Chunk pills (present + correction)
  gained the variant-C gold-ring `.playing` state. Fixes an off-brand bug too: the old wave button was
  `--secondary` blue, not gold.
- **Removed dead code:** `soundIcon()`, `waveButton()`, and `.speak-btn/.wave-btn/.wv/.slow-btn/.sound-ic/
  .intro-spk/.pb-speak` CSS. `corr-audio` left as-is (governed by the correction-sheet artifact, which is a
  plain speaker per the AudioControl rules).
- **Acceptance (§5 gate): clean.** `designDiff('/design/audio-control.html', DESIGN_PAIRS.audioControl)`
  returned zero mismatches on `.ac-speaker/.ac-bars/.ac-bars span/.ac-speed`. All four component states
  screenshot-verified; listening exercise renders fresh with speaker+pill; no boot errors. Phrasebook
  visual blocked only by the preview's stale HTTP script cache (source verified correct; same pattern as
  the verified listening integration) — fresh on deploy via the SW bump.
- Minor accepted deviation: speed pill is 30px tall (matches the approved artifact) vs the §6 44px
  touch-target target, consistent with how `corr-audio` (40px) was handled. SW → v120.

## 2026-07-15 — AudioControl designed + approved
- NEW: design/audio-control.html (§3.2 component sheet, live states). Three variants: inline speaker (44px, gold glyph → animated gold bars while playing), speaker + speed pill (1× → 0.75×, gold when slowed, resets per item), chunk pill (pill is the trigger, gold ring while playing). Disabled = 40% opacity, never hidden.
- Build: replace every ad-hoc speaker/turtle button in the app with AudioControl instances per variant. This completes the original offender list (slow-voice button, phrase taps, correction popup).
- Behavioral rules in the artifact's rules block are normative: restart-not-pause; speed pill scoped to listening exercises only; bars freeze under prefers-reduced-motion; autoplay only where specced.

---

## 2026-07-15 — Design-diff acceptance gate + diff-caught fixes (Claude Code)

Built after two silent artifact mismatches (progress bar green-not-gold, 14px-not-4px) passed a
screenshot-only check. Root cause: "side-by-side = acceptance" relied on the eye. Fix: make acceptance
a **mechanical computed-style diff**.

- NEW `tools/design-diff.js` (dev-only, not an app asset / not in sw.js): `designDiff(artifactUrl, pairs)`
  loads a `design/` artifact in a theme-matched iframe and diffs computed styles of mapped element pairs
  vs the live app. `DESIGN_PAIRS` records the artifact→app selector map for correctFeedback + correctionSheet.
  Theme parity via srcdoc parse-time injection (a Chromium bug leaves descendant `var(--token)` used-values
  stale when data-theme is toggled post-paint — pre-injection sidesteps it). Container-independent property
  set; width/height treated as advisory.
- Design system §5 rewritten: acceptance = map every element the artifact draws → run the diff → triage
  each row into build-miss (fix) / shared-component stand-in (leave global) / intentional divergence (flag
  to chat) → *then* screenshot. Screenshot-only is never acceptance.
- **Diff-caught fixes (build misses):** correct-answer tick 18px→16px (`lesson.js`); `.corr-audio` stray
  UA button padding → `padding:0` (`styles.css`).
- **Flagged for decision — all three now RESOLVED:**
  - **Global `.btn` had no `font-family` → every button rendered in Arial.** Tom's call: fix the font only,
    keep existing 17px/800 sizing. Done — `.btn` now `font-family: var(--font-display)` (SW v119).
  - `.pbar > i` 0.5s spring vs artifact 0.3s → **spring stays**, now sanctioned under the refined §2.2
    duration rule (value-change animations may run to 600ms). No change.
  - `.text-input` geometry vs artifacts' generic stand-in input → **app geometry wins** per the new
    shared-component precedence rule (design system). Artifacts' input was a stand-in. No change.
- SW → v118, then v119 (button font). Design system §2.2 (duration rule) + §5 (precedence) updated by Tom.

## 2026-07-15 — Correct-answer wash (§3.5), built to design/correct-feedback.html (Claude Code)

Closes the last visible-feedback gap: correct answers no longer keep the old footer.

- NEW artifact `design/correct-feedback.html` (APPROVED 2026-07-15) committed to `design/`.
- **The wash (§3.5):** on a right answer `finishGrade` adds `.qcorrect` to `#qbody` → input gets green
  border + `color-mix(green 8%, --bg-card)` fill (160ms). Progress bar advances; a gold `.answer-tick`
  (checkmark polyline, `--accent-2`) pops in beside it. Hold 650ms, then the item fades out
  (`.leaving`, opacity/translateY-6, 200ms) and `next()` swaps in — **auto-advance, no tap**. Any
  "Restored"/extra note rides as a toast. Haptic/confirm-sound deferred to Capacitor (§4.4), per artifact.
- Correction sheet (wrong path, committed 4275624) unchanged. Both feedback states now verified
  side-by-side against their `design/` artifacts in the browser.
- SW → v115.

**Remaining §6:** off-token migration (~25 hex); artifact-gated components (AudioControl §3.2, hint
popover §3.4, home hero tile §3.6) still blocked on chat design artifacts.

## 2026-07-15 — Design system build: press physics, sheets, correction-sheet pilot (Claude Code)

Built from `docs/tripfluent-design-system.md` + `design/correction-sheet.html`.

- §2.2 tokens adopted: `--shadow-press` (both dark blocks), `--t-slow` 300ms, global
  `prefers-reduced-motion`. Weight/semantic-color are rules (no token).
- Press physics (§2.1): every `:active` is push-down now (translateY; raised elements collapse the
  offset shadow to `--shadow-press`). No scale-transforms remain. NOTE: doc §3.1 still says "scale to
  0.97" — stale, §2.1 governs; reconcile the doc line.
- Dialogs (§3.3/§7): all five `confirm()` → `confirmSheet()` bottom sheet (safe action primary,
  destructive as quiet ghost).
- Correction sheet (§3.3 pilot, built to `design/correction-sheet.html`): `showCorrection()` replaces
  the wrong-answer footer — scrim over dimmed exercise, struck-through attempt, gold "The phrase"
  label, chunk pills (known = green outline + check, tappable → meaning popover), gold replay audio,
  anchor line, single Continue (scrim-tap does NOT dismiss). Shake-on-error removed. Correct answers
  keep the light footer for now.
- Font flag removed (Jakarta won): all DEV-FONT-FLAG machinery + Schibsted/Source-Serif faces gone.
- Verified in browser: confirm sheet + correction sheet render and match the artifact. SW → v114.

**Remaining §6 remediation:** run the full interactive-element inventory; AudioControl component
(unify speaker buttons + speed toggle); §3.4 tappable-text hint popovers (chunk pipeline Phase 3);
correct-answer feedback → §3.5 wash (currently still a footer); off-token audit.

## 2026-07-15 — §6 remediation: inventory + touch-target sweep (Claude Code)

Design system §6 remediation started (correction sheet, confirm sheets, press physics, font flag
already done in earlier commits).

- **Inventory triage** of the interactive surface:
  - Needs a CHAT ARTIFACT before build (§0 rule — user-facing components): **AudioControl** (§3.2 — unify
    the 8 ad-hoc audio patterns: soundIcon/waveButton/slow-btn/pb-speak/corr-audio/intro-hear/speak-btn),
    **hint popover** (§3.4, also chunk Phase 3), **home hero tile + chips** redesign. Correct-answer wash
    (§3.5) already in progress with chat.
  - Mechanical (no artifact, done/queued here): touch targets (done), off-token migration (~25 hardcoded
    hex in styles.css >L70 — mostly #fff on filled buttons + the scene-tint hues; queued).
- **Touch-target sweep (§3.1 / §6 exit criterion):** icon-btn, lang-flag-top, close-btn, pb-speak, pb-save
  now min 44×44 (centered). Tabs (~51px) and mic-btn (100px) already pass; corr-audio stays 40px to match
  the approved artifact. SW → v114.

**Remaining §6:** off-token migration; and the three artifact-gated components above (blocked on chat).

## 2026-07-15 — Design system + design-first pipeline
- NEW: `docs/tripfluent-design-system.md` — design constitution: feel principles, UI copy rules (§1.1), token rules referencing styles.css:1–61 as source of truth (§2), component standards (§3: buttons, AudioControl, sheets, tappable text/chunk pills, exercise chrome, cards), interaction rules (§4), design-first workflow (§5), remediation audit plan (§6), banned list (§7).
- NEW: `design/` directory at repo root (sibling to docs/). Approved UI artifacts live here; Code matches them exactly. First artifact committed: `design/correction-sheet.html` (v2, real tokens, light+dark, live interactions).
- Correction sheet designed and approved as the pipeline pilot (learning spec §4c.2 + design system §3.3). Implements: 300ms sheet slide + scrim, struck-through wrong answer, chunk pills with known-chunk green outline, gold audio button with push-down press, anchor line, single Continue exit (scrim-tap does not dismiss).
- Font flag decided: Plus Jakarta Sans wins. Remove dev-font-flag machinery per tripfluent-dev-font-flag.md §6 (grep DEV-FONT-FLAG).
- IN PROGRESS: remediation audit (design system §6) — inventory interactive elements, cluster into patterns, redesign per pattern. Queue after correction sheet: presentation card w/ chunk pills → AudioControl component sheet → hint popover → home hero tile + chips.
- PENDING DECISION: design system §2.2 proposed token additions (--t-slow 300ms tier, weight rules, prefers-reduced-motion, semantic-color usage rule) — adopt/reject as a block.
- NEXT: Code reads docs/tripfluent-design-system.md; build correction sheet to match design/correction-sheet.html (side-by-side comparison = acceptance); run §6 inventory; add design/ rule line to CLAUDE.md.

## 2026-07-14 — Chunk pipeline Phase 1 (learning §4b.5) (Claude Code)

Long-phrase chunking, foundation phase. Spec edit (learning-engine §4b.5 + §11.2 #10) committed.

- **Schema:** items may carry `chunks: [[es-fragment, en-meaning], …]` (tier-2/3 long phrases; optional).
- **Segmented tappable present card:** chunked items render as pills; `_chunkKnown()` marks pieces the
  learner already owns (muted) vs the new one (accented) — a long sentence reads as one new chunk on
  known material. Tap a pill = meaning reveal + chunk audio (TTS). Non-chunked items unchanged.
- **Audit (§11.2 #10):** chunks must appear verbatim in order and concatenate (normalized) to `es` —
  hard error otherwise; long tier-2/3 phrases missing chunks flagged informationally.
- **Seed content:** `chunks` authored on 4 long Spain phrases (s5-real/s5-fix). Both packs audit clean.
- Verified in browser: card renders, known/new split correct, tap-toggle reveal works. SW → v111.

**Phase 2 (next):** chunk-granularity exercises — chunk-match (rung 1), blank-a-chunk + chunk-tile build
with descending granularity (rung 2→3), whole-phrase-MC demotion rule, `chooseType` routing.
**Phase 3:** tappable hint layer across all exercises + hint-tap logging + cold-axis gating in review.
**Content pass (parallel):** author `chunks` on remaining long phrases (~6 Spain, ~8 Mexico flagged).

## 2026-07-14 — Back up scoreHistory to the cloud (Claude Code)

- **Bug:** `scoreHistory` (daily dial snapshots — the substrate for the pace tick, delta whispers,
  and §7.2 charts) was local-only: not in the sync payload, not in DEST_FIELDS. So it didn't restore
  on login/device change, and a reset silently blanked those three features until it re-accumulated
  (one row/day). Core progress (lessons/learn/sessions) was never at risk — those are backed up.
- **Fix:** `scoreHistory` added to the `p_progress` sync payload and merged back in `applyPlayer` via
  `_mergeHistory` (union by date, local wins same-day, sorted, cap 120). Now durable across reloads/devices.
  Does not retroactively recover history already lost locally; those features self-heal over ~1-2 days of use.
- SW → v110.

## 2026-07-14 — Boot hardening + small fixes (Claude Code)

- **Stuck-splash fix (root cause: mid-deploy version skew).** Boot render is now wrapped so a
  render/auth throw can never strand the splash — `runSplash()` always runs (`.finally`), with a
  fallback to `renderOnboarding()`. Diagnosed via browser repro: current code renders fine across
  fresh/returning/past-trip states; the crash was a stale cached `app.js` (`$("#gear")` null-deref)
  loading against the new `index.html`. Resolved on Tom's device by re-fetching.
- **Em dashes** removed from two rendered strings (trip-complete overlay kicker, migration-card body).
- **Onboarding date input clipping:** `type="date"` got `-webkit-appearance:none` + indicator/value
  styling so the native iOS control stops overflowing its box.
- SW → v109.

## 2026-07-14 — Reconcile build to edited §3 tab map + §1b.5 (Claude Code)

Tom edited the scores/learning-engine/xp specs; reconciled the build to match.

- **Tabs (scores §3.1):** now **Home / Learn / Progress / Profile**. Phrases dissolved as a tab and
  **folded into Learn** as a second view (Library / Phrases segmented toggle; `phrasebookBody(wrap)`
  refactored out of `renderPhrasebook`). Quests already gone.
- **Header (scores §3.2):** removed the profile icon + settings gear; flame + wordmark + language flag
  only. Flag is now a tappable destination switcher (→ `renderTrips`). Dropped the `#gear`/`#profile`
  boot listeners.
- **Profile tab (scores §3.1):** `renderProfile` is now the tab and absorbs all Settings rows (theme,
  sound, reminder, trips, group, edit profile, reset, version). `renderSettings` aliased to it. Added a
  `user` icon to the PH map.
- **Seeded items (learning §1b.5):** `seedPlacement` now seeds ladder state — `exposures: 4` (scaffold-
  ready, never presentation-carded) with the S≈7 strength — was `exposures: 1`.
- **Spec edit committed:** `docs/tripfluent-scores-mvp-spec.md` (Tom's tab-map resolution).

Pending from the same spec edits (not yet built): learning §1b.5 audit additions (weight-vs-share report
+ depth checklist in `tools/audit-pack.mjs`) and content sizing to weights; xp §6 master notifications
toggle (rides with the §6 notifications engine).

## 2026-07-14 — Scores/IA + Personalization + XP→Status (Claude Code)

Large multi-track pass. Deployed through `sw.js` `sts-v107`. Specs: `docs/tripfluent-scores-mvp-spec.md`,
`docs/tripfluent-personalization-weights-spec.md`, `docs/tripfluent-xp-to-status-migration-spec.md`.

**Built / changed**
- Lesson experience (scores spec §8): removed hearts/lives; haptics (`haptic()` in `audio.js`, web
  `navigator.vibrate` + dormant Capacitor branch); motion (card spring, drawing checkmark, shake,
  question slide-in, pace-bar overshoot, scenario tint); "Restored" moment; §8.5 exercise-variety
  rhythm (`applyRhythm` + `chooseType(opts.prefer)`).
- Personalization/intake spec (all build-order steps): `weights.js` (demand weights + modifiers +
  `effectiveWeights`); **Coverage is now strength-aware + demand-weighted** (`scoring.js`); onboarding
  asks lodging + transport (unlocks previously-dark `requires` lessons); tripType wired to modifiers;
  `seedPlacement()` wires the level quiz to entry depth; veg/GF dietary lesson (`buildDietaryLesson`);
  cut dead needs (solo/off_beaten/cities) + deleted `profile.dialect`; returning-user trip-creation
  skips account-scoped questions.
- XP→Status migration spec (client): `tiers.js` five permanent tiers + legacy XP→floor grandfather +
  migration card + tier-up moment; trip lifecycle/archive (`checkTripCompletion`, frozen departure
  record, finish-line summary, archive shelf); **XP/gems removed everywhere** (session log is the record);
  group view reworked to Readiness comparison.
- Scores spec §3 (Home & IA): Home stripped to state + action (dial cluster, smart action tile, Practice
  chooser, one divergence line); new **Learn** tab (`screen-learn.js`) hosts the relocated lesson map with
  per-category coverage + per-lesson strength rings (replaced 3-star ratings); **Quests dissolved**; dial
  polish (pace tick, delta whispers, size asymmetry); Progress consolidated (tier + trends + divergence +
  archive). §7.2 trend charts (`charts.js`): climb / rhythm / sawtooth. §5.3 returning-user seam copy.
- Earlier same day: removed all em dashes from rendered text; Spain-pack narrative parity; assorted
  lesson/phrasebook polish; emoji → `icon()`/`soundIcon()`.

**Deviations from spec (documented)**
- Tiers computed **client-side** (PWA), carried in the synced blob — spec assumed a server-side daily
  evaluator. Sustained-day tier paths therefore read only recorded `scoreHistory` (a gap breaks a run):
  conservative, never dishonest.
- Group Readiness comparison **repurposes the existing `xp` int column** to carry Readiness (server sort
  `order by xp desc` becomes the Readiness sort) — zero Supabase schema change. Pre-migration members read
  stale/dimmed until they re-sync. Tier + weekly momentum ride in synced `stats` JSON under `__score`.
- Multi-language tiers (Ambassador via 2nd language, World Citizen) are implemented but **unreachable** —
  both packs are Spanish. Two-trips-at-85 path to Ambassador works.
- Haptics no-op on iOS Safari (web `navigator.vibrate` unsupported) — intended, degrades gracefully.

**Verification**: `node --check` + served-file/sandbox extraction for all logic; `tools/audit-pack.mjs`
clean on both packs. **No live browser check this session** — worth a device pass.

**Next**
- §6 Notifications engine — mostly a Supabase **edge function** (scheduling, priority countdown>pace>
  retention>group, quiet hours, caps). Client foundation exists (`notifSnapshot()`, pace check, reminder
  settings row).
- Minor: Learn-tab search; full Profile↔Settings merge.
- Backfill: existing users have empty `profile.lodging/transport` → add a Settings editor or re-onboard
  path so their gated lessons unlock.
