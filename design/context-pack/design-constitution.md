# Tripfluent — Design Constitution

The single canonical rulebook. Every stamped handoff's laws merge here VERBATIM at merge time —
the handoff is transport, the constitution is home. Superseded laws move to the graveyard (dated),
never silently deleted. Rendered companion: `design/specimen.html`. Machine-checkable laws are
enforced by `dev/conform.html`; the rest live on the template checklist (`design/exercise-base.html`).

Companion docs: `tripfluent-design-system.md` (component standards + workflow),
`tripfluent-content-spec.md` (copy/content), `decisions.md` (the record). Where the design-system
doc narrates, this file states only the laws.

---

## Color & light

- **Gold is the app's light.** Gold marks what is lit / current / alive: the flame, audio glyphs,
  the pace tick, NEW material, kickers, the active nav tab, the crown. *(2026-07-16)*
- **Gold pairing:** `--accent` (bright) = fills/highlights; `--accent-2` (deep) = text/numbers on
  cream. A pair, never interchangeable. Accent-2 reads brown at hairline scale on light — dark
  gold is for glyphs, never thin lines; attention lines use `--accent`. *(letter rungs r5: the
  next-slot underline)*
- **Blue** marks interactive/secondary + the Strong band. **Green = success only, app-wide.**
- **Slot color law:** blue only on things you can tap. The canonical blank is blue because it IS
  the tap target; letter slots are not individually interactive, so pending slots are neutral dim
  structure and only the NEXT slot wears bright accent. *(letter rungs r4)*
- **Glyph color law:** the audio control pairs high-contrast, never tone-on-tone — dark-on-gold and
  gold-on-dark both legal; gold-on-gold (and dark-on-dark) never. The BUILT AudioControl (dark
  circle, gold glyph) is canonical; flat cards carry gold glyphs. No state-based glyph color:
  playing = the bars animate. *(glyph-law rider, 2026-07-20)*
- **Objects carry the app's light:** urgency brightens the object itself (the ember); spill is
  consequence, not the message. *(home action stack)*
- **Ledger color:** gold = what arrived (intake), green = what you did (achievement). Intake is
  never graded as victory. *(session end)*
- **Halo rule:** a mark on a light ground (wordmark over photo) uses standard brand colors in both
  themes; no halo → theme tokens. *(2026-07-16)*
- **Mask-don't-paint:** surfaces fading over gradient grounds fade via mask/transparency, never by
  painting toward a background color. *(2026-07-16)*
- **Dual dark blocks:** every dark token/rule exists twice (`prefers-color-scheme` +
  `[data-theme="dark"]`) or the themes drift.

## Elevation & physics

- **The press is a push-down, never a scale:** raised elements sit proud (`--shadow: 0 3px 0`),
  press = translateY(2px) + shadow collapse to `--shadow-press`. Every raised interactive element.
- **Raised = pressable.** The elevation law operates on its own axis, separate from color
  quietness: live tray keys are bg-card WITH the shadow, flattening only when spent. *(letter
  rungs r6/r7 — the supply-rule correction)*
- **Supply rule:** supplies present quiet, spent supply recedes (0.28, flat), and the language
  lights where it lives (the settled letter/word + sweep). Sister differentiation between supply
  kinds is SCALE + MECHANICS (word-tiles relocate; letter-keys deposit and stay behind), never
  polarity. *(letter rungs)*
- **Buttons don't inherit fonts:** every tappable control sets `font-family` explicitly. Found six
  times (.btn, .choice, .word, exercise inputs, .ring-label, .dial-delta). *(cleanup passes)*

## Motion

- **Motion explains, never decorates.** Zero ambient/idle animation.
- **Entrance motion is the quiet pop** (fade + small rise). Overshoot/bounce is spring physics
  from the playful dialect — banned from the calm vocabulary. Liveliness comes from sequencing,
  never jiggle. *(session-end r17)*
- **Sequential composes, simultaneous shuffles:** elements expressing one idea take turns in
  legible order (the pairs reunion). *(exercise batch)*
- **Urgency announces itself once; it never loops.** Motion marks the event (threshold crossed),
  never the state. *(home action stack — the arrival breath)*
- **One-time celebratory motion is sanctioned only when it explains a state change** (the crown
  sheen on a band crossing). Looping versions stay banned.
- **The ceremony consumes the animation budget:** a performed dial is never re-animated on
  arrival. Post-session home renders settled; cold opens keep the load-in fill. *(session end)*
- **The dials are the fixed point; worlds change around them.** Any ceremony conforms to home's
  dial positions, never the reverse. *(session end, Option D)*
- **Skip affordances snap to the final truthful state before exiting** — skipping loses waiting,
  never information. *(session-end r18)*
- Reduced motion: instant final states, no staggers, no sweeps — every motion law carries this.

## Type

- **Type split:** display font (Plus Jakarta Sans) for headings, phrases, buttons, labels, and ALL
  display-scale text regardless of language; Inter for small supporting lines (13px translations,
  sub-hints, captions). The split is scale-based, not language-based. *(cleanup passes)*
- **Weight tiers:** 600 control labels · 700 headings · 800 reserved for micro-labels under 12px.
  *(action-stack rulings)*
- **No common ligatures in UI text:** the fi ligature ate wifi's dot — learners must see letters,
  not glyph fusions. `font-variant-ligatures: no-common-ligatures` app-wide. *(cleanup passes)*
- **The tile grows through space, not volume:** presence is generosity of room, never size of
  voice, on control surfaces. *(home action stack)*
- Large es is reserved for centerpiece surfaces (the resolution frame's fused line, 22/600); the
  grown is a footnote zone — identical 13px line treatment regardless of language. *(exercise batch)*

## Spacing & layout

- **Uniform spacing is measured visually, text to text** — never by matching margin values.
  *(exercise batch — the ear-build padding stack)*
- **Adjacent reveal, bottom Continue:** the grown sits directly below the work; Continue anchors
  to the thumb zone.
- **Frame-relative values never copy literally:** an artifact's max-width inside its 390px frame
  is a demo value; builds derive from content width. *(ceremony Continue)*
- Artifacts mock at 390px so px transfer 1:1. Future artifacts adopt the `--space`/`--text` scales
  [pencil].

## Settle & transfer dialects

- **Fusion = becoming a sentence** (assembled pieces dissolve chrome into one line, 22/600).
  **Pressed-in = discrete objects reaching done** (border kept, elevation gone, surface sunken).
  Never mixed on one surface. *(pairs r4)*
- **The fused sentence is a centerpiece surface:** words mature to the es-reveal scale, riding the
  fusion choreography. *(Tom's harness catch)*
- **Strength ring only when exactly one item is on stage;** multi-item boards use a collective
  whisper ("4 stronger"). *(pairs r5)*

## Copy laws

- **No em dashes in UI copy.** Colon, period, or parentheses. *(standing)*
- **Buttons are verbs; labels are nouns.** No exclamation points outside reward lines.
- **If the data can only mean one thing, don't caption the meaning.** *(2026-07-16)*
- **The decay test:** milestone copy names events or possession, never capability. Fading can't
  falsify "soloed" or "yours"; it falsifies "mastered." The brand word stays reserved.
  *(session end)*
- **If a name needs a footnote, the name failed:** fix the name, never add the footnote.
  *(session end — "soloed")*
- **Duration is a promise, never a report:** cost-before is information a chooser deserves; time-
  after is scorekeeping and grind-bait. *(action-stack rulings)*
- **Metaphor vocabulary is closed:** machines, fillers, slots, patterns. New metaphor words are a
  design decision, never a copywriting accident. *(the close — "cargo" retired)*
- **The grammar rule:** the tile is a verb (tap = start), the row is a menu (tap = choose);
  contents never swap across interaction grammars. *(home action stack)*
- **Toasts never carry learning content;** anything worth reading never auto-dismisses. *(toast
  retirement)*
- **Recommends, never threatens** (the standing copy guardrail); no capability claims about the
  learner's current state in primers.

## Resolution vocabulary

- **One resolution language:** every correct answer matures the page IN PLACE — fusion/settle,
  green sweep under the learner's own work, es always reveals (sound welded to spelling), en +
  audio materialize, strength ring ticks with "Stronger," tray recedes. Sheets are reserved for
  the miss. *(resolution frame)*
- **No-repeat:** each string appears once, in whichever language the screen doesn't already hold;
  the grown carries only what's missing. A completed-in-place sentence IS the es reveal.
  *(exercise batch)*
- **Kicker precedence:** one kicker per resolution; milestone beats event (YOURS NOW > RESTORED).
- **Forgiveness is silent:** what we accept, we accept fully — no accepted-with-asterisk patterns.
  The always-on es-reveal is the passive correction; typed input matures to canonical form.
  *(toast retirement; the close)*
- **Forgiveness at the blank:** a accepted where á is wanted; the slot settles the accent.
  Teaching orthography without grading it. *(letter rungs)*
- **Blanks render as dashes over ONE underline** (letter-spaced, collapsing when filled);
  underscore glyphs double the line. *(cleanup passes)*
- **Blanks are principled, never random:** the learner's logged traps first (slips/conf telemetry),
  trap heuristics after (accents, b/v, c/qu, silent h, vowel clusters), ≤40% of letters. Sibling
  of the distractor law: distractors are principled, never random (confusion pairs → same-frame
  fillers → structural twins). *(letter rungs; exercise batch)*
- **Graceful grading for fills:** completion always resolves; 0–1 wrong taps pass (slips logged
  silently), 2+ score a miss while completing in place. The exercise never dead-ends. [tune]
  *(letter rungs)*

## Pacing & exits

- **The Pacing Rule:** sequence is the app's; pace is the learner's. Every moment's exit is a
  learner action. Authored motion within a moment is legal; spending the learner's time without
  the ending tap is not. *(2026-07-19)*
- **The exit must be on screen:** a tap the learner has but can't see isn't an exit (the
  resolution frame scrolls its Continue into view). *(cleanup passes)*
- **Opacity is not a state:** functional controls never dim; availability vs emphasis is spoken in
  button hierarchy (outline → filled). *(session-end r19)*
- **Expertise reversal, both directions:** scaffolds fade with demonstrated competence [tune] and
  RETURN with failure — the rung-down re-ask law: re-asks step down a rung (typed → phrase fill →
  word fill) and climb back on success. *(letter rungs)*
- **Redundancy rule:** audio and displayed text always match.
- **Sound-off rule:** every rung has an audio-free member; the composer swaps ear members for
  visual siblings when the learner can't listen. *(letter rungs)*
- **The app pans on one axis** (vertical); horizontal gestures are opt-in per surface. *(cleanup
  passes)*
- **Lesson purity:** the tile's promise IS the session's contents; cross-lesson review lives in
  Practice; restores never appear in lessons. The close's frame-swap filler is the one sanctioned
  cross-lesson touch. *(2026-07-21)*

## Process laws (how laws are made)

- **No user-facing UI ships from a text description alone** — artifact → approval → match exactly
  → mechanical diff acceptance (DESIGN_PAIRS).
- **Built components override artifact stand-ins; live styles.css wins on tokens.**
- **Precedence applies to rule-making:** review-derived rules are checked against the built
  canonical component before entering the constitution — never let a stand-in legislate.
  *(glyph-law rider)*
- **THE STAMP CUT:** working canvases are decision records; stamped artifacts are match-targets —
  cut to the decided state at stamp; history lives in handoffs + decisions.md. *(2026-07-21)*
- **DERIVE, DON'T APPROXIMATE:** sessions touching existing surfaces start from the real artifact
  (or saved DOM) + live styles.css; derivation finds are flagged back. *(2026-07-21)*
- **The handoff ritual** (every stamped handoff, in order): merge laws → constitution · update
  DESIGN_PAIRS · re-export touched bases · run the lint · reply with deltas. *(2026-07-22)*
- **Canvas-fixes-now:** build-side corrections patch the canvas immediately, not at next re-issue.
- **Duration/difficulty models are dials, not truths** [tune]; measured telemetry graduates them.

---

## Graveyard (superseded, dated — never silently deleted)

- ~~"Gold buttons carry DARK glyphs; flat cards carry GOLD glyphs"~~ — superseded 2026-07-20 by
  the high-contrast glyph law (the original described artifact stand-ins, not the built truth).
- ~~All audio glyphs in `--accent-2` gold~~ — superseded by the same rider (the built control is
  dark-circle-with-gold-glyph; gold-on-gold impossible by law, not by uniform color).
- ~~6-minute global lesson target (4–8 band)~~ — superseded 2026-07-22 by per-shape bands
  (machine 3–5 · kit 4–6 · scenario 5–8).
- ~~7-day cumulative dial deltas~~ — superseded 2026-07-21 by today-scoped, nonzero-only deltas
  (dial law).
- ~~Auto-advance at audio end (250ms buffer, 8s failsafe)~~ — superseded 2026-07-19 by the
  self-paced Continue (Pacing Rule).
- ~~Accent/typo nudge ("Almost — note the accent")~~ — killed 2026-07-19, no replacement;
  forgiveness is silent.
- ~~"You can now X" told-reward lines~~ — retired 2026-07-21; reward is mechanical, copy inverts
  to primer promises (decay test).
- ~~The veteran-timing [tune] for the ceremony~~ — retired by r18: the thumb is the expertise-
  reversal mechanism (Continue live from t=0 + snap-to-final).
