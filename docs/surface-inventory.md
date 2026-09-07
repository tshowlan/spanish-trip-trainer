# Tripfluent — SURFACE INVENTORY (2026-09-08, v260)

*Every screen, exercise type, door, and sheet the learner can meet, with its artifact, the artifact's date, and one mark. Generated from the code and the design/ folder, then judged. This is the finite list behind "inconsistencies throughout": the star was ratified 2026-08-19 and the voice 2026-08-11; everything stamped before then was built to rulings the constitution has since partly superseded, and nobody went back.*

**Marks**
- **CANON** — built to a stamped artifact under the constitution (or re-ruled since the star). Consistent by construction.
- **LEGACY** — built to an artifact stamped BEFORE the voice/star (or built with no artifact). Internally consistent with its own era; needs one verdict: bring to canon · freeze as periphery · retire.
- **GAP** — a placeholder or no design at all.

Counts: **screens 17** (CANON 3 · LEGACY 11 · GAP 3) · **exercise types 30 renderers** (CANON 11 · LEGACY 17 · GAP 2) · **doors & sheets 11** (CANON 3 · LEGACY 8).

---

## A. SCREENS, in the learner's order

| # | Surface | Artifact (stamp) | Mark | Notes / the verdict to make |
|---|---|---|---|---|
| 1 | Splash / the Arrival | splash-arrival.html (7/25) | LEGACY | Stamped, loved, pre-star. Likely freeze-as-is. |
| 2 | Onboarding / intake | none | GAP | The intake fix (queued build): profile-edit screen + home city + grammar field. No artifact exists for the questionnaire itself. |
| 3 | Home (dials, hero tile, practice row) | home-action-stack.html (7/22) · nav-light (7/19) · header (7/27) | LEGACY | Tom 8/30-1: tile should read as a button; tile-vs-row balance shifted after depth. Whisper/insight lines pre-voice. |
| 4 | Score reveal (first time) | score-reveal.html (7/19) | LEGACY | Fires once. Copy pre-voice. Freeze candidate. |
| 5 | Readiness detail sheet | readiness-detail.html (7/18, no stamp) | LEGACY | The dials' explainer; copy rewritten by the voice but layout pre-star. |
| 6 | Learn tab | learn-tab.html (7/19) | LEGACY | Chapters are "packaging" per the two-track ruling; the tab still presents them as the product. Needs a re-rule against TWO TRACKS. |
| 7 | Lesson runner shell + THE FIELD | listening-family (7/25) · bottom-landscape (8/05) · lesson-breath (7/27) | LEGACY-stamped, ratified since | The field and range are law (ratified 8/05). The shell holds. Effectively canon; mark it so after one check. |
| 8 | Primer (scene → guess → reveal) | pattern-moment (7/17) · presentation-card (7/17, no stamp) | LEGACY | Tom 8/18-9: adopt the return-door/scene grammar (badges, pictures). Pre-voice copy in primers is authored content (kept). |
| 9 | Return door | return-door.html r5.5 (8/17) | CANON | But: its door grammar (photo band + badge + frame pedestal) now differs from the scene door (r24: capped solid photo + logo-face name). TWO DOOR GRAMMARS exist. Reconcile. |
| 10 | Scenes (door, beats, finale) | scene-poc.html r27.1 (9/06) | CANON | Tabled design items: narrative treatment, audio glow, description weight. |
| 11 | The Circuit (door + end) | none | GAP | Placeholder built from the structure doc's words; Tom 9/7-4. |
| 12 | Session end ceremony | session-end.html (7/21) | LEGACY | Option D shipped v166; "stamp cut" owed since July. Copy pre-voice. |
| 13 | Progress tab | none | LEGACY | 69 lines of screen; trend charts; never touched by the constitution. "Progress depth" has been on the board since July. |
| 14 | Profile / Settings (+ Test Lab) | none | LEGACY | Sync, reminders, tiers, lab. Test Lab is dev-only (fine). Intake fix lands here. |
| 15 | Phrasebook | none | LEGACY | Not in the tab bar (reachable?). Verdict: retire or fold into Learn. |
| 16 | Trips (switch destination) | none | LEGACY | Periphery by constitution (Mexico catch-up only). Freeze. |
| 17 | Quests | none | DEAD | screen-quests.js is on disk, unlinked since Quests dissolved. DELETE. |

## B. EXERCISE TYPES (the ladder: recognition → scaffolded → cold; machines native; scenes composed)

| Renderer | Type(s) | Ladder role | Artifact (stamp) | Mark | Verdict to make |
|---|---|---|---|---|---|
| renderPresent | present | teach (new phrase card) | presentation-card (7/17, no stamp) | LEGACY | Tom 8/18-9 primer/present upgrade. Keep; re-rule to scene grammar. |
| renderGrasp | grasp | recognition (word-scale MC) | ladder-beats (8/02) | LEGACY-late | Built 8/02, pre-voice by 9 days. Keep. |
| renderVariation | variation | scaffolded ("Swap one part") | ladder-beats (8/02) | LEGACY-late | Keep. |
| renderMachineDrill | machine_drill (forge + conveyor) | machine native | machine-family r6 (8/04) | LEGACY-late, ratified | Keep; effectively canon. |
| renderWeld | weld · stretch · scene welds · role-inversion | machine native / scaffolded | machine-family r6 (8/04) | CANON (re-ruled 9/03) | Keep. Tom 8/19-7: typed-weld affordance design. |
| renderExchange | exchange | machine comprehension | machine-family r6 | LEGACY-late | Tom 8/5-4 reply-experience rule still parked. |
| renderBuild | build | scaffolded (tap-to-build) | exercise-variants (7/20) | LEGACY | Keep (core ladder rung). |
| renderMC | mc_es2en | recognition, WORD-scale only | exercise-variants (7/20) | LEGACY | Phrase MC retired 7/21. Word-scale overlaps grasp. RETIRE candidate (grasp does the job). |
| renderType | type_translation | cold (the summit) | the-close (7/20) | LEGACY | Keep (the cold test lives here). |
| renderListen | listen_type | cold (ear) | listening-family (7/25) | LEGACY | Overlaps audio_cloze. Tom 8/30-6 listening rethink. |
| renderFill / renderFillTwo | fill_blank (1 or 2 blanks) | scaffolded | exercise-variants (7/20) | LEGACY | Two-blank variant undocumented in any artifact. Merge/retire candidate. |
| renderSpeak | speak_it | cold (voice) | none | LEGACY | Web Speech only; no artifact; "I can't speak" escape. Periphery — freeze or retire. |
| renderListenChoice | listen_choice | recognition (ear) | listening-family (7/25) | LEGACY | Keep. |
| renderReply | reply_listen | comprehension of a reply | listening-family | LEGACY | Overlaps exchange. Merge candidate. |
| renderReplyChat | reply | (dormant: needs replyTo authoring) | none | DEAD | Never served. DELETE. |
| renderPairs | pairs | recognition board (4 audio × 4 en) | pairs-exercise (7/20) | LEGACY | Field-collision flag open since July. Keep or retire. |
| renderClose | close · close_swap | cold (the lesson's last 2 reps) | the-close (7/20) | LEGACY | Keep; close_swap is a variant nobody named since. |
| renderLetterFill / WordFill / PhraseFill | word_fill · phrase_fill | letter rungs (scaffolded production) | letter-rungs (7/23, no stamp) | LEGACY | Tom's escalated reform (8/10-4/-5, 8/18-5, 9/7-3): bare fills out, word-in-sentence always, cognates gated (done v260). The most-hated legacy surface. |
| renderSoundChoice | sound_choice | ear discrimination | listening-family | LEGACY | D4 sequencing queued; EN-shown ruling parked. |
| renderAudioCloze | audio_cloze | ear + typed word | listening-family | LEGACY | Overlaps listen_type. |
| renderEarBuild | ear_build | ear + tiles | listening-family | LEGACY | Keep or merge with build. |
| renderChain | chain (boss dialogue) | composed (pre-scenes) | none | LEGACY | The Dinner at Rosa's chain is now duplicated by the Rosa's SCENE. RETIRE candidate (scenes supersede chains). |
| renderSpeedRound | speed round | periphery ("pure fun") | none | LEGACY | Licensed periphery. Freeze. |
| renderPrimer | primer guess | teach | pattern-moment (7/17) | LEGACY | See A8. |
| renderSceneDoor / SceneHear / SceneSign / SceneClose | scene_* | composed (the review room) | scene-poc r27.1 | CANON | read-menu queued behind design. |
| renderCircuitDoor / CircuitClose | circuit_* | review framing | none | GAP | Tom 9/7-4. |
| renderReturnDoor | return door | re-entry | return-door r5.5 | CANON | Two door grammars (see A9). |

## C. DOORS, SHEETS, RESOLUTION CHROME

| Surface | Artifact (stamp) | Mark | Notes |
|---|---|---|---|
| Practice chooser sheet (3 doors) | home-action-stack (7/22) | LEGACY | Doors re-ruled 8/05 (depth); sheet chrome pre-star. |
| Scenario chooser · machine shop chooser | none (reuse sheet) | LEGACY | Inherit the sheet. |
| Session / quit sheet | none | LEGACY | "Your progress in it is lost." |
| Correction sheet (after a miss) | correction-sheet (7/15, no stamp) | LEGACY | Tom 9/7-8: mark WHICH part was wrong (word diff is cheap). |
| Correct feedback wash | correct-feedback (7/15) | LEGACY | Fine; pre-star. |
| Resolution frame (the grown, YOURS NOW / RESTORED) | resolution-frame (7/20) | LEGACY | Copy re-voiced 8/15; layout pre-star; spacing note 8/5-6 parked. |
| Hint popover | hint-popover (7/15) | LEGACY | Rarely seen. |
| Audio control | audio-control (7/15) | LEGACY | Glyph law kept; Tom 9/7-1b glow-when-no-autoplay. |
| Toasts | none | LEGACY | Law: never carry learning content. |
| Topbar / rail / tabbar | header-beyond-home (7/27) · nav-light (7/19) | LEGACY | Stable. Freeze. |
| Tabbar glow / lighthouse | nav-light | LEGACY | Lighthouse tint item parked. |

## D. WHAT THE LIST SAYS

1. **Two generations, one app.** 3 of 17 screens and 11 of 30 renderers are canon; the learner crosses a generation seam several times per session (scene → letter rung → correction sheet → ceremony).
2. **Duplicates to retire, not polish** (each removes a surface to keep consistent): mc_es2en (grasp covers it) · reply (dead) · Quests (dead) · chain (scenes supersede it) · reply_listen vs exchange · listen_type vs audio_cloze · fill_two · speak_it (no artifact, Web Speech only) · phrasebook (unreachable).
3. **The four surfaces the learner meets most that are still legacy:** the letter rungs, the correction sheet, the session-end ceremony, and Home. Those four are where "inconsistency" is actually felt.
4. **Two door grammars** now coexist (return door r5.5 vs scene door r24). One should win.
5. **Order of consolidation, in journey order:** Home → Learn tab (re-rule under two tracks) → the lesson's legacy exercise types (retire list first, then letter rungs + correction sheet) → session end → the return door reconciled to the scene door → Circuit → Progress → Profile (intake fix lands here).

*Nothing in this file is a decision. It is the list the consolidation session rules on.*
