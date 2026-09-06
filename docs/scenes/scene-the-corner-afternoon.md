# SCENE · The Corner — Street · Afternoon (v1 draft, 2026-09-06)

*Wave 1, scene 3 — the role inversion: the learner is the local. Every phrase pinned and pack-known (Which way? + the honesty line).*

```yaml
id: street-afternoon-the-corner
category: directions
place: "The Corner"
time: afternoon
label: "SCENE: STREET · AFTERNOON"
end_label: "END SCENE: STREET · AFTERNOON"
photo: old-town-corner-afternoon.jpg     # GAP: sourcing — pictures session
name_face: logo                          # "The" Jakarta 800 · "Corner" Playfair italic 500
cast: []                                 # the couple is anonymous, one-off
due_mass_items: [como-llego-a-heard, hablo-solo-un-poco, todo-recto, la-segunda-calle-a-la-derecha, esta-cerca-heard, si-muy-cerca]

door:
  verse:
    - "You step out of the bakery with a bag of bread under your arm."
    - "A couple with a suitcase is looking at you like you live here."
  cta: "Step in"

beats:
  - type: role-inversion                  # their ask, heard; the learner answers across the next beats
    context: "The man pulls the suitcase to a stop."
    heard: "Perdone, ¿cómo llego a la plaza?"
    heardEn: "Excuse me, how do I get to the plaza?"
    prompt: "What does he need?"
    choices: ["The station", "The plaza*", "A taxi"]

  - type: weld
    context: "You could pretend not to understand. You don't."
    cue_label: "Be honest first"
    cue: "Tell him you only speak a little Spanish"
    build: ["hablo", "solo", "un", "poco", "de", "español"]

  - type: weld
    context: "But you know exactly where it is."
    cue_label: "Point"
    cue: "Straight ahead"
    build: ["todo", "recto"]

  - type: weld
    context: "Then the turn."
    cue_label: "Now the turn"
    cue: "The second street on the right"
    build: ["la", "segunda", "calle", "a", "la", "derecha"]

  - type: exchange-understand
    context: "She checks with you before they commit."
    heard: "¿Está cerca?"
    prompt: "What did she ask?"
    choices: ["Is it open?", "Is it close?*", "Is it far?"]

  - type: weld                            # UNTIL FINALLY
    context: "Five minutes, tops."
    cue_label: "Reassure her"
    cue: "Yes, very close"
    build: ["sí", "muy", "cerca"]

finale:
  line: "For thirty seconds, you were the one who lived here."
```
