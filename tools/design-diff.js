/* design-diff.js — computed-style acceptance gate for design/ handoffs.
 *
 * WHY: design/*.html artifacts embed the real tokens verbatim (styles.css:1-61),
 * so a correctly-built element must COMPUTE to the same value as the artifact
 * element. This turns "side-by-side = acceptance" from an eyeball into a
 * mechanical property diff. It exists because two silent mismatches (progress
 * bar green-not-gold, 14px-not-4px) passed a visual check. See
 * docs/tripfluent-design-system.md §5.
 *
 * HOW TO USE (paste into the Browser-pane console, or inject via javascript_tool):
 *   1. Serve the repo (python3 -m http.server 8124) and open the app.
 *   2. Drive the app to the exact state the artifact depicts (e.g. render a
 *      correct-answer #qbody.qcorrect, or open showCorrection()).
 *   3. Theme is handled for you: the harness reads the app's effective theme
 *      (data-theme attribute, else prefers-color-scheme) and re-loads the
 *      artifact with that theme baked into <html> at parse time (via srcdoc),
 *      so themed tokens compare apples-to-apples. Just be in the theme you want.
 *   4. Run:  await designDiff('/design/correct-feedback.html', DESIGN_PAIRS.correctFeedback)
 *      Returns (and console.tables) every property that differs, per element pair.
 *
 * READING THE OUTPUT: each row is a CANDIDATE, not a verdict. Three kinds:
 *   - real build miss  -> fix the app to match the artifact (the artifact wins).
 *   - shared-component stand-in -> the artifact approximated a global component
 *     (e.g. .ex-input vs the app-wide .text-input); do NOT restyle the global
 *     from a single feedback artifact. Note it and move on.
 *   - intentional divergence -> the app deviates on purpose (e.g. the §8.3 bar
 *     spring vs the artifact's plainer transition). Flag it back to chat as a
 *     conflict to resolve; do not silently overwrite either side.
 *   `width`/left-right values are container-dependent (artifact renders in a
 *   fixed 340px phone) and excluded by default; pass {props:[...,'width']} when
 *   an element has a fixed size worth checking (grabber, audio button).
 */
(function (root) {
  // container-independent computed properties (no width/left/right — those depend
  // on the artifact's fixed phone width and would be false-positive noise).
  const DEFAULT_PROPS = [
    "height", "min-height",
    "background-color", "color",
    "border-top-width", "border-top-style", "border-top-color",
    "border-bottom-color", "border-radius",
    "box-shadow", "opacity",
    "font-family", "font-size", "font-weight", "line-height",
    "letter-spacing", "text-transform",
    "text-decoration-line", "text-decoration-color",
    "padding-top", "padding-right", "padding-bottom", "padding-left",
    "gap", "transition-duration",
  ];

  async function designDiff(artifactUrl, pairs, opts) {
    opts = opts || {};
    const props = opts.props || DEFAULT_PROPS;
    // Effective theme: the app may switch via a data-theme attribute OR via
    // prefers-color-scheme. Artifacts only carry dark tokens under
    // [data-theme="dark"], so translate the app's effective theme into the
    // attribute the artifact understands, or every themed token reads as a
    // false mismatch (light artifact vs dark app).
    const mm = root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)");
    const theme = document.documentElement.dataset.theme || (mm && mm.matches ? "dark" : "light");

    // Load the artifact with data-theme already on <html> at PARSE time. Toggling
    // data-theme after the doc has painted hits a Chromium bug where a descendant's
    // var(--token) used-value doesn't re-resolve (the root property updates, the
    // element keeps the stale value) — so every themed token reads as a false
    // mismatch. Pre-injecting via srcdoc sidesteps it. Artifacts reference only
    // absolute assets (Google Fonts), so the about:srcdoc base URL is harmless.
    let html = null;
    try { html = await (await fetch(artifactUrl)).text(); } catch (e) {}

    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;left:-10000px;top:0;width:375px;height:900px;border:0";
    document.body.appendChild(frame);
    await new Promise((res) => {
      frame.onload = res;
      if (html) {
        frame.srcdoc = html.replace(/<html([^>]*)>/i,
          (m, attrs) => "<html" + attrs.replace(/\sdata-theme=(['"]).*?\1/i, "") + ' data-theme="' + theme + '">');
      } else {
        frame.src = artifactUrl; // fallback (fetch blocked); theme set post-load below
      }
    });

    const idoc = frame.contentDocument;
    if (!html) idoc.documentElement.setAttribute("data-theme", theme);
    // let the artifact's own inline script settle into its final state (sheets slide in, etc.)
    if (opts.artifactPrep) opts.artifactPrep(idoc);
    try { await idoc.fonts.ready; } catch (e) {}
    await new Promise((r) => setTimeout(r, opts.settle || 500));
    // Prep-mutated states start CSS transitions that a throttled/offscreen iframe may
    // never advance, freezing computed values at their FROM state (a false diff on every
    // transitioned property). Jump all running animations/transitions to their end state.
    // (Infinite animations — audio bars — throw on finish(); skipping them is correct.)
    try { idoc.getAnimations({ subtree: true }).forEach((a) => { try { a.finish(); } catch (_) {} }); } catch (_) {}
    await new Promise((r) => setTimeout(r, 60));

    const rows = [];
    for (const [aSel, bSel] of pairs) {
      const a = idoc.querySelector(aSel);
      const b = document.querySelector(bSel);
      if (!a || !b) { rows.push({ pair: aSel + "  ->  " + bSel, MISSING: !a ? "artifact" : "app" }); continue; }
      const ca = getComputedStyle(a), cb = getComputedStyle(b);
      for (const p of props) {
        const va = ca.getPropertyValue(p).trim();
        const vb = cb.getPropertyValue(p).trim();
        if (va !== vb) rows.push({ element: aSel + "  ->  " + bSel, prop: p, artifact: va, app: vb });
      }
    }
    frame.remove();

    if (rows.length && console.table) console.table(rows);
    else if (!rows.length) console.log("design-diff: no mismatches for " + artifactUrl);
    return rows;
  }

  // Selector registry: artifact selector -> app selector, per artifact.
  const DESIGN_PAIRS = {
    // SUPERSEDED 2026-07-19: correct-feedback.html is do-not-build-against; the resolution frame
    // (design/resolution-frame.html) is the match target for correct-answer feedback.
    // App state: a correct answer resolved — .build-answer.fused or .res-grown.show in the DOM.
    resolutionFrame: [
      [".answer-row.fused .tile", ".build-answer.fused .word"],
      [".answer-row .sweep", ".build-answer .sweep"],
      [".tray.recede", ".bank.recede"],
      [".grown", ".res-grown"],
      [".en-line", ".res-en"],
      [".es-reveal", ".es-reveal"],
      [".sring", ".q-sring"],
      [".stick", ".stick"],
      [".inputbox.wash", "#qbody.qcorrect .text-input"],
    ],
    // App state: renderHome() with a seeded returning-user state (serve via tools/serve.py so JS is fresh).
    home: [
      [".wordmark .wm", ".topbar-brand .wordmark"],
      [".flame", ".stat.streak"],
      [".lang", ".lang-flag-top"],
      [".trip .dest", ".trip .dest"],
      [".trip .sub", ".trip .sub"],
      [".band", ".band-chip"],
      [".tile.fade .k", ".hero-tile .hero-k"],
      [".tile.fade .t", ".hero-tile .hero-title"],
      [".tile.fade .s", ".hero-tile .hero-sub"],
      [".practice", ".practice"],
      [".practice .ic", ".practice .ic"],
      [".practice .lbl", ".practice .lbl"],
      [".practice .chev", ".practice .chev"],
      [".whisper", ".whisper"],
      [".whisper .spark", ".whisper .spark"],
      [".whisper .num", ".whisper .num"],
      [".presence", ".presence"],
    ],
    // App state: any audioControl(_, {speed:true}) mounted in the DOM (e.g. a listening exercise,
    // or inject one). Same class names in artifact and app, so selectors match 1:1.
    audioControl: [
      [".ac-speaker", ".ac-speaker"],
      [".ac-bars", ".ac-bars"],
      [".ac-bars span", ".ac-bars span"],
      [".ac-speed", ".ac-speed"],
    ],
    // App state: renderPresent() in #qbody. Chunked variant = the artifact's default layout; the short
    // variant's .phrase-solo/.context map to .present-es/.present-ctx (switch the artifact with switchVariant()).
    presentationCard: [
      [".new-label", ".present-label"],
      [".chunk", ".chunk-pill"],
      [".chunk.new-piece", ".chunk-pill.new"],
      [".chunk.new-piece .tag", ".chunk-pill.new .cp-tag"],
      [".translation", ".present-card.chunked .present-en"],
      [".ac-speaker", ".present-audio .ac-speaker"],
      [".audio-hint", ".present-audio .audio-hint"],
      [".anchor", ".present-anchor"],
      [".anchor .lead", ".present-anchor .lead"],
      [".popover", ".present-pop"],
      // short variant (render an item with < 3 words):
      [".phrase-solo", ".present-es"],
      [".context", ".present-ctx"],
      [".context .es", ".present-ctx .es"],
    ],
    // App state: harness story "Exercise — pairs" with one pair matched (tap audio 0 + en 0).
    // Prep drives the artifact's first pair to matched so settle states compare fairly.
    pairsExercise: [
      [".card", ".pcard"],
      [".card.audio .glyph", ".pcard .pc-glyph"],
      [".card .bars", ".pcard .pbars"],
      [".card .bars span", ".pcard .pbars span"],
      [".card.matched", ".pcard.matched"],
      [".card.matched .es-word", ".pcard.matched .es-word"],
      [".grown", ".res-grown.pairs-grown"],
      [".allset", ".pairs-allset"],
      [".cont", ".res-cont"],
    ],
    // App state: harness story "Exercise — the close (core phrase)", answer typed + resolved.
    theClose: [
      [".close-kicker", ".close-kicker"],
      [".prompt", ".close-prompt"],
      [".swap-line", ".swap-line"],
      [".inputbox", ".tiwrap .text-input"],
      [".inputbox .sweep", ".tiwrap .sweep3"],
      [".grown", ".res-grown"],
      [".kicker-row .txt", ".res-yours"],
      [".en-line", ".res-en"],
      [".audio-row", ".res-audio-row"],
      [".audio-hint", ".res-audio-row .audio-hint"],
      [".note", ".res-note"],
      [".cont", ".res-cont"],
      [".sring", ".q-sring"],
    ],
    // App state: per variant — sound choice (default), audio cloze, ear build, the reply
    // (cycle the artifact with cycleState(); map the shared pieces).
    exerciseVariants: [
      [".sentence .blank", ".sc-blank"],
      [".audio-card", ".audio-opts .pcard"],
      [".audio-card .glyph", ".audio-opts .pcard .pc-glyph"],
      [".audio-card.settled", ".pcard.settled"],
      [".bigspk .hint", ".bigspk .audio-hint"],
      [".inputbox", ".text-input"],
      [".answer-row .tile", ".build-answer .word"],
      [".tray", ".bank"],
      [".bubble", ".bubble"],
      [".bubble .who", ".bubble .who"],
      [".bubble .line", ".bubble .line"],
      [".bubble .en-gloss", ".bubble .en-gloss"],
      [".opts .opt", ".choices .choice"],
      [".grown .en-line", ".res-en"],
    ],
    // App state: "Home — returning user" with a seeded 12+ due queue (urgent) — prep drives
    // the artifact to the urgent stack state. Supersedes the home.html-era pairs for the stack.
    homeActionStack: [
      [".tile.fade", ".hero-tile"],
      [".tile.fade .inner", ".hero-tile .hero-inner"],
      [".tile.fade .k", ".hero-k"],
      [".tile.fade .t", ".hero-title"],
      [".tile.fade .s", ".hero-sub"],
      [".practice", ".practice"],
      [".practice .ic", ".practice .ic"],
      [".practice .lbl", ".practice .lbl"],
      [".pbadge", ".pbadge"],
    ],
    // App state: harness story "Session end — full ceremony", ~3s in (dials performed).
    // Artifact state: Option C/D overlay (renderOverlay) — its .kicker/.facts are the designed elements.
    sessionEnd: [
      [".cer-kicker .kicker", ".cer-layer .cer-kicker"],
      [".facts", ".sfacts"],
      [".fact", ".sfact"],
      [".fact .n", ".sfact .sf-n"],
      [".fact .glyph", ".sfact .sf-glyph"],
      [".side .lbl", ".ring-card .ring-label"],
      [".side .sdelta", ".ring-card .dial-delta"],
      [".delta-whisper", ".delta-whisper"],
      [".cont", ".cer-cont"],
    ],
    // App state: showCorrection() open — .corr-wrap.show in the DOM.
    correctionSheet: [
      [".scrim", ".corr-scrim"],
      [".sheet", ".corr-sheet"],
      [".grabber", ".corr-grab"],
      [".wrong", ".corr-wrong"],
      [".sheet-label", ".corr-label"],
      [".chunks", ".corr-chunks"],
      [".chunk", ".corr-chunk"],
      [".chunk.error", ".corr-chunk.error"],
      [".audio-btn", ".corr-audio"],
      [".translation", ".corr-trans"],
      [".anchor", ".corr-anchor"],
      [".continue", ".corr-continue"],
    ],
  };

  // artifactPrep helpers for states the artifact's own markup doesn't start in.
  const DESIGN_PREP = {
    correctFeedback: (idoc) => {
      const i = idoc.querySelector(".ex-input"); if (i) i.classList.add("correct");
      const t = idoc.querySelector(".tick"); if (t) t.classList.add("show"); // shown state, for a fair opacity check
    },
    correctionSheet: (idoc) => { const p = idoc.querySelector(".phone"); if (p) p.classList.add("dimmed"); },
    // drive the stack to its urgent state (the richest comparison surface). Class-based:
    // the artifact's stackState is a top-level `let` (not reachable via defaultView).
    homeActionStack: (idoc) => {
      const pr = idoc.querySelector(".practice");
      if (pr && !pr.classList.contains("urgent")) {
        pr.classList.add("urgent");
        const chev = pr.querySelector(".chev");
        const badge = idoc.createElement("span");
        badge.className = "pbadge"; badge.textContent = "12 fading";
        pr.insertBefore(badge, chev);
      }
    },
    // settle the whole board + show the grown, matching an app board completed with no misses
    pairsExercise: (idoc) => {
      const w = idoc.defaultView;
      idoc.querySelectorAll(".card").forEach(c => {
        c.classList.add("matched");
        if (c.classList.contains("audio") && !c.querySelector(".es-word")) {
          const idx = +c.dataset.idx;
          const es = (w && w.items && w.items[idx]) ? w.items[idx].es : "la cuenta";
          const span = idoc.createElement("span"); span.className = "es-word"; span.textContent = es;
          c.insertBefore(span, c.querySelector(".bars"));
        }
      });
      const g = idoc.querySelector(".grown"); if (g) g.classList.add("show");
    },
    // resolved step-1 state: typed answer, wash, grown shown
    theClose: (idoc) => {
      const b = idoc.querySelector(".inputbox"); if (b) b.classList.add("wash");
      const t = idoc.getElementById("typed"); if (t) t.textContent = "¿Me puede traer la cuenta?";
      const c = idoc.getElementById("cursor"); if (c) c.style.display = "none";
      const g = idoc.querySelector(".grown"); if (g) g.classList.add("show");
    },
    // default state = sound choice, resolved (settled card, filled blank, grown shown)
    exerciseVariants: (idoc) => {
      const a = idoc.getElementById("optA"); if (a) a.classList.add("settled");
      const b = idoc.getElementById("blank"); if (b) { b.textContent = "cuenta"; b.classList.add("filled"); }
      idoc.querySelectorAll(".grown").forEach(g => g.classList.add("show"));
    },
  };

  root.designDiff = designDiff;
  root.DESIGN_PAIRS = DESIGN_PAIRS;
  root.DESIGN_PREP = DESIGN_PREP;
})(typeof window !== "undefined" ? window : globalThis);
