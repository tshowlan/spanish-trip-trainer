# Tripfluent — Design Constitution

The single canonical rulebook. Every stamped handoff's laws merge here VERBATIM at merge time —
the handoff is transport, the constitution is home. Superseded laws move to the graveyard (dated),
never silently deleted. Rendered companion: `design/specimen.html`. Machine-checkable laws are
enforced by `dev/conform.html`; the rest live on the template checklist (`design/exercise-base.html`).

Companion docs: `tripfluent-design-system.md` (component standards + workflow),
`tripfluent-content-spec.md` (copy/content), `decisions.md` (the record). Where the design-system
doc narrates, this file states only the laws.

---

## The learning constitution (north star session, ratified 2026-08-19)

### THE STAR

**Get one person ready for one trip in six weeks. The trip is the teacher.**

Duolingo's teacher is a mascot with a guilt schedule. Tripfluent's teacher is the trip itself: the deadline that paces you, the scenes that frame every phrase, the stakes that make a rep matter, the cast who answer back. The app's job is to keep the trip in the room.

**Where the best learning experiences actually come from** (Tom's question, answered honestly): a real goal with a visible clock; challenge pitched just past comfort; producing the thing, not recognizing it; and a guide who makes the material matter. Great teachers work because they carry stakes and belief, not because they're fun. This app already has all four — the countdown, the ladder, cold production, and the trip-as-guide — which is why the star is a naming, not a pivot.

---

### THE METHOD (how we take someone through)

*The tenets test what we build; the method is how we teach. Three scales.*

### How one phrase is taught (the item's journey)

Meet it in a scene before you meet it as words — the primer shows the moment, the guess comes before the reveal, so the phrase lands as the answer to a situation, not a vocabulary entry. Then the hands take over: grasp its meaning, build it from pieces, watch the frame vary so the pattern shows itself, and type it cold — the summit, because retrieval under mild pressure is what writes it in. The scaffolds dissolve as competence shows (tiles give way to the keyboard); misses move the ladder, never punish. And the phrase never retires: it comes back in exchanges, welds into new company, and appears in the review room next to phrases it will really stand beside in Spain. A phrase is DONE when it shows up beside strangers and still comes out cold.

### How one session is shaped (the six minutes)

A session is one breath: arrive through a door that says where you are and why now; climb — each beat slightly harder or newer than the last; the middle weaves new phrases among returning ones so nothing is learned in isolation; the lap runs today's material once more at speed; the close bows out doing the thing; the ceremony shows what actually moved. Sequence is the app's, pace is the learner's, and the session never asks for more than it said it would.

### How six weeks moves a person (the arc)

**Week by week, the mix tilts.** Early: survival essentials first, then scenario waves in demand order — mostly MEETING new phrases. Middle: the machines arrive and multiply what a person can say (seven frames × everything they've learned); learning and composing run side by side. Late: **the tilt inverts** — the review room's share grows as the countdown falls, until the final week is mostly REHEARSAL: composed stretches of the actual trip, run end to end, everything the person owns arranged in the day-shapes they'll live. The countdown doesn't just pace the person; it changes what kind of app this is as the date approaches. Six weeks out, Tripfluent is a teacher. One week out, it's a training camp.

---

### THE SIX TENETS (each with its test)

1. **THE TRIP IS THE TEACHER.** Every feature, screen, and line must trace to a moment on the trip. *The moment test: name the Spain moment this serves. Can't name it → periphery or cut.*
2. **PRODUCTION IS THE PROOF.** A phrase is learned when it's produced cold; recognition exists only as the road to production. *The cold test: does this rep move the item toward cold production? A feature that adds recognition without a path up the ladder fails.*
3. **DEPTH BEATS BREADTH.** Fewer phrases at automaticity over more phrases at familiarity; the demand weights decide what's in. *The automaticity test: would we rather the user own this phrase colder, or meet a new one? Default to colder.*
4. **CELEBRATION, NEVER MANIPULATION** (the unwritten line, written). Reward marks real progress after the fact; nothing is engineered to create anxiety, obligation, or a return-loop. *The manipulation test: does this mechanic inform the user about their readiness, or induce behavior by feeling? Would we keep it if it didn't increase opens? Both answers must be the honest one.*
5. **QUIET UNTIL USEFUL.** The app speaks only when it has something true to say about readiness. *The usefulness test: does this message tell the user something about being ready for the trip? "You've opened the app 5 days straight" fails (it's about the app). "Your essentials are drilled; 12 days out" passes (it's about the trip).* — This settles the compliment-push class permanently.
6. **SYNTHESIS IS THE SUMMIT.** Lessons teach pieces; competence is pieces composing. The review room is where phrases from different lessons meet, and it is designed as the app's highest experience, not its maintenance closet. *The composition test: does the learner ever use this phrase NEXT TO phrases it will really stand next to in Spain?*

---

### THE OPEN QUESTIONS, RULED

**1. The teacher.** No persona, no narrator — ruled and kept. The teacher's functions are distributed: stakes live in the countdown and the voice; scenes live in the primers; warmth and being-known live in the CAST and the personalization (your destination, your dates, your dietary lines). Where more warmth is wanted, the answer is MORE CAST (Marina, Núria, Sra. Rosa appearing across more surfaces), never a mascot. *The cheap probe first: extend the cast into review framing before inventing anything.*

**2. Bridging.** Yes — and it has a home: **the review room** (see the first build). Lessons stay islands on purpose (focused, scoped); the review room is where the map assembles.

**3. The AI boundary.** **The engine composes; it never invents.** At runtime, everything the learner sees or hears is authored atoms combined under authored guards (the composer's tags, the reply sets, the variants field) — the broken-Spanish precedent stands as the reason. AI-GENERATED content is legal only at AUTHORING TIME, entering the same human pipeline as everything else (drafts for Tom's review, never straight to the learner). The pipe-dream stress test (novel sentences from everything due) is buildable INSIDE this boundary: compose authored frames + legal welds + banked replies into new sequences — new arrangements, never new Spanish.

**4. Teaching the structure.** Name it once, then let it work. Each named mechanism gets ONE introduction line at first meeting, in the voice ("Your first machine: one frame, many asks."), and nothing else — no tour, no manual, no methodology screen. Named because a method you can name is a method you trust; once because explanation is clutter after the first use.

---

### CORE / PERIPHERY / FROZEN

**CORE (the star's body):** the Spain pack · countdown + readiness + pace · the ladder + the machines + depth practice · the review room · the two doors and the ceremonies · the voice · the field.

**PERIPHERY, KEPT CHEAP (earns its place, never grows expensive):** the speed round ("pure fun, advances nothing" is its license) · the tiers (Ambassador/World Citizen serve the repeat-trip arc; quiet, milestone-driven, already decay-test clean) · group readiness (cheap, social proof for the trip) · Mexico (catch-up passes only, already ruled).

**FROZEN pending the moment test (Tom's call):** the Fluent pass — if it can't name its trip moment, it waits. Nothing else builds on it until it passes.

**DEAD by tenet:** the consecutive-days compliment push (fails tenet 5's usefulness test — it's about the app, not the trip). Any future streak-adjacent mechanic dies the same way.

---

### THE FIRST BUILD: THE SCENES (the review room's full form — Tom's ruling, 2026-08-19)

**Review sessions are SCENES: short authored micro-stories set in real Spain moments, starring the cast, where the learner's due items ARE the story's beats.** This is the answer to the disjointed review and the orphan exercises in one move — Dígame and Que aproveche stop floating because they are SCENE GLUE: every atmospheric phrase gets authored scene-homes (dígame when the shopkeeper turns to you; que aproveche as you leave the table), and the scene is where they finally mean something.

**The spine (Pixar's, worn lightly).** Every scene runs: EVERY DAY (the setting, one visual line: "Morning rush at Bar Paloma. The marble counter is cold; Marina is fast.") → UNTIL ONE DAY (the disruption: the card machine dies, the last table is taken, Sra. Rosa waves you over) → BECAUSE OF THAT (2-4 beats of the learner DOING: asking, ordering, handling it — each beat an exercise serving a due item) → UNTIL FINALLY (the resolution + the human moment: the cuenta comes, que aproveche follows you out, Marina knows your order). Setup and resolution are authored; the middle beats are slots.

**The authoring shape (the AI boundary holds).** A scene is an authored template: setting + cast + spine + ITEM SLOTS typed by category and machine + glue lines. The engine composes which due items ride which slots — new arrangements, never new Spanish. One scene serves many due-sets; 2-4 scenes per scenario category to start.

**The writing bar:** **THE JEALOUSY TEST** — would someone reading this scene wish it had happened to them? Plus brevity law: max TWO framing lines per beat, visual wording (things you can see and touch: marble, the cortado sliding over), all voice laws hold.

**The door:** THE WINDOW (ruled at the POC, 2026-08-19) — a framed full photograph: skinny mitered maple frame, white mat flush inside, the whole photo in the window; below it the scene's name, the setting line, and the opening stanza; one CTA into the morning.

**The scene laws (minted at the POC, all Tom-ratified):**
- **THE STANZA FORM**: framing prose renders one short line per sentence with air between, haiku-adjacent, never a paragraph block.
- **THE CAST IS MET IN LESSONS FIRST**: scenes only star characters the learner knows; unknowns stay anonymous ("the woman with the crossword") until a lesson introduces them. First names only.
- **THE OVERHEARD LINE**: one heard-only line per scene may foreshadow other content and deepen the cast (the local asking Marina "¿Tocas esta noche?").
- **NARRATIVE CUES REACH LESSONS TOO**: any exercise cue may carry one diegetic line ("Marina waits · Ask what the cortado costs") — the weld is the real ask, a named person waiting.
- The jealousy test, the two-line brevity law, full sentences, and all voice laws hold in scene prose.

---

### THE STRUCTURAL RULING: TWO TRACKS

**Learn is the acquisition track; Scenes is the living track.** Chapters stay visible where phrases are MET (the ladder needs scoped islands), but chapters are packaging, not the product: chapter 3 is never revisited as chapter 3 — its phrases graduate into scenes and live there. THE TILT runs between the tracks: early weeks are mostly Learn, late weeks mostly Scenes, the final week almost entirely rehearsal in scene form. **The machines were the first step of this ruling already**: they never belonged to chapters, and scenes are largely machine operations in sequence — the machines are the grammar, the scenes are the sentences. Every future content decision asks: does this teach a piece (Learn) or compose the pieces (Scenes)?


---

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
- **Tray ruling — base letters only (2026-07-23):** a letter tray never offers á and a side by
  side, at any scale. Tiles are base forms; the accent materializes when the right letter settles
  the slot (green sweep, the forgiveness path). Accent knowledge lives in the settle (recognition)
  and the typed rungs (production), not in tile discrimination. *(word/phrase fill, Tom's ruling)*
- **Buttons don't inherit fonts:** every tappable control sets `font-family` explicitly. Found six
  times (.btn, .choice, .word, exercise inputs, .ring-label, .dial-delta). *(cleanup passes)*

## The field (minted in the listening family, 2026-07-24)

- **The field is the exercise ground, app-wide:** the facet landscape (74 facets, three-quarter
  reach, large-outside/small-inside with sprinkles and one big pane) renders identically behind
  every exercise — ONE FIELD, ONE VOLUME. Per-type registers were rejected: the ground would pump
  between reps in a mixed session, and the ground is the fixed point. *(listening family r20)*
- **Facets never compete with words:** text zones stay facet-free or whisper-only; collisions get
  LOCAL fixes (precedent: the facet behind "Type", removed r19), never a global dimmer. *(r19)*
- **Over the field, every functional surface is opaque** — controls, inputs, choices, tiles, AND
  the unfilled portions of instruments (--solid-card / --solid-track composites; the progress
  capsule carries a 14% hairline). Only the decoration gets transparency. *(r17-r19)*
- **The field reaches both shores:** the one persistent field node grows full-bleed; the
  shipped 74 facets keep their exact 555px top box, untouched; THE RANGE is bottom-anchored
  geometry inside the same node (svg.range, 390x245, height 33% [tune]). Exercises slide over
  it; dense screens bury it; sparse screens reveal it; it enters, slides, and fades WITH the
  runner shell as one surface and never receives its own choreography. The top register's
  facets fade out across the zone where the peaks rise — an overlap, never a seam. Runners
  only; home keeps its own atmosphere. *(bottom landscape r11, 2026-08-04)*
- **The runner claims min-height 100dvh:** the range grounds at the true screen bottom;
  fixed-frame artifacts imply it, the build states it. *(v230 build note, ratified 2026-08-05)*
- **The range speaks the facet tongue:** every shape is a triangle plane — stacked massifs,
  two tonal depths, outlier stones in the sky, and the forest as facets (discrete triangle
  trees, hand-scattered, no three collinear; large in the valleys, small and dim up the
  faces). No serration, no rectangles, no straight horizontals. The light falls on the
  mountain: two faces wear faint washes from the field's own gradient defs, riding the
  lightgroup so the clock rests them at night. Flat fills throughout. *(r11)*
- **The landscape tracks the sun, not the theme:** the light layer (six blazing shards, seven
  gradient panes — light IN the triangles) follows the LOCAL CLOCK in both themes; daylight
  window [tune], evaluated at session start, never mid-session. At night the app's light rests
  in the instruments. No direction vector ever; static always. *(r16-r22)*

## The listening family (minted 2026-07-24)

- **Sound is the centerpiece:** audio-content exercises give the AudioControl a hero SIZE VARIANT
  (64px, same anatomy, scaled never restyled), centered, speed chip adjacent, replay hint below.
  *(listening family, item 7)*
- **The ear never loses the answer:** every listening resolution reveals the played es (the
  played-line: display-scale text + replayable 36px control), correct or missed — es-always-reveals
  at its limit case: the learner never SAW the answer, so the reveal is the weld. *(item 5)*
- **One correction surface per miss:** the in-place reveal where it exists, the sheet only
  where nothing else reveals. Reveal carriers (no-repeat governs): listen_choice + listen_type
  carry the PLAYED-LINE (their es was never on screen); sound_choice's CORRECT OPTION carries it
  (wash + replayable — its options are already es, a played-line would duplicate); audio_cloze's
  fill-in-place settle and ear_build's assembled-line settle ARE the reveal, nothing added.
  *(ruling 2026-07-24; family-wide 2026-07-25)*
- **Distractor axes:** ear-discrimination distractors are sound-neighbors by design (minimal pairs
  are the ear's whole job); meaning-pick distractors are meaning-neighbors never — the paraphrase
  ban applies where meaning is the axis. *(the distractor nuance)*
- **Escapes are whispers in the exit zone; persistence is system:** an in-the-moment inability
  ("I can't listen right now", 12.5/500 dim, softened underline, above Continue) is answered where
  it happens and remembered where it belongs (session flag + sibling swaps + menu reset). *(r4-r5)*

## Data integrity (the vault laws, minted by the sync saga, 2026-07-26)

- **Restore is atomic-or-fail:** login either fully restores or throws loudly; a failed read
  is never optional. *(the silent-skip restore)*
- **The vault mapping is write-once:** an account can never be silently rebound to a fresh
  empty identity. *(the two-identity split)*
- **No read, no write:** a device that has not successfully pulled this session may never push.
  *(the hydration invariant)*
- **Boot pulls before it pushes.** *(the boot ambush)*
- **Never re-push what you already pushed:** pushes are signature-gated; an idle instance's
  farewell push is a no-op. *(the final assassin)*
- **The build stamp lives beside the SW version** (`vNNN · vNNN` on the splash): the executing
  code identifies itself; caches never speak for it. *(the lying version line)*
- **"Received N / kept N" is a trust instrument, not scaffolding:** the Settings restore X-ray
  stays permanently — quiet, but present — in a product whose promise is "your effort is safe."

## Device rendering (the luminous rule-set, minted by the arrival's five device catches, 2026-07-26)

- **Never animate transforms on elements whose resting transform does layout work**
  (translateX centering etc.); their formations are opacity-only. The ceremony's precedent
  now binds both doors and all future choreography. *(the beached nav pill)*
- **Chained enter/exit pairs: the exit fills forwards only** — backwards fill pre-lights
  the element at t=0. *(the pre-lit eclipse orb)*
- **Glows are LAYERS, never filters** — iOS clips drop-shadow paint regions at a straight
  edge; desktop review cannot see it. *(the line above the lighthouse)*
- **Low-alpha gradients over black: eased multi-stop falloffs + a ~5% noise dither [tune]** —
  hard stops draw rims on OLED. *(the banding ellipses)*
- **Radial glows size with closest-side:** the fade completes inside its own box; fixed
  percentages clip at container edges. *(the halo's top edge)*
- **Process: anything luminous gets a DEVICE SCREENSHOT before the stamp.** Desktop review
  cannot see banding, filter clipping, or fill timing on the medium the door opens on.

## Motion

- **Light turns on; it never travels on:** ignitions animate intensity, never geometry — scaling
  a gradient layer parades its falloff edge across the screen. *(the arrival's relight, minted by
  the vertical-line catch)*
- **The two doors share one meter:** session-end and the cold-open arrival use the same refill
  grammar (photo's beat → anchor → world → whisper last), pointed in opposite directions.
  Deviations (the arrival's trimmed photo-hold, dials-at-fade-completion) are arrival-specific
  rulings, not new grammars. *(the arrival)*
- **The splash is a curtain:** the one surface where scene is legal; even curtains stay static
  (no ambient motion). *(the arrival)*

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

## The rail (the header beyond home, minted 2026-07-26)

- **The screens own their titles:** section identity lives in content (24/700 tabtitle),
  never in the chrome bar; the bar above the work is an instrument margin, not a header.
- **The rail's two constants:** the wordmark (identity) and the flame (the pilot light) —
  nothing else rides the bar beyond home; everything contextual lives in content. The chip
  is home-only; runners wear no rail at all (the field is identity).

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

## The voice (minted by the voice session, 2026-08-11)

**The register in one line: direct, utilitarian, wry. The humor is in the situation, never in the phrasing.**

1. **THE LITERAL LAW.** Every word means exactly what it says. No metaphors, euphemisms, or
   figurative dress ("the jacket off", "the polish", "before the tapas land"). If a word is not
   literally true, cut it. The wit comes from real stakes plainly named, not from clever wrapping.
   Clarified at calibration (Tom's 1918 door handle): WORDS stay literal, but the SCENE may
   exaggerate for comedy as long as it stays picturable.
2. **FULL SENTENCES OR PLAIN IMPERATIVES.** No reverent fragments ("No text. Just your ear." /
   "All yours.") and no comma-splice appositives ("One machine, drilled full"). If a line drops
   its verb to sound weighty, it fails.
3. **THE STAKES LAW (where humor lives).** Jokes are concrete travel outcomes: the wrong dish,
   the wrong door, the change that comes back short. If a joke would work in any app, it dies.
   "You almost ordered a chicken instead of a croissant" is the model.
4. **SERVE, DON'T DIGNIFY.** A line must tell the user something useful: what to do, what
   happens, what it costs, what it buys. Lines that exist to make a moment feel meaningful die
   ("This one travels with you." / "It's on your profile now, for good.").
5. **THE QUIET DIALS.** Instruments speak in numbers and mechanics, no personality ("One session
   adds about 4."). The humor lives in teaching moments only: notes, primers, the return door,
   the practice framing.

**THE ORDER TEST (the checkable gate, sibling of the decay test).** For any rendered line ask:
(a) is every word literal? (b) is it a full sentence or plain imperative? (c) does it inform, or
only dignify? (d) if it is funny, is the joke a real Spain outcome? Any failure blocks the line.

**The carve-out:** allergy, medical, and emergency content NEVER gets jokes. Straight talk only
("Sin gluten was fading. That one is not optional.").

**The three moves** (Tom's calibration, in strength order, for writing new stakes lines):
1. **SPECIFIC BEATS SEVERE**: tiny stakes are fine if the image is vivid ("manhandling a door
   handle from 1918" beats any lecture about embarrassment).
2. **THE CONTRAST MOVE**: what you'd get vs what you wanted ("a tour of the train depot, not the
   Picasso exhibit").
3. **AFFECTION IS ALLOWED**: some lines celebrate what the phrase buys, not what missing it costs
   ("what's lunch without a second round?").

**Retired vocabulary:** "filling" (euphemism, Tom 2026-08-11) — the variation label is "Swap one
part"; the machine framing is "One frame. Many asks." The metaphor-vocabulary law's word list
updates: machines, frames, slots, patterns, asks.

## Replies (heard-only content, minted with the exchange reply-sets, 2026-07-28)

- **Replies are heard-only:** never production targets, never SRS items, no homes. The
  taught-once law does not apply to them — but where a reply IS a taught item, the reuseId
  welds it (one recording, one string, the spiral audible).
- **Targets decode from taught anchors:** heard-content words beyond the curriculum are legal
  in replies ONLY when the target never depends on them (lejos carries the meaning; mejor is
  atmosphere).
- **Number options: taught numbers only.** Price distractors may be digit-swaps of the correct
  answer (ear discrimination on numbers is sound-neighbor-legal).
- **Every machine keeps a no:** each reply-set holds a negative reply (no queda · no hay) —
  Spain sometimes says no, and the learner should survive it.

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

## The breath (lesson sequencing, minted Sprint 2, 2026-07-27)

- **Universal Continue:** every exercise resolution, every family, ends in the learner-paced
  Continue, live from first paint. The voice finishing gates nothing — advance-on-TTS is the
  graveyarded auto-advance, and its socket stays removed from `speak()`. *(Sprint 2 ruling 1)*
- **The slide:** exercise-to-exercise transitions travel the content only — outgoing slides
  40px left + fades (200ms), incoming enters from the right (260ms, system curve). THE FIELD
  NEVER MOVES: the ground is the fixed point; the work travels across it. Horizontal is the
  lesson's progress axis (authored transitions, not gestures — the one-axis law governs
  fingers). Reduced motion: crossfade. *(Sprint 2 ruling 2)*
- **The intro ladder:** a new item's first lesson runs Present → Grasp (word-scale MC) →
  Build (tiles) → Variation (the frame swaps one chunk) → Produce (typed cold, forgiving
  maturation). The order is fixed on first exposure; expertise reversal governs after.
  *(Sprint 2 ruling 3)*
- **MC is word-scale, 3 options, only:** phrase-scale MC and 4-option MC are retired —
  scan-reading is not recognition. Phrase recognition lives in the listening family, pairs,
  and the reply. *(Sprint 2 ruling 4, Tom's inversion)*
- **Glue words are never targets:** no exercise targets a bare function word; glue is tested
  where it lives — the blank, the build, the weld. *(Sprint 2 ruling 5)*
- **The machine drills are the conveyor and the exchange:** conveyor = one mounted frame,
  streamed meaning-cues, the learner fills the slot every rep — production, zero options; the
  composer guard's tag table defines the legal stream. Exchange = the learner produces the
  ask, the typical reply plays through current listening truth, and the rep resolves on
  comprehension of the ANSWER — the answer is the exercise. *(Sprint 2 ruling 6)*
- **The encore, then the close:** the lesson's penultimate phase replays every item taught
  this lesson once, production form, brisk (~90s cap [tune]); the close remains the ending —
  completion copy lives in its resolution kicker, never on a placard. No done screens exist.
  *(Sprint 2 rulings 7-8)*
- **The cue grammar:** a production cue = micro-caps label (11/600 dim) + the MEANING at
  content scale (17/600 text) — the cue is the en-side of the rep, never chrome. Minted on the
  Variation; the conveyor's cue adopts it at build time. *(ladder-beats r1)*
- **Arc misses don't re-queue:** the arc's remaining beats are the retest; the Present card
  never re-serves (re-teaching reads as punishment — rung-down's floor is recognition); a
  missed summit is absorbed by the encore, served scaffolded. *(Sprint 2 miss ruling, c+)*
- **The machine arc:** machine lessons run FORGE-PRESENT (one screen: the machine meets you
  like a new phrase - meaning, use, voice - and the BUILD is the active confirmation) →
  CONVEYOR → EXCHANGE → close. No present cards in machine lessons; the frame's taught-moment
  is the fuse, each filler's is its first conveyor serve. Short frames forge at letter scale.
  *(machine restructure ruling, 2026-08-02)*
- **The new-mark:** first-meeting words settle in (the formation's quiet rise, 300ms) and
  speak once, then wear DOTTED GOLD (never confusable with the slot's solid gold) with
  tap-to-check (inline gloss chip; taps are uncertainty telemetry). The mark clears after the
  item's first successful production [tune]. A settled-correct word's slot line is SOLID
  green, always - green never hedges. *(new-mark ruling + Tom's semi-correct catch, 2026-08-02)*
- **The input climbs by expertise:** first exposure summits the ITEM at typed cold; the
  machine drills stay at tray. Full cold frame production is an expertise rung — the conveyor
  and the close swap tiles for the keyboard as exposures accrue (threshold [tune], shared
  with the letter rungs). The lesson's shape never changes; only the input hardens.
  *(Sprint 2 ruling 9)*

## Anti-drift (minted by the machine-family session, 2026-08-03 — consistency inherited, not achieved)

- **The shell is issued, not assembled:** every design session starts by copying
  artifact-shell.html from the chat-design-pack — fonts at the app's full weights (Jakarta
  400-800, Inter 400-600), live styles.css embedded, phone frame + field + chrome + caption +
  state harness + build stamp, all pre-wired. The ritual script regenerates it. (The old base
  loaded fonts only to 700; every past artifact synthesized its boldest weight.)
- **Resting states are shipped markup:** any state a screen can rest in is verbatim DOM-export
  markup or composed purely of shipped classes. Custom CSS may exist only for TRANSIT, and
  nothing hand-styled survives a landing.
- **No invented screens:** canvases contain only real states; connective tissue between states
  is the real next state, never a placeholder.
- **The build stamp law:** every artifact renders its build number visibly in the chrome;
  stamp and filename bump together.
- **The structure check:** before presenting, chat diffs the artifact's per-state class
  patterns against the DOM export and live styles.css; classes used but undefined (or defined
  but misapplied) block the presentation.
- **Verification declares its limits:** chat's checker reads structure and logic, not pixels.
  Every verification report states what was NOT checked; anything visual needs Tom's eye (or a
  device screenshot, per the luminous law) before a stamp.

## Process laws (how laws are made)

- **When every component is proven innocent, instrument the crime scene:** on-device X-ray
  before theory-driven fixes. Sibling of verify-by-position and the luminous-screenshot rule —
  all three are one truth: THE ARTIFACT OF PROOF MUST LIVE WHERE THE FAILURE LIVES. *(the
  vault saga, 2026-07-26)*

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

- 2026-07-24 — The silhouette and bubble stage options (listening family r5-r11, retired r12 by
  Tom's elimination; the silhouette's structure-preview idea may return as exercise content, not ground).
- 2026-07-24 — The register concept (per-type field volumes, killed by Tom's "what's the point of
  the register?" — the ground never pumps between reps).
- 2026-07-24 — "Can't tell, skip" (listen & type's per-rep skip): the whisper escape covers
  modality, the honest miss + rung-down covers difficulty; a skip denied the engine its signal.
- 2026-08-06 — The in-lesson machine encore (flow ruling 8/03) retires under depth ruling 2:
  lap 2 + the stretch absorbed its function; the encore FORM re-homes at the return door's
  "Run the lap." Superseded, not deleted.

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
