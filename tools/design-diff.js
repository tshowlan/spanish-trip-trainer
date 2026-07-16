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
    // App state: a correct answer rendered — #qbody has .qcorrect, .answer-tick.show present.
    // artifactPrep adds .correct to the artifact input so the wash overrides compute.
    correctFeedback: [
      [".progress", ".pbar"],
      [".progress > div", ".pbar > i"],
      [".tick", ".answer-tick"],
      [".ex-input.correct", "#qbody.qcorrect .text-input"],
    ],
    // App state: any audioControl(_, {speed:true}) mounted in the DOM (e.g. a listening exercise,
    // or inject one). Same class names in artifact and app, so selectors match 1:1.
    audioControl: [
      [".ac-speaker", ".ac-speaker"],
      [".ac-bars", ".ac-bars"],
      [".ac-bars span", ".ac-bars span"],
      [".ac-speed", ".ac-speed"],
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
      [".chunk.known", ".corr-chunk.known"],
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
  };

  root.designDiff = designDiff;
  root.DESIGN_PAIRS = DESIGN_PAIRS;
  root.DESIGN_PREP = DESIGN_PREP;
})(typeof window !== "undefined" ? window : globalThis);
