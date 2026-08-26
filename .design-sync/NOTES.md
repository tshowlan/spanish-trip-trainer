# design-sync notes — Tripfluent

- Tripfluent is a vanilla-JS PWA with a CSS design system (tokens in styles.css :root,
  self-hosted fonts via fonts.css, stamped HTML artifacts in design/). There are no React
  components and no build, so the standard converter does not apply.
- The bundle is assembled by hand into ds-bundle/: styles.css (import root) -> tokens + the
  app's real styles.css copy + fonts.css copy; fonts/ woff2 copies; guidelines/ carries the
  design constitution; components/ are PATTERN CARDS (static HTML previews + prompt.md with
  the real class vocabulary), not compiled components. No _ds_bundle.js, no _ds_sync.json
  (un-anchored is the honest state; a re-sync re-verifies everything).
- Verification = each card rendered in the browser pane against the live app's look.
- The app's dark theme rides prefers-color-scheme + [data-theme="dark"]; cards default light.
