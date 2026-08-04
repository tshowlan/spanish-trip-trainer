// Regenerate the pack's artifact-shell.html from the template + CURRENT styles.css.
// Anti-drift rule 1: the shell is issued, not assembled — fonts, frame, field, and the live
// stylesheet arrive already correct in every design session. Run by refresh-context-pack.sh.
import { readFileSync, writeFileSync } from "fs";
const tpl = readFileSync("design/artifact-shell-template.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const today = new Date().toISOString().slice(0, 10);
const out = tpl.replace("/*__LIVE_CSS__*/", () => css).replace("__SYNCED__", today);
const dest = "/Users/thomashowland/Desktop/Projects/Tripfluent/chat-design-pack/artifact-shell.html";
writeFileSync(dest, out);
console.log("artifact-shell.html generated:", out.length, "bytes ->", dest);
