# SCENE · Bar Paloma — Café · Morning (v1, Tom-stamped 2026-08-31)

*The first authored scene, written to the r27 format. Every phrase is PINNED (the engine picks the scene, never the pieces). This file is the template every scene copies: same fields, same order.*

```yaml
id: cafe-morning-bar-paloma
category: coffee-shop
place: Bar Paloma
time: morning
label: "SCENE: CAFÉ · MORNING"          # door line, micro-caps
end_label: "END SCENE: CAFÉ · MORNING"  # finale line, micro-caps
photo: bar-paloma-morning.jpg            # solid, bottom-fade, silver cap 2.25px light-center
name_face: logo                          # "Bar" Jakarta 800 · "Paloma" Playfair italic 500
cast: [Marina, Pau, "the regular with the crossword"]   # crossword regular = anonymous-recurring (registry)
due_mass_items: [que-le-pongo, cuanto-cuesta-frame, son-dos-con-cincuenta, a-las-diez, que-aproveche, la-cuenta-cuando-pueda]

door:
  verse:                                 # stanza form, two lines, italic
    - "The smell of roasted coffee pulls you through the doorway."
    - "Caffeine awaits."
  cta: "Step in"

beats:                                   # one context line (italic) + the ask; spine: every day → until → because → finally
  - type: exchange-understand            # EVERY DAY
    context: "Marina turns to you."
    heard: "¿Qué le pongo?"
    prompt: "What did she ask?"
    choices: ["How are you?", "What'll it be?*", "To go?"]     # * = correct
    hint: "She asks. Tap to hear it again"

  - type: weld                            # UNTIL ONE DAY
    context: "“Solo efectivo hoy” is clipped to the menu."
    cue_label: "Marina waits"
    cue: "Ask what the cortado costs"
    build: ["cuánto", "cuesta", "un", "cortado"]                # bare tiles; fuse dresses → "¿Cuánto cuesta un cortado?"

  - type: exchange-number                 # BECAUSE OF THAT
    context: "Marina answers over the grinder."
    heard: "Son dos con cincuenta"
    prompt: "How much?"
    choices: ["€5.20", "€2.50*", "€3.50"]

  - type: overheard-time                  # BECAUSE OF THAT (overheard; uncapped law, waiting moment)
    context: "You take the seat by the window. Pau leans on the counter and asks Marina, “¿Cantas esta noche?”"
    heard: "A las diez, si vienes"
    prompt: "What time did you hear?"
    choices: ["At two", "At ten*", "At twelve"]                # diez / dos / doce trap
    hint: "Her answer. Tap to hear it again"

  - type: grasp-meaning                   # BECAUSE OF THAT (glue phrase in its home)
    context: "The regular with the crossword nods at your cup and says:"
    heard: "Que aproveche"
    prompt: "What does it mean?"
    choices: ["Excuse me", "See you later", "Enjoy it*"]

  - type: weld                            # UNTIL FINALLY
    context: "Time to settle up and step into the day."
    cue_label: "Catch her eye"
    cue: "Ask for the check, politely"
    build: ["la cuenta", "cuando", "pueda"]                     # fuse → "La cuenta, cuando pueda"

finale:
  line: "Marina calls “hasta mañana” like she means it."      # italic, one line, above the ledger
```

## Laws this scene exercises (for the checker)

- Door: solid photo, bottom fade, silver cap, logo-face name, setting label, two-line verse. No window, no badge.
- Beats: one italic context line, then the ask. Cues stay roman. Spanish stays upright.
- Overheard: uncapped (1-3 per scene [tune]), in waiting moments, may be the exercise.
- Cast-met-first: Marina and Pau are registry; the crossword regular stays anonymous-recurring until a lesson names her.
- Voice: literal words, full sentences, stakes-funny where funny, safety never jokes. Jealousy test: the finale line.

## Rewrites Tom can make in place

Any `context`, `verse`, or `finale` string edits verbatim; the engine reads them as data. Heard lines and builds change only with the phrase (they're the pinned content).
