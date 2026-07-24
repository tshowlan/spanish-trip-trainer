#!/usr/bin/env bash
# Refresh design/context-pack/ — the folder Tom drags into a chat design session.
# Contents: the constitution + every base template + live styles.css (+ a README).
# Run as the last step of the handoff ritual (design-system §5.10).
set -euo pipefail
cd "$(dirname "$0")/.."

PACK="design/context-pack"
mkdir -p "$PACK"
rm -f "$PACK"/*.md "$PACK"/*.html "$PACK"/*.css

cp docs/design-constitution.md "$PACK/"
cp styles.css "$PACK/"
for f in design/*-base.html; do
  [ -e "$f" ] && cp "$f" "$PACK/"
done

cat > "$PACK/README.md" <<EOF
# Tripfluent design context pack

Drag these files into the top of any chat design session so chat works from
current truth instead of memory:

- design-constitution.md — every stamped law, by family, with minting examples
- *-base.html — the template family (derivation sources; new artifacts derive
  from a base and cite its version)
- styles.css — LIVE tokens and component styles (always wins over artifact
  token blocks)

Plus, if the session touches an existing surface: that surface's current
artifact from design/.

Refreshed by tools/refresh-context-pack.sh on $(date +%Y-%m-%d) — do not edit
these copies by hand; edit the sources and re-run the script.
EOF

echo "context-pack refreshed:"
ls -1 "$PACK"
